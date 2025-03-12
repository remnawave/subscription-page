package api

import (
	"fmt"
	"log/slog"
	"net/http"
)

type Client struct {
	domain string
	client *http.Client
}

func NewClient(domain string) *Client {
	return &Client{
		domain: domain,
		client: &http.Client{
			Transport: &http.Transport{},
		},
	}
}

func (c *Client) FetchAPI(shortId string, headers http.Header) (*http.Response, error) {
	url := fmt.Sprintf("https://%s/api/sub/%s", c.domain, shortId)

	slog.Debug("Fetching API", "url", url)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("User-Agent", headers.Get("User-Agent"))
	req.Header.Set("Accept", headers.Get("Accept"))
	req.Header.Add("Accept-Encoding", "gzip")

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}

	return resp, nil
}
