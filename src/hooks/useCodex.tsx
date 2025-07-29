import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CodexEntry {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  type: string;
  resonance_tags: string[];
  source_module: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewCodexEntry {
  title: string;
  content?: string;
  type: string;
  resonance_tags: string[];
  source_module?: string;
}

export function useCodex() {
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEntries = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('personal_codex_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries((data || []) as CodexEntry[]);
    } catch (err) {
      console.error('Error fetching codex entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createEntry = useCallback(async (entryData: NewCodexEntry) => {
    if (!user) {
      toast.error('You must be logged in to create entries');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('personal_codex_entries')
        .insert({
          ...entryData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data as CodexEntry, ...prev]);
      toast.success('Codex entry created successfully');
      return data;
    } catch (err) {
      console.error('Error creating entry:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create entry');
      return null;
    }
  }, [user]);

  const updateEntry = useCallback(async (id: string, updates: Partial<NewCodexEntry>) => {
    try {
      const { data, error } = await supabase
        .from('personal_codex_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...data } as CodexEntry : entry));
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
        .from('personal_codex_entries')
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

  const searchEntries = useCallback((query: string) => {
    if (!query.trim()) return entries;
    
    const searchTerm = query.toLowerCase();
    return entries.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content?.toLowerCase().includes(searchTerm) ||
      entry.type.toLowerCase().includes(searchTerm) ||
      entry.resonance_tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }, [entries]);

  const filterByType = useCallback((type: string) => {
    if (!type) return entries;
    return entries.filter(entry => entry.type === type);
  }, [entries]);

  const filterBySourceModule = useCallback((module: string) => {
    if (!module) return entries;
    return entries.filter(entry => entry.source_module === module);
  }, [entries]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('personal_codex_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personal_codex_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Codex entry change:', payload);
          fetchEntries(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, fetchEntries]);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries,
    filterByType,
    filterBySourceModule,
    refetch: fetchEntries,
  };
}