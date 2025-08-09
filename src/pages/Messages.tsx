import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { useDirectMessages, ConversationWithProfiles } from '@/hooks/useDirectMessages';
import { DirectMessageInterface } from '@/components/DirectMessageInterface';
import { StartDirectMessageModal } from '@/components/StartDirectMessageModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Search, Plus, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Messages() {
  const { user } = useAuth();
  const { conversations, loading, error, fetchConversations } = useDirectMessages();
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithProfiles | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // Helper function to safely format dates
  const formatSafeDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown time';
    
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown time';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    const otherParticipantName = conv.participant_2_display_name || 'Sacred Seeker';
    return otherParticipantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (conv.last_message_content && conv.last_message_content.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getInitials = (name?: string | null) => {
    if (!name) return 'SS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (selectedConversation) {
    return (
      <DirectMessageInterface
        conversation={selectedConversation}
        onBack={() => setSelectedConversation(null)}
        className="h-full"
      />
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Sacred Messages</h1>
        </div>
        <Button onClick={() => setShowStartModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Error loading conversations: {error}</p>
          <Button onClick={fetchConversations} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && filteredConversations.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
          <p className="text-muted-foreground mb-4">
            Start connecting with other sacred seekers
          </p>
          <Button onClick={() => setShowStartModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Start Your First Conversation
          </Button>
        </div>
      )}

      {!loading && !error && filteredConversations.length > 0 && (
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {filteredConversations.map((conversation) => (
              <Card 
                key={`${conversation.participant_1_id}-${conversation.participant_2_id}`}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedConversation(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={conversation.participant_2_avatar_url || undefined} 
                        alt={conversation.participant_2_display_name || 'Sacred Seeker'} 
                      />
                      <AvatarFallback>
                        {getInitials(conversation.participant_2_display_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {conversation.participant_2_display_name || 'Sacred Seeker'}
                        </h3>
                        <div className="flex items-center gap-2">
                          {conversation.unread_count > 0 && (
                            <Badge variant="default" className="text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatSafeDate(conversation.last_message_created_at)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message_content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      <StartDirectMessageModal
        open={showStartModal}
        onOpenChange={setShowStartModal}
        onConversationStart={(conversation) => {
          setSelectedConversation(conversation);
          setShowStartModal(false);
        }}
      />
    </div>
  );
}