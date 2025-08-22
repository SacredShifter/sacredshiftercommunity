// Sacred Mesh Message Router with Store-and-Forward
import { Transport, QueuedMessage, MeshConfig, SacredMeshPacket } from './types';
import { PacketFormatter } from './packet';

export class SacredMeshRouter {
  private transports: Transport[] = [];
  private messageQueue: QueuedMessage[] = [];
  private packetFormatter = new PacketFormatter();
  private config: MeshConfig = {
    autoMode: true,
    maxHops: 5,
    defaultTtl: 3600, // 1 hour
    maxQueueSize: 100,
    retryInterval: 5000 // 5 seconds
  };
  private retryTimer?: number;
  private messageHandlers: ((packet: SacredMeshPacket) => void)[] = [];

  constructor(config?: Partial<MeshConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.startRetryTimer();
  }

  // Add transport to the stack (priority order)
  addTransport(transport: Transport): void {
    this.transports.push(transport);
    
    // Set up message handler for incoming messages
    transport.onMessage(async (data: Uint8Array) => {
      try {
        const packet = await this.packetFormatter.deserializePacket(data);
        this.handleIncomingMessage(packet);
      } catch (error) {
        console.error('🔄 Failed to process incoming message:', error);
      }
    });

    console.log(`🔄 Added ${transport.type} transport to Sacred Mesh`);
  }

  // Send message through best available transport
  async send(packet: Uint8Array): Promise<boolean> {
    if (!this.config.autoMode) {
      console.warn('🔄 Sacred Mesh auto mode disabled');
      return false;
    }

    // Try each transport in priority order
    for (const transport of this.transports) {
      try {
        if (await transport.available()) {
          await transport.send(packet);
          console.log(`🔄 Message sent via ${transport.type}`);
          return true;
        }
      } catch (error) {
        console.warn(`🔄 Failed to send via ${transport.type}:`, error);
        continue;
      }
    }

    // No transport available, queue the message
    this.queueMessage(packet);
    console.log('🔄 No transport available, message queued');
    return false;
  }

  // Queue message for later retry
  private queueMessage(packet: Uint8Array): void {
    if (this.messageQueue.length >= this.config.maxQueueSize) {
      // Remove oldest message
      this.messageQueue.shift();
      console.warn('🔄 Message queue full, dropping oldest message');
    }

    this.messageQueue.push({
      packet,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    });
  }

  // Retry queued messages
  private async retryQueuedMessages(): Promise<void> {
    if (this.messageQueue.length === 0) return;

    const now = Date.now();
    const toRetry = [...this.messageQueue];
    this.messageQueue = [];

    for (const queuedMessage of toRetry) {
      // Check if message has expired
      const age = now - queuedMessage.timestamp;
      if (age > this.config.defaultTtl * 1000) {
        console.log('🔄 Dropping expired queued message');
        continue;
      }

      // Try to send
      const sent = await this.send(queuedMessage.packet);
      
      if (!sent) {
        // Still can't send, requeue if under retry limit
        if (queuedMessage.retryCount < queuedMessage.maxRetries) {
          queuedMessage.retryCount++;
          this.messageQueue.push(queuedMessage);
        } else {
          console.warn('🔄 Message exceeded retry limit, dropping');
        }
      }
    }
  }

  // Start retry timer
  private startRetryTimer(): void {
    this.retryTimer = window.setInterval(() => {
      this.retryQueuedMessages();
    }, this.config.retryInterval);
  }

  // Handle incoming messages
  private handleIncomingMessage(packet: SacredMeshPacket): void {
    console.log('🔄 Received Sacred Mesh packet:', packet.header.msgType);
    
    // TODO: Validate packet, check hop limit, TTL
    // TODO: Check if we should forward (if not for us)
    // TODO: Decrypt if for us
    
    // Notify all registered handlers
    this.messageHandlers.forEach(handler => {
      try {
        handler(packet);
      } catch (error) {
        console.error('🔄 Message handler error:', error);
      }
    });
  }

  // Register message handler
  onMessage(handler: (packet: SacredMeshPacket) => void): void {
    this.messageHandlers.push(handler);
  }

  // Get transport status
  async getTransportStatus(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {};
    
    for (const transport of this.transports) {
      try {
        status[transport.type] = await transport.available();
      } catch {
        status[transport.type] = false;
      }
    }
    
    return status;
  }

  // Get queue statistics
  getQueueStats(): { size: number; oldestAge: number } {
    if (this.messageQueue.length === 0) {
      return { size: 0, oldestAge: 0 };
    }

    const now = Date.now();
    const oldestAge = Math.max(0, now - Math.min(...this.messageQueue.map(m => m.timestamp)));
    
    return {
      size: this.messageQueue.length,
      oldestAge: Math.floor(oldestAge / 1000) // Convert to seconds
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<MeshConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔄 Sacred Mesh config updated:', this.config);
  }

  // Cleanup
  async disconnect(): Promise<void> {
    if (this.retryTimer) {
      clearInterval(this.retryTimer);
    }

    // Disconnect all transports
    await Promise.all(this.transports.map(t => t.disconnect()));
    this.transports = [];
    this.messageQueue = [];
    
    console.log('🔄 Sacred Mesh router disconnected');
  }
}