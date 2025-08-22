// Sacred Mesh CBOR Packet Format
import { SacredMeshMessage, SacredMeshPacket, PacketHeader, EncryptedBody, MessageType } from './types';
import { SacredMeshCrypto } from './crypto';

export class PacketFormatter {
  private crypto = SacredMeshCrypto.getInstance();

  // Serialize packet to CBOR binary format (keep under 256 bytes for LoRa)
  async serializePacket(packet: SacredMeshPacket): Promise<Uint8Array> {
    try {
      // For now, use JSON encoding (will switch to CBOR library later)
      const serialized = {
        h: {
          v: packet.header.version,
          t: packet.header.msgType,
          s: packet.header.senderIdHash,
          c: packet.header.counter,
          ts: packet.header.timestampUtc
        },
        b: {
          ct: Array.from(packet.body.ciphertext),
          at: Array.from(packet.body.authTag)
        }
      };

      const jsonString = JSON.stringify(serialized);
      return new TextEncoder().encode(jsonString);
    } catch (error) {
      console.error('📦 Packet serialization failed:', error);
      throw new Error('Failed to serialize packet');
    }
  }

  // Deserialize CBOR binary to packet
  async deserializePacket(data: Uint8Array): Promise<SacredMeshPacket> {
    try {
      const jsonString = new TextDecoder().decode(data);
      const parsed = JSON.parse(jsonString);

      return {
        header: {
          version: parsed.h.v,
          msgType: parsed.h.t,
          senderIdHash: parsed.h.s,
          counter: parsed.h.c,
          timestampUtc: parsed.h.ts
        },
        body: {
          ciphertext: new Uint8Array(parsed.b.ct),
          authTag: new Uint8Array(parsed.b.at)
        }
      };
    } catch (error) {
      console.error('📦 Packet deserialization failed:', error);
      throw new Error('Failed to deserialize packet');
    }
  }

  // Create encrypted packet from Sacred Mesh message
  async createPacket(
    message: SacredMeshMessage,
    senderId: string,
    counter: number,
    sharedKey: CryptoKey
  ): Promise<SacredMeshPacket> {
    // Serialize message content
    const messageData = {
      sigils: message.sigils,
      intentStrength: message.intentStrength,
      note: message.note,
      groupId: message.groupId,
      ttl: message.ttl,
      hopLimit: message.hopLimit
    };

    const plaintext = new TextEncoder().encode(JSON.stringify(messageData));
    const nonce = this.crypto.generateNonce(24); // XChaCha20 needs 24-byte nonce

    // Encrypt the message
    const { ciphertext, authTag } = await this.crypto.encrypt(plaintext, sharedKey, nonce);

    // Create header
    const header: PacketHeader = {
      version: 1,
      msgType: MessageType.DIRECT, // TODO: Determine from context
      senderIdHash: await this.crypto.hashSenderId(senderId),
      counter,
      timestampUtc: Math.floor(Date.now() / 1000)
    };

    return {
      header,
      body: {
        ciphertext: new Uint8Array([...nonce, ...ciphertext]), // Prepend nonce
        authTag
      }
    };
  }

  // Decrypt packet to Sacred Mesh message
  async decryptPacket(
    packet: SacredMeshPacket,
    sharedKey: CryptoKey
  ): Promise<SacredMeshMessage> {
    try {
      // Extract nonce and ciphertext
      const nonce = packet.body.ciphertext.slice(0, 24);
      const ciphertext = packet.body.ciphertext.slice(24);

      // Decrypt
      const plaintext = await this.crypto.decrypt(ciphertext, packet.body.authTag, sharedKey, nonce);
      
      // Parse message
      const messageData = JSON.parse(new TextDecoder().decode(plaintext));

      return {
        sigils: messageData.sigils,
        intentStrength: messageData.intentStrength,
        note: messageData.note,
        groupId: messageData.groupId,
        ttl: messageData.ttl,
        hopLimit: messageData.hopLimit
      };
    } catch (error) {
      console.error('📦 Packet decryption failed:', error);
      throw new Error('Failed to decrypt packet');
    }
  }

  // Validate packet structure and timing
  validatePacket(packet: SacredMeshPacket, lastSeenCounter: number): boolean {
    // Check version
    if (packet.header.version !== 1) {
      console.warn('📦 Unsupported packet version:', packet.header.version);
      return false;
    }

    // Check counter for replay protection
    if (packet.header.counter <= lastSeenCounter) {
      console.warn('📦 Replay attack detected, counter:', packet.header.counter);
      return false;
    }

    // Check timestamp (allow 5 minute skew)
    const now = Math.floor(Date.now() / 1000);
    const maxSkew = 300; // 5 minutes
    if (Math.abs(packet.header.timestampUtc - now) > maxSkew) {
      console.warn('📦 Packet timestamp too skewed:', packet.header.timestampUtc);
      return false;
    }

    return true;
  }

  // Calculate packet size for LoRa compatibility
  calculatePacketSize(packet: SacredMeshPacket): number {
    // Estimate serialized size
    const headerSize = 32; // Rough estimate for CBOR header
    const bodySize = packet.body.ciphertext.length + packet.body.authTag.length;
    return headerSize + bodySize;
  }

  // Check if packet fits LoRa constraints
  isLoRaCompatible(packet: SacredMeshPacket): boolean {
    return this.calculatePacketSize(packet) <= 255; // Leave 1 byte margin
  }
}
