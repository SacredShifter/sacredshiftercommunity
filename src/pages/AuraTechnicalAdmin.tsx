import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PlayCircle, Terminal } from 'lucide-react';

interface AuraTask {
  name: string;
  description: string;
}

const AuraTechnicalAdmin = () => {
  const [tasks, setTasks] = useState<AuraTask[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [runningTask, setRunningTask] = useState<string | null>(null);

  useEffect(() => {
    // This assumes the aura-core service is running and proxied correctly.
    // In a real setup, we would configure vite.config.ts to proxy /api requests
    // to the aura-core service running on port 3000.
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks)
      .catch(err => {
        console.error("Failed to fetch Aura tasks:", err);
        setLogs(prev => [...prev, `Error: Failed to fetch tasks. Is the aura-core service running?`]);
      });
  }, []);

  const runTask = (taskName: string) => {
    setRunningTask(taskName);
    setLogs(prev => [...prev, `> Running task: ${taskName}...`]);

    fetch(`/api/tasks/${taskName}/run`, { method: 'POST' })
      .then(res => {
        if (res.status === 202) {
          setLogs(prev => [...prev, `> Task '${taskName}' started successfully.`]);
        } else {
          res.json().then(body => {
            setLogs(prev => [...prev, `> Error starting task '${taskName}': ${body.error || res.statusText}`]);
          });
        }
      })
      .catch(err => {
        console.error(`Error running task ${taskName}:`, err);
        setLogs(prev => [...prev, `> Network error when trying to run task '${taskName}'.`]);
      })
      .finally(() => {
        setRunningTask(null);
      });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Aura Core - Technical Admin Console</h1>
        <p className="text-muted-foreground">
          Autonomous control panel for the Sacred Shifter platform.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Tasks</CardTitle>
            <CardDescription>
              Select a task to execute with the Aura Core engine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.length > 0 ? tasks.map(task => (
                <div key={task.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{task.name}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <Button
                    onClick={() => runTask(task.name)}
                    disabled={runningTask !== null}
                    variant="outline"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {runningTask === task.name ? 'Running...' : 'Run'}
                  </Button>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Terminal className="mr-2 h-5 w-5" />
              Logs
            </CardTitle>
            <CardDescription>
              Real-time output from running tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 w-full rounded-md border bg-muted">
              <div className="p-4 font-mono text-sm">
                {logs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap">{log}</div>
                ))}
                {/* TODO: Implement real-time log streaming via WebSockets */}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuraTechnicalAdmin;
