import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YouTubeVideo } from '@/types/youtube';
import { useMirrorJournal } from '@/hooks/useMirrorJournal';
import { useToast } from '@/hooks/use-toast';

interface VideoReflectionModalProps {
  video: YouTubeVideo;
  isOpen: boolean;
  onClose: () => void;
}

const chakraOptions = [
  { value: 'root', label: 'Root Chakra' },
  { value: 'sacral', label: 'Sacral Chakra' },
  { value: 'solar_plexus', label: 'Solar Plexus Chakra' },
  { value: 'heart', label: 'Heart Chakra' },
  { value: 'throat', label: 'Throat Chakra' },
  { value: 'third_eye', label: 'Third Eye Chakra' },
  { value: 'crown', label: 'Crown Chakra' },
];

const moodOptions = [
  { value: 'inspired', label: 'Inspired' },
  { value: 'peaceful', label: 'Peaceful' },
  { value: 'curious', label: 'Curious' },
  { value: 'grateful', label: 'Grateful' },
  { value: 'contemplative', label: 'Contemplative' },
  { value: 'energized', label: 'Energized' },
  { value: 'reflective', label: 'Reflective' },
];

export const VideoReflectionModal: React.FC<VideoReflectionModalProps> = ({
  video,
  isOpen,
  onClose
}) => {
  const { createEntry } = useMirrorJournal();
  const { toast } = useToast();
  const [title, setTitle] = useState(`Reflection on: ${video.title}`);
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState<string>('');
  const [chakraAlignment, setChakraAlignment] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (isDraft = false) => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Content Required",
        description: "Please write your reflection before saving."
      });
      return;
    }

    setSaving(true);
    
    const entryData = {
      title: title.trim() || `Reflection on: ${video.title}`,
      content: content.trim(),
      is_draft: isDraft,
      mood_tag: moodTag || null,
      chakra_alignment: chakraAlignment || null,
    };

    const result = await createEntry(entryData);
    
    if (result) {
      onClose();
      setTitle(`Reflection on: ${video.title}`);
      setContent('');
      setMoodTag('');
      setChakraAlignment('');
    }
    
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-background border border-border rounded-lg shadow-lg overflow-hidden"
      >
        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Mirror Journal Reflection</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {video.title}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono">
                    {video.duration}
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Reflection Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your reflection a meaningful title..."
              />
            </div>

            {/* Mood and Chakra */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mood After Watching</Label>
                <Select value={moodTag} onValueChange={setMoodTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mood..." />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value}>
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chakra Resonance</Label>
                <Select value={chakraAlignment} onValueChange={setChakraAlignment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Which chakra resonated?" />
                  </SelectTrigger>
                  <SelectContent>
                    {chakraOptions.map((chakra) => (
                      <SelectItem key={chakra.value} value={chakra.value}>
                        {chakra.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reflection Content */}
            <div className="space-y-2">
              <Label htmlFor="reflection">Your Reflection</Label>
              <Textarea
                id="reflection"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What insights, feelings, or transformations did this video inspire in you? How did it resonate with your current journey?"
                className="min-h-[200px] resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Reflection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};