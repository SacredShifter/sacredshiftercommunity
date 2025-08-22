// Sacred Mesh - Core Communication Abstraction Layer
import { SacredMeshRouter } from './router';
import { WebSocketTransport, MultipeerTransport, WiFiAwareTransport, MeshtasticTransport } from './transport';
import { SacredMeshMessage, MeshConfig, ContactKeys, SacredMeshPacket } from './types';
import { SacredMeshCrypto } from './crypto';
import { PacketFormatter } from './packet';

export class SacredMesh {
  private router: SacredMeshRouter;
  private crypto = SacredMeshCrypto.getInstance();
  private packetFormatter = new PacketFormatter();
  private isInitialized = false;
  private contactKeys = new Map<string, ContactKeys>();
  private myIdentityKeys?: CryptoKeyPair;
  private counter = 0;

  constructor(config?: Partial<MeshConfig>) {
    this.router = new SacredMeshRouter(config);
  }

  // Initialize Sacred Mesh with identity keys
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Generate or load identity keys
      this.myIdentityKeys = await this.crypto.generateIdentityKeyPair();
      
      // Set up transport stack in priority order
      await this.setupTransports();
      
      // Set up message handling
      this.router.onMessage(this.handleIncomingMessage.bind(this));
      
      this.isInitialized = true;
      console.log('🕸️ Sacred Mesh initialized successfully');
    } catch (error) {
      console.error('🕸️ Sacred Mesh initialization failed:', error);
      throw error;
    }
  }

  // Setup transport stack
  private async setupTransports(): Promise<void> {
    // Priority order: WebSocket > Multipeer > WiFi-Aware > Meshtastic
    
    // 1. WebSocket (for internet connectivity)
    const wsUrl = this.getWebSocketUrl();
    const webSocketTransport = new WebSocketTransport(wsUrl);
    this.router.addTransport(webSocketTransport);

    // 2. iOS Multipeer Connectivity (when on iOS)
    if (this.isIOS()) {
      const multipeerTransport = new MultipeerTransport();
      this.router.addTransport(multipeerTransport);
    }

    // 3. Android WiFi Aware + BLE (when on Android)
    if (this.isAndroid()) {
      const wifiAwareTransport = new WiFiAwareTransport();
      this.router.addTransport(wifiAwareTransport);
    }

    // 4. Meshtastic bridge (when device is paired)
    const meshtasticTransport = new MeshtasticTransport();
    this.router.addTransport(meshtasticTransport);
  }

  // Public API: Send a Sacred Mesh message
  async send(message: SacredMeshMessage, recipientId?: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Sacred Mesh not initialized');
    }

    try {
      // For now, use a temporary shared key (will implement proper key exchange later)
      const tempKey = await this.crypto.generateEphemeralKeyPair();
      const sharedKey = await this.crypto.deriveSharedSecret(tempKey.privateKey, tempKey.publicKey);
      
      // Create encrypted packet
      const packet = await this.packetFormatter.createPacket(
        message,
        'temp-sender-id', // TODO: Use real sender ID
        this.counter++,
        sharedKey
      );

      // Serialize and send
      const serializedPacket = await this.packetFormatter.serializePacket(packet);
      await this.router.send(serializedPacket);
      
      console.log('🕸️ Sacred Mesh message sent with sigils:', message.sigils);
    } catch (error) {
      console.error('🕸️ Failed to send Sacred Mesh message:', error);
      throw error;
    }
  }

  // Public API: Register message handler
  onMessage(callback: (message: SacredMeshMessage, senderId: string) => void): void {
    // This will be called by router.onMessage after decryption
    this.messageHandlers.push(callback);
  }

  private messageHandlers: ((message: SacredMeshMessage, senderId: string) => void)[] = [];

  // Handle incoming encrypted messages
  private async handleIncomingMessage(packet: SacredMeshPacket): Promise<void> {
    try {
      // TODO: Look up shared key for sender
      // For now, skip decryption and just log
      console.log('🕸️ Received encrypted message from:', packet.header.senderIdHash);
      
      // TODO: Decrypt and call message handlers
      // const message = await this.packetFormatter.decryptPacket(packet, sharedKey);
      // this.messageHandlers.forEach(handler => handler(message, packet.header.senderIdHash));
    } catch (error) {
      console.error('🕸️ Failed to handle incoming message:', error);
    }
  }

  // Add contact with key exchange
  async addContact(contactId: string, publicKey: CryptoKey): Promise<string> {
    const fingerprint = await this.crypto.createFingerprint(publicKey);
    
    this.contactKeys.set(contactId, {
      identityKey: new Uint8Array(await crypto.subtle.exportKey('raw', publicKey)),
      fingerprint
    });

    console.log('🕸️ Contact added:', contactId, 'fingerprint:', fingerprint);
    return fingerprint;
  }

  // Get network status
  async getStatus(): Promise<{
    transports: Record<string, boolean>;
    queue: { size: number; oldestAge: number };
    initialized: boolean;
  }> {
    return {
      transports: await this.router.getTransportStatus(),
      queue: this.router.getQueueStats(),
      initialized: this.isInitialized
    };
  }

  // Platform detection helpers
  private getWebSocketUrl(): string {
    // TODO: Configure based on environment
    return 'wss://your-sacred-mesh-relay.com/ws';
  }

  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  private isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.router.disconnect();
    this.isInitialized = false;
    this.contactKeys.clear();
    console.log('🕸️ Sacred Mesh disconnected');
  }
}

// Export everything needed
export * from './types';
export * from './crypto';
export { PacketFormatter } from './packet';
export { SacredMeshRouter } from './router';
export { WebSocketTransport, MultipeerTransport, WiFiAwareTransport, MeshtasticTransport } from './transport';