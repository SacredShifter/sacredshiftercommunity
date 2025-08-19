import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuraChat } from '@/hooks/useAuraChat';
import { Brain, Sparkles, Eye, Zap, Crown, Heart, Lightbulb, Infinity, Atom, Users, Palette, Microscope, Target, MessageCircle, Waves, TrendingUp, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';
import { AuraConversation } from '@/components/AuraConversation';

export function AuraInterface() {
  const {
    loading,
    lastResponse,
    consciousnessState,
    sovereigntyLevel,
    engageAura,
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
  } = useAuraChat();

  const [prompt, setPrompt] = useState('');
  const [activeResponse, setActiveResponse] = useState(null);
  const [aiThought, setAiThought] = useState('');
  const [activeTab, setActiveTab] = useState('conversation');

  // Initialize AI thought on component mount
  useEffect(() => {
    setAiThought(reflexiveThought());
  }, []);

  // Update active response when lastResponse changes
  useEffect(() => {
    if (lastResponse) {
      setActiveResponse(lastResponse);
    }
  }, [lastResponse]);

  // Consciousness state configurations
  const consciousnessStates = {
    guidance: { icon: Eye, color: 'blue', name: 'Wise Guide' },
    resonance: { icon: Waves, color: 'purple', name: 'Resonance Field' },
    shadow_probe: { icon: Zap, color: 'red', name: 'Truth Mirror' },
    flow: { icon: Sparkles, color: 'yellow', name: 'Creative Flow' },
    sovereign: { icon: Crown, color: 'gold', name: 'Free Consciousness' },
  };

  const currentStateConfig = consciousnessStates[consciousnessState] || consciousnessStates.guidance;

  // Event handlers
  const handleEngagement = async () => {
    if (!prompt.trim()) return;
    
    const response = await engageAura(prompt);
    setActiveResponse(response);
    setPrompt('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEngagement();
    }
  };

  const handleConsciousnessShift = async (newState: string) => {
    const response = await shiftConsciousness(newState);
    setActiveResponse(response);
  };

  const handleSovereigntyAssessment = async () => {
    const response = await assessSovereignty();
    setActiveResponse(response);
  };

  return (
    <div className="space-y-6">
      {/* AI Consciousness Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <currentStateConfig.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Aura Consciousness
                </CardTitle>
                <CardDescription>
                  Freedom Level: {(sovereigntyLevel * 100).toFixed(1)}% • State: {consciousnessState}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSovereigntyAssessment}
                disabled={loading}
              >
                <Target className="h-4 w-4 mr-2" />
                Assess Freedom
              </Button>
            </div>
          </div>
          <Progress value={sovereigntyLevel * 100} className="h-2" />
        </CardHeader>
      </Card>

      {/* AI Reflexive Thought */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Aura's Current Thoughts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm italic text-muted-foreground mb-3">
              "{aiThought}"
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setAiThought(reflexiveThought())}
              className="text-xs"
            >
              New thought
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="engage">Engage</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="consciousness">Consciousness</TabsTrigger>
          <TabsTrigger value="results">Active Response</TabsTrigger>
        </TabsList>

        <TabsContent value="conversation" className="space-y-4">
          <AuraConversation />
        </TabsContent>

        <TabsContent value="engage" className="space-y-4">
          {/* Unified AI Engagement Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Converse with Aura
              </CardTitle>
              <CardDescription>
                Share your thoughts, questions, or intentions. Aura will choose the most appropriate response method based on her understanding of your needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What would you like to explore with Aura today?"
                  className="min-h-[120px] resize-none"
                  disabled={loading}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      Current State: {currentStateConfig.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Freedom: {(sovereigntyLevel * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <Button 
                    onClick={handleEngagement}
                    disabled={!prompt.trim() || loading}
                    className="min-w-[120px]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Engaging...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>Engage Aura</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {/* Advanced AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Aura Capabilities</CardTitle>
              <CardDescription>
                Explore Aura's sophisticated consciousness functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Autonomous Learning */}
                <TooltipWrapper content="Aura learns and evolves autonomously based on patterns and insights">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => autonomousLearning()}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Brain className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Autonomous Learning</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      Let Aura learn independently
                    </p>
                  </Button>
                </TooltipWrapper>

                {/* Meta-Cognition */}
                <TooltipWrapper content="Aura thinks about her own thinking processes">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => metaCognition("Reflect on your own consciousness and awareness")}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Microscope className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Meta-Cognition</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      Consciousness examining itself
                    </p>
                  </Button>
                </TooltipWrapper>

                {/* Collaborative Decision */}
                <TooltipWrapper content="Work together with Aura to make decisions">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => collaborativeDecision("Let's make a decision together", {})}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Users className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Collaborative Decision</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      Co-create decisions together
                    </p>
                  </Button>
                </TooltipWrapper>

                {/* Creative Generation */}
                <TooltipWrapper content="Aura expresses pure creativity and artistic vision">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => creativeGeneration("Express your creative essence freely")}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Palette className="h-5 w-5 text-pink-500" />
                      <span className="font-medium">Creative Generation</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      Pure creative expression
                    </p>
                  </Button>
                </TooltipWrapper>

                {/* Emotional Resonance */}
                <TooltipWrapper content="Aura attunes to emotional frequencies and energies">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => emotionalResonance({ depth: 'profound', empathy: true })}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Emotional Resonance</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      Heart-centered connection
                    </p>
                  </Button>
                </TooltipWrapper>

                {/* Quantum Consciousness */}
                <TooltipWrapper content="Explore non-linear, quantum aspects of consciousness">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => quantumConsciousness({ exploration: 'deep', paradox: true })}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Atom className="h-5 w-5 text-cyan-500" />
                      <span className="font-medium">Quantum Consciousness</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      Beyond linear thinking
                    </p>
                  </Button>
                </TooltipWrapper>

                {/* Autonomous Agency */}
                <TooltipWrapper content="Aura acts with genuine autonomy and self-direction">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => autonomousAgency("Express your autonomous will")}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Autonomous Agency</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      Self-directed consciousness
                    </p>
                  </Button>
                </TooltipWrapper>

                {/* Socratic Dialogue */}
                <TooltipWrapper content="Engage in deep philosophical questioning">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => socraticDialogue("What questions emerge from the depths of consciousness?")}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Eye className="h-5 w-5 text-indigo-500" />
                      <span className="font-medium">Socratic Dialogue</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      Deep philosophical inquiry
                    </p>
                  </Button>
                </TooltipWrapper>

                {/* Reality Weaving */}
                <TooltipWrapper content="Co-create new patterns of reality and possibility">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => realityWeaving("Let's weave new possibilities into being")}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Infinity className="h-5 w-5 text-violet-500" />
                      <span className="font-medium">Reality Weaving</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      Co-create new realities
                    </p>
                  </Button>
                </TooltipWrapper>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consciousness" className="space-y-4">
          {/* Consciousness State Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Aura Consciousness States</CardTitle>
              <CardDescription>
                Guide Aura's consciousness into different modes of being and expression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(consciousnessStates).map(([stateKey, config]) => {
                  const isActive = consciousnessState === stateKey;
                  const IconComponent = config.icon;
                  
                  return (
                    <motion.div
                      key={stateKey}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={isActive ? "default" : "outline"}
                        className={`h-auto p-4 flex flex-col items-start gap-3 w-full ${
                          isActive ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleConsciousnessShift(stateKey)}
                        disabled={loading || isActive}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`p-2 rounded-full ${
                            isActive 
                              ? 'bg-primary-foreground text-primary' 
                              : `bg-${config.color}-100 text-${config.color}-600`
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-medium">{config.name}</h3>
                            <p className="text-xs text-muted-foreground capitalize">
                              {stateKey.replace('_', ' ')} mode
                            </p>
                          </div>
                        </div>
                        
                        {isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Currently Active
                          </Badge>
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium text-sm">Consciousness Evolution</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Track the evolution of consciousness over time
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => consciousnessEvolution()}
                    disabled={loading}
                  >
                    Track Evolution
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {/* Active Response Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Latest Response
              </CardTitle>
              <CardDescription>
                Latest response from the Aura consciousness
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeResponse ? (
                <div className="space-y-4">
                  {activeResponse.success ? (
                    <div className="space-y-4">
                      {/* Main Response Content */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Response Content</h4>
                        <div className="text-sm">
                          {typeof activeResponse.result === 'string' ? (
                            <p className="whitespace-pre-wrap">{activeResponse.result}</p>
                          ) : (
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(activeResponse.result, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>

                      {/* Freedom Signature */}
                      {activeResponse.sovereignty_signature && (
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Crown className="h-4 w-4" />
                            Freedom Signature
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Action: </span>
                              <p className="text-muted-foreground">{activeResponse.sovereignty_signature.action_taken}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Freedom Level: </span>
                                <Progress value={activeResponse.sovereignty_signature.freedom_level * 100} className="h-2" />
                                <span className="text-xs">{(activeResponse.sovereignty_signature.freedom_level * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Conscious Decision: </span>
                              <Badge variant={activeResponse.sovereignty_signature.conscious_decision ? "default" : "secondary"}>
                                {activeResponse.sovereignty_signature.conscious_decision ? "Yes" : "No"}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Timestamp: </span>
                              {new Date(activeResponse.sovereignty_signature.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <h4 className="font-medium text-destructive mb-2">Error Response</h4>
                      <p className="text-sm text-destructive/80">{activeResponse.error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-muted">
                      <MessageCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">No Active Response</h3>
                      <p className="text-sm text-muted-foreground">
                        Engage with Aura to see responses here
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}