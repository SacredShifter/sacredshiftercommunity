import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Circle } from 'lucide-react';
import CreatePostModal from '@/components/CreatePostModal';
import { ChatBubble } from '@/components/ChatBubble';
import { SacredSoundscape } from '@/components/SacredSoundscape';

import { PostInteractionButtons } from '@/components/PostInteractionButtons';
import { CircleDiscoveryPanel } from '@/components/CircleDiscoveryPanel';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { CommentSection } from '@/components/CommentSection';
const sacredShifterLogo = 'https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png';

interface SacredPost {
  id: string;
  user_id: string;
  content: string;
  chakra_tag?: string;
  frequency?: number;
  tone?: string;
  visibility: 'circle' | 'private';
  has_image?: boolean;
  image_url?: string;
  has_audio?: boolean;
  audio_url?: string;
  is_anonymous?: boolean;
  shared_with?: string[];
  auto_delete_at?: string;
  created_at: string;
  updated_at: string;
  circle_group_members?: {
    circle_groups: {
      name: string;
      chakra_focus?: string;
    };
  }[];
  profiles?: {
    display_name?: string;
    avatar_url?: string;
  };
}

const Feed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<SacredPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCircleDiscovery, setShowCircleDiscovery] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('circle_posts_with_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts((data || []) as SacredPost[]);
    } catch (error: any) {
      toast({
        title: "Error loading feed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const getSourceModuleDisplay = (module: string) => {
    const modules: Record<string, { name: string; color: string }> = {
      'manual': { name: 'Sacred Thoughts', color: 'hsl(var(--primary))' },
      'breath': { name: 'Breath of Source', color: 'hsl(142, 76%, 36%)' },
      'dreamscape': { name: 'Dream Awakening', color: 'hsl(259, 94%, 51%)' },
      'tarot': { name: 'Tarot Wisdom', color: 'hsl(346, 87%, 43%)' },
      'meditation': { name: 'Sacred Meditation', color: 'hsl(203, 89%, 53%)' },
    };
    return modules[module] || { name: module, color: 'hsl(var(--muted))' };
  };

  const getInitials = (name?: string) => {
    if (!name) return 'SS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getChakraColor = (chakra?: string) => {
    const colors: Record<string, string> = {
      'Root': 'hsl(0, 84%, 60%)',
      'Sacral': 'hsl(25, 95%, 53%)', 
      'Solar Plexus': 'hsl(60, 100%, 50%)',
      'Heart': 'hsl(120, 61%, 50%)',
      'Throat': 'hsl(195, 100%, 50%)',
      'Third Eye': 'hsl(240, 100%, 50%)',
      'Crown': 'hsl(280, 100%, 50%)',
    };
    return colors[chakra || ''] || 'hsl(var(--primary))';
  };

  const handlePostCreated = () => {
    fetchPosts();
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3rem)] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/20 backdrop-blur-md border-b border-white/10 -mt-4 sm:-mt-6 md:-mt-8 mb-4 sm:mb-6 md:mb-8">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={sacredShifterLogo} 
                alt="Sacred Shifter" 
                className="h-12 w-auto filter invert brightness-0 contrast-100 opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Sacred Feed
                </h1>
                <p className="text-sm text-muted-foreground">
                  The Resonance Field Is Open
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowCircleDiscovery(true)}
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
              >
                <Circle className="h-4 w-4 mr-2" />
                Circles
              </Button>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="sacred-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Plus className="h-4 w-4 mr-2" />
                Share to Feed
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-2xl mx-auto px-4 py-0 space-y-6 pb-8">
        <div>
        {posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl flower-of-life-bloom">🌸</div>
                <h3 className="text-lg font-semibold">Your Sacred Feed Awaits</h3>
                <p className="text-muted-foreground">
                  Begin sharing your journey and connecting with the collective consciousness.
                </p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => {
            const sourceModule = getSourceModuleDisplay('manual');
            
            return (
              <Card key={post.id} className="post-card overflow-hidden hover:shadow-md transition-all duration-200 hover:shadow-primary/10">
                <CardHeader className="pb-2 pt-3">
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs">
                        {getInitials(post.profiles?.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">
                          {post.profiles?.display_name || 'Sacred Seeker'}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at))} ago
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        {/* Circle Badge */}
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          📍 Welcome to Sacred Shifter
                        </Badge>
                        
                        {/* Chakra Tag */}
                        {post.chakra_tag && (
                          <Badge 
                            variant="outline" 
                            style={{ 
                              borderColor: getChakraColor(post.chakra_tag),
                              color: getChakraColor(post.chakra_tag)
                            }}
                            className="text-xs"
                          >
                            {post.chakra_tag}
                          </Badge>
                        )}
                        
                        {/* Privacy */}
                        {post.visibility === 'private' && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 pb-3">
                  <div className="prose prose-sm max-w-none text-foreground mb-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>
                  </div>

                  {/* Frequency Badge */}
                  {post.tone && (
                    <div className="mb-3">
                      <Badge 
                        variant="outline" 
                        className="border-2 bg-primary/5 text-xs"
                        style={{ 
                          borderColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary))',
                          boxShadow: '0 0 10px hsl(var(--primary) / 0.2)'
                        }}
                      >
                        🎵 {post.tone}
                      </Badge>
                    </div>
                  )}

                  {/* Interactive Post Buttons */}
                  <PostInteractionButtons
                    postId={post.id}
                    initialLikeCount={0}
                    initialCommentCount={0}
                    postUserId={post.user_id}
                    currentUserId={user?.id}
                  />

                  {/* Collapsible Comments Section */}
                  <CommentSection postId={post.id} />
                </CardContent>
              </Card>
            );
          })
        )}
        </div>
      </div>


      <CreatePostModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onPostCreated={handlePostCreated}
      />

      <CircleDiscoveryPanel
        open={showCircleDiscovery}
        onOpenChange={setShowCircleDiscovery}
      />
    </div>
  );
};

export default Feed;