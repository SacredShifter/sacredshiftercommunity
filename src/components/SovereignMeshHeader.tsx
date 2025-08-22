import React, { useState, useEffect } from 'react';
import { Lock, Network, Wifi, WifiOff, Cloud, CloudOff, Activity, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';

interface ConnectionStatus {
  type: 'wifi' | 'mesh' | 'offline';
  strength: number;
  label: string;
  syncing: boolean;
}

export const SovereignMeshHeader = () => {
  const [resonanceLevel, setResonanceLevel] = useState(67);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    type: 'mesh',
    strength: 85,
    label: 'Sacred Mesh Active',
    syncing: false
  });
  const [offlineQueue, setOfflineQueue] = useState(0);

  // Simulate dynamic resonance
  useEffect(() => {
    const interval = setInterval(() => {
      setResonanceLevel(prev => {
        const change = (Math.random() - 0.5) * 8;
        return Math.max(30, Math.min(100, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate connection monitoring and switching
  useEffect(() => {
    const checkConnection = () => {
      if (!navigator.onLine) {
        setConnectionStatus({
          type: 'offline',
          strength: 0,
          label: 'Offline Mode',
          syncing: false
        });
        return;
      }

      // Simulate intelligent connection switching
      const meshAvailable = Math.random() > 0.3; // 70% chance mesh is available
      const wifiStrength = 40 + Math.random() * 60;
      const meshStrength = 60 + Math.random() * 40;

      if (meshAvailable && meshStrength > wifiStrength) {
        setConnectionStatus({
          type: 'mesh',
          strength: meshStrength,
          label: 'Sacred Mesh Active',
          syncing: Math.random() > 0.8
        });
      } else {
        setConnectionStatus({
          type: 'wifi',
          strength: wifiStrength,
          label: 'WiFi Connected',
          syncing: Math.random() > 0.7
        });
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    // Listen for online/offline events
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  // Simulate offline queue
  useEffect(() => {
    if (connectionStatus.type === 'offline') {
      const interval = setInterval(() => {
        setOfflineQueue(prev => prev + Math.floor(Math.random() * 3));
      }, 10000);
      return () => clearInterval(interval);
    } else if (offlineQueue > 0 && connectionStatus.syncing) {
      const syncInterval = setInterval(() => {
        setOfflineQueue(prev => Math.max(0, prev - Math.floor(Math.random() * 5 + 1)));
      }, 2000);
      return () => clearInterval(syncInterval);
    }
  }, [connectionStatus.type, connectionStatus.syncing, offlineQueue]);

  const getConnectionIcon = () => {
    switch (connectionStatus.type) {
      case 'mesh':
        return <Network className="h-4 w-4 text-violet-400 mesh-pulse" />;
      case 'wifi':
        return <Wifi className="h-4 w-4 text-blue-400" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-orange-400" />;
      default:
        return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSyncIcon = () => {
    if (connectionStatus.syncing) {
      return <Activity className="h-3 w-3 text-green-400 animate-pulse" />;
    }
    if (offlineQueue > 0) {
      return <CloudOff className="h-3 w-3 text-orange-400" />;
    }
    return <Cloud className="h-3 w-3 text-emerald-400" />;
  };

  return (
    <div className="sovereign-mesh-header">
      <div className="flex items-center gap-3 text-xs">
        {/* Privacy/Sovereignty Indicator */}
        <TooltipWrapper content="Your data is encrypted and sovereign - completely under your control">
          <div className="flex items-center gap-1 privacy-indicator">
            <Lock className="h-4 w-4 privacy-lock text-emerald-400" />
            <span className="font-medium">Sovereign</span>
          </div>
        </TooltipWrapper>

        {/* Field Resonance Meter */}
        <TooltipWrapper content="Collective consciousness field strength - measures coherence across the Sacred Shifter network">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Field</span>
            <div className="resonance-meter">
              <div 
                className="resonance-fill" 
                style={{ '--resonance-level': `${resonanceLevel}%` } as React.CSSProperties}
              />
            </div>
            <span className="font-mono text-primary font-medium">{Math.round(resonanceLevel)}%</span>
          </div>
        </TooltipWrapper>

        {/* Connection Status */}
        <TooltipWrapper content={`${connectionStatus.label} - ${connectionStatus.strength}% strength${offlineQueue > 0 ? ` • ${offlineQueue} items queued` : ''}`}>
          <div className="flex items-center gap-1 connection-indicator">
            {getConnectionIcon()}
            <span className="font-medium">{connectionStatus.label}</span>
            {connectionStatus.strength > 0 && (
              <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                {Math.round(connectionStatus.strength)}%
              </Badge>
            )}
          </div>
        </TooltipWrapper>

        {/* Sync Status */}
        <TooltipWrapper content={
          connectionStatus.syncing ? "Syncing data..." : 
          offlineQueue > 0 ? `${offlineQueue} items queued for sync` : 
          "All data synced"
        }>
          <div className="flex items-center gap-1">
            {getSyncIcon()}
            {offlineQueue > 0 && (
              <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                {offlineQueue}
              </Badge>
            )}
          </div>
        </TooltipWrapper>
      </div>
    </div>
  );
};