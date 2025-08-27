import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
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
  RefreshCw,
  Video,
  Search,
  PlayCircle,
  List
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useYouTubeAPI } from '@/hooks/useYouTubeAPI';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { YouTubeVideo, YouTubePlaylist } from '@/types/youtube';
import { SimpleVideoModal } from '@/components/YouTubeLibrary/SimpleVideoModal';
import { GroupMeditationSession } from '@/components/GroupMeditationSession';
import { MEDITATION_MODULE_CONFIG } from '@/config/mediaMaps';
import { Slogan } from '@/components/ui/Slogan';

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
  backgroundAudio?: YouTubeVideo;
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
  const { getChannelPlaylists, getPlaylistVideos, searchVideos, getVideosFromPlaylistByTitle, loading: youtubeLoading, error: youtubeError } = useYouTubeAPI();
  
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
  
  // YouTube integration state
  const [meditationPlaylists, setMeditationPlaylists] = useState<YouTubePlaylist[]>([]);
  const [meditationVideos, setMeditationVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBackgroundAudio, setSelectedBackgroundAudio] = useState<YouTubeVideo | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState([30]);
  const [channelId, setChannelId] = useState('');
  const [userPlaylists, setUserPlaylists] = useState<YouTubePlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [showChannelConfig, setShowChannelConfig] = useState(false);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);

  useEffect(() => {
    fetchActiveSessions();
    loadMeditationContent();
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

  const loadMeditationContent = async () => {
    try {
      setMeditationPlaylists([]); // No longer fetching a list of playlists
      const videosData = await getVideosFromPlaylistByTitle(MEDITATION_MODULE_CONFIG.playlistTitle, 25);
      setMeditationVideos(videosData.videos);
    } catch (error) {
      console.error('Error loading meditation content:', error);
      toast({
        title: "Error",
        description: "Could not load meditation videos. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleVideoPlay = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const loadChannelPlaylists = async (customChannelId?: string) => {
    try {
      const targetChannelId = customChannelId || channelId;
      if (!targetChannelId) return;
      
      const playlistsData = await getChannelPlaylists(targetChannelId);
      setUserPlaylists(playlistsData.playlists);
      
      toast({
        title: "Channel Connected",
        description: `Loaded ${playlistsData.playlists.length} playlists from your channel`,
      });
    } catch (error) {
      console.error('Error loading channel playlists:', error);
      toast({
        title: "Error",
        description: "Failed to load channel playlists. Please check the channel ID.",
        variant: "destructive",
      });
    }
  };

  const loadPlaylistVideos = async (playlistId: string) => {
    try {
      const videosData = await getPlaylistVideos(playlistId);
      setMeditationVideos(videosData.videos);
      
      toast({
        title: "Playlist Loaded",
        description: `Loaded ${videosData.videos.length} videos from your playlist`,
      });
    } catch (error) {
      console.error('Error loading playlist videos:', error);
      toast({
        title: "Error",
        description: "Failed to load playlist videos",
        variant: "destructive",
      });
    }
  };

  const startSoloMeditation = () => {
    const totalTime = duration[0] * 60; // Convert to seconds
    setTimeRemaining(totalTime);
    setSessionState('active');
    setSessionProgress(0);
    
    if (soundEnabled) {
      if (selectedBackgroundAudio) {
        startBackgroundAudio(selectedBackgroundAudio);
      } else {
        playMeditationSound('start');
      }
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
    
    // Stop background audio
    stopBackgroundAudio();
    
    if (soundEnabled) {
      playMeditationSound('stop');
    }

    toast({
      title: "Meditation Stopped",
      description: "Session ended early",
    });
  };

  const startBackgroundAudio = (video: YouTubeVideo) => {
    try {
      // Create iframe for YouTube audio
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`;
      iframe.style.display = 'none';
      iframe.allow = 'autoplay';
      document.body.appendChild(iframe);
      youtubePlayerRef.current = iframe;
      setIsAudioPlaying(true);
    } catch (error) {
      console.error('Error starting background audio:', error);
    }
  };

  const stopBackgroundAudio = () => {
    if (youtubePlayerRef.current) {
      document.body.removeChild(youtubePlayerRef.current);
      youtubePlayerRef.current = null;
    }
    setIsAudioPlaying(false);
  };

  const selectBackgroundAudio = (video: YouTubeVideo) => {
    setSelectedBackgroundAudio(video);
    toast({
      title: "Background Audio Selected",
      description: `${video.title} will play during your meditation`,
    });
  };

  const completeMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionState('completed');
    
    // Stop background audio
    stopBackgroundAudio();
    
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
        circleId: circles[0]?.id,
        backgroundAudio: selectedBackgroundAudio || undefined
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
  const joinedSession = activeSessions.find(s => s.id === joinedSessionId);

  return (
    <>
      {/* Group Session Interface Overlay */}
      {joinedSession && (
        <GroupMeditationSession
          sessionId={joinedSession.id}
          sessionType={joinedSession.type}
          duration={joinedSession.duration}
          backgroundAudio={joinedSession.backgroundAudio}
          onLeave={leaveGroupSession}
        />
      )}

      <Slogan variant="watermark" />
      <div className="h-full overflow-y-auto p-4 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sacred Meditation
            </h1>
            <p className="text-muted-foreground">
              Individual practice and collective consciousness expansion
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 animate-pulse">
            <Sparkles className="h-3 w-3" />
            Mindful Presence
          </Badge>
        </div>

        <Tabs defaultValue="solo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="solo" className="flex items-center gap-2 hover-scale">
              <Brain className="h-4 w-4" />
              Solo Practice
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2 hover-scale">
              <Users className="h-4 w-4" />
              Group Sessions
              {joinedSessionId && (
                <Badge variant="secondary" className="ml-1 text-xs animate-pulse">
                  Active
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="guided" className="flex items-center gap-2 hover-scale">
              <Video className="h-4 w-4" />
              Guided Videos
            </TabsTrigger>
          </TabsList>

          {/* Solo Meditation Tab */}
          <TabsContent value="solo" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Meditation Selection */}
              <Card className="lg:col-span-2 hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-primary" />
                    Choose Your Practice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {meditationTypes.map((type, index) => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md hover-scale ${
                          selectedType === type.id 
                            ? 'border-primary bg-primary/5 animate-scale-in' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedType(type.id)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl animate-pulse">{type.icon}</span>
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
                    <div className="space-y-4 animate-fade-in">
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

                      {/* Background Audio Selection */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Background Audio {selectedBackgroundAudio && "✓"}
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowChannelConfig(!showChannelConfig)}
                            className="hover-scale"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>

                        {showChannelConfig && (
                          <Card className="p-4 border-primary/20 animate-scale-in">
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Connect Your Channel</h4>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Enter your YouTube Channel ID"
                                  value={channelId}
                                  onChange={(e) => setChannelId(e.target.value)}
                                  className="flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => loadChannelPlaylists()}
                                  disabled={!channelId || youtubeLoading}
                                  className="hover-scale"
                                >
                                  Connect
                                </Button>
                              </div>
                              
                              {userPlaylists.length > 0 && (
                                <div className="space-y-2 animate-fade-in">
                                  <label className="text-xs font-medium">Select Playlist:</label>
                                  <select
                                    value={selectedPlaylist}
                                    onChange={(e) => {
                                      setSelectedPlaylist(e.target.value);
                                      if (e.target.value) {
                                        loadPlaylistVideos(e.target.value);
                                      }
                                    }}
                                    className="w-full p-2 border rounded text-sm hover-scale"
                                  >
                                    <option value="">Choose a playlist...</option>
                                    {userPlaylists.map((playlist) => (
                                      <option key={playlist.id} value={playlist.id}>
                                        {playlist.title} ({playlist.itemCount} videos)
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              
                              <p className="text-xs text-muted-foreground">
                                💡 Connect your channel to access your personal meditation playlists
                              </p>
                            </div>
                          </Card>
                        )}
                        
                        {selectedBackgroundAudio ? (
                          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 animate-scale-in">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium line-clamp-1">{selectedBackgroundAudio.title}</p>
                                <p className="text-xs text-muted-foreground">{selectedBackgroundAudio.duration}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedBackgroundAudio(null)}
                                className="hover-scale"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2">
                              {youtubeLoading ? (
                                <div className="text-center py-4">
                                  <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                                  <p className="text-xs text-muted-foreground mt-2">Loading tracks...</p>
                                </div>
                              ) : meditationVideos.length > 0 ? (
                                meditationVideos.map((video, index) => (
                                  <div
                                    key={video.id}
                                    className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors border border-transparent hover:border-primary/20 hover-scale animate-fade-in"
                                    onClick={() => selectBackgroundAudio(video)}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                  >
                                    <img
                                      src={video.thumbnail}
                                      alt={video.title}
                                      className="w-12 h-8 object-cover rounded flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium line-clamp-1">{video.title}</p>
                                      <p className="text-xs text-muted-foreground">{video.duration}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="px-2 hover-scale">
                                      Select
                                    </Button>
                                  </div>
                                ))
                              ) : youtubeError && meditationVideos.length === 0 ? (
                                <div className="text-center py-4">
                                  <Video className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                  <p className="text-xs text-muted-foreground">
                                    Failed to load tracks.
                                  </p>
                                   <Button onClick={loadMeditationContent} variant="link" size="sm">
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Retry
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <Video className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                  <p className="text-xs text-muted-foreground">
                                    No background tracks available.
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground">
                              💡 Select a track from the Sacred Shifter Journey Snippets playlist to accompany your meditation.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="hover-scale"
                          >
                            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                          </Button>
                          {soundEnabled && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs">Vol:</span>
                              <Slider
                                value={volume}
                                onValueChange={setVolume}
                                max={100}
                                min={0}
                                step={5}
                                className="w-16"
                              />
                            </div>
                          )}
                        </div>
                        {isAudioPlaying && selectedBackgroundAudio && (
                          <Badge variant="secondary" className="text-xs animate-pulse">
                            🎵 Playing
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Session Controls */}
              <Card className="hover-scale">
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
                      className="w-full hover-scale"
                      size="lg"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Meditation
                    </Button>
                  )}

                  {sessionState === 'active' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="text-center">
                        <div className="text-3xl font-mono font-bold text-primary animate-pulse">
                          {formatTime(timeRemaining)}
                        </div>
                        <Progress value={sessionProgress} className="mt-2" />
                        {selectedBackgroundAudio && isAudioPlaying && (
                          <div className="mt-2 p-2 bg-primary/5 rounded text-xs animate-fade-in">
                            🎵 {selectedBackgroundAudio.title}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={pauseMeditation} className="hover-scale">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                        <Button variant="destructive" onClick={stopMeditation} className="hover-scale">
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      </div>
                      {isAudioPlaying && (
                        <div className="flex items-center gap-2 text-xs">
                          <span>Audio Volume:</span>
                          <Slider
                            value={audioVolume}
                            onValueChange={setAudioVolume}
                            max={100}
                            min={0}
                            step={5}
                            className="flex-1"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {sessionState === 'paused' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="text-center">
                        <div className="text-3xl font-mono font-bold text-muted-foreground">
                          {formatTime(timeRemaining)}
                        </div>
                        <p className="text-sm text-muted-foreground">Paused</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={resumeMeditation} className="hover-scale">
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </Button>
                        <Button variant="destructive" onClick={stopMeditation} className="hover-scale">
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      </div>
                    </div>
                  )}

                  {sessionState === 'completed' && (
                    <div className="text-center space-y-3 animate-scale-in">
                      <div className="text-primary">
                        <Sparkles className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                        <p className="font-medium">Session Complete!</p>
                        <p className="text-sm text-muted-foreground">
                          Take a moment to notice how you feel
                        </p>
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full hover-scale" 
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
          <TabsContent value="group" className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Group Sessions</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchActiveSessions}
                className="hover-scale"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeSessions.map((session, index) => {
                const meditationType = meditationTypes.find(t => t.id === session.type);
                const isJoined = joinedSessionId === session.id;
                const startTime = new Date(session.startedAt);
                const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000 / 60);
                
                return (
                  <Card 
                    key={session.id} 
                    className={`${isJoined ? 'border-primary animate-pulse' : ''} hover-scale animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl animate-pulse">{meditationType?.icon}</span>
                          <div>
                            <h3 className="font-medium text-sm">{meditationType?.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {session.duration} minutes • {elapsed}m elapsed
                            </p>
                          </div>
                        </div>
                        {isJoined && (
                          <Badge variant="default" className="text-xs animate-pulse">
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
                            className="w-full hover-scale"
                            size="sm"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Join Session
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            onClick={leaveGroupSession}
                            className="w-full hover-scale"
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
                <div className="col-span-full text-center py-8 animate-fade-in">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-3 animate-pulse" />
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

          {/* Guided Videos Tab */}
          <TabsContent value="guided" className="space-y-4 animate-fade-in">
            {/* ... keep existing guided videos content ... */}
            <div className="space-y-4">
              <Card className="hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Guided Meditation Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {youtubeLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-4">
                            <div className="aspect-video bg-muted rounded mb-3" />
                            <div className="h-4 bg-muted rounded mb-2" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {meditationVideos.map((video, index) => (
                        <Card 
                          key={video.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow group hover-scale animate-fade-in"
                          onClick={() => handleVideoPlay(video)}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <CardContent className="p-4">
                            <div className="aspect-video mb-3 rounded overflow-hidden relative">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="h-12 w-12 text-white animate-scale-in" />
                              </div>
                            </div>
                            <h3 className="font-medium text-sm mb-2 line-clamp-2">{video.title}</h3>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{video.duration}</span>
                              <span>{parseInt(video.viewCount).toLocaleString()} views</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {youtubeError && meditationVideos.length === 0 && (
                    <div className="text-center py-8 animate-fade-in">
                      <Video className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">
                        Failed to load meditation videos.
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {youtubeError}
                      </p>
                      <Button onClick={loadMeditationContent}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  )}

                  {!youtubeLoading && !youtubeError && meditationVideos.length === 0 && (
                    <div className="text-center py-8 animate-fade-in">
                      <Video className="h-12 w-12 mx-auto text-muted-foreground mb-3 animate-pulse" />
                      <p className="text-muted-foreground">
                        No meditation videos found in the playlist.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Video Player Modal */}
        <SimpleVideoModal
          video={selectedVideo}
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false);
            setSelectedVideo(null);
          }}
          onWatchLater={() => {}}
          onFavorite={() => {}}
          userMetadata={undefined}
        />
      </div>
    </>
  );
}