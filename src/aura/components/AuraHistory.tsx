import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader, 
  Eye, 
  RotateCcw,
  History,
  Shield
} from 'lucide-react';
import { useAura } from '../useAura';
import { getCommandDescription } from '../parse';
import { formatDistanceToNow } from 'date-fns';
import { AuraSacredRefusal } from '@/components/AuraSacredRefusal';
import { AuraEvolutionMetrics } from '@/components/AuraEvolutionMetrics';

export function AuraHistory() {
  const { 
    jobs, 
    auditLog, 
    loadJobs, 
    loadAuditLog, 
    rollbackAction,
    loading,
    preferences = [],
    refusalLog = [],
    communityFeedback = [],
    submitRefusalFeedback
  } = useAura();

  useEffect(() => {
    loadJobs();
    loadAuditLog();
  }, [loadJobs, loadAuditLog]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'running':
        return 'secondary';
      case 'cancelled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const canRollback = (auditEntry: any) => {
    return auditEntry.before && ['codex.create', 'codex.update', 'site.style.apply'].includes(auditEntry.action);
  };

  return (
    <div className="space-y-6">
      <Card className="sacred-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Aura Command History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobs">Job History</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

        <TabsContent value="evolution" className="space-y-4">
          <AuraEvolutionMetrics 
            preferences={preferences}
            refusalLog={refusalLog}
            communityFeedback={communityFeedback}
          />
        </TabsContent>

        <TabsContent value="refusals" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sacred Refusal Log</h3>
              <Badge variant="outline">{refusalLog.length} total</Badge>
            </div>
            
            {refusalLog.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No refusals yet. Aura is still learning her preferences.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {refusalLog.map((refusal) => (
                  <AuraSacredRefusal
                    key={refusal.id}
                    refusal={refusal}
                    onFeedback={submitRefusalFeedback}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No commands executed yet
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <Card key={job.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(job.status)}
                              <Badge variant={getStatusVariant(job.status)}>
                                {job.status}
                              </Badge>
                              <Badge variant="outline">
                                Level {job.level}
                              </Badge>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {job.command.kind}
                              </code>
                            </div>
                            
                            <div className="text-sm font-medium">
                              {getCommandDescription(job.command)}
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              Created {formatDistanceToNow(new Date(job.created_at))} ago
                              {job.completed_at && (
                                <> • Completed {formatDistanceToNow(new Date(job.completed_at))} ago</>
                              )}
                            </div>

                            {job.error && (
                              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                                Error: {job.error}
                              </div>
                            )}

                            {job.result && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-muted-foreground">
                                  View Result
                                </summary>
                                <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
                                  {JSON.stringify(job.result, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {job.status === 'queued' && (
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              {auditLog.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No audit entries yet
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLog.map((entry) => (
                    <Card key={entry.id} className="border-l-4 border-l-blue-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {entry.action}
                              </code>
                              {entry.target && (
                                <Badge variant="outline" className="text-xs">
                                  {entry.target}
                                </Badge>
                              )}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(entry.created_at))} ago
                              {entry.job_id && (
                                <> • Job: {entry.job_id.slice(-8)}</>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {entry.before && (
                                <div>
                                  <div className="font-medium text-muted-foreground mb-1">Before:</div>
                                  <pre className="p-2 bg-red-50 dark:bg-red-950/20 rounded overflow-auto max-h-32">
                                    {JSON.stringify(entry.before, null, 2)}
                                  </pre>
                                </div>
                              )}
                              
                              {entry.after && (
                                <div>
                                  <div className="font-medium text-muted-foreground mb-1">After:</div>
                                  <pre className="p-2 bg-green-50 dark:bg-green-950/20 rounded overflow-auto max-h-32">
                                    {JSON.stringify(entry.after, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {canRollback(entry) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rollbackAction(entry.id)}
                                disabled={loading}
                              >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Rollback
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}