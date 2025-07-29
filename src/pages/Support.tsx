import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Star, Zap } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Intro Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-sacred bg-gradient-to-r from-truth via-resonance to-alignment bg-clip-text text-transparent animate-pulse-sacred">
              Support Sacred Shifter
            </h1>
            <div className="text-xl md:text-2xl text-truth/80 mt-2 font-light tracking-wide">
              — Fuel the Frequency —
            </div>
          </div>
          
          <Card className="sacred-card border-truth/20">
            <CardContent className="p-8">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                Sacred Shifter is free because <span className="text-truth font-medium">Truth should never be behind a paywall</span>. 
                This ecosystem is here to elevate, awaken, and align — and that requires zero cost of entry. 
                <span className="text-resonance font-medium"> Always.</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Donations Help Section */}
        <Card className="sacred-card border-alignment/20">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-alignment flex items-center gap-3">
              <Heart className="h-8 w-8 text-pulse animate-pulse" />
              Why Donations Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              While this platform is offered freely, it's not free to run. Your donation helps cover hosting, 
              bandwidth, AI usage, and ongoing upgrades. This is a <span className="text-purpose font-medium">gift economy</span>: 
              no expectation, only appreciation.
            </p>
          </CardContent>
        </Card>

        {/* Donation Buttons Section */}
        <Card className="sacred-card border-purpose/20">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-purpose flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-resonance animate-pulse" />
              How You Can Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/donate/stripe">
                <Button 
                  className="w-full h-16 text-lg bg-gradient-to-r from-truth to-truth/80 hover:from-truth/90 hover:to-truth text-white border border-truth/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-truth/25"
                >
                  💳 Donate via Stripe
                </Button>
              </Link>
              
              <a 
                href="https://www.paypal.com/donate/?hosted_button_id=YOURID" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button 
                  className="w-full h-16 text-lg bg-gradient-to-r from-alignment to-alignment/80 hover:from-alignment/90 hover:to-alignment text-white border border-alignment/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-alignment/25"
                >
                  💸 Donate via PayPal
                </Button>
              </a>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground/80">
                Want to donate crypto or direct deposit? <span className="text-truth hover:underline cursor-pointer">Contact us</span>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Premium Modules Coming Soon Section */}
        <Card className="sacred-card border-silence/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-silence/5 via-transparent to-pulse/5 pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-silence flex items-center gap-3">
              <Star className="h-8 w-8 text-pulse animate-pulse" />
              🚀 Premium Modules Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Modules like <span className="text-truth font-medium">Sonic Shifter</span>, 
                <span className="text-resonance font-medium"> Dreamscape Deep Dive</span>, and 
                <span className="text-alignment font-medium"> Mirror Journal+</span> are launching soon.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                They will be part of a modular subscription package for users who want to go deeper into their 
                transformation journey.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                <span className="text-purpose font-medium">The free version will always remain free.</span>
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full md:w-auto h-14 text-lg bg-gradient-to-r from-pulse via-silence to-pulse hover:from-pulse/90 hover:via-silence/90 hover:to-pulse/90 text-white border border-pulse/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pulse/25"
              >
                <Zap className="mr-2 h-5 w-5" />
                🌌 Join the Waitlist
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resonance Footer */}
        <div className="text-center py-8">
          <p className="text-muted-foreground/60 italic">
            "In resonance, we rise. In unity, we transcend."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;