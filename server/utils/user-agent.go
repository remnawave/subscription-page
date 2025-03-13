package utils

import (
	"strings"
)

var browserKeywords = [...]string{"Mozilla", "Chrome", "Safari", "Firefox", "Opera", "Edge", "TelegramBot"}

func IsBrowser(userAgent string) bool {
	for _, keyword := range browserKeywords {
		if strings.Contains(userAgent, keyword) {
			return true
		}
	}
	return false
}
