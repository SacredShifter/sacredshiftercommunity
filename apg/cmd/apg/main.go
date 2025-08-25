package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/crypto"
	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/openrouter"
	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/processor"
	"github.com/SacredShifter/sacredshiftercommunity/apg/pkg/types"
)

// Server holds the dependencies for the gateway service.
type Server struct {
	kms      crypto.KMS
	orClient *openrouter.Client
	logger   *log.Logger
}

// NewServer creates a new server with all its dependencies.
func NewServer(logger *log.Logger, kms crypto.KMS, orClient *openrouter.Client) *Server {
	return &Server{
		kms:      kms,
		orClient: orClient,
		logger:   logger,
	}
}

func main() {
	logger := log.New(os.Stdout, "APG: ", log.LstdFlags)

	// Get OpenRouter API key from environment variable.
	apiKey := os.Getenv("OPENROUTER_API_KEY")
	if apiKey == "" {
		logger.Fatal("OPENROUTER_API_KEY environment variable not set")
	}

	// Initialize dependencies.
	kms := crypto.NewMockKMS() // Using mock KMS for now.
	orClient, err := openrouter.NewClient(apiKey)
	if err != nil {
		logger.Fatalf("Failed to create OpenRouter client: %v", err)
	}

	// Create the server which holds our dependencies.
	server := NewServer(logger, kms, orClient)

	// The handler function for our privacy gateway endpoint.
	http.HandleFunc("/v1/gateway", server.gatewayHandler)

	logger.Println("Starting Aura Privacy Gateway on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		logger.Fatalf("Failed to start server: %v", err)
	}
}

// gatewayHandler orchestrates the entire APG request flow.
func (s *Server) gatewayHandler(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	// 1. Basic request validation
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. Decode the incoming request body
	var request types.AuraGatewayRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		s.logger.Printf("ERROR: Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	s.logger.Printf("Received gateway request for user %s and model %s", request.UserID, request.RequestedModel)

	// 3. Split the request into Zone A (public) and Zone B (private).
	zoneARequest, zoneBPayload, err := processor.SplitAndScrub(&request)
	if err != nil {
		s.logger.Printf("ERROR: Failed to process request: %v", err)
		http.Error(w, "Failed to process request", http.StatusInternalServerError)
		return
	}

	// 4. Encrypt Zone B data.
	// For this example, we use a default KEK ID. In a real system, this would be user-specific.
	const userKekID = "default-user-kek"
	ciphertext, wrappedDEK, nonce, err := crypto.Encrypt(zoneBPayload, nil, s.kms, userKekID)
	if err != nil {
		s.logger.Printf("ERROR: Failed to encrypt Zone B data: %v", err)
		http.Error(w, "Failed to encrypt sensitive data", http.StatusInternalServerError)
		return
	}

	// 5. Hash Zone A data for provenance.
	zoneABytes, _ := json.Marshal(zoneARequest)
	zoneAHash := sha256.Sum256(zoneABytes)
	zoneAHashStr := hex.EncodeToString(zoneAHash[:])

	// 6. Call the external OpenRouter API with Zone A data.
	orResp, err := s.orClient.Call(r.Context(), zoneARequest)
	if err != nil {
		s.logger.Printf("ERROR: Failed to call OpenRouter: %v", err)
		http.Error(w, "Failed to communicate with AI provider", http.StatusBadGateway)
		return
	}

	// 7. Decrypt Zone B data. (In a stateless system, we'd retrieve it from temporary storage).
	// Here, we just use the variables from the encryption step.
	decryptedPayload, err := crypto.Decrypt(ciphertext, wrappedDEK, nonce, nil, s.kms, userKekID)
	if err != nil {
		s.logger.Printf("ERROR: Failed to decrypt Zone B data: %v", err)
		http.Error(w, "Failed to decrypt sensitive data", http.StatusInternalServerError)
		return
	}

	// Verify integrity: Check if decrypted data matches original.
	if !bytes.Equal(decryptedPayload, zoneBPayload) {
		s.logger.Printf("FATAL: Decrypted payload does not match original Zone B payload. Integrity check failed.")
		http.Error(w, "Data integrity check failed", http.StatusInternalServerError)
		return
	}

	// 8. Recombine and send the final response.
	var finalContent string
	if len(orResp.Choices) > 0 {
		finalContent = orResp.Choices[0].Message.Content
	}

	latency := time.Since(startTime).Milliseconds()
	response := types.AuraGatewayResponse{
		// A real implementation would generate and track a request ID.
		OriginalRequestID: "placeholder-request-id",
		Content:           finalContent,
		Usage:             orResp.Usage,
		Provenance: types.Provenance{
			ModelUsed: orResp.ID, // The response ID often contains the model name.
			Provider:  "OpenRouter",
			LatencyMs: latency,
			ZoneAHash: zoneAHashStr,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		s.logger.Printf("ERROR: Failed to encode final response: %v", err)
	}
}
