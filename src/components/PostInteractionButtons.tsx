import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommentSection } from './CommentSection';
import { logger } from '@/lib/logger';

interface PostInteractionButtonsProps {
  postId: string;
  initialLikeCount?: number;
  initialCommentCount?: number;
  initialUserHasLiked?: boolean;
  postUserId?: string;
  currentUserId?: string;
}

export const PostInteractionButtons = ({ 
  postId, 
  initialLikeCount = 0, 
  initialCommentCount = 0, 
  initialUserHasLiked = false,
  postUserId,
  currentUserId
}: PostInteractionButtonsProps) => {
  const { toggleLike, sharePost, getPostStats, loading } = usePostInteractions();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [userHasLiked, setUserHasLiked] = useState(initialUserHasLiked);
  const [showComments, setShowComments] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update stats when post stats change
  useEffect(() => {
    const updateStats = async () => {
      const stats = await getPostStats(postId);
      setLikeCount(stats.likeCount);
      setCommentCount(stats.commentCount);
      setUserHasLiked(stats.userHasLiked);
    };

    updateStats();
  }, [postId, getPostStats]);

  const handleLike = async () => {
    if (loading) return;

    // Optimistic update
    const newLikedState = !userHasLiked;
    setUserHasLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    const result = await toggleLike(postId);
    
    // If the operation failed, revert optimistic update
    if (!result) {
      setUserHasLiked(!newLikedState);
      setLikeCount(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    await sharePost(postId, shareUrl);
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };

  const onCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  return (
    <div className="space-y-3">
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className="flex items-center space-x-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "action-button flex items-center space-x-2 transition-all duration-200",
              userHasLiked 
                ? "text-red-500 hover:text-red-600" 
                : "text-muted-foreground hover:text-primary",
              isAnimating && "scale-110"
            )}
            onClick={handleLike}
            disabled={loading}
          >
            <Heart className={cn(
              "h-4 w-4 transition-all duration-200",
              userHasLiked && "fill-current",
              isAnimating && "animate-pulse"
            )} />
            <span className="text-xs">
              Resonate {likeCount > 0 && `(${likeCount})`}
            </span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "action-button flex items-center space-x-2 text-muted-foreground hover:text-primary transition-all duration-200",
              showComments && "text-primary"
            )}
            onClick={handleCommentToggle}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">
              Reflect {commentCount > 0 && `(${commentCount})`}
            </span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="action-button flex items-center space-x-2 text-muted-foreground hover:text-primary transition-all duration-200"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Share</span>
          </Button>
        </div>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => logger.userAction('save-post', { component: 'PostInteractionButtons', postId })}>
              Save Post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => logger.userAction('copy-link', { component: 'PostInteractionButtons', postId })}>
              Copy Link
            </DropdownMenuItem>
            {currentUserId === postUserId && (
              <>
                <DropdownMenuItem onClick={() => logger.userAction('edit-post', { component: 'PostInteractionButtons', postId })}>
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => logger.userAction('delete-post', { component: 'PostInteractionButtons', postId })}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Post
                </DropdownMenuItem>
              </>
            )}
            {currentUserId !== postUserId && (
              <>
                <DropdownMenuItem onClick={() => logger.userAction('report-post', { component: 'PostInteractionButtons', postId })}>
                  Report Post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logger.userAction('block-user', { component: 'PostInteractionButtons', postId })}>
                  Block User
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection 
          postId={postId} 
          onCommentAdded={onCommentAdded}
        />
      )}
    </div>
  );
};