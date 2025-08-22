import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Crown, Star, Zap, Heart, Eye, Sun, Globe, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

// Sacred Collective Archetypal Categories
const COLLECTIVE_ARCHETYPAL_CATEGORIES = {
  'Sacred Teachings': { icon: Crown, color: 'hsl(var(--primary))', sigil: '⟐' },
  'Collective Dreams': { icon: Star, color: 'hsl(var(--accent))', sigil: '☽' },
  'Integration Patterns': { icon: Zap, color: 'hsl(var(--secondary))', sigil: '⚡' },
  'Emotional Resonance': { icon: Heart, color: 'hsl(var(--primary-glow))', sigil: '♡' },
  'Consciousness Threads': { icon: Sparkles, color: 'hsl(var(--accent-glow))', sigil: '◊' },
  'Vision Prophecy': { icon: Eye, color: 'hsl(var(--tertiary))', sigil: '◉' },
  'Ancient Memory': { icon: Sun, color: 'hsl(var(--quaternary))', sigil: '◈' }
};

const COLLECTIVE_ACCESS_LEVELS = [
  'Public', 'Sacred Circle', 'Initiates Only', 'Community Leaders'
];

interface CollectiveAkashicEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function CollectiveAkashicEntryModal({ isOpen, onClose, onSubmit, initialData }: CollectiveAkashicEntryModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    entry_type: 'Consciousness Threads',
    access_level: 'Public',
    resonance_rating: [5],
    tags: [] as string[],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [resonanceDescription, setResonanceDescription] = useState('');

  // Update resonance description based on rating
  const updateResonanceDescription = (rating: number) => {
    const descriptions = {
      1: 'Personal insight, limited resonance',
      2: 'Interesting observation, some validity',
      3: 'Meaningful understanding, moderate truth',
      4: 'Significant wisdom, noticeable impact',
      5: 'Important teaching, clear truth resonance',
      6: 'Powerful insight, strong community value',
      7: 'Profound wisdom, high truth alignment',
      8: 'Deep revelation, transformative potential',
      9: 'Sacred download, universal truth',
      10: 'Divine transmission, collective awakening catalyst'
    };
    setResonanceDescription(descriptions[rating] || descriptions[5]);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        entry_type: initialData.entry_type || 'Consciousness Threads',
        access_level: initialData.access_level || 'Public',
        resonance_rating: [initialData.resonance_rating || 5],
        tags: initialData.tags || [],
      });
      updateResonanceDescription(initialData.resonance_rating || 5);
    } else {
      setFormData({
        title: '',
        content: '',
        entry_type: 'Consciousness Threads',
        access_level: 'Public',
        resonance_rating: [5],
        tags: [],
      });
      updateResonanceDescription(5);
    }
    setTagInput('');
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      resonance_rating: formData.resonance_rating[0]
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleResonanceChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, resonance_rating: value }));
    updateResonanceDescription(value[0]);
  };

  const selectedCategory = COLLECTIVE_ARCHETYPAL_CATEGORIES[formData.entry_type] || COLLECTIVE_ARCHETYPAL_CATEGORIES['Consciousness Threads'];
  const Icon = selectedCategory.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {initialData ? 'Edit Collective Record' : 'Contribute to Collective Akashic Field'}
            </span>
            <div className="flex items-center gap-1">
              <Icon className="h-5 w-5" style={{ color: selectedCategory.color }} />
              <span style={{ color: selectedCategory.color }}>{selectedCategory.sigil}</span>
            </div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Share sacred wisdom that serves the collective awakening
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sacred Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Sacred Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What wisdom seeks collective recognition?"
              required
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Collective Archetypal Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Collective Archetype
              </Label>
              <Select 
                value={formData.entry_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, entry_type: value }))}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COLLECTIVE_ARCHETYPAL_CATEGORIES).map(([category, data]) => {
                    const CategoryIcon = data.icon;
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4" style={{ color: data.color }} />
                          <span>{data.sigil}</span>
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Access Level */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Access Level
              </Label>
              <Select 
                value={formData.access_level} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, access_level: value }))}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLLECTIVE_ACCESS_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sacred Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Sacred Wisdom Content
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share the wisdom that wishes to flow through you to the collective..."
              rows={8}
              className="bg-background/50 resize-none"
              required
            />
          </div>

          {/* Truth Resonance Rating */}
          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Truth Resonance Rating
            </Label>
            <div className="space-y-3">
              <Slider
                value={formData.resonance_rating}
                onValueChange={handleResonanceChange}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 - Personal</span>
                <span className="font-medium text-foreground">
                  {formData.resonance_rating[0]}/10
                </span>
                <span>10 - Divine</span>
              </div>
              <div className="text-sm text-center p-3 bg-card/30 rounded-lg">
                <span className="font-medium" style={{ color: selectedCategory.color }}>
                  {resonanceDescription}
                </span>
              </div>
            </div>
          </div>

          {/* Collective Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Collective Tags
            </Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags for collective discovery..."
                className="bg-background/50"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm" className="px-3">
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-card/30 rounded-lg">
                {formData.tags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-destructive/20 transition-colors"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="ml-1 h-3 w-3" />
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sacred Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gap-2 bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90"
            >
              <Globe className="h-4 w-4" />
              {initialData ? 'Update Collective Record' : 'Contribute to Collective Field'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}