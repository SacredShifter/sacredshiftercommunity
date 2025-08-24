// Unified Messaging Service - The Living Organism
import { DurableStore } from '@/lib/durableStore';
import { SacredMesh, SacredMeshMessage } from '@/lib/sacredMesh';
import { supabase } from '@/integrations/supabase/client';
import { 
  UnifiedMessage, 
  MessageContext, 
  DeliveryOptions, 
  UnifiedMessagingConfig,
  ConnectionStatus,
  MessageType,
  DeliveryMethod,
} from './types';

// --- Error classification helpers ---
type Retryability = 'retryable' | 'permanent';

class RetryableError extends Error {
  kind: Retryability = 'retryable';
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'RetryableError';
    (this as any).cause = cause;
  }
}

class PermanentError extends Error {
  kind: Retryability = 'permanent';
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'PermanentError';
    (this as any).cause = cause;
  }
}

/**
 * Normalize transport/db errors into retryable vs permanent.
 * Treats network-ish failures (TypeError('NetworkError'), ECONN*, timeouts) as retryable.
 * 4xx (except 408/429) as permanent. 5xx as retryable.
 */
function classifyError(err: unknown): RetryableError | PermanentError {
  // Vitest/MSW/Node cases
  const msg = String((err as any)?.message ?? err ?? '');
  const code = (err as any)?.code;
  const status = (err as any)?.status ?? (err as any)?.response?.status;

  // Browser fetch network failure commonly appears as TypeError
  if (err instanceof TypeError || msg.includes('NetworkError')) {
    return new RetryableError(msg || 'Network failure', err);
  }

  // Node-style connection errors
  if (code && /^ECONN|ETIMEDOUT|EAI_AGAIN|ECONNRESET$/i.test(String(code))) {
    return new RetryableError(msg || String(code), err);
  }

  // HTTP status semantics if present
  if (typeof status === 'number') {
    if (status >= 500) return new RetryableError(`HTTP ${status}`, err);
    if (status === 408 || status === 429) return new RetryableError(`HTTP ${status}`, err);
    // Most 4xx are permanent (auth/validation/etc.)
    if (status >= 400 && status < 500) return new PermanentError(`HTTP ${status}`, err);
  }

  // Supabase client offline or similar
  if (msg.toLowerCase().includes('offline') || msg.toLowerCase().includes('timeout')) {
    return new RetryableError(msg, err);
  }

  // Default to retryable only if clearly transient; otherwise permanent
  return new PermanentError(msg || 'Unknown error', err);
}


export class UnifiedMessagingService {
  private static instance: UnifiedMessagingService;
  private sacredMesh: SacredMesh;
  private config: UnifiedMessagingConfig;
  private messageQueue: DurableStore<UnifiedMessage>;
  private retryQueue: DurableStore<UnifiedMessage>;
  private connectionStatus: ConnectionStatus;
  private isInitialized = false;
  private syncInterval?: NodeJS.Timeout;
  private messageHandlers: Map<MessageType, (message: UnifiedMessage) => void> = new Map();

  // Tuneables:
  private readonly baseDelayMs = 5_000;     // first retry after 5s
  private readonly maxDelayMs  = 5 * 60_000; // cap at 5 min

  private constructor(config?: Partial<UnifiedMessagingConfig>) {
    this.config = {
      meshEnabled: true,
      meshAsFallback: true,
      retryAttempts: 3,
      timeout: 30000,
      batchSize: 10,
      compressionLevel: 0.8,
      ...config
    };

    this.sacredMesh = SacredMesh.getInstance();
    this.messageQueue = new DurableStore('message-queue');
    this.retryQueue = new DurableStore('retry-queue');

    this.connectionStatus = {
      database: navigator.onLine,
      mesh: {
        initialized: false,
        transports: {},
        activeConnections: 0,
        queueSize: 0
      },
      lastSync: new Date(),
      pendingMessages: 0
    };
  }

  static getInstance(config?: Partial<UnifiedMessagingConfig>): UnifiedMessagingService {
    if (!UnifiedMessagingService.instance) {
      UnifiedMessagingService.instance = new UnifiedMessagingService(config);
    }
    return UnifiedMessagingService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    console.log('🌟 Initializing Unified Messaging Service...');
    try {
      if (this.config.meshEnabled) {
        await this.sacredMesh.initialize();
        const meshStatus = await this.sacredMesh.getStatus();
        this.connectionStatus.mesh = {
          initialized: meshStatus.initialized,
          transports: meshStatus.transports,
          activeConnections: Object.values(meshStatus.transports).filter(Boolean).length,
          queueSize: meshStatus.queue.size
        };
        this.sacredMesh.onMessage((message: SacredMeshMessage, senderId: string) => {
          this.handleIncomingMeshMessage(message, senderId);
        });
      }
      this.monitorConnections();
      this.startSyncProcess();
      this.processRetryQueue();
      this.processMessageQueue();
      this.isInitialized = true;
      console.log('🌟 Unified Messaging Service initialized successfully');
    } catch (error) {
      console.error('🌟 Failed to initialize Unified Messaging Service:', error);
      throw error;
    }
  }

  async sendMessage(
    content: string,
    context: MessageContext,
    options: DeliveryOptions = {}
  ): Promise<UnifiedMessage> {
    const message: UnifiedMessage = {
      id: crypto.randomUUID(),
      type: context.type,
      senderId: await this.getCurrentUserId(),
      recipientId: context.targetId,
      circleId: context.type === 'circle' ? context.targetId : undefined,
      content,
      metadata: context.metadata || {},
      timestamp: Date.now(),
      deliveryMethod: this.determineDeliveryMethod(options),
      status: 'pending',
      retryCount: 0
    };

    if (message.deliveryMethod === 'mesh' || message.deliveryMethod === 'hybrid') {
      message.meshPayload = this.createMeshPayload(content, context);
    }

    console.log(`🌟 Queueing ${message.type} message for sending: ${message.id}`);
    await this.messageQueue.set(message.id, message);
    // The sync process will pick this up. In tests, we use a manual flush.
    return message;
  }

  private async routeMessage(message: UnifiedMessage, options: DeliveryOptions): Promise<void> {
    switch (message.deliveryMethod) {
      case 'database':
        await this.sendViaDatabase(message);
        break;
      case 'mesh':
        await this.sendViaMesh(message);
        break;
      case 'hybrid':
        await this.sendViaHybrid(message);
        break;
    }
  }

  private async sendViaDatabase(message: UnifiedMessage): Promise<void> {
    try {
      const success = await this.attemptDatabaseSend(message);
      if (success) {
        message.status = 'sent';
        this.updateConnectionStatus('database', true);
        return;
      }
      throw new PermanentError('Database send returned false');
    } catch (raw) {
      const err = classifyError(raw);
      if (err.kind === 'retryable' && this.config.meshAsFallback && this.connectionStatus.mesh.initialized) {
        try {
          message.deliveryMethod = 'mesh';
          await this.sendViaMesh(message);
          return;
        } catch (meshRaw) {
          throw classifyError(meshRaw);
        }
      }
      throw err;
    }
  }

  private async sendViaMesh(message: UnifiedMessage): Promise<void> {
    if (!this.connectionStatus.mesh.initialized) {
      throw new RetryableError('Sacred Mesh not initialized');
    }
    const meshMessage: SacredMeshMessage = {
      sigils: message.meshPayload?.sigils || this.extractSigils(message.content),
      intentStrength: message.meshPayload?.intentStrength || 0.8,
      note: message.content,
      ttl: message.meshPayload?.ttl || 3600,
      hopLimit: message.meshPayload?.hopLimit || 5
    };
    try {
      await this.sacredMesh.send(meshMessage, message.recipientId);
      message.status = 'mesh_queued';
      message.deliveryMethod = 'mesh';
    } catch (raw) {
      throw classifyError(raw);
    }
  }

  private async sendViaHybrid(message: UnifiedMessage): Promise<void> {
    try {
      await this.sendViaDatabase(message);
    } catch (dbError) {
      const classified = classifyError(dbError);
      if (classified.kind === 'retryable') {
        console.warn('🌟 Database send failed in hybrid mode, failing over to mesh.', classified);
        await this.sendViaMesh(message);
      } else {
        throw classified;
      }
    }
  }

  private async attemptDatabaseSend(message: UnifiedMessage): Promise<boolean> {
    // This is a simplified check. In a real app, this would be a proper health check.
    if (!navigator.onLine) {
        throw new TypeError('NetworkError: a browser-like network error');
    }
    try {
      switch (message.type) {
        case 'direct':
          return await this.sendDirectMessage(message);
        case 'circle':
          return await this.sendCircleMessage(message);
        case 'journal':
          return await this.sendJournalEntry(message);
        default:
          throw new PermanentError(`Unsupported message type: ${message.type}`);
      }
    } catch (error) {
      console.error(`🌟 Database send failed for ${message.type}:`, error);
      throw error; // Re-throw to be classified
    }
  }

  private async sendDirectMessage(message: UnifiedMessage): Promise<boolean> {
    const { error } = await supabase
      .from('direct_messages')
      .insert({
        sender_id: message.senderId,
        recipient_id: message.recipientId!,
        content: message.content,
        message_type: message.metadata?.messageType || 'text',
        metadata: message.metadata
      });
    if (error) throw error;
    return true;
  }

  private async sendCircleMessage(message: UnifiedMessage): Promise<boolean> {
    const { error } = await supabase
      .from('circle_posts')
      .insert({
        user_id: message.senderId,
        content: message.content,
        group_id: message.circleId,
        visibility: message.metadata?.visibility || 'circle',
        chakra_tag: message.metadata?.chakraTag,
        tone: message.metadata?.tone,
        frequency: message.metadata?.frequency,
        is_anonymous: message.metadata?.isAnonymous || false
      });
    if (error) throw error;
    return true;
  }

  private async sendJournalEntry(message: UnifiedMessage): Promise<boolean> {
    const { error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: message.senderId,
        title: message.metadata?.title || '',
        body: message.content,
        mood: message.metadata?.moodTag,
        tags: message.metadata?.chakraAlignment ? [message.metadata.chakraAlignment] : [],
        source: 'unified_messaging'
      });
    if (error) throw error;
    return true;
  }

  private async handleIncomingMeshMessage(meshMessage: SacredMeshMessage, senderId: string): Promise<void> {
    const unifiedMessage: UnifiedMessage = {
      id: crypto.randomUUID(),
      type: 'direct',
      senderId,
      content: meshMessage.note || '',
      metadata: {},
      timestamp: Date.now(),
      deliveryMethod: 'mesh',
      status: 'delivered'
    };
    const handler = this.messageHandlers.get(unifiedMessage.type);
    if (handler) handler(unifiedMessage);
    if (this.connectionStatus.database) {
      try {
        await this.attemptDatabaseSend(unifiedMessage);
      } catch (error) {
        console.warn('🌟 Failed to sync mesh message to database:', error);
      }
    }
  }

  registerMessageHandler(type: MessageType, handler: (message: UnifiedMessage) => void): void {
    this.messageHandlers.set(type, handler);
  }

  private determineDeliveryMethod(options: DeliveryOptions): DeliveryMethod {
    if (options.preferMesh) return 'mesh';
    if (!this.connectionStatus.database && this.connectionStatus.mesh.initialized) return 'mesh';
    if (this.connectionStatus.database && this.config.meshAsFallback) return 'hybrid';
    return this.connectionStatus.database ? 'database' : 'mesh';
  }

  private createMeshPayload(content: string, context: MessageContext) {
    return {
      sigils: this.extractSigils(content),
      intentStrength: this.calculateIntentStrength(content, context),
      ttl: context.type === 'journal' ? 86400 : 3600,
      hopLimit: context.visibility === 'circle' ? 3 : 5
    };
  }

  private extractSigils(content: string): string[] {
    const words = content.toLowerCase().split(/\s+/);
    const intentWords = words.filter(word => word.length > 3 && !['the', 'and', 'but', 'for', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should'].includes(word));
    return intentWords.slice(0, 5);
  }

  private calculateIntentStrength(content: string, context: MessageContext): number {
    let strength = 0.5;
    const emotionalWords = ['love', 'peace', 'joy', 'gratitude', 'sacred', 'divine', 'blessing'];
    const emotionalCount = emotionalWords.filter(word => content.toLowerCase().includes(word)).length;
    strength += emotionalCount * 0.1;
    if (context.type === 'journal') strength += 0.2;
    if (context.type === 'circle') strength += 0.15;
    return Math.min(1.0, strength);
  }

  private monitorConnections(): void {
    window.addEventListener('online', () => this.updateConnectionStatus('database', true));
    window.addEventListener('offline', () => this.updateConnectionStatus('database', false));
  }

  private updateConnectionStatus(type: 'database' | 'mesh', status: boolean): void {
    if (type === 'database') this.connectionStatus.database = status;
    this.connectionStatus.lastSync = new Date();
  }

  private startSyncProcess(): void {
    this.syncInterval = setInterval(() => {
      this.processMessageQueue();
      this.processRetryQueue();
    }, 5000);
  }

  private async processMessageQueue(): Promise<void> {
    const messagesToProcess = await this.messageQueue.getAll();
    if (messagesToProcess.length === 0) return;

    for (const message of messagesToProcess) {
      try {
        await this.routeMessage(message, { enableRetry: true });
        await this.messageQueue.delete(message.id);
      } catch (err: any) {
        if (err.kind === 'retryable') {
          await this.addToRetryQueue(message);
        } else {
          // If it's not our classified error, classify it now.
          const classifiedErr = err.kind ? err : classifyError(err);
          console.error('🌟 Permanent failure, dropping message:', message.id, classifiedErr);
        }
        await this.messageQueue.delete(message.id);
      }
    }
  }

  private async processRetryQueue(): Promise<void> {
    const messagesToRetry = await this.retryQueue.getAll();
    if (messagesToRetry.length === 0) return;

    const nowMs = Date.now();
    for (const message of messagesToRetry) {
      const nextAt = message.nextRetryAtMs ?? 0;
      if (nowMs < nextAt) continue;

      const attempts = message.retryCount ?? 0;
      if (attempts >= this.config.retryAttempts) {
        console.error(`🌟 Message ${message.id} failed after max retries, dropping.`);
        await this.retryQueue.delete(message.id);
        continue;
      }

      try {
        // Increment retry count and update timestamps before the attempt
        const newCount = attempts + 1;
        const delay = this.backoffDelayMs(newCount);
        message.retryCount = newCount;
        message.lastRetryAtMs = nowMs;
        message.nextRetryAtMs = nowMs + delay;
        await this.retryQueue.set(message.id, message);

        // Now, attempt to route the message again
        await this.routeMessage(message, { enableRetry: false });

        // If successful, remove it from the retry queue
        await this.retryQueue.delete(message.id);
      } catch (err: any) {
        if (err.kind === 'permanent') {
          console.error(`🌟 Permanent failure on retry for ${message.id}, dropping.`, err);
          await this.retryQueue.delete(message.id);
        } else {
          // It's a retryable error, so we leave it in the queue.
          // The nextRetryAtMs has already been updated for the next attempt.
          const classifiedErr = err.kind ? err : classifyError(err);
          console.warn(`🌟 Retry ${message.retryCount} failed for ${message.id}:`, classifiedErr.message);
        }
      }
    }
  }

  private backoffDelayMs(retryCount: number): number {
    const pow = Math.max(0, retryCount - 1);
    return Math.min(this.baseDelayMs * (2 ** pow), this.maxDelayMs);
  }

  private async addToRetryQueue(message: UnifiedMessage): Promise<void> {
    const nowMs = Date.now();
    const nextCount = (message.retryCount ?? 0) + 1;
    const delay = this.backoffDelayMs(nextCount);

    // Initialize retry metadata
    message.retryCount = message.retryCount ?? 0;
    message.lastRetryAtMs = message.lastRetryAtMs ?? nowMs;
    message.nextRetryAtMs = nowMs + delay;

    await this.retryQueue.set(message.id, message);
  }

  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'anonymous';
  }

  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  async getQueueStats() {
    const messageQueue = await this.messageQueue.getAll();
    const retryQueue = await this.retryQueue.getAll();
    return {
      messageQueue: messageQueue.length,
      retryQueue: retryQueue.length,
      totalPending: messageQueue.length + retryQueue.length
    };
  }

  async disconnect(): Promise<void> {
    if (this.syncInterval) clearInterval(this.syncInterval);
    if (this.sacredMesh) await this.sacredMesh.disconnect();
    this.isInitialized = false;
  }

  // Test-only hook to manually trigger a single processing pass
  async __test__flushOnce(): Promise<void> {
    await this.processMessageQueue();
    await this.processRetryQueue();
  }
}

export default UnifiedMessagingService;