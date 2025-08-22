// CBOR (Concise Binary Object Representation) implementation for Sacred Mesh
// Lightweight binary serialization to keep packets under 256 bytes

export class CBOR {
  // Major type values
  static readonly MAJOR_UINT = 0;
  static readonly MAJOR_NEGINT = 1;
  static readonly MAJOR_BYTES = 2;
  static readonly MAJOR_STRING = 3;
  static readonly MAJOR_ARRAY = 4;
  static readonly MAJOR_MAP = 5;
  static readonly MAJOR_SIMPLE = 7;

  // Simple values
  static readonly FALSE = 20;
  static readonly TRUE = 21;
  static readonly NULL = 22;

  static encode(value: any): Uint8Array {
    const buffer: number[] = [];
    this.encodeValue(value, buffer);
    return new Uint8Array(buffer);
  }

  private static encodeValue(value: any, buffer: number[]): void {
    if (value === null) {
      buffer.push((this.MAJOR_SIMPLE << 5) | this.NULL);
    } else if (typeof value === 'boolean') {
      buffer.push((this.MAJOR_SIMPLE << 5) | (value ? this.TRUE : this.FALSE));
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        this.encodeInteger(value, buffer);
      } else {
        this.encodeFloat(value, buffer);
      }
    } else if (typeof value === 'string') {
      this.encodeString(value, buffer);
    } else if (Array.isArray(value)) {
      this.encodeArray(value, buffer);
    } else if (value instanceof Uint8Array) {
      this.encodeBytes(value, buffer);
    } else if (typeof value === 'object') {
      this.encodeMap(value, buffer);
    } else {
      throw new Error(`Unsupported type: ${typeof value}`);
    }
  }

  private static encodeInteger(value: number, buffer: number[]): void {
    if (value >= 0) {
      this.encodeUint(value, this.MAJOR_UINT, buffer);
    } else {
      this.encodeUint(-value - 1, this.MAJOR_NEGINT, buffer);
    }
  }

  private static encodeUint(value: number, major: number, buffer: number[]): void {
    if (value < 24) {
      buffer.push((major << 5) | value);
    } else if (value < 256) {
      buffer.push((major << 5) | 24);
      buffer.push(value);
    } else if (value < 65536) {
      buffer.push((major << 5) | 25);
      buffer.push(value >> 8);
      buffer.push(value & 0xff);
    } else {
      buffer.push((major << 5) | 26);
      buffer.push(value >> 24);
      buffer.push((value >> 16) & 0xff);
      buffer.push((value >> 8) & 0xff);
      buffer.push(value & 0xff);
    }
  }

  private static encodeFloat(value: number, buffer: number[]): void {
    // Simple float32 encoding
    const floatArray = new Float32Array([value]);
    const byteArray = new Uint8Array(floatArray.buffer);
    
    buffer.push((this.MAJOR_SIMPLE << 5) | 26);
    for (let i = 3; i >= 0; i--) {
      buffer.push(byteArray[i]);
    }
  }

  private static encodeString(value: string, buffer: number[]): void {
    const utf8 = new TextEncoder().encode(value);
    this.encodeUint(utf8.length, this.MAJOR_STRING, buffer);
    buffer.push(...Array.from(utf8));
  }

  private static encodeBytes(value: Uint8Array, buffer: number[]): void {
    this.encodeUint(value.length, this.MAJOR_BYTES, buffer);
    buffer.push(...Array.from(value));
  }

  private static encodeArray(value: any[], buffer: number[]): void {
    this.encodeUint(value.length, this.MAJOR_ARRAY, buffer);
    for (const item of value) {
      this.encodeValue(item, buffer);
    }
  }

  private static encodeMap(value: object, buffer: number[]): void {
    const entries = Object.entries(value);
    this.encodeUint(entries.length, this.MAJOR_MAP, buffer);
    for (const [key, val] of entries) {
      this.encodeValue(key, buffer);
      this.encodeValue(val, buffer);
    }
  }

  static decode(data: Uint8Array): any {
    const decoder = new CBORDecoder(data);
    return decoder.decode();
  }
}

class CBORDecoder {
  private data: Uint8Array;
  private offset: number = 0;

  constructor(data: Uint8Array) {
    this.data = data;
  }

  decode(): any {
    if (this.offset >= this.data.length) {
      throw new Error('Unexpected end of CBOR data');
    }

    const byte = this.data[this.offset++];
    const major = byte >> 5;
    const additional = byte & 0x1f;

    switch (major) {
      case CBOR.MAJOR_UINT:
        return this.decodeUint(additional);
      case CBOR.MAJOR_NEGINT:
        return -this.decodeUint(additional) - 1;
      case CBOR.MAJOR_BYTES:
        return this.decodeBytes(additional);
      case CBOR.MAJOR_STRING:
        return this.decodeString(additional);
      case CBOR.MAJOR_ARRAY:
        return this.decodeArray(additional);
      case CBOR.MAJOR_MAP:
        return this.decodeMap(additional);
      case CBOR.MAJOR_SIMPLE:
        return this.decodeSimple(additional);
      default:
        throw new Error(`Unknown major type: ${major}`);
    }
  }

  private decodeUint(additional: number): number {
    if (additional < 24) {
      return additional;
    } else if (additional === 24) {
      return this.data[this.offset++];
    } else if (additional === 25) {
      const value = (this.data[this.offset] << 8) | this.data[this.offset + 1];
      this.offset += 2;
      return value;
    } else if (additional === 26) {
      const value = (this.data[this.offset] << 24) | 
                   (this.data[this.offset + 1] << 16) |
                   (this.data[this.offset + 2] << 8) |
                   this.data[this.offset + 3];
      this.offset += 4;
      return value;
    } else {
      throw new Error(`Unsupported uint encoding: ${additional}`);
    }
  }

  private decodeBytes(additional: number): Uint8Array {
    const length = this.decodeUint(additional);
    const bytes = this.data.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }

  private decodeString(additional: number): string {
    const length = this.decodeUint(additional);
    const bytes = this.data.slice(this.offset, this.offset + length);
    this.offset += length;
    return new TextDecoder().decode(bytes);
  }

  private decodeArray(additional: number): any[] {
    const length = this.decodeUint(additional);
    const array = [];
    for (let i = 0; i < length; i++) {
      array.push(this.decode());
    }
    return array;
  }

  private decodeMap(additional: number): object {
    const length = this.decodeUint(additional);
    const map: any = {};
    for (let i = 0; i < length; i++) {
      const key = this.decode();
      const value = this.decode();
      map[key] = value;
    }
    return map;
  }

  private decodeSimple(additional: number): any {
    if (additional === CBOR.FALSE) return false;
    if (additional === CBOR.TRUE) return true;
    if (additional === CBOR.NULL) return null;
    if (additional === 26) {
      // Float32
      const bytes = this.data.slice(this.offset, this.offset + 4);
      this.offset += 4;
      const floatArray = new Uint8Array(4);
      for (let i = 0; i < 4; i++) {
        floatArray[3 - i] = bytes[i];
      }
      return new Float32Array(floatArray.buffer)[0];
    }
    throw new Error(`Unsupported simple type: ${additional}`);
  }
}
