import React, { useState, useEffect, useCallback } from 'react';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { useAuth } from '@/hooks/useAuth';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, CornerDownRight } from 'lucide-react';

interface PublicDiscussionProps {
  entryId: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_comment_id: string | null;
  children: Comment[];
  // I'll need user info, but the hook doesn't provide it yet.
  // For now, I'll just show the user_id.
}

const CommentView: React.FC<{ comment: Comment; onReply: (id: string, content: string) => void }> = ({ comment, onReply }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent);
    setReplyContent('');
    setShowReply(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {/* Placeholder for avatar */}
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
            {comment.user_id.substring(0, 2)}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">User {comment.user_id.substring(0, 8)}</div>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </p>
          <p className="mt-2 text-foreground/90">{comment.content}</p>
          <Button variant="ghost" size="sm" className="mt-1 gap-2" onClick={() => setShowReply(!showReply)}>
            <CornerDownRight className="h-4 w-4" />
            Reply
          </Button>
        </div>
      </div>

      {showReply && (
        <form onSubmit={handleReplySubmit} className="ml-11 mt-2 space-y-2">
          <Textarea
            placeholder={`Replying to User ${comment.user_id.substring(0, 8)}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={2}
          />
          <Button type="submit" size="sm" disabled={!replyContent.trim()}>
            Post Reply
          </Button>
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="ml-6 mt-4 pl-6 border-l border-muted-foreground/20 space-y-4">
          {comment.children.map(child => (
            <CommentView key={child.id} comment={child} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

const PublicDiscussion: React.FC<PublicDiscussionProps> = ({ entryId }) => {
  const { user } = useAuth();
  const { getComments, addComment } = useRegistryOfResonance();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buildThread = (commentList: any[]): Comment[] => {
    const commentMap: { [key: string]: any } = {};
    const roots: Comment[] = [];

    commentList.forEach(comment => {
      commentMap[comment.id] = { ...comment, children: [] };
    });

    commentList.forEach(comment => {
      if (comment.parent_comment_id) {
        commentMap[comment.parent_comment_id]?.children.push(commentMap[comment.id]);
      } else {
        roots.push(commentMap[comment.id]);
      }
    });

    return roots;
  };

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const fetchedComments = await getComments(entryId);
    const threadedComments = buildThread(fetchedComments);
    setComments(threadedComments);
    setIsLoading(false);
  }, [entryId, getComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (content: string, parentId?: string) => {
    if (!user) return;
    setIsSubmitting(true);
    const success = await addComment(entryId, content, parentId);
    if (success) {
      setNewComment('');
      await fetchComments();
    }
    setIsSubmitting(false);
  };

  const handleSubmitTopLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    handleAddComment(newComment);
  };

  return (
    <div className="space-y-6">
      {user ? (
        <form onSubmit={handleSubmitTopLevel} className="space-y-4">
          <Textarea
            placeholder="Join the discussion..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="text-center text-muted-foreground py-4">
          You must be logged in to join the discussion.
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Public Discussion
        </h3>
        {isLoading ? (
          <p>Loading discussion...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentView key={comment.id} comment={comment} onReply={handleAddComment} />
          ))
        ) : (
          <p className="text-muted-foreground">No discussion on this entry yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default PublicDiscussion;
