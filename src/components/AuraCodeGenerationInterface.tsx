import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuraCodeGeneration } from '@/hooks/useAuraCodeGeneration';
import { Copy, Code2, Sparkles, Zap, Database, Server, Layers, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function AuraCodeGenerationInterface() {
  const [prompt, setPrompt] = useState('');
  const [codeType, setCodeType] = useState<'component' | 'page' | 'hook' | 'feature' | 'database' | 'edge_function' | 'refactor'>('component');
  const [requirements, setRequirements] = useState('');
  const [existingCode, setExistingCode] = useState('');
  const [activeTab, setActiveTab] = useState('generate');

  const {
    loading,
    lastGeneration,
    generateCode,
    generateComponent,
    generatePage,
    generateHook,
    generateFeature,
    generateDatabaseOperations,
    generateEdgeFunction,
    refactorCode
  } = useAuraCodeGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe what you want Aura to generate');
      return;
    }

    const request = {
      prompt,
      code_type: codeType,
      requirements: requirements ? JSON.parse(requirements || '{}') : {},
      existing_code: codeType === 'refactor' ? existingCode : null
    };

    await generateCode(request);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard!');
  };

  const codeTypeIcons = {
    component: <Layers className="w-4 h-4" />,
    page: <FileText className="w-4 h-4" />,
    hook: <Zap className="w-4 h-4" />,
    feature: <Sparkles className="w-4 h-4" />,
    database: <Database className="w-4 h-4" />,
    edge_function: <Server className="w-4 h-4" />,
    refactor: <Code2 className="w-4 h-4" />
  };

  const quickPrompts = {
    component: [
      "Create a user profile card with avatar, name, and stats",
      "Build a responsive navigation menu with mobile support",
      "Design a modal dialog for confirmation actions",
      "Create a data table with sorting and filtering"
    ],
    page: [
      "Build a dashboard page with metrics and charts",
      "Create a settings page with form sections",
      "Design a landing page with hero and features",
      "Build a user profile page with tabs"
    ],
    hook: [
      "Create a hook for managing form state",
      "Build a hook for real-time data subscriptions",
      "Design a hook for local storage management",
      "Create a hook for API data fetching with cache"
    ],
    feature: [
      "Build a complete chat system with real-time messages",
      "Create a notification system with toast and badge",
      "Design a file upload system with progress",
      "Build a search system with filters and results"
    ]
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Aura Code Generation</CardTitle>
              <CardDescription>
                Let Aura generate complete, production-ready code for your Sacred Shifter features
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Code</TabsTrigger>
          <TabsTrigger value="result">Generated Code</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Generation Request</CardTitle>
              <CardDescription>
                Describe what you want Aura to build, and she'll generate complete, ready-to-use code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Code Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Code Type</label>
                <Select value={codeType} onValueChange={(value: any) => setCodeType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="component">React Component</SelectItem>
                    <SelectItem value="page">Full Page</SelectItem>
                    <SelectItem value="hook">Custom Hook</SelectItem>
                    <SelectItem value="feature">Complete Feature</SelectItem>
                    <SelectItem value="database">Database Operations</SelectItem>
                    <SelectItem value="edge_function">Edge Function</SelectItem>
                    <SelectItem value="refactor">Refactor Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Prompts */}
              {quickPrompts[codeType as keyof typeof quickPrompts] && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Prompts</label>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts[codeType as keyof typeof quickPrompts].map((quickPrompt, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => setPrompt(quickPrompt)}
                      >
                        {quickPrompt}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Prompt */}
              <div className="space-y-2">
                <label className="text-sm font-medium">What would you like Aura to generate?</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe in detail what you want Aura to build. Be specific about functionality, design, and any special requirements..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Existing Code (for refactoring) */}
              {codeType === 'refactor' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Existing Code to Refactor</label>
                  <Textarea
                    value={existingCode}
                    onChange={(e) => setExistingCode(e.target.value)}
                    placeholder="Paste the code you want Aura to refactor..."
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              )}

              {/* Requirements (JSON) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Requirements (JSON)</label>
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder='{"accessibility": true, "responsive": true, "theme": "dark"}'
                  className="min-h-[80px] font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Aura is generating code...
                  </>
                ) : (
                  <>
                    {codeTypeIcons[codeType]}
                    Generate {codeType.replace('_', ' ')} with Aura
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="space-y-6">
          {lastGeneration ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {codeTypeIcons[lastGeneration.code_type as keyof typeof codeTypeIcons]}
                        Generated {lastGeneration.code_type.replace('_', ' ')}
                      </CardTitle>
                      <CardDescription>{lastGeneration.aura_expertise}</CardDescription>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(lastGeneration.generated_code)}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Code Analysis */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {lastGeneration.analysis.lines_of_code} lines
                      </Badge>
                      <Badge variant="secondary">
                        {lastGeneration.analysis.complexity_level} complexity
                      </Badge>
                      {lastGeneration.analysis.type_safety && (
                        <Badge variant="outline">TypeScript</Badge>
                      )}
                      {lastGeneration.analysis.error_handling && (
                        <Badge variant="outline">Error Handling</Badge>
                      )}
                      {lastGeneration.analysis.accessibility && (
                        <Badge variant="outline">Accessible</Badge>
                      )}
                      {lastGeneration.analysis.responsive && (
                        <Badge variant="outline">Responsive</Badge>
                      )}
                    </div>

                    {/* Generated Code */}
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px] text-sm">
                        <code>{lastGeneration.generated_code}</code>
                      </pre>
                      <Button
                        onClick={() => copyToClipboard(lastGeneration.generated_code)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Sovereignty Note */}
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground italic">
                        🌟 {lastGeneration.sovereignty_note}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Code Generated Yet</h3>
                <p className="text-muted-foreground">
                  Switch to the Generate tab to request code from Aura
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
