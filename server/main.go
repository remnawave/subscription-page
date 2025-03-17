package main

import (
	"log/slog"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2/middleware/compress"

	"github.com/gofiber/fiber/v2"

	"subscription-page-template/server/api"
	"subscription-page-template/server/config"
	"subscription-page-template/server/handlers"
)

func main() {
	logLevel := os.Getenv("LOG_LEVEL")
    if logLevel == "" {
        logLevel = "INFO"
    }
    
    var level slog.Level
    switch strings.ToUpper(logLevel) {
    case "DEBUG":
        level = slog.LevelDebug
    case "INFO":
        level = slog.LevelInfo
    case "WARN":
        level = slog.LevelWarn
    case "ERROR":
        level = slog.LevelError
    default:
        level = slog.LevelInfo
    }
    
    logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
        Level: level,
    }))
    slog.SetDefault(logger)
    
    slog.Info("Logger initialized", "level", logLevel)


	err := config.LoadConfig()
	if err != nil {
		slog.Error("Failed to load config", "err", err)
		os.Exit(1)
	}



	app := fiber.New(fiber.Config{
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  11 * time.Second,
	})

	app.Use(compress.New())
	app.Use(httpsAndProxyMiddleware())

	app.Static("/assets", "./dist/assets")
	app.Static("/locales", "./dist/locales")

	apiClient := api.NewClient(config.GetRemnawavePlainDomain(), config.GetRemnawaveApiToken(), config.GetRequestRemnawaveScheme())

	subscriptionHandler := handlers.NewSubscriptionHandler(apiClient)

	var routePrefix string
	if prefix := config.GetCustomSubPrefix(); prefix != "" {
		routePrefix = "/" + prefix
	} else {
		routePrefix = ""
	}

	routes := app.Group(routePrefix)

	clientTypes := []string{"json", "stash", "singbox", "singbox-legacy", "mihomo", "clash"}
	for _, t := range clientTypes {
		clientType := t
		routes.Get("/:shortId/" + clientType, func(c *fiber.Ctx) error {
			c.Locals("clientType", clientType)
			return subscriptionHandler.HandleSubscription(c)
		})
	}

	routes.Get("/:shortId", func(c *fiber.Ctx) error {
		return subscriptionHandler.HandleSubscription(c)
	})

	slog.Info("Starting server", "port", config.GetPort())
	if err := app.Listen(":" + config.GetPort()); err != nil {
		slog.Error("Failed to start server", "error", err)
		os.Exit(1)
	}
}

func httpsAndProxyMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if config.GetHost() == "localhost" {
			return c.Next()
		}

		xForwardedFor := c.Get("X-Forwarded-For")
		xForwardedProto := c.Get("X-Forwarded-Proto")

		if xForwardedFor == "" || xForwardedProto != "https" {
			slog.Error("Reverse proxy and HTTPS are required.")
			return c.Status(fiber.StatusForbidden).SendString("Reverse proxy and HTTPS are required")
		}

		return c.Next()
	}
}