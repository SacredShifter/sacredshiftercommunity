import { useState, useRef, useEffect } from 'react';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalSignature } from '@/hooks/usePersonalSignature';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Eye, Heart, Brain, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { formatDistance } from 'date-fns/formatDistance';
import { StartDirectMessageModal } from '@/components/StartDirectMessageModal';
import { SacredQuantumMessageInterface } from '@/components/SacredQuantumMessageInterface';
import { SynchronicityThreads } from '@/components/SynchronicityThreads';
import { QuantumChatCore } from '@/components/QuantumChat/QuantumChatCore';
import { toast } from 'sonner';

export default function Messages() {
  const { user } = useAuth();
  const { signature } = usePersonalSignature();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showStartMessageModal, setShowStartMessageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'sacred' | 'quantum' | 'classic'>('sacred');
  const [showSynchronicity, setShowSynchronicity] = useState(false);
  // Remove old refs as they're not needed for the new sacred interface

  const {
    messages,
    conversations,
    loading,
    sendMessage,
    markAsRead,
    fetchMessages
  } = useDirectMessages(selectedConversationId || undefined);

  const selectedConversation = conversations.find(c => 
    selectedConversationId && (
      (c.participant_1_id === user?.id && c.participant_2_id === selectedConversationId) ||
      (c.participant_2_id === user?.id && c.participant_1_id === selectedConversationId)
    )
  );

  // Enhanced view mode based on user's consciousness development
  const getOptimalViewMode = () => {
    if (!signature) return 'sacred';
    
    const { temperament, cognitivePattern, preferences } = signature;
    
    if (preferences.visualComplexity > 0.8 && cognitivePattern === 'quantum') {
      return 'quantum';
    }
    
    if (temperament === 'contemplative' || preferences.contemplationDepth > 0.7) {
      return 'sacred';
    }
    
    return 'sacred'; // Default to sacred experience
  };

  // Auto-adapt view mode to user's consciousness signature
  useEffect(() => {
    if (signature && viewMode === 'sacred') {
      const optimalMode = getOptimalViewMode();
      if (optimalMode !== viewMode) {
        setViewMode(optimalMode);
        toast.success(`Interface adapted to your consciousness signature: ${optimalMode} mode`);
      }
    }
  }, [signature, viewMode]);

  const getInitials = (name?: string) => {
    if (!name) return 'SS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  const handleConversationSelect = (conversation: any) => {
    const otherUserId = conversation.participant_1_id === user?.id 
      ? conversation.participant_2_id 
      : conversation.participant_1_id;
    
    setSelectedConversationId(otherUserId);
    fetchMessages(otherUserId);
  };

  const handleUserSelect = async (userId: string) => {
    console.log('Selecting user:', userId);
    setSelectedConversationId(userId);
    setShowStartMessageModal(false);
    
    // Clear current messages and fetch new ones
    await fetchMessages(userId);
  };

  const filteredConversations = conversations.filter(conv => {
    // Add search functionality for conversations
    return true; // For now, show all conversations
  });

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] flex bg-gradient-to-br from-background via-background/90 to-primary/5 backdrop-blur-sm overflow-hidden -m-4 sm:-m-6 md:-m-8 relative">
      {/* Conversations Sidebar */}
      <div className={`${selectedConversationId ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r border-border/30 flex-col bg-background/40 backdrop-blur-md`}>
        {/* Enhanced Header with View Mode Controls */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sacred Messages
            </h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSynchronicity(!showSynchronicity)}
                className="text-primary hover:text-primary/80"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowStartMessageModal(true)}
                className="text-primary hover:text-primary/80"
              >
                New Chat
              </Button>
            </div>
          </div>
          
          {/* View Mode Selector */}
          <div className="flex items-center gap-1 mb-3 p-1 bg-muted/50 rounded-lg">
            {['sacred', 'quantum', 'classic'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode as any)}
                className="flex-1 text-xs"
              >
                {mode === 'sacred' && <Heart className="w-3 h-3 mr-1" />}
                {mode === 'quantum' && <Brain className="w-3 h-3 mr-1" />}
                {mode === 'classic' && <Eye className="w-3 h-3 mr-1" />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/20 border-primary/20"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No conversations yet</p>
              <Button onClick={() => setShowStartMessageModal(true)}>
                Start a conversation
              </Button>
            </div>
          ) : (
            <div className="p-2">
              {filteredConversations.map((conversation) => {
                const otherUserId = conversation.participant_1_id === user?.id 
                  ? conversation.participant_2_id 
                  : conversation.participant_1_id;
                const isSelected = selectedConversationId === otherUserId;
                
                return (
                  <Card
                    key={conversation.id}
                    className={`p-3 mb-2 cursor-pointer transition-all hover:bg-accent/50 ${
                      isSelected ? 'bg-primary/10 border-primary/20' : 'bg-background/10'
                    }`}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials('Sacred Seeker')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">Sacred Seeker</p>
                          {conversation.last_message_at && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conversation.last_message_at)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {messages.length > 0 ? messages[messages.length - 1].content : 'Start a conversation...'}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Sacred Communication Interface */}
      {selectedConversationId ? (
        <div className="flex-1 relative">
          {/* Render appropriate interface based on view mode */}
          {viewMode === 'sacred' && (
            <SacredQuantumMessageInterface
              selectedUserId={selectedConversationId}
              onBack={() => setSelectedConversationId(null)}
            />
          )}
          
          {viewMode === 'quantum' && (
            <QuantumChatCore
              roomId={`dm_${[user?.id, selectedConversationId].sort().join('_')}`}
              onClose={() => setSelectedConversationId(null)}
            />
          )}
          
          {viewMode === 'classic' && (
            <div className="h-full flex items-center justify-center">
              <Card className="p-8 text-center max-w-md">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Classic Mode</h3>
                <p className="text-muted-foreground mb-4">
                  Classic messaging interface coming soon...
                </p>
                <Button 
                  onClick={() => setViewMode('sacred')}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  Experience Sacred Mode
                </Button>
              </Card>
            </div>
          )}
        </div>
      ) : (
        // Welcome Screen
        <div className="hidden lg:flex flex-1 items-center justify-center relative">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sacred Communication Portal
            </h3>
            <p className="text-muted-foreground mb-4">
              Select a soul to begin consciousness-synchronized communication
            </p>
            <Button 
              onClick={() => setShowStartMessageModal(true)}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Begin Sacred Connection
            </Button>
          </div>
        </div>
      )}

      {/* Synchronicity Threads Overlay */}
      <SynchronicityThreads
        currentMessages={messages}
        isVisible={showSynchronicity}
        onToggle={() => setShowSynchronicity(!showSynchronicity)}
      />

      <StartDirectMessageModal
        isOpen={showStartMessageModal}
        onClose={() => setShowStartMessageModal(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
}