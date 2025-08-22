import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [isLoading, setIsLoading] = useState(false);
  const [userReactions, setUserReactions] = useState<string[]>(['🙏']); // Mock user reactions

  const handleReaction = async (reactionType: string) => {
    setIsLoading(true);
    
    // Mock reaction toggle
    setTimeout(() => {
      if (userReactions.includes(reactionType)) {
        setUserReactions(prev => prev.filter(r => r !== reactionType));
      } else {
        setUserReactions(prev => [...prev, reactionType]);
      }
      onReactionUpdate();
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      {/* Existing reaction badges - Mock data */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 hover:bg-primary/10 bg-primary/20 text-primary"
        onClick={() => handleReaction('🙏')}
        disabled={isLoading}
      >
        <span className="text-sm mr-1">🙏</span>
        <span className="text-xs">2</span>
      </Button>

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
