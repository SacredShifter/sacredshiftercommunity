package processor

import (
	"encoding/json"
	"fmt"

	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/types"
)

// ZoneBContext holds all the sensitive data that must not leave the Sacred Shifter ecosystem.
// This struct is marshaled to JSON and then encrypted.
type ZoneBContext struct {
	UserID   string      `json:"userId"`
	CircleID *string     `json:"circleId,omitempty"`
	Context  interface{} `json:"context"`
	Policy   types.Policy  `json:"policy"`
}

// SplitAndScrub takes the initial request and separates it into a sanitized Zone A request
// and a Zone B payload (as a raw byte slice, ready for encryption).
func SplitAndScrub(req *types.AuraGatewayRequest) (types.OpenRouterRequest, []byte, error) {
	// 1. Create the sanitized Zone A request for the external provider.
	// This is the core of the scrubbing logic. For now, it's a simple mapping.
	// A future implementation could add more advanced PII detection and redaction on the prompt itself.
	zoneARequest := types.OpenRouterRequest{
		Model: req.RequestedModel,
		Messages: []types.Message{
			{
				Role:    "user",
				Content: req.Prompt,
			},
		},
	}

	// 2. Package all sensitive and contextual data into the Zone B struct.
	zoneB := ZoneBContext{
		UserID:   req.UserID,
		CircleID: req.CircleID,
		Context:  req.Context,
		Policy:   req.Policy,
	}

	// 3. Marshal the Zone B context into a JSON byte slice.
	// This payload is what will be encrypted by the crypto layer.
	zoneBPayload, err := json.Marshal(zoneB)
	if err != nil {
		return types.OpenRouterRequest{}, nil, fmt.Errorf("failed to marshal zone B context: %w", err)
	}

	return zoneARequest, zoneBPayload, nil
}
