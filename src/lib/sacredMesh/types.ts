// Sacred Mesh Core Types
export interface SacredMeshMessage {
  sigils: string[];
  intentStrength: number;
  note?: string; // Optional 96-byte note when bandwidth allows
  groupId?: string;
  ttl: number; // seconds
  hopLimit: number;
}

export interface SacredMeshPacket {
  header: PacketHeader;
  body: EncryptedBody;
}

export interface PacketHeader {
  version: number;
  msgType: MessageType;
  senderIdHash: string; // Hashed for privacy
  counter: number; // Monotonic counter for replay protection
  timestampUtc: number;
}

export interface EncryptedBody {
  ciphertext: Uint8Array;
  authTag: Uint8Array;
}

export enum MessageType {
  DIRECT = 1,
  CIRCLE = 2,
  BROADCAST = 3,
  HANDSHAKE = 4,
  ACK = 5
}

export enum TransportType {
  WEBSOCKET = 'websocket',
  MULTIPEER = 'multipeer', // iOS
  WIFI_AWARE = 'wifi_aware', // Android
  BLUETOOTH_LE = 'bluetooth_le',
  MESHTASTIC = 'meshtastic'
}

export interface Transport {
  type: TransportType;
  available(): Promise<boolean>;
  send(packet: Uint8Array): Promise<void>;
  onMessage(callback: (packet: Uint8Array) => void): void;
  disconnect(): Promise<void>;
}

export interface QueuedMessage {
  packet: Uint8Array;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface ContactKeys {
  identityKey: Uint8Array; // Ed25519 public key
  ephemeralKey?: Uint8Array; // X25519 for current session
  fingerprint: string; // Human-readable verification
}

export interface MeshConfig {
  autoMode: boolean;
  maxHops: number;
  defaultTtl: number; // seconds
  maxQueueSize: number;
  retryInterval: number; // milliseconds
}