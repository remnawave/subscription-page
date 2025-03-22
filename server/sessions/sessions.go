package sessions

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

var (
	validSessions = make(map[string]time.Time)
	mu            sync.Mutex 
)

func init() {
	go cleanupSessions()
}

func cleanupSessions() {
	ticker := time.NewTicker(30 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		removeExpiredSessions()
	}
}

func removeExpiredSessions() {
	mu.Lock()
	defer mu.Unlock()

	now := time.Now()
	for sessionID, expiryTime := range validSessions {
		if now.After(expiryTime) {
			delete(validSessions, sessionID)
		}
	}
}

func CreateSession(shortID string) string {
	sessionID := generateSessionID()
	
	mu.Lock()
	validSessions[sessionID] = time.Now().Add(2 * time.Hour)
	mu.Unlock()
	
	return sessionID
}

func IsValidSession(sessionID string) bool {
	mu.Lock()
	defer mu.Unlock()
	
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
