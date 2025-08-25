package openrouter

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/types"
)

const (
	defaultBaseURL = "https://openrouter.ai/api/v1"
	defaultTimeout = 30 * time.Second
)

// Client is a client for the OpenRouter API.
type Client struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
}

// NewClient creates a new OpenRouter client.
// It requires an apiKey and allows optional customization of the baseURL.
func NewClient(apiKey string, baseURL ...string) (*Client, error) {
	if apiKey == "" {
		return nil, fmt.Errorf("OpenRouter API key cannot be empty")
	}

	c := &Client{
		apiKey: apiKey,
		httpClient: &http.Client{
			Timeout: defaultTimeout,
		},
	}

	if len(baseURL) > 0 && baseURL[0] != "" {
		c.baseURL = baseURL[0]
	} else {
		c.baseURL = defaultBaseURL
	}

	return c, nil
}

// Call sends the sanitized Zone A request to the OpenRouter chat completions endpoint.
func (c *Client) Call(ctx context.Context, req types.OpenRouterRequest) (*types.OpenRouterResponse, error) {
	// 1. Marshal the request body.
	reqBody, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal openrouter request: %w", err)
	}

	// 2. Create the HTTP request.
	url := fmt.Sprintf("%s/chat/completions", c.baseURL)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create http request: %w", err)
	}

	// 3. Set the required headers.
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))
	// OpenRouter also recommends setting this header.
	httpReq.Header.Set("HTTP-Referer", "https://sacredshifter.com")


	// 4. Execute the request.
	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request to openrouter: %w", err)
	}
	defer resp.Body.Close()

	// 5. Check for non-successful status codes.
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		var errResp map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
			return nil, fmt.Errorf("request failed with status %d and could not decode error response", resp.StatusCode)
		}
		return nil, fmt.Errorf("request failed with status %d: %v", resp.StatusCode, errResp)
	}

	// 6. Decode the successful response.
	var orResp types.OpenRouterResponse
	if err := json.NewDecoder(resp.Body).Decode(&orResp); err != nil {
		return nil, fmt.Errorf("failed to decode successful openrouter response: %w", err)
	}

	return &orResp, nil
}
