// Unified Messaging Types
export type MessageType = 'direct' | 'circle' | 'journal' | 'system';
export type DeliveryMethod = 'database' | 'mesh' | 'hybrid';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'mesh_queued';

export interface UnifiedMessage {
  id: string;
  type: MessageType;
  senderId: string;
  recipientId?: string; // For direct messages
  circleId?: string; // For circle messages
  content: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  deliveryMethod: DeliveryMethod;
  status: MessageStatus;
  meshPayload?: {
    sigils: string[];
    intentStrength: number;
    ttl: number;
    hopLimit: number;
  };
  retryCount?: number;
  lastRetry?: Date;
}

export interface MessageContext {
  type: MessageType;
  targetId?: string; // recipient, circle, or journal owner
  visibility?: 'public' | 'circle' | 'private';
  metadata?: Record<string, any>;
}

export interface DeliveryOptions {
  preferMesh?: boolean;
  enableRetry?: boolean;
  retryLimit?: number;
  timeout?: number;
  fallbackToMesh?: boolean;
}

export interface UnifiedMessagingConfig {
  meshEnabled: boolean;
  meshAsFallback: boolean;
  retryAttempts: number;
  timeout: number;
  batchSize: number;
  compressionLevel: number;
}

export interface MessageBatch {
  id: string;
  messages: UnifiedMessage[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor?: Date;
  maxRetries: number;
}

export interface ConnectionStatus {
  database: boolean;
  mesh: {
    initialized: boolean;
    transports: Record<string, boolean>;
    activeConnections: number;
    queueSize: number;
  };
  lastSync: Date;
  pendingMessages: number;
}