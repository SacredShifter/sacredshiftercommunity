// Sacred Mesh Peer Discovery
// Multi-transport peer discovery and connection management

import { Transport, TransportType } from './types';
import { SacredKeyExchange, Contact } from './keyExchange';

export interface PeerInfo {
  id: string;
  transport: TransportType;
  lastSeen: number;
  signalStrength?: number;
  capabilities: string[];
  publicKey?: CryptoKey;
}

export interface DiscoveryBeacon {
  nodeId: string;
  timestamp: number;
  capabilities: string[];
  keyExchangeData?: string;
  meshVersion: string;
}

export class SacredPeerDiscovery {
  private keyExchange: SacredKeyExchange;
  private discoveredPeers = new Map<string, PeerInfo>();
  private beaconInterval?: number;
  private isDiscovering = false;
  private callbacks: ((peer: PeerInfo) => void)[] = [];

  constructor(keyExchange: SacredKeyExchange) {
    this.keyExchange = keyExchange;
  }

  // Start peer discovery on all available transports
  async startDiscovery(): Promise<void> {
    if (this.isDiscovering) return;
    
    this.isDiscovering = true;
    console.log('🔍 Starting Sacred Mesh peer discovery...');

    // Start broadcasting our presence
    this.startBeaconing();

    // Listen for peers on different transports
    await this.discoverWebRTCPeers();
    await this.discoverBluetoothPeers();
    await this.discoverWiFiAwarePeers();
    await this.discoverMeshtasticPeers();
  }

  // Stop peer discovery
  stopDiscovery(): void {
    this.isDiscovering = false;
    
    if (this.beaconInterval) {
      clearInterval(this.beaconInterval);
      this.beaconInterval = undefined;
    }

    console.log('🔍 Stopped Sacred Mesh peer discovery');
  }

  // Register callback for new peer discoveries
  onPeerDiscovered(callback: (peer: PeerInfo) => void): void {
    this.callbacks.push(callback);
  }

  // Get all discovered peers
  getDiscoveredPeers(): PeerInfo[] {
    return Array.from(this.discoveredPeers.values());
  }

  // Start broadcasting discovery beacons
  private startBeaconing(): void {
    this.beaconInterval = window.setInterval(async () => {
      await this.broadcastBeacon();
    }, 10000); // Every 10 seconds
  }

  // Broadcast our presence beacon
  private async broadcastBeacon(): Promise<void> {
    const keyExchangeData = await this.keyExchange.generateQRCodeData();
    
    const beacon: DiscoveryBeacon = {
      nodeId: await this.generateNodeId(),
      timestamp: Date.now(),
      capabilities: ['mesh', 'sigils', 'e2ee'],
      keyExchangeData,
      meshVersion: '1.0.0'
    };

    // Broadcast on all available channels
    this.broadcastWebRTC(beacon);
    this.broadcastBluetooth(beacon);
    this.broadcastWiFiAware(beacon);
  }

  // Generate stable node ID based on identity key
  private async generateNodeId(): Promise<string> {
    // Use a deterministic ID based on our key material
    const timestamp = Date.now();
    const random = crypto.getRandomValues(new Uint8Array(4));
    return Array.from(random).map(b => b.toString(16).padStart(2, '0')).join('') + 
           timestamp.toString(36);
  }

  // WebRTC-based peer discovery
  private async discoverWebRTCPeers(): Promise<void> {
    console.log('🌐 Starting WebRTC peer discovery...');
    
    // In a real implementation, this would:
    // 1. Connect to a signaling server
    // 2. Exchange offers/answers with other peers
    // 3. Establish direct WebRTC connections
    // 4. Use data channels for mesh communication
    
    // For now, simulate discovering a peer
    setTimeout(() => {
      this.addDiscoveredPeer({
        id: 'webrtc-peer-1',
        transport: TransportType.WEBSOCKET, // Using WebSocket as WebRTC placeholder
        lastSeen: Date.now(),
        signalStrength: 0.8,
        capabilities: ['mesh', 'webrtc']
      });
    }, 2000);
  }

  // Bluetooth LE peer discovery
  private async discoverBluetoothPeers(): Promise<void> {
    console.log('📡 Starting Bluetooth LE peer discovery...');
    
    if (!(navigator as any).bluetooth) {
      console.log('📡 Bluetooth not available in this browser');
      return;
    }

    try {
      // Request access to Bluetooth
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['12345678-1234-1234-1234-123456789abc'] // Sacred Mesh service UUID
      });

      console.log('📡 Bluetooth device found:', device.name);
      
      // Add discovered peer
      this.addDiscoveredPeer({
        id: device.id,
        transport: TransportType.BLUETOOTH_LE,
        lastSeen: Date.now(),
        signalStrength: 0.6,
        capabilities: ['mesh', 'bluetooth']
      });
    } catch (error) {
      console.log('📡 Bluetooth discovery failed:', error);
    }
  }

  // WiFi Aware peer discovery (Android)
  private async discoverWiFiAwarePeers(): Promise<void> {
    console.log('📶 Starting WiFi Aware peer discovery...');
    
    // WiFi Aware is Android-specific and requires native implementation
    // For now, simulate the discovery process
    
    if (navigator.userAgent.includes('Android')) {
      setTimeout(() => {
        this.addDiscoveredPeer({
          id: 'wifi-aware-peer-1',
          transport: TransportType.WIFI_AWARE,
          lastSeen: Date.now(),
          signalStrength: 0.9,
          capabilities: ['mesh', 'wifi-aware', 'high-bandwidth']
        });
      }, 3000);
    }
  }

  // Meshtastic device discovery
  private async discoverMeshtasticPeers(): Promise<void> {
    console.log('📻 Starting Meshtastic peer discovery...');
    
    // Meshtastic discovery would involve:
    // 1. Scanning for paired Meshtastic devices via Bluetooth
    // 2. Connecting to device serial/Bluetooth interface
    // 3. Querying for mesh network participants
    // 4. Building routing table for LoRa mesh
    
    if ((navigator as any).serial) {
      try {
        // Request access to serial devices (for USB-connected Meshtastic)
        const ports = await (navigator as any).serial.getPorts();
        
        if (ports.length > 0) {
          console.log('📻 Found serial devices, checking for Meshtastic...');
          
          this.addDiscoveredPeer({
            id: 'meshtastic-gateway',
            transport: TransportType.MESHTASTIC,
            lastSeen: Date.now(),
            signalStrength: 1.0,
            capabilities: ['mesh', 'lora', 'long-range']
          });
        }
      } catch (error) {
        console.log('📻 Serial discovery failed:', error);
      }
    }
  }

  // Broadcast beacon via WebRTC
  private broadcastWebRTC(beacon: DiscoveryBeacon): void {
    // Send beacon through WebRTC data channels
    console.log('🌐 Broadcasting WebRTC beacon:', beacon.nodeId);
  }

  // Broadcast beacon via Bluetooth
  private broadcastBluetooth(beacon: DiscoveryBeacon): void {
    // Advertise beacon in Bluetooth LE advertisement data
    console.log('📡 Broadcasting Bluetooth beacon:', beacon.nodeId);
  }

  // Broadcast beacon via WiFi Aware
  private broadcastWiFiAware(beacon: DiscoveryBeacon): void {
    // Publish beacon on WiFi Aware service
    console.log('📶 Broadcasting WiFi Aware beacon:', beacon.nodeId);
  }

  // Add newly discovered peer
  private addDiscoveredPeer(peer: PeerInfo): void {
    const existing = this.discoveredPeers.get(peer.id);
    
    if (existing) {
      // Update last seen time
      existing.lastSeen = peer.lastSeen;
      existing.signalStrength = peer.signalStrength;
    } else {
      this.discoveredPeers.set(peer.id, peer);
      console.log('🔍 New peer discovered:', peer.id, 'via', peer.transport);
      
      // Notify callbacks
      this.callbacks.forEach(callback => callback(peer));
    }
  }

  // Handle received discovery beacon
  async handleBeacon(beacon: DiscoveryBeacon, transport: TransportType): Promise<void> {
    console.log('📡 Received beacon from:', beacon.nodeId);
    
    // Add as discovered peer
    this.addDiscoveredPeer({
      id: beacon.nodeId,
      transport,
      lastSeen: beacon.timestamp,
      capabilities: beacon.capabilities
    });

    // If beacon contains key exchange data, add as contact
    if (beacon.keyExchangeData) {
      try {
        await this.keyExchange.importFromQRCode(beacon.keyExchangeData, beacon.nodeId);
        console.log('🤝 Added contact from beacon:', beacon.nodeId);
      } catch (error) {
        console.warn('🤝 Failed to add contact from beacon:', error);
      }
    }
  }

  // Clean up old peers
  cleanupOldPeers(): void {
    const now = Date.now();
    const timeout = 60000; // 1 minute

    for (const [id, peer] of this.discoveredPeers.entries()) {
      if (now - peer.lastSeen > timeout) {
        this.discoveredPeers.delete(id);
        console.log('🔍 Removed stale peer:', id);
      }
    }
  }

  // Get peers by transport type
  getPeersByTransport(transport: TransportType): PeerInfo[] {
    return Array.from(this.discoveredPeers.values())
      .filter(peer => peer.transport === transport);
  }

  // Get best peers for a given capability
  getBestPeers(capability: string, maxCount: number = 3): PeerInfo[] {
    return Array.from(this.discoveredPeers.values())
      .filter(peer => peer.capabilities.includes(capability))
      .sort((a, b) => (b.signalStrength || 0) - (a.signalStrength || 0))
      .slice(0, maxCount);
  }
}