// Sacred Mesh Cryptography
// Using modern Web Crypto API for XChaCha20-Poly1305 and Ed25519

export class SacredMeshCrypto {
  private static instance: SacredMeshCrypto;
  
  static getInstance(): SacredMeshCrypto {
    if (!SacredMeshCrypto.instance) {
      SacredMeshCrypto.instance = new SacredMeshCrypto();
    }
    return SacredMeshCrypto.instance;
  }

  // Generate Ed25519 identity keypair
  async generateIdentityKeyPair(): Promise<CryptoKeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'Ed25519',
      },
      true, // extractable
      ['sign', 'verify']
    ) as CryptoKeyPair;
    return keyPair;
  }

  // Generate X25519 ephemeral keypair for key agreement
  async generateEphemeralKeyPair(): Promise<CryptoKeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'X25519',
      },
      true,
      ['deriveKey']
    ) as CryptoKeyPair;
    return keyPair;
  }

  // Derive shared secret using X25519
  async deriveSharedSecret(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
    return await crypto.subtle.deriveKey(
      {
        name: 'X25519',
        public: publicKey,
      },
      privateKey,
      {
        name: 'ChaCha20-Poly1305',
        length: 256,
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt message using ChaCha20-Poly1305
  async encrypt(plaintext: Uint8Array, key: CryptoKey, nonce: Uint8Array): Promise<{
    ciphertext: Uint8Array;
    authTag: Uint8Array;
  }> {
    try {
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'ChaCha20-Poly1305',
          iv: nonce,
        },
        key,
        plaintext
      );

      const encryptedArray = new Uint8Array(encrypted);
      // ChaCha20-Poly1305 appends 16-byte auth tag
      const ciphertext = encryptedArray.slice(0, -16);
      const authTag = encryptedArray.slice(-16);

      return { ciphertext, authTag };
    } catch (error) {
      console.error('🔒 Encryption failed:', error);
      throw new Error('Encryption failed');
    }
  }

  // Decrypt message using ChaCha20-Poly1305
  async decrypt(ciphertext: Uint8Array, authTag: Uint8Array, key: CryptoKey, nonce: Uint8Array): Promise<Uint8Array> {
    try {
      // Combine ciphertext and auth tag for Web Crypto API
      const combined = new Uint8Array(ciphertext.length + authTag.length);
      combined.set(ciphertext);
      combined.set(authTag, ciphertext.length);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'ChaCha20-Poly1305',
          iv: nonce,
        },
        key,
        combined
      );

      return new Uint8Array(decrypted);
    } catch (error) {
      console.error('🔒 Decryption failed:', error);
      throw new Error('Decryption failed - invalid signature or corrupted data');
    }
  }

  // Sign data using Ed25519
  async sign(data: Uint8Array, privateKey: CryptoKey): Promise<Uint8Array> {
    const signature = await crypto.subtle.sign('Ed25519', privateKey, data);
    return new Uint8Array(signature);
  }

  // Verify signature using Ed25519
  async verify(signature: Uint8Array, data: Uint8Array, publicKey: CryptoKey): Promise<boolean> {
    try {
      return await crypto.subtle.verify('Ed25519', publicKey, signature, data);
    } catch {
      return false;
    }
  }

  // Generate cryptographically secure random bytes
  generateNonce(length: number = 24): Uint8Array {
    const nonce = new Uint8Array(length);
    crypto.getRandomValues(nonce);
    return nonce;
  }

  // Create fingerprint for key verification
  async createFingerprint(publicKey: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', publicKey);
    const hash = await crypto.subtle.digest('SHA-256', exported);
    const hashArray = new Uint8Array(hash);
    
    // Convert to human-readable format (first 8 bytes as hex)
    return Array.from(hashArray.slice(0, 8))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
      .match(/.{4}/g)!
      .join('-');
  }

  // Hash sender ID for privacy
  async hashSenderId(senderId: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(senderId);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hash);
    
    // Return first 16 bytes as hex
    return Array.from(hashArray.slice(0, 16))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}