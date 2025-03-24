package handlers

import (
	"log/slog"
	"strings"
	"subscription-page-template/server/api"
	"subscription-page-template/server/config"
	"subscription-page-template/server/marzban"
	"subscription-page-template/server/sessions"
	"subscription-page-template/server/utils"

	"time"

	"github.com/gofiber/fiber/v3"
)

type SubscriptionHandler struct {
	apiClient *api.Client
}

func NewSubscriptionHandler(apiClient *api.Client) *SubscriptionHandler {
	return &SubscriptionHandler{
		apiClient: apiClient,
	}
}

func (h *SubscriptionHandler) HandleSubscription(c fiber.Ctx) error {
	shortId := c.Params("shortId")

	
	if(config.IsMarzbanLegacyLinkEnabled()) {
		res := marzban.VerifyMarzbanLink(shortId)

		if res != nil {
			username := ""
			username = res.Username
			slog.Info("Decoded Marzban Link", "res", res)

			user, err := h.apiClient.GetUserByUsernameJSON(utils.SanitizeUsername(username))
			if err != nil {
				slog.Error("Error fetching user", "error", err)
				return c.Status(fiber.StatusInternalServerError).SendString("Backend returned unexpected error.")
			}

		shortId = user.ShortUUID
		}

		if res == nil {
			slog.Info("Decoding Marzban Link failed, trying to get subscription by shortId", "shortId", shortId)
		}
	}




	if shortId == "" {
		return c.Status(fiber.StatusBadRequest).SendString("Bad request.")
	}

	headers := make(map[string][]string)
	c.Request().Header.VisitAll(func(key, value []byte) {
		headers[string(key)] = append(headers[string(key)], string(value))
	})

	clientType := c.Locals("clientType")
	var clientTypeStr string
	if clientType != nil {
		clientTypeStr = clientType.(string)
	}
	
	resp, err := h.apiClient.FetchAPI(shortId, headers, clientTypeStr)
	
	if err != nil {
		slog.Error("Error fetching API", "error", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Request error.")
	}

	userAgent := c.Get("User-Agent")
	isBrowser := utils.IsBrowser(userAgent)

	if resp.StatusCode == fiber.StatusNotFound {
		slog.Error("Subscription not found", "shortId", shortId)
		slog.Error("Server response", "response", resp.String())
		return c.Drop()
	}
	

	if resp.StatusCode != fiber.StatusOK {
		return c.Render("index", fiber.Map{
			"Data": string("Request error."),
		})
	}

	body := resp.Bytes()
	
	if isBrowser {
		sessionID := sessions.CreateSession(shortId)
		
		c.Cookie(&fiber.Cookie{
			Name:     "session",
			Value:    sessionID,
			Expires:  time.Now().Add(2 * time.Hour),
			Path:     "/",
			HTTPOnly: true,
		})

		metaTitle := config.GetMetaTitle()
		metaDescription := config.GetMetaDescription()
		
		return c.Render("index", fiber.Map{
			"Data": utils.Base64UrlSafeEncode(string(body)),
			"MetaTitle": metaTitle,
			"MetaDescription": metaDescription,
		})
	}
	
	filteredHeaders := []string{
		"Profile-Title",
		"Profile-Update-Interval",
		"Subscription-Userinfo",
		"Profile-Web-Page-Url",
		"Content-Disposition",
		"Content-Type",
		"Support-Url",
		"Routing",
		"Announce",
	}

	for _, header := range filteredHeaders {
		if values, found := resp.Header[header]; found {
			c.Set(header, strings.Join(values, ","))
		}
	}
	
	return c.Status(resp.StatusCode).Send(body)
}
