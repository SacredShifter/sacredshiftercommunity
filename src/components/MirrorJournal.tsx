import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Moon, 
  Heart, 
  Sparkles,
  Clock,
  BookOpen,
  X,
  Brain
} from 'lucide-react';
import { format } from 'date-fns/format';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { useMirrorJournal, MirrorJournalEntry } from '@/hooks/useMirrorJournal';
import { useAuth } from '@/hooks/useAuth';
import { DreamAnalyzer } from '@/components/DreamAnalyzer';

const poeticPrompts = [
  "What did your soul whisper today?",
  "Capture the essence of this moment...",
  "What patterns are emerging in your life?",
  "How did your heart expand today?",
  "What sacred truth revealed itself?",
  "What are you grateful for in this breath?",
  "How did you honor your inner voice today?",
  "What reflections dance in your consciousness?",
];

const moodTags = [
  { emoji: '🌅', label: 'Awakening', color: 'hsl(45, 100%, 70%)' },
  { emoji: '🌙', label: 'Reflective', color: 'hsl(220, 60%, 70%)' },
  { emoji: '💫', label: 'Inspired', color: 'hsl(280, 60%, 70%)' },
  { emoji: '🌊', label: 'Flowing', color: 'hsl(200, 60%, 70%)' },
  { emoji: '🔥', label: 'Passionate', color: 'hsl(15, 80%, 70%)' },
  { emoji: '🌸', label: 'Peaceful', color: 'hsl(320, 50%, 80%)' },
  { emoji: '⚡', label: 'Energized', color: 'hsl(60, 100%, 70%)' },
  { emoji: '🍃', label: 'Grounded', color: 'hsl(120, 40%, 70%)' },
];

const chakraAlignments = [
  { name: 'Root', color: 'hsl(0, 70%, 60%)' },
  { name: 'Sacral', color: 'hsl(25, 80%, 60%)' },
  { name: 'Solar Plexus', color: 'hsl(50, 90%, 60%)' },
  { name: 'Heart', color: 'hsl(120, 60%, 60%)' },
  { name: 'Throat', color: 'hsl(200, 80%, 60%)' },
  { name: 'Third Eye', color: 'hsl(260, 70%, 60%)' },
  { name: 'Crown', color: 'hsl(290, 60%, 70%)' },
];

interface MirrorJournalProps {
  className?: string;
}

export const MirrorJournal: React.FC<MirrorJournalProps> = ({ className }) => {
  const { user } = useAuth();
  const { entries, loading, createEntry, updateEntry, deleteEntry, autoSave } = useMirrorJournal();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    mood_tag: '',
    chakra_alignment: '',
  });
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showDreamAnalyzer, setShowDreamAnalyzer] = useState(false);

  const currentPrompt = poeticPrompts[Math.floor(Math.random() * poeticPrompts.length)];

  // Auto-save functionality with debounce
  useEffect(() => {
    if (editingId && (currentEntry.content || currentEntry.title)) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      const timeout = setTimeout(() => {
        autoSave(editingId, currentEntry.content, currentEntry.title);
      }, 1000);
      
      setAutoSaveTimeout(timeout);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [currentEntry, editingId, autoSave]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setCurrentEntry({
      title: '',
      content: '',
      mood_tag: '',
      chakra_alignment: '',
    });
  };

  const handleEdit = (entry: MirrorJournalEntry) => {
    setEditingId(entry.id);
    setCurrentEntry({
      title: entry.title || '',
      content: entry.content || '',
      mood_tag: entry.mood_tag || '',
      chakra_alignment: entry.chakra_alignment || '',
    });
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (isCreating) {
      const result = await createEntry({
        ...currentEntry,
        is_draft: false,
      });
      if (result) {
        setIsCreating(false);
        setCurrentEntry({ title: '', content: '', mood_tag: '', chakra_alignment: '' });
      }
    } else if (editingId) {
      await updateEntry(editingId, {
        ...currentEntry,
        is_draft: false,
      });
      setEditingId(null);
      setCurrentEntry({ title: '', content: '', mood_tag: '', chakra_alignment: '' });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setCurrentEntry({ title: '', content: '', mood_tag: '', chakra_alignment: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(id);
      if (editingId === id) {
        handleCancel();
      }
    }
  };

  const getMoodTag = (tag: string) => moodTags.find(m => m.label === tag);
  const getChakraAlignment = (chakra: string) => chakraAlignments.find(c => c.name === chakra);

  const handleSaveDreamAnalysis = async (dreamData: any): Promise<void> => {
    await createEntry({
      ...dreamData,
      is_draft: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const isEmpty = entries.length === 0 && !isCreating;

  return (
    <div className={`min-h-screen bg-transparent ${className}`}>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Mirror Journal
          </h1>
          <p className="text-muted-foreground text-sm">
            Reflect, record, and remember your sacred journey
          </p>
        </motion.div>

        {/* Empty State with Onboarding */}
        <AnimatePresence mode="wait">
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <Card className="mx-auto max-w-md bg-background/60 backdrop-blur-md border border-primary/20">
                <CardContent className="pt-8 pb-6">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-6xl mb-4"
                  >
                    📖
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">Begin your reflection...</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Your mirror journal awaits your first sacred thoughts
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={handleCreateNew}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Entry
                    </Button>
                    <Button
                      onClick={() => setShowDreamAnalyzer(true)}
                      variant="outline"
                      className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze a Dream
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create/Edit Form */}
        <AnimatePresence>
          {(isCreating || editingId) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-background/60 backdrop-blur-md border border-primary/20 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5" />
                      {isCreating ? 'New Entry' : 'Edit Entry'}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Give your reflection a title..."
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-background/40 border-primary/30 focus:border-primary/50"
                  />
                  
                  <Textarea
                    placeholder={currentPrompt}
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="bg-background/40 border-primary/30 focus:border-primary/50 resize-none"
                  />

                  {/* Mood Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mood</label>
                    <div className="flex flex-wrap gap-2">
                      {moodTags.map((mood) => (
                        <Button
                          key={mood.label}
                          variant={currentEntry.mood_tag === mood.label ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentEntry(prev => ({ 
                            ...prev, 
                            mood_tag: prev.mood_tag === mood.label ? '' : mood.label 
                          }))}
                          className="text-xs"
                          style={currentEntry.mood_tag === mood.label ? { backgroundColor: mood.color } : {}}
                        >
                          {mood.emoji} {mood.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Chakra Alignment */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chakra Alignment</label>
                    <div className="flex flex-wrap gap-2">
                      {chakraAlignments.map((chakra) => (
                        <Button
                          key={chakra.name}
                          variant={currentEntry.chakra_alignment === chakra.name ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentEntry(prev => ({ 
                            ...prev, 
                            chakra_alignment: prev.chakra_alignment === chakra.name ? '' : chakra.name 
                          }))}
                          className="text-xs"
                          style={currentEntry.chakra_alignment === chakra.name ? { backgroundColor: chakra.color } : {}}
                        >
                          {chakra.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Entry
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries List with Add Button */}
        {entries.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </div>
              
              {/* Add Entry Button - positioned above entries */}
              {!isCreating && !editingId && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowDreamAnalyzer(true)}
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 rounded-full border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    <span className="text-xs">Dream</span>
                  </Button>
                  <Button
                    onClick={handleCreateNew}
                    size="sm"
                    className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                <AnimatePresence>
                  {entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-background/60 backdrop-blur-md border border-primary/20 hover:shadow-md transition-all duration-200 group">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              {entry.title && (
                                <CardTitle className="text-lg">{entry.title}</CardTitle>
                              )}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                                </div>
                                {entry.is_draft && (
                                  <Badge variant="secondary" className="text-xs">
                                    Draft
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(entry)}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(entry.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {entry.content && (
                            <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                              {entry.content}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {entry.mood_tag && (
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ 
                                  borderColor: getMoodTag(entry.mood_tag)?.color,
                                  color: getMoodTag(entry.mood_tag)?.color 
                                }}
                              >
                                {getMoodTag(entry.mood_tag)?.emoji} {entry.mood_tag}
                              </Badge>
                            )}
                            {entry.chakra_alignment && (
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ 
                                  borderColor: getChakraAlignment(entry.chakra_alignment)?.color,
                                  color: getChakraAlignment(entry.chakra_alignment)?.color 
                                }}
                              >
                                {entry.chakra_alignment} Chakra
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Dream Analyzer Modal */}
        {showDreamAnalyzer && (
          <DreamAnalyzer
            onSaveToJournal={handleSaveDreamAnalysis}
            onClose={() => setShowDreamAnalyzer(false)}
          />
        )}
      </div>
    </div>
  );
};