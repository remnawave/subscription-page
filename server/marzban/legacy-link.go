package marzban

import (
	"crypto/sha256"
	"encoding/base64"
	"log/slog"
	"strconv"
	"strings"
	"subscription-page-template/server/config"
	"time"
)

type User struct {
	Username  string
	CreatedAt time.Time
}

func getSecretKey() string {
	return config.GetLegacyMarzbanSecretKey()
}

func VerifyMarzbanLink(token string) *User {
	slog.Debug("Verifying token", "token", token)
	
	if len(token) < 10 {
		slog.Debug("Token too short")
		return nil
	}

	uToken := token[:len(token)-10]
	uSignature := token[len(token)-10:]
	
	slog.Debug("Token parts", "base", uToken, "signature", uSignature)

	decoded, err := base64.RawURLEncoding.DecodeString(uToken)
	if err != nil {
		slog.Debug("Base64 decode error", "error", err)
		return nil
	}
	uTokenDecStr := string(decoded)

	hash := sha256.New()
	hash.Write([]byte(uToken + getSecretKey()))
	digest := hash.Sum(nil)
	
	expectedSignature := base64.RawURLEncoding.EncodeToString(digest)[:10]

	slog.Debug("Expected signature", "expected", expectedSignature, "actual", uSignature)
	
	if uSignature != expectedSignature {
		slog.Debug("Signature mismatch")
		return nil
	}

	parts := strings.Split(uTokenDecStr, ",")
	if len(parts) < 2 {
		slog.Debug("Invalid token format", "decoded", uTokenDecStr)
		return nil
	}
	username := parts[0]
	createdAtInt, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil {
		slog.Debug("Invalid created_at timestamp", "error", err, "value", parts[1])
		return nil
	}

	createdAt := time.Unix(createdAtInt, 0).UTC()

	slog.Debug("Token decoded", "username", username, "createdAt", createdAt)

	return &User{
		Username:  username,
		CreatedAt: createdAt,
	}
}