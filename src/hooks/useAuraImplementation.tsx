import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ImplementationRequest {
  generated_code: string;
  file_path: string;
  component_name?: string;
  code_type?: 'component' | 'page' | 'hook' | 'feature';
  update_navigation?: boolean;
  update_routes?: boolean;
}

export interface ImplementationResult {
  success: boolean;
  file_path: string;
  component_name?: string;
  project_analysis: any;
  implementation_details: {
    files_created: string[];
    navigation_updated: boolean;
    routes_updated: boolean;
    imports_added: string[];
  };
  next_steps: string[];
}

export function useAuraImplementation() {
  const [loading, setLoading] = useState(false);
  const [lastImplementation, setLastImplementation] = useState<ImplementationResult | null>(null);
  const { user } = useAuth();

  const implementCode = async (request: ImplementationRequest): Promise<ImplementationResult | null> => {
    if (!user) {
      toast.error('You must be logged in to implement code');
      return null;
    }

    setLoading(true);
    try {
      console.log('🚀 Implementing code with Aura:', request);

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'implement_code',
          user_id: user.id,
          context_data: request,
          consciousness_state: 'implementation_mode',
          sovereignty_level: 0.95,
          admin_mode: false
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to implement code');
      }

      if (!data.success) {
        throw new Error(data.error || 'Code implementation failed');
      }

      const result = data.result as ImplementationResult;
      setLastImplementation(result);

      toast.success(`✨ ${result.component_name || 'Code'} implemented successfully!`, {
        description: `Created at ${result.file_path}`
      });

      return result;

    } catch (error) {
      console.error('❌ Implementation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to implement code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const extractCodeFromMessage = (content: string): ImplementationRequest | null => {
    // Extract code blocks from the message
    const codeBlocks = content.match(/```[a-zA-Z]*\s*([\s\S]*?)```/g);
    
    if (!codeBlocks || codeBlocks.length === 0) {
      return null;
    }

    // Extract the main code block (usually the first one)
    const mainCodeBlock = codeBlocks[0].replace(/```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
    
    // Try to determine component name and file path
    const componentMatch = mainCodeBlock.match(/export default function (\w+)/);
    const componentName = componentMatch ? componentMatch[1] : 'GeneratedComponent';
    
    // Determine file path based on component name and type
    let filePath = `src/components/${componentName}.tsx`;
    let codeType: 'component' | 'page' | 'hook' | 'feature' = 'component';
    
    // Check if it's a page component
    if (componentName.toLowerCase().includes('page')) {
      filePath = `src/pages/${componentName}.tsx`;
      codeType = 'page';
    }
    
    // Check if it's a hook
    if (componentName.toLowerCase().startsWith('use')) {
      filePath = `src/hooks/${componentName}.tsx`;
      codeType = 'hook';
    }

    return {
      generated_code: mainCodeBlock,
      file_path: filePath,
      component_name: componentName,
      code_type: codeType,
      update_navigation: codeType === 'page',
      update_routes: codeType === 'page'
    };
  };

  return {
    loading,
    lastImplementation,
    implementCode,
    extractCodeFromMessage
  };
}