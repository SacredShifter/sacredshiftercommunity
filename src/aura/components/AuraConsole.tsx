import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Terminal, Play, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAura } from '../useAura';
import { getCommandDescription } from '../parse';
import { runDAP, getDAPSummary } from '../dap';
import { AuraCommand } from '../schema';

export function AuraConsole() {
  const [input, setInput] = useState('');
  const [parsedCommand, setParsedCommand] = useState<AuraCommand | null>(null);
  const [preview, setPreview] = useState<any>(null);
  
  const { 
    loading, 
    executeCommand, 
    parseInput, 
    previewCommand 
  } = useAura();

  useEffect(() => {
    if (input.trim()) {
      const command = parseInput(input);
      setParsedCommand(command);
      setPreview(null);
    } else {
      setParsedCommand(null);
      setPreview(null);
    }
  }, [input, parseInput]);

  const handlePreview = async () => {
    if (!parsedCommand) return;
    
    try {
      const previewData = await previewCommand(parsedCommand);
      setPreview(previewData);
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  const handleExecute = async () => {
    if (!parsedCommand) return;
    
    const success = await executeCommand(parsedCommand);
    if (success) {
      setInput('');
      setParsedCommand(null);
      setPreview(null);
    }
  };

  const dapResult = parsedCommand ? runDAP(parsedCommand) : null;

  return (
    <div className="h-full flex flex-col">
      <Card className="sacred-card flex-1 flex flex-col min-h-0">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Aura Command Console
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
          {/* Scrollable Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Natural Language Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Natural Language Command</label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., 'Add akashic entry about Sacred Geometry' or 'Announce to all users: New features available'"
                  className="min-h-[100px] resize-none"
                  disabled={loading}
                />
                
                {/* Example Commands */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Examples:</div>
                  <div>• Add codex entry "Golden Ratio" with body "Mathematical harmony"</div>
                  <div>• Announce to all: Welcome to the new meditation features</div>
                  <div>• Create journal template "Shadow Work" for inner exploration</div>
                  <div>• Preview darker theme with purple accents</div>
                </div>
              </div>

              {/* Parsed Command View */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Parsed Command</label>
                <div className="min-h-[100px] p-3 bg-muted rounded-md">
                  {parsedCommand ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={parsedCommand.level === 1 ? 'default' : parsedCommand.level === 2 ? 'secondary' : 'destructive'}>
                          Level {parsedCommand.level}
                        </Badge>
                        <code className="text-sm">{parsedCommand.kind}</code>
                      </div>
                      <div className="text-sm">{getCommandDescription(parsedCommand)}</div>
                      <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                        {JSON.stringify(parsedCommand.payload, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      Enter a command to see the parsed result
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DAP Analysis */}
            {dapResult && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Distortion Audit Protocol: {getDAPSummary(dapResult)}</div>
                    {dapResult.warnings.map((warning, i) => (
                      <div key={i} className="text-sm">⚠️ {warning}</div>
                    ))}
                    {dapResult.blockers?.map((blocker, i) => (
                      <div key={i} className="text-sm text-destructive">❌ {blocker}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Preview Results */}
            {preview && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview Results</label>
                <div className="p-3 bg-muted rounded-md">
                  <pre className="text-sm overflow-auto max-h-40">
                    {JSON.stringify(preview, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Level Information */}
            <div className="text-xs text-muted-foreground space-y-1 pb-4">
              <div><strong>Level 1:</strong> Executes immediately (content creation, announcements)</div>
              <div><strong>Level 2:</strong> Requires confirmation (style previews, scaffolding)</div>
              <div><strong>Level 3:</strong> Owner approval required (style changes, migrations)</div>
            </div>
          </div>

          <Separator />

          {/* Fixed Action Buttons at Bottom */}
          <div className="flex-shrink-0 flex gap-2 justify-end pt-2">
            {parsedCommand && parsedCommand.level > 1 && (
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={loading || !dapResult?.ok}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            
            <Button
              onClick={handleExecute}
              disabled={loading || !parsedCommand || !dapResult?.ok}
              variant={parsedCommand?.level === 1 ? 'default' : parsedCommand?.level === 2 ? 'secondary' : 'destructive'}
            >
              <Play className="h-4 w-4 mr-2" />
              {parsedCommand?.level === 1 ? 'Run Now' : 
               parsedCommand?.level === 2 ? 'Request Confirmation' : 
               'Request Owner Approval'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}