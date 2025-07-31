import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Pin, Share2, Edit, Trash2, Sparkles, 
  Globe, Users, Lock, Calendar, Tag, Target,
  PinOff, ExternalLink
} from 'lucide-react';
import { RegistryEntry, useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { AdminVerificationPanel } from './AdminVerificationPanel';
import { RegistryComments } from './RegistryComments';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface EntryModalProps {
  entry: RegistryEntry;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onVerificationChange?: () => void;
}

export function EntryModal({ entry, open, onClose, onEdit, onVerificationChange }: EntryModalProps) {
  const { user } = useAuth();
  const { deleteEntry, togglePin, incrementEngagement, deleteImage } = useRegistryOfResonance();
  const [isDeleting, setIsDeleting] = useState(false);

  // Track view when modal opens
  React.useEffect(() => {
    if (open && entry) {
      incrementEngagement(entry.id, 'views');
    }
  }, [open, entry, incrementEngagement]);

  const isOwner = user?.id === entry.user_id;

  const getAccessIcon = () => {
    switch (entry.access_level) {
      case 'Public':
        return <Globe className="w-4 h-4" />;
      case 'Circle':
        return <Users className="w-4 h-4" />;
      case 'Private':
        return <Lock className="w-4 h-4" />;
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  const getResonanceColor = (rating: number) => {
    if (rating >= 80) return 'text-green-500';
    if (rating >= 60) return 'text-blue-500';
    if (rating >= 40) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    
    setIsDeleting(true);
    try {
      // Delete associated image if exists
      if (entry.image_url) {
        await deleteImage(entry.image_url);
      }
      await deleteEntry(entry.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async () => {
    if (!isOwner) return;
    
    try {
      await togglePin(entry.id);
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const handleShare = async () => {
    await incrementEngagement(entry.id, 'shares');
    
    if (navigator.share && entry.access_level === 'Public') {
      try {
        await navigator.share({
          title: entry.title,
          text: entry.content.substring(0, 200) + '...',
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } else {
      // Copy to clipboard
      const text = `${entry.title}\n\n${entry.content}\n\nResonance Rating: ${entry.resonance_rating}/100`;
      await navigator.clipboard.writeText(text);
      toast.success('Entry copied to clipboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden flex flex-col">
        <div className="relative flex flex-col h-full">
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 p-6 border-b flex-shrink-0">
            {entry.is_verified && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-purple-500/20" />
            )}
            
            <DialogHeader className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-2xl font-bold">
                      {entry.title}
                    </DialogTitle>
                    {entry.is_pinned && (
                      <Pin className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                    {entry.is_verified && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-sm text-primary font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {getAccessIcon()}
                      {entry.access_level}
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {entry.entry_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Resonance Rating */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-muted-foreground/20 flex items-center justify-center relative">
                      <div 
                        className={cn(
                          "absolute inset-0 rounded-full border-4 border-transparent",
                          getResonanceColor(entry.resonance_rating)
                        )}
                        style={{
                          background: `conic-gradient(currentColor ${entry.resonance_rating * 3.6}deg, transparent 0deg)`
                        }}
                      />
                      <span className={cn("text-xl font-bold relative z-10", getResonanceColor(entry.resonance_rating))}>
                        {entry.resonance_rating}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Resonance</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                
                {isOwner && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTogglePin}
                      className="gap-2"
                    >
                      {entry.is_pinned ? (
                        <>
                          <PinOff className="w-4 h-4" />
                          Unpin
                        </>
                      ) : (
                        <>
                          <Pin className="w-4 h-4" />
                          Pin
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onEdit}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </>
                )}
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Image */}
              {entry.image_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <img 
                    src={entry.image_url} 
                    alt={entry.image_alt_text || entry.title} 
                    className="w-full max-h-96 object-cover rounded-lg border"
                  />
                </motion.div>
              )}

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-sm max-w-none dark:prose-invert"
              >
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {entry.content}
                </div>
                
                {/* Enhanced Metadata */}
                {(entry.word_count || entry.reading_time_minutes) && (
                  <div className="flex gap-4 text-xs text-muted-foreground mt-4 pt-2 border-t">
                    {entry.word_count && <span>Words: {entry.word_count}</span>}
                    {entry.reading_time_minutes && <span>Reading time: ~{entry.reading_time_minutes} min</span>}
                  </div>
                )}
              </motion.div>

              <Separator />

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resonance Signature */}
                {entry.resonance_signature && (
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Resonance Signature
                    </h4>
                    <div className="font-mono text-sm bg-muted/50 px-3 py-2 rounded">
                      {entry.resonance_signature}
                    </div>
                  </div>
                )}

                {/* Author Info */}
                {entry.author_name && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Author</h4>
                    <div className="text-sm">
                      <div className="font-medium">{entry.author_name}</div>
                      {entry.author_bio && (
                        <div className="text-muted-foreground mt-1">{entry.author_bio}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {(entry.source_citation || entry.inspiration_source) && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Sources</h4>
                    <div className="text-sm space-y-1">
                      {entry.source_citation && (
                        <div>
                          <span className="text-muted-foreground">Citation:</span> {entry.source_citation}
                        </div>
                      )}
                      {entry.inspiration_source && (
                        <div>
                          <span className="text-muted-foreground">Inspiration:</span> {entry.inspiration_source}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Engagement Metrics */}
                {entry.engagement_metrics && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Engagement</h4>
                    <div className="text-sm text-muted-foreground">
                      Views: {entry.engagement_metrics.views || 0} • 
                      Shares: {entry.engagement_metrics.shares || 0} • 
                      Bookmarks: {entry.engagement_metrics.bookmarks || 0}
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
                <div>Created: {new Date(entry.created_at).toLocaleString()}</div>
                <div>Updated: {new Date(entry.updated_at).toLocaleString()}</div>
              </div>
            </div>
          </ScrollArea>
          </div>

          {/* Admin Verification Panel */}
          <AdminVerificationPanel 
            entry={entry} 
            onVerificationChange={onVerificationChange}
          />
        </DialogContent>
      </Dialog>
    );
  }