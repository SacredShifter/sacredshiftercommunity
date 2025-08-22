import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  enableSafeArea?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  mobileClassName,
  desktopClassName,
  enableSafeArea = true,
  maxWidth = 'full'
}) => {
  const isMobile = useIsMobile();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const safeAreaClasses = enableSafeArea 
    ? 'safe-area-inset-top safe-area-inset-bottom' 
    : '';

  const responsiveClasses = isMobile ? mobileClassName : desktopClassName;

  return (
    <div 
      className={cn(
        'w-full mx-auto',
        maxWidthClasses[maxWidth],
        safeAreaClasses,
        responsiveClasses,
        className
      )}
      style={{
        paddingTop: enableSafeArea && isMobile ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: enableSafeArea && isMobile ? 'env(safe-area-inset-bottom)' : undefined,
        paddingLeft: enableSafeArea && isMobile ? 'env(safe-area-inset-left)' : undefined,
        paddingRight: enableSafeArea && isMobile ? 'env(safe-area-inset-right)' : undefined,
      }}
    >
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const gridClasses = `grid grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;

  return (
    <div className={cn(gridClasses, gapClasses[gap], className)}>
      {children}
    </div>
  );
};

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    mobile: 'horizontal' | 'vertical';
    desktop: 'horizontal' | 'vertical';
  };
  spacing?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  className,
  direction = { mobile: 'vertical', desktop: 'horizontal' },
  spacing = 'md',
  align = 'start',
  justify = 'start'
}) => {
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  const mobileDirection = direction.mobile === 'horizontal' ? 'flex-row' : 'flex-col';
  const desktopDirection = direction.desktop === 'horizontal' ? 'md:flex-row' : 'md:flex-col';

  return (
    <div className={cn(
      'flex',
      mobileDirection,
      desktopDirection,
      spacingClasses[spacing],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
};