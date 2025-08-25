package crypto

import (
	"crypto/rand"
	"fmt"
	"io"

	"github.com/cloudflare/circl/cipher/ascon"
)

// Encrypt performs the AEAD encryption of the Zone B data.
// It generates a new DEK, encrypts the plaintext, and uses the KMS to wrap the DEK.
// It returns the ciphertext, the wrapped DEK, the nonce used, and any error.
func Encrypt(plaintext []byte, ad []byte, kms KMS, kekID string) (ciphertext, wrappedDEK, nonce []byte, err error) {
	// 1. Generate a new, random Data Encryption Key (DEK).
	// Ascon-128 uses a 16-byte (128-bit) key.
	dek := make([]byte, ascon.KeySize)
	if _, err := io.ReadFull(rand.Reader, dek); err != nil {
		return nil, nil, nil, fmt.Errorf("failed to generate DEK: %w", err)
	}

	// 2. Use the KMS to wrap the DEK with the user's KEK.
	wrappedDEK, err = kms.Wrap(dek, kekID)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("failed to wrap DEK with KMS: %w", err)
	}

	// 3. Create a new Ascon-128 AEAD cipher instance with the plaintext DEK.
	aead, err := ascon.New(dek, ascon.Ascon128)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("failed to create Ascon-128 cipher: %w", err)
	}

	// 4. Generate a random nonce. The nonce must be unique for each encryption
	// with the same key.
	nonce = make([]byte, aead.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, nil, nil, fmt.Errorf("failed to generate nonce: %w", err)
	}

	// 5. Encrypt the plaintext. The Seal function appends the ciphertext
	// and authentication tag to the nonce and returns the combined result.
	// We pass `nil` as the first argument to let Seal allocate the slice.
	ciphertext = aead.Seal(nil, nonce, plaintext, ad)

	return ciphertext, wrappedDEK, nonce, nil
}

// Decrypt performs the AEAD decryption of the Zone B data.
// It uses the KMS to unwrap the DEK and then decrypts the ciphertext.
// It returns the original plaintext and any error.
func Decrypt(ciphertext, wrappedDEK, nonce, ad []byte, kms KMS, kekID string) ([]byte, error) {
	// 1. Use the KMS to unwrap the DEK.
	dek, err := kms.Unwrap(wrappedDEK, kekID)
	if err != nil {
		return nil, fmt.Errorf("failed to unwrap DEK with KMS: %w", err)
	}

	// 2. Create a new Ascon-128 AEAD cipher instance with the unwrapped DEK.
	aead, err := ascon.New(dek, ascon.Ascon128)
	if err != nil {
		return nil, fmt.Errorf("failed to create Ascon-128 cipher: %w", err)
	}

	// 3. Check if the ciphertext is long enough to be valid.
	if len(ciphertext) < aead.Overhead() {
		return nil, fmt.Errorf("invalid ciphertext: too short")
	}

	// 4. Decrypt the ciphertext. The Open function verifies the authentication tag
	// and, if successful, returns the original plaintext.
	// We pass `nil` as the first argument to let Open allocate the slice.
	plaintext, err := aead.Open(nil, nonce, ciphertext, ad)
	if err != nil {
		// This error is critical, as it means the ciphertext or associated data
		// was tampered with, or the key/nonce is incorrect.
		return nil, fmt.Errorf("failed to decrypt or authenticate data: %w", err)
	}

	return plaintext, nil
}
