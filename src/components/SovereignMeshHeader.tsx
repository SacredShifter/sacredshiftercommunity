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

  // ... keep existing code (useEffect hooks)

  const getConnectionIcon = () => {
    switch (connectionStatus.type) {
      case 'mesh':
        return <Network className="h-3 w-3 text-violet-400 mesh-pulse" />;
      case 'wifi':
        return <Wifi className="h-3 w-3 text-blue-400" />;
      case 'offline':
        return <WifiOff className="h-3 w-3 text-orange-400" />;
      default:
        return <Globe className="h-3 w-3 text-gray-400" />;
    }
  };

  const getSyncIcon = () => {
    if (connectionStatus.syncing) {
      return <Activity className="h-2 w-2 text-green-400 animate-pulse" />;
    }
    if (offlineQueue > 0) {
      return <CloudOff className="h-2 w-2 text-orange-400" />;
    }
    return <Cloud className="h-2 w-2 text-emerald-400" />;
  };

  return (
    <div className="flex items-center gap-2 text-xs border-l border-border/30 pl-2 md:pl-4">
      {/* Privacy/Sovereignty Indicator */}
      <TooltipWrapper content="Your data is encrypted and sovereign - completely under your control">
        <div className="flex items-center gap-1">
          <Lock className="h-3 w-3 text-emerald-400" />
          <span className="hidden sm:inline font-medium">Sovereign</span>
        </div>
      </TooltipWrapper>

      {/* Field Resonance Meter */}
      <TooltipWrapper content="Collective consciousness field strength - measures coherence across the Sacred Shifter network">
        <div className="flex items-center gap-1">
          <span className="hidden md:inline text-muted-foreground">Field</span>
          <div className="resonance-meter-small">
            <div 
              className="resonance-fill" 
              style={{ '--resonance-level': `${resonanceLevel}%` } as React.CSSProperties}
            />
          </div>
          <span className="font-mono text-primary font-medium text-xs">{Math.round(resonanceLevel)}%</span>
        </div>
      </TooltipWrapper>

      {/* Connection Status */}
      <TooltipWrapper content={`${connectionStatus.label} - ${connectionStatus.strength}% strength${offlineQueue > 0 ? ` • ${offlineQueue} items queued` : ''}`}>
        <div className="flex items-center gap-1">
          {getConnectionIcon()}
          <span className="hidden lg:inline font-medium">{connectionStatus.label}</span>
          {connectionStatus.strength > 0 && (
            <Badge variant="outline" className="text-xs px-1 py-0 h-3 text-xs">
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
            <Badge variant="secondary" className="text-xs px-1 py-0 h-3">
              {offlineQueue}
            </Badge>
          )}
        </div>
      </TooltipWrapper>
    </div>
  );
};