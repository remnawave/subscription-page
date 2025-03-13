package config

import (
	"os"

	"github.com/joho/godotenv"
)

var (
	port                 string
	remnawavePlainDomain string
	host                 string
)

func LoadConfig() error {
	_ = godotenv.Load()

	port = os.Getenv("SUBSCRIPTION_PAGE_PORT")
	if port == "" {
		port = "3010"
	}

	host = os.Getenv("SUBSCRIPTION_PAGE_HOST")
	if host == "" {
		host = "localhost"
	}

	remnawavePlainDomain = os.Getenv("REMNAWAVE_PLAIN_DOMAIN")
	if remnawavePlainDomain == "" {
		return nil
	}

	return nil
}

func GetPort() string {
	return port
}

func GetHost() string {
	return host
}

func GetRemnawavePlainDomain() string {
	return remnawavePlainDomain
}
