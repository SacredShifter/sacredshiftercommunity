import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading sacred content...", 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4 p-8",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-primary",
        sizeClasses[size]
      )} />
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn(
    "animate-pulse rounded-md bg-muted",
    className
  )} />
);

interface CardSkeletonProps {
  showAvatar?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ showAvatar = false }) => (
  <div className="space-y-3 p-4 border rounded-lg">
    <div className="flex items-center space-x-4">
      {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-20 w-full" />
  </div>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <CardSkeleton key={i} showAvatar />
    ))}
  </div>
);