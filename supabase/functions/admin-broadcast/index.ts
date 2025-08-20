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

    const { message, admin_id } = await req.json();

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

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('user_id');

    if (usersError) {
      throw new Error(`Failed to get users: ${usersError.message}`);
    }

    // Insert notification for each user
    const notifications = users.map(profile => ({
      user_id: profile.user_id,
      type: 'admin_broadcast',
      title: 'Message from Sacred Shifter Admin',
      content: message,
      created_at: new Date().toISOString(),
      read: false
    }));

    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (insertError) {
      throw new Error(`Failed to send notifications: ${insertError.message}`);
    }

    console.log(`Admin broadcast sent to ${users.length} users`);

    return new Response(
      JSON.stringify({ 
        success: true,
        recipients: users.length,
        message: message,
        sent_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin Broadcast Error:', error);
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