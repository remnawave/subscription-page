package api

import (
	"time"
)

type UserResponse struct {
	Response User `json:"response"`
}

type User struct {
	UUID                    string     `json:"uuid"`
	SubscriptionUUID        string     `json:"subscriptionUuid"`
	ShortUUID               string     `json:"shortUuid"`
	Username                string     `json:"username"`
	Status                  string     `json:"status"`
	UsedTrafficBytes        int64      `json:"usedTrafficBytes"`
	LifetimeUsedTrafficBytes int64     `json:"lifetimeUsedTrafficBytes"`
	TrafficLimitBytes       int64      `json:"trafficLimitBytes"`
	TrafficLimitStrategy    string     `json:"trafficLimitStrategy"`
	SubLastUserAgent        string     `json:"subLastUserAgent"`
	SubLastOpenedAt         time.Time  `json:"subLastOpenedAt"`
	ExpireAt                time.Time  `json:"expireAt"`
	OnlineAt                time.Time  `json:"onlineAt"`
	SubRevokedAt            time.Time  `json:"subRevokedAt"`
	LastTrafficResetAt      time.Time  `json:"lastTrafficResetAt"`
	TrojanPassword          string     `json:"trojanPassword"`
	VlessUUID               string     `json:"vlessUuid"`
	SsPassword              string     `json:"ssPassword"`
	Description             string     `json:"description"`
	TelegramID              int        `json:"telegramId"`
	Email                   string     `json:"email"`
	CreatedAt               time.Time  `json:"createdAt"`
	UpdatedAt               time.Time  `json:"updatedAt"`
	ActiveUserInbounds      []Inbound  `json:"activeUserInbounds"`
	SubscriptionURL         string     `json:"subscriptionUrl"`
	LastConnectedNode       *NodeInfo  `json:"lastConnectedNode"`
}

type Inbound struct {
	UUID string `json:"uuid"`
	Tag  string `json:"tag"`
	Type string `json:"type"`
}

type NodeInfo struct {
	ConnectedAt time.Time `json:"connectedAt"`
	NodeName    string    `json:"nodeName"`
}