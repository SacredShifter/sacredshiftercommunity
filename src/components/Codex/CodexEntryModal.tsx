import { useState, useEffect } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CodexEntry, NewCodexEntry } from '@/hooks/useCodex';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';
import { HelpTooltips } from '@/components/HelpSystem/ContextualHelp';

interface CodexEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewCodexEntry) => void;
  initialData?: CodexEntry | null;
}

const ENTRY_TYPES = [
  'Dream', 'Lesson', 'Download', 'Integration', 'Fragment', 'Vision', 'Revelation', 'Memory'
];

const SOURCE_MODULES = [
  'Mirror Journal', 'Breath of Source', 'Sacred Circles', 'Registry of Resonance', 'Manual'
];

const REFLECTION_PROMPTS = [
  "What pattern keeps reappearing in your dreams?",
  "Which resonance returned today?",
  "What lesson emerged from this experience?",
  "How does this connect to your spiritual journey?",
  "What frequencies did you encounter?",
  "What wisdom wants to be preserved?",
  "How did this transform your understanding?",
  "What sacred geometry appeared to you?"
];

export function CodexEntryModal({ isOpen, onClose, onSubmit, initialData }: CodexEntryModalProps) {
  const [formData, setFormData] = useState<NewCodexEntry>({
    title: '',
    content: '',
    type: 'Fragment',
    resonance_tags: [],
    source_module: 'Manual'
  });
  const [newTag, setNewTag] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content || '',
        type: initialData.type,
        resonance_tags: [...initialData.resonance_tags],
        source_module: initialData.source_module || 'Manual'
      });
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'Fragment',
        resonance_tags: [],
        source_module: 'Manual'
      });
      // Show a random reflection prompt for new entries
      setCurrentPrompt(REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onSubmit(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.resonance_tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        resonance_tags: [...prev.resonance_tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      resonance_tags: prev.resonance_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {initialData ? 'Edit Codex Entry' : 'New Codex Entry'}
                </DialogTitle>
                {!initialData && currentPrompt && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground italic mt-2 p-3 bg-primary/5 rounded-lg border-l-2 border-primary/30"
                  >
                    💫 Reflection: {currentPrompt}
                  </motion.p>
                )}
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <TooltipWrapper content={HelpTooltips.title}>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a meaningful title..."
                      required
                      className="text-base"
                    />
                  </TooltipWrapper>
                </div>

                {/* Type and Source */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Entry Type</Label>
                    <TooltipWrapper content={HelpTooltips.type}>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ENTRY_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TooltipWrapper>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source">Source Module</Label>
                    <TooltipWrapper content={HelpTooltips.source}>
                      <Select value={formData.source_module} onValueChange={(value) => setFormData(prev => ({ ...prev, source_module: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {SOURCE_MODULES.map(source => (
                            <SelectItem key={source} value={source}>{source}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TooltipWrapper>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <TooltipWrapper content={HelpTooltips.content}>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Describe your experience, insight, or memory..."
                      rows={6}
                      className="resize-none"
                    />
                  </TooltipWrapper>
                </div>

                {/* Resonance Tags */}
                <div className="space-y-3">
                  <Label>Resonance Tags</Label>
                  
                  {formData.resonance_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.resonance_tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-sm">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <TooltipWrapper content={HelpTooltips.tags}>
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add resonance tags..."
                        className="flex-1"
                      />
                    </TooltipWrapper>
                    <Button type="button" onClick={addTag} variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Tags help you cross-reference and find connections in your codex.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.title.trim()}>
                    {initialData ? 'Update Entry' : 'Create Entry'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}