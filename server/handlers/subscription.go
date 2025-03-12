package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"

	"subscription-page-template/server/api"
	"subscription-page-template/server/utils"
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
	path := c.Params("*")
	userAgent := c.Get("User-Agent")
	
	headers := make(map[string][]string)
	c.Request().Header.VisitAll(func(key, value []byte) {
		headers[string(key)] = append(headers[string(key)], string(value))
	})
	
	isBrowser := utils.IsBrowser(userAgent)
	
	resp, err := h.apiClient.FetchAPI(path, headers, isBrowser)
	if err != nil {
		fmt.Println("Error fetching API:", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Request error.")
	}
	

	processedBody := resp.Bytes()
	
	if isBrowser {
		return c.Render("./dist/index.html", fiber.Map{
			"Data": string(processedBody),
		})
	}
	
	for name, values := range resp.Header {
		for _, value := range values {
			c.Set(name, value)
		}
	}
	
	return c.Status(resp.StatusCode).Send(processedBody)
} 