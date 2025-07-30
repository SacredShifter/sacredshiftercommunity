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
import { X, Plus, Sparkles, Target, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useRegistryOfResonance, NewRegistryEntry } from '@/hooks/useRegistryOfResonance';
import { ImageUploader } from '@/components/ImageUploader';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EntryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editEntry?: any;
}

export function EntryForm({ open, onClose, onSuccess, editEntry }: EntryFormProps) {
  const { 
    createEntry, 
    updateEntry, 
    generateResonanceSignature, 
    uploadImage, 
    deleteImage,
    calculateWordCount,
    calculateReadingTime 
  } = useRegistryOfResonance();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [formData, setFormData] = useState<NewRegistryEntry>({
    title: editEntry?.title || '',
    content: editEntry?.content || '',
    resonance_rating: editEntry?.resonance_rating || 50,
    tags: editEntry?.tags || [],
    entry_type: editEntry?.entry_type || 'Personal',
    access_level: editEntry?.access_level || 'Private',
    resonance_signature: editEntry?.resonance_signature || '',
    image_url: editEntry?.image_url || '',
    image_alt_text: editEntry?.image_alt_text || '',
    author_name: editEntry?.author_name || '',
    author_bio: editEntry?.author_bio || '',
    source_citation: editEntry?.source_citation || '',
    inspiration_source: editEntry?.inspiration_source || '',
    content_type: editEntry?.content_type || 'text',
    visibility_settings: editEntry?.visibility_settings || {
      public: false,
      circle_shared: false,
      featured: false,
    },
  });
  
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsLoading(true);
    try {
      // Auto-generate resonance signature if not provided
      const wordCount = calculateWordCount(formData.content);
      const readingTime = calculateReadingTime(wordCount);
      
      const finalData = {
        ...formData,
        resonance_signature: formData.resonance_signature || 
          generateResonanceSignature(formData.content, formData.title),
        word_count: wordCount,
        reading_time_minutes: readingTime,
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

  const handleImageSelect = async (file: File) => {
    setImageUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData(prev => ({ 
          ...prev, 
          image_url: imageUrl,
          image_alt_text: `Image for ${formData.title || 'registry entry'}`
        }));
      }
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.image_url) {
      await deleteImage(formData.image_url);
      setFormData(prev => ({ ...prev, image_url: '', image_alt_text: '' }));
    }
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

            {/* Image Upload */}
            <div className="space-y-3">
              <Label>Image</Label>
              {formData.image_url ? (
                <div className="relative">
                  <img 
                    src={formData.image_url} 
                    alt={formData.image_alt_text || 'Registry entry image'} 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
                  <ImageUploader onImageSelect={handleImageSelect} />
                  {imageUploading && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Uploading image...
                    </div>
                  )}
                </div>
              )}
              
              {formData.image_url && (
                <div className="space-y-2">
                  <Label htmlFor="image_alt_text">Image Alt Text</Label>
                  <Input
                    id="image_alt_text"
                    value={formData.image_alt_text || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_alt_text: e.target.value }))}
                    placeholder="Describe the image for accessibility..."
                    className="bg-background/50"
                  />
                </div>
              )}
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
              <div className="text-xs text-muted-foreground">
                Word count: {calculateWordCount(formData.content)} • 
                Reading time: ~{calculateReadingTime(calculateWordCount(formData.content))} min
              </div>
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

            {/* Entry Type, Content Type & Access Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label>Content Type</Label>
                <Select
                  value={formData.content_type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, content_type: value }))}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="rich_text">Rich Text</SelectItem>
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

            {/* Enhanced Metadata Section */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Enhanced Metadata
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    value={formData.author_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                    placeholder="Your name or pseudonym..."
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source_citation">Source Citation</Label>
                  <Input
                    id="source_citation"
                    value={formData.source_citation || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, source_citation: e.target.value }))}
                    placeholder="Reference or citation..."
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_bio">Author Bio</Label>
                <Textarea
                  id="author_bio"
                  value={formData.author_bio || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_bio: e.target.value }))}
                  placeholder="Brief bio or context about the author..."
                  className="bg-background/50 min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspiration_source">Inspiration Source</Label>
                <Input
                  id="inspiration_source"
                  value={formData.inspiration_source || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, inspiration_source: e.target.value }))}
                  placeholder="What inspired this entry..."
                  className="bg-background/50"
                />
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