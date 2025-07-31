import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, UserPlus, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circleId?: string;
  onMemberAdded?: () => void;
}

interface UserProfile {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  is_member?: boolean;
}

export const AddMemberModal = ({ 
  open, 
  onOpenChange, 
  circleId,
  onMemberAdded 
}: AddMemberModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingMembers, setAddingMembers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const searchUsers = async () => {
    if (!searchTerm.trim() || !circleId) return;
    
    setLoading(true);
    try {
      // First get current members
      const { data: members } = await supabase
        .from('circle_group_members')
        .select('user_id')
        .eq('group_id', circleId);

      const memberIds = members?.map(m => m.user_id) || [];

      // Search for users by display name
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .ilike('display_name', `%${searchTerm}%`)
        .limit(20);

      if (error) throw error;

      // Mark existing members
      const usersWithMemberStatus = profiles?.map(user => ({
        ...user,
        is_member: memberIds.includes(user.user_id)
      })) || [];

      setUsers(usersWithMemberStatus);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (userId: string) => {
    if (!circleId) return;
    
    setAddingMembers(prev => new Set(prev).add(userId));
    try {
      const { error } = await supabase
        .from('circle_group_members')
        .insert({
          group_id: circleId,
          user_id: userId,
          role: 'member'
        });

      if (error) throw error;

      toast({
        title: "Member Added",
        description: "User has been successfully added to the circle.",
      });

      // Update the user's member status
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { ...user, is_member: true } : user
      ));

      onMemberAdded?.();
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add member. They may already be in the circle.",
        variant: "destructive"
      });
    } finally {
      setAddingMembers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const debounceTimer = setTimeout(searchUsers, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setUsers([]);
    }
  }, [searchTerm, circleId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Add Members to Circle
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="search">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type a username to search..."
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="h-[300px] w-full">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Searching users...</span>
              </div>
            ) : users.length === 0 && searchTerm.length >= 2 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">No users found matching "{searchTerm}"</p>
              </div>
            ) : searchTerm.length < 2 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <UserPlus className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">Start typing to search for users</p>
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.user_id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400/20 to-pink-400/20">
                        {getInitials(user.display_name || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.display_name || 'Unknown User'}</p>
                      {user.is_member && (
                        <Badge variant="secondary" className="text-xs">
                          Already a member
                        </Badge>
                      )}
                    </div>

                    {user.is_member ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addMember(user.user_id)}
                        disabled={addingMembers.has(user.user_id)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {addingMembers.has(user.user_id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};