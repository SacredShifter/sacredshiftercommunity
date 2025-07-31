import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

interface CircleSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circleId?: string;
  currentSettings?: {
    name: string;
    description?: string;
    isPrivate: boolean;
    chakraFocus?: string;
    frequencyRange?: string;
  };
  onSettingsUpdated?: () => void;
}

export const CircleSettingsModal = ({ 
  open, 
  onOpenChange, 
  circleId,
  currentSettings,
  onSettingsUpdated 
}: CircleSettingsModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: currentSettings?.name || '',
    description: currentSettings?.description || '',
    isPrivate: currentSettings?.isPrivate || false,
    chakraFocus: currentSettings?.chakraFocus || '',
    frequencyRange: currentSettings?.frequencyRange || ''
  });

  const handleUpdateSettings = async () => {
    if (!circleId) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('circle_groups')
        .update({
          name: formData.name,
          description: formData.description,
          is_private: formData.isPrivate,
          chakra_focus: formData.chakraFocus,
          frequency_range: formData.frequencyRange,
          updated_at: new Date().toISOString()
        })
        .eq('id', circleId);

      if (error) throw error;

      toast({
        title: "Settings Updated",
        description: "Circle settings have been successfully updated.",
      });

      onSettingsUpdated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating circle settings:', error);
      toast({
        title: "Error",
        description: "Failed to update circle settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCircle = async () => {
    if (!circleId) return;
    
    setIsDeleting(true);
    try {
      // Delete circle members first
      await supabase
        .from('circle_group_members')
        .delete()
        .eq('group_id', circleId);

      // Delete circle posts
      await supabase
        .from('circle_posts')
        .delete()
        .eq('group_id', circleId);

      // Delete the circle itself
      const { error } = await supabase
        .from('circle_groups')
        .delete()
        .eq('id', circleId);

      if (error) throw error;

      toast({
        title: "Circle Deleted",
        description: "The circle has been permanently deleted.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting circle:', error);
      toast({
        title: "Error",
        description: "Failed to delete circle. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Circle Settings
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Circle Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter circle name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the purpose of this circle"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="chakra">Chakra Focus</Label>
            <Select value={formData.chakraFocus} onValueChange={(value) => setFormData({ ...formData, chakraFocus: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a chakra focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Root Chakra</SelectItem>
                <SelectItem value="sacral">Sacral Chakra</SelectItem>
                <SelectItem value="solar">Solar Plexus Chakra</SelectItem>
                <SelectItem value="heart">Heart Chakra</SelectItem>
                <SelectItem value="throat">Throat Chakra</SelectItem>
                <SelectItem value="third_eye">Third Eye Chakra</SelectItem>
                <SelectItem value="crown">Crown Chakra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency Range</Label>
            <Select value={formData.frequencyRange} onValueChange={(value) => setFormData({ ...formData, frequencyRange: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="528hz">528 Hz - Love Frequency</SelectItem>
                <SelectItem value="741hz">741 Hz - Expression</SelectItem>
                <SelectItem value="852hz">852 Hz - Intuition</SelectItem>
                <SelectItem value="963hz">963 Hz - Pineal Gland</SelectItem>
                <SelectItem value="432hz">432 Hz - Natural Tuning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="private">Private Circle</Label>
            <Switch
              id="private"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Circle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the circle
                    and remove all associated messages and shared content.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteCircle} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Delete Circle
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateSettings} 
            disabled={isUpdating || !formData.name.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};