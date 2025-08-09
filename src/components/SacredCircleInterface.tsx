// This file is now merged. Duplicate in src/components can be deleted.
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { CircleSettingsModal } from './CircleSettingsModal';
import { AddMemberModal } from './AddMemberModal';
import { 
  Send, 
  Users, 
  Settings, 
  UserPlus, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  MessageSquare,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SacredCircleInterfaceProps {
  circleId: string;
  circleName?: string;
  onClose?: () => void;
  className?: string;
  isMaximized?: boolean;
  isMinimized?: boolean;
  onMaximize?: () => void;
  onMinimize?: () => void;
  onRestore?: () => void;
}

interface SharedEntry {
  id: string;
  title: string;
  content: string;
  shared_by: string;
  shared_at: string;
  profiles?: {
    display_name?: string;
    avatar_url?: string;
  };
}

interface CircleMember {
  id: string;
  display_name: string;
  avatar_url?: string;
  role: string;
  isOnline: boolean;
}

export const SacredCircleInterface: React.FC<SacredCircleInterfaceProps> = ({
  circleId,
  circleName = 'Sacred Circle',
  onClose,
  className,
  isMaximized = false,
  isMinimized = false,
  onMaximize,
  onMinimize,
  onRestore
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const [sharedEntries, setSharedEntries] = useState<SharedEntry[]>([]);
  const [loadingShares, setLoadingShares] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [members, setMembers] = useState<CircleMember[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    circles,
    messages,
    loading,
    sendMessage,
    fetchRecentMessages,
    fetchCircles
  } = useSacredCircles();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch messages and shared entries on mount
  useEffect(() => {
    if (circleId) {
      fetchRecentMessages(circleId);
      fetchSharedEntries();
      fetchMembers();
    }
  }, [circleId, fetchRecentMessages]);

  const fetchSharedEntries = async () => {
    if (!circleId) return;

    setLoadingShares(true);
    try {
      // This would fetch shared registry entries - placeholder for now
      setSharedEntries([]);
    } catch (error) {
      console.error('Error fetching shared entries:', error);
    } finally {
      setLoadingShares(false);
    }
  };

  const fetchMembers = async () => {
    if (!circleId) return;

    try {
      // Fetch circle members - placeholder for now
      setMembers([
        {
          id: user?.id || '',
          display_name: 'You',
          role: 'member',
          isOnline: true
        }
      ]);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const success = await sendMessage(newMessage.trim(), 'circle', {
        chakraTag: 'heart',
        tone: 'harmonious',
        circleId: circleId
      });

      if (success) {
        setNewMessage('');
        inputRef.current?.focus();
        
        toast({
          title: "Message sent",
          description: "Your sacred message has been shared with the circle.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentCircle = circles.find(c => c.id === circleId);

  return (
    <div className={cn("flex flex-col h-full bg-background border rounded-lg", className)}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5",
        isMinimized && "hidden"
      )}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{circleName}</h3>
            <p className="text-xs text-muted-foreground">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddMember(true)}
            className="h-8 w-8 p-0"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
          {onMaximize && !isMaximized && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMaximize}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          {onMinimize && !isMinimized && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          )}
          {onRestore && (isMaximized || isMinimized) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRestore}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Shared
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="flex-1 flex flex-col mt-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium mb-1">Welcome to the Sacred Circle</p>
                    <p className="text-sm">Share your wisdom and connect with fellow souls</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.profiles?.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(message.profiles?.display_name || 'SS')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {message.profiles?.display_name || 'Sacred Seeker'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.created_at)}
                          </span>
                          {message.chakra_tag && (
                            <Badge variant="outline" className="text-xs">
                              {message.chakra_tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-gradient-to-r from-muted/30 to-accent/10">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your sacred message..."
                    className="pr-10 resize-none bg-background/80 border-muted"
                  />
                </div>

                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="h-9 w-9 p-0 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Shared Tab */}
          <TabsContent value="shared" className="flex-1 mt-0">
            <ScrollArea className="h-full p-4">
              {loadingShares ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : sharedEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Share2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-1">No shared content yet</p>
                  <p className="text-sm">Registry entries shared with this circle will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sharedEntries.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg bg-card">
                      <h4 className="font-medium mb-2">{entry.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {entry.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Shared by {entry.profiles?.display_name}</span>
                        <span>•</span>
                        <span>{formatTime(entry.shared_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="flex-1 mt-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(member.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{member.display_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {member.isOnline ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs">Online</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Offline</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Settings Modal */}
      <CircleSettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        circleId={circleId}
        currentSettings={
          currentCircle ? {
            name: currentCircle.name,
            description: currentCircle.description,
            isPrivate: currentCircle.is_private,
            chakraFocus: currentCircle.chakra_focus,
            frequencyRange: currentCircle.frequency_range
          } : undefined
        }
        onSettingsUpdated={() => {
          fetchCircles();
          toast({
            title: "Settings Updated",
            description: "Circle settings have been refreshed.",
          });
        }}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        open={showAddMember}
        onOpenChange={setShowAddMember}
        circleId={circleId}
        onMemberAdded={() => {
          fetchMembers();
          toast({
            title: "Member Added",
            description: "New member has joined the Sacred Circle.",
          });
        }}
      />
    </div>
  );
};