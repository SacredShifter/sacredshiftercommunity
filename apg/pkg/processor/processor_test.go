package processor

import (
	"encoding/json"
	"reflect"
	"testing"

	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/types"
)

func TestSplitAndScrub(t *testing.T) {
	circleID := "circ_123"
	req := &types.AuraGatewayRequest{
		UserID:         "user_abc",
		CircleID:       &circleID,
		Prompt:         "This is a test prompt.",
		RequestedModel: "gpt-4o",
		Context:        map[string]interface{}{"deep": "context"},
		Policy: types.Policy{
			Residency:        "EU",
			AllowCrossBorder: false,
		},
	}

	zoneAReq, zoneBPayload, err := SplitAndScrub(req)
	if err != nil {
		t.Fatalf("SplitAndScrub failed: %v", err)
	}

	// 1. Validate Zone A (the sanitized request)
	expectedZoneA := types.OpenRouterRequest{
		Model: "gpt-4o",
		Messages: []types.Message{
			{Role: "user", Content: "This is a test prompt."},
		},
	}
	if !reflect.DeepEqual(zoneAReq, expectedZoneA) {
		t.Errorf("Zone A request is incorrect. got %+v, want %+v", zoneAReq, expectedZoneA)
	}

	// 2. Validate Zone B (the sensitive payload)
	var zoneBResult ZoneBContext
	if err := json.Unmarshal(zoneBPayload, &zoneBResult); err != nil {
		t.Fatalf("Failed to unmarshal zoneBPayload: %v", err)
	}

	if zoneBResult.UserID != req.UserID {
		t.Errorf("Zone B UserID is incorrect. got %s, want %s", zoneBResult.UserID, req.UserID)
	}
	if *zoneBResult.CircleID != *req.CircleID {
		t.Errorf("Zone B CircleID is incorrect. got %s, want %s", *zoneBResult.CircleID, *req.CircleID)
	}
	if !reflect.DeepEqual(zoneBResult.Context, req.Context) {
		t.Errorf("Zone B Context is incorrect. got %+v, want %+v", zoneBResult.Context, req.Context)
	}
	if !reflect.DeepEqual(zoneBResult.Policy, req.Policy) {
		t.Errorf("Zone B Policy is incorrect. got %+v, want %+v", zoneBResult.Policy, req.Policy)
	}
}
