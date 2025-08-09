import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pin, 
  Globe, 
  Users, 
  Lock, 
  Calendar, 
  Eye, 
  MessageCircle, 
  Share2, 
  Sparkles,
  MoreVertical,
  Edit,
  Trash2,
  Target,
  Tag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RegistryEntry, useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuthContext';

interface RegistryEntryCardProps {
  entry: RegistryEntry;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  index?: number;
}

export function RegistryEntryCard({ 
  entry, 
  onClick, 
  onEdit, 
  onDelete, 
  index = 0 
}: RegistryEntryCardProps) {
  const { user } = useAuth();
  const { incrementEngagement } = useRegistryOfResonance();
  
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
    if (rating >= 80) return 'text-green-500 border-green-500';
    if (rating >= 60) return 'text-blue-500 border-blue-500';
    if (rating >= 40) return 'text-yellow-500 border-yellow-500';
    return 'text-orange-500 border-orange-500';
  };

  const handleCardClick = async () => {
    await incrementEngagement(entry.id, 'views');
    onClick();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      }
    } else {
      // Copy to clipboard
      const text = `${entry.title}\n\n${entry.content}\n\nResonance Rating: ${entry.resonance_rating}/100`;
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4",
          entry.is_verified ? "border-l-primary bg-gradient-to-r from-primary/5 to-transparent" : "border-l-muted",
          entry.is_pinned && "ring-2 ring-yellow-200 dark:ring-yellow-800"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {entry.title}
                </CardTitle>
                {entry.is_pinned && (
                  <Pin className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                )}
                {entry.is_verified && (
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {getAccessIcon()}
                  {entry.access_level}
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {entry.entry_type}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>

            {/* Resonance Rating */}
            <div className="flex flex-col items-center gap-1 ml-4">
              <div className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold",
                getResonanceColor(entry.resonance_rating)
              )}>
                {entry.resonance_rating}
              </div>
              <span className="text-xs text-muted-foreground">Resonance</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Image Preview */}
          {entry.image_url && (
            <div className="relative overflow-hidden rounded-md">
              <img 
                src={entry.image_url} 
                alt={entry.image_alt_text || entry.title}
                className="w-full h-32 object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}

          {/* Content Preview */}
          <CardDescription className="line-clamp-3 text-sm leading-relaxed">
            {entry.content}
          </CardDescription>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {entry.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{entry.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Resonance Signature */}
          {entry.resonance_signature && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="w-3 h-3" />
              <span className="font-mono truncate">{entry.resonance_signature}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {entry.engagement_metrics && (
                <>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {entry.engagement_metrics.views || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {entry.engagement_metrics.comments || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {entry.engagement_metrics.shares || 0}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Share2 className="w-3 h-3" />
              </Button>

              {isOwner && (onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete();
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}