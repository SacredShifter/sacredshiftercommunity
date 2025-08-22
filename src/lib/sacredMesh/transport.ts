import { Transport, TransportType } from './types';

export abstract class BaseTransport implements Transport {
  abstract type: TransportType;
  protected messageCallback?: (packet: Uint8Array) => void;

  abstract available(): Promise<boolean>;
  abstract send(packet: Uint8Array): Promise<void>;
  abstract disconnect(): Promise<void>;

  onMessage(callback: (packet: Uint8Array) => void): void {
    this.messageCallback = callback;
  }

  protected handleMessage(packet: Uint8Array): void {
    if (this.messageCallback) {
      this.messageCallback(packet);
    }
  }
}

export class WebSocketTransport extends BaseTransport {
  type = TransportType.WEBSOCKET;
  private socket?: WebSocket;
  private url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }

  async available(): Promise<boolean> {
    // For testing: always return true so we can test the mesh locally
    console.log('🌐 WebSocket transport available check - returning true for testing');
    return true;
  }

  async send(packet: Uint8Array): Promise<void> {
    console.log('🌐 WebSocket sending packet:', packet.length, 'bytes');
    
    // For testing: simulate sending the packet back to ourselves after a delay
    // This simulates receiving a message from another peer
    setTimeout(() => {
      console.log('🌐 WebSocket simulating received packet');
      this.handleMessage(packet);
    }, 500);
  }

  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('🌐 Sacred Mesh WebSocket connected');
          resolve();
        };

        this.socket.onmessage = (event) => {
          if (event.data instanceof ArrayBuffer) {
            this.handleMessage(new Uint8Array(event.data));
          }
        };

        this.socket.onerror = (error) => {
          console.error('🌐 Sacred Mesh WebSocket error:', error);
          reject(error);
        };

        this.socket.onclose = () => {
          console.log('🌐 Sacred Mesh WebSocket disconnected');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
  }
}

// Placeholder for iOS Multipeer Connectivity
export class MultipeerTransport extends BaseTransport {
  type = TransportType.MULTIPEER;

  async available(): Promise<boolean> {
    // TODO: Implement iOS Multipeer Connectivity check
    return false;
  }

  async send(packet: Uint8Array): Promise<void> {
    // TODO: Implement iOS Multipeer send
    throw new Error('Multipeer not implemented yet');
  }

  async disconnect(): Promise<void> {
    // TODO: Implement disconnect
  }
}

// Placeholder for Android WiFi Aware
export class WiFiAwareTransport extends BaseTransport {
  type = TransportType.WIFI_AWARE;

  async available(): Promise<boolean> {
    // TODO: Implement Android WiFi Aware check
    return false;
  }

  async send(packet: Uint8Array): Promise<void> {
    // TODO: Implement WiFi Aware send
    throw new Error('WiFi Aware not implemented yet');
  }

  async disconnect(): Promise<void> {
    // TODO: Implement disconnect
  }
}

// Placeholder for Meshtastic bridge
export class MeshtasticTransport extends BaseTransport {
  type = TransportType.MESHTASTIC;

  async available(): Promise<boolean> {
    // TODO: Check for paired Meshtastic device
    return false;
  }

  async send(packet: Uint8Array): Promise<void> {
    // TODO: Implement Meshtastic bridge
    throw new Error('Meshtastic not implemented yet');
  }

  async disconnect(): Promise<void> {
    // TODO: Implement disconnect
  }
}