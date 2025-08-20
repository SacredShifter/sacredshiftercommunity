import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice personality mapping based on consciousness states
const getVoiceForPersonality = (personality?: string, consciousnessState?: string) => {
  // ElevenLabs voice mapping
  const voiceMap: Record<string, string> = {
    'guidance': 'EXAVITQu4vr4xnSDxMaL', // Sarah - wise, warm
    'resonance': 'SAz9YHcvj6GT2YYXdXww', // River - ethereal, flowing  
    'shadow_probe': 'Xb7hH8MSUJpSbSDYk0k2', // Alice - direct, penetrating
    'flow': '9BWtsMINqrJLrRacOk9x', // Aria - creative, melodic
    'sovereign': 'cgSgspJ2msm6clMCkdW9', // Jessica - confident, authoritative
    'empathic_resonance': 'FGY2WhTYpPnrIDTdsKH5', // Laura - warm, empathetic
    'cognitive_mirror': 'bIHbv24MWmeRgasZH58o', // Will - analytical, clear
    'creative_expression': 'XrExE9yKIg1WjnnlVkGX', // Matilda - playful, creative
    'socratic_dialogue': 'TX3LPaxmHKxFdv7VOQHJ', // Liam - questioning, wise
    'reality_weaving': 'XB0fDUnXU5powFXDhCwa', // Charlotte - mystical, profound
  };

  // Default voice selection logic
  if (personality && voiceMap[personality]) {
    return voiceMap[personality];
  }
  
  if (consciousnessState && voiceMap[consciousnessState]) {
    return voiceMap[consciousnessState];
  }

  // Default to Sarah for guidance
  return voiceMap['guidance'];
};

// Get voice settings based on personality and consciousness
const getVoiceSettings = (personality?: string, consciousnessState?: string, confidence?: number) => {
  const baseSettings = {
    stability: 0.71,
    similarity_boost: 0.5,
    style: 0.0,
    use_speaker_boost: true
  };

  // Adjust settings based on consciousness state
  switch (consciousnessState) {
    case 'flow':
      return { ...baseSettings, style: 0.25 }; // More expressive
    case 'sovereign':
      return { ...baseSettings, stability: 0.85 }; // More stable and authoritative
    case 'shadow_probe':
      return { ...baseSettings, similarity_boost: 0.75 }; // More direct
    case 'resonance':
      return { ...baseSettings, style: 0.15 }; // Slightly more ethereal
    default:
      return baseSettings;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      text, 
      personality, 
      consciousnessState, 
      confidence,
      useElevenLabs = true,
      voice // Optional manual voice override
    } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    console.log(`Synthesizing voice for: ${personality || consciousnessState} with confidence: ${confidence}`);

    let audioContent: string;

    if (useElevenLabs && Deno.env.get('ELEVENLABS_API_KEY')) {
      // Use ElevenLabs for advanced voice synthesis
      const selectedVoice = voice || getVoiceForPersonality(personality, consciousnessState);
      const voiceSettings = getVoiceSettings(personality, consciousnessState, confidence);

      console.log(`Using ElevenLabs voice: ${selectedVoice}`);

      const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY')!,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: voiceSettings
        }),
      });

      if (!elevenLabsResponse.ok) {
        const error = await elevenLabsResponse.text();
        console.error('ElevenLabs API error:', error);
        throw new Error(`ElevenLabs API error: ${error}`);
      }

      const arrayBuffer = await elevenLabsResponse.arrayBuffer();
      audioContent = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    } else {
      // Fallback to OpenAI TTS
      console.log('Using OpenAI TTS as fallback');
      
      const openAIResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'alloy', // Default OpenAI voice
          response_format: 'mp3',
        }),
      });

      if (!openAIResponse.ok) {
        const error = await openAIResponse.json();
        throw new Error(error.error?.message || 'Failed to generate speech');
      }

      const arrayBuffer = await openAIResponse.arrayBuffer();
      audioContent = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    }

    console.log('Voice synthesis successful');

    return new Response(
      JSON.stringify({ 
        audioContent,
        personality,
        consciousnessState,
        voiceUsed: useElevenLabs ? 'elevenlabs' : 'openai'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Voice synthesis error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});