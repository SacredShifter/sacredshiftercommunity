import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

interface MessageReactionsProps {
  messageId: string;
  reactions: MessageReaction[];
  onReactionUpdate: () => void;
}

const SACRED_REACTIONS = [
  { symbol: '🕉️', name: 'Om', description: 'Sacred vibration' },
  { symbol: '✨', name: 'Resonance', description: 'Deep resonance' },
  { symbol: '🌸', name: 'Bloom', description: 'Spiritual flowering' },
  { symbol: '💫', name: 'Star', description: 'Cosmic alignment' },
  { symbol: '🙏', name: 'Gratitude', description: 'Sacred gratitude' },
  { symbol: '💎', name: 'Clarity', description: 'Crystal clarity' },
  { symbol: '🌙', name: 'Luna', description: 'Lunar wisdom' },
  { symbol: '🔥', name: 'Fire', description: 'Sacred fire' },
];

export const MessageReactions = ({ messageId, reactions, onReactionUpdate }: MessageReactionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Group reactions by type
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.reaction_type]) {
      acc[reaction.reaction_type] = [];
    }
    acc[reaction.reaction_type].push(reaction);
    return acc;
  }, {} as Record<string, MessageReaction[]>);

  const handleReaction = async (reactionType: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const existingReaction = reactions.find(
        r => r.user_id === user.id && r.reaction_type === reactionType
      );

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('circle_message_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase
          .from('circle_message_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            reaction_type: reactionType
          });

        if (error) throw error;
      }

      onReactionUpdate();
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserReactionTypes = () => {
    return reactions
      .filter(r => r.user_id === user?.id)
      .map(r => r.reaction_type);
  };

  const userReactions = getUserReactionTypes();

  return (
    <div className="flex items-center gap-2 mt-2">
      {/* Existing reaction badges */}
      {Object.entries(groupedReactions).map(([reactionType, reactionList]) => {
        const reaction = SACRED_REACTIONS.find(r => r.symbol === reactionType);
        const hasUserReacted = reactionList.some(r => r.user_id === user?.id);
        
        return (
          <Button
            key={reactionType}
            variant="ghost"
            size="sm"
            className={`h-7 px-2 hover:bg-primary/10 ${
              hasUserReacted ? 'bg-primary/20 text-primary' : ''
            }`}
            onClick={() => handleReaction(reactionType)}
            disabled={isLoading}
          >
            <span className="text-sm mr-1">{reactionType}</span>
            <span className="text-xs">{reactionList.length}</span>
          </Button>
        );
      })}

      {/* Add reaction button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 hover:bg-primary/10"
            disabled={isLoading}
          >
            <span className="text-lg">+</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Sacred Reactions</h4>
            <div className="grid grid-cols-4 gap-2">
              {SACRED_REACTIONS.map((reaction) => {
                const hasReacted = userReactions.includes(reaction.symbol);
                
                return (
                  <Button
                    key={reaction.symbol}
                    variant="ghost"
                    size="sm"
                    className={`h-12 flex-col hover:bg-primary/10 relative ${
                      hasReacted ? 'bg-primary/20 text-primary' : ''
                    }`}
                    onClick={() => handleReaction(reaction.symbol)}
                    disabled={isLoading}
                  >
                    <span className="text-lg">{reaction.symbol}</span>
                    <span className="text-xs opacity-70">{reaction.name}</span>
                    {hasReacted && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
