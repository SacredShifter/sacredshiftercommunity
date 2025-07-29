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
}

export interface NewRegistryEntry {
  title: string;
  content: string;
  resonance_rating: number;
  tags: string[];
  entry_type: 'Personal' | 'Collective' | 'Transmission';
  access_level: 'Private' | 'Circle' | 'Public';
  resonance_signature?: string;
}

export function useRegistryOfResonance() {
  const [entries, setEntries] = useState<RegistryEntry[]>([]);
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
      setEntries((data || []) as RegistryEntry[]);
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

  const updateEntry = useCallback(async (id: string, updates: Partial<NewRegistryEntry>) => {
    try {
      const { data, error } = await supabase
        .from('registry_of_resonance')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...data } as RegistryEntry : entry));
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

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    loading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    togglePin,
    generateResonanceSignature,
  };
}