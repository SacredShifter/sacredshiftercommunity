import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
  showScrollIndicator?: boolean;
}

export const MobileScrollContainer = forwardRef<HTMLDivElement, MobileScrollContainerProps>(
  ({ 
    children, 
    className, 
    maxHeight = '100vh',
    enablePullToRefresh = false,
    onRefresh,
    showScrollIndicator = true
  }, ref) => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [pullDistance, setPullDistance] = React.useState(0);

    // Merge refs
    const mergedRef = React.useCallback(
      (node: HTMLDivElement) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Pull to refresh logic for mobile
    useEffect(() => {
      if (!isMobile || !enablePullToRefresh || !onRefresh) return;

        const container = containerRef.current;
        if (!container) return;

        let startY = 0;
        let currentY = 0;
        let isPullingRef = false;

        const handleTouchStart = (e: TouchEvent) => {
          if (container.scrollTop === 0) {
            startY = e.touches[0].clientY;
            isPullingRef = true;
          }
        };

        const handleTouchMove = (e: TouchEvent) => {
          if (!isPullingRef) return;

          currentY = e.touches[0].clientY;
          const pullDist = Math.max(0, Math.min(80, currentY - startY));
          setPullDistance(pullDist);

          if (pullDist > 0) {
            e.preventDefault();
          }
        };

        const handleTouchEnd = async () => {
          if (isPullingRef && pullDistance > 60 && onRefresh) {
            setIsRefreshing(true);
            try {
              await onRefresh();
            } catch (error) {
              console.error('Refresh failed:', error);
            } finally {
              setIsRefreshing(false);
            }
          }
          isPullingRef = false;
          setPullDistance(0);
        };

      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }, [isMobile, enablePullToRefresh, onRefresh, pullDistance]);

    const mobileScrollClasses = isMobile 
      ? 'overflow-y-auto -webkit-overflow-scrolling-touch scroll-smooth' 
      : 'overflow-y-auto';

    const scrollbarClasses = showScrollIndicator 
      ? 'scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent' 
      : 'scrollbar-hide';

    return (
      <div
        ref={mergedRef}
        className={cn(
          'relative',
          mobileScrollClasses,
          scrollbarClasses,
          className
        )}
        style={{
          maxHeight,
          WebkitOverflowScrolling: 'touch',
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transition: pullDistance > 0 ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Pull to refresh indicator */}
        {enablePullToRefresh && (pullDistance > 0 || isRefreshing) && (
          <div 
            className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-background/90 backdrop-blur-sm border-b"
            style={{
              transform: `translateY(-100%) translateY(${Math.min(pullDistance, 80)}px)`,
              opacity: pullDistance / 60
            }}
          >
            <div className={cn(
              "flex items-center gap-2 text-sm text-muted-foreground",
              isRefreshing && "animate-pulse"
            )}>
              <div className={cn(
                "w-4 h-4 border-2 border-primary border-t-transparent rounded-full",
                (isRefreshing || pullDistance > 60) && "animate-spin"
              )} />
              {isRefreshing ? 'Refreshing...' : pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
            </div>
          </div>
        )}

        {children}
      </div>
    );
  }
);

MobileScrollContainer.displayName = 'MobileScrollContainer';