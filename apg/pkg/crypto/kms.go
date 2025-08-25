package crypto

import (
	"crypto/subtle"
	"fmt"
)

// KMS is an interface for a Key Management Service.
// It provides methods for wrapping (encrypting) and unwrapping (decrypting)
// Data Encryption Keys (DEKs) using a master Key Encryption Key (KEK).
type KMS interface {
	// Wrap encrypts the given DEK using the KEK identified by kekID.
	Wrap(dek []byte, kekID string) ([]byte, error)
	// Unwrap decrypts the given wrappedDEK using the KEK identified by kekID.
	Unwrap(wrappedDEK []byte, kekID string) ([]byte, error)
}

// MockKMS is a dummy implementation of the KMS interface for local testing.
// In a real environment, this would be replaced with a client for AWS KMS,
// Google Cloud KMS, etc.
//
// WARNING: This implementation is NOT secure and is for testing purposes only.
// It "encrypts" by XORing the key with a fixed byte slice.
type MockKMS struct {
	// A map to simulate different KEKs. The key is the kekID.
	masterKeys map[string][]byte
}

// NewMockKMS creates a new MockKMS with a default test key.
func NewMockKMS() *MockKMS {
	return &MockKMS{
		masterKeys: map[string][]byte{
			"default-user-kek": []byte("a-very-secret-master-key-123456"),
		},
	}
}

// Wrap "encrypts" the DEK by XORing it with the master key.
func (m *MockKMS) Wrap(dek []byte, kekID string) ([]byte, error) {
	masterKey, ok := m.masterKeys[kekID]
	if !ok {
		return nil, fmt.Errorf("master key not found for kekID: %s", kekID)
	}
	return m.xor(dek, masterKey), nil
}

// Unwrap "decrypts" the wrapped DEK by XORing it again with the master key.
func (m *MockKMS) Unwrap(wrappedDEK []byte, kekID string) ([]byte, error) {
	masterKey, ok := m.masterKeys[kekID]
	if !ok {
		return nil, fmt.Errorf("master key not found for kekID: %s", kekID)
	}
	return m.xor(wrappedDEK, masterKey), nil
}

// xor performs a simple XOR operation. It is NOT a secure encryption method.
// It repeats the key if it's shorter than the data.
func (m *MockKMS) xor(data, key []byte) []byte {
	result := make([]byte, len(data))
	for i := 0; i < len(data); i++ {
		result[i] = data[i] ^ key[i%len(key)]
	}
	return result
}

// MockKEKProtector is another dummy implementation of the KMS interface for local testing.
//
// WARNING: This implementation is NOT secure and is for testing purposes only.
// It "encrypts" by prepending a "secret" string.
type MockKEKProtector struct {
	secret string
}

func NewMockKEKProtector(secret string) *MockKEKProtector {
	return &MockKEKProtector{secret: secret}
}

// Wrap "encrypts" the DEK by prepending the secret.
func (p *MockKEKProtector) Wrap(dek []byte, kekID string) ([]byte, error) {
	// kekID is ignored in this simple mock
	return append([]byte(p.secret), dek...), nil
}

// Unwrap "decrypts" the wrapped DEK by checking and removing the secret.
func (p *MockKEKProtector) Unwrap(wrappedDEK []byte, kekID string) ([]byte, error) {
	// kekID is ignored in this simple mock
	secretBytes := []byte(p.secret)
	if len(wrappedDEK) < len(secretBytes) {
		return nil, fmt.Errorf("invalid wrapped DEK: too short")
	}

	// Use subtle.ConstantTimeCompare to prevent timing attacks
	if subtle.ConstantTimeCompare(wrappedDEK[:len(secretBytes)], secretBytes) != 1 {
		return nil, fmt.Errorf("invalid wrapped DEK: secret mismatch")
	}

	return wrappedDEK[len(secretBytes):], nil
}
