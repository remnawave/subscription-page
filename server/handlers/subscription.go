package handlers

import (
	"fmt"
	"io"
	"strings"

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
	
	resp, err := h.apiClient.FetchAPI(path, headers)
	if err != nil {
		fmt.Println("Error fetching API:", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Request error.")
	}
	defer resp.Body.Close()
	
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Read response error.")
	}
	
	contentEncoding := resp.Header.Get("Content-Encoding")
	
	var processedBody []byte
	switch {
	case strings.Contains(contentEncoding, "gzip"):
		if decompressed, err := utils.DecompressGzip(bodyBytes); err == nil {
			processedBody = decompressed
		} else {
			processedBody = bodyBytes
		}
	case strings.Contains(contentEncoding, "zstd"):
		if decompressed, err := utils.DecompressZstd(bodyBytes); err == nil {
			processedBody = decompressed
		} else {
			processedBody = bodyBytes
		}
	default:
		processedBody = bodyBytes
	}
	
	if utils.IsBrowser(userAgent) {
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