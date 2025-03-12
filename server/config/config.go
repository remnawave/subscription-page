package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port              string
	RemnawavePlainDomain string
}

func LoadConfig() (*Config, error) {
	_ = godotenv.Load()

	port := os.Getenv("SUBSCRIPTION_PAGE_PORT")
	if port == "" {
		port = "3010"
	}

	domain := os.Getenv("REMNAWAVE_PLAIN_DOMAIN")
	if domain == "" {
		return nil, nil
	}

	return &Config{
		Port:              port,
		RemnawavePlainDomain: domain,
	}, nil
} 
