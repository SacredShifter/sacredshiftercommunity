import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { vader } from 'https://deno.land/x/vader/mod.ts';

const TTS_SERVICE_URL = 'http://tts:5000/api/tts';
const ALLOWED_ORIGINS = ['https://sacredshifter.app', 'http://localhost:3000'];

const getProsody = (text: string) => {
  const sentiment = vader(text);
  const compound = sentiment.compound;

  if (compound > 0.05) { // Positive
    return { rate: '1.05', pitch: '1.1' };
  } else if (compound < -0.05) { // Negative
    return { rate: '0.95', pitch: '0.9' };
  }
  return null; // Neutral
};

serve(async (req) => {
  // TODO: Implement rate limiting (e.g., 60 requests/min/IP)

  const origin = req.headers.get('Origin') || '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voice } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'No text provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let url = TTS_SERVICE_URL;
    if (voice) {
      // Piper expects the voice as a query parameter
      url = `${TTS_SERVICE_URL}?voice=${encodeURIComponent(voice)}`;
    }

    const prosody = getProsody(text);
    let body = text;
    let contentType = 'text/plain';

    if (prosody) {
      body = `<speak><prosody rate="${prosody.rate}" pitch="${prosody.pitch}">${text}</prosody></speak>`;
      contentType = 'application/ssml+xml';
    }

    const ttsResponse = await fetch(url, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': contentType,
      },
    });

    if (!ttsResponse.ok) {
      const errorBody = await ttsResponse.text();
      console.error('TTS service error:', errorBody);
      return new Response(JSON.stringify({ error: 'TTS service failed' }), {
        status: ttsResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Stream the audio response
    return new Response(ttsResponse.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error processing TTS request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
