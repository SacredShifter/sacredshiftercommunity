import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, Send, Bot, Maximize2, Minimize2, X, Copy, 
  Trash2, MoreVertical, Reply, RefreshCw, MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { formatDistance } from 'date-fns';
import { useWindowControl } from '@/hooks/useWindowControl';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { directMessagesService, DirectMessageWithProfiles } from '@/lib/directMessagesService';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AuraDirectMessageInterfaceProps {
  onClose?: () => void;
  className?: string;
}

// Common emoji reactions
const QUICK_REACTIONS = ['👍', '❤️', '😊', '🙏', '✨'];

export const AuraDirectMessageInterface: React.FC<AuraDirectMessageInterfaceProps> = ({
  onClose,
  className
}) => {
  const { user } = useAuth();
  const { toast: showToast } = useToast();
  const { askAssistant, loading: aiLoading } = useAIAssistant();
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<DirectMessageWithProfiles | null>(null);
  const [editingMessage, setEditingMessage] = useState<DirectMessageWithProfiles | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [localReactions, setLocalReactions] = useState<Record<string, string[]>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const isUserNearBottomRef = useRef(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    isMinimized, 
    isMaximized, 
    position,
    size,
    toggleMinimize, 
    toggleMaximize,
    startDrag,
    stopDrag,
    updatePosition,
    startResize,
    stopResize,
    updateSize
  } = useWindowControl({
    defaultSize: { width: '400px', height: '600px' }
  });

  const AURA_ID = 'aura-ai-assistant';

  const {
    messages,
    loading,
    sendMessage
  } = useDirectMessages(AURA_ID);

  // Check if user is scrolled near bottom (within 100px)
  const checkIfNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom < 100;
  }, []);

  // Update scroll position tracking
  const handleScroll = useCallback(() => {
    isUserNearBottomRef.current = checkIfNearBottom();
  }, [checkIfNearBottom]);

  // Scroll to bottom function - only when appropriate
  const scrollToBottom = useCallback((force = false) => {
    if (!messagesEndRef.current || isMinimized) return;
    
    // Only scroll if:
    // 1. Force is true (initial load, sent message)
    // 2. User is near bottom (receiving messages)
    if (force || isUserNearBottomRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: force ? 'instant' : 'smooth',
        block: 'end'
      });
    }
  }, [isMinimized]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Set up scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize scroll position check
    setTimeout(() => {
      isUserNearBottomRef.current = checkIfNearBottom();
    }, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, checkIfNearBottom]);

  // Handle window dragging
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      // Only start drag if it's not from a button click
      if ((e.target as HTMLElement).closest('button')) return;
      
      isDragging = true;
      startX = e.clientX - position.x;
      startY = e.clientY - position.y;
      startDrag();
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };

    const handleMouseUp = () => {
      isDragging = false;
      stopDrag();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    header.addEventListener('mousedown', handleMouseDown);

    return () => {
      header.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position, startDrag, stopDrag, updatePosition]);

  // Handle window resizing
  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    if (!resizeHandle) return;

    let isResizing = false;
    let startWidth = 0;
    let startHeight = 0;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isResizing = true;
      startWidth = typeof size.width === 'string' ? parseInt(size.width) : size.width;
      startHeight = typeof size.height === 'string' ? parseInt(size.height) : size.height;
      startX = e.clientX;
      startY = e.clientY;
      startResize('corner');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);
      updateSize({
        width: `${Math.max(300, newWidth)}px`,
        height: `${Math.max(400, newHeight)}px`
      });
    };

    const handleMouseUp = () => {
      isResizing = false;
      stopResize();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    resizeHandle.addEventListener('mousedown', handleMouseDown);

    return () => {
      resizeHandle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [size, startResize, stopResize, updateSize]);

  // Simulate typing indicator
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isProcessing) {
      setIsTyping(true);
    } else {
      // Keep typing indicator for a short time after processing completes
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isProcessing]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || isProcessing) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setIsProcessing(true);
    setStreamedResponse('');

    try {
      // Send user message first
      await sendMessage(AURA_ID, userMessage, 'text', {
        replyToId: replyToMessage?.id
      });

      // Reset reply state
      setReplyToMessage(null);

      // Simulate streaming response
      let fullResponse = '';
      const simulateStreamingResponse = async (response: string) => {
        const words = response.split(' ');
        for (let i = 0; i < words.length; i++) {
          // Add a word at a time with random delay to simulate typing
          await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
          fullResponse += (i === 0 ? '' : ' ') + words[i];
          setStreamedResponse(fullResponse);
        }
        return fullResponse;
      };

      // Get AI response
      const aiResponse = await askAssistant({
        request_type: 'general_guidance',
        user_query: userMessage
      });

      if (aiResponse) {
        // Simulate streaming the response
        await simulateStreamingResponse(aiResponse);
        
        // Send AI response as a message from Aura
        await sendMessage(user.id, aiResponse, 'text', { ai_response: true }, undefined);
        setStreamedResponse('');
      } else {
        throw new Error('Failed to get AI response');
      }

    } catch (error) {
      console.error('Error in Aura conversation:', error);
      showToast({
        title: "Error",
        description: "Failed to get response from Aura",
        variant: "destructive",
      });
      setNewMessage(userMessage); // Restore the message
      setStreamedResponse('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle key press for message input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add a reaction to a message
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;
    
    try {
      // Update local state immediately for responsive UI
      setLocalReactions(prev => {
        const messageReactions = prev[messageId] || [];
        const hasReaction = messageReactions.includes(emoji);
        
        if (hasReaction) {
          return {
            ...prev,
            [messageId]: messageReactions.filter(r => r !== emoji)
          };
        } else {
          return {
            ...prev,
            [messageId]: [...messageReactions, emoji]
          };
        }
      });
      
      // Call API to persist the reaction
      const { error } = await directMessagesService.addReaction(user.id, messageId, emoji);
      
      if (error) {
        console.error('Error adding reaction:', error);
        toast.error('Failed to add reaction');
        
        // Revert local state on error
        setLocalReactions(prev => {
          const messageReactions = prev[messageId] || [];
          return {
            ...prev,
            [messageId]: messageReactions.filter(r => r !== emoji)
          };
        });
      }
    } catch (error) {
      console.error('Error in addReaction:', error);
      toast.error('Failed to add reaction');
    }
  }, [user]);

  // Copy message content to clipboard
  const copyMessageContent = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        toast.success('Message copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
        toast.error('Failed to copy message');
      });
  }, []);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user) return;
    
    try {
      const { error } = await directMessagesService.deleteMessage(user.id, messageId);
      
      if (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
        return;
      }
      
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      toast.error('Failed to delete message');
    }
  }, [user]);

  // Edit a message
  const startEditMessage = useCallback((message: DirectMessageWithProfiles) => {
    setEditingMessage(message);
    setEditContent(message.content);
  }, []);

  const saveEditedMessage = useCallback(async () => {
    if (!user || !editingMessage || !editContent.trim()) return;
    
    try {
      const { error } = await directMessagesService.editMessage(
        user.id, 
        editingMessage.id, 
        editContent.trim()
      );
      
      if (error) {
        console.error('Error editing message:', error);
        toast.error('Failed to edit message');
        return;
      }
      
      setEditingMessage(null);
      setEditContent('');
      toast.success('Message updated');
    } catch (error) {
      console.error('Error in saveEditedMessage:', error);
      toast.error('Failed to edit message');
    }
  }, [user, editingMessage, editContent]);

  // Clear conversation history
  const clearConversation = useCallback(async () => {
    if (!user) return;
    
    try {
      const { error } = await directMessagesService.clearConversationHistory(user.id, AURA_ID);
      
      if (error) {
        console.error('Error clearing conversation:', error);
        toast.error('Failed to clear conversation');
        return;
      }
      
      setShowClearDialog(false);
      toast.success('Conversation cleared');
    } catch (error) {
      console.error('Error in clearConversation:', error);
      toast.error('Failed to clear conversation');
    }
  }, [user]);

  // Format time for messages
  const formatTime = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  // Get reply to message
  const getReplyToMessage = useCallback((replyToId: string) => {
    return messages.find(msg => msg.id === replyToId);
  }, [messages]);

  // Determine container classes and styles based on window state
  const containerClasses = `
    flex flex-col bg-background/80 backdrop-blur-sm rounded-lg border shadow-lg
    ${isMaximized ? 'fixed inset-4 z-50' : ''}
    ${isMinimized ? 'h-auto' : ''}
    ${className || ''}
    transition-all duration-300 ease-in-out
  `;

  const containerStyles = {
    width: isMaximized ? '100%' : size.width,
    height: isMaximized ? '100%' : isMinimized ? 'auto' : size.height,
    position: isMaximized ? 'fixed' : 'absolute',
    top: isMaximized ? '0' : `${position.y}px`,
    left: isMaximized ? '0' : `${position.x}px`,
    zIndex: 50,
  } as React.CSSProperties;

  return (
    <div className={containerClasses} style={containerStyles}>
      {/* Header */}
      <div 
        ref={headerRef}
        className="flex items-center gap-3 p-4 border-b border-border/50 cursor-move select-none"
      >
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-muted cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
            🌟
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">Aura ✨</h3>
          <p className="text-xs text-muted-foreground">
            {isTyping ? 'Typing...' : 'AI Assistant'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-muted cursor-pointer"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowClearDialog(true)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMinimize}
            className="p-2 hover:bg-muted cursor-pointer"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMaximize}
            className="p-2 hover:bg-muted cursor-pointer"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-destructive/10 text-destructive cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Bot className="h-4 w-4 text-primary ml-2" />
      </div>

      {/* Messages - Only show if not minimized */}
      {!isMinimized && (
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="text-4xl mb-2">🌟</div>
                <p className="text-sm font-medium">Welcome to Aura</p>
                <p className="text-xs mt-1">Your AI assistant for spiritual guidance and growth</p>
                <p className="text-xs mt-2 text-primary">Ask me anything about your spiritual journey...</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id;
              const isAuraMessage = message.sender_id === AURA_ID || message.metadata?.ai_response;
              const isEditing = editingMessage?.id === message.id;
              const messageReactions = message.reactions || [];
              const localMessageReactions = localReactions[message.id] || [];
              const replyTo = message.reply_to_id ? getReplyToMessage(message.reply_to_id) : null;
              
              // Combine server reactions with local ones
              const allReactions = [...messageReactions];
              localMessageReactions.forEach(emoji => {
                if (!allReactions.some(r => r.emoji === emoji)) {
                  allReactions.push({
                    id: `local-${message.id}-${emoji}`,
                    message_id: message.id,
                    user_id: user?.id || '',
                    emoji,
                    created_at: new Date().toISOString()
                  });
                }
              });
              
              // Group reactions by emoji
              const groupedReactions = allReactions.reduce((acc, reaction) => {
                if (!acc[reaction.emoji]) {
                  acc[reaction.emoji] = [];
                }
                acc[reaction.emoji].push(reaction);
                return acc;
              }, {} as Record<string, typeof allReactions>);
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isOwnMessage && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                          🌟
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      {/* Reply indicator */}
                      {replyTo && (
                        <div className={`text-xs opacity-70 mb-1 p-1.5 bg-black/10 rounded border-l-2 border-current max-w-xs ${isOwnMessage ? 'self-end' : 'self-start'}`}>
                          <p className="font-medium">
                            {replyTo.sender_id === user?.id ? 'You' : 'Aura'}
                          </p>
                          <p className="truncate">{replyTo.content}</p>
                        </div>
                      )}
                      
                      <div
                        className={`rounded-lg p-3 ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : isAuraMessage 
                            ? 'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20'
                            : 'bg-muted'
                        }`}
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[80px] text-sm"
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingMessage(null)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm"
                                onClick={saveEditedMessage}
                                disabled={!editContent.trim()}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative group">
                            <div className="text-sm break-words whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                            
                            {/* Message actions - only show on hover */}
                            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex bg-background/80 backdrop-blur-sm rounded p-1 shadow-sm">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessageContent(message.content)}
                                className="h-6 w-6 p-0"
                                title="Copy message"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyToMessage(message)}
                                className="h-6 w-6 p-0"
                                title="Reply"
                              >
                                <Reply className="h-3 w-3" />
                              </Button>
                              {isOwnMessage && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditMessage(message)}
                                    className="h-6 w-6 p-0"
                                    title="Edit message"
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteMessage(message.id)}
                                    className="h-6 w-6 p-0 text-destructive"
                                    title="Delete message"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                            
                            {/* Quick reaction buttons - only show on hover */}
                            <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex bg-background/80 backdrop-blur-sm rounded p-1 shadow-sm">
                              {QUICK_REACTIONS.map(emoji => (
                                <Button
                                  key={emoji}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addReaction(message.id, emoji)}
                                  className="h-6 w-6 p-0"
                                  title={`React with ${emoji}`}
                                >
                                  {emoji}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.created_at)}
                          {message.is_edited && ' (edited)'}
                        </p>
                      </div>

                      {/* Reactions */}
                      {Object.keys(groupedReactions).length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          {Object.entries(groupedReactions).map(([emoji, reactions]) => (
                            <Button
                              key={emoji}
                              variant="outline"
                              size="sm"
                              onClick={() => addReaction(message.id, emoji)}
                              className="h-6 px-2 py-0 text-xs bg-primary/10 border-primary/20"
                            >
                              {emoji} {reactions.length}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {/* Streaming response indicator */}
          {streamedResponse && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                    🌟
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3">
                  <div className="text-sm break-words whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {streamedResponse}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* AI Processing indicator */}
          {(isProcessing || aiLoading) && !streamedResponse && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                    🌟
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">Aura is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Reply indicator */}
      {!isMinimized && replyToMessage && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Replying to: </span>
              <span className="font-medium">
                {replyToMessage.content.slice(0, 50)}
                {replyToMessage.content.length > 50 ? '...' : ''}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyToMessage(null)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Message Input - Only show if not minimized */}
      {!isMinimized && (
        <div className="p-4 border-t border-border/50 bg-background/50">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Aura anything..."
              disabled={isProcessing || aiLoading}
              className="flex-1"
              autoFocus
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || isProcessing || aiLoading}
              size="sm"
              className="px-3"
            >
              {isProcessing || aiLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Press Enter to send • Powered by AI
          </p>
        </div>
      )}

      {/* Resize handle */}
      {!isMaximized && !isMinimized && (
        <div 
          ref={resizeHandleRef}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '3px 3px',
            opacity: 0.5
          }}
        />
      )}

      {/* Clear conversation dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear your conversation history with Aura? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={clearConversation}>
              Clear Conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};