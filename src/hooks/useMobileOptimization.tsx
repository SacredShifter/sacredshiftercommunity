import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export interface MobileOptimizationState {
  isNative: boolean;
  platform: 'ios' | 'android' | 'web';
  isOnline: boolean;
  batteryLevel: number;
  connectionType: 'wifi' | 'cellular' | 'none' | 'unknown';
  shouldReduceAnimations: boolean;
  shouldOptimizeForBattery: boolean;
}

export function useMobileOptimization() {
  const [optimizationState, setOptimizationState] = useState<MobileOptimizationState>({
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform() as 'ios' | 'android' | 'web',
    isOnline: navigator.onLine,
    batteryLevel: 1,
    connectionType: 'unknown',
    shouldReduceAnimations: false,
    shouldOptimizeForBattery: false,
  });

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => setOptimizationState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setOptimizationState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor battery level on mobile
    const updateBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          const batteryLevel = battery.level;
          const shouldOptimizeForBattery = batteryLevel < 0.2;
          const shouldReduceAnimations = batteryLevel < 0.15 || !optimizationState.isOnline;

          setOptimizationState(prev => ({
            ...prev,
            batteryLevel,
            shouldOptimizeForBattery,
            shouldReduceAnimations
          }));

          // Listen for battery changes
          battery.addEventListener('levelchange', () => {
            const newLevel = battery.level;
            setOptimizationState(prev => ({
              ...prev,
              batteryLevel: newLevel,
              shouldOptimizeForBattery: newLevel < 0.2,
              shouldReduceAnimations: newLevel < 0.15 || !prev.isOnline
            }));
          });
        } catch (error) {
          console.log('Battery API not supported');
        }
      }
    };

    // Detect connection type
    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        let connectionType: 'wifi' | 'cellular' | 'none' | 'unknown' = 'unknown';
        
        if (connection.type === 'wifi') connectionType = 'wifi';
        else if (connection.type === 'cellular') connectionType = 'cellular';
        else if (connection.type === 'none') connectionType = 'none';

        setOptimizationState(prev => ({
          ...prev,
          connectionType,
          shouldReduceAnimations: prev.shouldReduceAnimations || connectionType === 'none'
        }));
      }
    };

    if (optimizationState.isNative) {
      updateBatteryInfo();
      updateConnectionInfo();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [optimizationState.isNative, optimizationState.isOnline]);

  // Mobile-optimized animation settings
  const getAnimationSettings = () => {
    if (optimizationState.shouldReduceAnimations) {
      return {
        duration: 0.2,
        ease: 'linear' as const,
        reduce: true
      };
    }

    return {
      duration: optimizationState.isNative ? 0.3 : 0.5,
      ease: 'easeOut' as const,
      reduce: false
    };
  };

  // Mobile-optimized query settings
  const getQuerySettings = () => {
    return {
      staleTime: optimizationState.connectionType === 'wifi' ? 10000 : 30000,
      cacheTime: optimizationState.shouldOptimizeForBattery ? 300000 : 600000,
      retry: optimizationState.connectionType === 'cellular' ? 1 : 2,
      refetchOnWindowFocus: !optimizationState.shouldOptimizeForBattery
    };
  };

  // Sacred geometry optimization for mobile
  const getSacredGeometrySettings = () => {
    if (optimizationState.shouldOptimizeForBattery) {
      return {
        complexity: 'low' as const,
        renderFrequency: 'static' as const,
        particleCount: 10
      };
    }

    if (optimizationState.connectionType === 'cellular') {
      return {
        complexity: 'medium' as const,
        renderFrequency: 'reduced' as const,
        particleCount: 25
      };
    }

    return {
      complexity: 'high' as const,
      renderFrequency: 'realtime' as const,
      particleCount: 50
    };
  };

  return {
    ...optimizationState,
    getAnimationSettings,
    getQuerySettings,
    getSacredGeometrySettings,
    // Utility functions
    isMobile: optimizationState.isNative,
    isLowPower: optimizationState.shouldOptimizeForBattery,
    hasGoodConnection: optimizationState.connectionType === 'wifi' && optimizationState.isOnline,
  };
}