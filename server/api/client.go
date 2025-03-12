package api

import (
	"fmt"
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
			Transport: &http.Transport{
				DisableCompression: false,
			},
		},
	}
}

func (c *Client) FetchAPI(path string, headers http.Header) (*http.Response, error) {
	var url string
	if path == "" {
		return nil, fmt.Errorf("error creating request")
	} else {
		url = fmt.Sprintf("https://%s/api/sub/%s", c.domain, path)
	}

	fmt.Println("Fetching API:", url)
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	for name, values := range headers {
		for _, value := range values {
			req.Header.Add(name, value)
		}
	}
	
	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	
	return resp, nil
} 