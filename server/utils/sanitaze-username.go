package utils

import (
	"regexp"
	"strings"
)

// Reference: https://github.com/remnawave/migrate/blob/main/marzban/util/username_sanitizer.go

func SanitizeUsername(username string) string {
	// Define regex pattern for valid characters
	validPattern := regexp.MustCompile(`^[a-zA-Z0-9_-]+$`)

	// Create a new string builder
	var sanitized strings.Builder

	// Keep only valid characters
	for _, char := range username {
		if validPattern.MatchString(string(char)) {
			sanitized.WriteRune(char)
		} else {
			// Replace invalid characters with underscore
			sanitized.WriteRune('_')
		}
	}

	// Get the sanitized username
	result := sanitized.String()

	// Ensure minimum length of 6 characters
	if len(result) < 6 {
		result = result + strings.Repeat("_", 6-len(result))
	}

	return result
}