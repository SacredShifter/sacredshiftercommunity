import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle } from 'lucide-react';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reasonOptions = [
  'General Inquiry',
  'Technical Support',
  'Feature Request',
  'Partnership/Collaboration',
  'Bug Report',
  'Other'
];

export const ContactModal: React.FC<ContactModalProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !reason) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your email and reason for contact.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-contact', {
        body: {
          email: email.trim(),
          name: name.trim() || null,
          reason,
          message: message.trim() || null,
        },
      });

      if (error) throw error;

      toast({
        title: "Message Sent! 🙏",
        description: "We'll get back to you soon.",
      });

      // Reset form
      setEmail('');
      setName('');
      setReason('');
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast({
        title: "Send Failed",
        description: "Please try again or contact support directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sacred-card border-truth/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-truth flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-resonance" />
            Contact Us
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-email" className="text-foreground font-medium">
                Email Address *
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sacred-input"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="contact-name" className="text-foreground font-medium">
                Name (Optional)
              </Label>
              <Input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="sacred-input"
              />
            </div>
            
            <div>
              <Label htmlFor="contact-reason" className="text-foreground font-medium">
                Reason for Contact *
              </Label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger className="sacred-input">
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="contact-message" className="text-foreground font-medium">
                Message (Optional)
              </Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="sacred-input min-h-[100px]"
                placeholder="Tell us more about your inquiry..."
              />
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
              className="flex-1 bg-gradient-to-r from-truth to-alignment hover:from-truth/90 hover:to-alignment/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};