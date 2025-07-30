import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
}

interface StartDirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect: (userId: string) => void;
}

export const StartDirectMessageModal: React.FC<StartDirectMessageModalProps> = ({
  isOpen,
  onClose,
  onUserSelect
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'SS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const fetchUsers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .neq('user_id', user.id)
        .not('display_name', 'is', null) // Only show users with display names
        .order('display_name', { ascending: true })
        .limit(50);

      if (searchQuery.trim()) {
        query = query.ilike('display_name', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Filter out any remaining null display names and deduplicate
      const uniqueUsers = (data || [])
        .filter(profile => profile.display_name && profile.display_name.trim())
        .reduce((acc: UserProfile[], current) => {
          const exists = acc.find(profile => profile.id === current.user_id);
          if (!exists) {
            acc.push({
              id: current.user_id,
              display_name: current.display_name,
              avatar_url: current.avatar_url
            });
          }
          return acc;
        }, []);
      
      setUsers(uniqueUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (selectedUserId: string) => {
    if (!user) return;

    try {
      // Check if conversation already exists
      const { data: existingConversation, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${selectedUserId}),and(participant_1_id.eq.${selectedUserId},participant_2_id.eq.${user.id})`)
        .maybeSingle();

      if (convError && convError.code !== 'PGRST116') throw convError;

      if (!existingConversation) {
        // Create new conversation
        const { error: createError } = await supabase
          .from('conversations')
          .insert({
            participant_1_id: user.id,
            participant_2_id: selectedUserId,
            last_message_at: new Date().toISOString()
          });

        if (createError) throw createError;
      }

      onUserSelect(selectedUserId);
      onClose();
      
      toast({
        title: "Conversation Started",
        description: "You can now send direct messages"
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start conversation"
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-background border border-border rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Start Direct Message</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* User List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {/* Aura AI Assistant */}
              <div
                onClick={() => handleUserSelect('aura-ai-assistant')}
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all cursor-pointer group"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    🌟
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">
                      Aura ✨
                    </p>
                    <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                      AI Assistant
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your sacred guide and AI assistant for spiritual growth
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? 'No users found' : 'No users available'}
                  </p>
                  {searchQuery && (
                    <p className="text-xs">Try a different search term</p>
                  )}
                </div>
              ) : (
                users.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => handleUserSelect(profile.id)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                        {getInitials(profile.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          {profile.display_name || 'Sacred Seeker'}
                        </p>
                        <Badge variant="outline" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          Message
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};