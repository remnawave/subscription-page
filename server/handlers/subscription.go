package handlers

import (
	"log/slog"
	"strings"
	"subscription-page-template/server/api"
	"subscription-page-template/server/utils"

	"github.com/gofiber/fiber/v2"
)

type SubscriptionHandler struct {
	apiClient *api.Client
}

func NewSubscriptionHandler(apiClient *api.Client) *SubscriptionHandler {
	return &SubscriptionHandler{
		apiClient: apiClient,
	}
}

func (h *SubscriptionHandler) HandleSubscription(c *fiber.Ctx) error {
	shortId := c.Params("shortId")



	if shortId == "" {
		return c.Status(fiber.StatusBadRequest).SendString("Bad request.")
	}

	headers := make(map[string][]string)
	c.Request().Header.VisitAll(func(key, value []byte) {
		headers[string(key)] = append(headers[string(key)], string(value))
	})

	resp, err := h.apiClient.FetchAPI(shortId, headers, c.Locals("isJson").(bool))

	if err != nil {
		slog.Error("Error fetching API", "error", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Request error.")
	}

	userAgent := c.Get("User-Agent")
	isBrowser := utils.IsBrowser(userAgent)

	if resp.StatusCode == fiber.StatusNotFound {
		return c.Status(fiber.StatusNotFound).SendString("Subscription not found.")
	}
	

	if resp.StatusCode != fiber.StatusOK {
		return c.Render("./dist/index.html", fiber.Map{
			"Data": string("Request error."),
		})
	}

	body := resp.Bytes()
	
	if isBrowser {
		return c.Render("./dist/index.html", fiber.Map{
			"Data": string(body),
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
