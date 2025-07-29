import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface AIAssistantRequest {
  request_type: 'registry_analysis' | 'circle_guidance' | 'journal_reflection' | 'general_guidance';
  user_query: string;
  context_data?: any;
}

export interface AIAssistantResponse {
  response: string;
  request_type: string;
  success: boolean;
  error?: string;
}

export function useAIAssistant() {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const { user } = useAuth();

  const askAssistant = async (request: AIAssistantRequest): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to use the AI assistant');
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          ...request,
          user_id: user.id,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      const response = data as AIAssistantResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'AI assistant request failed');
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

  const analyzeRegistry = async (query: string, entries?: any[]) => {
    return askAssistant({
      request_type: 'registry_analysis',
      user_query: query,
      context_data: { entries }
    });
  };

  const getCircleGuidance = async (query: string, posts?: any[]) => {
    return askAssistant({
      request_type: 'circle_guidance',
      user_query: query,
      context_data: { posts }
    });
  };

  const reflectOnJournal = async (query: string, journals?: any[]) => {
    return askAssistant({
      request_type: 'journal_reflection',
      user_query: query,
      context_data: { journals }
    });
  };

  const getGeneralGuidance = async (query: string) => {
    return askAssistant({
      request_type: 'general_guidance',
      user_query: query
    });
  };

  return {
    loading,
    lastResponse,
    askAssistant,
    analyzeRegistry,
    getCircleGuidance,
    reflectOnJournal,
    getGeneralGuidance,
  };
}