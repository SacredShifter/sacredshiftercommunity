import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Clock, AlertCircle } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  loadTime: number;
  networkRequests: number;
  errors: number;
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
  onThresholdExceeded?: (metric: string, value: number) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showDetails = false,
  onThresholdExceeded
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    loadTime: 0,
    networkRequests: 0,
    errors: 0
  });

  const [isVisible, setIsVisible] = useState(showDetails);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        setMetrics(prev => ({ ...prev, fps }));
        
        // Alert if FPS drops below 30
        if (fps < 30 && onThresholdExceeded) {
          onThresholdExceeded('fps', fps);
        }
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    // Memory usage
    const updateMemory = () => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const memoryMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
        setMetrics(prev => ({ ...prev, memory: memoryMB }));
        
        // Alert if memory usage exceeds 100MB
        if (memoryMB > 100 && onThresholdExceeded) {
          onThresholdExceeded('memory', memoryMB);
        }
      }
    };

    // Load time
    const updateLoadTime = () => {
      if ('navigation' in performance) {
        const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = Math.round(navTiming.loadEventEnd - navTiming.fetchStart);
        setMetrics(prev => ({ ...prev, loadTime }));
      }
    };

    const memoryInterval = setInterval(updateMemory, 5000);
    updateLoadTime();

    // Keyboard shortcut to toggle visibility
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onThresholdExceeded]);

  const getPerformanceStatus = () => {
    const issues = [];
    if (metrics.fps < 30) issues.push('Low FPS');
    if (metrics.memory > 100) issues.push('High Memory');
    if (metrics.loadTime > 3000) issues.push('Slow Load');
    
    return issues.length > 0 ? 'warning' : 'good';
  };

  const performanceStatus = getPerformanceStatus();

  if (!isVisible && !showDetails) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Badge 
          variant={performanceStatus === 'warning' ? 'destructive' : 'secondary'}
          className="cursor-pointer animate-pulse"
          onClick={() => setIsVisible(true)}
        >
          <Activity className="w-3 h-3 mr-1" />
          {metrics.fps} FPS
        </Badge>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-64 bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Performance Monitor
            </span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              FPS
            </span>
            <Badge variant={metrics.fps < 30 ? 'destructive' : 'secondary'}>
              {metrics.fps}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="w-3 h-3 mr-1" />
              Memory
            </span>
            <Badge variant={metrics.memory > 100 ? 'destructive' : 'secondary'}>
              {metrics.memory} MB
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Load Time
            </span>
            <Badge variant={metrics.loadTime > 3000 ? 'destructive' : 'secondary'}>
              {(metrics.loadTime / 1000).toFixed(1)}s
            </Badge>
          </div>
          
          {performanceStatus === 'warning' && (
            <div className="flex items-start space-x-2 text-destructive">
              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="text-xs">Performance issues detected</span>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Press Ctrl+Shift+P to toggle
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;