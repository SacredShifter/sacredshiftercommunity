import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSacredMesh } from '@/hooks/useSacredMesh';
import { SacredMeshMessage } from '@/lib/sacredMesh';
import { Wifi, WifiOff, Send, RefreshCw, Zap, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

export const SacredMeshTestInterface: React.FC = () => {
  const [sigilInput, setSigilInput] = useState('');
  const [intentStrength, setIntentStrength] = useState(5);
  const [note, setNote] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);

  const {
    mesh,
    status,
    loading,
    error,
    initialize,
    sendMessage,
    onMessage,
    isConnected,
    hasActiveTransports,
    queuedMessages
  } = useSacredMesh();

  // Set up message listener
  useEffect(() => {
    if (mesh) {
      console.log('🕸️ Setting up message listener...');
      onMessage((message, senderId) => {
        console.log('🕸️ Message received in UI:', message, 'from:', senderId);
        setReceivedMessages(prev => [...prev, {
          ...message,
          senderId,
          timestamp: new Date().toISOString()
        }]);
        toast.success(`Sacred message received from ${senderId.slice(0, 8)}...`);
      });
    }
  }, [mesh, onMessage]);

  const handleSendMessage = async () => {
    if (!sigilInput.trim()) {
      toast.error('Please enter at least one sigil');
      return;
    }

    try {
      const message: SacredMeshMessage = {
        sigils: sigilInput.split(',').map(s => s.trim()).filter(Boolean),
        intentStrength: intentStrength / 10, // Convert to 0-1 range
        note: note.trim() || undefined,
        ttl: 3600, // 1 hour
        hopLimit: 5
      };

      await sendMessage(message);
      toast.success('Sacred message sent through the mesh!');
      
      // Clear form
      setSigilInput('');
      setNote('');
    } catch (err) {
      toast.error('Failed to send message: ' + (err as Error).message);
    }
  };

  const getTransportStatus = () => {
    const activeCount = Object.values(status.transports).filter(Boolean).length;
    const totalCount = Object.keys(status.transports).length;
    return { active: activeCount, total: totalCount };
  };

  const transportStatus = getTransportStatus();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Sacred Mesh Test Interface
        </h2>
        <p className="text-muted-foreground mt-2">
          Test sigil-based messaging through the mesh network
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <div>
              <p className="font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
              <p className="text-sm text-muted-foreground">
                {transportStatus.active}/{transportStatus.total} transports active
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium">Encrypted</p>
              <p className="text-sm text-muted-foreground">
                XChaCha20-Poly1305
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-500" />
            <div>
              <p className="font-medium">Queue</p>
              <p className="text-sm text-muted-foreground">
                {queuedMessages} messages waiting
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">⚠️ Error: {error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={initialize}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Transport Status */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Transport Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(status.transports).map(([transport, active]) => (
            <Badge
              key={transport}
              variant={active ? "default" : "secondary"}
              className="justify-center"
            >
              {active ? "🟢" : "🔴"} {transport}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Send Message Form */}
      <Card className="p-6">
        <h3 className="font-medium mb-4 flex items-center">
          <Send className="h-4 w-4 mr-2" />
          Send Sacred Message
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Sigils (comma-separated)
            </label>
            <Input
              value={sigilInput}
              onChange={(e) => setSigilInput(e.target.value)}
              placeholder="harmony, protection, wisdom"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Intent Strength: {intentStrength}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intentStrength}
              onChange={(e) => setIntentStrength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Note (optional, max 96 bytes)
            </label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional message when bandwidth allows..."
              maxLength={96}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {note.length}/96 bytes
            </p>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!isConnected || loading || !sigilInput.trim()}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            Send Through Sacred Mesh
          </Button>
        </div>
      </Card>

      {/* Received Messages */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Received Messages</h3>
        <ScrollArea className="h-64">
          {receivedMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages received yet
            </div>
          ) : (
            <div className="space-y-3">
              {receivedMessages.map((msg, idx) => (
                <div key={idx} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-1">
                      {msg.sigils.map((sigil: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {sigil}
                        </Badge>
                      ))}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Strength: {Math.round(msg.intentStrength * 10)}/10
                    </Badge>
                  </div>
                  {msg.note && (
                    <p className="text-sm mb-2">{msg.note}</p>
                  )}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>From: {msg.senderId.slice(0, 8)}...</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
};