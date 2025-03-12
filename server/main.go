package main

import (
	"log"

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
		log.Fatal("Configuration is not properly set")
	}

	app := fiber.New()
	
	app.Static("/assets", "./dist/assets")
	app.Static("/locales", "./dist/locales")

	apiClient := api.NewClient(cfg.RemnawavePlainDomain)
	
	subscriptionHandler := handlers.NewSubscriptionHandler(apiClient)
	
	app.Get("/s/*", subscriptionHandler.HandleSubscription)

	log.Fatal(app.Listen(":" + cfg.Port))
}