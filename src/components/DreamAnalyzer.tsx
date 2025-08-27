import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Moon, 
  Brain, 
  Sparkles, 
  Eye, 
  Heart, 
  ArrowRight, 
  RefreshCw,
  Save,
  Lightbulb,
  Zap
} from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { toast } from 'sonner';

interface DreamAnalyzerProps {
  onSaveToJournal: (dreamData: any) => Promise<void>;
  onClose: () => void;
}

const archetypeSymbols = [
  'Shadow', 'Anima/Animus', 'Mother', 'Father', 'Child', 'Wise Old Man/Woman', 
  'Hero', 'Trickster', 'Death/Rebirth', 'Journey', 'Water', 'Fire', 'Earth', 
  'Air', 'Animals', 'Flying', 'Falling', 'Transformation', 'Sacred Geometry'
];

const associationPrompts = [
  "First word that comes to mind:",
  "How did this make you feel:",
  "What does this remind you of:",
  "What emotion arises:",
  "First memory this triggers:",
  "Body sensation you notice:",
  "Color that represents this:",
  "Sound you associate with this:"
];

export const DreamAnalyzer: React.FC<DreamAnalyzerProps> = ({ onSaveToJournal, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'dream' | 'associations' | 'analysis' | 'integration'>('dream');
  const [dreamContent, setDreamContent] = useState('');
  const [dreamTitle, setDreamTitle] = useState('');
  const [associations, setAssociations] = useState<Array<{prompt: string, response: string}>>([]);
  const [currentAssociationIndex, setCurrentAssociationIndex] = useState(0);
  const [currentAssociation, setCurrentAssociation] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [latentPatterns, setLatentPatterns] = useState<string[]>([]);
  const [personalInsights, setPersonalInsights] = useState('');
  
  const { reflectOnJournal, loading } = useAIAssistant();

  const handleDreamSubmit = () => {
    if (!dreamContent.trim()) {
      toast.error('Please describe your dream first');
      return;
    }
    setCurrentStep('associations');
  };

  const handleAssociationSubmit = () => {
    if (currentAssociation.trim()) {
      const newAssociation = {
        prompt: associationPrompts[currentAssociationIndex],
        response: currentAssociation.trim()
      };
      
      setAssociations(prev => [...prev, newAssociation]);
      setCurrentAssociation('');
      
      if (currentAssociationIndex < associationPrompts.length - 1) {
        setCurrentAssociationIndex(prev => prev + 1);
      } else {
        setCurrentStep('analysis');
        performLatentMatching();
      }
    }
  };

  const skipAssociation = () => {
    if (currentAssociationIndex < associationPrompts.length - 1) {
      setCurrentAssociationIndex(prev => prev + 1);
    } else {
      setCurrentStep('analysis');
      performLatentMatching();
    }
  };

  const performLatentMatching = async () => {
    const associationText = associations.map(a => `${a.prompt} ${a.response}`).join('. ');
    const fullDreamContext = `
Dream: ${dreamContent}

Free Associations: ${associationText}

Please analyze this dream using archetypal and symbolic interpretation. Look for:
1. Jungian archetypes and collective unconscious patterns
2. Personal symbols and their possible meanings  
3. Emotional themes and spiritual messages
4. Connections to consciousness expansion and personal growth
5. Latent symbolic patterns in the associations

Provide insights in a mystical yet practical way that honors both psychological depth and spiritual wisdom.
    `;

    try {
      const analysis = await reflectOnJournal(fullDreamContext);
      if (analysis) {
        setAiAnalysis(analysis);
        
        // Extract potential patterns from associations for matching
        const patterns = associations
          .map(a => a.response.toLowerCase())
          .filter(response => 
            archetypeSymbols.some(symbol => 
              response.includes(symbol.toLowerCase()) || 
              symbol.toLowerCase().includes(response)
            )
          );
        setLatentPatterns([...new Set(patterns)]);
      }
    } catch (error) {
      toast.error('Failed to analyze dream. Please try again.');
      console.error('Dream analysis error:', error);
    }
  };

  const handleSaveAnalysis = async () => {
    const dreamAnalysisData = {
      title: dreamTitle || 'Dream Analysis',
      content: `
## Dream Description
${dreamContent}

## Free Associations
${associations.map(a => `**${a.prompt}** ${a.response}`).join('\n')}

## Aura's Analysis
${aiAnalysis}

## Personal Insights
${personalInsights}

## Identified Patterns
${latentPatterns.map(pattern => `• ${pattern}`).join('\n')}
      `,
      mood_tag: 'Reflective',
      chakra_alignment: 'Third Eye',
      entry_type: 'dream_analysis',
      dream_data: {
        originalDream: dreamContent,
        associations: associations,
        aiAnalysis: aiAnalysis,
        latentPatterns: latentPatterns,
        personalInsights: personalInsights
      }
    };

    try {
      await onSaveToJournal(dreamAnalysisData);
      toast.success('Dream analysis saved to your journal!');
      onClose();
    } catch (error) {
      toast.error('Failed to save dream analysis');
      console.error('Save error:', error);
    }
  };

  const stepProgress = {
    dream: 25,
    associations: 50,
    analysis: 75,
    integration: 100
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[95vh]"
      >
        <Card className="bg-background/95 backdrop-blur-md border border-purple-200/50 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/50 dark:to-indigo-950/50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-purple-600" />
                Dream Analysis Portal
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Dream</span>
                <span>Free Association</span>
                <span>Latent Matching</span>
                <span>Integration</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  animate={{ width: `${stepProgress[currentStep]}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <ScrollArea className="h-[65vh]">
              <AnimatePresence mode="wait">
                {/* Step 1: Dream Entry */}
                {currentStep === 'dream' && (
                  <motion.div
                    key="dream"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <Brain className="w-12 h-12 mx-auto text-purple-500 mb-2" />
                      <h3 className="text-lg font-semibold">Capture Your Dream</h3>
                      <p className="text-sm text-muted-foreground">
                        Describe your dream exactly as you remember it. Don't interpret - just record.
                      </p>
                    </div>

                    <Input
                      placeholder="Give your dream a title (optional)..."
                      value={dreamTitle}
                      onChange={(e) => setDreamTitle(e.target.value)}
                      className="mb-4"
                    />

                    <Textarea
                      placeholder="I dreamed that..."
                      value={dreamContent}
                      onChange={(e) => setDreamContent(e.target.value)}
                      rows={8}
                      className="resize-none"
                    />

                    <Button 
                      onClick={handleDreamSubmit}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      disabled={!dreamContent.trim()}
                    >
                      Begin Free Association
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: Free Association */}
                {currentStep === 'associations' && (
                  <motion.div
                    key="associations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <Zap className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
                      <h3 className="text-lg font-semibold">Free Association</h3>
                      <p className="text-sm text-muted-foreground">
                        Write the first thing that comes to mind. Don't think - just feel and respond.
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">
                        Association {currentAssociationIndex + 1} of {associationPrompts.length}
                      </div>
                      <div className="text-lg font-medium text-purple-600 mb-4">
                        {associationPrompts[currentAssociationIndex]}
                      </div>
                    </div>

                    <Textarea
                      placeholder="First thing that comes to mind..."
                      value={currentAssociation}
                      onChange={(e) => setCurrentAssociation(e.target.value)}
                      rows={3}
                      className="resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAssociationSubmit();
                        }
                      }}
                    />

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleAssociationSubmit}
                        className="flex-1"
                        disabled={!currentAssociation.trim()}
                      >
                        Next
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={skipAssociation}
                      >
                        Skip
                      </Button>
                    </div>

                    {/* Previous associations */}
                    {associations.length > 0 && (
                      <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Your Associations:</h4>
                        <div className="space-y-1 text-xs">
                          {associations.map((assoc, index) => (
                            <div key={index} className="flex gap-2">
                              <span className="text-purple-600 font-medium">{assoc.prompt}</span>
                              <span>{assoc.response}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: AI Analysis */}
                {currentStep === 'analysis' && (
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <Eye className="w-12 h-12 mx-auto text-indigo-500 mb-2" />
                      <h3 className="text-lg font-semibold">Latent Pattern Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Aura is analyzing your dream through archetypal and symbolic lenses...
                      </p>
                    </div>

                    {loading && (
                      <div className="text-center py-8">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-2" />
                        <p className="text-sm text-muted-foreground">Connecting to the collective unconscious...</p>
                        <p className="text-sm italic text-muted-foreground mt-2">Shift the dream into sacred meaning.</p>
                      </div>
                    )}

                    {aiAnalysis && (
                      <div className="space-y-4">
                        <Card className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/50 dark:to-indigo-950/50 border-purple-200/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Aura's Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                              {aiAnalysis}
                            </div>
                          </CardContent>
                        </Card>

                        {latentPatterns.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Detected Archetypal Patterns
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {latentPatterns.map((pattern, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {pattern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button 
                          onClick={() => setCurrentStep('integration')}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        >
                          Add Personal Insights
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Personal Integration */}
                {currentStep === 'integration' && (
                  <motion.div
                    key="integration"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <Heart className="w-12 h-12 mx-auto text-pink-500 mb-2" />
                      <h3 className="text-lg font-semibold">Personal Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        Add your own insights and how this analysis resonates with your journey.
                      </p>
                    </div>

                    <Textarea
                      placeholder="What resonates with you from this analysis? How does it connect to your current life situation or spiritual journey?"
                      value={personalInsights}
                      onChange={(e) => setPersonalInsights(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveAnalysis}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save to Journal
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep('analysis')}
                      >
                        Back
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};