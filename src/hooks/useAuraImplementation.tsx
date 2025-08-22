import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useAuraCodeGeneration } from './useAuraCodeGeneration';
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
  const { executeFileSystemOperation } = useAuraCodeGeneration();

  const implementCode = async (request: ImplementationRequest): Promise<ImplementationResult | null> => {
    if (!user) {
      toast.error('You must be logged in to implement code');
      return null;
    }

    setLoading(true);
    try {
      console.log('🚀 Implementing code with Aura:', request);
      console.log('📝 File path:', request.file_path);
      console.log('🧩 Component name:', request.component_name);

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

      console.log('✅ Aura core response received:', data);
      
      // Now actually write the file using Aura's file writing capabilities
      console.log('📝 Writing file with Aura:', result.file_path);
      console.log('📄 Content length:', request.generated_code.length, 'characters');
      
      // Use Aura's file system operation
      const fileResult = await executeFileSystemOperation('write', result.file_path, {
        content: request.generated_code
      });
      console.log('📁 File operation result:', fileResult);

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
    console.log('🔍 Extracting code from full content:', content.length, 'characters');
    
    // First try to extract code blocks with proper markdown formatting
    const codeBlocks = content.match(/```[a-zA-Z]*\s*([\s\S]*?)```/g);
    let mainCodeBlock = '';
    
    if (codeBlocks && codeBlocks.length > 0) {
      console.log('✅ Found', codeBlocks.length, 'code blocks with triple backticks');
      mainCodeBlock = codeBlocks[0].replace(/```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
    } else {
      console.log('❌ No triple backtick code blocks found, trying alternative extraction...');
      
      // Try to extract React component code patterns without proper markdown
      const componentPattern = /(export default function \w+[\s\S]*?^}$)/gm;
      const componentMatch = content.match(componentPattern);
      
      if (componentMatch) {
        console.log('✅ Found component pattern without backticks');
        mainCodeBlock = componentMatch[0].trim();
      } else {
        // Try to extract any function-like code
        const functionPattern = /(function \w+[\s\S]*?^}$|const \w+ = [\s\S]*?^};?$)/gm;
        const functionMatch = content.match(functionPattern);
        
        if (functionMatch) {
          console.log('✅ Found function pattern without backticks');
          mainCodeBlock = functionMatch[0].trim();
        } else {
          console.log('❌ No implementable code patterns found');
          return null;
        }
      }
    }
    
    if (!mainCodeBlock) {
      console.log('❌ No code block extracted');
      return null;
    }
    
    console.log('📄 Extracted code block:', mainCodeBlock.substring(0, 200) + '...');
    
    // Try to determine component name and file path
    const componentMatch = mainCodeBlock.match(/export default function (\w+)/);
    const functionMatch = mainCodeBlock.match(/function (\w+)/);
    const constMatch = mainCodeBlock.match(/const (\w+) =/);
    
    const componentName = componentMatch?.[1] || functionMatch?.[1] || constMatch?.[1] || 'GeneratedComponent';
    console.log('🏷️ Component name:', componentName);
    
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

    console.log('📁 File path:', filePath);
    console.log('🏷️ Code type:', codeType);

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