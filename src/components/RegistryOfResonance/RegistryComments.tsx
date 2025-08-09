import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Send, Trash2, Reply } from 'lucide-react';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { useAuth } from '@/hooks/useAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  created_at: string;
  parent_id?: string;
  replies?: Comment[];
}

interface RegistryCommentsProps {
  entryId: string;
}

export function RegistryComments({ entryId }: RegistryCommentsProps) {
  const { user } = useAuth();
  const { getComments, addComment, deleteComment } = useRegistryOfResonance();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [entryId]);

  const loadComments = async () => {
    try {
      const commentsData = await getComments(entryId);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      await addComment(entryId, newComment.trim());
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return;

    setLoading(true);
    try {
      await addComment(entryId, replyContent.trim(), parentId);
      setReplyContent('');
      setReplyTo(null);
      await loadComments();
    } catch (error) {
      console.error('Failed to add reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`space-y-3 ${isReply ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}
    >
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {comment.user_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.user_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  {!isReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  )}
                  
                  {user?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {replyTo === comment.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-8 space-y-2"
        >
          <Textarea
            placeholder={`Reply to ${comment.user_name}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleAddReply(comment.id)}
              disabled={!replyContent.trim() || loading}
              className="h-8"
            >
              <Send className="w-3 h-3 mr-1" />
              Reply
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReplyTo(null);
                setReplyContent('');
              }}
              className="h-8"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </motion.div>
  );

  if (!user) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Sign in to view and add comments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Add Comment Form */}
      <div className="space-y-3">
        <Textarea
          placeholder="Share your thoughts on this entry..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || loading}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-4">
            <AnimatePresence>
              {comments.map(comment => renderComment(comment))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}