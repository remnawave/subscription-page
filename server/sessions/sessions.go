package sessions

import (
	"fmt"
	"math/rand"
	"time"
)

var validSessions = make(map[string]time.Time)

func CreateSession(shortID string) string {
	sessionID := generateSessionID()
	validSessions[sessionID] = time.Now().Add(2 * time.Hour)
	return sessionID
}

func IsValidSession(sessionID string) bool {
	expiryTime, exists := validSessions[sessionID]
	if !exists {
		return false
	}

	if time.Now().After(expiryTime) {
		delete(validSessions, sessionID)
		return false
	}

	return true
}
func generateSessionID() string {
	return fmt.Sprintf("%d%d", time.Now().UnixNano(), rand.Intn(1000000))
} 