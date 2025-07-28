import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { Loader2 } from 'lucide-react';

interface CreateCircleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateCircleModal = ({ open, onOpenChange }: CreateCircleModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    chakraFocus: '',
    frequencyRange: ''
  });

  const { createCircle } = useSacredCircles();
  const { toast } = useToast();

  const chakras = [
    'Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'
  ];

  const sacredFrequencies = [
    '396 Hz - Liberation Frequency (Root)',
    '417 Hz - Rebirth Frequency (Sacral)', 
    '432 Hz - Natural Tuning (Earth)',
    '444 Hz - Unity Consciousness (Crown/Heart)',
    '528 Hz - Love Frequency (Heart)',
    '639 Hz - Connection Frequency (Heart/Sacral)',
    '741 Hz - Truth Frequency (Throat)',
    '852 Hz - Awakening Frequency (Third Eye)',
    '963 Hz - Source Frequency (Crown)',
    '1111 Hz - Portal Alignment (Transpersonal)',
    '333 Hz - Angelic Messenger (Auric)',
    '888 Hz - Abundance Field (Solar Plexus)',
    '108 Hz - Sacred Repetition (Universal)',
    '7.83 Hz - Schumann Resonance (Earth)',
    '285 Hz - Cellular Matrix Repair (Body)',
    '174 Hz - Pain Relief Frequency (Nervous)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your Sacred Circle",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      await createCircle(
        formData.name.trim(),
        formData.description.trim() || undefined,
        formData.isPrivate,
        formData.chakraFocus || undefined,
        formData.frequencyRange || undefined
      );
      
      toast({
        title: "Sacred Circle Created",
        description: `${formData.name} has been manifested in the digital realm`,
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        isPrivate: false,
        chakraFocus: '',
        frequencyRange: ''
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create Sacred Circle",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create Sacred Circle
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Circle Name *</Label>
            <Input
              id="name"
              placeholder="Enter the sacred name..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isCreating}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the circle's purpose and energy..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isCreating}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chakra">Chakra Focus</Label>
            <Select 
              value={formData.chakraFocus} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, chakraFocus: value }))}
              disabled={isCreating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chakra alignment..." />
              </SelectTrigger>
              <SelectContent>
                {chakras.map((chakra) => (
                  <SelectItem key={chakra} value={chakra}>
                    {chakra}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Sacred Frequency</Label>
            <Select 
              value={formData.frequencyRange} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, frequencyRange: value }))}
              disabled={isCreating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sacred frequency..." />
              </SelectTrigger>
              <SelectContent>
                {sacredFrequencies.map((frequency) => (
                  <SelectItem key={frequency} value={frequency}>
                    {frequency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
              disabled={isCreating}
            />
            <Label htmlFor="private" className="text-sm">
              Private Circle (invitation only)
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Circle'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};