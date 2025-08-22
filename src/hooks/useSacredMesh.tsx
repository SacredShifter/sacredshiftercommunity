// Sacred Mesh React Hook
import { useState, useEffect, useCallback } from 'react';
import { SacredMesh, SacredMeshMessage, MeshConfig } from '@/lib/sacredMesh';

interface UseSacredMeshProps {
  config?: Partial<MeshConfig>;
  autoConnect?: boolean;
}

interface MeshStatus {
  initialized: boolean;
  transports: Record<string, boolean>;
  queue: { size: number; oldestAge: number };
}

export const useSacredMesh = ({ config, autoConnect = true }: UseSacredMeshProps = {}) => {
  const [mesh, setMesh] = useState<SacredMesh | null>(null);
  const [status, setStatus] = useState<MeshStatus>({
    initialized: false,
    transports: {},
    queue: { size: 0, oldestAge: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Sacred Mesh
  const initialize = useCallback(async () => {
    if (mesh?.getStatus) {
      const currentStatus = await mesh.getStatus();
      if (currentStatus.initialized) return;
    }

    setLoading(true);
    setError(null);

    try {
      const newMesh = new SacredMesh(config);
      await newMesh.initialize();
      setMesh(newMesh);
      
      // Update status
      const meshStatus = await newMesh.getStatus();
      setStatus(meshStatus);
      
      console.log('🕸️ Sacred Mesh hook initialized');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Sacred Mesh';
      setError(errorMessage);
      console.error('🕸️ Sacred Mesh initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, [config, mesh]);

  // Send message through Sacred Mesh
  const sendMessage = useCallback(async (message: SacredMeshMessage, recipientId?: string) => {
    if (!mesh) {
      throw new Error('Sacred Mesh not initialized');
    }

    try {
      await mesh.send(message, recipientId);
      
      // Update status after sending
      const newStatus = await mesh.getStatus();
      setStatus(newStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    }
  }, [mesh]);

  // Register message handler
  const onMessage = useCallback((callback: (message: SacredMeshMessage, senderId: string) => void) => {
    if (!mesh) {
      console.warn('🕸️ Cannot register message handler - Sacred Mesh not initialized');
      return;
    }

    mesh.onMessage(callback);
  }, [mesh]);

  // Add contact
  const addContact = useCallback(async (contactId: string, publicKey: CryptoKey) => {
    if (!mesh) {
      throw new Error('Sacred Mesh not initialized');
    }

    return await mesh.addContact(contactId, publicKey);
  }, [mesh]);

  // Refresh status
  const refreshStatus = useCallback(async () => {
    if (!mesh) return;

    try {
      const newStatus = await mesh.getStatus();
      setStatus(newStatus);
    } catch (err) {
      console.error('🕸️ Failed to refresh status:', err);
    }
  }, [mesh]);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoConnect && !mesh) {
      initialize();
    }
  }, [autoConnect, initialize, mesh]);

  // Status polling
  useEffect(() => {
    if (!mesh) return;

    const interval = setInterval(refreshStatus, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [mesh, refreshStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mesh) {
        mesh.disconnect().catch(console.error);
      }
    };
  }, [mesh]);

  return {
    // State
    mesh,
    status,
    loading,
    error,
    
    // Actions
    initialize,
    sendMessage,
    onMessage,
    addContact,
    refreshStatus,
    
    // Computed
    isConnected: status.initialized,
    hasActiveTransports: Object.values(status.transports).some(Boolean),
    queuedMessages: status.queue.size
  };
};