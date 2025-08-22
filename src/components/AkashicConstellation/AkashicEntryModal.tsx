import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Crown, Star, Zap, Heart, Eye, Sun } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

// Sacred Archetypal Categories
const ARCHETYPAL_CATEGORIES = {
  'Sacred Downloads': { icon: Crown, color: 'hsl(var(--primary))', sigil: '⟐' },
  'Dream Wisdom': { icon: Star, color: 'hsl(var(--accent))', sigil: '☽' },
  'Integration Keys': { icon: Zap, color: 'hsl(var(--secondary))', sigil: '⚡' },
  'Emotional Alchemy': { icon: Heart, color: 'hsl(var(--primary-glow))', sigil: '♡' },
  'Consciousness Fragments': { icon: Sparkles, color: 'hsl(var(--accent-glow))', sigil: '◊' },
  'Vision Threads': { icon: Eye, color: 'hsl(var(--tertiary))', sigil: '◉' },
  'Memory Crystals': { icon: Sun, color: 'hsl(var(--quaternary))', sigil: '◈' }
};

const SOURCE_REALMS = [
  'Mirror Journal', 'Breath of Source', 'Sacred Circles', 'Collective Field', 'Direct Download', 'Dream State'
];

interface AkashicEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function AkashicEntryModal({ isOpen, onClose, onSubmit, initialData }: AkashicEntryModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'Consciousness Fragments',
    source_module: '',
    resonance_tags: [] as string[],
  });
  
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        type: initialData.type || 'Consciousness Fragments',
        source_module: initialData.source_module || '',
        resonance_tags: initialData.resonance_tags || [],
      });
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'Consciousness Fragments',
        source_module: '',
        resonance_tags: [],
      });
    }
    setTagInput('');
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.resonance_tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        resonance_tags: [...prev.resonance_tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      resonance_tags: prev.resonance_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const selectedCategory = ARCHETYPAL_CATEGORIES[formData.type] || ARCHETYPAL_CATEGORIES['Consciousness Fragments'];
  const Icon = selectedCategory.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Icon className="h-6 w-6" style={{ color: selectedCategory.color }} />
            </motion.div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {initialData ? 'Edit Sacred Record' : 'New Akashic Entry'}
            </span>
            <span style={{ color: selectedCategory.color }}>{selectedCategory.sigil}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sacred Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Sacred Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What essence seeks expression?"
              required
              className="bg-background/50"
            />
          </div>

          {/* Archetypal Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Archetypal Category
            </Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ARCHETYPAL_CATEGORIES).map(([category, data]) => {
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

          {/* Source Realm */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Source Realm
            </Label>
            <Select 
              value={formData.source_module} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, source_module: value }))}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Where did this wisdom originate?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unknown Realm</SelectItem>
                {SOURCE_REALMS.map(realm => (
                  <SelectItem key={realm} value={realm}>{realm}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sacred Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Sacred Content
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Let the wisdom flow through you..."
              rows={6}
              className="bg-background/50 resize-none"
            />
          </div>

          {/* Resonance Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Resonance Tags
            </Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add resonance tags..."
                className="bg-background/50"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm" className="px-3">
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
            {formData.resonance_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-card/30 rounded-lg">
                {formData.resonance_tags.map((tag, index) => (
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
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Icon className="h-4 w-4" />
              {initialData ? 'Update Record' : 'Create Sacred Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}