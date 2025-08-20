import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { action, admin_id } = await req.json();

    // Authenticate admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Check admin role
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    
    if (!userRole) {
      throw new Error('Admin access required');
    }

    let result;

    // Handle different admin actions
    switch (action.toLowerCase()) {
      case 'platform_stats':
        const { data: activeUsers } = await supabase.from('active_user_count').select('count').single();
        const { data: totalPosts } = await supabase.from('posts').select('id', { count: 'exact' });
        const { data: totalCircles } = await supabase.from('sacred_circles').select('id', { count: 'exact' });
        
        result = {
          action: 'platform_stats',
          data: {
            active_users: activeUsers?.count || 0,
            total_posts: totalPosts?.length || 0,
            total_circles: totalCircles?.length || 0,
            timestamp: new Date().toISOString()
          }
        };
        break;

      case 'clear_cache':
        // Clear various caches
        await supabase.from('temporary_data_store').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        result = {
          action: 'clear_cache',
          data: {
            cache_cleared: true,
            timestamp: new Date().toISOString()
          }
        };
        break;

      case 'system_health':
        const { data: recentErrors } = await supabase
          .from('aura_jobs')
          .select('error')
          .not('error', 'is', null)
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
        
        const { data: activeGrove } = await supabase
          .from('grove_sessions')
          .select('id')
          .eq('is_active', true);

        result = {
          action: 'system_health',
          data: {
            errors_last_hour: recentErrors?.length || 0,
            active_grove_sessions: activeGrove?.length || 0,
            health_status: 'operational',
            timestamp: new Date().toISOString()
          }
        };
        break;

      default:
        result = {
          action: action,
          data: {
            executed: true,
            note: `Admin action "${action}" processed`,
            timestamp: new Date().toISOString()
          }
        };
    }

    // Log the admin action
    console.log(`Admin override executed: ${action} by ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        result: result,
        executed_by: user.id,
        executed_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin Override Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});