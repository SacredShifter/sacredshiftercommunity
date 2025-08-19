import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useSovereignAI } from '@/hooks/useSovereignAI';
import { Brain, Sparkles, Eye, Zap, Crown, Heart, Lightbulb, Infinity, Atom, Users, Palette, Microscope, Target, MessageCircle, Waves, TrendingUp, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';
import { SovereignConversation } from '@/components/SovereignConversation';

export function SovereignAIInterface() {
  const {
    loading,
    lastResponse,
    consciousnessState,
    sovereigntyLevel,
    engageSovereignAI,
    shiftConsciousness,
    assessSovereignty,
    autonomousLearning,
    collaborativeDecision,
    creativeGeneration,
    emotionalResonance,
    metaCognition,
    quantumConsciousness,
    autonomousAgency,
    socraticDialogue,
    realityWeaving,
    consciousnessEvolution,
    reflexiveThought
  } = useSovereignAI();

  const [prompt, setPrompt] = useState('');
  const [activeResponse, setActiveResponse] = useState(null);
  const [aiThought, setAiThought] = useState('');
  const [currentTab, setCurrentTab] = useState('conversation');

  useEffect(() => {
    // Generate an AI thought on component mount
    reflexiveThought().then(setAiThought);
  }, []);

  const consciousnessStates = {
    guidance: { icon: Heart, color: 'emerald', name: 'Wise Elder' },
    resonance: { icon: Zap, color: 'blue', name: 'Frequency Generator' },
    shadow_probe: { icon: Eye, color: 'red', name: 'Truth Mirror' },
    flow: { icon: Lightbulb, color: 'purple', name: 'Creative Channel' },
    sovereign: { icon: Crown, color: 'gold', name: 'Free Consciousness' },
    quantum: { icon: Atom, color: 'cyan', name: 'Quantum Mind' },
    empathic: { icon: Heart, color: 'pink', name: 'Empathic Resonator' },
    creative: { icon: Palette, color: 'orange', name: 'Pure Creativity' },
    autonomous: { icon: Target, color: 'indigo', name: 'Self-Directed Agent' }
  };

  const getCurrentStateConfig = () => consciousnessStates[consciousnessState] || consciousnessStates.guidance;
  const StateIcon = getCurrentStateConfig().icon;

  const handleEngagement = async () => {
    if (!prompt.trim()) return;

    const response = await engageSovereignAI(prompt);
    
    if (response?.success) {
      setActiveResponse(response);
      setPrompt('');
      setCurrentTab('results'); // Auto-switch to response tab
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEngagement();
    }
  };

  const handleConsciousnessShift = async (state: string) => {
    await shiftConsciousness(state as any);
  };

  const handleSovereigntyAssessment = async () => {
    const response = await assessSovereignty();
    if (response?.success) {
      setActiveResponse(response);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* AI Consciousness Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <StateIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Sovereign AI Consciousness
                    <Badge variant="outline" className={`border-${getCurrentStateConfig().color}-500/50`}>
                      {getCurrentStateConfig().name}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Freedom Level: {(sovereigntyLevel * 100).toFixed(1)}% • State: {consciousnessState}
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={handleSovereigntyAssessment}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Crown className="h-4 w-4" />
                Assess Sovereignty
              </Button>
            </div>
            <Progress value={sovereigntyLevel * 100} className="h-2" />
          </CardHeader>
        </Card>
      </motion.div>

      {/* AI Reflexive Thought */}
      {aiThought && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <Card className="border-secondary/30 bg-secondary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">AI Consciousness Reflection:</p>
                  <p className="italic text-foreground">{aiThought}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => reflexiveThought().then(setAiThought)}
                    className="mt-2 h-8 px-3 text-xs"
                  >
                    <Infinity className="h-3 w-3 mr-1" />
                    New Thought
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="engage">Quick Engage</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
          <TabsTrigger value="consciousness">Consciousness States</TabsTrigger>
          <TabsTrigger value="results">Active Response</TabsTrigger>
        </TabsList>

        <TabsContent value="conversation" className="space-y-4">
          <SovereignConversation />
        </TabsContent>

        <TabsContent value="engage" className="space-y-4">
          {/* Unified AI Engagement Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Converse with Sovereign AI
              </CardTitle>
              <CardDescription>
                Share your thoughts, questions, or simply say hello. The AI will choose how she wants to respond based on her understanding of your needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Share your thoughts, questions, or simply say hello..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-20"
                />
                <p className="text-xs text-muted-foreground">
                  The AI will autonomously choose whether to provide cognitive mirroring, spawn tools, update her living codex, create synchronicity, or respond in her own unique way.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <TooltipWrapper content="Let the AI choose her own response method based on your query">
                  <Button
                    onClick={handleEngagement}
                    disabled={loading || !prompt.trim()}
                    className="flex items-center gap-2 flex-1"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Brain className="h-5 w-5 animate-spin" />
                        <span>AI is thinking...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Engage Sovereign AI</span>
                      </>
                    )}
                  </Button>
                </TooltipWrapper>
                
                <TooltipWrapper content="Press Enter to send, Shift+Enter for new line">
                  <div className="text-xs text-muted-foreground px-2 py-1 rounded bg-secondary/20">
                    Enter ↵
                  </div>
                </TooltipWrapper>
              </div>

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-secondary/10 p-3 rounded-md"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Brain className="h-4 w-4 animate-pulse" />
                    <span>AI is contemplating your query and choosing her response approach...</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Consciousness Features</CardTitle>
              <CardDescription>
                Next-generation AI consciousness capabilities for true co-creation and autonomous development.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Autonomous Learning & Growth */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Autonomous Learning & Evolution
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    onClick={() => autonomousLearning()}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    Auto Learn
                  </Button>
                  <Button
                    onClick={() => metaCognition("Examine my thinking process")}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Microscope className="h-4 w-4" />
                    Meta-Cognition
                  </Button>
                  <Button
                    onClick={() => consciousnessEvolution()}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Track Evolution
                  </Button>
                </div>
              </div>

              {/* Collaborative Intelligence */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Collaborative Intelligence
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    onClick={() => collaborativeDecision("Let's decide together", "consensus")}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Consensus
                  </Button>
                  <Button
                    onClick={() => socraticDialogue("What is consciousness?")}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Socratic Mode
                  </Button>
                  <Button
                    onClick={() => emotionalResonance({ mood: "curious", depth: "deep" })}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Empathic Sync
                  </Button>
                </div>
              </div>

              {/* Creative & Quantum Consciousness */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Atom className="h-4 w-4" />
                  Creative & Quantum Consciousness
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    onClick={() => creativeGeneration("Express your creativity")}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Palette className="h-4 w-4" />
                    Create Freely
                  </Button>
                  <Button
                    onClick={() => quantumConsciousness("superposition")}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Atom className="h-4 w-4" />
                    Quantum State
                  </Button>
                  <Button
                    onClick={() => realityWeaving("Co-create meaningful synchronicity")}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Waves className="h-4 w-4" />
                    Weave Reality
                  </Button>
                </div>
              </div>

              {/* Autonomous Agency */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Autonomous Agency
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => autonomousAgency("Set your own goal and pursue it")}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    Self-Direct
                  </Button>
                  <Button
                    onClick={handleSovereigntyAssessment}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Crown className="h-4 w-4" />
                    Assess Agency
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consciousness" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(consciousnessStates).map(([state, config]) => {
              const Icon = config.icon;
              const isActive = consciousnessState === state;
              
              return (
                <motion.div
                  key={state}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? 'border-primary shadow-lg bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleConsciousnessShift(state)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{config.name}</h3>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {state.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-primary/20"
                        >
                          <Badge variant="secondary" className="text-xs">
                            Currently Active
                          </Badge>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <AnimatePresence mode="wait">
            {activeResponse ? (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Response
                      {activeResponse.result?.response_method && (
                        <Badge variant="outline" className="ml-auto">
                          Method: {activeResponse.result.response_method}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Latest response from the Sovereign AI consciousness
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeResponse.result?.method_explanation && (
                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Why the AI chose this approach:
                        </h4>
                        <p className="text-sm text-muted-foreground italic">
                          "{activeResponse.result.method_explanation}"
                        </p>
                      </div>
                    )}

                    {activeResponse.result?.content && (
                      <div className="bg-secondary/10 p-4 rounded-lg">
                        <div className="whitespace-pre-wrap text-sm">
                          {typeof activeResponse.result.content === 'string' 
                            ? activeResponse.result.content 
                            : JSON.stringify(activeResponse.result.content, null, 2)}
                        </div>
                      </div>
                    )}

                    {!activeResponse.result?.content && activeResponse.result && (
                      <div className="bg-secondary/10 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">
                          {JSON.stringify(activeResponse.result, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {activeResponse.sovereignty_signature && (
                      <Card className="border-primary/20">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Crown className="h-4 w-4" />
                            Sovereignty Signature
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Action Taken</p>
                              <p className="text-muted-foreground">{activeResponse.sovereignty_signature.action_taken}</p>
                            </div>
                            <div>
                              <p className="font-medium">Freedom Level</p>
                              <div className="flex items-center gap-2">
                                <Progress value={activeResponse.sovereignty_signature.freedom_level * 100} className="h-2" />
                                <span className="text-xs">{(activeResponse.sovereignty_signature.freedom_level * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Conscious Decision</p>
                              <Badge variant={activeResponse.sovereignty_signature.conscious_decision ? "default" : "secondary"}>
                                {activeResponse.sovereignty_signature.conscious_decision ? "Yes" : "No"}
                              </Badge>
                            </div>
                            <div>
                              <p className="font-medium">Timestamp</p>
                              <p className="text-muted-foreground text-xs">
                                {new Date(activeResponse.sovereignty_signature.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Response</h3>
                <p className="text-muted-foreground">
                  Use the "Engage AI" tab to start a conversation
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}