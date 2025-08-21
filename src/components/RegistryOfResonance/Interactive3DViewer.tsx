import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LearningModule3D, { learningModules } from '../3D/LearningModule3D';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface Interactive3DViewerProps {
  entryId?: string;
  title?: string;
  description?: string;
  moduleId?: string;
  className?: string;
}

export default function Interactive3DViewer({
  entryId,
  title = "Interactive 3D Learning",
  description,
  moduleId,
  className
}: Interactive3DViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(moduleId);

  const module = selectedModuleId ? learningModules.find(m => m.id === selectedModuleId) : null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Module Preview Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {title}
                  <Badge variant="outline" className="bg-primary/10">
                    3D Interactive
                  </Badge>
                </CardTitle>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Maximize2 className="h-4 w-4" />
                  Explore in 3D
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-screen-2xl h-[90vh] p-0 bg-transparent border-none">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <LearningModule3D 
                    moduleId={selectedModuleId}
                    className="w-full h-full"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        {module && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    {module.icon}
                    {module.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
                <Badge 
                  variant="outline"
                  className={
                    module.difficulty === 'beginner' ? 'border-green-500 text-green-500' :
                    module.difficulty === 'intermediate' ? 'border-yellow-500 text-yellow-500' :
                    'border-red-500 text-red-500'
                  }
                >
                  {module.difficulty}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">Category: {module.category}</span>
                  <span className="text-muted-foreground">Duration: {module.duration}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {module.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Embedded Preview (Optional) */}
              <div className="relative bg-gradient-to-br from-background/50 to-card/50 rounded-lg p-6 border border-primary/20">
                <div className="text-center space-y-2">
                  <Box className="h-12 w-12 mx-auto text-primary animate-pulse" />
                  <p className="text-sm text-muted-foreground">
                    Click "Explore in 3D" for the full interactive experience
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Module Selection */}
      {!moduleId && (
        <Card>
          <CardHeader>
            <CardTitle>Available 3D Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {learningModules.map(mod => (
                <Button
                  key={mod.id}
                  variant={selectedModuleId === mod.id ? "default" : "outline"}
                  onClick={() => setSelectedModuleId(mod.id)}
                  className="justify-start gap-2 h-auto p-3"
                >
                  {mod.icon}
                  <div className="text-left">
                    <div className="font-medium">{mod.title}</div>
                    <div className="text-xs opacity-70">{mod.category}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper component for Registry entries
export function create3DRegistryEntry(moduleId: string) {
  const module = learningModules.find(m => m.id === moduleId);
  
  if (!module) return null;

  return {
    title: module.title,
    content: module.description,
    entry_type: '3d_learning',
    tags: [...module.tags, '3d-interactive', 'immersive-learning'],
    metadata: {
      module_id: moduleId,
      category: module.category,
      difficulty: module.difficulty,
      duration: module.duration
    }
  };
}