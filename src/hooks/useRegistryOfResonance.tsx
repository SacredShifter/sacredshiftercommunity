import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface RegistryEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  resonance_rating: number;
  resonance_signature: string | null;
  tags: string[] | null;
  entry_type: string;
  access_level: string;
  is_verified: boolean | null;
  is_pinned: boolean | null;
  created_at: string;
  updated_at: string;
  category_id?: string | null;
  // Enhanced metadata fields
  image_url?: string | null;
  image_alt_text?: string | null;
  author_name?: string | null;
  author_bio?: string | null;
  publication_date?: string | null;
  reading_time_minutes?: number | null;
  word_count?: number | null;
  source_citation?: string | null;
  inspiration_source?: string | null;
  visibility_settings?: any;
  content_type?: string | null;
  engagement_metrics?: any;
  resonance_count?: number;
}

export interface RegistryCategory {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  path: string;
  level: number;
  children?: RegistryCategory[];
}

export interface NewRegistryEntry {
  title: string;
  content: string;
  resonance_rating: number;
  tags: string[];
  entry_type: 'Personal' | 'Collective' | 'Transmission';
  access_level: 'Private' | 'Circle' | 'Public';
  category_id?: string;
  resonance_signature?: string;
  // Enhanced metadata fields
  image_url?: string;
  image_alt_text?: string;
  author_name?: string;
  author_bio?: string;
  source_citation?: string;
  inspiration_source?: string;
  content_type?: 'text' | 'markdown' | 'rich_text';
  visibility_settings?: {
    public: boolean;
    circle_shared: boolean;
    featured: boolean;
  };
  is_verified?: boolean;
}

export function useRegistryOfResonance() {
  const [entries, setEntries] = useState<RegistryEntry[]>([]);
  const [categories, setCategories] = useState<RegistryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEntries = useCallback(async (viewMode: 'my' | 'collective' | 'drafts' = 'my') => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase.from('registry_of_resonance').select('*');

      switch (viewMode) {
        case 'my':
          query = query.eq('user_id', user.id);
          break;
        case 'collective':
          query = query.eq('access_level', 'Public').eq('is_verified', true);
          break;
        case 'drafts':
          query = query.eq('user_id', user.id).eq('is_verified', false);
          break;
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createEntry = useCallback(async (entryData: NewRegistryEntry) => {
    if (!user) {
      toast.error('You must be logged in to create entries');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('registry_of_resonance')
        .insert({
          ...entryData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Registry entry created successfully');
      return data;
    } catch (err) {
      console.error('Error creating entry:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create entry');
      return null;
    }
  }, [user]);

  const updateEntry = useCallback(async (id: string, updates: Partial<RegistryEntry>) => {
    try {
      console.log('updateEntry called with:', { id, updates });
      
      // Filter to only include registry_of_resonance table columns
      const validColumns = [
        'title', 'content', 'resonance_rating', 'resonance_signature', 'tags', 'entry_type',
        'access_level', 'is_verified', 'is_pinned', 'category_id', 'image_url', 'image_alt_text',
        'author_name', 'author_bio', 'publication_date', 'reading_time_minutes',
        'word_count', 'source_citation', 'inspiration_source', 'visibility_settings',
        'content_type', 'engagement_metrics', 'resonance_count'
      ];
      
      const validUpdates = Object.fromEntries(
        Object.entries(updates).filter(([key]) => validColumns.includes(key))
      );

      console.log('validUpdates after filtering:', validUpdates);

      // Ensure we only update the specific entry we want
      console.log('About to call supabase update with:', { table: 'registry_of_resonance', validUpdates, id });
      const { data, error } = await supabase
        .from('registry_of_resonance')
        .update(validUpdates)
        .eq('id', id)
        .select()
        .single();
      
      console.log('Supabase update result:', { data, error });

      if (error) throw error;

      setEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...data } : entry));
      toast.success('Entry updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating entry:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update entry');
      return null;
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('registry_of_resonance')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast.success('Entry deleted successfully');
    } catch (err) {
      console.error('Error deleting entry:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  }, []);

  const togglePin = useCallback(async (id: string) => {
    try {
      const entry = entries.find(e => e.id === id);
      if (!entry) return;

      await updateEntry(id, { is_pinned: !entry.is_pinned } as any);
    } catch (err) {
      console.error('Error toggling pin:', err);
      toast.error('Failed to update pin status');
    }
  }, [entries, updateEntry]);

  const generateResonanceSignature = useCallback((content: string, title: string) => {
    // Simple hash-based signature generator
    const combined = title + content;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `RES-${Math.abs(hash).toString(16).toUpperCase()}`;
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      // For now, create mock categories until the table is properly synced
      setCategories([
        { id: '1', name: 'Consciousness', description: 'States and experiences of consciousness', parent_id: null, path: 'consciousness', level: 0 },
        { id: '2', name: 'Technology', description: 'AI, synthetic intelligence, and digital sovereignty', parent_id: null, path: 'technology', level: 0 },
        { id: '3', name: 'Wisdom', description: 'Insights and profound realizations', parent_id: null, path: 'wisdom', level: 0 },
        { id: '4', name: 'Sacred Geometry', description: 'Patterns and structures in sacred form', parent_id: null, path: 'sacred-geometry', level: 0 },
        { id: '5', name: 'Frequency', description: 'Vibrational and energy work', parent_id: null, path: 'frequency', level: 0 },
        { id: '6', name: 'Dreams & Visions', description: 'Dream experiences and prophetic visions', parent_id: '1', path: 'consciousness/dreams-visions', level: 1 }
      ]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    fetchCategories();
  }, [fetchEntries, fetchCategories]);

  const uploadImage = useCallback(async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload images');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('registry-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('registry-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    }
  }, [user]);

  const deleteImage = useCallback(async (imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = urlParts.slice(-2).join('/'); // user_id/filename

      const { error } = await supabase.storage
        .from('registry-images')
        .remove([filePath]);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  }, []);

  const incrementEngagement = useCallback(async (entryId: string, type: 'views' | 'shares' | 'bookmarks') => {
    try {
      console.log('incrementEngagement called with:', { entryId, type });
      
      // Get current entry
      const { data: entry, error: fetchError } = await supabase
        .from('registry_of_resonance')
        .select('engagement_metrics')
        .eq('id', entryId)
        .single();

      if (fetchError) throw fetchError;

      const currentMetrics = entry?.engagement_metrics as Record<string, number> || { views: 0, shares: 0, bookmarks: 0 };
      const updatedMetrics = {
        views: currentMetrics.views || 0,
        shares: currentMetrics.shares || 0,
        bookmarks: currentMetrics.bookmarks || 0,
        [type]: (currentMetrics[type] || 0) + 1
      };

      console.log('incrementEngagement update:', { engagement_metrics: updatedMetrics });

      const { error } = await supabase
        .from('registry_of_resonance')
        .update({ engagement_metrics: updatedMetrics })
        .eq('id', entryId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating engagement:', err);
    }
  }, []);

  const shareEntry = useCallback(async (entry: RegistryEntry) => {
    await incrementEngagement(entry.id, 'shares');
    
    if (navigator.share && entry.access_level === 'Public') {
      try {
        await navigator.share({
          title: entry.title,
          text: entry.content.substring(0, 200) + '...',
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } else {
      // Copy to clipboard
      const text = `${entry.title}\n\n${entry.content}\n\nResonance Rating: ${entry.resonance_rating}/100`;
      await navigator.clipboard.writeText(text);
      toast.success('Entry copied to clipboard');
    }
  }, [incrementEngagement]);

  const calculateWordCount = useCallback((content: string) => {
    return content.trim().split(/\s+/).length;
  }, []);

  const calculateReadingTime = useCallback((wordCount: number) => {
    // Average reading speed: 200 words per minute
    return Math.ceil(wordCount / 200);
  }, []);

  // Resonance voting functions
  const toggleResonance = useCallback(async (entryId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to resonate with entries');
      return false;
    }

    try {
      const { data: existingVote } = await supabase
        .from('registry_entry_resonance')
        .select('id')
        .eq('entry_id', entryId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingVote) {
        await supabase
          .from('registry_entry_resonance')
          .delete()
          .eq('id', existingVote.id);
        
        toast.success('Resonance removed');
        return false;
      } else {
        await supabase.from('registry_entry_resonance').insert({
          entry_id: entryId,
          user_id: user.id,
        });

        // Update resonance growth data
        const { data: entry, error: fetchError } = await supabase
          .from('registry_of_resonance')
          .select('resonance_growth_data, resonance_count')
          .eq('id', entryId)
          .single();

        if (fetchError) throw fetchError;

        // Cast to any to bypass missing database columns
        const entryData = entry as any;
        const currentGrowthData = (entryData?.resonance_growth_data as any[]) || [];
        const newGrowthData = [
          ...currentGrowthData,
          { timestamp: new Date().toISOString(), count: (entryData.resonance_count || 0) + 1 },
        ];

        // Update only valid columns
        await supabase
          .from('registry_of_resonance')
          .update({ updated_at: new Date().toISOString() } as any)
          .eq('id', entryId);

        toast.success('Resonating with this entry!');
        return true;
      }
    } catch (error) {
      console.error('Error toggling resonance:', error);
      toast.error('Failed to update resonance');
      return false;
    }
  }, [user]);

  const getUserResonanceStatus = useCallback(async (entryId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data } = await supabase
        .from('registry_entry_resonance')
        .select('id')
        .eq('entry_id', entryId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      return !!data;
    } catch (error) {
      return false;
    }
  }, [user]);

  // Comments functions
  const getComments = useCallback(async (entryId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('registry_entry_comments')
        .select(`
          id,
          content,
          created_at,
          updated_at,
          is_anonymous,
          parent_comment_id,
          user_id
        `)
        .eq('entry_id', entryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }, []);

  const addComment = useCallback(async (entryId: string, content: string, parentCommentId?: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return false;
    }

    try {
      const { error } = await supabase
        .from('registry_entry_comments')
        .insert({
          entry_id: entryId,
          user_id: user.id,
          content: content.trim(),
          parent_comment_id: parentCommentId || null
        });

      if (error) throw error;
      
      toast.success('Comment added successfully');
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return false;
    }
  }, [user]);

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('registry_entry_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Comment deleted');
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      return false;
    }
  }, [user]);

  // Bookmark functions
  const addBookmark = useCallback(async (entryId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to bookmark entries');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: user.id,
          entry_id: entryId,
          entry_type: 'registry_entry'
        });

      if (error) throw error;
      
      // Also increment the bookmark metric
      await incrementEngagement(entryId, 'bookmarks');
      
      toast.success('Added to your Personal Codex!');
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast.error('Failed to bookmark entry');
      return false;
    }
  }, [user, incrementEngagement]);

  const removeBookmark = useCallback(async (entryId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('entry_id', entryId);

      if (error) throw error;
      
      toast.success('Removed from your Personal Codex');
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark');
      return false;
    }
  }, [user]);

  const isBookmarked = useCallback(async (entryId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('entry_id', entryId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }, [user]);

  const getUserBookmarks = useCallback(async (): Promise<RegistryEntry[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select(`
          entry_id,
          created_at,
          registry_of_resonance (*)
        `)
        .eq('user_id', user.id)
        .eq('entry_type', 'registry_entry')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || [])
        .map(bookmark => (bookmark as any).registry_of_resonance)
        .filter(entry => entry !== null);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  }, [user]);

  // Reflection notes functions
  const getReflectionNotes = useCallback(async (entryId: string): Promise<any[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('reflection_notes')
        .select('*')
        .eq('entry_id', entryId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reflection notes:', error);
      return [];
    }
  }, [user]);

  const addReflectionNote = useCallback(async (entryId: string, content: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to add a note');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('reflection_notes')
        .insert({
          entry_id: entryId,
          user_id: user.id,
          content: content.trim(),
        });
        
      if (error) throw error;
      toast.success('Reflection note added');
      return true;
    } catch (error) {
      console.error('Error adding reflection note:', error);
      toast.error('Failed to add reflection note');
      return false;
    }
  }, [user]);

  const updateReflectionNote = useCallback(async (noteId: string, content: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('reflection_notes')
        .update({ content: content.trim() })
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Reflection note updated');
      return true;
    } catch (error) {
      console.error('Error updating reflection note:', error);
      toast.error('Failed to update reflection note');
      return false;
    }
  }, [user]);

  const deleteReflectionNote = useCallback(async (noteId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('reflection_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Reflection note deleted');
      return true;
    } catch (error) {
      console.error('Error deleting reflection note:', error);
      toast.error('Failed to delete reflection note');
      return false;
    }
  }, [user]);

  // Export entry as seed
  const exportEntryAsSeed = useCallback(async (entryId: string) => {
    try {
      const { data: entry, error } = await supabase
        .from('registry_of_resonance')
        .select('*')
        .eq('id', entryId)
        .single();

      if (error) throw error;
      if (!entry) throw new Error('Entry not found');

      const seedPacket = {
        version: '1.0.0',
        type: 'codex-seed',
        provenance: 'Sacred Shifter Collective',
        timestamp: new Date().toISOString(),
        payload: {
          ...entry,
          // Remove sensitive or irrelevant data for export
          user_id: undefined,
          visibility_settings: undefined,
        },
      };

      const blob = new Blob([JSON.stringify(seedPacket, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codex-seed-${entry.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error exporting entry as seed:', err);
      toast.error('Failed to export entry as seed packet.');
    }
  }, []);

  // Share to circle function
  const shareToCircle = useCallback(async (entryId: string, circleId: string, message?: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to share entries');
      return false;
    }

    try {
      console.log('Sharing to circle:', { entryId, circleId, userId: user.id, message });
      
      const { data, error } = await supabase
        .from('registry_entry_shares')
        .insert({
          entry_id: entryId,
          user_id: user.id,
          circle_id: circleId,
          message: message || null
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Share successful:', data);
      toast.success('Entry shared to circle successfully');
      return true;
    } catch (error) {
      console.error('Error sharing to circle:', error);
      toast.error(`Failed to share entry: ${error.message || error}`);
      return false;
    }
  }, [user]);

  return {
    entries,
    categories,
    loading,
    error,
    fetchEntries,
    fetchCategories,
    createEntry,
    updateEntry,
    deleteEntry,
    togglePin,
    generateResonanceSignature,
    uploadImage,
    deleteImage,
    incrementEngagement,
    shareEntry,
    calculateWordCount,
    calculateReadingTime,
    toggleResonance,
    getUserResonanceStatus,
    getComments,
    addComment,
    deleteComment,
    shareToCircle,
    // Bookmark functions
    addBookmark,
    removeBookmark,
    isBookmarked,
    getUserBookmarks,
    // Reflection notes functions
    getReflectionNotes,
    addReflectionNote,
    updateReflectionNote,
    deleteReflectionNote,
    exportEntryAsSeed,
  };
}