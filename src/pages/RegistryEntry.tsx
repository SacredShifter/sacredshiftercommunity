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
  Clock,
  Bookmark,
  Download,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import ResonanceChart from '@/components/Codex/ResonanceChart';
import TagCloud from '@/components/Codex/TagCloud';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicDiscussion from '@/components/Codex/PublicDiscussion';
import ReflectionNotes from '@/components/Codex/ReflectionNotes';
import FontSizeToggle from '@/components/FontSizeToggle';

interface RegistryEntry {
  id: string;
  title: string;
  content: string;
  quick_abstract?: string;
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
  engagement_metrics?: {
    views?: number;
    shares?: number;
    bookmarks?: number;
  };
  resonance_growth_data?: { timestamp: string; count: number }[];
}

export default function RegistryEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    toggleResonance,
    getUserResonanceStatus,
    incrementEngagement,
    exportEntryAsSeed,
    shareToCircle
  } = useRegistryOfResonance();
  
  const [entry, setEntry] = useState<RegistryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasResonated, setHasResonated] = useState(false);
  const [resonanceCount, setResonanceCount] = useState(0);
  const [isEchoModalOpen, setEchoModalOpen] = useState(false);

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
          .select('*, user:profiles(*)')
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
    const resonating = await toggleResonance(id);
    setHasResonated(resonating);
    // The count is now updated via a trigger, so we should refetch or trust the trigger.
    // For immediate feedback, we can still do this:
    setResonanceCount(prev => resonating ? prev + 1 : prev - 1);
  };

  const handleBookmark = () => {
    if (!id) return;
    incrementEngagement(id, 'bookmarks');
    toast.success('Bookmarked to your Personal Codex!');
  };

  const handleSeed = () => {
    if (!id) return;
    exportEntryAsSeed(id);
  };

  const handleEcho = () => {
    setEchoModalOpen(true);
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
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/registry')}
            className="gap-2 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Registry
          </Button>
          <div className="flex-1" />
          <FontSizeToggle />
          {/* Quick Search Placeholder */}
          <div className="w-64">
            {/* <Input placeholder="Quick search..." /> */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-8 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResonance}
              className={`gap-2 ${hasResonated ? 'text-primary border-primary/50' : ''}`}
              title="Resonate"
            >
              <Sparkles className={`h-4 w-4 ${hasResonated ? 'fill-current' : ''}`} />
              <span>{resonanceCount}</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleEcho} className="gap-2" title="Echo">
              <Share2 className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleSeed} className="gap-2" title="Seed">
              <Download className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleBookmark} className="gap-2" title="Bookmark">
              <Bookmark className="h-4 w-4" />
            </Button>
        </div>

        {/* TODO: Create and import this component */}
        {/* isEchoModalOpen && (
          <EchoShareModal
            entryId={id}
            onClose={() => setEchoModalOpen(false)}
            shareToCircle={shareToCircle}
          />
        ) */}

        {/* Main Content */}
        <Card className={`backdrop-blur-xl border-white/20 overflow-hidden transition-all duration-500 ${entry.resonance_count && entry.resonance_count > 10 ? 'shadow-lg shadow-primary/20' : ''}`}>
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="p-8 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" disabled>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <h1 className="text-3xl font-bold text-foreground leading-tight">
                    {entry.title}
                  </h1>
                </div>
                <Button variant="ghost" size="icon" disabled>
                  <ArrowLeft className="h-4 w-4 transform rotate-180" />
                </Button>
              </div>

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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1 text-emerald-400">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-sm font-semibold">Verified</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Aura Seal of Verification for truth-aligned entries.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              {/* Quick Abstract */}
              {entry.quick_abstract && (
                <div className="mt-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                  <p className="italic text-foreground/80">{entry.quick_abstract}</p>
                </div>
              )}

              {/* Tags */}
              <div className="mt-6">
                <TagCloud tags={entry.tags} />
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                <ReactMarkdown
                  components={{
                    blockquote: ({ node, ...props }) => {
                      const textContent = node?.children[0]?.children[0]?.value || '';
                      if (textContent.startsWith('!')) {
                        const newChildren = React.Children.map(props.children, child => {
                          if (React.isValidElement(child) && child.props.children) {
                            const newChildProps = {
                              ...child.props,
                              children: typeof child.props.children === 'string'
                                ? child.props.children.substring(1)
                                : child.props.children,
                            };
                            if (Array.isArray(newChildProps.children)) {
                               newChildProps.children[0] = newChildProps.children[0].substring(1);
                            }
                            return React.cloneElement(child, newChildProps);
                          }
                          return child;
                        });

                        return (
                          <div className="my-6 p-4 border-l-4 border-accent text-lg font-semibold text-accent-foreground bg-accent/10 rounded-r-lg">
                            {newChildren}
                          </div>
                        );
                      }
                      return <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic my-4" {...props} />;
                    },
                  }}
                >
                  {entry.content}
                </ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Resonance Metrics Section */}
        <Card className="mt-8 backdrop-blur-xl border-white/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Resonance Metrics</h2>
            <ResonanceChart data={entry.resonance_growth_data} />
          </CardContent>
        </Card>

        {/* Community Layer Section */}
        <div className="mt-8">
          <Tabs defaultValue="discussion">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="discussion">Public Discussion</TabsTrigger>
              <TabsTrigger value="reflections">Private Reflection Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="discussion">
              <Card className="backdrop-blur-xl border-white/20">
                <CardContent className="p-8">
                  {id && <PublicDiscussion entryId={id} />}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reflections">
              <Card className="backdrop-blur-xl border-white/20">
                <CardContent className="p-8">
                  {id && <ReflectionNotes entryId={id} />}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}