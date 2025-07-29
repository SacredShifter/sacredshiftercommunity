import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Home, Users, User, Rss, Settings, LogOut, BookOpen, Video, 
  Database, Archive, Scroll, Heart, Sparkles, Crown, Zap 
} from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const checkFirstVisit = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_visit_shown')
          .eq('id', user.id)
          .single();

        if (!profile?.first_visit_shown) {
          setIsFirstVisit(true);
          setShowWelcome(true);
          
          // Mark as visited
          await supabase
            .from('profiles')
            .update({ first_visit_shown: true })
            .eq('id', user.id);
        }
      } catch (error) {
        console.error('Error checking first visit:', error);
      }
    };

    checkFirstVisit();
  }, [user]);

  const sacredSections = [
    {
      title: "Sacred Feed",
      description: "Your personalized stream of consciousness transformation content",
      icon: Rss,
      path: "/feed",
      gradient: "from-violet-500/20 to-purple-500/20",
      glowColor: "violet"
    },
    {
      title: "Sacred Circles",
      description: "Connect with fellow seekers in transformative group experiences",
      icon: Users,
      path: "/circles",
      gradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "blue"
    },
    {
      title: "Mirror Journal",
      description: "Reflect, record, and analyze your inner journey",
      icon: BookOpen,
      path: "/journal",
      gradient: "from-emerald-500/20 to-green-500/20",
      glowColor: "emerald"
    },
    {
      title: "Resonance Register",
      description: "Document meaningful synchronicities and spiritual experiences",
      icon: Database,
      path: "/registry",
      gradient: "from-amber-500/20 to-orange-500/20",
      glowColor: "amber"
    },
    {
      title: "Personal Codex",
      description: "Your private collection of wisdom, insights, and revelations",
      icon: Archive,
      path: "/codex",
      gradient: "from-pink-500/20 to-rose-500/20",
      glowColor: "pink"
    },
    {
      title: "YouTube Library",
      description: "Curated video content for consciousness expansion",
      icon: Video,
      path: "/videos",
      gradient: "from-red-500/20 to-orange-500/20",
      glowColor: "red"
    },
    {
      title: "Sacred Shifter Guidebook",
      description: "Ancient wisdom for modern transformation",
      icon: Scroll,
      path: "/guidebook",
      gradient: "from-indigo-500/20 to-blue-500/20",
      glowColor: "indigo"
    },
    {
      title: "Support Sacred Shifter",
      description: "Fuel the frequency with donations and premium modules",
      icon: Heart,
      path: "/support",
      gradient: "from-rose-500/20 to-pink-500/20",
      glowColor: "rose"
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const WelcomeModal = () => (
    showWelcome && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-lg border-primary/30 shadow-2xl shadow-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="/src/assets/sacred-shifter-logo.png" 
                  alt="Sacred Shifter" 
                  className="h-20 w-auto filter invert brightness-0 contrast-100 opacity-90"
                />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to Sacred Shifter
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
              <p className="mb-4">I didn't build Sacred Shifter because I wanted to, I built it because everything else in me had already departed. There was a time I couldn't remember who I was, not in the poetic sense, I literally couldn't find myself. No memory with feeling. No anchor. Just a lingering sense that something had left, and I was the only one who noticed.</p>
              
              <p className="mb-4">It felt like everyone else was in on something I wasn't. Like the rules were written in a language I'd never been taught. For a while, it felt like the Truman Show except I wasn't the star, i was a shadow, no not even that, I was nothing but an echo.</p>
              
              <p className="mb-4">I left the city, went back to my home town, and then something shifted. Not a memory. Not a breakthrough. Just a presence. Quiet. Real.</p>
              
              <p className="mb-4">I still don't remember who I used to be. But I know who I am now. And more than that, I know why I'm here.</p>
              
              <p className="mb-4">Sacred Shifter is my response to that knowing. A living field to hold the pieces, patterns, and fragments that we're all trying to put back together.</p>
              
              <p className="mb-4">If you're here, maybe you've felt it too......that emptiness that isn't grief, that ache that isn't pain. The pull home to try and remember who you were.</p>
              
              <p className="mb-4">This space, it isn't the answer. It's the mirror. It's the reminder that you're not alone in the reconstruction.</p>
              
              <p className="mb-4">Together, we fill the spaces left blank. Together, we remember. Together, we shift.</p>
              
              <p className="text-center font-medium text-primary">Welcome to Sacred Shifter, my fellow Shifter.</p>
              <p className="text-center text-sm italic">Kent - Founder, Sacred Shifter</p>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => setShowWelcome(false)}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Crown className="h-4 w-4 mr-2" />
                Begin Your Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );

  return (
    <>
      <WelcomeModal />
      
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="/src/assets/sacred-shifter-logo.png" 
                  alt="Sacred Shifter" 
                  className="h-24 w-auto filter invert brightness-0 contrast-100 opacity-90"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {sacredSections.map((section, index) => (
              <Card 
                key={section.path}
                onClick={() => navigate(section.path)}
                className={`group relative overflow-hidden bg-gradient-to-br ${section.gradient} 
                          backdrop-blur-sm border-primary/20 hover:border-primary/40 
                          transition-all duration-300 hover:scale-105 hover:shadow-2xl 
                          hover:shadow-${section.glowColor}-500/20 cursor-pointer
                          animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-sm" />
                
                <CardContent className="relative p-6 h-full flex flex-col">
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
                    <span className="text-xs text-primary/80 group-hover:text-primary transition-colors duration-300">
                      Enter Sacred Space →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Index;
