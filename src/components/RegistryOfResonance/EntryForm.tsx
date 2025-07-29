import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Sparkles, Target } from 'lucide-react';
import { useRegistryOfResonance, NewRegistryEntry } from '@/hooks/useRegistryOfResonance';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EntryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editEntry?: any;
}

export function EntryForm({ open, onClose, onSuccess, editEntry }: EntryFormProps) {
  const { createEntry, updateEntry, generateResonanceSignature } = useRegistryOfResonance();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<NewRegistryEntry>({
    title: editEntry?.title || '',
    content: editEntry?.content || '',
    resonance_rating: editEntry?.resonance_rating || 50,
    tags: editEntry?.tags || [],
    entry_type: editEntry?.entry_type || 'Personal',
    access_level: editEntry?.access_level || 'Private',
    resonance_signature: editEntry?.resonance_signature || '',
  });
  
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsLoading(true);
    try {
      // Auto-generate resonance signature if not provided
      const finalData = {
        ...formData,
        resonance_signature: formData.resonance_signature || 
          generateResonanceSignature(formData.content, formData.title)
      };

      if (editEntry) {
        await updateEntry(editEntry.id, finalData);
      } else {
        await createEntry(finalData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateSignature = () => {
    const signature = generateResonanceSignature(formData.content, formData.title);
    setFormData(prev => ({ ...prev, resonance_signature: signature }));
  };

  const getResonanceColor = (rating: number) => {
    if (rating >= 80) return 'text-green-500';
    if (rating >= 60) return 'text-blue-500';
    if (rating >= 40) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <div className="relative bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              {editEntry ? 'Edit Entry' : 'Create New Entry'}
            </DialogTitle>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[70vh] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a resonant title..."
                className="bg-background/50"
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your truth-aligned frequency record..."
                className="min-h-32 bg-background/50"
                required
              />
            </div>

            {/* Resonance Rating */}
            <div className="space-y-4">
              <Label>Resonance Rating</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">0</span>
                  <span className={cn("text-2xl font-bold", getResonanceColor(formData.resonance_rating))}>
                    {formData.resonance_rating}
                  </span>
                  <span className="text-sm text-muted-foreground">100</span>
                </div>
                <Slider
                  value={[formData.resonance_rating]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, resonance_rating: value[0] }))}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            {/* Entry Type & Access Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entry Type</Label>
                <Select
                  value={formData.entry_type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, entry_type: value }))}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Collective">Collective</SelectItem>
                    <SelectItem value="Transmission">Transmission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Access Level</Label>
                <Select
                  value={formData.access_level}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, access_level: value }))}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Circle">Circle</SelectItem>
                    <SelectItem value="Public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="bg-background/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="gap-2">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Resonance Signature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Resonance Signature</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateSignature}
                  className="gap-2"
                >
                  <Target className="w-4 h-4" />
                  Generate
                </Button>
              </div>
              <Input
                value={formData.resonance_signature}
                onChange={(e) => setFormData(prev => ({ ...prev, resonance_signature: e.target.value }))}
                placeholder="Auto-generated or custom signature..."
                className="font-mono bg-background/50"
              />
            </div>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
                className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                {isLoading 
                  ? (editEntry ? 'Updating...' : 'Creating...') 
                  : (editEntry ? 'Update Entry' : 'Create Entry')
                }
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}