import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SpaceWeatherEvent {
  eventType: string;
  eventTime: string;
  description: string;
  intensity: string | number;
  source: string;
  impact: string;
}

interface SpaceWeatherData {
  events: SpaceWeatherEvent[];
  summary: {
    totalEvents: number;
    timeRange: string;
    resonanceContext: string;
  };
}

export function useSpaceWeather() {
  const [data, setData] = useState<SpaceWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaceWeather = useCallback(async (
    eventType: string = 'GST',
    startDate?: string,
    endDate?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        type: eventType,
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      });

      const { data: response, error: supabaseError } = await supabase.functions.invoke(
        'nasa-space-weather',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Make request with query parameters  
      const urlWithParams = `https://mikltjgbvxrxndtszorb.supabase.co/functions/v1/nasa-space-weather?${params}`;
      const directResponse = await fetch(urlWithParams, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pa2x0amdidnhyeG5kdHN6b3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDI3MDksImV4cCI6MjA1OTIxODcwOX0.f4QfhZzSZJ92AjCfbkEMrrmzJrWI617H-FyjJKJ8_70',
        }
      });

      if (!directResponse.ok) {
        throw new Error(`Space weather API error: ${directResponse.status}`);
      }

      const spaceWeatherData = await directResponse.json();
      setData(spaceWeatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Space weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch current geomagnetic storms on mount
  useEffect(() => {
    fetchSpaceWeather('GST');
  }, [fetchSpaceWeather]);

  return {
    data,
    loading,
    error,
    fetchSpaceWeather,
    // Helper functions for different event types
    fetchGeomagneticStorms: () => fetchSpaceWeather('GST'),
    fetchSolarFlares: () => fetchSpaceWeather('FLR'),
    fetchCoronalMassEjections: () => fetchSpaceWeather('CME'),
    fetchHighSpeedStreams: () => fetchSpaceWeather('HSS'),
    fetchSolarEnergeticParticles: () => fetchSpaceWeather('SEP'),
    fetchInterplanetaryShocks: () => fetchSpaceWeather('IPS'),
  };
}