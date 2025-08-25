package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/crypto"
	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/openrouter"
	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
)

// TestGatewayHandler_EndToEnd performs an integration test of the gateway handler.
func TestGatewayHandler_EndToEnd(t *testing.T) {
	// 1. Set up a mock server for the external OpenRouter API.
	mockOpenRouter := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Assert that the request to the mock server is correct.
		assert.Equal(t, http.MethodPost, r.Method, "Expected POST request to OpenRouter")
		assert.Equal(t, "application/json", r.Header.Get("Content-Type"))
		assert.Contains(t, r.Header.Get("Authorization"), "Bearer mock-api-key")

		// Decode the Zone A request sent to us.
		var zoneAReq types.OpenRouterRequest
		err := json.NewDecoder(r.Body).Decode(&zoneAReq)
		require.NoError(t, err)
		assert.Equal(t, "test-model", zoneAReq.Model)
		assert.Equal(t, "What is the meaning of life?", zoneAReq.Messages[0].Content)

		// Send back a canned OpenRouter response.
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		response := types.OpenRouterResponse{
			ID: "cmpl-mock-id-with-test-model",
			Choices: []types.Choice{
				{Message: types.Message{Role: "assistant", Content: "42"}},
			},
			Usage: types.Usage{PromptTokens: 10, CompletionTokens: 1, TotalTokens: 11},
		}
		err = json.NewEncoder(w).Encode(response)
		require.NoError(t, err)
	}))
	defer mockOpenRouter.Close()

	// 2. Set up the dependencies for our APG server.
	logger := zap.NewNop() // Use zap.NewDevelopmentTestLogger(t) for debugging.
	kms := crypto.NewMockKMS()
	// Configure the OpenRouter client to talk to our mock server.
	orClient, err := openrouter.NewClient("mock-api-key", mockOpenRouter.URL)
	require.NoError(t, err)

	// 3. Create an instance of our APG server.
	apgServer := NewServer(logger, kms, orClient)

	// 4. Create the incoming request that a user would send to our APG.
	requestBody := types.AuraGatewayRequest{
		UserID:         "user-test-123",
		Prompt:         "What is the meaning of life?",
		RequestedModel: "test-model",
		Context:        map[string]string{"secret": "the secret is a secret"},
	}
	bodyBytes, err := json.Marshal(requestBody)
	require.NoError(t, err)

	// 5. Perform the request against our APG handler.
	req := httptest.NewRequest(http.MethodPost, "/v1/gateway", bytes.NewReader(bodyBytes))
	rr := httptest.NewRecorder() // This recorder captures the response.
	apgServer.gatewayHandler(rr, req)

	// 6. Assert the results.
	assert.Equal(t, http.StatusOK, rr.Code, "APG handler returned wrong status code")

	var response types.AuraGatewayResponse
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	require.NoError(t, err, "Failed to unmarshal APG response")

	assert.Equal(t, "42", response.Content, "Response content is incorrect")
	assert.Equal(t, 11, response.Usage.TotalTokens, "Token usage is incorrect")
	assert.Equal(t, "OpenRouter", response.Provenance.Provider, "Provenance provider is incorrect")
	assert.NotEmpty(t, response.Provenance.ZoneAHash, "Provenance Zone A hash should not be empty")
}
