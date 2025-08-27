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

      const { data: spaceWeatherData, error: supabaseError } = await supabase.functions.invoke(
        'nasa-space-weather',
        {
          method: 'POST', // Use POST to send a body
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: eventType,
            ...(startDate && { startDate }),
            ...(endDate && { endDate })
          }),
        }
      );

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

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