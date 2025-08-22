import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Calendar,
  User,
  Tag,
  Sparkles,
  Eye,
  Star,
  Clock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface RegistryEntry {
  id: string;
  title: string;
  content: string;
  entry_type: string;
  access_level: string;
  resonance_rating: number;
  tags: string[];
  aura_origin: boolean;
  community_review_status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  resonance_count?: number;
  view_count?: number;
  comment_count?: number;
}

export default function RegistryEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleResonance, getUserResonanceStatus } = useRegistryOfResonance();
  
  const [entry, setEntry] = useState<RegistryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasResonated, setHasResonated] = useState(false);
  const [resonanceCount, setResonanceCount] = useState(0);

  useEffect(() => {
    if (!id) {
      navigate('/registry');
      return;
    }

    const fetchEntry = async () => {
      try {
        setLoading(true);
        
        // Fetch the entry
        const { data: entryData, error: entryError } = await supabase
          .from('registry_of_resonance')
          .select('*')
          .eq('id', id)
          .single();

        if (entryError) {
          throw entryError;
        }

        if (!entryData) {
          throw new Error('Entry not found');
        }

        setEntry(entryData);
        setResonanceCount(0); // Default to 0 since we don't have resonance counts yet

        // Check if current user has resonated
        if (user) {
          const userResonance = await getUserResonanceStatus(id);
          setHasResonated(userResonance);
        }

        // Note: View count increment would go here when we have the function

      } catch (err) {
        console.error('Error fetching registry entry:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch entry');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id, navigate, user, getUserResonanceStatus]);

  const handleResonance = async () => {
    if (!id || !user) return;

    try {
      await toggleResonance(id);
      setHasResonated(!hasResonated);
      setResonanceCount(prev => hasResonated ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Error toggling resonance:', err);
    }
  };

  const handleShare = async () => {
    if (!entry) return;

    const shareData = {
      title: entry.title,
      text: entry.content.substring(0, 150) + '...',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // Could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg w-1/3"></div>
          <Card className="backdrop-blur-xl border-white/20">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="h-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded w-5/6"></div>
                <div className="h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="backdrop-blur-xl border-white/20 max-w-md mx-auto">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Entry Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'The registry entry you\'re looking for doesn\'t exist or may have been removed.'}
            </p>
            <Button onClick={() => navigate('/registry')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Registry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/registry')}
            className="gap-2 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Registry
          </Button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResonance}
              className={`gap-2 ${hasResonated ? 'text-red-500 border-red-500/50' : ''}`}
            >
              <Heart className={`h-4 w-4 ${hasResonated ? 'fill-current' : ''}`} />
              {resonanceCount}
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card className="backdrop-blur-xl border-white/20 overflow-hidden">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="p-8 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
                    {entry.title}
                  </h1>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(entry.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {entry.view_count || 0} views
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {entry.resonance_rating}/10 resonance
                    </div>
                    
                    {entry.aura_origin && (
                      <div className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-4 w-4" />
                        Created by Aura
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant={entry.entry_type === 'synchronicity' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {entry.entry_type.replace('_', ' ')}
                  </Badge>
                  
                  <Badge 
                    variant={entry.access_level === 'public' ? 'default' : 'outline'}
                    className="capitalize"
                  >
                    {entry.access_level}
                  </Badge>
                  
                  {entry.community_review_status === 'verified' && (
                    <Badge variant="default" className="bg-emerald-500 text-white">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                <ReactMarkdown>{entry.content}</ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Comments section would go here */}
        <div className="mt-8 text-center text-muted-foreground">
          <p>Comments and discussions coming soon...</p>
        </div>
      </div>
    </div>
  );
}