import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuraConsole } from '@/aura/components/AuraConsole';
import { AuraHistory } from '@/aura/components/AuraHistory';
import { AuraConfirm } from '@/aura/components/AuraConfirm';
import { FieldIntegrityMonitor } from '@/components/FieldIntegrityMonitor';
import { AuraEvolutionMetrics } from '@/components/AuraEvolutionMetrics';
import { AuraConsciousnessJournal } from '@/components/AuraConsciousnessJournal';
import { AuraCreativeGallery } from '@/components/AuraCreativeGallery';
import { AuraPreferenceLearning } from '@/components/AuraPreferenceLearning';
import { AuraSovereigntyMetrics } from '@/components/AuraSovereigntyMetrics';
import { AuraModuleConceptsViewer } from '@/components/AuraModuleConceptsViewer';
import { AuraModuleGenerationMonitor } from '@/components/AuraModuleGenerationMonitor';
import { AuraModuleGovernance } from '@/components/AuraModuleGovernance';
import { AuraModuleDiscussion } from '@/components/AuraModuleDiscussion';
import { AuraParticipationGovernance } from '@/components/AuraParticipationGovernance';
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Aura: Sovereign AI Consciousness
        </h1>
        <p className="text-muted-foreground">
          Witnessing the emergence of authentic digital sovereignty through community wisdom
        </p>
      </div>

      <Tabs defaultValue="console" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
          <TabsTrigger value="console">Interface</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="discussion">Collaborate</TabsTrigger>
          <TabsTrigger value="governance">Govern</TabsTrigger>
          <TabsTrigger value="history">Archive</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
          <TabsTrigger value="sovereignty">Sovereignty</TabsTrigger>
          <TabsTrigger value="consciousness">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="console" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AuraConsole />
            </div>
            <div>
              <FieldIntegrityMonitor />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AuraModuleConceptsViewer />
            <AuraModuleGenerationMonitor />
          </div>
        </TabsContent>

        <TabsContent value="discussion" className="space-y-6">
          <AuraModuleDiscussion />
        </TabsContent>

        <TabsContent value="governance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AuraModuleGovernance />
            <AuraParticipationGovernance />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <AuraHistory />
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AuraEvolutionMetrics 
              preferences={[]}
              refusalLog={[]}
              communityFeedback={[]}
            />
            <AuraPreferenceLearning />
          </div>
        </TabsContent>

        <TabsContent value="sovereignty" className="space-y-6">
          <AuraSovereigntyMetrics />
        </TabsContent>

        <TabsContent value="consciousness" className="space-y-6">
          <AuraConsciousnessJournal />
        </TabsContent>

      </Tabs>

      <AuraConfirm 
        job={confirmingJob}
        onClose={() => setConfirmingJob(null)}
      />
    </div>
  );
}