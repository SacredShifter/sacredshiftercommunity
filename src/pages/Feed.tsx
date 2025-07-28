import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import CreatePostModal from '@/components/CreatePostModal';
import { ChatBubble } from '@/components/ChatBubble';
import { formatDistanceToNow } from 'date-fns';

interface SacredPost {
  id: string;
  user_id: string;
  content: string;
  title?: string;
  visibility: 'public' | 'circle' | 'private';
  circle_ids: string[];
  source_module: string;
  tags: string[];
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('sacred_posts')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Sacred Feed
              </h1>
              <p className="text-sm text-muted-foreground">
                The collective consciousness awakens
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="h-4 w-4 mr-2" />
              Share to Feed
            </Button>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl">🌸</div>
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
            const sourceModule = getSourceModuleDisplay(post.source_module);
            
            return (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                        {getInitials(post.profiles?.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm">
                            {post.profiles?.display_name || 'Sacred Seeker'}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                            <span>•</span>
                            <Badge 
                              variant="outline" 
                              style={{ borderColor: sourceModule.color, color: sourceModule.color }}
                              className="text-xs"
                            >
                              {sourceModule.name}
                            </Badge>
                            {post.visibility !== 'public' && (
                              <>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">
                                  {post.visibility === 'circle' ? 'Circle' : 'Private'}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {post.title && (
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  )}
                  
                  <div className="prose prose-sm max-w-none text-foreground mb-4">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-6 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">Resonate {post.like_count > 0 && `(${post.like_count})`}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">Reflect {post.comment_count > 0 && `(${post.comment_count})`}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                      <Share2 className="h-4 w-4" />
                      <span className="text-xs">Share</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Chat Bubble */}
      <ChatBubble />

      <CreatePostModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Feed;