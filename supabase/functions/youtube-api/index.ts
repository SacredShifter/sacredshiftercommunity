import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { endpoint, params } = await req.json()
    const apiKey = Deno.env.get('YOUTUBE_API_KEY')
    
    if (!apiKey) {
      throw new Error('YouTube API key not configured')
    }

    const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`)
    Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => {
      url.searchParams.append(key, value as string)
    })

    const response = await fetch(url.toString())
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API error')
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})