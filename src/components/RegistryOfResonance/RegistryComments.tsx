import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Send, Trash2, Reply } from 'lucide-react';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  parent_comment_id: string | null;
  user_id: string;
}

interface RegistryCommentsProps {
  entryId: string;
  onCommentAdded?: () => void;
}

export function RegistryComments({ entryId, onCommentAdded }: RegistryCommentsProps) {
  const { user } = useAuth();
  const { getComments, addComment, deleteComment } = useRegistryOfResonance();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showComments, setShowComments] = useState(false);

  const fetchCommentsData = async () => {
    const commentsData = await getComments(entryId);
    setComments(commentsData);
  };

  useEffect(() => {
    if (entryId && showComments) {
      fetchCommentsData();
    }
  }, [entryId, showComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await addComment(entryId, newComment);
      if (success) {
        setNewComment('');
        await fetchCommentsData();
        onCommentAdded?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await addComment(entryId, replyContent, parentId);
      if (success) {
        setReplyContent('');
        setReplyingTo(null);
        await fetchCommentsData();
        onCommentAdded?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const success = await deleteComment(commentId);
    if (success) {
      await fetchCommentsData();
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const topLevelComments = comments.filter(comment => !comment.parent_comment_id);
  const getReplies = (parentId: string) => comments.filter(comment => comment.parent_comment_id === parentId);

  return (
    <div className="space-y-4">
      {/* Toggle Comments Button */}
      <Button
        variant="outline"
        onClick={() => setShowComments(!showComments)}
        className="w-full gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        {showComments ? 'Hide' : 'Show'} Comments ({comments.length})
      </Button>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Add Comment */}
            {user && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || isSubmitting}
                        size="sm"
                        className="gap-2"
                      >
                        <Send className="w-3 h-3" />
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {topLevelComments.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  topLevelComments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                U
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">
                                    Anonymous User
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                                
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setReplyingTo(comment.id)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    <Reply className="w-3 h-3" />
                                  </Button>
                                  
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
                              
                              <p className="text-sm">{comment.content}</p>
                              
                              {/* Reply Form */}
                              {replyingTo === comment.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="pt-3 border-t"
                                >
                                  <div className="space-y-2">
                                    <Textarea
                                      placeholder="Write a reply..."
                                      value={replyContent}
                                      onChange={(e) => setReplyContent(e.target.value)}
                                      rows={2}
                                      className="resize-none"
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setReplyingTo(null);
                                          setReplyContent('');
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => handleSubmitReply(comment.id)}
                                        disabled={!replyContent.trim() || isSubmitting}
                                        size="sm"
                                        className="gap-2"
                                      >
                                        <Send className="w-3 h-3" />
                                        Reply
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                              
                              {/* Replies */}
                              {getReplies(comment.id).map((reply) => (
                                <motion.div
                                  key={reply.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="ml-4 pl-4 border-l-2 border-muted"
                                >
                                  <div className="flex gap-3">
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback className="text-xs">
                                        U
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-xs font-medium">
                                            Anonymous User
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                          </p>
                                        </div>
                                        
                                        {user?.id === reply.user_id && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteComment(reply.id)}
                                            className="h-5 px-1 text-xs text-destructive hover:text-destructive"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        )}
                                      </div>
                                      
                                      <p className="text-xs mt-1">{reply.content}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}