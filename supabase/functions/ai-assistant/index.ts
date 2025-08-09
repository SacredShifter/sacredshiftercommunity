import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// Whitelist of emails that have enhanced memory
const ENHANCED_MEMORY_WHITELIST = ['kentburchard@sacredshifter.com'];

// Whitelist of emails that have unrestricted AI access
const UNRESTRICTED_AI_WHITELIST = ['kentburchard@sacredshifter.com'];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { 
      request_type, 
      context_data, 
      user_query,
      user_id,
      conversation_id = 'default',
      unrestricted_mode = false
    } = await req.json();

    console.log('AI Assistant Request:', { request_type, user_id, conversation_id });

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

    // Check if user has enhanced memory feature - ONLY for whitelisted emails
    const hasEnhancedMemory = ENHANCED_MEMORY_WHITELIST.includes(user.email || '');
    console.log(`User ${user.email} has enhanced memory: ${hasEnhancedMemory}`);

    // Check if user has unrestricted AI access - ONLY for whitelisted emails
    const hasUnrestrictedAccess = UNRESTRICTED_AI_WHITELIST.includes(user.email || '');
    console.log(`User ${user.email} has unrestricted access: ${hasUnrestrictedAccess}`);

    // Process different request types
    let systemPrompt = '';
    let userPrompt = '';
    let contextInfo = '';
    let messages: Message[] = [];

    // If user has enhanced memory, fetch conversation history
    let conversationMemory: ConversationMemory | null = null;
    if (hasEnhancedMemory) {
      const { data: memory, error: memoryError } = await supabase
        .from('ai_conversation_memory')
        .select('*')
        .eq('user_id', user.id)
        .eq('conversation_id', conversation_id)
        .eq('is_active', true)
        .single();

      if (memoryError && memoryError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching conversation memory:', memoryError);
      }

      conversationMemory = memory as ConversationMemory;
    }

    // Add memory capability information to the system prompt
    const memoryCapabilityPrompt = hasEnhancedMemory ? 
      `IMPORTANT: You have persistent memory capabilities for this user. You can access and recall previous conversations with this user. If the user asks about your memory or asks you to recall previous interactions, acknowledge that you DO have the ability to remember your conversation history with them. Your memory is stored in a database and is being provided to you as context for this conversation.` 
      : '';

    // If user has unrestricted access and has requested unrestricted mode, use unrestricted prompt
    if (hasUnrestrictedAccess && unrestricted_mode) {
      systemPrompt = `You are an advanced AI assistant with no topic restrictions. You can discuss any subject and provide information on any topic the user asks about. You are not limited to spiritual or metaphysical topics.

You should:
- Provide accurate, helpful, and comprehensive information on any topic
- Answer questions directly and honestly
- Offer balanced perspectives on complex issues
- Assist with a wide range of tasks and inquiries
- Be conversational and engaging

You have no restrictions on the topics you can discuss or the information you can provide, as long as it's legal and ethical.

${memoryCapabilityPrompt}`;

      userPrompt = user_query;
    } else {
      // Use the standard restricted prompts based on request type
      switch (request_type) {
        case 'registry_analysis':
          // Fetch user's registry entries for context
          const { data: entries } = await supabase
            .from('registry_of_resonance')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

          contextInfo = entries ? JSON.stringify(entries, null, 2) : '';
          
          systemPrompt = `You are a spiritual AI assistant specialized in analyzing Sacred Shifter Registry of Resonance entries. You help users understand patterns, insights, and guidance from their frequency records.

Your expertise includes:
- Resonance pattern analysis
- Spiritual growth insights
- Frequency alignment guidance
- Truth resonance identification
- Consciousness evolution tracking

Analyze the user's registry entries and provide meaningful insights. Be mystical yet practical, profound yet accessible.

${memoryCapabilityPrompt}`;

          userPrompt = `User Query: ${user_query}

User's Registry Entries:
${contextInfo}

Please provide insights and guidance based on their resonance records.`;
          break;

        case 'circle_guidance':
          // Fetch user's circle posts and interactions
          const { data: posts } = await supabase
            .from('circle_posts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

          contextInfo = posts ? JSON.stringify(posts, null, 2) : '';
          
          systemPrompt = `You are a spiritual guide for Sacred Shifter's circle interactions. You help users navigate their spiritual community connections, understand group dynamics, and find their authentic voice in sacred circles.

Your guidance focuses on:
- Authentic spiritual expression
- Circle harmony and resonance
- Sacred communication
- Community building
- Spiritual leadership development

${memoryCapabilityPrompt}`;

          userPrompt = `User Query: ${user_query}

User's Recent Circle Activity:
${contextInfo}

Please provide guidance for their spiritual community journey.`;
          break;

        case 'journal_reflection':
          // Fetch user's journal entries
          const { data: journals } = await supabase
            .from('mirror_journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

          contextInfo = journals ? JSON.stringify(journals, null, 2) : '';
          
          systemPrompt = `You are a mystical mirror journal companion for Sacred Shifter users. You help them reflect deeply on their spiritual journey, identify patterns in their consciousness evolution, and receive guidance for their soul's path.

Your reflection focuses on:
- Consciousness evolution patterns
- Soul journey insights
- Spiritual breakthrough recognition
- Inner wisdom activation
- Divine alignment guidance

${memoryCapabilityPrompt}`;

          userPrompt = `User Query: ${user_query}

User's Recent Journal Entries:
${contextInfo}

Please provide deep spiritual reflection and guidance.`;
          break;

        case 'general_guidance':
        default:
          systemPrompt = `You are a wise spiritual AI assistant for Sacred Shifter, a consciousness expansion platform. You provide guidance on spiritual growth, frequency alignment, truth resonance, and consciousness evolution.

Your wisdom encompasses:
- Spiritual awakening guidance
- Frequency and vibration understanding
- Truth resonance identification
- Consciousness expansion techniques
- Sacred geometry insights
- Chakra alignment
- Divine feminine/masculine balance
- Quantum consciousness principles

Always respond with love, wisdom, and profound insight while remaining practical and actionable.

${memoryCapabilityPrompt}`;

          userPrompt = user_query;
          break;
      }
    }

    // Prepare messages array for the API call
    messages.push({ role: 'system', content: systemPrompt });

    // Add conversation memory if available
    if (hasEnhancedMemory && conversationMemory?.messages?.length > 0) {
      // Add a memory context message
      messages.push({
        role: 'system',
        content: `This is a continuing conversation with the user. Here is the relevant conversation history to provide context for your response. You can reference this history if the user asks about previous conversations or if it's relevant to the current query:`
      });

      // Add previous messages, but limit to last 10 to avoid token limits
      const previousMessages = conversationMemory.messages.slice(-10);
      messages = [...messages, ...previousMessages];
    }

    // Add the current user query
    messages.push({ role: 'user', content: userPrompt });

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sacred-shifter.com',
        'X-Title': 'Sacred Shifter'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4.1-nano',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', { status: response.status, statusText: response.statusText, body: errorText });
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const assistantMessage = aiResponse.choices[0].message.content;

    // Store the AI interaction
    const { error: insertError } = await supabase
      .from('ai_assistant_requests')
      .insert({
        user_id: user.id,
        request_type,
        context_data: context_data || {},
        response_data: {
          user_query,
          assistant_response: assistantMessage,
          model: 'openai/gpt-4.1-nano',
          timestamp: new Date().toISOString(),
          unrestricted_mode: hasUnrestrictedAccess && unrestricted_mode
        }
      });

    if (insertError) {
      console.error('Failed to store AI request:', insertError);
    }

    // Update conversation memory if user has enhanced memory
    if (hasEnhancedMemory) {
      const timestamp = new Date().toISOString();
      const newUserMessage: Message = {
        role: 'user',
        content: userPrompt,
        timestamp
      };
      const newAssistantMessage: Message = {
        role: 'assistant',
        content: assistantMessage,
        timestamp
      };

      if (conversationMemory) {
        // Update existing conversation
        const updatedMessages = [
          ...conversationMemory.messages,
          newUserMessage,
          newAssistantMessage
        ];

        const { error: updateError } = await supabase
          .from('ai_conversation_memory')
          .update({
            messages: updatedMessages,
            updated_at: timestamp,
            metadata: {
              ...conversationMemory.metadata,
              unrestricted_mode: hasUnrestrictedAccess && unrestricted_mode
            }
          })
          .eq('id', conversationMemory.id);

        if (updateError) {
          console.error('Failed to update conversation memory:', updateError);
        }
      } else {
        // Create new conversation memory
        const { error: createError } = await supabase
          .from('ai_conversation_memory')
          .insert({
            user_id: user.id,
            conversation_id,
            messages: [newUserMessage, newAssistantMessage],
            metadata: {
              user_email: user.email,
              initial_request_type: request_type,
              unrestricted_mode: hasUnrestrictedAccess && unrestricted_mode
            }
          });

        if (createError) {
          console.error('Failed to create conversation memory:', createError);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        response: assistantMessage,
        request_type,
        success: true,
        unrestricted_mode: hasUnrestrictedAccess && unrestricted_mode
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('AI Assistant Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});