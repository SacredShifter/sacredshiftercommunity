import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Users, 
  Heart, 
  Sparkles,
  MessageCircle,
  Share2,
  RotateCcw,
  Timer,
  Music
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { YouTubeVideo } from '@/types/youtube';

interface GroupMeditationSessionProps {
  sessionId: string;
  sessionType: string;
  duration: number;
  backgroundAudio?: YouTubeVideo;
  onLeave: () => void;
}

interface Participant {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  joined_at: string;
  status: 'meditating' | 'listening' | 'away';
  heart_rate?: number;
}

interface SessionState {
  is_playing: boolean;
  current_time: number;
  volume: number;
  synchronized_start?: string;
}

export function GroupMeditationSession({ 
  sessionId, 
  sessionType, 
  duration, 
  backgroundAudio,
  onLeave 
}: GroupMeditationSessionProps) {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessionState, setSessionState] = useState<SessionState>({
    is_playing: false,
    current_time: 0,
    volume: 50
  });
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isHost, setIsHost] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const channelRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;

    // Create realtime channel for session
    const channel = supabase.channel(`meditation_session_${sessionId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track user presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const currentParticipants: Participant[] = [];
        
        Object.entries(presenceState).forEach(([userId, presences]: [string, any]) => {
          if (presences && presences.length > 0) {
            const presence = presences[0];
            currentParticipants.push({
              id: userId,
              user_id: userId,
              name: presence.name || 'Anonymous',
              avatar_url: presence.avatar_url,
              joined_at: presence.joined_at,
              status: presence.status || 'meditating'
            });
          }
        });
        
        setParticipants(currentParticipants);
        
        // Determine if current user is host (first to join)
        const sortedParticipants = currentParticipants.sort((a, b) => 
          new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
        );
        setIsHost(sortedParticipants[0]?.user_id === user.id);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .on('broadcast', { event: 'session_state' }, ({ payload }) => {
        setSessionState(payload);
        if (payload.synchronized_start) {
          synchronizeTimer(payload.synchronized_start);
        }
      })
      .on('broadcast', { event: 'chat_message' }, ({ payload }) => {
        setChatMessages(prev => [...prev, payload]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user presence
          await channel.track({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
            avatar_url: user.user_metadata?.avatar_url,
            joined_at: new Date().toISOString(),
            status: 'meditating'
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [user, sessionId]);

  const synchronizeTimer = (startTime: string) => {
    const elapsed = (Date.now() - new Date(startTime).getTime()) / 1000;
    const remaining = Math.max(0, duration * 60 - elapsed);
    setTimeRemaining(remaining);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (remaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0) {
            clearInterval(timerRef.current!);
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const broadcastSessionState = (newState: Partial<SessionState>) => {
    const updatedState = { ...sessionState, ...newState };
    setSessionState(updatedState);
    
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'session_state',
        payload: updatedState
      });
    }
  };

  const startSession = () => {
    const startTime = new Date().toISOString();
    broadcastSessionState({ 
      is_playing: true, 
      synchronized_start: startTime 
    });
    synchronizeTimer(startTime);
  };

  const pauseSession = () => {
    broadcastSessionState({ is_playing: false });
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const adjustVolume = (newVolume: number[]) => {
    broadcastSessionState({ volume: newVolume[0] });
  };

  const sendHeartbeat = () => {
    if (channelRef.current && user) {
      channelRef.current.track({
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        avatar_url: user.user_metadata?.avatar_url,
        joined_at: new Date().toISOString(),
        status: 'meditating',
        heart_rate: Math.floor(Math.random() * 20) + 60 // Simulated heart rate
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-4xl h-full max-h-[90vh] overflow-hidden animate-scale-in">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Group Meditation Session</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {sessionType.replace('-', ' ')} • {duration} minutes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {participants.length}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onLeave}>
                Leave Session
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            
            {/* Main Session Area */}
            <div className="lg:col-span-2 p-6 space-y-6">
              
              {/* Timer and Progress */}
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="text-4xl font-bold text-primary animate-pulse">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {sessionState.is_playing ? 'Session in progress' : 'Paused'}
                  </p>
                </div>
                
                <Progress value={progress} className="h-2 animate-pulse" />
              </div>

              {/* Music Player */}
              {backgroundAudio && (
                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={backgroundAudio.thumbnail} 
                        alt={backgroundAudio.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-1">{backgroundAudio.title}</h4>
                        <p className="text-sm text-muted-foreground">Background Audio</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{sessionState.volume}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <VolumeX className="h-4 w-4" />
                        <Slider
                          value={[sessionState.volume]}
                          onValueChange={adjustVolume}
                          max={100}
                          step={1}
                          className="w-20"
                          disabled={!isHost}
                        />
                        <Volume2 className="h-4 w-4" />
                      </div>
                      
                      {isHost && (
                        <div className="flex gap-2">
                          {sessionState.is_playing ? (
                            <Button size="sm" onClick={pauseSession} variant="outline">
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button size="sm" onClick={startSession}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Host Controls */}
              {isHost && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      Host Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    {!sessionState.is_playing ? (
                      <Button onClick={startSession} className="hover-scale">
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    ) : (
                      <Button onClick={pauseSession} variant="outline" className="hover-scale">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Session
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setTimeRemaining(duration * 60)} className="hover-scale">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Timer
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Breathing Guide */}
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="animate-pulse">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 animate-[pulse_4s_ease-in-out_infinite]" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Breathe in harmony with the group
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Participants Sidebar */}
            <div className="border-l bg-muted/20 p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participants ({participants.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors animate-fade-in"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar_url} />
                      <AvatarFallback>
                        {participant.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {participant.name}
                        {participant.user_id === user?.id && ' (You)'}
                        {isHost && participant.user_id !== user?.id && ' 👑'}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          participant.status === 'meditating' ? 'bg-green-500' :
                          participant.status === 'listening' ? 'bg-blue-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-xs text-muted-foreground capitalize">
                          {participant.status}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={sendHeartbeat}
                      className="p-1 hover-scale"
                    >
                      <Heart className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              {participants.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Waiting for participants to join...
                </p>
              )}

              {/* Quick Actions */}
              <div className="space-y-2 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover-scale"
                  onClick={() => navigator.share?.({ 
                    title: 'Join our meditation session',
                    url: window.location.href 
                  })}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Invite Others
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}