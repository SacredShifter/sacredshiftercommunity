import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Square, 
  Users, 
  Clock, 
  Sparkles, 
  Heart, 
  Brain, 
  Moon, 
  Sun, 
  Volume2,
  VolumeX,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';
type SessionState = 'idle' | 'active' | 'paused' | 'completed';

interface MeditationSession {
  id: string;
  type: MeditationType;
  duration: number;
  participantCount: number;
  startedAt: string;
  isActive: boolean;
  circleId?: string;
}

const meditationTypes = [
  {
    id: 'breathing' as MeditationType,
    name: 'Breath Awareness',
    description: 'Focus on the natural rhythm of your breath',
    icon: '🌬️',
    defaultDuration: 10,
    guidance: 'Breathe naturally and observe each inhale and exhale'
  },
  {
    id: 'loving-kindness' as MeditationType,
    name: 'Loving Kindness',
    description: 'Cultivate compassion and love for all beings',
    icon: '💕',
    defaultDuration: 15,
    guidance: 'Send loving thoughts to yourself, loved ones, and all beings'
  },
  {
    id: 'chakra' as MeditationType,
    name: 'Chakra Alignment',
    description: 'Balance and harmonize your energy centers',
    icon: '🌈',
    defaultDuration: 20,
    guidance: 'Visualize each chakra spinning with vibrant healing light'
  },
  {
    id: 'mindfulness' as MeditationType,
    name: 'Mindful Presence',
    description: 'Cultivate present moment awareness',
    icon: '🧘',
    defaultDuration: 12,
    guidance: 'Notice thoughts and sensations without judgment'
  },
  {
    id: 'body-scan' as MeditationType,
    name: 'Body Scan',
    description: 'Progressive relaxation through body awareness',
    icon: '✨',
    defaultDuration: 18,
    guidance: 'Systematically relax each part of your body'
  }
];

export default function Meditation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { circles, loading: circlesLoading } = useSacredCircles();
  
  // Solo meditation state
  const [selectedType, setSelectedType] = useState<MeditationType>('breathing');
  const [duration, setDuration] = useState([10]);
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([70]);
  
  // Group meditation state
  const [activeSessions, setActiveSessions] = useState<MeditationSession[]>([]);
  const [joinedSessionId, setJoinedSessionId] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchActiveSessions();
    const interval = setInterval(fetchActiveSessions, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const fetchActiveSessions = async () => {
    try {
      // Mock data for now - would fetch from Supabase in real app
      setActiveSessions([
        {
          id: '1',
          type: 'breathing',
          duration: 15,
          participantCount: 3,
          startedAt: new Date().toISOString(),
          isActive: true,
          circleId: circles[0]?.id
        },
        {
          id: '2',
          type: 'loving-kindness',
          duration: 20,
          participantCount: 7,
          startedAt: new Date(Date.now() - 600000).toISOString(),
          isActive: true,
          circleId: circles[1]?.id
        }
      ]);
    } catch (error) {
      console.error('Error fetching meditation sessions:', error);
    }
  };

  const startSoloMeditation = () => {
    const totalTime = duration[0] * 60; // Convert to seconds
    setTimeRemaining(totalTime);
    setSessionState('active');
    setSessionProgress(0);
    
    if (soundEnabled) {
      playMeditationSound('start');
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        const progress = ((totalTime - newTime) / totalTime) * 100;
        setSessionProgress(progress);
        
        if (newTime <= 0) {
          completeMeditation();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    toast({
      title: "Meditation Started",
      description: `Beginning ${meditationTypes.find(t => t.id === selectedType)?.name} session`,
    });
  };

  const pauseMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionState('paused');
    
    if (soundEnabled) {
      playMeditationSound('pause');
    }
  };

  const resumeMeditation = () => {
    setSessionState('active');
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        const totalTime = duration[0] * 60;
        const progress = ((totalTime - newTime) / totalTime) * 100;
        setSessionProgress(progress);
        
        if (newTime <= 0) {
          completeMeditation();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const stopMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionState('idle');
    setTimeRemaining(0);
    setSessionProgress(0);
    
    if (soundEnabled) {
      playMeditationSound('stop');
    }

    toast({
      title: "Meditation Stopped",
      description: "Session ended early",
    });
  };

  const completeMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionState('completed');
    
    if (soundEnabled) {
      playMeditationSound('complete');
    }

    toast({
      title: "Meditation Complete! 🧘",
      description: "Well done! You've completed your session.",
    });

    // Auto-reset after 5 seconds
    setTimeout(() => {
      setSessionState('idle');
      setSessionProgress(0);
    }, 5000);
  };

  const playMeditationSound = (type: 'start' | 'pause' | 'stop' | 'complete') => {
    // In a real app, you'd play different sounds for different events
    // For now, we'll just log the sound type
    console.log(`Playing ${type} sound`);
  };

  const createGroupSession = async () => {
    setIsCreatingSession(true);
    try {
      // In real app, would create session in Supabase
      const newSession: MeditationSession = {
        id: Date.now().toString(),
        type: selectedType,
        duration: duration[0],
        participantCount: 1,
        startedAt: new Date().toISOString(),
        isActive: true,
        circleId: circles[0]?.id
      };

      setActiveSessions(prev => [...prev, newSession]);
      setJoinedSessionId(newSession.id);

      toast({
        title: "Group Session Created",
        description: "Other circle members can now join your meditation",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group session",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const joinGroupSession = async (sessionId: string) => {
    try {
      setJoinedSessionId(sessionId);
      
      // Update participant count
      setActiveSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, participantCount: session.participantCount + 1 }
            : session
        )
      );

      toast({
        title: "Joined Group Session",
        description: "You've joined the collective meditation",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join session",
        variant: "destructive",
      });
    }
  };

  const leaveGroupSession = () => {
    if (joinedSessionId) {
      setActiveSessions(prev => 
        prev.map(session => 
          session.id === joinedSessionId 
            ? { ...session, participantCount: Math.max(0, session.participantCount - 1) }
            : session
        )
      );
      setJoinedSessionId(null);

      toast({
        title: "Left Group Session",
        description: "You've left the collective meditation",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedMeditation = meditationTypes.find(t => t.id === selectedType);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sacred Meditation
          </h1>
          <p className="text-muted-foreground">
            Individual practice and collective consciousness expansion
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Mindful Presence
        </Badge>
      </div>

      <Tabs defaultValue="solo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solo" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Solo Practice
          </TabsTrigger>
          <TabsTrigger value="group" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Group Sessions
          </TabsTrigger>
        </TabsList>

        {/* Solo Meditation Tab */}
        <TabsContent value="solo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Meditation Selection */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-primary" />
                  Choose Your Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {meditationTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedType === type.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{type.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{type.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {type.description}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {type.defaultDuration} min
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedMeditation && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Guidance:</strong> {selectedMeditation.guidance}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration: {duration[0]} minutes</label>
                      <Slider
                        value={duration}
                        onValueChange={setDuration}
                        max={60}
                        min={3}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSoundEnabled(!soundEnabled)}
                        >
                          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                        {soundEnabled && (
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            min={0}
                            step={5}
                            className="w-20"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Session Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessionState === 'idle' && (
                  <Button 
                    onClick={startSoloMeditation} 
                    className="w-full"
                    size="lg"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Meditation
                  </Button>
                )}

                {sessionState === 'active' && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-primary">
                        {formatTime(timeRemaining)}
                      </div>
                      <Progress value={sessionProgress} className="mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={pauseMeditation}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button variant="destructive" onClick={stopMeditation}>
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    </div>
                  </div>
                )}

                {sessionState === 'paused' && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-muted-foreground">
                        {formatTime(timeRemaining)}
                      </div>
                      <p className="text-sm text-muted-foreground">Paused</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={resumeMeditation}>
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                      <Button variant="destructive" onClick={stopMeditation}>
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    </div>
                  </div>
                )}

                {sessionState === 'completed' && (
                  <div className="text-center space-y-3">
                    <div className="text-primary">
                      <Sparkles className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-medium">Session Complete!</p>
                      <p className="text-sm text-muted-foreground">
                        Take a moment to notice how you feel
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={createGroupSession}
                  disabled={isCreatingSession}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isCreatingSession ? 'Creating...' : 'Create Group Session'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Group Sessions Tab */}
        <TabsContent value="group" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Group Sessions</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchActiveSessions}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeSessions.map((session) => {
              const meditationType = meditationTypes.find(t => t.id === session.type);
              const isJoined = joinedSessionId === session.id;
              const startTime = new Date(session.startedAt);
              const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000 / 60);
              
              return (
                <Card key={session.id} className={`${isJoined ? 'border-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{meditationType?.icon}</span>
                        <div>
                          <h3 className="font-medium text-sm">{meditationType?.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {session.duration} minutes • {elapsed}m elapsed
                          </p>
                        </div>
                      </div>
                      {isJoined && (
                        <Badge variant="default" className="text-xs">
                          Joined
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {session.participantCount} meditating
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {session.duration - elapsed}m remaining
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Progress 
                        value={(elapsed / session.duration) * 100} 
                        className="h-2"
                      />
                      {!isJoined ? (
                        <Button 
                          onClick={() => joinGroupSession(session.id)}
                          className="w-full"
                          size="sm"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      ) : (
                        <Button 
                          variant="outline"
                          onClick={leaveGroupSession}
                          className="w-full"
                          size="sm"
                        >
                          Leave Session
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {activeSessions.length === 0 && (
              <div className="col-span-full text-center py-8">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No active group sessions right now
                </p>
                <p className="text-sm text-muted-foreground">
                  Create one from the Solo Practice tab to invite others
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}