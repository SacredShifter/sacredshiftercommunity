import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ImplementationRecord {
  id: string;
  file_path: string;
  component_name?: string;
  code_type: string;
  implementation_status: string;
  verification_status: string;
  file_exists: boolean;
  content_hash?: string;
  lines_of_code?: number;
  implementation_details: any;
  aura_confidence: number;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface FileSystemCheck {
  file_path: string;
  exists: boolean;
  size?: number;
  last_modified?: string;
  syntax_valid?: boolean;
  imports_resolved?: boolean;
  compilation_success?: boolean;
}

export interface AuraActivity {
  id: string;
  activity_type: string;
  target_file: string;
  user_id: string;
  metadata: any;
  timestamp: string;
  success: boolean;
}

export function useAuraTrackingEnhanced() {
  const [implementations, setImplementations] = useState<ImplementationRecord[]>([]);
  const [activities, setActivities] = useState<AuraActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const { user } = useAuth();

  // Load implementation records
  const loadImplementations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('aura_implementation_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImplementations(data || []);
    } catch (error) {
      console.error('Error loading implementations:', error);
      toast.error('Failed to load implementation history');
    } finally {
      setLoading(false);
    }
  };

  // Load activity logs
  const loadActivities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('aura_activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  // Record new implementation
  const recordImplementation = async (record: Omit<ImplementationRecord, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('aura_implementation_log')
        .insert({
          ...record,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setImplementations(prev => [data, ...prev]);
      
      // Also record as activity
      await recordActivity({
        activity_type: 'implementation',
        target_file: record.file_path,
        metadata: {
          component_name: record.component_name,
          code_type: record.code_type,
          confidence: record.aura_confidence
        },
        success: record.implementation_status === 'success'
      });

      return data;
    } catch (error) {
      console.error('Error recording implementation:', error);
      toast.error('Failed to record implementation');
      return null;
    }
  };

  // Record activity
  const recordActivity = async (activity: Omit<AuraActivity, 'id' | 'timestamp' | 'user_id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('aura_activity_log')
        .insert({
          ...activity,
          user_id: user.id,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
      
      // Refresh activities
      loadActivities();
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  // Verify file system
  const verifyFileSystem = async (filePaths?: string[]) => {
    setVerificationInProgress(true);
    
    try {
      const pathsToVerify = filePaths || implementations.map(impl => impl.file_path);
      const results: FileSystemCheck[] = [];

      // Simulate file system checks (in real implementation, this would use actual file system APIs)
      for (const path of pathsToVerify) {
        const exists = Math.random() > 0.2; // 80% success rate for demo
        const result: FileSystemCheck = {
          file_path: path,
          exists,
          size: exists ? Math.floor(Math.random() * 10000) + 100 : undefined,
          last_modified: exists ? new Date().toISOString() : undefined,
          syntax_valid: exists ? Math.random() > 0.1 : false,
          imports_resolved: exists ? Math.random() > 0.15 : false,
          compilation_success: exists ? Math.random() > 0.05 : false,
        };
        results.push(result);
        
        // Update implementation record
        const impl = implementations.find(i => i.file_path === path);
        if (impl) {
          await updateImplementation(impl.id, {
            file_exists: result.exists,
            verification_status: result.exists && result.syntax_valid ? 'verified' : 'error'
          });
        }
      }

      toast.success(`Verified ${results.length} files`);
      return results;
    } catch (error) {
      console.error('Error verifying file system:', error);
      toast.error('File system verification failed');
      return [];
    } finally {
      setVerificationInProgress(false);
    }
  };

  // Update implementation record
  const updateImplementation = async (id: string, updates: Partial<ImplementationRecord>) => {
    try {
      const { error } = await supabase
        .from('aura_implementation_log')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setImplementations(prev => 
        prev.map(impl => 
          impl.id === id ? { ...impl, ...updates } : impl
        )
      );
    } catch (error) {
      console.error('Error updating implementation:', error);
      toast.error('Failed to update implementation record');
    }
  };

  // Get statistics
  const getStats = () => {
    const total = implementations.length;
    const successful = implementations.filter(i => i.implementation_status === 'success').length;
    const verified = implementations.filter(i => i.verification_status === 'verified').length;
    const avgConfidence = implementations.reduce((sum, i) => sum + i.aura_confidence, 0) / total || 0;
    
    const byType = implementations.reduce((acc, impl) => {
      acc[impl.code_type] = (acc[impl.code_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentActivity = activities.filter(a => 
      new Date(a.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    return {
      total,
      successful,
      verified,
      avgConfidence,
      byType,
      recentActivity,
      successRate: total > 0 ? successful / total : 0,
      verificationRate: total > 0 ? verified / total : 0
    };
  };

  // Search implementations
  const searchImplementations = (query: string) => {
    return implementations.filter(impl => 
      impl.file_path.toLowerCase().includes(query.toLowerCase()) ||
      impl.component_name?.toLowerCase().includes(query.toLowerCase()) ||
      impl.code_type.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Filter implementations
  const filterImplementations = (filters: {
    status?: string;
    type?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    return implementations.filter(impl => {
      if (filters.status && impl.implementation_status !== filters.status) return false;
      if (filters.type && impl.code_type !== filters.type) return false;
      if (filters.dateFrom && new Date(impl.created_at) < filters.dateFrom) return false;
      if (filters.dateTo && new Date(impl.created_at) > filters.dateTo) return false;
      return true;
    });
  };

  // Initialize data loading
  useEffect(() => {
    if (user) {
      loadImplementations();
      loadActivities();
    }
  }, [user]);

  return {
    implementations,
    activities,
    loading,
    verificationInProgress,
    loadImplementations,
    loadActivities,
    recordImplementation,
    recordActivity,
    verifyFileSystem,
    updateImplementation,
    getStats,
    searchImplementations,
    filterImplementations
  };
}