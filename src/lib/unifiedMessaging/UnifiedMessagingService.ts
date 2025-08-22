// Unified Messaging Service - The Living Organism
import { SacredMesh, SacredMeshMessage } from '@/lib/sacredMesh';
import { supabase } from '@/integrations/supabase/client';
import { 
  UnifiedMessage, 
  MessageContext, 
  DeliveryOptions, 
  UnifiedMessagingConfig,
  MessageBatch,
  ConnectionStatus,
  MessageType,
  DeliveryMethod,
  MessageStatus
} from './types';

export class UnifiedMessagingService {
  private static instance: UnifiedMessagingService;
  private sacredMesh: SacredMesh;
  private config: UnifiedMessagingConfig;
  private messageQueue: UnifiedMessage[] = [];
  private retryQueue: UnifiedMessage[] = [];
  private batchQueue: MessageBatch[] = [];
  private connectionStatus: ConnectionStatus;
  private isInitialized = false;
  private syncInterval?: NodeJS.Timeout;
  private messageHandlers: Map<MessageType, (message: UnifiedMessage) => void> = new Map();

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

    this.sacredMesh = new SacredMesh();
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

  // Initialize the unified messaging system
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🌟 Initializing Unified Messaging Service...');

    try {
      // Initialize Sacred Mesh
      if (this.config.meshEnabled) {
        await this.sacredMesh.initialize();
        const meshStatus = await this.sacredMesh.getStatus();
        this.connectionStatus.mesh = {
          initialized: meshStatus.initialized,
          transports: meshStatus.transports,
          activeConnections: Object.values(meshStatus.transports).filter(Boolean).length,
          queueSize: meshStatus.queue.size
        };

        // Set up mesh message handler
        this.sacredMesh.onMessage((message: SacredMeshMessage, senderId: string) => {
          this.handleIncomingMeshMessage(message, senderId);
        });
      }

      // Monitor database connection
      this.monitorConnections();

      // Start sync processes
      this.startSyncProcess();

      // Process any queued messages
      this.processMessageQueue();

      this.isInitialized = true;
      console.log('🌟 Unified Messaging Service initialized successfully');
    } catch (error) {
      console.error('🌟 Failed to initialize Unified Messaging Service:', error);
      throw error;
    }
  }

  // Send unified message with intelligent routing
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
      timestamp: new Date(),
      deliveryMethod: this.determineDeliveryMethod(options),
      status: 'pending',
      retryCount: 0
    };

    // Add mesh payload if using mesh delivery
    if (message.deliveryMethod === 'mesh' || message.deliveryMethod === 'hybrid') {
      message.meshPayload = this.createMeshPayload(content, context);
    }

    console.log(`🌟 Sending ${message.type} message via ${message.deliveryMethod}:`, message.id);

    try {
      await this.routeMessage(message, options);
      return message;
    } catch (error) {
      console.error('🌟 Failed to send message:', error);
      message.status = 'failed';
      
      // Add to retry queue if enabled
      if (options.enableRetry !== false && this.config.retryAttempts > 0) {
        this.addToRetryQueue(message);
      }

      return message;
    }
  }

  // Route message based on delivery method
  private async routeMessage(message: UnifiedMessage, options: DeliveryOptions): Promise<void> {
    switch (message.deliveryMethod) {
      case 'database':
        await this.sendViaDatabase(message);
        break;
      case 'mesh':
        await this.sendViaMesh(message);
        break;
      case 'hybrid':
        await this.sendViaHybrid(message, options);
        break;
    }
  }

  // Send via traditional database with mesh fallback
  private async sendViaDatabase(message: UnifiedMessage): Promise<void> {
    try {
      const success = await this.attemptDatabaseSend(message);
      if (success) {
        message.status = 'sent';
        this.updateConnectionStatus('database', true);
      } else {
        throw new Error('Database send failed');
      }
    } catch (error) {
      console.warn('🌟 Database send failed, attempting mesh fallback:', error);
      
      if (this.config.meshAsFallback && this.connectionStatus.mesh.initialized) {
        message.deliveryMethod = 'mesh';
        await this.sendViaMesh(message);
      } else {
        throw error;
      }
    }
  }

  // Send via Sacred Mesh
  private async sendViaMesh(message: UnifiedMessage): Promise<void> {
    if (!this.connectionStatus.mesh.initialized) {
      throw new Error('Sacred Mesh not initialized');
    }

    const meshMessage: SacredMeshMessage = {
      sigils: message.meshPayload?.sigils || this.extractSigils(message.content),
      intentStrength: message.meshPayload?.intentStrength || 0.8,
      note: message.content,
      ttl: message.meshPayload?.ttl || 3600,
      hopLimit: message.meshPayload?.hopLimit || 5
    };

    await this.sacredMesh.send(meshMessage, message.recipientId);
    message.status = 'mesh_queued';
    message.deliveryMethod = 'mesh';
  }

  // Send via hybrid approach (database + mesh backup)
  private async sendViaHybrid(message: UnifiedMessage, options: DeliveryOptions): Promise<void> {
    const promises: Promise<void>[] = [];

    // Try database first
    promises.push(
      this.attemptDatabaseSend(message).then(success => {
        if (success) {
          message.status = 'sent';
        } else {
          throw new Error('Database send failed');
        }
      }).catch(() => {
        // Database failed, mesh will handle it
      })
    );

    // Send via mesh as backup
    if (this.connectionStatus.mesh.initialized) {
      promises.push(this.sendViaMesh(message));
    }

    // Wait for at least one to succeed
    try {
      await Promise.race(promises.map(p => p.catch(() => { throw new Error('Method failed'); })));
    } catch (error) {
      throw new Error('All delivery methods failed');
    }
  }

  // Attempt database send based on message type
  private async attemptDatabaseSend(message: UnifiedMessage): Promise<boolean> {
    try {
      switch (message.type) {
        case 'direct':
          return await this.sendDirectMessage(message);
        case 'circle':
          return await this.sendCircleMessage(message);
        case 'journal':
          return await this.sendJournalEntry(message);
        default:
          throw new Error(`Unsupported message type: ${message.type}`);
      }
    } catch (error) {
      console.error(`🌟 Database send failed for ${message.type}:`, error);
      return false;
    }
  }

  // Send direct message to database
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

    return !error;
  }

  // Send circle message to database
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

    return !error;
  }

  // Send journal entry to database
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

    return !error;
  }

  // Handle incoming mesh messages
  private async handleIncomingMeshMessage(meshMessage: SacredMeshMessage, senderId: string): Promise<void> {
    console.log('🌟 Received mesh message from:', senderId);

    const unifiedMessage: UnifiedMessage = {
      id: crypto.randomUUID(),
      type: 'direct', // Default type, could be extracted from mesh message if needed
      senderId,
      content: meshMessage.note || '',
      metadata: {},
      timestamp: new Date(),
      deliveryMethod: 'mesh',
      status: 'delivered'
    };

    // Notify handlers
    const handler = this.messageHandlers.get(unifiedMessage.type);
    if (handler) {
      handler(unifiedMessage);
    }

    // Try to sync to database if connection is available
    if (this.connectionStatus.database) {
      try {
        await this.attemptDatabaseSend(unifiedMessage);
        console.log('🌟 Mesh message synced to database');
      } catch (error) {
        console.warn('🌟 Failed to sync mesh message to database:', error);
      }
    }
  }

  // Register message handler for specific message type
  registerMessageHandler(type: MessageType, handler: (message: UnifiedMessage) => void): void {
    this.messageHandlers.set(type, handler);
  }

  // Determine optimal delivery method
  private determineDeliveryMethod(options: DeliveryOptions): DeliveryMethod {
    if (options.preferMesh) return 'mesh';
    
    if (!this.connectionStatus.database && this.connectionStatus.mesh.initialized) {
      return 'mesh';
    }
    
    if (this.connectionStatus.database && this.config.meshAsFallback) {
      return 'hybrid';
    }
    
    return this.connectionStatus.database ? 'database' : 'mesh';
  }

  // Create mesh payload with sigils
  private createMeshPayload(content: string, context: MessageContext) {
    return {
      sigils: this.extractSigils(content),
      intentStrength: this.calculateIntentStrength(content, context),
      ttl: context.type === 'journal' ? 86400 : 3600, // Journal entries last longer
      hopLimit: context.visibility === 'circle' ? 3 : 5
    };
  }

  // Extract sigils from content (quantum intention compression)
  private extractSigils(content: string): string[] {
    const words = content.toLowerCase().split(/\s+/);
    const intentWords = words.filter(word => 
      word.length > 3 && 
      !['the', 'and', 'but', 'for', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should'].includes(word)
    );
    
    // Take most meaningful words as sigils (max 5)
    return intentWords.slice(0, 5);
  }

  // Calculate intent strength based on content and context
  private calculateIntentStrength(content: string, context: MessageContext): number {
    let strength = 0.5;
    
    // Boost for emotional content
    const emotionalWords = ['love', 'peace', 'joy', 'gratitude', 'sacred', 'divine', 'blessing'];
    const emotionalCount = emotionalWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    strength += emotionalCount * 0.1;
    
    // Boost for journal entries (more personal)
    if (context.type === 'journal') strength += 0.2;
    
    // Boost for circle messages (collective intent)
    if (context.type === 'circle') strength += 0.15;
    
    return Math.min(1.0, strength);
  }

  // Monitor connection health
  private monitorConnections(): void {
    // Database connection monitoring
    window.addEventListener('online', () => {
      this.updateConnectionStatus('database', true);
      this.processRetryQueue();
    });

    window.addEventListener('offline', () => {
      this.updateConnectionStatus('database', false);
    });

    // Mesh status monitoring
    setInterval(async () => {
      if (this.config.meshEnabled && this.sacredMesh) {
        try {
          const status = await this.sacredMesh.getStatus();
          this.connectionStatus.mesh = {
            initialized: status.initialized,
            transports: status.transports,
            activeConnections: Object.values(status.transports).filter(Boolean).length,
            queueSize: status.queue.size
          };
        } catch (error) {
          console.warn('🌟 Failed to get mesh status:', error);
        }
      }
    }, 10000);
  }

  // Update connection status
  private updateConnectionStatus(type: 'database' | 'mesh', status: boolean): void {
    if (type === 'database') {
      this.connectionStatus.database = status;
    }
    this.connectionStatus.lastSync = new Date();
  }

  // Start sync process for queued messages
  private startSyncProcess(): void {
    this.syncInterval = setInterval(() => {
      this.processMessageQueue();
      this.processRetryQueue();
      this.processBatchQueue();
    }, 5000);
  }

  // Process message queue
  private async processMessageQueue(): Promise<void> {
    if (this.messageQueue.length === 0) return;

    const messagesToProcess = this.messageQueue.splice(0, this.config.batchSize);
    
    for (const message of messagesToProcess) {
      try {
        await this.routeMessage(message, { enableRetry: true });
      } catch (error) {
        console.warn('🌟 Failed to process queued message:', error);
        this.addToRetryQueue(message);
      }
    }
  }

  // Process retry queue
  private async processRetryQueue(): Promise<void> {
    if (this.retryQueue.length === 0) return;

    const now = new Date();
    const messagesToRetry = this.retryQueue.filter(message => {
      const timeSinceLastRetry = message.lastRetry ? 
        now.getTime() - message.lastRetry.getTime() : 
        now.getTime() - message.timestamp.getTime();
      
      return timeSinceLastRetry > 30000 && // 30 second delay
             (message.retryCount || 0) < this.config.retryAttempts;
    });

    for (const message of messagesToRetry) {
      try {
        message.retryCount = (message.retryCount || 0) + 1;
        message.lastRetry = now;
        await this.routeMessage(message, { enableRetry: false });
        
        // Remove from retry queue on success
        this.retryQueue = this.retryQueue.filter(m => m.id !== message.id);
      } catch (error) {
        console.warn(`🌟 Retry ${message.retryCount} failed for message ${message.id}:`, error);
        
        // Remove if max retries reached
        if ((message.retryCount || 0) >= this.config.retryAttempts) {
          this.retryQueue = this.retryQueue.filter(m => m.id !== message.id);
          message.status = 'failed';
        }
      }
    }
  }

  // Process batch queue
  private async processBatchQueue(): Promise<void> {
    // Implementation for batch processing
    // This would handle scheduled messages and batch operations
  }

  // Add message to retry queue
  private addToRetryQueue(message: UnifiedMessage): void {
    if (!this.retryQueue.find(m => m.id === message.id)) {
      this.retryQueue.push(message);
    }
  }

  // Get current user ID
  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'anonymous';
  }

  // Get connection status
  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  // Get queue stats
  getQueueStats() {
    return {
      messageQueue: this.messageQueue.length,
      retryQueue: this.retryQueue.length,
      batchQueue: this.batchQueue.length,
      totalPending: this.messageQueue.length + this.retryQueue.length
    };
  }

  // Cleanup
  async disconnect(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    if (this.sacredMesh) {
      await this.sacredMesh.disconnect();
    }
    
    this.isInitialized = false;
    console.log('🌟 Unified Messaging Service disconnected');
  }
}

export default UnifiedMessagingService;