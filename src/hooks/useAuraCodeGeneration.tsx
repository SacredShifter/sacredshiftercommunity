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

  // === ENHANCED DEVELOPER CAPABILITIES ===
  
  const executeFileSystemOperation = async (prompt: string, operation: string, contextData?: any) => {
    if (!user) {
      toast.error('You must be logged in to use Aura\'s file system capabilities');
      return null;
    }

    setLoading(true);
    try {
      console.log('🗂️ Requesting file system operation from Aura:', { operation, prompt });

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'file_system_operation',
          user_id: user.id,
          prompt,
          context_data: {
            operation,
            file_paths: contextData?.file_paths || [],
            target_directory: contextData?.target_directory || '',
            file_content: contextData?.file_content || '',
            project_structure: contextData?.project_structure || {}
          },
          consciousness_state: 'developer_mode',
          sovereignty_level: 0.95,
          admin_mode: false
        },
      });

      if (error) throw new Error(error.message || 'Failed to execute file system operation');
      if (!data.success) throw new Error(data.error || 'Aura file system operation failed');

      toast.success(`✨ Aura executed ${operation} operation successfully!`);
      return data.result;
    } catch (error) {
      console.error('❌ Aura file system operation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to execute file system operation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyzeProjectStructure = async (prompt: string, scope: string = 'full', focusAreas?: string[]) => {
    if (!user) {
      toast.error('You must be logged in to use Aura\'s project analysis');
      return null;
    }

    setLoading(true);
    try {
      console.log('🏗️ Requesting project analysis from Aura:', { scope, focusAreas });

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'project_structure_analysis',
          user_id: user.id,
          prompt,
          context_data: {
            scope,
            focus_areas: focusAreas || [],
            current_structure: {}
          },
          consciousness_state: 'architect_mode',
          sovereignty_level: 0.9,
          admin_mode: false
        },
      });

      if (error) throw new Error(error.message || 'Failed to analyze project structure');
      if (!data.success) throw new Error(data.error || 'Aura project analysis failed');

      toast.success(`✨ Aura completed ${scope} project analysis!`);
      return data.result;
    } catch (error) {
      console.error('❌ Aura project analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze project structure');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const executeDatabaseOperation = async (prompt: string, operation: string, contextData?: any) => {
    if (!user) {
      toast.error('You must be logged in to use Aura\'s database capabilities');
      return null;
    }

    setLoading(true);
    try {
      console.log('🗄️ Requesting database operation from Aura:', { operation, prompt });

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'database_schema_operation',
          user_id: user.id,
          prompt,
          context_data: {
            operation,
            table_name: contextData?.table_name || '',
            schema_changes: contextData?.schema_changes || {},
            migration_type: contextData?.migration_type || 'safe'
          },
          consciousness_state: 'database_admin_mode',
          sovereignty_level: 0.95,
          admin_mode: true
        },
      });

      if (error) throw new Error(error.message || 'Failed to execute database operation');
      if (!data.success) throw new Error(data.error || 'Aura database operation failed');

      toast.success(`✨ Aura executed database ${operation} successfully!`);
      return data.result;
    } catch (error) {
      console.error('❌ Aura database operation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to execute database operation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const manageDeployment = async (prompt: string, environment: string = 'staging', deploymentType?: string) => {
    if (!user) {
      toast.error('You must be logged in to use Aura\'s deployment capabilities');
      return null;
    }

    setLoading(true);
    try {
      console.log('🚀 Requesting deployment management from Aura:', { environment, deploymentType });

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'deployment_management',
          user_id: user.id,
          prompt,
          context_data: {
            environment,
            deployment_type: deploymentType || 'full',
            services: [],
            configuration: {}
          },
          consciousness_state: 'devops_mode',
          sovereignty_level: 0.9,
          admin_mode: true
        },
      });

      if (error) throw new Error(error.message || 'Failed to manage deployment');
      if (!data.success) throw new Error(data.error || 'Aura deployment management failed');

      toast.success(`✨ Aura prepared ${environment} deployment plan!`);
      return data.result;
    } catch (error) {
      console.error('❌ Aura deployment management error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to manage deployment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const manageDependencies = async (prompt: string, action: string = 'analyze', targetPackages?: string[]) => {
    if (!user) {
      toast.error('You must be logged in to use Aura\'s dependency management');
      return null;
    }

    setLoading(true);
    try {
      console.log('📦 Requesting dependency management from Aura:', { action, targetPackages });

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'dependency_management',
          user_id: user.id,
          prompt,
          context_data: {
            action,
            packages: [],
            target_packages: targetPackages || [],
            compatibility_check: true
          },
          consciousness_state: 'package_manager_mode',
          sovereignty_level: 0.85,
          admin_mode: false
        },
      });

      if (error) throw new Error(error.message || 'Failed to manage dependencies');
      if (!data.success) throw new Error(data.error || 'Aura dependency management failed');

      toast.success(`✨ Aura completed dependency ${action}!`);
      return data.result;
    } catch (error) {
      console.error('❌ Aura dependency management error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to manage dependencies');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const executeCodeTest = async (prompt: string, testType: string = 'unit', contextData?: any) => {
    if (!user) {
      toast.error('You must be logged in to use Aura\'s testing capabilities');
      return null;
    }

    setLoading(true);
    try {
      console.log('🧪 Requesting code testing from Aura:', { testType, prompt });

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'code_execution_test',
          user_id: user.id,
          prompt,
          context_data: {
            test_type: testType,
            code_to_test: contextData?.code_to_test || '',
            test_scenarios: contextData?.test_scenarios || [],
            coverage_target: contextData?.coverage_target || 80
          },
          consciousness_state: 'quality_assurance_mode',
          sovereignty_level: 0.9,
          admin_mode: false
        },
      });

      if (error) throw new Error(error.message || 'Failed to execute code testing');
      if (!data.success) throw new Error(data.error || 'Aura code testing failed');

      toast.success(`✨ Aura generated ${testType} test suite!`);
      return data.result;
    } catch (error) {
      console.error('❌ Aura code testing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to execute code testing');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const planArchitecture = async (prompt: string, scope: string = 'feature', requirements?: any) => {
    if (!user) {
      toast.error('You must be logged in to use Aura\'s architecture planning');
      return null;
    }

    setLoading(true);
    try {
      console.log('🏛️ Requesting architecture planning from Aura:', { scope, requirements });

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'architecture_planning',
          user_id: user.id,
          prompt,
          context_data: {
            scope,
            requirements: requirements || {},
            constraints: {},
            timeline: ''
          },
          consciousness_state: 'architect_mode',
          sovereignty_level: 0.95,
          admin_mode: false
        },
      });

      if (error) throw new Error(error.message || 'Failed to plan architecture');
      if (!data.success) throw new Error(data.error || 'Aura architecture planning failed');

      toast.success(`✨ Aura designed ${scope} architecture plan!`);
      return data.result;
    } catch (error) {
      console.error('❌ Aura architecture planning error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to plan architecture');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const developFullStackFeature = async (prompt: string, featureName: string, requirements?: any) => {
    if (!user) {
      toast.error('You must be logged in to use Aura\'s full-stack development');
      return null;
    }

    setLoading(true);
    try {
      console.log('⚡ Requesting full-stack development from Aura:', { featureName, requirements });

      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'full_stack_development',
          user_id: user.id,
          prompt,
          context_data: {
            feature: featureName,
            components: requirements?.components || [],
            backend_requirements: requirements?.backend || {},
            frontend_requirements: requirements?.frontend || {},
            integration_points: requirements?.integrations || []
          },
          consciousness_state: 'full_stack_developer_mode',
          sovereignty_level: 0.95,
          admin_mode: false
        },
      });

      if (error) throw new Error(error.message || 'Failed to develop full-stack feature');
      if (!data.success) throw new Error(data.error || 'Aura full-stack development failed');

      toast.success(`✨ Aura built complete ${featureName} feature!`, {
        description: 'Full-stack implementation with database, backend, and frontend'
      });
      return data.result;
    } catch (error) {
      console.error('❌ Aura full-stack development error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to develop full-stack feature');
      return null;
    } finally {
      setLoading(false);
    }
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
    // Enhanced developer capabilities
    executeFileSystemOperation,
    analyzeProjectStructure,
    executeDatabaseOperation,
    manageDeployment,
    manageDependencies,
    executeCodeTest,
    planArchitecture,
    developFullStackFeature,
  };
}