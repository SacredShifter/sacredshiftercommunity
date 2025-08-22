// Sacred Mesh Cryptography
// Using Web Crypto API with compatible algorithms for maximum browser support

export class SacredMeshCrypto {
  private static instance: SacredMeshCrypto;
  
  static getInstance(): SacredMeshCrypto {
    if (!SacredMeshCrypto.instance) {
      SacredMeshCrypto.instance = new SacredMeshCrypto();
    }
    return SacredMeshCrypto.instance;
  }

  // Generate ECDSA keypair (browser-compatible alternative to Ed25519)
  async generateIdentityKeyPair(): Promise<CryptoKeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true, // extractable
      ['sign', 'verify']
    ) as CryptoKeyPair;
    return keyPair;
  }

  // Generate ECDH ephemeral keypair for key agreement (browser-compatible alternative to X25519)
  async generateEphemeralKeyPair(): Promise<CryptoKeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      true,
      ['deriveKey']
    ) as CryptoKeyPair;
    return keyPair;
  }

  // Derive shared secret using ECDH
  async deriveSharedSecret(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
    return await crypto.subtle.deriveKey(
      {
        name: 'ECDH',
        public: publicKey,
      },
      privateKey,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt message using AES-GCM (browser-compatible alternative to ChaCha20-Poly1305)
  async encrypt(plaintext: Uint8Array, key: CryptoKey, nonce: Uint8Array): Promise<{
    ciphertext: Uint8Array;
    authTag: Uint8Array;
  }> {
    try {
      // Use first 12 bytes of nonce for AES-GCM IV
      const iv = nonce.slice(0, 12);
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        plaintext
      );

      const encryptedArray = new Uint8Array(encrypted);
      // AES-GCM appends 16-byte auth tag
      const ciphertext = encryptedArray.slice(0, -16);
      const authTag = encryptedArray.slice(-16);

      return { ciphertext, authTag };
    } catch (error) {
      console.error('🔒 Encryption failed:', error);
      throw new Error('Encryption failed');
    }
  }

  // Decrypt message using AES-GCM
  async decrypt(ciphertext: Uint8Array, authTag: Uint8Array, key: CryptoKey, nonce: Uint8Array): Promise<Uint8Array> {
    try {
      // Use first 12 bytes of nonce for AES-GCM IV
      const iv = nonce.slice(0, 12);
      
      // Combine ciphertext and auth tag for Web Crypto API
      const combined = new Uint8Array(ciphertext.length + authTag.length);
      combined.set(ciphertext);
      combined.set(authTag, ciphertext.length);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
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

  // Sign data using ECDSA
  async sign(data: Uint8Array, privateKey: CryptoKey): Promise<Uint8Array> {
    const signature = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: 'SHA-256',
      },
      privateKey,
      data
    );
    return new Uint8Array(signature);
  }

  // Verify signature using ECDSA
  async verify(signature: Uint8Array, data: Uint8Array, publicKey: CryptoKey): Promise<boolean> {
    try {
      return await crypto.subtle.verify(
        {
          name: 'ECDSA',
          hash: 'SHA-256',
        },
        publicKey,
        signature,
        data
      );
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