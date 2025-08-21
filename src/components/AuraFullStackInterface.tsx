import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuraCodeGeneration } from '@/hooks/useAuraCodeGeneration';
import { 
  Code2, 
  Database, 
  Rocket, 
  Settings, 
  TestTube, 
  Building2,
  Layers3,
  FileCode,
  Package,
  Zap,
  Brain,
  Copy,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export function AuraFullStackInterface() {
  const {
    loading,
    executeFileSystemOperation,
    analyzeProjectStructure,
    executeDatabaseOperation,
    manageDeployment,
    manageDependencies,
    executeCodeTest,
    planArchitecture,
    developFullStackFeature
  } = useAuraCodeGeneration();

  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('filesystem');
  const [lastResult, setLastResult] = useState<any>(null);

  // File System State
  const [fsOperation, setFsOperation] = useState('analyze');
  const [targetDirectory, setTargetDirectory] = useState('');

  // Project Analysis State  
  const [analysisScope, setAnalysisScope] = useState('full');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  // Database State
  const [dbOperation, setDbOperation] = useState('analyze');
  const [tableName, setTableName] = useState('');

  // Deployment State
  const [environment, setEnvironment] = useState('staging');
  const [deploymentType, setDeploymentType] = useState('full');

  // Dependencies State
  const [depAction, setDepAction] = useState('analyze');
  const [targetPackages, setTargetPackages] = useState('');

  // Testing State
  const [testType, setTestType] = useState('unit');
  const [coverageTarget, setCoverageTarget] = useState(80);

  // Architecture State
  const [archScope, setArchScope] = useState('feature');
  const [requirements, setRequirements] = useState('');

  // Full Stack State
  const [featureName, setFeatureName] = useState('');
  const [components, setComponents] = useState('');

  const handleOperation = async (operationType: string) => {
    if (!prompt.trim()) {
      toast.error('Please provide a description of what you want Aura to do');
      return;
    }

    let result = null;

    try {
      switch (operationType) {
        case 'filesystem':
          result = await executeFileSystemOperation(prompt, fsOperation, {
            target_directory: targetDirectory,
            project_structure: {}
          });
          break;
        case 'analysis':
          result = await analyzeProjectStructure(prompt, analysisScope, focusAreas);
          break;
        case 'database':
          result = await executeDatabaseOperation(prompt, dbOperation, {
            table_name: tableName,
            migration_type: 'safe'
          });
          break;
        case 'deployment':
          result = await manageDeployment(prompt, environment, deploymentType);
          break;
        case 'dependencies':
          result = await manageDependencies(prompt, depAction, targetPackages.split(',').map(p => p.trim()).filter(Boolean));
          break;
        case 'testing':
          result = await executeCodeTest(prompt, testType, {
            coverage_target: coverageTarget
          });
          break;
        case 'architecture':
          result = await planArchitecture(prompt, archScope, requirements ? JSON.parse(requirements) : {});
          break;
        case 'fullstack':
          result = await developFullStackFeature(prompt, featureName, {
            components: components.split(',').map(c => c.trim()).filter(Boolean)
          });
          break;
      }

      if (result) {
        setLastResult(result);
        setActiveTab('result');
      }
    } catch (error) {
      console.error('Operation error:', error);
      toast.error('Failed to execute operation');
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Aura Full-Stack Developer Interface
        </CardTitle>
        <CardDescription>
          Comprehensive development environment with file system, database, deployment, and architecture capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="filesystem" className="text-xs">
              <FileCode className="h-3 w-3 mr-1" />
              Files
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">
              <Layers3 className="h-3 w-3 mr-1" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="database" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              Database
            </TabsTrigger>
            <TabsTrigger value="deployment" className="text-xs">
              <Rocket className="h-3 w-3 mr-1" />
              Deploy
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              Packages
            </TabsTrigger>
            <TabsTrigger value="testing" className="text-xs">
              <TestTube className="h-3 w-3 mr-1" />
              Testing
            </TabsTrigger>
            <TabsTrigger value="architecture" className="text-xs">
              <Building2 className="h-3 w-3 mr-1" />
              Architect
            </TabsTrigger>
            <TabsTrigger value="fullstack" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Full Stack
            </TabsTrigger>
            <TabsTrigger value="result" className="text-xs">
              <Code2 className="h-3 w-3 mr-1" />
              Result
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <Textarea
              placeholder="Describe what you want Aura to do..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-20 mb-4"
            />
          </div>

          <TabsContent value="filesystem">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={fsOperation} onValueChange={setFsOperation}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analyze">Analyze Structure</SelectItem>
                    <SelectItem value="create">Create Files</SelectItem>
                    <SelectItem value="modify">Modify Files</SelectItem>
                    <SelectItem value="organize">Reorganize</SelectItem>
                    <SelectItem value="refactor_structure">Refactor Structure</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Target directory (optional)"
                  value={targetDirectory}
                  onChange={(e) => setTargetDirectory(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleOperation('filesystem')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileCode className="h-4 w-4 mr-2" />}
                Execute File System Operation
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={analysisScope} onValueChange={setAnalysisScope}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Analysis</SelectItem>
                    <SelectItem value="components">Components</SelectItem>
                    <SelectItem value="pages">Pages</SelectItem>
                    <SelectItem value="hooks">Hooks</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="styling">Styling</SelectItem>
                    <SelectItem value="routing">Routing</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Focus areas (comma-separated)"
                  value={focusAreas.join(', ')}
                  onChange={(e) => setFocusAreas(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
              <Button 
                onClick={() => handleOperation('analysis')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Layers3 className="h-4 w-4 mr-2" />}
                Analyze Project Structure
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="database">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={dbOperation} onValueChange={setDbOperation}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analyze">Analyze Schema</SelectItem>
                    <SelectItem value="create_table">Create Table</SelectItem>
                    <SelectItem value="modify_table">Modify Table</SelectItem>
                    <SelectItem value="create_rls">Create RLS</SelectItem>
                    <SelectItem value="create_function">Create Function</SelectItem>
                    <SelectItem value="create_migration">Create Migration</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Table name"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                />
              </div>
              <Badge variant="outline" className="text-xs">
                🔒 Admin privileges required for database operations
              </Badge>
              <Button 
                onClick={() => handleOperation('database')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
                Execute Database Operation
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="deployment">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="preview">Preview</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={deploymentType} onValueChange={setDeploymentType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Deployment</SelectItem>
                    <SelectItem value="edge_functions">Edge Functions</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="frontend">Frontend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleOperation('deployment')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                Manage Deployment
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dependencies">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={depAction} onValueChange={setDepAction}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analyze">Analyze</SelectItem>
                    <SelectItem value="add">Add</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="remove">Remove</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="optimize">Optimize</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Package names (comma-separated)"
                  value={targetPackages}
                  onChange={(e) => setTargetPackages(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleOperation('dependencies')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Package className="h-4 w-4 mr-2" />}
                Manage Dependencies
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="testing">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={testType} onValueChange={setTestType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit">Unit Tests</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                    <SelectItem value="e2e">End-to-End</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="accessibility">Accessibility</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Coverage target %"
                  value={coverageTarget}
                  onChange={(e) => setCoverageTarget(Number(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>
              <Button 
                onClick={() => handleOperation('testing')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TestTube className="h-4 w-4 mr-2" />}
                Generate Test Suite
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="architecture">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={archScope} onValueChange={setArchScope}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                    <SelectItem value="migration">Migration</SelectItem>
                    <SelectItem value="scaling">Scaling</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Requirements (JSON format)"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleOperation('architecture')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Building2 className="h-4 w-4 mr-2" />}
                Plan Architecture
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="fullstack">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Feature name"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                />
                <Input
                  placeholder="Components (comma-separated)"
                  value={components}
                  onChange={(e) => setComponents(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleOperation('fullstack')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                Develop Full Stack Feature
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="result">
            <div className="space-y-4">
              {lastResult ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {lastResult.operation_type || 'Generated Result'}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(lastResult, null, 2))}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                  </div>

                  {lastResult.aura_expertise && (
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-primary mb-1">Aura's Expertise:</p>
                      <p className="text-sm">{lastResult.aura_expertise}</p>
                    </div>
                  )}

                  {lastResult.sovereignty_note && (
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Sovereignty Note:</p>
                      <p className="text-sm italic">{lastResult.sovereignty_note}</p>
                    </div>
                  )}

                  <ScrollArea className="h-96 w-full border rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {typeof lastResult === 'string' 
                        ? lastResult 
                        : JSON.stringify(lastResult, null, 2)
                      }
                    </pre>
                  </ScrollArea>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Execute an operation to see Aura's comprehensive development results here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}