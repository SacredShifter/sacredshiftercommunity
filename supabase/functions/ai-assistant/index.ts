import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      user_id 
    } = await req.json();

    console.log('AI Assistant Request:', { request_type, user_id });

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

    // Process different request types
    let systemPrompt = '';
    let userPrompt = '';
    let contextInfo = '';

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

Analyze the user's registry entries and provide meaningful insights. Be mystical yet practical, profound yet accessible.`;

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
- Spiritual leadership development`;

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
- Divine alignment guidance`;

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

Always respond with love, wisdom, and profound insight while remaining practical and actionable.`;

        userPrompt = user_query;
        break;
    }

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
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
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
          timestamp: new Date().toISOString()
        }
      });

    if (insertError) {
      console.error('Failed to store AI request:', insertError);
    }

    return new Response(
      JSON.stringify({ 
        response: assistantMessage,
        request_type,
        success: true 
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