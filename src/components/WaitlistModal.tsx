import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const interestOptions = [
  'Sonic Shifter',
  'Dreamscape Deep Dive',
  'Mirror Journal+',
  'Other'
];

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setSelectedInterests(prev => [...prev, interest]);
    } else {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (selectedInterests.length === 0) {
      toast({
        title: "Interest Required",
        description: "Please select at least one area of interest.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-waitlist', {
        body: {
          email: email.trim(),
          name: name.trim() || null,
          interest: selectedInterests,
        },
      });

      if (error) throw error;

      toast({
        title: "Welcome to the Waitlist! ✨",
        description: "You'll be the first to know when these modules launch.",
      });

      // Reset form
      setEmail('');
      setName('');
      setSelectedInterests([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting waitlist:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sacred-card border-purpose/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purpose flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-resonance" />
            Join the Waitlist
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sacred-input"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="name" className="text-foreground font-medium">
                Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="sacred-input"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-foreground font-medium">
                Areas of Interest *
              </Label>
              <div className="space-y-2">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={(checked) => 
                        handleInterestChange(interest, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={interest} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purpose to-resonance hover:from-purpose/90 hover:to-resonance/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};