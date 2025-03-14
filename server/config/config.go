package config

import (
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

var (
	port                 string
	remnawavePlainDomain string
	host                 string
	isMarzbanLegacyLinkEnabled bool
	legacyMarzbanSecretKey string
	remnawaveApiToken string
	customSubPrefix string
	logLevel string
	requestRemnawaveScheme string
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
		slog.Error("REMNAWAVE_PLAIN_DOMAIN is required, fallback to example.com")
		remnawavePlainDomain = "example.com"
	}

	legacyLinkSetting := os.Getenv("MARZBAN_LEGACY_LINK_ENABLED")
	if legacyLinkSetting == "" {
		isMarzbanLegacyLinkEnabled = false
	} else {
		isMarzbanLegacyLinkEnabled = legacyLinkSetting == "true"
	}
	
	if isMarzbanLegacyLinkEnabled {
		legacyMarzbanSecretKey = os.Getenv("MARZBAN_LEGACY_SECRET_KEY")
		if legacyMarzbanSecretKey == "" {
			slog.Error("MARZBAN_LEGACY_SECRET_KEY is required when MARZBAN_LEGACY_LINK_ENABLED is true")
		}

		remnawaveApiToken = os.Getenv("REMNAWAVE_API_TOKEN")
		if remnawaveApiToken == "" {
			slog.Error("REMNAWAVE_API_TOKEN is required when MARZBAN_LEGACY_LINK_ENABLED is true")
		}
	}

	customSubPrefix = os.Getenv("CUSTOM_SUB_PREFIX")

	logLevel := os.Getenv("LOG_LEVEL")
	if logLevel == "" {
		logLevel = "INFO"
	}

	requestRemnawaveScheme = os.Getenv("REQUEST_REMNAWAVE_SCHEME")
	if requestRemnawaveScheme == "" {
		requestRemnawaveScheme = "https"
	} else if requestRemnawaveScheme != "http" && requestRemnawaveScheme != "https" {
		slog.Error("REQUEST_REMNAWAVE_SCHEME must be either http or https")
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

func IsMarzbanLegacyLinkEnabled() bool {
	return isMarzbanLegacyLinkEnabled
}

func GetLegacyMarzbanSecretKey() string {
	return legacyMarzbanSecretKey
}

func GetRemnawaveApiToken() string {
	return remnawaveApiToken
}

func GetCustomSubPrefix() string {
	return customSubPrefix
}

func GetLogLevel() string {
	return logLevel
}

func GetRequestRemnawaveScheme() string {
	return requestRemnawaveScheme
}
