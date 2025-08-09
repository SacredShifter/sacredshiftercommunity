import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { toast } from 'sonner';
import { Search, User } from 'lucide-react';
import { ConversationWithProfiles } from '@/lib/directMessagesService';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
}

interface StartDirectMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationStart: (conversation: ConversationWithProfiles) => void;
}

export const StartDirectMessageModal: React.FC<StartDirectMessageModalProps> = ({
  open,
  onOpenChange,
  onConversationStart
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search for users
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim() || !user) {
        setUsers([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Searching for users with term:', searchTerm);
        console.log('Current user ID:', user.id);
        
        // First, let's check what the profiles table structure looks like
        const { data: profilesStructure, error: structureError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
        
        console.log('Profiles table structure sample:', profilesStructure);
        if (structureError) {
          console.log('Structure error:', structureError);
        }

        // Try to query using both id and user_id to handle different schema versions
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, user_id, display_name, avatar_url')
          .ilike('display_name', `%${searchTerm}%`)
          .limit(50);

        if (profilesError) {
          console.error('Profiles query error:', profilesError);
          throw profilesError;
        }

        console.log('Found profiles:', profiles);
        
        // Filter out the current user and format the results
        const formattedUsers: UserProfile[] = profiles
          ?.filter(profile => {
            // Check both id and user_id to ensure we don't include the current user
            const profileId = profile.user_id || profile.id;
            return profileId !== user.id;
          })
          .map(profile => ({
            id: profile.id,
            user_id: profile.user_id || profile.id, // Use user_id if available, otherwise use id
            display_name: profile.display_name || 'Sacred Seeker',
            avatar_url: profile.avatar_url || undefined
          })) || [];

        setUsers(formattedUsers);

        if (formattedUsers.length === 0) {
          console.log('No profiles found for search term:', searchTerm);
        }

      } catch (err) {
        console.error('Error searching users:', err);
        setError('Failed to search users. Please try again.');
        toast.error('Failed to search users');
        
        // Don't show fallback users in production - let the user know there's an issue
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, user]);

  const handleUserSelect = (selectedUser: UserProfile) => {
    console.log('User selected:', selectedUser);
    
    // Create a conversation object to pass back
    const conversation: ConversationWithProfiles = {
      participant_1_id: user?.id || '',
      participant_2_id: selectedUser.user_id,
      participant_1_display_name: null, // Current user
      participant_1_avatar_url: null,
      participant_2_display_name: selectedUser.display_name,
      participant_2_avatar_url: selectedUser.avatar_url || null,
      last_message_content: null,
      last_message_created_at: null,
      unread_count: 0
    };
    
    onConversationStart(conversation);
    onOpenChange(false);
    setSearchTerm('');
    setUsers([]);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Start New Conversation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for Sacred Shifters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                {searchTerm ? (
                  <div>
                    <p className="text-sm">No users found matching "{searchTerm}"</p>
                    <p className="text-xs mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <p className="text-sm">Start typing to search for users...</p>
                )}
              </div>
            ) : (
              users.map((user) => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto hover:bg-accent/50"
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(user.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium">{user.display_name}</p>
                    <p className="text-xs text-muted-foreground">Sacred Shifter</p>
                  </div>
                </Button>
              ))
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};