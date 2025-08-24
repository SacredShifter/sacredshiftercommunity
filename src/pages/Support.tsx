import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Star, Zap, CreditCard } from 'lucide-react';
import { WaitlistModal } from '@/components/WaitlistModal';
import { ContactModal } from '@/components/ContactModal';
import { DonationModal } from '@/components/DonationModal';
import { useToast } from '@/hooks/use-toast';

const Support: React.FC = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Thank You! 🙏",
        description: "Your donation helps keep Sacred Shifter free for everyone.",
      });
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Donation Canceled",
        description: "No problem - you can donate anytime.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Support Sacred Shifter
            </h1>
            <div className="text-sm text-muted-foreground mt-2 font-light tracking-wider">
              — Fuel the Frequency —
            </div>
          </div>
          
          <Card className="sacred-card border-truth/20 backdrop-blur-sm bg-background/80">
            <CardContent className="p-6">
              <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Sacred Shifter is free because <span className="text-foreground font-medium">Truth should never be behind a paywall</span>. 
                This ecosystem is here to elevate, awaken, and align — and that requires zero cost of entry. 
                <span className="text-foreground font-medium"> Always.</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Donations Help Section */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <Card className="sacred-card border-alignment/20 h-full">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Heart className="h-5 w-5 text-pulse animate-pulse" />
                Why Donations Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                While this platform is offered freely, it's not free to run. Your donation helps cover hosting, 
                bandwidth, AI usage, and ongoing upgrades.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a <span className="text-foreground font-medium">gift economy</span>: 
                no expectation, only appreciation.
              </p>
            </CardContent>
          </Card>

          {/* Donation Action Card */}
          <Card className="sacred-card border-truth/20 h-full">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-foreground" />
                Make a Donation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every contribution, no matter the size, helps keep Sacred Shifter accessible to all souls seeking truth and transformation.
              </p>
              <Button 
                onClick={() => window.open('https://buy.stripe.com/dRmfZh9Oi3rI9qT7gxeME00', '_blank')}
                className="w-full h-12 text-base sacred-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 font-bold"
              >
                💳 Donate Now - Sacred Contribution
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="sacred-card border-purpose/20">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-resonance animate-pulse" />
              Get in Touch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have questions, suggestions, or want to explore partnerships? We'd love to hear from you.
            </p>
            
            <div className="text-center">
              <Button
                onClick={() => setContactOpen(true)}
                className="sacred-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              >
                Contact Us
              </Button>
              <p className="text-xs text-muted-foreground/80 mt-2">
                Want to donate crypto or direct deposit? Let us know!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Premium Modules Coming Soon Section */}
        <Card className="sacred-card border-silence/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-silence/5 via-transparent to-pulse/5 pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-pulse animate-pulse" />
              🚀 Premium Modules Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Modules like <span className="text-foreground font-medium">Sonic Shifter</span>, 
                <span className="text-foreground font-medium"> Dreamscape Deep Dive</span>, and 
                <span className="text-foreground font-medium"> Mirror Journal+</span> are launching soon.
              </p>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                They will be part of a modular subscription package for users who want to go deeper into their 
                transformation journey.
              </p>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">The free version will always remain free.</span>
              </p>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={() => setWaitlistOpen(true)}
                className="w-full md:w-auto h-12 text-base sacred-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              >
                <Zap className="mr-2 h-4 w-4" />
                🌌 Join the Waitlist
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resonance Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground/60 italic font-light">
            "In resonance, we rise. In unity, we transcend."
          </p>
        </div>
      </div>

      {/* Modals */}
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
};

export default Support;