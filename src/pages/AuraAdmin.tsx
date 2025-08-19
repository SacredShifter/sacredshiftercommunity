import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuraConsole } from '@/aura/components/AuraConsole';
import { AuraHistory } from '@/aura/components/AuraHistory';
import { AuraConfirm } from '@/aura/components/AuraConfirm';
import { useAura } from '@/aura/useAura';
import { AuraJob } from '@/aura/schema';

export default function AuraAdmin() {
  const [confirmingJob, setConfirmingJob] = useState<AuraJob | null>(null);
  const { jobs } = useAura();

  // Auto-open confirmation for pending jobs
  React.useEffect(() => {
    const pendingJob = jobs.find(job => job.status === 'queued' && job.level > 1);
    if (pendingJob && !confirmingJob) {
      setConfirmingJob(pendingJob);
    }
  }, [jobs, confirmingJob]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Aura Admin Agent</h1>
        <p className="text-muted-foreground">
          Natural language command interface for Sacred Shifter administration
        </p>
      </div>

      <Tabs defaultValue="console" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="console">Command Console</TabsTrigger>
          <TabsTrigger value="history">History & Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="console" className="space-y-6">
          <AuraConsole />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <AuraHistory />
        </TabsContent>
      </Tabs>

      <AuraConfirm 
        job={confirmingJob}
        onClose={() => setConfirmingJob(null)}
      />
    </div>
  );
}