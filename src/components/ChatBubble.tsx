import { useState } from 'react';
import { MessageCircle, Users, X, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CreateCircleModal } from '@/components/CreateCircleModal';
import { StartDirectMessageModal } from '@/components/StartDirectMessageModal';
import { DirectMessageInterface } from '@/components/DirectMessageInterface';

interface ChatBubbleProps {
  className?: string;
}

type ChatView = 'conversations' | 'circles' | 'new-message' | 'dm-chat';

export const ChatBubble = ({ className }: ChatBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<ChatView>('conversations');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCircle, setShowCreateCircle] = useState(false);
  const [showStartDM, setShowStartDM] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<{ name?: string; avatar?: string } | null>(null);

  const { user } = useAuth();
  const { conversations, loading: dmLoading } = useDirectMessages();
  const { circles, loading: circlesLoading } = useSacredCircles();

  const unreadCount = conversations.filter(conv => 
    conv.last_message && !conv.last_message.is_read
  ).length;

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
    return date.toLocaleDateString();
  };

  const handleUserSelect = async (userId: string) => {
    // Fetch user profile data to pass to DM interface
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', userId)
        .single();

      setSelectedUserId(userId);
      setSelectedUserProfile({
        name: profile?.display_name,
        avatar: profile?.avatar_url
      });
      setActiveView('dm-chat');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleConversationClick = (conversation: any) => {
    const otherParticipantId = conversation.participant_1_id === user?.id 
      ? conversation.participant_2_id 
      : conversation.participant_1_id;
    
    setSelectedUserId(otherParticipantId);
    setSelectedUserProfile({
      name: conversation.other_participant?.display_name,
      avatar: conversation.other_participant?.avatar_url
    });
    setActiveView('dm-chat');
  };

  const handleBackToConversations = () => {
    setActiveView('conversations');
    setSelectedUserId(null);
    setSelectedUserProfile(null);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_participant?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCircles = circles.filter(circle =>
    circle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("relative", className)}>
      {/* Chat Bubble */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center text-xs font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <Card className="w-80 h-96 flex flex-col shadow-2xl animate-scale-in bg-background/95 backdrop-blur-sm border-2">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Messages</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b bg-muted/30">
            <Button
              variant={activeView === 'conversations' ? 'secondary' : 'ghost'}
              size="sm"
              className="flex-1 rounded-none"
              onClick={() => setActiveView('conversations')}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              DMs
            </Button>
            <Button
              variant={activeView === 'circles' ? 'secondary' : 'ghost'}
              size="sm"
              className="flex-1 rounded-none"
              onClick={() => setActiveView('circles')}
            >
              <Users className="h-4 w-4 mr-1" />
              Circles
            </Button>
            <Button
              variant={activeView === 'new-message' ? 'secondary' : 'ghost'}
              size="sm"
              className="flex-1 rounded-none"
              onClick={() => setActiveView('new-message')}
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>

          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeView === 'conversations' ? 'conversations' : 'circles'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-8 bg-background/50"
              />
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-2">
            {activeView === 'conversations' && (
              <div className="space-y-1">
                {dmLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs">Start a new conversation!</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.other_participant?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                            {getInitials(conversation.other_participant?.display_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {conversation.other_participant?.display_name || 'Unknown User'}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.last_message_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.last_message?.content || 'No messages yet'}
                        </p>
                      </div>
                      {conversation.last_message && !conversation.last_message.is_read && (
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeView === 'circles' && (
              <div className="space-y-1">
                {circlesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : filteredCircles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No Sacred Circles yet</p>
                    <p className="text-xs">Join or create a circle!</p>
                  </div>
                ) : (
                  filteredCircles.map((circle) => (
                    <div
                      key={circle.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">{circle.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {circle.member_count || 0}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {circle.description || 'Sacred Circle'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeView === 'new-message' && (
              <div className="space-y-3 py-4">
                <Button 
                  className="w-full justify-start gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="sm"
                  onClick={() => setShowStartDM(true)}
                >
                  <MessageCircle className="h-4 w-4" />
                  Start Direct Message
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-dashed hover:bg-accent/50"
                  size="sm"
                  onClick={() => setShowCreateCircle(true)}
                >
                  <Plus className="h-4 w-4" />
                  Create Sacred Circle
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 hover:bg-accent/50"
                  size="sm"
                >
                  <Users className="h-4 w-4" />
                  Join Sacred Circle
                </Button>
              </div>
            )}

            {activeView === 'dm-chat' && selectedUserId && selectedUserProfile && (
              <div className="h-full">
                <DirectMessageInterface
                  recipientId={selectedUserId}
                  recipientName={selectedUserProfile.name}
                  recipientAvatar={selectedUserProfile.avatar}
                  onClose={handleBackToConversations}
                  className="h-full"
                />
              </div>
            )}
          </ScrollArea>
        </Card>
      )}

      <CreateCircleModal 
        open={showCreateCircle} 
        onOpenChange={setShowCreateCircle} 
      />

      <StartDirectMessageModal
        isOpen={showStartDM}
        onClose={() => setShowStartDM(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
};