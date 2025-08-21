import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTourContext } from "@/components/TourProvider";
import { LANDING_PAGE_TOUR } from "@/configs/tours";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";
import { SacredGrove } from "@/components/SacredGrove/SacredGrove";
import { 
  Home, Users, User, Rss, Settings, LogOut, BookOpen, Video, 
  Database, Archive, Scroll, Heart, Sparkles, Crown, Zap, Map 
} from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { startTour, isTourCompleted } = useTourContext();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSacredGrove, setShowSacredGrove] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkFirstVisit = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (!profile?.onboarding_completed) {
          setIsFirstVisit(true);
          setShowOnboarding(true);
        } else {
          setOnboardingCompleted(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // If there's an error fetching profile, assume user needs onboarding
        setIsFirstVisit(true);
        setShowOnboarding(true);
      }
    };

    checkFirstVisit();
  }, [user]);

  // Auto-start tour for returning users (after onboarding)
  useEffect(() => {
    if (user && !isTourCompleted('landing-page-tour') && !showOnboarding && onboardingCompleted) {
      // Small delay to ensure elements are rendered
      const timer = setTimeout(() => {
        startTour(LANDING_PAGE_TOUR);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, showOnboarding, onboardingCompleted, isTourCompleted, startTour]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setOnboardingCompleted(true);
  };

  // Reset onboarding for testing (only in development)
  const resetOnboarding = async () => {
    if (!user) return;
    try {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: false })
        .eq('id', user.id);
      
      setShowOnboarding(true);
      setOnboardingCompleted(false);
      
      console.log('Onboarding reset successfully');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  const sacredSections = [
    {
      title: "Sacred Grove",
      description: "Enter the foundational consciousness transformation experience",
      icon: Crown,
      action: () => setShowSacredGrove(true),
      gradient: "from-yellow-500/20 to-amber-500/20",
      glowColor: "yellow",
      cta: "Enter the Living Wisdom Portal",
      pulseColor: "45 93% 47%" // sacred gold
    },
    {
      title: "Sacred Feed",
      description: "Your personalized stream of consciousness transformation content",
      icon: Rss,
      path: "/feed",
      gradient: "from-violet-500/20 to-purple-500/20",
      glowColor: "violet",
      cta: "Feed the Flame Within",
      pulseColor: "269 69% 58%" // electric violet
    },
    {
      title: "Sacred Circles",
      description: "Connect with fellow seekers in transformative group experiences",
      icon: Users,
      path: "/circles",
      gradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "blue",
      cta: "Step Into the Shared Field",
      pulseColor: "196 83% 60%" // alignment aqua
    },
    {
      title: "Mirror Journal",
      description: "Reflect, record, and analyze your inner journey",
      icon: BookOpen,
      path: "/journal",
      gradient: "from-emerald-500/20 to-green-500/20",
      glowColor: "emerald",
      cta: "Witness Your Soul Unfold",
      pulseColor: "143 25% 86%" // truth light
    },
    {
      title: "Resonance Register",
      description: "Document meaningful synchronicities and spiritual experiences",
      icon: Database,
      path: "/registry",
      gradient: "from-amber-500/20 to-orange-500/20",
      glowColor: "amber",
      cta: "Anchor the Synchronicities",
      pulseColor: "60 100% 50%" // pulse yellow
    },
    {
      title: "Personal Codex",
      description: "Your private collection of wisdom, insights, and revelations",
      icon: Archive,
      path: "/codex",
      gradient: "from-pink-500/20 to-rose-500/20",
      glowColor: "pink",
      cta: "Chronicle Your Sacred Knowing",
      pulseColor: "324 78% 54%" // purpose magenta
    },
    {
      title: "YouTube Library",
      description: "Curated video content for consciousness expansion",
      icon: Video,
      path: "/videos",
      gradient: "from-red-500/20 to-orange-500/20",
      glowColor: "red",
      cta: "Receive Vision Through Sound & Story",
      pulseColor: "14 100% 57%" // warm orange
    },
    {
      title: "Sacred Shifter Guidebook",
      description: "Ancient wisdom for modern transformation",
      icon: Scroll,
      path: "/guidebook",
      gradient: "from-indigo-500/20 to-blue-500/20",
      glowColor: "indigo",
      cta: "Walk the Path of Living Wisdom",
      pulseColor: "257 65% 70%" // deep indigo light
    },
    {
      title: "Consciousness Constellation",
      description: "Map the cosmic connections between your experiences",
      icon: Map,
      path: "/constellation",
      gradient: "from-purple-500/20 to-indigo-500/20",
      glowColor: "purple",
      cta: "Chart Your Soul's Stellar Map",
      pulseColor: "280 100% 70%" // cosmic purple
    },
    {
      title: "Support Sacred Shifter",
      description: "Fuel the frequency with donations and premium modules",
      icon: Heart,
      path: "/support",
      gradient: "from-rose-500/20 to-pink-500/20",
      glowColor: "rose",
      cta: "Fuel the Frequency of Truth",
      pulseColor: "350 100% 60%" // rose pulse
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };


  return (
    <>
      <OnboardingFlow 
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
      
      <div className="h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png" 
                  alt="Sacred Shifter" 
                  className="h-24 w-auto filter invert brightness-0 contrast-100 opacity-90"
                  data-tour="sacred-shifter-logo"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl animate-pulse" />
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground mb-2">
              Your consciousness transformation toolkit
            </p>
            <p className="text-sm text-muted-foreground">
              Signed in as: <span className="font-medium text-foreground">{user?.email}</span>
            </p>
          </div>

          {/* Sacred Shiftery Tiles */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            data-tour="frequency-tiles"
          >
            {sacredSections.map((section, index) => {
              // Generate unique geometric pattern for each module
              const getGeometricPattern = (sectionIndex: number) => {
                const patterns = {
                  0: ( // Sacred Grove - Crown/Tree pattern
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="grove-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                          <polygon points="15,2 10,12 20,12" fill="currentColor" />
                          <rect x="13" y="12" width="4" height="8" fill="currentColor" />
                          <polygon points="5,25 15,15 25,25" fill="currentColor" />
                          <circle cx="8" cy="8" r="2" fill="currentColor" />
                          <circle cx="22" cy="8" r="2" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#grove-pattern)" />
                    </svg>
                  ),
                  1: ( // Sacred Feed - Flowing stream pattern
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="feed-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="8" height="4" fill="currentColor" />
                          <rect x="10" y="6" width="8" height="4" fill="currentColor" />
                          <rect x="2" y="12" width="8" height="4" fill="currentColor" />
                          <rect x="12" y="18" width="6" height="2" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#feed-pattern)" />
                    </svg>
                  ),
                  2: ( // Sacred Circles - Circular connected pattern
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="circles-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                          <circle cx="5" cy="5" r="3" fill="currentColor" />
                          <circle cx="15" cy="5" r="3" fill="currentColor" />
                          <circle cx="5" cy="15" r="3" fill="currentColor" />
                          <circle cx="15" cy="15" r="3" fill="currentColor" />
                          <rect x="8" y="0" width="2" height="25" fill="currentColor" />
                          <rect x="0" y="8" width="25" height="2" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#circles-pattern)" />
                    </svg>
                  ),
                  3: ( // Mirror Journal - Reflective chevron pattern
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="journal-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                          <polygon points="0,0 8,8 0,16" fill="currentColor" />
                          <polygon points="16,0 8,8 16,16" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#journal-pattern)" />
                    </svg>
                  ),
                  4: ( // Resonance Register - Synchronized grid pattern
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="register-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="6" height="6" fill="currentColor" />
                          <rect x="8" y="0" width="6" height="6" fill="currentColor" />
                          <rect x="16" y="0" width="4" height="6" fill="currentColor" />
                          <rect x="0" y="8" width="6" height="6" fill="currentColor" />
                          <rect x="8" y="8" width="6" height="6" fill="currentColor" />
                          <rect x="16" y="8" width="4" height="6" fill="currentColor" />
                          <rect x="0" y="16" width="6" height="4" fill="currentColor" />
                          <rect x="8" y="16" width="6" height="4" fill="currentColor" />
                          <rect x="16" y="16" width="4" height="4" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#register-pattern)" />
                    </svg>
                  ),
                  5: ( // Personal Codex - Ancient manuscript pattern
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="codex-pattern" x="0" y="0" width="24" height="12" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="10" height="4" fill="currentColor" />
                          <rect x="12" y="0" width="10" height="4" fill="currentColor" />
                          <rect x="2" y="6" width="8" height="4" fill="currentColor" />
                          <rect x="14" y="6" width="8" height="4" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#codex-pattern)" />
                    </svg>
                  ),
                  6: ( // YouTube Library - Video tile mosaic
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="video-pattern" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="8" height="8" fill="currentColor" />
                          <rect x="10" y="0" width="8" height="4" fill="currentColor" />
                          <rect x="10" y="6" width="8" height="4" fill="currentColor" />
                          <rect x="0" y="10" width="4" height="8" fill="currentColor" />
                          <rect x="6" y="10" width="4" height="8" fill="currentColor" />
                          <rect x="12" y="12" width="6" height="6" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#video-pattern)" />
                    </svg>
                  ),
                  7: ( // Sacred Guidebook - Ancient scroll pattern
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="guidebook-pattern" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="20" height="3" fill="currentColor" />
                          <rect x="0" y="5" width="15" height="3" fill="currentColor" />
                          <rect x="0" y="10" width="18" height="3" fill="currentColor" />
                          <rect x="0" y="15" width="12" height="3" fill="currentColor" />
                          <rect x="0" y="20" width="16" height="2" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#guidebook-pattern)" />
                    </svg>
                  ),
                  8: ( // Consciousness Constellation - Star map pattern
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="constellation-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                          <circle cx="5" cy="5" r="2" fill="currentColor" />
                          <circle cx="20" cy="8" r="1.5" fill="currentColor" />
                          <circle cx="12" cy="15" r="2.5" fill="currentColor" />
                          <circle cx="25" cy="20" r="1" fill="currentColor" />
                          <circle cx="8" cy="25" r="1.5" fill="currentColor" />
                          <line x1="5" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="0.5" />
                          <line x1="12" y1="15" x2="20" y2="8" stroke="currentColor" strokeWidth="0.5" />
                          <line x1="20" y1="8" x2="25" y2="20" stroke="currentColor" strokeWidth="0.5" />
                          <line x1="12" y1="15" x2="8" y2="25" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#constellation-pattern)" />
                    </svg>
                  ),
                  9: ( // Support - Heart frequency pattern
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="support-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <rect x="0" y="4" width="4" height="4" fill="currentColor" />
                          <rect x="6" y="2" width="4" height="8" fill="currentColor" />
                          <rect x="12" y="0" width="4" height="12" fill="currentColor" />
                          <rect x="18" y="6" width="2" height="6" fill="currentColor" />
                          <rect x="0" y="16" width="20" height="2" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#support-pattern)" />
                    </svg>
                  )
                };
                return patterns[sectionIndex] || patterns[0];
              };

              return (
                <Card 
                  key={section.path || section.title}
                  onClick={() => section.action ? section.action() : navigate(section.path)}
                  className={`group relative overflow-hidden bg-gradient-to-br ${section.gradient} 
                            backdrop-blur-sm border-primary/20 hover:border-primary/40 
                            transition-all duration-300 hover:scale-105 hover:shadow-2xl 
                            hover:shadow-${section.glowColor}-500/20 cursor-pointer
                            animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-sm" />
                  
                  {/* Geometric Pattern */}
                  <div className="absolute inset-0 text-primary/40 group-hover:text-primary/60 transition-colors duration-300">
                    {getGeometricPattern(index)}
                  </div>
                  
                  <CardContent className="relative p-6 h-full flex flex-col z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 
                                     group-hover:from-primary/30 group-hover:to-primary/20 
                                     transition-all duration-300`}>
                        <section.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <Zap className="h-4 w-4 text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                      {section.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-primary/10">
                      <span 
                        className="text-xs group-hover:text-primary transition-colors duration-300 resonance-flow text-center block font-medium"
                      >
                        → {section.cta}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="bg-background/60 backdrop-blur-lg border-primary/30 shadow-xl shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-center text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  onClick={() => navigate('/profile')}
                  variant="outline"
                  className="border-primary/20 hover:border-primary/50"
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                
                <Button 
                  onClick={() => navigate('/settings')}
                  variant="outline"
                  className="border-primary/20 hover:border-primary/50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-destructive/20 hover:border-destructive/50 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>

                {/* Development Controls */}
                {process.env.NODE_ENV === 'development' && (
                  <Button 
                    onClick={resetOnboarding}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Reset Onboarding
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sacred Grove Modal */}
      <SacredGrove 
        isVisible={showSacredGrove}
        onClose={() => setShowSacredGrove(false)}
      />
    </>
  );
};

export default Index;
