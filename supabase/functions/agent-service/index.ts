import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentActionRequest {
  action_type: string;
  parameters: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  context?: Record<string, any>;
  metadata?: Record<string, any>;
  conversation_id?: string;
}

interface AgentActionResponse {
  success: boolean;
  action_id?: string;
  status?: string;
  message: string;
  requires_approval?: boolean;
  error?: string;
}

interface AgentApprovalRequest {
  action_id: string;
  approve: boolean;
  notes?: string;
}

interface AgentCapabilityRequest {
  capability_name: string;
  description: string;
  requires_approval: boolean;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  allowed_parameters?: string[];
  validation_rules?: Record<string, any>;
  is_enabled?: boolean;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ConversationMemory {
  id: string;
  user_id: string;
  conversation_id: string;
  messages: Message[];
  summary?: string;
  topic?: string;
  metadata: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Whitelist of emails that can approve agent actions
const AGENT_APPROVAL_WHITELIST = ['kentburchard@sacredshifter.com'];

// Whitelist of emails that have enhanced memory
const ENHANCED_MEMORY_WHITELIST = ['kentburchard@sacredshifter.com'];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Authenticate user
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

    // Check if user is in the approval whitelist
    const canApprove = AGENT_APPROVAL_WHITELIST.includes(user.email || '');
    
    // Check if user has enhanced memory
    const hasEnhancedMemory = ENHANCED_MEMORY_WHITELIST.includes(user.email || '');
    
    // Parse URL to get the endpoint
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();

    // Handle different endpoints
    switch (endpoint) {
      case 'request-action':
        return await handleActionRequest(req, supabase, user, hasEnhancedMemory);
      
      case 'approve-action':
        if (!canApprove) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Unauthorized: Only approved users can approve actions' 
            }),
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        return await handleApprovalRequest(req, supabase, user, hasEnhancedMemory);
      
      case 'get-pending-actions':
        return await handleGetPendingActions(req, supabase, user, canApprove);
      
      case 'get-action-history':
        return await handleGetActionHistory(req, supabase, user);
      
      case 'manage-capability':
        if (!canApprove) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Unauthorized: Only approved users can manage capabilities' 
            }),
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        return await handleManageCapability(req, supabase, user);
      
      case 'get-user-context':
        return await handleGetUserContext(req, supabase, user, hasEnhancedMemory);
      
      case 'get-conversation-memory':
        return await handleGetConversationMemory(req, supabase, user, hasEnhancedMemory);
      
      case 'update-conversation-memory':
        return await handleUpdateConversationMemory(req, supabase, user, hasEnhancedMemory);
      
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Unknown endpoint' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('Agent Service Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleActionRequest(req: Request, supabase: any, user: any, hasEnhancedMemory: boolean): Promise<Response> {
  const { 
    action_type, 
    parameters, 
    priority = 'normal', 
    context = {}, 
    metadata = {},
    conversation_id = 'default'
  } = await req.json() as AgentActionRequest;
  
  // Validate the action type
  const { data: capability, error: capabilityError } = await supabase
    .from('agent_capabilities')
    .select('*')
    .eq('capability_name', action_type)
    .eq('is_enabled', true)
    .single();
  
  if (capabilityError || !capability) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Invalid or disabled action type: ${action_type}` 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Validate parameters against allowed parameters and validation rules
  const validationError = validateParameters(parameters, capability.allowed_parameters, capability.validation_rules);
  if (validationError) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: validationError 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Fetch user context from conversation memory if available
  let userContext = {};
  let conversationMemory = null;
  if (hasEnhancedMemory && conversation_id) {
    const { data: memory, error: memoryError } = await supabase
      .from('ai_conversation_memory')
      .select('*')
      .eq('user_id', user.id)
      .eq('conversation_id', conversation_id)
      .eq('is_active', true)
      .single();
    
    if (!memoryError && memory) {
      conversationMemory = memory;
      // Extract user context from conversation memory
      userContext = {
        conversation_memory: memory,
        conversation_summary: memory.summary || 'No summary available',
        conversation_topic: memory.topic || 'General conversation',
        conversation_metadata: memory.metadata || {},
        recent_messages: memory.messages.slice(-5) // Include the 5 most recent messages for context
      };
    }
  }
  
  // Insert the action request
  const { data: action, error: actionError } = await supabase
    .from('agent_actions')
    .insert({
      action_type,
      parameters,
      requested_by: user.id,
      priority,
      context: {
        ...context,
        ...userContext,
        user_email: user.email,
        user_id: user.id,
        conversation_id,
        timestamp: new Date().toISOString()
      },
      metadata: {
        ...metadata,
        user_agent: req.headers.get('User-Agent'),
        ip_address: req.headers.get('X-Forwarded-For') || req.headers.get('X-Real-IP'),
        has_conversation_memory: !!conversationMemory
      }
    })
    .select()
    .single();
  
  if (actionError) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to create action request: ${actionError.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Log the action request
  await supabase.rpc('log_agent_event', {
    event_type: 'action_requested',
    action_id: action.id,
    details: {
      action_type,
      parameters,
      requested_by: user.id,
      user_email: user.email,
      conversation_id,
      has_conversation_memory: !!conversationMemory
    }
  });
  
  // If the action doesn't require approval, execute it immediately
  if (!capability.requires_approval) {
    // TODO: Implement action execution logic
    // For now, just update the status to 'executed'
    await supabase
      .from('agent_actions')
      .update({
        status: 'executed',
        result: { message: 'Action executed automatically (no approval required)' }
      })
      .eq('id', action.id);
    
    // If user has enhanced memory, update the conversation memory
    if (hasEnhancedMemory && conversation_id) {
      await updateConversationMemory(
        supabase,
        user.id,
        conversation_id,
        `User requested agent to perform action: ${action_type}`,
        `Action executed automatically: ${action_type}`,
        {
          action_id: action.id,
          action_type,
          parameters,
          status: 'executed',
          timestamp: new Date().toISOString()
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        action_id: action.id,
        status: 'executed',
        message: 'Action executed successfully',
        requires_approval: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // If user has enhanced memory, update the conversation memory
  if (hasEnhancedMemory && conversation_id) {
    await updateConversationMemory(
      supabase,
      user.id,
      conversation_id,
      `User requested agent to perform action: ${action_type}`,
      `I've submitted a request to ${action_type} for you. This action requires approval from an administrator before it can be executed. You'll be notified once it's approved.`,
      {
        action_id: action.id,
        action_type,
        parameters,
        status: 'pending',
        timestamp: new Date().toISOString()
      }
    );
  }
  
  // If we get here, the action requires approval
  return new Response(
    JSON.stringify({ 
      success: true, 
      action_id: action.id,
      status: 'pending',
      message: 'Action request submitted and pending approval',
      requires_approval: true
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleApprovalRequest(req: Request, supabase: any, user: any, hasEnhancedMemory: boolean): Promise<Response> {
  const { action_id, approve, notes = '' } = await req.json() as AgentApprovalRequest;
  
  // Check if the action exists and is pending
  const { data: action, error: actionError } = await supabase
    .from('agent_actions')
    .select('*')
    .eq('id', action_id)
    .eq('status', 'pending')
    .single();
  
  if (actionError || !action) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Action not found or not in pending state: ${action_id}` 
      }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Update the action status based on approval decision
  const newStatus = approve ? 'approved' : 'rejected';
  
  // Update the action status
  const { error: updateError } = await supabase
    .from('agent_actions')
    .update({
      status: newStatus
    })
    .eq('id', action_id);
  
  if (updateError) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to update action status: ${updateError.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Record the approval/rejection
  const { error: approvalError } = await supabase
    .from('agent_approvals')
    .insert({
      action_id,
      approved_by: user.id,
      approval_notes: notes,
      ip_address: req.headers.get('X-Forwarded-For') || req.headers.get('X-Real-IP'),
      user_agent: req.headers.get('User-Agent')
    });
  
  if (approvalError) {
    console.error('Failed to record approval:', approvalError);
    // Continue anyway, as the action status was updated successfully
  }
  
  // Log the approval/rejection
  await supabase.rpc('log_agent_event', {
    event_type: approve ? 'action_approved' : 'action_rejected',
    action_id,
    details: {
      approved_by: user.id,
      user_email: user.email,
      notes
    }
  });
  
  // If approved, execute the action
  if (approve) {
    // TODO: Implement action execution logic
    // For now, just update the status to 'executed'
    await supabase
      .from('agent_actions')
      .update({
        status: 'executed',
        result: { message: 'Action executed after approval' }
      })
      .eq('id', action_id);
    
    // If user has enhanced memory and we have a conversation_id, update the conversation memory
    if (hasEnhancedMemory && action.context && action.context.conversation_id) {
      const requestedBy = action.requested_by;
      const conversationId = action.context.conversation_id;
      
      // Get the user who requested the action
      const { data: requestingUser } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', requestedBy)
        .single();
      
      if (requestingUser) {
        await updateConversationMemory(
          supabase,
          requestedBy,
          conversationId,
          `User requested agent to perform action: ${action.action_type}`,
          `Your request to ${action.action_type} has been approved and executed.`,
          {
            action_id,
            action_type: action.action_type,
            parameters: action.parameters,
            status: 'executed',
            approved_by: user.id,
            approved_at: new Date().toISOString(),
            notes
          }
        );
      }
    }
  } else {
    // If rejected and user has enhanced memory, update the conversation memory
    if (hasEnhancedMemory && action.context && action.context.conversation_id) {
      const requestedBy = action.requested_by;
      const conversationId = action.context.conversation_id;
      
      await updateConversationMemory(
        supabase,
        requestedBy,
        conversationId,
        `User requested agent to perform action: ${action.action_type}`,
        `Your request to ${action.action_type} has been rejected${notes ? ` with the following notes: ${notes}` : ''}.`,
        {
          action_id,
          action_type: action.action_type,
          parameters: action.parameters,
          status: 'rejected',
          rejected_by: user.id,
          rejected_at: new Date().toISOString(),
          notes
        }
      );
    }
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      action_id,
      status: approve ? 'executed' : 'rejected',
      message: approve ? 'Action approved and executed' : 'Action rejected'
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleGetPendingActions(req: Request, supabase: any, user: any, canApprove: boolean): Promise<Response> {
  // If user can't approve, they can only see their own pending actions
  let query = supabase
    .from('agent_actions')
    .select(`
      *,
      agent_capabilities(*)
    `)
    .eq('status', 'pending');
  
  if (!canApprove) {
    query = query.eq('requested_by', user.id);
  }
  
  const { data: actions, error } = await query
    .order('requested_at', { ascending: false });
  
  if (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to fetch pending actions: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      actions,
      can_approve: canApprove
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleGetActionHistory(req: Request, supabase: any, user: any): Promise<Response> {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const status = url.searchParams.get('status') || null;
  
  let query = supabase
    .from('agent_actions')
    .select(`
      *,
      agent_capabilities(*),
      agent_approvals(*)
    `);
  
  // Add filters
  if (status) {
    query = query.eq('status', status);
  }
  
  // Add pagination
  query = query
    .order('requested_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  const { data: actions, error, count } = await query;
  
  if (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to fetch action history: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      actions,
      pagination: {
        limit,
        offset,
        total: count
      }
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleGetUserContext(req: Request, supabase: any, user: any, hasEnhancedMemory: boolean): Promise<Response> {
  const { conversation_id = 'default' } = await req.json();
  
  // Initialize context object
  const context: Record<string, any> = {
    user_id: user.id,
    user_email: user.email
  };
  
  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (!profileError && profile) {
    context.profile = profile;
  }
  
  // If user has enhanced memory, get conversation memory
  if (hasEnhancedMemory && conversation_id) {
    const { data: memory, error: memoryError } = await supabase
      .from('ai_conversation_memory')
      .select('*')
      .eq('user_id', user.id)
      .eq('conversation_id', conversation_id)
      .eq('is_active', true)
      .single();
    
    if (!memoryError && memory) {
      context.conversation_memory = memory;
      
      // Add a summary of recent agent actions from this conversation
      const { data: recentActions } = await supabase
        .from('agent_actions')
        .select('*')
        .eq('requested_by', user.id)
        .eq('context->conversation_id', conversation_id)
        .order('requested_at', { ascending: false })
        .limit(5);
      
      if (recentActions && recentActions.length > 0) {
        context.recent_agent_actions = recentActions;
      }
    }
  }
  
  // Get user's recent activity
  const { data: recentActivity, error: activityError } = await supabase
    .from('active_user_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('last_active_at', { ascending: false })
    .limit(5);
  
  if (!activityError && recentActivity) {
    context.recent_activity = recentActivity;
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      context,
      has_enhanced_memory: hasEnhancedMemory
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleGetConversationMemory(req: Request, supabase: any, user: any, hasEnhancedMemory: boolean): Promise<Response> {
  if (!hasEnhancedMemory) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Enhanced memory feature is not enabled for this user' 
      }),
      { 
        status: 403, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  const { conversation_id = 'default' } = await req.json();
  
  const { data: memory, error: memoryError } = await supabase
    .from('ai_conversation_memory')
    .select('*')
    .eq('user_id', user.id)
    .eq('conversation_id', conversation_id)
    .eq('is_active', true)
    .single();
  
  if (memoryError && memoryError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to fetch conversation memory: ${memoryError.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  if (!memory) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'No active conversation memory found for this conversation ID' 
      }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      memory
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleUpdateConversationMemory(req: Request, supabase: any, user: any, hasEnhancedMemory: boolean): Promise<Response> {
  if (!hasEnhancedMemory) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Enhanced memory feature is not enabled for this user' 
      }),
      { 
        status: 403, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  const { 
    conversation_id = 'default', 
    user_message, 
    assistant_message,
    metadata = {}
  } = await req.json();
  
  if (!user_message || !assistant_message) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Both user_message and assistant_message are required' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  try {
    const result = await updateConversationMemory(
      supabase,
      user.id,
      conversation_id,
      user_message,
      assistant_message,
      metadata
    );
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        memory: result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to update conversation memory' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleManageCapability(req: Request, supabase: any, user: any): Promise<Response> {
  const method = req.method;
  
  if (method === 'GET') {
    // Get all capabilities
    const { data: capabilities, error } = await supabase
      .from('agent_capabilities')
      .select('*')
      .order('capability_name');
    
    if (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to fetch capabilities: ${error.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        capabilities
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } else if (method === 'POST') {
    // Create a new capability
    const capabilityData = await req.json() as AgentCapabilityRequest;
    
    const { data: capability, error } = await supabase
      .from('agent_capabilities')
      .insert({
        capability_name: capabilityData.capability_name,
        description: capabilityData.description,
        requires_approval: capabilityData.requires_approval,
        risk_level: capabilityData.risk_level,
        allowed_parameters: capabilityData.allowed_parameters || [],
        validation_rules: capabilityData.validation_rules || {},
        is_enabled: capabilityData.is_enabled !== undefined ? capabilityData.is_enabled : false
      })
      .select()
      .single();
    
    if (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to create capability: ${error.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Log the capability creation
    await supabase.rpc('log_agent_event', {
      event_type: 'capability_created',
      action_id: null,
      details: {
        capability_name: capabilityData.capability_name,
        created_by: user.id,
        user_email: user.email
      }
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        capability
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } else if (method === 'PUT') {
    // Update an existing capability
    const capabilityData = await req.json() as AgentCapabilityRequest;
    
    const { data: capability, error } = await supabase
      .from('agent_capabilities')
      .update({
        description: capabilityData.description,
        requires_approval: capabilityData.requires_approval,
        risk_level: capabilityData.risk_level,
        allowed_parameters: capabilityData.allowed_parameters || [],
        validation_rules: capabilityData.validation_rules || {},
        is_enabled: capabilityData.is_enabled !== undefined ? capabilityData.is_enabled : false
      })
      .eq('capability_name', capabilityData.capability_name)
      .select()
      .single();
    
    if (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to update capability: ${error.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Log the capability update
    await supabase.rpc('log_agent_event', {
      event_type: 'capability_updated',
      action_id: null,
      details: {
        capability_name: capabilityData.capability_name,
        updated_by: user.id,
        user_email: user.email,
        changes: capabilityData
      }
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        capability
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } else if (method === 'DELETE') {
    // Delete a capability
    const { capability_name } = await req.json();
    
    // Check if there are any actions using this capability
    const { data: actions, error: checkError } = await supabase
      .from('agent_actions')
      .select('id')
      .eq('action_type', capability_name)
      .limit(1);
    
    if (checkError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to check for existing actions: ${checkError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (actions && actions.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Cannot delete capability that has associated actions. Disable it instead.` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { error } = await supabase
      .from('agent_capabilities')
      .delete()
      .eq('capability_name', capability_name);
    
    if (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to delete capability: ${error.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Log the capability deletion
    await supabase.rpc('log_agent_event', {
      event_type: 'capability_deleted',
      action_id: null,
      details: {
        capability_name,
        deleted_by: user.id,
        user_email: user.email
      }
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Capability '${capability_name}' deleted successfully`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: `Unsupported method: ${method}` 
    }),
    { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

function validateParameters(
  parameters: Record<string, any>,
  allowedParameters: string[],
  validationRules: Record<string, any>
): string | null {
  // Check for required parameters
  for (const param in validationRules) {
    const rules = validationRules[param];
    if (rules.required && (parameters[param] === undefined || parameters[param] === null)) {
      return `Missing required parameter: ${param}`;
    }
  }
  
  // Check parameter types and constraints
  for (const param in parameters) {
    // Check if parameter is allowed
    if (!allowedParameters.includes(param)) {
      return `Parameter not allowed: ${param}`;
    }
    
    // Check validation rules if they exist for this parameter
    if (validationRules[param]) {
      const rules = validationRules[param];
      const value = parameters[param];
      
      // Check max length for strings
      if (rules.max_length && typeof value === 'string' && value.length > rules.max_length) {
        return `Parameter ${param} exceeds maximum length of ${rules.max_length}`;
      }
      
      // Check min/max for numbers
      if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
        return `Parameter ${param} is less than minimum value of ${rules.min}`;
      }
      
      if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
        return `Parameter ${param} exceeds maximum value of ${rules.max}`;
      }
      
      // Check pattern for strings
      if (rules.pattern && typeof value === 'string' && !new RegExp(rules.pattern).test(value)) {
        return `Parameter ${param} does not match required pattern`;
      }
      
      // Check enum values
      if (rules.enum && !rules.enum.includes(value)) {
        return `Parameter ${param} must be one of: ${rules.enum.join(', ')}`;
      }
    }
  }
  
  return null;
}

// Enhanced helper function to update conversation memory
async function updateConversationMemory(
  supabase: any,
  userId: string,
  conversationId: string,
  userMessage: string,
  assistantMessage: string,
  metadata: Record<string, any> = {}
): Promise<ConversationMemory | null> {
  try {
    const timestamp = new Date().toISOString();
    
    // Check if conversation memory exists
    const { data: memory, error: memoryError } = await supabase
      .from('ai_conversation_memory')
      .select('*')
      .eq('user_id', userId)
      .eq('conversation_id', conversationId)
      .eq('is_active', true)
      .single();
    
    if (memoryError && memoryError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching conversation memory:', memoryError);
      return null;
    }
    
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp
    };
    
    const newAssistantMessage: Message = {
      role: 'assistant',
      content: assistantMessage,
      timestamp
    };
    
    if (memory) {
      // Update existing conversation
      const updatedMessages = [
        ...memory.messages,
        newUserMessage,
        newAssistantMessage
      ];
      
      // Generate a simple summary if we have enough messages
      let summary = memory.summary;
      let topic = memory.topic;
      
      // If we have more than 10 messages, try to generate a summary
      if (updatedMessages.length >= 10 && !summary) {
        // This is a simple summary - in a real implementation, you might use an LLM to generate this
        summary = `Conversation with ${updatedMessages.length} messages about agent actions`;
        
        // Try to determine the topic from the messages
        const topics = new Set<string>();
        updatedMessages.forEach(msg => {
          if (msg.content.toLowerCase().includes('agent')) topics.add('agent');
          if (msg.content.toLowerCase().includes('action')) topics.add('action');
          if (msg.content.toLowerCase().includes('approval')) topics.add('approval');
        });
        
        if (topics.size > 0) {
          topic = Array.from(topics).join(', ');
        }
      }
      
      const { data: updatedMemory, error: updateError } = await supabase
        .from('ai_conversation_memory')
        .update({
          messages: updatedMessages,
          summary,
          topic,
          metadata: {
            ...memory.metadata,
            ...metadata,
            last_updated: timestamp,
            message_count: updatedMessages.length
          },
          updated_at: timestamp
        })
        .eq('id', memory.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Failed to update conversation memory:', updateError);
        return null;
      }
      
      return updatedMemory;
    } else {
      // Create new conversation memory
      const { data: newMemory, error: createError } = await supabase
        .from('ai_conversation_memory')
        .insert({
          user_id: userId,
          conversation_id: conversationId,
          messages: [newUserMessage, newAssistantMessage],
          metadata: {
            ...metadata,
            initial_timestamp: timestamp,
            message_count: 2,
            agent_mode: true
          },
          is_active: true
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Failed to create conversation memory:', createError);
        return null;
      }
      
      return newMemory;
    }
  } catch (error) {
    console.error('Error updating conversation memory:', error);
    return null;
  }
}