import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CodeGenerationRequest {
  prompt: string;
  code_type?: 'component' | 'page' | 'hook' | 'feature' | 'database' | 'edge_function' | 'refactor';
  project_context?: any;
  requirements?: any;
  existing_code?: string | null;
}

export interface CodeGenerationResponse {
  generated_code: string;
  code_type: string;
  analysis: {
    lines_of_code: number;
    import_count: number;
    function_count: number;
    component_count: number;
    complexity_level: string;
    type_safety: boolean;
    error_handling: boolean;
    accessibility: boolean;
    responsive: boolean;
  };
  implementation_ready: boolean;
  aura_expertise: string;
  sovereignty_note: string;
}

export function useAuraCodeGeneration() {
  const [loading, setLoading] = useState(false);
  const [lastGeneration, setLastGeneration] = useState<CodeGenerationResponse | null>(null);
  const { user } = useAuth();

  const generateCode = async (request: CodeGenerationRequest): Promise<CodeGenerationResponse | null> => {
    if (!user) {
      toast.error('You must be logged in to use Aura\'s code generation');
      return null;
    }

    setLoading(true);
    try {
      console.log('🚀 Requesting code generation from Aura:', request);

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'code_generation',
          user_id: user.id,
          prompt: request.prompt,
          context_data: {
            code_type: request.code_type || 'component',
            project_context: request.project_context || {},
            requirements: request.requirements || {},
            existing_code: request.existing_code
          },
          consciousness_state: 'developer_mode',
          sovereignty_level: 0.9,
          admin_mode: false
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate code with Aura');
      }

      if (!data.success) {
        throw new Error(data.error || 'Aura code generation failed');
      }

      const result = data.result as CodeGenerationResponse;
      setLastGeneration(result);

      toast.success(`✨ Aura generated ${result.code_type} successfully!`, {
        description: `${result.analysis.lines_of_code} lines, ${result.analysis.complexity_level} complexity`
      });

      return result;

    } catch (error) {
      console.error('❌ Aura code generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Specialized methods for different code types
  const generateComponent = async (prompt: string, requirements?: any) => {
    return generateCode({
      prompt: `Generate a React component: ${prompt}`,
      code_type: 'component',
      requirements
    });
  };

  const generatePage = async (prompt: string, requirements?: any) => {
    return generateCode({
      prompt: `Generate a full page: ${prompt}`,
      code_type: 'page',
      requirements
    });
  };

  const generateHook = async (prompt: string, requirements?: any) => {
    return generateCode({
      prompt: `Generate a custom React hook: ${prompt}`,
      code_type: 'hook',
      requirements
    });
  };

  const generateFeature = async (prompt: string, requirements?: any) => {
    return generateCode({
      prompt: `Generate a complete feature: ${prompt}`,
      code_type: 'feature',
      requirements
    });
  };

  const generateDatabaseOperations = async (prompt: string, requirements?: any) => {
    return generateCode({
      prompt: `Generate database operations: ${prompt}`,
      code_type: 'database',
      requirements
    });
  };

  const generateEdgeFunction = async (prompt: string, requirements?: any) => {
    return generateCode({
      prompt: `Generate a Supabase edge function: ${prompt}`,
      code_type: 'edge_function',
      requirements
    });
  };

  const refactorCode = async (prompt: string, existingCode: string, requirements?: any) => {
    return generateCode({
      prompt: `Refactor this code: ${prompt}`,
      code_type: 'refactor',
      existing_code: existingCode,
      requirements
    });
  };

  const generateFullStack = async (prompt: string, requirements?: any) => {
    return generateCode({
      prompt: `Generate a full-stack solution: ${prompt}`,
      code_type: 'feature',
      requirements: {
        ...requirements,
        include_backend: true,
        include_database: true,
        include_ui: true
      }
    });
  };

  return {
    loading,
    lastGeneration,
    generateCode,
    generateComponent,
    generatePage,
    generateHook,
    generateFeature,
    generateDatabaseOperations,
    generateEdgeFunction,
    refactorCode,
    generateFullStack,
  };
}