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

// Quick help tooltips for common UI elements
export const HelpTooltips = {
  // Navigation
  home: "Return to your sacred dashboard with overview of all activities",
  feed: "View and interact with posts from your spiritual community",
  circles: "Join or create meditation circles and discussion groups",
  journal: "Private space for daily reflections, dreams, and insights",
  videos: "Access curated spiritual teachings and meditation content",
  registry: "Catalog your spiritual experiences and synchronicities",
  codex: "Your personal memory archive of insights and downloads",
  profile: "Manage your spiritual profile and journey milestones",
  settings: "Customize your Sacred Shifter experience",
  
  // Actions
  create: "Create new content - hold for quick options menu",
  search: "Search across all your content and community posts",
  filter: "Filter content by type, tags, or date range",
  save: "Save this content to your personal collections",
  share: "Share with your circles or the broader community",
  edit: "Modify this content (only available for your own content)",
  delete: "Permanently remove this content from your archive",
  
  // Features
  resonance: "Rate how deeply this content resonates with your spiritual journey (1-10)",
  privacy: "Control who can see this content - private is visible only to you",
  tags: "Add keywords to help organize and find this content later",
  frequency: "Set the energetic frequency that best matches this content",
  circle: "Choose which spiritual circle to share this with",
  
  // Form fields
  title: "Give your content a meaningful title that captures its essence",
  content: "Express your thoughts, insights, or experiences in detail",
  type: "Categorize your content to help with organization and discovery",
  source: "Track which part of your spiritual practice this came from",
  reflection: "Add personal insights or lessons learned from this experience"
};