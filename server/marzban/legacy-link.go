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
	slog.Info("token", "token", token)
	slog.Info("secretKey", "secretKey", getSecretKey())

	
	if len(token) < 10 {
		return nil
	}

	uToken := token[:len(token)-10]
	uSignature := token[len(token)-10:]

	mod := len(uToken) % 4
	if mod != 0 {
		uToken += strings.Repeat("=", 4-mod)
	}

	decoded, err := base64.URLEncoding.DecodeString(uToken)
	if err != nil {
		return nil
	}
	uTokenDecStr := string(decoded)

	hash := sha256.New()
	hash.Write([]byte(uToken + getSecretKey()))
	digest := hash.Sum(nil)
	expectedSignature := base64.URLEncoding.EncodeToString(digest)[:10]

	if uSignature != expectedSignature {
		return nil
	}

	parts := strings.Split(uTokenDecStr, ",")
	if len(parts) < 2 {
		return nil
	}
	username := parts[0]
	createdAtInt, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil {
		return nil
	}

	createdAt := time.Unix(createdAtInt, 0).UTC()

	return &User{
		Username:  username,
		CreatedAt: createdAt,
	}
}