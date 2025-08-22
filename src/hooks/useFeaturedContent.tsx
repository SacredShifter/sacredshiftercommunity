import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FeaturedContent {
  id: string;
  content_type: 'registry_entry' | 'circle' | 'grove_session' | 'custom';
  content_id?: string;
  title: string;
  description?: string;
  image_url?: string;
  feature_type: 'hero' | 'featured_tile' | 'spotlight' | 'banner';
  priority: number;
  is_active: boolean;
  featured_until?: string;
  created_at: string;
  updated_at: string;
}

export function useFeaturedContent() {
  const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchFeaturedContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Since featured_content table may not exist yet, return mock data
      const mockFeaturedContent: FeaturedContent[] = [
        {
          id: '1',
          content_type: 'registry_entry',
          content_id: '7447474-entry',
          title: '7447474 — The Spirit Number',
          description: 'Dream and digital converged… Build the structure; Spirit will fill it.',
          feature_type: 'hero',
          priority: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setFeaturedContent(mockFeaturedContent);
    } catch (err) {
      console.error('Error fetching featured content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedContent();

    // Set up real-time subscription for featured content updates
    const channel = supabase
      .channel('featured-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'featured_content'
        },
        () => {
          fetchFeaturedContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    featuredContent,
    loading,
    error,
    refetch: fetchFeaturedContent
  };
}