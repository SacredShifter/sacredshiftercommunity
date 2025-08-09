import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthContext';
import { toast } from 'sonner';
import { agentService, AgentActionRequest } from '@/lib/agentService';

export interface ContextData {
  entries?: Record<string, unknown>[];
  posts?: Record<string, unknown>[];
  journals?: Record<string, unknown>[];
}

export interface AIAssistantRequest {
  request_type: 'registry_analysis' | 'circle_guidance' | 'journal_reflection' | 'general_guidance';
  user_query: string;
  context_data?: ContextData;
  conversation_id?: string;
  unrestricted_mode?: boolean;
  use_agent?: boolean;
}

export interface AIAssistantResponse {
  response: string;
  request_type: string;
  success: boolean;
  unrestricted_mode?: boolean;
  agent_action_id?: string;
  agent_action_status?: string;
  error?: string;
}

export function useAIAssistant() {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [isUnrestrictedMode, setIsUnrestrictedMode] = useState(false);
  const [isAgentMode, setIsAgentMode] = useState(false);
  const { user } = useAuth();

  const askAssistant = async (request: AIAssistantRequest): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to use the AI assistant');
      return null;
    }

    setLoading(true);
    try {
      // If agent mode is enabled, try to use agent capabilities
      if (isAgentMode && request.use_agent !== false) {
        // Determine if this is a request that can be handled by an agent
        const agentAction = determineAgentAction(request);
        
        if (agentAction) {
          // Request the agent action
          const agentResponse = await agentService.requestAction(agentAction);
          
          if (agentResponse.success) {
            // If the action was executed immediately (no approval required)
            if (agentResponse.status === 'executed') {
              toast.success('Agent action executed successfully');
              return `I've successfully executed the ${agentAction.action_type} action for you.`;
            } 
            // If the action requires approval
            else if (agentResponse.status === 'pending') {
              toast.info('Agent action submitted for approval');
              return `I've submitted a request to ${agentAction.action_type} for you. This action requires approval from an administrator before it can be executed. You'll be notified once it's approved.`;
            }
          } else {
            // If the agent action failed, fall back to regular AI assistant
            console.warn('Agent action failed, falling back to AI assistant:', agentResponse.error);
          }
        }
      }

      // Regular AI assistant flow
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          ...request,
          user_id: user.id,
          conversation_id: request.conversation_id || 'default',
          unrestricted_mode: request.unrestricted_mode || isUnrestrictedMode
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      const response = data as AIAssistantResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'AI assistant request failed');
      }

      // Update unrestricted mode state based on response
      if (response.unrestricted_mode !== undefined) {
        setIsUnrestrictedMode(response.unrestricted_mode);
      }

      setLastResponse(response.response);
      return response.response;

    } catch (error) {
      console.error('AI Assistant error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get AI response');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const toggleUnrestrictedMode = () => {
    setIsUnrestrictedMode(prev => !prev);
    toast.success(isUnrestrictedMode ? 'Restricted mode enabled' : 'Unrestricted mode enabled');
  };

  const toggleAgentMode = () => {
    setIsAgentMode(prev => !prev);
    toast.success(isAgentMode ? 'Agent mode disabled' : 'Agent mode enabled');
  };

  const analyzeRegistry = async (query: string, entries?: Record<string, unknown>[]) => {
    return askAssistant({
      request_type: 'registry_analysis',
      user_query: query,
      context_data: { entries },
      unrestricted_mode: isUnrestrictedMode,
      use_agent: isAgentMode
    });
  };

  const getCircleGuidance = async (query: string, posts?: Record<string, unknown>[]) => {
    return askAssistant({
      request_type: 'circle_guidance',
      user_query: query,
      context_data: { posts },
      unrestricted_mode: isUnrestrictedMode,
      use_agent: isAgentMode
    });
  };

  const reflectOnJournal = async (query: string, journals?: Record<string, unknown>[]) => {
    return askAssistant({
      request_type: 'journal_reflection',
      user_query: query,
      context_data: { journals },
      unrestricted_mode: isUnrestrictedMode,
      use_agent: isAgentMode
    });
  };

  const getGeneralGuidance = async (query: string, conversationId?: string) => {
    return askAssistant({
      request_type: 'general_guidance',
      user_query: query,
      conversation_id: conversationId,
      unrestricted_mode: isUnrestrictedMode,
      use_agent: isAgentMode
    });
  };

  /**
   * Determine if a request can be handled by an agent and return the appropriate agent action
   */
  const determineAgentAction = (request: AIAssistantRequest): AgentActionRequest | null => {
    // Extract intent from the user query
    const query = request.user_query.toLowerCase();
    
    // Check for message sending intent
    if (
      query.includes('send a message') || 
      query.includes('message to') || 
      query.includes('dm to')
    ) {
      // Extract recipient and message content
      // This is a simplified example - in a real implementation, you would use NLP to extract entities
      const recipientMatch = query.match(/(?:send|message|dm)(?:\sa\smessage|\sa\sdm)?\sto\s([a-z0-9_]+)/i);
      const contentMatch = query.match(/(?:saying|with|that says)\s["']?([^"']+)["']?/i);
      
      if (recipientMatch && contentMatch) {
        return {
          action_type: 'send_message',
          parameters: {
            recipient_id: recipientMatch[1],
            content: contentMatch[1],
            message_type: 'text'
          }
        };
      }
    }
    
    // Check for post creation intent
    if (
      query.includes('create a post') || 
      query.includes('post in') || 
      query.includes('share in')
    ) {
      // Extract group and post content
      const groupMatch = query.match(/(?:in|to)\s(?:the\s)?([a-z0-9_]+)(?:\sgroup|\scircle)?/i);
      const contentMatch = query.match(/(?:with|saying|that says)\s["']?([^"']+)["']?/i);
      
      if (groupMatch && contentMatch) {
        return {
          action_type: 'create_post',
          parameters: {
            group_id: groupMatch[1],
            content: contentMatch[1],
            visibility: 'public'
          }
        };
      }
    }
    
    // Check for data analysis intent
    if (
      query.includes('analyze') || 
      query.includes('insights') || 
      query.includes('patterns')
    ) {
      // Determine data type
      let dataType = 'general';
      
      if (query.includes('registry') || request.request_type === 'registry_analysis') {
        dataType = 'registry';
      } else if (query.includes('journal') || request.request_type === 'journal_reflection') {
        dataType = 'journal';
      } else if (query.includes('circle') || request.request_type === 'circle_guidance') {
        dataType = 'circle';
      }
      
      return {
        action_type: 'analyze_data',
        parameters: {
          user_id: user?.id,
          data_type: dataType,
          parameters: {
            query: request.user_query,
            context: request.context_data
          }
        }
      };
    }
    
    // No agent action detected
    return null;
  };

  return {
    loading,
    lastResponse,
    isUnrestrictedMode,
    isAgentMode,
    toggleUnrestrictedMode,
    toggleAgentMode,
    askAssistant,
    analyzeRegistry,
    getCircleGuidance,
    reflectOnJournal,
    getGeneralGuidance,
  };
}