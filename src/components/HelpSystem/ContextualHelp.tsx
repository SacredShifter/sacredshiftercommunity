import React from 'react';
import { HelpCircle, Info } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { TooltipWrapper } from './TooltipWrapper';


interface ContextualHelpProps {
  title: string;
  description: string;
  tips?: string[];
  variant?: 'info' | 'help';
  className?: string;
}

export function ContextualHelp({ 
  title, 
  description, 
  tips = [], 
  variant = 'info',
  className = '' 
}: ContextualHelpProps) {
  const Icon = variant === 'help' ? HelpCircle : Info;
  
  return (
    <Card className={`border-primary/20 bg-primary/5 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {tips.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-primary">Tips:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-primary mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}