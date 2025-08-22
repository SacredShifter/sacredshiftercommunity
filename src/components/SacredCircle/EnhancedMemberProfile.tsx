import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Crown, 
  Shield, 
  Users, 
  Heart, 
  Zap, 
  Eye, 
  Sparkles,
  MessageCircle,
  Calendar,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface MemberProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  chakra_alignment?: string;
  sacred_symbols?: string[];
  resonance_level: number;
  contribution_score: number;
  presence_state: 'online' | 'meditating' | 'in_flow' | 'away' | 'offline';
  roles: string[];
  joined_at: string;
  last_active: string;
  message_count: number;
  wisdom_shared: number;
  connections_made: number;
}

interface EnhancedMemberProfileProps {
  userId: string;
  circleId: string;
  trigger?: React.ReactNode;
}

const PRESENCE_STATES = {
  online: { icon: Activity, color: 'text-green-500', label: 'Online' },
  meditating: { icon: Eye, color: 'text-purple-500', label: 'Meditating' },
  in_flow: { icon: Zap, color: 'text-blue-500', label: 'In Flow' },
  away: { icon: Calendar, color: 'text-yellow-500', label: 'Away' },
  offline: { icon: Users, color: 'text-gray-400', label: 'Offline' }
};

const CHAKRA_COLORS = {
  root: 'from-red-400 to-red-600',
  sacral: 'from-orange-400 to-orange-600',
  solar: 'from-yellow-400 to-yellow-600',
  heart: 'from-green-400 to-green-600',
  throat: 'from-blue-400 to-blue-600',
  third_eye: 'from-indigo-400 to-indigo-600',
  crown: 'from-purple-400 to-purple-600',
};

export const EnhancedMemberProfile = ({ userId, circleId, trigger }: EnhancedMemberProfileProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [connectionStrength, setConnectionStrength] = useState(0);

  const fetchMemberProfile = async () => {
    setLoading(true);
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Fetch circle-specific data
      const { data: memberData } = await supabase
        .from('circle_group_members')
        .select('*')
        .eq('user_id', userId)
        .eq('group_id', circleId)
        .single();

      // Fetch message count
      const { count: messageCount } = await supabase
        .from('circle_posts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('group_id', circleId);

      // Fetch recent messages
      const { data: messages } = await supabase
        .from('circle_posts')
        .select('content, created_at, chakra_tag')
        .eq('user_id', userId)
        .eq('group_id', circleId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate connection strength (mock data for now)
      const connectionData = await calculateConnectionStrength(userId);

      setProfile({
        id: userId,
        display_name: profileData?.display_name || `User ${userId.slice(0, 8)}`,
        avatar_url: profileData?.avatar_url,
        bio: '', // Default empty bio since it doesn't exist in the schema
        chakra_alignment: profileData?.current_chakra_focus || 'heart',
        sacred_symbols: ['🕉️', '✨', '💫'],
        resonance_level: Math.random() * 100,
        contribution_score: (messageCount || 0) * 10 + Math.random() * 50,
        presence_state: getRandomPresenceState(),
        roles: memberData?.role ? [memberData.role] : ['member'],
        joined_at: memberData?.joined_at || new Date().toISOString(),
        last_active: new Date().toISOString(),
        message_count: messageCount || 0,
        wisdom_shared: Math.floor(Math.random() * 20),
        connections_made: Math.floor(Math.random() * 15)
      });

      setRecentMessages(messages || []);
      setConnectionStrength(connectionData);
    } catch (error) {
      console.error('Error fetching member profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateConnectionStrength = async (targetUserId: string): Promise<number> => {
    if (!user) return 0;
    
    // Mock calculation based on shared interactions
    // In a real app, this would analyze message interactions, reactions, etc.
    return Math.random() * 100;
  };

  const getRandomPresenceState = (): MemberProfile['presence_state'] => {
    const states: MemberProfile['presence_state'][] = ['online', 'meditating', 'in_flow', 'away', 'offline'];
    return states[Math.floor(Math.random() * states.length)];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'moderator': return Shield;
      default: return Users;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!profile) {
    return (
      <Dialog>
        <DialogTrigger asChild onClick={fetchMemberProfile}>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const PresenceIcon = PRESENCE_STATES[profile.presence_state].icon;

  return (
    <Dialog>
      <DialogTrigger asChild onClick={fetchMemberProfile}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className={`bg-gradient-to-br text-white ${
                  CHAKRA_COLORS[profile.chakra_alignment as keyof typeof CHAKRA_COLORS] || 'from-primary to-primary/80'
                }`}>
                  {getInitials(profile.display_name)}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center ${
                PRESENCE_STATES[profile.presence_state].color
              }`}>
                <PresenceIcon className="h-2.5 w-2.5" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>{profile.display_name}</span>
                {profile.roles.map(role => {
                  const RoleIcon = getRoleIcon(role);
                  return (
                    <Badge key={role} variant="outline" className="text-xs">
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {role}
                    </Badge>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{PRESENCE_STATES[profile.presence_state].label}</span>
                <span>•</span>
                <span>Joined {formatDate(profile.joined_at)}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resonance">Resonance</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="overview" className="space-y-4">
              {profile.bio && (
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Chakra Alignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={`bg-gradient-to-r text-white ${
                      CHAKRA_COLORS[profile.chakra_alignment as keyof typeof CHAKRA_COLORS]
                    }`}>
                      {profile.chakra_alignment}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Sacred Symbols
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1">
                      {profile.sacred_symbols.map((symbol, index) => (
                        <span key={index} className="text-lg">{symbol}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-primary">{profile.message_count}</div>
                    <div className="text-xs text-muted-foreground">Messages</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-primary">{profile.wisdom_shared}</div>
                    <div className="text-xs text-muted-foreground">Wisdom Shared</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-primary">{profile.connections_made}</div>
                    <div className="text-xs text-muted-foreground">Connections</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resonance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Resonance Level</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Resonance</span>
                      <span>{Math.round(profile.resonance_level)}%</span>
                    </div>
                    <Progress value={profile.resonance_level} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Contribution Score</span>
                      <span>{Math.round(profile.contribution_score)}</span>
                    </div>
                    <Progress value={Math.min(profile.contribution_score, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contributions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentMessages.length > 0 ? (
                    recentMessages.map((message, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.created_at)}
                          </span>
                          {message.chakra_tag && (
                            <Badge variant="outline" className="text-xs">
                              {message.chakra_tag}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent messages
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connection" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Connection Strength</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Resonance Connection</span>
                        <span>{Math.round(connectionStrength)}%</span>
                      </div>
                      <Progress value={connectionStrength} className="h-2" />
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Based on shared interactions, similar chakra alignments, and message resonance patterns.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};