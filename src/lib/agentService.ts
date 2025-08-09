import { supabase } from '@/integrations/supabase/client';

export interface AgentCapability {
  id: string;
  capability_name: string;
  description: string;
  requires_approval: boolean;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  allowed_parameters: string[];
  validation_rules: Record<string, any>;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentAction {
  id: string;
  action_type: string;
  parameters: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed' | 'expired';
  requested_by: string;
  requested_at: string;
  context: Record<string, any>;
  result?: Record<string, any>;
  error_message?: string;
  expires_at: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata: Record<string, any>;
  agent_capabilities?: AgentCapability;
}

export interface AgentApproval {
  id: string;
  action_id: string;
  approved_by: string;
  approved_at: string;
  approval_notes?: string;
  approval_method: 'dashboard' | 'email' | 'api' | 'cli';
  ip_address?: string;
  user_agent?: string;
}

export interface AgentActionRequest {
  action_type: string;
  parameters: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  context?: Record<string, any>;
  metadata?: Record<string, any>;
  conversation_id?: string;
}

export interface AgentActionResponse {
  success: boolean;
  action_id?: string;
  status?: string;
  message: string;
  requires_approval?: boolean;
  error?: string;
}

export interface AgentApprovalRequest {
  action_id: string;
  approve: boolean;
  notes?: string;
}

export interface AgentCapabilityRequest {
  capability_name: string;
  description: string;
  requires_approval: boolean;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  allowed_parameters?: string[];
  validation_rules?: Record<string, any>;
  is_enabled?: boolean;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ConversationMemory {
  id: string;
  user_id: string;
  conversation_id: string;
  messages: Message[];
  summary?: string;
  topic?: string;
  metadata: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class AgentService {
  /**
   * Request an agent action
   */
  async requestAction(request: AgentActionRequest): Promise<AgentActionResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/request-action', {
        body: request
      });

      if (error) {
        throw new Error(error.message || 'Failed to request agent action');
      }

      return data as AgentActionResponse;
    } catch (error) {
      console.error('Agent action request error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to request agent action',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Approve or reject an agent action
   */
  async approveAction(request: AgentApprovalRequest): Promise<AgentActionResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/approve-action', {
        body: request
      });

      if (error) {
        throw new Error(error.message || 'Failed to approve/reject agent action');
      }

      return data as AgentActionResponse;
    } catch (error) {
      console.error('Agent action approval error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to approve/reject agent action',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get pending agent actions
   */
  async getPendingActions(): Promise<{ success: boolean; actions?: AgentAction[]; can_approve?: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/get-pending-actions', {
        body: {}
      });

      if (error) {
        throw new Error(error.message || 'Failed to get pending agent actions');
      }

      return data as { success: boolean; actions: AgentAction[]; can_approve: boolean };
    } catch (error) {
      console.error('Get pending actions error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get agent action history
   */
  async getActionHistory(options: { limit?: number; offset?: number; status?: string } = {}): Promise<{ 
    success: boolean; 
    actions?: AgentAction[]; 
    pagination?: { limit: number; offset: number; total: number };
    error?: string 
  }> {
    try {
      const { limit = 50, offset = 0, status } = options;
      const queryParams = new URLSearchParams();
      
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', offset.toString());
      if (status) {
        queryParams.append('status', status);
      }

      const { data, error } = await supabase.functions.invoke(
        `agent-service/get-action-history?${queryParams.toString()}`,
        { body: {} }
      );

      if (error) {
        throw new Error(error.message || 'Failed to get agent action history');
      }

      return data as { 
        success: boolean; 
        actions: AgentAction[]; 
        pagination: { limit: number; offset: number; total: number } 
      };
    } catch (error) {
      console.error('Get action history error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get agent capabilities
   */
  async getCapabilities(): Promise<{ success: boolean; capabilities?: AgentCapability[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/manage-capability', {
        method: 'GET',
        body: {}
      });

      if (error) {
        throw new Error(error.message || 'Failed to get agent capabilities');
      }

      return data as { success: boolean; capabilities: AgentCapability[] };
    } catch (error) {
      console.error('Get capabilities error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create a new agent capability
   */
  async createCapability(capability: AgentCapabilityRequest): Promise<{ success: boolean; capability?: AgentCapability; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/manage-capability', {
        method: 'POST',
        body: capability
      });

      if (error) {
        throw new Error(error.message || 'Failed to create agent capability');
      }

      return data as { success: boolean; capability: AgentCapability };
    } catch (error) {
      console.error('Create capability error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update an existing agent capability
   */
  async updateCapability(capability: AgentCapabilityRequest): Promise<{ success: boolean; capability?: AgentCapability; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/manage-capability', {
        method: 'PUT',
        body: capability
      });

      if (error) {
        throw new Error(error.message || 'Failed to update agent capability');
      }

      return data as { success: boolean; capability: AgentCapability };
    } catch (error) {
      console.error('Update capability error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete an agent capability
   */
  async deleteCapability(capabilityName: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/manage-capability', {
        method: 'DELETE',
        body: { capability_name: capabilityName }
      });

      if (error) {
        throw new Error(error.message || 'Failed to delete agent capability');
      }

      return data as { success: boolean; message: string };
    } catch (error) {
      console.error('Delete capability error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if the current user can approve agent actions
   */
  async canApproveActions(): Promise<boolean> {
    try {
      const { data } = await this.getPendingActions();
      return data?.can_approve || false;
    } catch (error) {
      console.error('Can approve actions check error:', error);
      return false;
    }
  }

  /**
   * Get user context including conversation memory
   */
  async getUserContext(conversationId: string = 'default'): Promise<{ 
    success: boolean; 
    context?: Record<string, any>; 
    has_enhanced_memory?: boolean;
    error?: string 
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/get-user-context', {
        body: { conversation_id: conversationId }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get user context');
      }

      return data as { 
        success: boolean; 
        context: Record<string, any>; 
        has_enhanced_memory: boolean 
      };
    } catch (error) {
      console.error('Get user context error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get conversation memory for a specific conversation
   */
  async getConversationMemory(conversationId: string = 'default'): Promise<{ 
    success: boolean; 
    memory?: ConversationMemory; 
    error?: string 
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/get-conversation-memory', {
        body: { conversation_id: conversationId }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get conversation memory');
      }

      return data as { 
        success: boolean; 
        memory: ConversationMemory 
      };
    } catch (error) {
      console.error('Get conversation memory error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Add a message to conversation memory
   */
  async addToConversationMemory(
    conversationId: string = 'default',
    userMessage: string,
    assistantMessage: string,
    metadata: Record<string, any> = {}
  ): Promise<{ 
    success: boolean; 
    memory?: ConversationMemory; 
    error?: string 
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-service/update-conversation-memory', {
        body: { 
          conversation_id: conversationId,
          user_message: userMessage,
          assistant_message: assistantMessage,
          metadata
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to update conversation memory');
      }

      return data as { 
        success: boolean; 
        memory: ConversationMemory 
      };
    } catch (error) {
      console.error('Update conversation memory error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const agentService = new AgentService();