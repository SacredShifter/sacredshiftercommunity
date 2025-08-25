package types

// AuraGatewayRequest is the initial request from a client to the APG.
type AuraGatewayRequest struct {
	UserID          string      `json:"userId"`
	CircleID        *string     `json:"circleId"`
	Prompt          string      `json:"prompt"`
	Context         interface{} `json:"context"` // Can be any JSON object
	Policy          Policy      `json:"policy"`
	RequestedModel  string      `json:"requestedModel"`
}

// Policy defines the data handling policies for the request.
type Policy struct {
	Residency         string `json:"residency"`
	AllowCrossBorder  bool   `json:"allowCrossBorder"`
}

// AuraGatewayTransformed is the internal representation of the split request.
type AuraGatewayTransformed struct {
	ZoneAPrompt             OpenRouterRequest `json:"zoneA_prompt"`
	ZoneBEncryptedPayload   []byte            `json:"zoneB_encrypted_payload"`
	ZoneBWrappedDEK         []byte            `json:"zoneB_dek_wrapped"`
	AssociatedData          []byte            `json:"associatedData"`
}

// OpenRouterRequest is the sanitized request sent to OpenRouter.
// Based on a standard OpenAI-compatible structure.
type OpenRouterRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

// Message is a single message in a chat completion request.
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// OpenRouterResponse is a simplified representation of the response from OpenRouter.
type OpenRouterResponse struct {
	ID      string   `json:"id"`
	Choices []Choice `json:"choices"`
	Usage   Usage    `json:"usage"`
}

// Choice is a single choice in the OpenRouter response.
type Choice struct {
	Message Message `json:"message"`
}

// Usage contains token usage information.
type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

// AuraGatewayResponse is the final, rich response sent back to the client.
type AuraGatewayResponse struct {
	OriginalRequestID string     `json:"originalRequestId"`
	Content           string     `json:"content"`
	Usage             Usage      `json:"usage"`
	Provenance        Provenance `json:"provenance"`
}

// Provenance provides auditable information about the request processing.
type Provenance struct {
	ModelUsed   string `json:"modelUsed"`
	Provider    string `json:"provider"`
	LatencyMs   int64  `json:"latencyMs"`
	ZoneAHash   string `json:"zoneA_hash"`
}
