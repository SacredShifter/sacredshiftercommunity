import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface MirrorJournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string | null;
  is_draft: boolean;
  mood_tag: string | null;
  chakra_alignment: string | null;
  created_at: string;
  updated_at: string;
}

export const useMirrorJournal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<MirrorJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all journal entries for the current user
  const fetchEntries = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mirror_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error loading journal entries",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Create a new journal entry
  const createEntry = useCallback(async (entryData: {
    title?: string;
    content?: string;
    is_draft?: boolean;
    mood_tag?: string;
    chakra_alignment?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('mirror_journal_entries')
        .insert({
          user_id: user.id,
          title: entryData.title || null,
          content: entryData.content || null,
          is_draft: entryData.is_draft || false,
          mood_tag: entryData.mood_tag || null,
          chakra_alignment: entryData.chakra_alignment || null,
        })
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data, ...prev]);
      toast({
        title: "Entry created",
        description: entryData.is_draft ? "Draft saved" : "Journal entry created successfully",
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error creating entry",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Update an existing journal entry
  const updateEntry = useCallback(async (id: string, updates: Partial<MirrorJournalEntry>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('mirror_journal_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(entry => entry.id === id ? data : entry));
      toast({
        title: "Entry updated",
        description: updates.is_draft ? "Draft saved" : "Journal entry updated successfully",
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error updating entry",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Delete a journal entry
  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('mirror_journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Entry deleted",
        description: "Journal entry deleted successfully",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Error deleting entry",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Auto-save functionality for drafts
  const autoSave = useCallback(async (id: string, content: string, title?: string) => {
    if (!user) return;

    try {
      await supabase
        .from('mirror_journal_entries')
        .update({
          content,
          title: title || null,
          is_draft: true,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      // Update local state without showing toast for auto-save
      setEntries(prev => prev.map(entry => 
        entry.id === id 
          ? { ...entry, content, title: title || null, is_draft: true }
          : entry
      ));
    } catch (err) {
      // Silent fail for auto-save
      console.error('Auto-save failed:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('mirror_journal_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mirror_journal_entries',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEntries(prev => [payload.new as MirrorJournalEntry, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEntries(prev => prev.map(entry => 
              entry.id === payload.new.id ? payload.new as MirrorJournalEntry : entry
            ));
          } else if (payload.eventType === 'DELETE') {
            setEntries(prev => prev.filter(entry => entry.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    autoSave,
    refetch: fetchEntries,
  };
};