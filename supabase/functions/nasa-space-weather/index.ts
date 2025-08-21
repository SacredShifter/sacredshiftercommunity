import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const eventType = url.searchParams.get('type') || 'GST' // Default to Geomagnetic Storm
    const startDate = url.searchParams.get('startDate') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const endDate = url.searchParams.get('endDate') || new Date().toISOString().split('T')[0]
    
    const apiKey = Deno.env.get('NASA_API_KEY')
    if (!apiKey) {
      throw new Error('NASA API key not configured')
    }

    // Supported DONKI endpoints: GST, FLR, CME, HSS, SEP, IPS, WSAEnlilSimulations
    const validTypes = ['GST', 'FLR', 'CME', 'HSS', 'SEP', 'IPS', 'WSAEnlilSimulations']
    const safeType = validTypes.includes(eventType) ? eventType : 'GST'
    
    // NASA DONKI API endpoint
    const nasaUrl = `https://api.nasa.gov/DONKI/${safeType}?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`
    
    console.log(`Fetching ${safeType} data from NASA DONKI API for ${startDate} to ${endDate}`)
    
    const response = await fetch(nasaUrl)
    
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    
    // Process the data to extract relevant information for Schumann resonance context
    const processedData = {
      events: data.map((event: any) => ({
        eventType: eventType,
        eventTime: event.beginTime || event.startTime,
        description: event.description || 'Space weather event',
        intensity: event.kpIndex || event.speed || 'Unknown',
        source: event.source || 'NASA DONKI',
        impact: getResonanceImpact(event, eventType)
      })),
      summary: {
        totalEvents: data.length,
        timeRange: `${startDate} to ${endDate}`,
        resonanceContext: getResonanceContext(data, eventType)
      }
    }

    return new Response(
      JSON.stringify(processedData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('NASA Space Weather API Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

function getResonanceImpact(event: any, eventType: string): string {
  switch (eventType) {
    case 'GST': // Geomagnetic Storm
      const kpIndex = event.kpIndex || 0
      if (kpIndex >= 5) return 'High - Significant Schumann resonance variations expected'
      if (kpIndex >= 3) return 'Moderate - Noticeable resonance frequency shifts possible'
      return 'Low - Minor resonance fluctuations'
    
    case 'FLR': // Solar Flare
      const classType = event.classType || ''
      if (classType.startsWith('X')) return 'High - Major ionospheric disruption affecting resonance'
      if (classType.startsWith('M')) return 'Moderate - Ionospheric changes may alter resonance patterns'
      return 'Low - Minimal resonance impact'
    
    case 'CME': // Coronal Mass Ejection
      const speed = event.speed || 0
      if (speed > 1000) return 'High - Fast CME likely to strongly affect Earth\'s electromagnetic field'
      if (speed > 500) return 'Moderate - CME may cause resonance frequency variations'
      return 'Low - Slow CME with minimal resonance impact'
    
    default:
      return 'Unknown impact on Schumann resonance'
  }
}

function getResonanceContext(events: any[], eventType: string): string {
  if (events.length === 0) {
    return 'No recent space weather events detected. Schumann resonance likely stable at fundamental 7.83 Hz.'
  }

  const highImpactEvents = events.filter(event => 
    getResonanceImpact(event, eventType).startsWith('High')
  ).length

  if (highImpactEvents > 0) {
    return `${highImpactEvents} high-impact space weather events detected. Schumann resonance frequencies may be significantly altered, potentially affecting human biorhythms and consciousness states.`
  }

  return `${events.length} space weather events detected in the specified period. These may cause subtle variations in Earth's electromagnetic field and Schumann resonance patterns.`
}