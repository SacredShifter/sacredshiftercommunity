import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const presetAmounts = [1000, 2500, 5000, 10000]; // in cents

export const DonationModal: React.FC<DonationModalProps> = ({ open, onOpenChange }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePresetClick = (cents: number) => {
    setAmount((cents / 100).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dollarAmount = parseFloat(amount);
    if (!dollarAmount || dollarAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Minimum donation is $1.00.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-donation-payment', {
        body: {
          amount: Math.round(dollarAmount * 100), // Convert to cents
        },
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.open(data.url, '_blank');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sacred-card border-truth/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-truth flex items-center gap-2">
            <Heart className="h-6 w-6 text-pulse animate-pulse" />
            Support Sacred Shifter
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-foreground font-medium mb-3 block">
                Quick Select
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {presetAmounts.map((cents) => (
                  <Button
                    key={cents}
                    type="button"
                    variant="outline"
                    onClick={() => handlePresetClick(cents)}
                    className="h-12 text-base border-truth/20 hover:border-truth/40"
                  >
                    ${(cents / 100).toFixed(0)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="custom-amount" className="text-foreground font-medium">
                Custom Amount (USD)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="sacred-input pl-8"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="bg-truth/5 p-4 rounded-lg border border-truth/10">
            <p className="text-sm text-muted-foreground text-center">
              Your donation helps keep Sacred Shifter free for everyone. 
              <br />
              <span className="text-truth font-medium">Truth should never be behind a paywall.</span>
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-truth to-truth/80 hover:from-truth/90 hover:to-truth text-white"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Donate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};