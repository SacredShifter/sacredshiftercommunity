import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { FeaturedContentSection } from '@/components/FeaturedContentSection';
import { 
  MessageCircle, 
  BookOpen, 
  Users, 
  Zap, 
  Video, 
  Settings, 
  Bot,
  Network,
  Compass,
  Globe,
  Brain,
  Sparkles,
  Shield,
  Wifi,
  Lock,
  WifiOff,
  Star,
  Hexagon,
  Triangle,
  Database,
  Archive,
  Scroll,
  Heart,
  Crown,
  Map,
  Rss,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [meshStatus, setMeshStatus] = useState<'active' | 'offline'>('active');
  const [resonanceLevel, setResonanceLevel] = useState(70);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simulate mesh status changes
    const interval = setInterval(() => {
      setMeshStatus(prev => Math.random() > 0.1 ? 'active' : 'offline');
      setResonanceLevel(60 + Math.random() * 30);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const journeySteps = [
    { icon: BookOpen, label: 'Journal', path: '/journal' },
    { icon: Users, label: 'Circles', path: '/circles' },
    { icon: Network, label: 'Mesh', path: '/messages' },
    { icon: Sparkles, label: 'Codex', path: '/codex' }
  ];

  const modules = [
    {
      title: 'Sacred Mesh',
      description: 'The crown jewel - sovereign peer-to-peer communication that transcends all networks',
      icon: Network,
      path: '/messages',
      gradient: 'from-violet-500 via-blue-500 to-emerald-500',
      glow: 'shadow-violet-500/30',
      keywords: ['mesh networking', 'sovereign communication', 'encrypted', 'decentralized'],
      isCrownJewel: true,
      status: meshStatus
    },
    {
      title: 'Sacred Grove',
      description: 'Interactive 3D consciousness modules with breathing techniques and wisdom anchors',
      icon: Crown,
      path: '/grove',
      gradient: 'from-yellow-500 to-amber-600',
      glow: 'shadow-yellow-500/30',
      keywords: ['3D modules', 'breathing', 'interactive wisdom']
    },
    {
      title: '3D Learning Modules',
      description: 'Interactive immersive experiences including cosmograms, sacred geometry, and wisdom teachings',
      icon: Compass,
      path: '/grove?tab=3d-modules',
      gradient: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/30',
      keywords: ['3D modules', 'interactive learning', 'sacred geometry']
    },
    {
      title: 'Sacred Feed',
      description: 'Your personalized stream of consciousness transformation content',
      icon: Rss,
      path: '/feed',
      gradient: 'from-violet-500 to-purple-600',
      glow: 'shadow-violet-500/30',
      keywords: ['feed', 'consciousness', 'personalized']
    },
    {
      title: 'Sacred Circles',
      description: 'Connect with fellow seekers in transformative group experiences',
      icon: Users,
      path: '/circles',
      gradient: 'from-blue-500 to-cyan-600',
      glow: 'shadow-blue-500/30',
      keywords: ['community', 'groups', 'connection']
    },
    {
      title: 'Mirror Journal',
      description: 'Reflect, record, and analyze your inner journey',
      icon: BookOpen,
      path: '/journal',
      gradient: 'from-emerald-500 to-green-600',
      glow: 'shadow-emerald-500/30',
      keywords: ['reflection', 'journal', 'inner work']
    },
    {
      title: 'Collective Codex',
      description: 'Document meaningful synchronicities and spiritual experiences',
      icon: Database,
      path: '/registry',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/30',
      keywords: ['synchronicity', 'collective', 'wisdom']
    },
    {
      title: 'Personal Codex',
      description: 'Your private collection of wisdom, insights, and revelations',
      icon: Archive,
      path: '/codex',
      gradient: 'from-pink-500 to-rose-600',
      glow: 'shadow-pink-500/30',
      keywords: ['personal', 'wisdom', 'insights']
    },
    {
      title: 'YouTube Library',
      description: 'Curated video content with chapter navigation and reflection tools',
      icon: Video,
      path: '/videos',
      gradient: 'from-red-500 to-orange-600',
      glow: 'shadow-red-500/30',
      keywords: ['curated videos', 'chapter navigation', 'reflection tools']
    },
    {
      title: 'Sacred Guidebook',
      description: 'Ancient wisdom for modern transformation',
      icon: Scroll,
      path: '/guidebook',
      gradient: 'from-indigo-500 to-blue-600',
      glow: 'shadow-indigo-500/30',
      keywords: ['wisdom', 'ancient', 'guidance']
    },
    {
      title: 'Sacred Meditation',
      description: 'Guided meditation experiences for consciousness expansion and inner peace',
      icon: Heart,
      path: '/meditation',
      gradient: 'from-teal-500 to-cyan-600',
      glow: 'shadow-teal-500/30',
      keywords: ['meditation', 'consciousness', 'inner peace']
    },
    {
      title: 'Consciousness Constellation',
      description: 'Map the cosmic connections between your experiences',
      icon: Map,
      path: '/constellation',
      gradient: 'from-purple-500 to-indigo-600',
      glow: 'shadow-purple-500/30',
      keywords: ['mapping', 'cosmic', 'connections']
    },
    {
      title: 'Support Sacred Shifter',
      description: 'Fuel the frequency with donations and premium modules',
      icon: Heart,
      path: '/support',
      gradient: 'from-rose-500 to-pink-600',
      glow: 'shadow-rose-500/30',
      keywords: ['support', 'donations', 'premium']
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background/95 to-primary/5 relative">
      {/* Living Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        style={{ animation: 'consciousness-breathe 6s ease-in-out infinite' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        style={{ animation: 'consciousness-breathe 8s ease-in-out infinite reverse' }}
      />
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl"
        style={{ animation: 'consciousness-breathe 10s ease-in-out infinite' }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center mb-6">
            <img
              src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png"
              alt="Sacred Shifter"
              className="h-16 md:h-20 w-auto filter invert brightness-0 contrast-100"
            />
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-2">
            A sovereign platform where consciousness meets frontier technology. 
            Encrypted mesh networks, sacred wisdom, and digital sovereignty united.
          </p>
        </div>


        {/* Journey Path */}
        <div className="journey-path relative">
          {/* Start indicator arrow */}
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-primary animate-pulse">
            <ChevronRight className="h-5 w-5" />
          </div>
          {journeySteps.map((step, index) => (
            <Link 
              key={step.label}
              to={step.path}
              className={`journey-step ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
            >
              <step.icon className="h-4 w-4" />
              <span>{step.label}</span>
              {index === currentStep && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              )}
            </Link>
          ))}
        </div>

        {/* Sacred Mesh - Crown Jewel */}
        <div className="mb-8 relative">
          <Link 
            to="/messages"
            className="group block"
          >
            <Card className="crown-jewel portal-tile mesh-chain-overlay relative p-8 backdrop-blur-xl border-white/20 hover:border-primary/40 transition-all duration-500 group-hover:shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-emerald-500/10" />
              
              {/* Mesh Chain Overlay - Subtle Implementation */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div 
                  className="w-full h-full opacity-10"
                  style={{
                    backgroundImage: `
                      url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2300ffff' stroke-width='0.8' stroke-opacity='0.6'%3E%3Cellipse cx='6' cy='3' rx='3' ry='1.5' transform='rotate(45 6 3)'/%3E%3Cellipse cx='6' cy='9' rx='3' ry='1.5' transform='rotate(-45 6 9)'/%3E%3Cellipse cx='3' cy='6' rx='3' ry='1.5' transform='rotate(45 3 6)'/%3E%3Cellipse cx='9' cy='6' rx='3' ry='1.5' transform='rotate(-45 9 6)'/%3E%3C/g%3E%3C/svg%3E"),
                      url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.4' stroke-opacity='0.3'%3E%3Cpath d='M0,4 L8,4 M4,0 L4,8' /%3E%3Ccircle cx='4' cy='4' r='0.8' fill='%2300ffff' fill-opacity='0.2'/%3E%3C/g%3E%3C/svg%3E")
                    `,
                    backgroundSize: '12px 12px, 8px 8px',
                    backgroundPosition: '0 0, 4px 4px',
                    backgroundRepeat: 'repeat',
                    animation: 'mesh-pattern-flow 10s linear infinite'
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-blue-400/5"
                  style={{
                    backdropFilter: 'blur(0.5px) brightness(1.05)',
                    animation: 'glassy-shimmer 6s ease-in-out infinite'
                  }}
                />
              </div>
              
              {/* Sacred geometry overlay */}
              <div className="sacred-geometry">
                <Hexagon className="w-full h-full text-primary/30" style={{ animation: 'merkaba-spin 8s linear infinite' }} />
              </div>
              
              <CardContent className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-500 shadow-2xl">
                    <Network className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      Sacred Mesh
                    </h2>
                    <div className={`mesh-status ${meshStatus}`}>
                      <div className="mesh-status-dot" />
                      <span>{meshStatus === 'active' ? 'Sacred Mesh Active' : 'Sacred Mesh Offline'}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  The crown jewel of sovereign communication. Peer-to-peer encrypted messaging that transcends 
                  all networks, ensuring your words remain sacred and your connections unbreakable.
                </p>
                
                <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-400" />
                    <span>End-to-End Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-violet-400" />
                    <span>Mesh Networked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span>Zero Servers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          {/* Scroll down indicator */}
          <div 
            className="absolute -bottom-4 right-8 text-primary/60 hover:text-primary cursor-pointer animate-bounce"
            onClick={() => window.scrollBy({ top: 400, behavior: 'smooth' })}
            title="More content below"
          >
            <ChevronDown className="h-6 w-6" />
          </div>
        </div>

        {/* Portal Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {modules.slice(1).map((module, index) => (
            <Link 
              key={module.title} 
              to={module.path}
              className="group block"
            >
              <Card className="portal-tile relative h-full backdrop-blur-xl transition-all duration-500 overflow-hidden">
                {/* Sacred geometry for hover */}
                <div className="sacred-geometry">
                  {index % 3 === 0 && <Triangle className="w-full h-full text-primary/40" />}
                  {index % 3 === 1 && <Hexagon className="w-full h-full text-accent/40" />}
                  {index % 3 === 2 && <Star className="w-full h-full text-secondary/40" />}
                </div>

                <CardContent className="p-6 relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${module.gradient} shadow-lg`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {module.title}
                      </h3>
                      {module.keywords && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {module.keywords.slice(0, 2).map((keyword) => (
                            <span key={keyword} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/60">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground flex-grow leading-relaxed">
                    {module.description}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="group-hover:text-primary transition-colors">Enter Portal →</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                        <div className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors delay-75" />
                        <div className="w-1 h-1 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors delay-150" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Footer Tagline */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm">
            <Network className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              The Mesh of Consciousness — Connect, Reflect, Transform, Anywhere
            </span>
            <div className="privacy-indicator">
              <Lock className="h-4 w-4 privacy-lock" />
              <Wifi className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Index;