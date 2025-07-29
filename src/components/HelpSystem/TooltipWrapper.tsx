import React, { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  children: ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  disabled?: boolean;
}

export function TooltipWrapper({ 
  children, 
  content, 
  side = "top", 
  delayDuration = 300,
  disabled = false 
}: TooltipWrapperProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}