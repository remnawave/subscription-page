package main

import (
	"log"
	"log/slog"
	"os"
	"time"

	"github.com/gofiber/fiber/v2/middleware/compress"

	"github.com/gofiber/fiber/v2"

	"subscription-page-template/server/api"
	"subscription-page-template/server/config"
	"subscription-page-template/server/handlers"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	if cfg == nil {
		slog.Error("Configuration is not properly set")
		os.Exit(1)
	}

	app := fiber.New(fiber.Config{
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  30 * time.Second,
	})

	app.Use(compress.New())

	app.Static("/assets", "./dist/assets")
	app.Static("/locales", "./dist/locales")

	apiClient := api.NewClient(cfg.RemnawavePlainDomain)

	subscriptionHandler := handlers.NewSubscriptionHandler(apiClient)

	app.Get("/:shortId", subscriptionHandler.HandleSubscription)

	slog.Info("Starting server", "port", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		slog.Error("Failed to start server", "error", err)
		os.Exit(1)
	}
}
