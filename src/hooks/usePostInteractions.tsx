import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const usePostInteractions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Like/Unlike a post (Resonate)
  const toggleLike = useCallback(async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to resonate with posts",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      // Check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('sacred_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // Unlike the post
        const { error: deleteError } = await supabase
          .from('sacred_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
        return { action: 'unliked' };
      } else {
        // Like the post
        const { error: insertError } = await supabase
          .from('sacred_post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (insertError) throw insertError;
        return { action: 'liked' };
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update resonance",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Add a comment (Reflect)
  const addComment = useCallback(async (postId: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add reflections",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('sacred_post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
          visibility: 'public'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Reflection shared",
        description: "Your insight has been added to the collective wisdom",
      });

      return data;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add reflection",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Share a post
  const sharePost = useCallback(async (postId: string, shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Sacred post link copied to clipboard",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Share",
        description: "Copy this link to share: " + shareUrl,
      });
    }
  }, [toast]);

  // Get post statistics
  const getPostStats = useCallback(async (postId: string) => {
    try {
      const [likesResult, commentsResult] = await Promise.all([
        supabase
          .from('sacred_post_likes')
          .select('user_id', { count: 'exact' })
          .eq('post_id', postId),
        supabase
          .from('sacred_post_comments')
          .select('id', { count: 'exact' })
          .eq('post_id', postId)
      ]);

      const userHasLiked = user ? 
        (await supabase
          .from('sacred_post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single()).data !== null : false;

      return {
        likeCount: likesResult.count || 0,
        commentCount: commentsResult.count || 0,
        userHasLiked
      };
    } catch (error) {
      console.error('Error fetching post stats:', error);
      return {
        likeCount: 0,
        commentCount: 0,
        userHasLiked: false
      };
    }
  }, [user]);

  return {
    toggleLike,
    addComment,
    sharePost,
    getPostStats,
    loading
  };
};