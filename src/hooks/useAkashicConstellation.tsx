import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface AkashicEntry {
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
  // Sacred fields for archetypal organization
  consciousness_state?: string;
  sacred_frequency?: number;
  archetypal_resonance?: string;
  temporal_signature?: string;
}

export interface NewAkashicEntry {
  title: string;
  content?: string;
  type: string;
  resonance_tags: string[];
  source_module?: string;
  consciousness_state?: string;
  sacred_frequency?: number;
  archetypal_resonance?: string;
}

export function useAkashicConstellation() {
  const [entries, setEntries] = useState<AkashicEntry[]>([]);
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
      setEntries((data || []) as AkashicEntry[]);
    } catch (err) {
      console.error('Error fetching akashic entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
      toast.error('Failed to access Akashic Records');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createEntry = useCallback(async (entryData: NewAkashicEntry) => {
    if (!user) {
      toast.error('You must be logged in to create sacred entries');
      return null;
    }

    try {
      // Calculate sacred frequency based on content resonance
      const sacredFrequency = calculateSacredFrequency(entryData.content || '', entryData.type);
      
      const { data, error } = await supabase
        .from('personal_codex_entries')
        .insert({
          ...entryData,
          user_id: user.id,
          sacred_frequency: sacredFrequency,
          archetypal_resonance: mapArchetypalResonance(entryData.type),
        })
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data as AkashicEntry, ...prev]);
      toast.success('Sacred entry added to the Akashic Constellation ⟐');
      return data;
    } catch (err) {
      console.error('Error creating akashic entry:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create sacred entry');
      return null;
    }
  }, [user]);

  const updateEntry = useCallback(async (id: string, updates: Partial<NewAkashicEntry>) => {
    try {
      // Recalculate sacred frequency if content changed
      const updateData = { ...updates };
      if (updates.content || updates.type) {
        updateData.sacred_frequency = calculateSacredFrequency(
          updates.content || '', 
          updates.type || ''
        );
      }
      
      const { data, error } = await supabase
        .from('personal_codex_entries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...data } as AkashicEntry : entry));
      toast.success('Sacred record updated in the constellation');
      return data;
    } catch (err) {
      console.error('Error updating akashic entry:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update sacred record');
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
      toast.success('Sacred record released from the constellation');
    } catch (err) {
      console.error('Error deleting akashic entry:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to release sacred record');
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

  const filterByArchetype = useCallback((archetype: string) => {
    if (!archetype || archetype === 'all') return entries;
    return entries.filter(entry => entry.type === archetype);
  }, [entries]);

  const filterBySourceRealm = useCallback((realm: string) => {
    if (!realm || realm === 'all') return entries;
    return entries.filter(entry => entry.source_module === realm);
  }, [entries]);

  // Sacred geometry and frequency calculations
  const getConstellationMetrics = useCallback(() => {
    if (entries.length === 0) return null;

    const archetypeDistribution = entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageFrequency = entries.reduce((sum, entry) => sum + (entry.sacred_frequency || 0), 0) / entries.length;
    
    const recentEntries = entries.filter(entry => {
      const created = new Date(entry.created_at);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return created > monthAgo;
    });

    return {
      totalRecords: entries.length,
      archetypeDistribution,
      averageFrequency,
      recentActivity: recentEntries.length,
      dominantArchetype: Object.entries(archetypeDistribution).sort(([,a], [,b]) => b - a)[0]?.[0]
    };
  }, [entries]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Set up real-time sacred synchronization
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('akashic_constellation_sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personal_codex_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Akashic constellation sync:', payload);
          fetchEntries(); // Re-sync constellation
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
    filterByArchetype,
    filterBySourceRealm,
    getConstellationMetrics,
    refetch: fetchEntries,
  };
}

// Sacred frequency calculation based on content resonance
function calculateSacredFrequency(content: string, type: string): number {
  // Base frequencies for different archetypal categories
  const archetypeFrequencies: Record<string, number> = {
    'Sacred Downloads': 528, // Love frequency
    'Dream Wisdom': 639,    // Harmonizing relationships
    'Integration Keys': 741, // Expression/solutions
    'Emotional Alchemy': 417, // Facilitating change
    'Consciousness Fragments': 396, // Liberating guilt/fear
    'Vision Threads': 852,   // Return to spiritual order
    'Memory Crystals': 963   // Divine consciousness
  };

  const baseFreq = archetypeFrequencies[type] || 432; // Default to 432Hz (cosmic frequency)
  
  // Modify frequency based on content resonance patterns
  let modifier = 0;
  const sacredWords = ['love', 'light', 'truth', 'sacred', 'divine', 'unity', 'peace', 'wisdom'];
  const lowerContent = content.toLowerCase();
  
  sacredWords.forEach(word => {
    if (lowerContent.includes(word)) {
      modifier += 11; // Sacred number
    }
  });

  return baseFreq + modifier;
}

// Map archetypal resonance patterns
function mapArchetypalResonance(type: string): string {
  const resonanceMap: Record<string, string> = {
    'Sacred Downloads': 'Crown Chakra - Divine Connection',
    'Dream Wisdom': 'Third Eye - Inner Vision',
    'Integration Keys': 'Solar Plexus - Personal Power',
    'Emotional Alchemy': 'Heart Chakra - Love & Healing',
    'Consciousness Fragments': 'Throat Chakra - Expression',
    'Vision Threads': 'Third Eye - Intuitive Sight',
    'Memory Crystals': 'Crown Chakra - Universal Memory'
  };

  return resonanceMap[type] || 'Root Chakra - Grounding';
}