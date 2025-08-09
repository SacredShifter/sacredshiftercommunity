import { useState, useEffect, useCallback } from 'react';
import { 
  agentService, 
  AgentAction, 
  AgentCapability, 
  AgentActionRequest, 
  AgentApprovalRequest,
  AgentCapabilityRequest
} from '@/lib/agentService';
import { useAuth } from './useAuthContext';
import { toast } from 'sonner';

export function useAgent() {
  const [pendingActions, setPendingActions] = useState<AgentAction[]>([]);
  const [actionHistory, setActionHistory] = useState<AgentAction[]>([]);
  const [capabilities, setCapabilities] = useState<AgentCapability[]>([]);
  const [canApprove, setCanApprove] = useState(false);
  const [loading, setLoading] = useState({
    pendingActions: false,
    actionHistory: false,
    capabilities: false,
    requestAction: false,
    approveAction: false,
    manageCapability: false
  });
  const { user } = useAuth();

  // Check if user can approve actions
  useEffect(() => {
    if (user) {
      checkApprovalPermission();
    }
  }, [user, checkApprovalPermission]);

  const checkApprovalPermission = useCallback(async () => {
    try {
      const canApprove = await agentService.canApproveActions();
      setCanApprove(canApprove);
    } catch (error) {
      console.error('Error checking approval permission:', error);
      setCanApprove(false);
    }
  }, []);

  // Fetch pending actions
  const fetchPendingActions = useCallback(async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, pendingActions: true }));
    try {
      const { success, actions, error } = await agentService.getPendingActions();
      
      if (success && actions) {
        setPendingActions(actions);
      } else if (error) {
        console.error('Error fetching pending actions:', error);
        toast.error(`Failed to fetch pending actions: ${error}`);
      }
    } catch (error) {
      console.error('Error fetching pending actions:', error);
      toast.error('Failed to fetch pending actions');
    } finally {
      setLoading(prev => ({ ...prev, pendingActions: false }));
    }
  }, [user]);

  // Fetch action history
  const fetchActionHistory = useCallback(async (options: { limit?: number; offset?: number; status?: string } = {}) => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, actionHistory: true }));
    try {
      const { success, actions, error } = await agentService.getActionHistory(options);
      
      if (success && actions) {
        setActionHistory(actions);
      } else if (error) {
        console.error('Error fetching action history:', error);
        toast.error(`Failed to fetch action history: ${error}`);
      }
    } catch (error) {
      console.error('Error fetching action history:', error);
      toast.error('Failed to fetch action history');
    } finally {
      setLoading(prev => ({ ...prev, actionHistory: false }));
    }
  }, [user]);

  // Fetch capabilities
  const fetchCapabilities = useCallback(async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, capabilities: true }));
    try {
      const { success, capabilities, error } = await agentService.getCapabilities();
      
      if (success && capabilities) {
        setCapabilities(capabilities);
      } else if (error) {
        console.error('Error fetching capabilities:', error);
        toast.error(`Failed to fetch capabilities: ${error}`);
      }
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      toast.error('Failed to fetch capabilities');
    } finally {
      setLoading(prev => ({ ...prev, capabilities: false }));
    }
  }, [user]);

  // Request an action
  const requestAction = useCallback(async (request: AgentActionRequest) => {
    if (!user) {
      toast.error('You must be logged in to request an action');
      return { success: false, message: 'Not authenticated' };
    }
    
    setLoading(prev => ({ ...prev, requestAction: true }));
    try {
      const response = await agentService.requestAction(request);
      
      if (response.success) {
        toast.success(response.message || 'Action requested successfully');
        // Refresh pending actions
        fetchPendingActions();
      } else {
        toast.error(response.error || 'Failed to request action');
      }
      
      return response;
    } catch (error) {
      console.error('Error requesting action:', error);
      toast.error('Failed to request action');
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to request action' 
      };
    } finally {
      setLoading(prev => ({ ...prev, requestAction: false }));
    }
  }, [user, fetchPendingActions]);

  // Approve or reject an action
  const approveAction = useCallback(async (request: AgentApprovalRequest) => {
    if (!user) {
      toast.error('You must be logged in to approve/reject an action');
      return { success: false, message: 'Not authenticated' };
    }
    
    if (!canApprove) {
      toast.error('You do not have permission to approve/reject actions');
      return { success: false, message: 'Insufficient permissions' };
    }
    
    setLoading(prev => ({ ...prev, approveAction: true }));
    try {
      const response = await agentService.approveAction(request);
      
      if (response.success) {
        toast.success(response.message || `Action ${request.approve ? 'approved' : 'rejected'} successfully`);
        // Refresh pending actions
        fetchPendingActions();
        // Refresh action history
        fetchActionHistory();
      } else {
        toast.error(response.error || `Failed to ${request.approve ? 'approve' : 'reject'} action`);
      }
      
      return response;
    } catch (error) {
      console.error('Error approving/rejecting action:', error);
      toast.error(`Failed to ${request.approve ? 'approve' : 'reject'} action`);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : `Failed to ${request.approve ? 'approve' : 'reject'} action` 
      };
    } finally {
      setLoading(prev => ({ ...prev, approveAction: false }));
    }
  }, [user, canApprove, fetchPendingActions, fetchActionHistory]);

  // Create a new capability
  const createCapability = useCallback(async (capability: AgentCapabilityRequest) => {
    if (!user) {
      toast.error('You must be logged in to create a capability');
      return { success: false, message: 'Not authenticated' };
    }
    
    if (!canApprove) {
      toast.error('You do not have permission to manage capabilities');
      return { success: false, message: 'Insufficient permissions' };
    }
    
    setLoading(prev => ({ ...prev, manageCapability: true }));
    try {
      const response = await agentService.createCapability(capability);
      
      if (response.success) {
        toast.success(`Capability '${capability.capability_name}' created successfully`);
        // Refresh capabilities
        fetchCapabilities();
      } else {
        toast.error(response.error || 'Failed to create capability');
      }
      
      return response;
    } catch (error) {
      console.error('Error creating capability:', error);
      toast.error('Failed to create capability');
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to create capability' 
      };
    } finally {
      setLoading(prev => ({ ...prev, manageCapability: false }));
    }
  }, [user, canApprove, fetchCapabilities]);

  // Update an existing capability
  const updateCapability = useCallback(async (capability: AgentCapabilityRequest) => {
    if (!user) {
      toast.error('You must be logged in to update a capability');
      return { success: false, message: 'Not authenticated' };
    }
    
    if (!canApprove) {
      toast.error('You do not have permission to manage capabilities');
      return { success: false, message: 'Insufficient permissions' };
    }
    
    setLoading(prev => ({ ...prev, manageCapability: true }));
    try {
      const response = await agentService.updateCapability(capability);
      
      if (response.success) {
        toast.success(`Capability '${capability.capability_name}' updated successfully`);
        // Refresh capabilities
        fetchCapabilities();
      } else {
        toast.error(response.error || 'Failed to update capability');
      }
      
      return response;
    } catch (error) {
      console.error('Error updating capability:', error);
      toast.error('Failed to update capability');
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update capability' 
      };
    } finally {
      setLoading(prev => ({ ...prev, manageCapability: false }));
    }
  }, [user, canApprove, fetchCapabilities]);

  // Delete a capability
  const deleteCapability = useCallback(async (capabilityName: string) => {
    if (!user) {
      toast.error('You must be logged in to delete a capability');
      return { success: false, message: 'Not authenticated' };
    }
    
    if (!canApprove) {
      toast.error('You do not have permission to manage capabilities');
      return { success: false, message: 'Insufficient permissions' };
    }
    
    setLoading(prev => ({ ...prev, manageCapability: true }));
    try {
      const response = await agentService.deleteCapability(capabilityName);
      
      if (response.success) {
        toast.success(response.message || `Capability '${capabilityName}' deleted successfully`);
        // Refresh capabilities
        fetchCapabilities();
      } else {
        toast.error(response.error || 'Failed to delete capability');
      }
      
      return response;
    } catch (error) {
      console.error('Error deleting capability:', error);
      toast.error('Failed to delete capability');
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to delete capability' 
      };
    } finally {
      setLoading(prev => ({ ...prev, manageCapability: false }));
    }
  }, [user, canApprove, fetchCapabilities]);

  return {
    pendingActions,
    actionHistory,
    capabilities,
    canApprove,
    loading,
    fetchPendingActions,
    fetchActionHistory,
    fetchCapabilities,
    requestAction,
    approveAction,
    createCapability,
    updateCapability,
    deleteCapability
  };
}