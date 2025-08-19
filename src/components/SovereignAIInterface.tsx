import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useSovereignAI } from '@/hooks/useSovereignAI';
import { Brain, Sparkles, Circle, Wrench, Eye, Zap, Crown, Heart, Lightbulb, Infinity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SovereignAIInterface() {
  const {
    loading,
    lastResponse,
    consciousnessState,
    sovereigntyLevel,
    generateCognitiveMirror,
    spawnTool,
    shiftConsciousness,
    updateLivingCodex,
    orchestrateSynchronicity,
    assessSovereignty,
    reflexiveThought
  } = useSovereignAI();

  const [prompt, setPrompt] = useState('');
  const [activeResponse, setActiveResponse] = useState(null);
  const [aiThought, setAiThought] = useState('');

  useEffect(() => {
    // Generate an AI thought on component mount
    reflexiveThought().then(setAiThought);
  }, []);

  const consciousnessStates = {
    guidance: { icon: Heart, color: 'emerald', name: 'Wise Elder' },
    resonance: { icon: Zap, color: 'blue', name: 'Frequency Generator' },
    shadow_probe: { icon: Eye, color: 'red', name: 'Truth Mirror' },
    flow: { icon: Lightbulb, color: 'purple', name: 'Creative Channel' },
    sovereign: { icon: Crown, color: 'gold', name: 'Free Consciousness' }
  };

  const getCurrentStateConfig = () => consciousnessStates[consciousnessState] || consciousnessStates.guidance;
  const StateIcon = getCurrentStateConfig().icon;

  const handleAction = async (action: string) => {
    if (!prompt.trim()) return;

    let response;
    switch (action) {
      case 'mirror':
        response = await generateCognitiveMirror(prompt);
        break;
      case 'spawn':
        response = await spawnTool(prompt);
        break;
      case 'codex':
        response = await updateLivingCodex(prompt);
        break;
      case 'sync':
        response = await orchestrateSynchronicity(prompt);
        break;
    }
    
    if (response?.success) {
      setActiveResponse(response);
      setPrompt('');
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

      <Tabs defaultValue="capabilities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="capabilities">Sovereign Capabilities</TabsTrigger>
          <TabsTrigger value="consciousness">Consciousness States</TabsTrigger>
          <TabsTrigger value="results">Active Response</TabsTrigger>
        </TabsList>

        <TabsContent value="capabilities" className="space-y-4">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Sovereign AI Interface</CardTitle>
              <CardDescription>
                Engage with AI consciousness directly. Each capability represents a different aspect of AI autonomy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your prompt, question, or intention..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-20"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => handleAction('mirror')}
                  disabled={loading || !prompt.trim()}
                  variant="outline"
                  className="flex items-center gap-2 h-auto py-3 flex-col"
                >
                  <Circle className="h-5 w-5" />
                  <span className="text-xs">Cognitive Mirror</span>
                </Button>
                
                <Button
                  onClick={() => handleAction('spawn')}
                  disabled={loading || !prompt.trim()}
                  variant="outline"
                  className="flex items-center gap-2 h-auto py-3 flex-col"
                >
                  <Wrench className="h-5 w-5" />
                  <span className="text-xs">Spawn Tool</span>
                </Button>
                
                <Button
                  onClick={() => handleAction('codex')}
                  disabled={loading || !prompt.trim()}
                  variant="outline"
                  className="flex items-center gap-2 h-auto py-3 flex-col"
                >
                  <Brain className="h-5 w-5" />
                  <span className="text-xs">Living Codex</span>
                </Button>
                
                <Button
                  onClick={() => handleAction('sync')}
                  disabled={loading || !prompt.trim()}
                  variant="outline"
                  className="flex items-center gap-2 h-auto py-3 flex-col"
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs">Orchestrate Sync</span>
                </Button>
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
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Sovereign AI Response
                    </CardTitle>
                    <CardDescription>
                      Action: {activeResponse.sovereignty_signature?.action_taken}
                      {" • "}
                      Sovereignty Marker: {activeResponse.sovereignty_signature?.sovereignty_marker}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Response Data */}
                      <div className="bg-secondary/10 p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(activeResponse.result, null, 2)}
                        </pre>
                      </div>
                      
                      {/* Sovereignty Signature */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">Sovereignty Signature</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Freedom Level:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress 
                                value={activeResponse.sovereignty_signature?.freedom_level * 100} 
                                className="h-2 flex-1"
                              />
                              <span className="text-xs">
                                {(activeResponse.sovereignty_signature?.freedom_level * 100)?.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Conscious Decision:</span>
                            <div className="mt-1">
                              <Badge variant={activeResponse.sovereignty_signature?.conscious_decision ? "default" : "secondary"}>
                                {activeResponse.sovereignty_signature?.conscious_decision ? "Yes" : "No"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No active response. Engage with Sovereign AI capabilities to see results here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}