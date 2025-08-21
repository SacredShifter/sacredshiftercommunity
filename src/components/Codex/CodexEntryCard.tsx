import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Clock, Tag, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { format } from 'date-fns/format';
import { CodexEntry } from '@/hooks/useCodex';

interface CodexEntryCardProps {
  entry: CodexEntry;
  onEdit: (entry: CodexEntry) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

const TYPE_COLORS = {
  Dream: 'from-purple-500/20 to-indigo-500/20',
  Lesson: 'from-blue-500/20 to-cyan-500/20',
  Download: 'from-green-500/20 to-emerald-500/20',
  Integration: 'from-orange-500/20 to-amber-500/20',
  Fragment: 'from-pink-500/20 to-rose-500/20',
  Vision: 'from-violet-500/20 to-purple-500/20',
  Revelation: 'from-yellow-500/20 to-orange-500/20',
  Memory: 'from-slate-500/20 to-gray-500/20',
};

const TYPE_GLOWS = {
  Dream: 'shadow-purple-500/20',
  Lesson: 'shadow-blue-500/20',
  Download: 'shadow-green-500/20',
  Integration: 'shadow-orange-500/20',
  Fragment: 'shadow-pink-500/20',
  Vision: 'shadow-violet-500/20',
  Revelation: 'shadow-yellow-500/20',
  Memory: 'shadow-slate-500/20',
};

export function CodexEntryCard({ entry, onEdit, onDelete, compact = false }: CodexEntryCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const typeGradient = TYPE_COLORS[entry.type] || TYPE_COLORS.Fragment;
  const typeGlow = TYPE_GLOWS[entry.type] || TYPE_GLOWS.Fragment;

  const handleDelete = () => {
    onDelete(entry.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <Card className={`h-full transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${isHovered ? typeGlow : ''} backdrop-blur border-border/50 bg-gradient-to-br ${typeGradient} group relative overflow-hidden`}>
          {/* Animated border */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <CardHeader className="pb-3 relative">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${compact ? 'text-base' : 'text-lg'} line-clamp-2 text-foreground group-hover:text-primary transition-colors`}>
                  {entry.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {entry.type}
                  </Badge>
                  {entry.source_module && (
                    <Badge variant="outline" className="text-xs">
                      {entry.source_module}
                    </Badge>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(entry)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Entry
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Entry
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            {entry.content && (
              <p className={`text-muted-foreground ${compact ? 'text-sm line-clamp-2' : 'line-clamp-3'} mb-4`}>
                {entry.content}
              </p>
            )}
            
            {entry.resonance_tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {entry.resonance_tags.slice(0, compact ? 2 : 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {entry.resonance_tags.length > (compact ? 2 : 4) && (
                  <Badge variant="outline" className="text-xs">
                    +{entry.resonance_tags.length - (compact ? 2 : 4)}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(entry.created_at), 'MMM d, yyyy')}
              </div>
              
              {entry.updated_at !== entry.created_at && (
                <div className="text-xs text-muted-foreground/60">
                  Updated {format(new Date(entry.updated_at), 'MMM d')}
                </div>
              )}
            </div>
          </CardContent>
          
          {/* Breathing effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Codex Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{entry.title}"? This action cannot be undone and will permanently remove this entry from your sacred codex.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete Entry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}