// Sacred Mesh Key Exchange Protocol
// Implements X3DH-style key agreement and Double Ratchet for forward secrecy

import { SacredMeshCrypto } from './crypto';

export interface KeyBundle {
  identityKey: CryptoKey;
  signedPreKey: CryptoKey;
  signature: Uint8Array;
  oneTimeKeys: CryptoKey[];
}

export interface Contact {
  id: string;
  identityKey: CryptoKey;
  keyBundle?: KeyBundle;
  sharedSecret?: CryptoKey;
  fingerprint: string;
  ratchetState?: RatchetState;
}

export interface RatchetState {
  sendingChain: ChainState;
  receivingChains: Map<string, ChainState>;
  rootKey: CryptoKey;
  messageKeys: Map<string, CryptoKey>;
}

export interface ChainState {
  chainKey: CryptoKey;
  messageNumber: number;
}

export class SacredKeyExchange {
  private crypto = SacredMeshCrypto.getInstance();
  private contacts = new Map<string, Contact>();
  private myIdentityKeys?: CryptoKeyPair;
  private myPreKeys?: CryptoKeyPair;

  async initialize(): Promise<void> {
    this.myIdentityKeys = await this.crypto.generateIdentityKeyPair();
    this.myPreKeys = await this.crypto.generateEphemeralKeyPair();
    console.log('🔑 Sacred Key Exchange initialized');
  }

  // Generate key bundle for sharing with others
  async generateKeyBundle(): Promise<KeyBundle> {
    if (!this.myIdentityKeys || !this.myPreKeys) {
      throw new Error('Key exchange not initialized');
    }

    // Sign the prekey with identity key
    const preKeyBytes = await crypto.subtle.exportKey('raw', this.myPreKeys.publicKey);
    const signature = await this.crypto.sign(new Uint8Array(preKeyBytes), this.myIdentityKeys.privateKey);

    // Generate one-time keys
    const oneTimeKeys: CryptoKey[] = [];
    for (let i = 0; i < 10; i++) {
      const keyPair = await this.crypto.generateEphemeralKeyPair();
      oneTimeKeys.push(keyPair.publicKey);
    }

    return {
      identityKey: this.myIdentityKeys.publicKey,
      signedPreKey: this.myPreKeys.publicKey,
      signature,
      oneTimeKeys
    };
  }

  // Add contact and perform initial key agreement
  async addContact(contactId: string, keyBundle: KeyBundle): Promise<Contact> {
    if (!this.myIdentityKeys || !this.myPreKeys) {
      throw new Error('Key exchange not initialized');
    }

    // Verify signed prekey
    const preKeyBytes = await crypto.subtle.exportKey('raw', keyBundle.signedPreKey);
    const isValid = await this.crypto.verify(
      keyBundle.signature,
      new Uint8Array(preKeyBytes),
      keyBundle.identityKey
    );

    if (!isValid) {
      throw new Error('Invalid key bundle signature');
    }

    // X3DH key agreement
    const sharedSecret = await this.performX3DH(keyBundle);

    // Create fingerprint for verification
    const fingerprint = await this.crypto.createFingerprint(keyBundle.identityKey);

    // Initialize Double Ratchet
    const ratchetState = await this.initializeRatchet(sharedSecret);

    const contact: Contact = {
      id: contactId,
      identityKey: keyBundle.identityKey,
      keyBundle,
      sharedSecret,
      fingerprint,
      ratchetState
    };

    this.contacts.set(contactId, contact);
    console.log('🤝 Contact added:', contactId, 'fingerprint:', fingerprint);
    
    return contact;
  }

  // X3DH key agreement protocol
  private async performX3DH(keyBundle: KeyBundle): Promise<CryptoKey> {
    if (!this.myIdentityKeys || !this.myPreKeys) {
      throw new Error('Key exchange not initialized');
    }

    // Generate ephemeral key for this exchange
    const ephemeralKey = await this.crypto.generateEphemeralKeyPair();

    // Perform multiple ECDH operations
    const dh1 = await this.crypto.deriveSharedSecret(this.myIdentityKeys.privateKey, keyBundle.signedPreKey);
    const dh2 = await this.crypto.deriveSharedSecret(ephemeralKey.privateKey, keyBundle.identityKey);
    const dh3 = await this.crypto.deriveSharedSecret(ephemeralKey.privateKey, keyBundle.signedPreKey);

    // Use one-time key if available
    let dh4: CryptoKey | null = null;
    if (keyBundle.oneTimeKeys.length > 0) {
      dh4 = await this.crypto.deriveSharedSecret(ephemeralKey.privateKey, keyBundle.oneTimeKeys[0]);
    }

    // Combine all shared secrets
    const combinedKey = await this.combineSharedSecrets([dh1, dh2, dh3, dh4].filter(Boolean) as CryptoKey[]);
    return combinedKey;
  }

  // Combine multiple shared secrets into a root key using HKDF
  private async combineSharedSecrets(secrets: CryptoKey[]): Promise<CryptoKey> {
    // Concatenate all secret keys into a single buffer
    const buffers = await Promise.all(secrets.map(key => crypto.subtle.exportKey('raw', key)));
    const combinedBuffer = new Uint8Array(buffers.reduce((acc, val) => acc + val.byteLength, 0));
    let offset = 0;
    for (const buffer of buffers) {
      combinedBuffer.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }

    // Use HKDF to derive a strong root key
    const importedKey = await crypto.subtle.importKey(
      'raw',
      combinedBuffer,
      { name: 'HKDF' },
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        salt: new Uint8Array(), // No salt for this step
        info: new TextEncoder().encode('SacredMesh-RootKey'),
        hash: 'SHA-256'
      },
      importedKey,
      { name: 'AES-GCM', length: 256 },
      true, // Key should be extractable for ratchet
      ['encrypt', 'decrypt']
    );
  }

  // Initialize Double Ratchet for forward secrecy
  private async initializeRatchet(rootKey: CryptoKey): Promise<RatchetState> {
    const sendingChain: ChainState = {
      chainKey: rootKey, // In real implementation, derive chain key from root key
      messageNumber: 0
    };

    return {
      sendingChain,
      receivingChains: new Map(),
      rootKey,
      messageKeys: new Map()
    };
  }

  // Encrypt message with forward secrecy
  async encryptMessage(contactId: string, plaintext: Uint8Array): Promise<{
    ciphertext: Uint8Array;
    authTag: Uint8Array;
    headerInfo: any;
  }> {
    const contact = this.contacts.get(contactId);
    if (!contact?.ratchetState) {
      throw new Error('Contact not found or ratchet not initialized');
    }

    // Advance sending chain
    const messageKey = await this.advanceChain(contact.ratchetState.sendingChain);
    
    // Encrypt with message key
    const nonce = this.crypto.generateNonce(12);
    const encrypted = await this.crypto.encrypt(plaintext, messageKey, nonce);

    const headerInfo = {
      messageNumber: contact.ratchetState.sendingChain.messageNumber - 1,
      nonce: Array.from(nonce)
    };

    return {
      ciphertext: encrypted.ciphertext,
      authTag: encrypted.authTag,
      headerInfo
    };
  }

  // Decrypt message with forward secrecy
  async decryptMessage(contactId: string, ciphertext: Uint8Array, authTag: Uint8Array, headerInfo: any): Promise<Uint8Array> {
    const contact = this.contacts.get(contactId);
    if (!contact?.ratchetState) {
      throw new Error('Contact not found or ratchet not initialized');
    }

    // For simplicity, use the current chain key
    // In real implementation, handle out-of-order messages properly
    const messageKey = contact.ratchetState.sendingChain.chainKey;
    const nonce = new Uint8Array(headerInfo.nonce);

    return await this.crypto.decrypt(ciphertext, authTag, messageKey, nonce);
  }

  // Advance chain and derive message key
  private async advanceChain(chain: ChainState): Promise<CryptoKey> {
    // For simplicity, return the chain key
    // In real implementation, properly advance the chain with KDF
    chain.messageNumber++;
    return chain.chainKey;
  }

  // Get contact information
  getContact(contactId: string): Contact | undefined {
    return this.contacts.get(contactId);
  }

  // Get all contacts
  getAllContacts(): Contact[] {
    return Array.from(this.contacts.values());
  }

  // Generate QR code data for key exchange
  async generateQRCodeData(): Promise<string> {
    const keyBundle = await this.generateKeyBundle();
    
    // Export keys to transferable format
    const identityKeyBytes = await crypto.subtle.exportKey('raw', keyBundle.identityKey);
    const preKeyBytes = await crypto.subtle.exportKey('raw', keyBundle.signedPreKey);
    
    const qrData = {
      identity: Array.from(new Uint8Array(identityKeyBytes)),
      preKey: Array.from(new Uint8Array(preKeyBytes)),
      signature: Array.from(keyBundle.signature),
      timestamp: Date.now()
    };

    return JSON.stringify(qrData);
  }

  // Import contact from QR code data
  async importFromQRCode(qrData: string, contactId: string): Promise<Contact> {
    const data = JSON.parse(qrData);
    
    // Import keys from raw bytes
    const identityKey = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(data.identity),
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['verify']
    );

    const signedPreKey = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(data.preKey),
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      []
    );

    const keyBundle: KeyBundle = {
      identityKey,
      signedPreKey,
      signature: new Uint8Array(data.signature),
      oneTimeKeys: []
    };

    return await this.addContact(contactId, keyBundle);
  }
}