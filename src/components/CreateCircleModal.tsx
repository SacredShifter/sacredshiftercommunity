import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useToast } from '@/hooks/use-toast';
import { Users, Lock, Globe, Sparkles } from 'lucide-react';

interface CreateCircleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateCircleModal: React.FC<CreateCircleModalProps> = ({
  open,
  onOpenChange
}) => {
  const { createCircle } = useSacredCircles();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    chakraFocus: '',
    frequencyRange: ''
  });

  const chakraOptions = [
    { value: 'root', label: 'Root Chakra', color: '#E53E3E' },
    { value: 'sacral', label: 'Sacral Chakra', color: '#FF8C00' },
    { value: 'solar', label: 'Solar Plexus Chakra', color: '#FFD700' },
    { value: 'heart', label: 'Heart Chakra', color: '#38A169' },
    { value: 'throat', label: 'Throat Chakra', color: '#3182CE' },
    { value: 'third-eye', label: 'Third Eye Chakra', color: '#805AD5' },
    { value: 'crown', label: 'Crown Chakra', color: '#9F7AEA' }
  ];

  const frequencyOptions = [
    '396 Hz - Liberation',
    '417 Hz - Rebirth',
    '432 Hz - Natural Tuning',
    '444 Hz - Unity Consciousness',
    '528 Hz - Love Frequency',
    '639 Hz - Connection',
    '741 Hz - Truth',
    '852 Hz - Awakening',
    '963 Hz - Source'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a circle name.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
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
        description: `${formData.name} has been created successfully!`,
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
      console.error('Error creating circle:', error);
      toast({
        title: "Error",
        description: "Failed to create Sacred Circle. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create Sacred Circle
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Circle Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Circle Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your sacred circle name..."
              className="bg-background/50"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the purpose and intention of your circle..."
              className="bg-background/50 min-h-[100px]"
              rows={4}
            />
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              {formData.isPrivate ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Globe className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor="privacy" className="text-base font-medium">
                  {formData.isPrivate ? 'Private Circle' : 'Public Circle'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isPrivate 
                    ? 'Only invited members can join and see content'
                    : 'Anyone can discover and join this circle'
                  }
                </p>
              </div>
            </div>
            <Switch
              id="privacy"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => handleInputChange('isPrivate', checked)}
            />
          </div>

          {/* Chakra Focus */}
          <div className="space-y-2">
            <Label>Chakra Focus (Optional)</Label>
            <Select 
              value={formData.chakraFocus} 
              onValueChange={(value) => handleInputChange('chakraFocus', value)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a chakra focus..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific focus</SelectItem>
                {chakraOptions.map((chakra) => (
                  <SelectItem key={chakra.value} value={chakra.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: chakra.color }}
                      />
                      {chakra.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency Range */}
          <div className="space-y-2">
            <Label>Sacred Frequency (Optional)</Label>
            <Select 
              value={formData.frequencyRange} 
              onValueChange={(value) => handleInputChange('frequencyRange', value)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a frequency range..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific frequency</SelectItem>
                {frequencyOptions.map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {freq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {formData.name && (
            <div className="p-4 border rounded-lg bg-muted/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Circle Preview
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {formData.isPrivate ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{formData.name}</span>
                </div>
                {formData.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {formData.description}
                  </p>
                )}
                <div className="flex gap-2">
                  {formData.chakraFocus && (
                    <Badge variant="outline">
                      {chakraOptions.find(c => c.value === formData.chakraFocus)?.label}
                    </Badge>
                  )}
                  {formData.frequencyRange && (
                    <Badge variant="secondary">
                      {formData.frequencyRange}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Create Sacred Circle
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};