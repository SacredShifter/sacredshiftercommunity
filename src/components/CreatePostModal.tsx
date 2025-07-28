import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { X, Globe, Users, Lock, Sparkles } from 'lucide-react';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
}

interface CircleGroup {
  id: string;
  name: string;
  description?: string;
}

const CreatePostModal = ({ open, onOpenChange, onPostCreated }: CreatePostModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'circle' | 'private'>('public');
  const [selectedCircles, setSelectedCircles] = useState<string[]>([]);
  const [circles, setCircles] = useState<CircleGroup[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [sourceModule, setSourceModule] = useState('manual');

  const fetchUserCircles = async () => {
    try {
      const { data, error } = await supabase
        .from('circle_group_members')
        .select(`
          group_id,
          circle_groups (
            id,
            name,
            description
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      const userCircles = data
        ?.map(item => item.circle_groups)
        .filter(Boolean) as CircleGroup[];
      
      setCircles(userCircles || []);
    } catch (error: any) {
      console.error('Error fetching circles:', error);
    }
  };

  useEffect(() => {
    if (open && user) {
      fetchUserCircles();
    }
  }, [open, user]);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    try {
      const entryData = {
        user_id: user.id,
        title: title.trim() || null,
        content: content.trim(),
        visibility,
        circle_ids: visibility === 'circle' ? selectedCircles : [],
        source_module: sourceModule,
        tags,
      };

      const { error } = await supabase
        .from('codex_entries')
        .insert([entryData]);

      if (error) throw error;

      toast({
        title: "Sacred wisdom shared! ✨",
        description: `Your post has been ${visibility === 'public' ? 'shared with the world' : visibility === 'circle' ? 'shared with your circles' : 'saved privately'}.`,
      });

      // Reset form
      setTitle('');
      setContent('');
      setVisibility('public');
      setSelectedCircles([]);
      setTags([]);
      setSourceModule('manual');
      
      onPostCreated();
    } catch (error: any) {
      toast({
        title: "Error sharing post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVisibilityIcon = (vis: string) => {
    switch (vis) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'circle': return <Users className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getVisibilityDescription = (vis: string) => {
    switch (vis) {
      case 'public': return 'Visible to everyone in the Sacred Feed';
      case 'circle': return 'Only visible to selected circle members';
      case 'private': return 'Only visible to you in your personal Codex';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Share Sacred Wisdom</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to call this reflection?"
              className="border-primary/20 focus:border-primary"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Sacred Wisdom *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your insights, reflections, or journey..."
              rows={6}
              className="border-primary/20 focus:border-primary resize-none"
              required
            />
          </div>

          {/* Source Module */}
          <div className="space-y-2">
            <Label htmlFor="source">Source Module</Label>
            <Select value={sourceModule} onValueChange={setSourceModule}>
              <SelectTrigger className="border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Sacred Thoughts</SelectItem>
                <SelectItem value="breath">Breath of Source</SelectItem>
                <SelectItem value="dreamscape">Dream Awakening</SelectItem>
                <SelectItem value="tarot">Tarot Wisdom</SelectItem>
                <SelectItem value="meditation">Sacred Meditation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <Label>Visibility</Label>
            <div className="grid grid-cols-1 gap-2">
              {(['public', 'circle', 'private'] as const).map((vis) => (
                <div
                  key={vis}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    visibility === vis 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setVisibility(vis)}
                >
                  <div className="flex items-center space-x-3">
                    {getVisibilityIcon(vis)}
                    <div className="flex-1">
                      <div className="font-medium capitalize">{vis}</div>
                      <div className="text-xs text-muted-foreground">
                        {getVisibilityDescription(vis)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Circle Selection (only when circle visibility is selected) */}
          {visibility === 'circle' && circles.length > 0 && (
            <div className="space-y-2">
              <Label>Select Circles</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {circles.map((circle) => (
                  <div
                    key={circle.id}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedCircles.includes(circle.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      if (selectedCircles.includes(circle.id)) {
                        setSelectedCircles(selectedCircles.filter(id => id !== circle.id));
                      } else {
                        setSelectedCircles([...selectedCircles, circle.id]);
                      }
                    }}
                  >
                    <div className="font-medium text-sm">{circle.name}</div>
                    {circle.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {circle.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="space-y-2">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags (press Enter or comma to add)"
                className="border-primary/20 focus:border-primary"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs flex items-center space-x-1"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sharing...</span>
                </div>
              ) : (
                'Share Wisdom'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;