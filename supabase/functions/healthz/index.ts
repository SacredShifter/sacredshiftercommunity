import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: 'ok' | 'error';
    environment: 'ok' | 'error';
    storage: 'ok' | 'error';
  };
  errors?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const errors: string[] = [];
  const checks = {
    database: 'error' as 'ok' | 'error',
    environment: 'error' as 'ok' | 'error',
    storage: 'error' as 'ok' | 'error',
  };

  try {
    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      errors.push('Missing required environment variables');
    } else {
      checks.environment = 'ok';
    }

    // Check database connectivity
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      try {
        // Simple query to check DB connection
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
          
        if (error) {
          errors.push(`Database error: ${error.message}`);
        } else {
          checks.database = 'ok';
        }
      } catch (dbError) {
        errors.push(`Database connection failed: ${dbError}`);
      }

      // Check storage connectivity
      try {
        const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
        
        if (storageError) {
          errors.push(`Storage error: ${storageError.message}`);
        } else {
          checks.storage = 'ok';
        }
      } catch (storageErr) {
        errors.push(`Storage connection failed: ${storageErr}`);
      }
    }

    const healthStatus: HealthCheck = {
      status: errors.length === 0 ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: Deno.env.get('RELEASE_VERSION') || 'development',
      checks,
      ...(errors.length > 0 && { errors }),
    };

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;

    return new Response(JSON.stringify(healthStatus, null, 2), {
      status: statusCode,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    const unhealthyStatus: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: Deno.env.get('RELEASE_VERSION') || 'development',
      checks,
      errors: [`Health check failed: ${error.message}`],
    };

    return new Response(JSON.stringify(unhealthyStatus, null, 2), {
      status: 503,
      headers: corsHeaders,
    });
  }
});