package crypto

import (
	"bytes"
	"testing"
)

func TestEncryptDecrypt(t *testing.T) {
	// 1. Setup
	kms := NewMockKMS()
	kekID := "default-user-kek"
	plaintext := []byte("This is a highly secret message.")
	ad := []byte("This is the associated data.")

	// 2. Encrypt the data
	ciphertext, wrappedDEK, nonce, err := Encrypt(plaintext, ad, kms, kekID)
	if err != nil {
		t.Fatalf("Encryption failed: %v", err)
	}

	if len(ciphertext) == 0 {
		t.Fatal("Encrypt returned empty ciphertext")
	}
	if len(wrappedDEK) == 0 {
		t.Fatal("Encrypt returned empty wrappedDEK")
	}
	if len(nonce) == 0 {
		t.Fatal("Encrypt returned empty nonce")
	}

	// 3. Decrypt the data
	decryptedText, err := Decrypt(ciphertext, wrappedDEK, nonce, ad, kms, kekID)
	if err != nil {
		t.Fatalf("Decryption failed: %v", err)
	}

	// 4. Verify the result
	if !bytes.Equal(plaintext, decryptedText) {
		t.Errorf("Decrypted text does not match original. got %q, want %q", decryptedText, plaintext)
	}
}

func TestDecrypt_TamperedCiphertext(t *testing.T) {
	// 1. Setup
	kms := NewMockKMS()
	kekID := "default-user-kek"
	plaintext := []byte("Another secret message.")
	ad := []byte("Some associated data.")

	// 2. Encrypt
	ciphertext, wrappedDEK, nonce, err := Encrypt(plaintext, ad, kms, kekID)
	if err != nil {
		t.Fatalf("Encryption failed: %v", err)
	}

	// 3. Tamper with the ciphertext (flip one bit)
	tamperedCiphertext := make([]byte, len(ciphertext))
	copy(tamperedCiphertext, ciphertext)
	tamperedCiphertext[0] ^= 0x01 // Flip the first bit

	// 4. Attempt to decrypt
	_, err = Decrypt(tamperedCiphertext, wrappedDEK, nonce, ad, kms, kekID)
	if err == nil {
		t.Fatal("Decryption succeeded with tampered ciphertext, but it should have failed.")
	}
	t.Logf("Successfully caught error from tampered ciphertext: %v", err)
}

func TestDecrypt_TamperedAssociatedData(t *testing.T) {
	// 1. Setup
	kms := NewMockKMS()
	kekID := "default-user-kek"
	plaintext := []byte("A third secret message.")
	ad := []byte("Original AD")
	tamperedAd := []byte("Tampered AD")

	// 2. Encrypt
	ciphertext, wrappedDEK, nonce, err := Encrypt(plaintext, ad, kms, kekID)
	if err != nil {
		t.Fatalf("Encryption failed: %v", err)
	}

	// 3. Attempt to decrypt with tampered AD
	_, err = Decrypt(ciphertext, wrappedDEK, nonce, tamperedAd, kms, kekID)
	if err == nil {
		t.Fatal("Decryption succeeded with tampered associated data, but it should have failed.")
	}
	t.Logf("Successfully caught error from tampered associated data: %v", err)
}
