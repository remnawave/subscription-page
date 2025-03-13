package api

import (
	"fmt"
	"net/http"

	"github.com/imroc/req/v3"
	"golang.org/x/exp/slog"
)

type Client struct {
	domain string
	token string
	client *req.Client
}

func NewClient(domain string, token string) *Client {
	client := req.C().
		SetUserAgent("req").
		DisableDebugLog()
		// EnableDumpAll().
		// EnableDebugLog()
	
	return &Client{
		domain: domain,
		token: token,
		client: client,
	}
}

func (c *Client) FetchAPI(path string, headers http.Header, isJson bool) (*req.Response, error) {
	var url string
	if path == "" {
		return nil, fmt.Errorf("error creating request")
	} else if isJson {
		url = fmt.Sprintf("https://%s/api/sub/%s/json", c.domain, path)
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

func (c *Client) getUserByUsername(username string) (*req.Response, error) {
	url := fmt.Sprintf("https://%s/api/users/username/%s", c.domain, username)

	slog.Debug("Getting user by username", "url", url)

	c.client.SetCommonHeader("Authorization", "Bearer " + c.token)
	
	request := c.client.R()

	
	resp, err := request.Get(url)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	
	return resp, nil
} 

func (c *Client) GetUserByUsernameJSON(username string) (*User, error) {
	resp, err := c.getUserByUsername(username)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("error getting user by username: %s", username)
	}
	
	var userResp UserResponse
	err = resp.Into(&userResp)
	if err != nil {
		return nil, fmt.Errorf("error parsing response: %s", err)
	}
	
	return &userResp.Response, nil
}