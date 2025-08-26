import { useState, useRef, useEffect } from 'react';
import { Send, Users, Settings, UserPlus, Hash, ArrowLeft, Crown, Shield, BookOpen, Maximize2, Minimize2, Minus, Heart, Brain, MessageSquare, Activity, Filter, Sparkles, Vote, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CircleSettingsModal } from '@/components/CircleSettingsModal';
import { AddMemberModal } from '@/components/AddMemberModal';
import { CircleMessageModeSelector } from '@/components/CircleMessageModeSelector';
import { SacredQuantumMessageInterface } from '@/components/SacredQuantumMessageInterface';
import { QuantumChatCore } from '@/components/QuantumChat/QuantumChatCore';
import { MessageReactions } from '@/components/SacredCircle/MessageReactions';
import { MessageThread } from '@/components/SacredCircle/MessageThread';
import { EnhancedMemberProfile } from '@/components/SacredCircle/EnhancedMemberProfile';
import { CircleHealthDashboard } from '@/components/SacredCircle/CircleHealthDashboard';
import { CircleAdvancedFiltering } from '@/components/SacredCircle/CircleAdvancedFiltering';
import { CollectiveMeditationSession } from '@/components/SacredCircle/CollectiveMeditationSession';
import { CircleVoiceMessage } from '@/components/SacredCircle/CircleVoiceMessage';
import { CircleAstrologicalTiming } from '@/components/SacredCircle/CircleAstrologicalTiming';
import { CircleGovernanceSystem } from '@/components/SacredCircle/CircleGovernanceSystem';
import { ResourceGallery } from '@/components/ResonantResources/ResourceGallery';
import { ResourceNominationForm } from '@/components/ResonantResources/ResourceNominationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type MessageMode = 'sacred' | 'quantum' | 'classic';

interface SacredCircleInterfaceProps {
  circleId?: string;
  circleName?: string;
  onClose?: () => void;
  className?: string;
  isMaximized?: boolean;
  isMinimized?: boolean;
  onMaximize?: () => void;
  onMinimize?: () => void;
  onRestore?: () => void;
}

export const SacredCircleInterface = ({
  circleId,
  circleName = 'Sacred Circle',
  onClose,
  className,
  isMaximized = false,
  isMinimized = false,
  onMaximize,
  onMinimize,
  onRestore
}: SacredCircleInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const [messageMode, setMessageMode] = useState<MessageMode>('classic');
  const [sharedEntries, setSharedEntries] = useState<any[]>([]);
  const [loadingShares, setLoadingShares] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedThreadMessage, setSelectedThreadMessage] = useState<string | null>(null);
  const [messageReactions, setMessageReactions] = useState<{[messageId: string]: any[]}>({});
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [internalMaximized, setInternalMaximized] = useState(false);
  const [internalMinimized, setInternalMinimized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use internal state as fallback when parent doesn't provide handlers
  const currentMaximized = isMaximized || internalMaximized;
  const currentMinimized = isMinimized || internalMinimized;

  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    } else {
      setInternalMaximized(true);
      setInternalMinimized(false);
    }
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      setInternalMinimized(true);
      setInternalMaximized(false);
    }
  };

  const handleRestore = () => {
    if (onRestore) {
      onRestore();
    } else {
      setInternalMaximized(false);
      setInternalMinimized(false);
    }
  };

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

  // Fetch messages and shared entries on mount or when circle changes
  useEffect(() => {
    fetchRecentMessages(circleId);
    if (circleId) {
      fetchSharedEntries();
      fetchMessageReactions();
    }
  }, [fetchRecentMessages, circleId]);

  // Update filtered messages when messages change
  useEffect(() => {
    setFilteredMessages(messages);
  }, [messages]);

  const fetchSharedEntries = async () => {
    if (!circleId) return;
    
    setLoadingShares(true);
    try {
      const { data, error } = await supabase
        .from('registry_entry_shares')
        .select(`
          id,
          message,
          shared_at,
          user_id,
          entry_id
        `)
        .eq('circle_id', circleId)
        .order('shared_at', { ascending: false });

      if (error) throw error;

      // Now fetch the registry entries separately
      if (data && data.length > 0) {
        const entryIds = data.map(share => share.entry_id);
        const { data: registryData, error: registryError } = await supabase
          .from('registry_of_resonance')
          .select('id, title, content, entry_type, resonance_rating, author_name')
          .in('id', entryIds);

        if (registryError) throw registryError;

        // Combine the data
        const combinedData = data.map(share => ({
          ...share,
          registry_of_resonance: registryData?.find(entry => entry.id === share.entry_id)
        }));

        setSharedEntries(combinedData);
      } else {
        setSharedEntries([]);
      }
    } catch (error) {
      console.error('Error fetching shared entries:', error);
    } finally {
      setLoadingShares(false);
    }
  };

  const fetchMessageReactions = async () => {
    if (!circleId) return;
    
    // Placeholder - would fetch from actual database
    console.log('Fetching message reactions for circle:', circleId);
  };

  const handleReactionUpdate = () => {
    // Placeholder - would refetch reactions
    console.log('Updating reactions');
  };

  const handleMessageFilter = (filtered: any[]) => {
    setFilteredMessages(filtered);
  };

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();

    if (!trimmed) {
      toast({
        title: "Nothing to send",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send messages.",
        variant: "destructive",
      });
      return;
    }

    if (!circleId) {
      toast({
        title: "Circle unavailable",
        description: "Cannot determine which circle to post to.",
        variant: "destructive",
      });
      return;
    }

    try {
      const messageOptions = {
        chakraTag: messageMode === 'sacred' ? 'heart' : messageMode === 'quantum' ? 'third_eye' : 'heart',
        tone: messageMode === 'sacred' ? 'sacred' : messageMode === 'quantum' ? 'quantum' : 'harmonious',
        circleId,
        messageMode // Add mode to metadata for special handling
      };

      await sendMessage(trimmed, 'circle', messageOptions);
      setNewMessage('');
      inputRef.current?.focus();

      const modeText = messageMode === 'sacred' ? 'sacred' : messageMode === 'quantum' ? 'quantum' : '';
      toast({
        title: "Message sent",
        description: `Your ${modeText} message has been shared with the circle.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
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

  const getChakraColor = (chakraTag?: string) => {
    const colors = {
      root: 'from-red-400 to-red-600',
      sacral: 'from-orange-400 to-orange-600',
      solar: 'from-yellow-400 to-yellow-600',
      heart: 'from-green-400 to-green-600',
      throat: 'from-blue-400 to-blue-600',
      third_eye: 'from-indigo-400 to-indigo-600',
      crown: 'from-purple-400 to-purple-600',
    };
    return colors[chakraTag as keyof typeof colors] || 'from-primary to-primary/80';
  };

  // Mock members data (would come from API in real app)
  const mockMembers = [
    { id: '1', name: 'Alice Wisdom', role: 'admin', avatar: '', isOnline: true },
    { id: '2', name: 'Bob Light', role: 'moderator', avatar: '', isOnline: true },
    { id: '3', name: 'Carol Unity', role: 'member', avatar: '', isOnline: false },
    { id: '4', name: 'David Peace', role: 'member', avatar: '', isOnline: true },
  ];

  return (
    <Card className={cn(
      "flex flex-col bg-background/95 backdrop-blur-sm transition-all duration-300",
      currentMaximized && "fixed inset-0 top-0 left-0 right-0 bottom-0 z-50 rounded-none animate-scale-in w-screen h-screen",
      currentMinimized && "h-12 overflow-hidden",
      !currentMaximized && !currentMinimized && "h-full",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          <Hash className="h-5 w-5 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            {circleName}
            <Badge variant="outline" className="text-xs">
              {mockMembers.length} members
            </Badge>
          </h3>
          <p className="text-xs text-muted-foreground">
            Sacred space for conscious connection
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setShowAddMember(true)}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          {/* Window Controls */}
          <div className="flex items-center gap-0.5 ml-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 hover:bg-yellow-500/20"
              onClick={handleMinimize}
              title="Minimize"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 hover:bg-green-500/20"
              onClick={currentMaximized ? handleRestore : handleMaximize}
              title={currentMaximized ? "Restore" : "Maximize"}
            >
              {currentMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className={cn("flex-1 flex", currentMinimized && "hidden")}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-9 mx-4 mt-2">
              <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
              <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
              <TabsTrigger value="health" className="text-xs"><Activity className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="meditation" className="text-xs"><Sparkles className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="governance" className="text-xs"><Vote className="h-3 w-3" /></TabsTrigger>
              <TabsTrigger value="modes" className="text-xs">Modes</TabsTrigger>
              <TabsTrigger value="shared" className="text-xs">Shared</TabsTrigger>
              <TabsTrigger value="members" className="text-xs">Members</TabsTrigger>
              <TabsTrigger value="filter" className="text-xs"><Filter className="h-3 w-3" /></TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="flex-1 flex flex-col mt-2 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Resonant Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    Shared links, tools, and wisdom for the circle.
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Link2 className="w-4 h-4 mr-2" />
                      Share Resource
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share a new resource</DialogTitle>
                    </DialogHeader>
                    <ResourceNominationForm circleId={circleId} />
                  </DialogContent>
                </Dialog>
              </div>
              <ResourceGallery circleId={circleId} />
            </TabsContent>

            {/* Health Dashboard Tab */}
            <TabsContent value="health" className="flex-1 flex flex-col mt-2">
              <div className="flex-1">
                <CircleHealthDashboard 
                  circleId={circleId}
                />
              </div>
            </TabsContent>

            {/* Meditation Session Tab */}
            <TabsContent value="meditation" className="flex-1 flex flex-col mt-2">
              <div className="flex-1">
                <CollectiveMeditationSession 
                  circleId={circleId}
                />
              </div>
            </TabsContent>

            {/* Governance Tab */}
            <TabsContent value="governance" className="flex-1 flex flex-col mt-2">
              <div className="flex-1">
                <CircleGovernanceSystem 
                  circleId={circleId}
                />
              </div>
            </TabsContent>

            <TabsContent value="modes" className="flex-1 flex flex-col mt-2">
              <div className="p-4">
                <CircleMessageModeSelector
                  mode={messageMode}
                  onModeChange={setMessageMode}
                />
                
                {/* Sacred/Quantum Interface for Circles */}
                <div className="mt-4">
                  {messageMode === 'sacred' && (
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="h-4 w-4 text-rose-500" />
                        <span className="text-sm font-medium">Sacred Circle Mode</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Engage in heart-centered communication with heightened consciousness and sacred intention.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        ✨ Messages carry energetic resonance<br/>
                        💫 Enhanced synchronicity detection<br/>
                        🌸 Chakra-aligned communication
                      </div>
                    </div>
                  )}
                  
                  {messageMode === 'quantum' && (
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Quantum Circle Mode</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Multi-dimensional communication with quantum entanglement and consciousness bridging.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        🌌 Non-local consciousness connection<br/>
                        ⚡ Quantum field message threading<br/>
                        🧬 Multidimensional awareness integration
                      </div>
                    </div>
                  )}
                  
                  {messageMode === 'classic' && (
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Send className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Classic Circle Mode</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Traditional messaging with all the power of unified Sacred Shifter communication.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        💬 Standard text messaging<br/>
                        🔄 Real-time synchronization<br/>
                        🛡️ Encrypted & sovereign by default
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="flex-1 flex flex-col mt-2">
              {/* Messages */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      const circleMessages = circleId ? filteredMessages.filter(m => m.group_id === circleId) : filteredMessages;
                      return circleMessages.map((message, index) => {
                        const isOwnMessage = message.user_id === user?.id;
                        const showAvatar = index === 0 || circleMessages[index - 1]?.user_id !== message.user_id;

                        return (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-3 group",
                              isOwnMessage ? "justify-end" : "justify-start"
                            )}
                          >
                            {!isOwnMessage && (
                              <div className="w-8 flex-shrink-0">
                                {showAvatar && (
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className={cn(
                                      "bg-gradient-to-br text-white text-xs",
                                      getChakraColor(message.chakra_tag)
                                    )}>
                                      {getInitials(message.user_id)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            )}

                            <div className="max-w-[80%]">
                              {showAvatar && !isOwnMessage && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">
                                    {message.is_anonymous ? 'Anonymous Soul' : `User ${message.user_id.slice(0, 8)}`}
                                  </span>
                                  {message.chakra_tag && (
                                    <Badge 
                                      variant="outline" 
                                      className={cn("text-xs bg-gradient-to-r text-white border-none", getChakraColor(message.chakra_tag))}
                                    >
                                      {message.chakra_tag}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              
                              <div
                                className={cn(
                                  "px-3 py-2 rounded-2xl relative",
                                  isOwnMessage
                                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-md"
                                    : "bg-muted rounded-bl-md",
                                  "animate-fade-in"
                                )}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                                
                                <div className={cn(
                                  "flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
                                  isOwnMessage ? "justify-end" : "justify-start"
                                )}>
                                  <span className={cn(
                                    "text-xs",
                                    isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                                  )}>
                                    {formatTime(message.created_at)}
                                  </span>
                                  {message.tone && (
                                    <span className={cn(
                                      "text-xs opacity-75",
                                      isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                                    )}>
                                      • {message.tone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {isOwnMessage && <div className="w-8 flex-shrink-0"></div>}
                          </div>
                        );
                      });
                    })()}

                    {(() => {
                      const circleMessages = circleId ? messages.filter(m => m.group_id === circleId) : messages;
                      return circleMessages.length === 0 && !loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium mb-1">Welcome to the Sacred Circle</p>
                          <p className="text-sm">Share your wisdom and connect with fellow souls</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t bg-gradient-to-r from-muted/30 to-accent/10">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={
                          messageMode === 'sacred' ? "Share your sacred message..." :
                          messageMode === 'quantum' ? "Express your quantum awareness..." :
                          "Type your message..."
                        }
                        className="pr-10 resize-none bg-background/80 border-muted"
                        disabled={!user}
                      />
                    </div>

                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !user || !circleId}
                      size="sm" 
                      className={cn(
                        "h-9 w-9 p-0",
                        messageMode === 'sacred' ? "bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600" :
                        messageMode === 'quantum' ? "bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600" :
                        "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      )}
                    >
                      {messageMode === 'sacred' ? <Heart className="h-4 w-4" /> :
                       messageMode === 'quantum' ? <Brain className="h-4 w-4" /> :
                       <Send className="h-4 w-4" />}
                    </Button>
                  </div>
              </div>
            </TabsContent>

            <TabsContent value="shared" className="flex-1 mt-2">
              <ScrollArea className="flex-1 p-4">
                {loadingShares ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : sharedEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium mb-1">No Shared Entries</p>
                    <p className="text-sm">Registry entries shared to this circle will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sharedEntries.map((share) => {
                      const entry = share.registry_of_resonance;
                      if (!entry) return null;
                      
                      return (
                        <Card key={share.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-sm truncate">{entry.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {entry.entry_type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  ⚡ {entry.resonance_rating}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                                {entry.content.substring(0, 200)}...
                              </p>
                              
                              {share.message && (
                                <div className="bg-muted/50 p-2 rounded-lg mb-2">
                                  <p className="text-xs text-muted-foreground mb-1">Shared with message:</p>
                                  <p className="text-sm">{share.message}</p>
                                </div>
                              )}
                               
                               <div className="flex items-center justify-between text-xs text-muted-foreground">
                                 <span>By {entry.author_name || 'Anonymous'}</span>
                                 <span>{new Date(share.shared_at).toLocaleDateString()}</span>
                               </div>
                             </div>
                           </div>
                         </Card>
                       );
                     })}
                   </div>
                 )}
               </ScrollArea>
             </TabsContent>

             <TabsContent value="members" className="flex-1 mt-2">
               <ScrollArea className="flex-1 p-4">
                 <div className="space-y-2">
                   {mockMembers.map((member) => (
                     <div
                       key={member.id}
                       className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                     >
                       <div className="relative">
                         <Avatar className="h-10 w-10">
                           <AvatarFallback className="bg-gradient-to-br from-purple-400/20 to-pink-400/20">
                             {getInitials(member.name)}
                           </AvatarFallback>
                         </Avatar>
                         {member.isOnline && (
                           <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                         )}
                       </div>
                       
                       <div className="flex-1">
                         <div className="flex items-center gap-2">
                           <span className="font-medium text-sm">{member.name}</span>
                           {member.role === 'admin' && (
                             <Crown className="h-3 w-3 text-yellow-500" />
                           )}
                           {member.role === 'moderator' && (
                             <Shield className="h-3 w-3 text-blue-500" />
                           )}
                         </div>
                         <span className="text-xs text-muted-foreground capitalize">{member.role}</span>
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
                   ))}
                 </div>
               </ScrollArea>
             </TabsContent>
           </Tabs>
         </div>
       </div>

      {/* Settings Modal */}
      <CircleSettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        circleId={circleId}
        currentSettings={
          circleId && circles.find(c => c.id === circleId)
            ? {
                name: circles.find(c => c.id === circleId)?.name || '',
                description: circles.find(c => c.id === circleId)?.description,
                isPrivate: circles.find(c => c.id === circleId)?.is_private || false,
                chakraFocus: circles.find(c => c.id === circleId)?.chakra_focus,
                frequencyRange: circles.find(c => c.id === circleId)?.frequency_range
              }
            : undefined
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
          toast({
            title: "Member Added",
            description: "New member has been added to the circle.",
          });
        }}
      />
    </Card>
  );
};