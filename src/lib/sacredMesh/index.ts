// Sacred Mesh - Core Communication Abstraction Layer
import { SacredMeshRouter } from './router';
import { WebSocketTransport, MultipeerTransport, WiFiAwareTransport, MeshtasticTransport } from './transport';
import { SacredMeshMessage, MeshConfig, SacredMeshPacket, KeyBundle } from './types';
import { SacredMeshCrypto } from './crypto';
import { PacketFormatter } from './packet';
import { SacredKeyExchange, Contact } from './keyExchange';

export class SacredMesh {
  private router: SacredMeshRouter;
  private crypto = SacredMeshCrypto.getInstance();
  private packetFormatter = new PacketFormatter();
  private keyExchange = new SacredKeyExchange();
  private isInitialized = false;
  private counter = 0;
  private messageHandlers: ((message: SacredMeshMessage, senderId: string) => void)[] = [];

  constructor(config?: Partial<MeshConfig>) {
    this.router = new SacredMeshRouter(config);
  }

  // Initialize Sacred Mesh
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.keyExchange.initialize();
      await this.setupTransports();
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
  async send(message: SacredMeshMessage, recipientId: string): Promise<void> {
    if (!this.isInitialized) throw new Error('Sacred Mesh not initialized');

    const contact = this.keyExchange.getContact(recipientId);
    if (!contact?.sharedSecret) throw new Error(`No secure session with contact ${recipientId}`);

    try {
      const { ciphertext, authTag, headerInfo } = await this.keyExchange.encryptMessage(recipientId, new TextEncoder().encode(JSON.stringify(message)));
      
      const packet = await this.packetFormatter.createPacket(
        { ciphertext, authTag },
        await this.getCurrentUserId(),
        this.counter++,
        headerInfo
      );

      const serializedPacket = await this.packetFormatter.serializePacket(packet);
      await this.router.send(serializedPacket);
      
      console.log('🕸️ Sacred Mesh message sent securely');
    } catch (error) {
      console.error('🕸️ Failed to send Sacred Mesh message:', error);
      throw error;
    }
  }

  // Public API: Register message handler
  onMessage(callback: (message: SacredMeshMessage, senderId: string) => void): void {
    this.messageHandlers.push(callback);
  }

  // Handle incoming encrypted messages
  private async handleIncomingMessage(packet: SacredMeshPacket): Promise<void> {
    try {
      const senderId = await this.getSenderIdFromHash(packet.header.senderIdHash);
      if (!senderId) throw new Error('Could not identify sender from hash');

      const decrypted = await this.keyExchange.decryptMessage(senderId, packet.payload.ciphertext, packet.payload.authTag, packet.header);
      const message: SacredMeshMessage = JSON.parse(new TextDecoder().decode(decrypted));

      this.messageHandlers.forEach(handler => handler(message, senderId));
      
      console.log('🕸️ Message delivered to', this.messageHandlers.length, 'handlers');
    } catch (error) {
      console.error('🕸️ Failed to handle incoming message:', error);
    }
  }

  // Add contact with key exchange
  async addContact(contactId: string, keyBundle: KeyBundle): Promise<Contact> {
    return this.keyExchange.addContact(contactId, keyBundle);
  }

  // Generate key bundle for sharing
  async generateKeyBundle(): Promise<KeyBundle> {
    return this.keyExchange.generateKeyBundle();
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

  // Helpers
  private async getCurrentUserId(): Promise<string> {
    // Placeholder
    return 'me';
  }

  private async getSenderIdFromHash(hash: string): Promise<string | undefined> {
    for (const contact of this.keyExchange.getAllContacts()) {
      const contactHash = await this.crypto.hashSenderId(contact.id);
      if (contactHash === hash) {
        return contact.id;
      }
    }
    return undefined;
  }

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
    this.keyExchange = new SacredKeyExchange(); // Reset key exchange state
    console.log('🕸️ Sacred Mesh disconnected');
  }
}

// Export everything needed
export * from './types';
export * from './crypto';
export { PacketFormatter } from './packet';
export { SacredMeshRouter } from './router';
export { SacredKeyExchange } from './keyExchange';
export { WebSocketTransport, MultipeerTransport, WiFiAwareTransport, MeshtasticTransport } from './transport';