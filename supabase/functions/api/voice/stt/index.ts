import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const STT_SERVICE_URL = 'http://stt:9000/inference';
const ALLOWED_ORIGINS = ['https://sacredshifter.app', 'http://localhost:3000'];

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
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sttResponse = await fetch(STT_SERVICE_URL, {
      method: 'POST',
      body: formData,
    });

    if (!sttResponse.ok) {
      const errorBody = await sttResponse.text();
      console.error('STT service error:', errorBody);
      return new Response(JSON.stringify({ error: 'STT service failed' }), {
        status: sttResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const transcript = await sttResponse.json();

    return new Response(JSON.stringify(transcript), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing STT request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
