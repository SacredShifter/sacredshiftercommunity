import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { formatDistanceToNow } from 'date-fns';
import { Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface CommentSectionProps {
  postId: string;
  onCommentAdded?: () => void;
}

export const CommentSection = ({ postId, onCommentAdded }: CommentSectionProps) => {
  const { user } = useAuth();
  const { addComment, loading } = usePostInteractions();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  // Fetch comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const { data, error } = await supabase
          .from('circle_post_comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setComments(data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Set up real-time subscription for new comments
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'circle_post_comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          // Fetch the full comment with profile data
          const fetchNewComment = async () => {
            const { data, error } = await supabase
              .from('circle_post_comments')
              .select('*')
              .eq('id', payload.new.id)
              .single();

            if (data) {
              setComments(prev => [...prev, data]);
            }
          };
          fetchNewComment();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    const result = await addComment(postId, newComment.trim());
    if (result) {
      setNewComment('');
      onCommentAdded?.();
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'SS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="border-t border-white/10 pt-4 space-y-4">
      {/* Comments List */}
      {loadingComments ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : comments.length > 0 ? (
        <ScrollArea className="max-h-60">
          <div className="space-y-3 pr-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs">
                    SS
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        Sacred Seeker
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatDistanceToNow(new Date(comment.created_at))} ago
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">No reflections yet. Be the first to share your insights.</p>
        </div>
      )}

      {/* Add Comment Form */}
      {user && (
        <div className="flex space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs">
              {getInitials(user.user_metadata?.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Share your reflection..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmitComment();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Cmd/Ctrl + Enter to send
              </p>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || loading}
                size="sm"
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                <Send className="h-3 w-3 mr-1" />
                Reflect
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};