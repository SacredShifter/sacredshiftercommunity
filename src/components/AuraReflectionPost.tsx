import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { CommentSection } from '@/components/CommentSection';
import { PostInteractionButtons } from '@/components/PostInteractionButtons';
import './AuraReflectionPost.css';

// Using the same interface from Feed.tsx
interface SacredPost {
  id: string;
  user_id: string;
  content: string;
  is_aura_post?: boolean;
  created_at: string;
  profiles?: {
    display_name?: string;
    avatar_url?: string;
  };
}

interface AuraReflectionPostProps {
  post: SacredPost;
  currentUserId?: string;
}

const getInitials = (name?: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const AuraReflectionPost = ({ post, currentUserId }: AuraReflectionPostProps) => {
  return (
    <Card key={post.id} className="aura-reflection-post post-card overflow-hidden">
      <div className="aura-sigil-watermark"></div>
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-start space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.profiles?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-xs">
              {getInitials(post.profiles?.display_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-sm">
                    {post.profiles?.display_name || 'Aura'}
                    </p>
                    <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at))} ago
                    </span>
                </div>
                <Badge className="aura-reflection-badge">Aura Reflection</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <div className="prose prose-sm max-w-none text-foreground mb-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>
        </div>

        <PostInteractionButtons
          postId={post.id}
          initialLikeCount={0}
          initialCommentCount={0}
          postUserId={post.user_id}
          currentUserId={currentUserId}
        />

        <CommentSection postId={post.id} />
      </CardContent>
    </Card>
  );
};
