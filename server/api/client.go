package api

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/imroc/req/v3"
)

type Client struct {
	domain string
	client *req.Client
}

func NewClient(domain string) *Client {
	client := req.C().
		SetUserAgent("req").
		DisableDebugLog()
		// EnableDumpAll().
		// EnableDebugLog()
	
	return &Client{
		domain: domain,
		client: client,
	}
}

func (c *Client) FetchAPI(path string, headers http.Header) (*req.Response, error) {
	var url string
	if path == "" {
		return nil, fmt.Errorf("error creating request")
	} else {
		url = fmt.Sprintf("https://%s/api/sub/%s", c.domain, path)
	}

	slog.Debug("Fetching API", "url", url)

	
	request := c.client.R()
	
	if userAgent := headers.Get("User-Agent"); userAgent != "" {
		request.SetHeader("User-Agent", userAgent)
	}
	
	if accept := headers.Get("Accept"); accept != "" {
		request.SetHeader("Accept", accept)
	}

	
	resp, err := request.Get(url)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	
	return resp, nil
} 