import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Send } from 'lucide-react';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { RegistryEntry } from '@/hooks/useRegistryOfResonance';
import { toast } from 'sonner';

interface ShareToCircleModalProps {
  entry: RegistryEntry;
  open: boolean;
  onClose: () => void;
}

export function ShareToCircleModal({ entry, open, onClose }: ShareToCircleModalProps) {
  const { shareToCircle } = useRegistryOfResonance();
  const { circles, loading: circlesLoading } = useSacredCircles();
  const [selectedCircleId, setSelectedCircleId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!selectedCircleId) {
      toast.error('Please select a circle to share to');
      return;
    }

    setIsSharing(true);
    try {
      const success = await shareToCircle(entry.id, selectedCircleId, message.trim() || undefined);
      if (success) {
        toast.success('Entry shared to circle successfully!');
        onClose();
        setMessage('');
        setSelectedCircleId('');
      }
    } catch (error) {
      console.error('Failed to share entry:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setMessage('');
      setSelectedCircleId('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Share to Sacred Circle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Entry Preview */}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Sharing Entry:</h3>
            <div className="space-y-2">
              <h4 className="font-medium">{entry.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {entry.content.substring(0, 150)}...
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {entry.entry_type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Resonance: {entry.resonance_rating}
                </Badge>
              </div>
            </div>
          </div>

          {/* Circle Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Circle</Label>
            {circlesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : circles.length === 0 ? (
              <Card>
                <CardContent className="text-center py-6">
                  <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <CardDescription>
                    You haven't joined any sacred circles yet. Join or create a circle to share entries.
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {circles.map((circle) => (
                  <Card
                    key={circle.id}
                    className={`cursor-pointer transition-colors ${
                      selectedCircleId === circle.id
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedCircleId(circle.id)}
                  >
                    <CardHeader className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm">{circle.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {circle.member_count} members
                          </CardDescription>
                        </div>
                        {selectedCircleId === circle.id && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="share-message" className="text-sm font-medium">
              Add a Message (Optional)
            </Label>
            <Textarea
              id="share-message"
              placeholder="Share your thoughts about this entry with the circle..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={!selectedCircleId || isSharing}
              className="gap-2"
            >
              {isSharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSharing ? 'Sharing...' : 'Share Entry'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}