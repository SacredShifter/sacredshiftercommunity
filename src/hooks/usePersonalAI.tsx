import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PersonalAIRequest {
  request_type: 'registry_analysis' | 'multi_step_guidance' | 'consciousness_mapping' | 'synchronicity_analysis' | 'predictive_modeling' | 'general_guidance';
  user_query: string;
  context_data?: any;
}

export function usePersonalAI() {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const { user } = useAuth();

  const askPersonalAI = async (request: PersonalAIRequest): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to use your personal AI');
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

      if (!data.success) {
        throw new Error(data.error || 'AI assistant request failed');
      }

      setLastResponse(data.response);
      return data.response;

    } catch (error) {
      console.error('Personal AI error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get AI response');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Specialized methods for different AI capabilities
  const analyzeConsciousness = async (query: string) => {
    return askPersonalAI({
      request_type: 'consciousness_mapping',
      user_query: query
    });
  };

  const createMultiStepPlan = async (goal: string) => {
    return askPersonalAI({
      request_type: 'multi_step_guidance',
      user_query: `Create a detailed multi-step plan for: ${goal}`
    });
  };

  const analyzeSynchronicity = async (event: string) => {
    return askPersonalAI({
      request_type: 'synchronicity_analysis',
      user_query: `Analyze this synchronicity event: ${event}`
    });
  };

  const getPredictiveInsights = async (area: string) => {
    return askPersonalAI({
      request_type: 'predictive_modeling',
      user_query: `Provide predictive insights for: ${area}`
    });
  };

  const getPersonalGuidance = async (question: string) => {
    return askPersonalAI({
      request_type: 'general_guidance',
      user_query: question
    });
  };

  return {
    loading,
    lastResponse,
    askPersonalAI,
    analyzeConsciousness,
    createMultiStepPlan,
    analyzeSynchronicity,
    getPredictiveInsights,
    getPersonalGuidance,
  };
}