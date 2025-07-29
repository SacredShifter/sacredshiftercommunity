import { useState, useRef, useEffect } from 'react';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Send, Smile, Image, Mic, Phone, Video, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { StartDirectMessageModal } from '@/components/StartDirectMessageModal';
import { EmojiPicker } from '@/components/EmojiPicker';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { ImageUploader } from '@/components/ImageUploader';
import { CallButtons } from '@/components/CallButtons';
import { toast } from 'sonner';

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showStartMessageModal, setShowStartMessageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Even if no conversation exists yet, show chat interface if user is selected
  const shouldShowChatInterface = selectedConversationId !== null;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const scrollArea = messagesEndRef.current.closest('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  };

  // Only scroll when new messages are added, not on re-renders
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]); // Only depend on length, not the entire messages array

  const handleSendMessage = async () => {
    if (!selectedConversationId || !newMessage.trim()) return;

    try {
      await sendMessage(selectedConversationId, newMessage.trim());
      setNewMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

  // Handlers for new functionality
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleVoiceRecording = async (audioBlob: Blob) => {
    try {
      // Convert audio blob to base64 for sending
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        // For now, we'll show a success message
        // In the future, this could be sent as an audio message
        toast.success('Voice message recorded! (Feature coming soon)');
        console.log('Voice recording received:', base64Audio);
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      toast.error('Failed to process voice recording');
    }
  };

  const handleImageSelect = async (file: File) => {
    try {
      // For now, we'll show a success message
      // In the future, this could upload the image and send as a message
      toast.success('Image selected! (Upload feature coming soon)');
      console.log('Image selected:', file.name, file.size);
    } catch (error) {
      toast.error('Failed to process image');
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
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
    <div className="h-screen flex bg-background/80 backdrop-blur-md">
      {/* Conversations Sidebar */}
      <div className={`${selectedConversationId ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r border-border/30 flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Messages</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowStartMessageModal(true)}
              className="text-primary hover:text-primary/80"
            >
              New Chat
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
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
                      isSelected ? 'bg-primary/10 border-primary/20' : 'bg-background/30'
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

      {/* Chat Area */}
      {shouldShowChatInterface ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border/30 bg-background/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSelectedConversationId(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials('Sacred Seeker')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Sacred Seeker</h3>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CallButtons 
                  userId={selectedConversationId} 
                  userName={`User ${selectedConversationId.slice(0, 8)}`} 
                />
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" style={{ height: 'calc(100vh - 200px)' }}>
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.sender_id === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwnMessage ? 'order-1' : ''}`}>
                        {!isOwnMessage && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {getInitials(`User ${message.sender_id}`)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              User {message.sender_id?.slice(0, 8)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 ${isOwnMessage ? 'text-right' : ''}`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border/30 bg-background/50">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <ImageUploader onImageSelect={handleImageSelect} />
                  <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
                <Textarea
                  ref={textareaRef}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  className="min-h-[40px] max-h-[120px] resize-none bg-background/70"
                  style={{ height: 'auto' }}
                />
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Welcome Screen
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
            <p className="text-muted-foreground mb-4">
              Choose from your existing conversations or start a new one
            </p>
            <Button onClick={() => setShowStartMessageModal(true)}>
              New Message
            </Button>
          </div>
        </div>
      )}

      <StartDirectMessageModal
        isOpen={showStartMessageModal}
        onClose={() => setShowStartMessageModal(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
}