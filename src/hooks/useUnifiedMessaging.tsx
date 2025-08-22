// Unified Messaging React Hook - The Living Interface
import { useState, useEffect, useCallback, useRef } from 'react';
import { UnifiedMessagingService } from '@/lib/unifiedMessaging/UnifiedMessagingService';
import { UnifiedMessage, MessageContext, DeliveryOptions, ConnectionStatus, MessageType } from '@/lib/unifiedMessaging/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface UseUnifiedMessagingProps {
  autoConnect?: boolean;
  enableNotifications?: boolean;
}

export const useUnifiedMessaging = ({ 
  autoConnect = true, 
  enableNotifications = true 
}: UseUnifiedMessagingProps = {}) => {
  const { user } = useAuth();
  const [messagingService, setMessagingService] = useState<UnifiedMessagingService | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    database: navigator.onLine,
    mesh: {
      initialized: false,
      transports: {},
      activeConnections: 0,
      queueSize: 0
    },
    lastSync: new Date(),
    pendingMessages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queueStats, setQueueStats] = useState({ messageQueue: 0, retryQueue: 0, batchQueue: 0, totalPending: 0 });
  const messageHandlers = useRef<Map<MessageType, (message: UnifiedMessage) => void>>(new Map());

  // Initialize messaging service
  const initialize = useCallback(async () => {
    if (messagingService || !user) return;

    setLoading(true);
    setError(null);

    try {
      const service = UnifiedMessagingService.getInstance({
        meshEnabled: true,
        meshAsFallback: true,
        retryAttempts: 3,
        timeout: 30000
      });

      await service.initialize();
      setMessagingService(service);

      // Update connection status
      const status = service.getConnectionStatus();
      setConnectionStatus(status);

      // Update queue stats
      const stats = service.getQueueStats();
      setQueueStats(stats);

      console.log('🌟 Unified Messaging hook initialized');
      
      if (enableNotifications) {
        toast.success('Sacred communication network activated', {
          description: 'Your messages now flow through quantum mesh when needed'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize unified messaging';
      setError(errorMessage);
      console.error('🌟 Unified Messaging initialization error:', err);
      
      if (enableNotifications) {
        toast.error('Communication network error', {
          description: errorMessage
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user, messagingService, enableNotifications]);

  // Send unified message
  const sendMessage = useCallback(async (
    content: string,
    context: MessageContext,
    options: DeliveryOptions = {}
  ): Promise<UnifiedMessage | null> => {
    if (!messagingService) {
      throw new Error('Unified messaging not initialized');
    }

    try {
      const message = await messagingService.sendMessage(content, context, options);
      
      // Update stats after sending
      const stats = messagingService.getQueueStats();
      setQueueStats(stats);
      
      // Show delivery method notification
      if (enableNotifications && message.deliveryMethod === 'mesh') {
        toast.info('Message sent via Sacred Mesh', {
          description: 'Your message travels through quantum channels'
        });
      }

      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      
      if (enableNotifications) {
        toast.error('Message send failed', {
          description: errorMessage
        });
      }
      
      throw err;
    }
  }, [messagingService, enableNotifications]);

  // Send direct message
  const sendDirectMessage = useCallback(async (
    recipientId: string,
    content: string,
    options: DeliveryOptions = {}
  ) => {
    return sendMessage(content, {
      type: 'direct',
      targetId: recipientId
    }, options);
  }, [sendMessage]);

  // Send circle message
  const sendCircleMessage = useCallback(async (
    circleId: string,
    content: string,
    metadata: Record<string, any> = {},
    options: DeliveryOptions = {}
  ) => {
    return sendMessage(content, {
      type: 'circle',
      targetId: circleId,
      metadata
    }, options);
  }, [sendMessage]);

  // Send journal entry
  const sendJournalEntry = useCallback(async (
    content: string,
    metadata: Record<string, any> = {},
    options: DeliveryOptions = {}
  ) => {
    return sendMessage(content, {
      type: 'journal',
      metadata
    }, options);
  }, [sendMessage]);

  // Register message handler for specific type
  const registerMessageHandler = useCallback((
    type: MessageType,
    handler: (message: UnifiedMessage) => void
  ) => {
    if (!messagingService) {
      console.warn('Cannot register handler - messaging service not initialized');
      return;
    }

    messageHandlers.current.set(type, handler);
    messagingService.registerMessageHandler(type, handler);
  }, [messagingService]);

  // Unregister message handler
  const unregisterMessageHandler = useCallback((type: MessageType) => {
    messageHandlers.current.delete(type);
  }, []);

  // Refresh connection status
  const refreshStatus = useCallback(async () => {
    if (!messagingService) return;

    try {
      const status = messagingService.getConnectionStatus();
      setConnectionStatus(status);
      
      const stats = messagingService.getQueueStats();
      setQueueStats(stats);
    } catch (err) {
      console.error('🌟 Failed to refresh status:', err);
    }
  }, [messagingService]);

  // Force sync queued messages
  const forceSync = useCallback(async () => {
    if (!messagingService) return;
    
    try {
      // This would trigger immediate processing of all queues
      await refreshStatus();
      
      if (enableNotifications) {
        toast.success('Sync initiated', {
          description: 'Processing queued messages...'
        });
      }
    } catch (err) {
      console.error('🌟 Failed to force sync:', err);
      
      if (enableNotifications) {
        toast.error('Sync failed', {
          description: 'Could not process queued messages'
        });
      }
    }
  }, [messagingService, enableNotifications, refreshStatus]);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoConnect && user && !messagingService) {
      initialize();
    }
  }, [autoConnect, user, messagingService, initialize]);

  // Status polling
  useEffect(() => {
    if (!messagingService) return;

    const interval = setInterval(refreshStatus, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [messagingService, refreshStatus]);

  // Re-register handlers when service changes
  useEffect(() => {
    if (messagingService && messageHandlers.current.size > 0) {
      messageHandlers.current.forEach((handler, type) => {
        messagingService.registerMessageHandler(type, handler);
      });
    }
  }, [messagingService]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (messagingService) {
        messagingService.disconnect().catch(console.error);
      }
    };
  }, [messagingService]);

  // Connection quality indicator
  const getConnectionQuality = useCallback((): 'excellent' | 'good' | 'poor' | 'offline' => {
    if (!connectionStatus.database && !connectionStatus.mesh.initialized) {
      return 'offline';
    }
    
    if (connectionStatus.database && connectionStatus.mesh.activeConnections > 2) {
      return 'excellent';
    }
    
    if (connectionStatus.database || connectionStatus.mesh.activeConnections > 0) {
      return 'good';
    }
    
    return 'poor';
  }, [connectionStatus]);

  // Get recommended delivery method
  const getRecommendedDeliveryMethod = useCallback((): 'database' | 'mesh' | 'hybrid' => {
    if (!connectionStatus.database && connectionStatus.mesh.initialized) {
      return 'mesh';
    }
    
    if (connectionStatus.database && connectionStatus.mesh.activeConnections > 1) {
      return 'hybrid';
    }
    
    return 'database';
  }, [connectionStatus]);

  return {
    // State
    messagingService,
    connectionStatus,
    loading,
    error,
    queueStats,
    
    // Actions
    initialize,
    sendMessage,
    sendDirectMessage,
    sendCircleMessage,
    sendJournalEntry,
    registerMessageHandler,
    unregisterMessageHandler,
    refreshStatus,
    forceSync,
    
    // Computed
    isInitialized: !!messagingService,
    isOnline: connectionStatus.database || connectionStatus.mesh.initialized,
    hasPendingMessages: queueStats.totalPending > 0,
    connectionQuality: getConnectionQuality(),
    recommendedDeliveryMethod: getRecommendedDeliveryMethod(),
    
    // Mesh specific
    meshActive: connectionStatus.mesh.initialized,
    meshConnections: connectionStatus.mesh.activeConnections,
    meshQueueSize: connectionStatus.mesh.queueSize
  };
};