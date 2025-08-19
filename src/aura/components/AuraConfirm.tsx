import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { AuraJob } from '../schema';
import { getCommandDescription } from '../parse';
import { useAura } from '../useAura';

interface AuraConfirmProps {
  job: AuraJob | null;
  onClose: () => void;
}

export function AuraConfirm({ job, onClose }: AuraConfirmProps) {
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const { confirmJob, cancelJob } = useAura();

  if (!job) return null;

  const isLevel2 = job.level === 2;
  const isLevel3 = job.level === 3;
  const requiredPhrase = isLevel2 ? 'CONFIRM' : `APPROVE ${job.id.slice(-8).toUpperCase()}`;
  const phraseMatches = confirmationPhrase.trim() === requiredPhrase;

  const handleConfirm = async () => {
    if (!phraseMatches) return;
    
    setLoading(true);
    try {
      await confirmJob(job.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelJob(job.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = () => {
    if (job.command.kind.startsWith('site.style.apply') || job.command.kind === 'schema.migration') {
      return 'high';
    }
    if (job.command.kind.startsWith('site.') || job.command.kind === 'module.scaffold') {
      return 'medium';
    }
    return 'low';
  };

  const riskLevel = getRiskLevel();

  return (
    <Drawer open={!!job} onOpenChange={onClose}>
      <DrawerContent className="max-w-2xl mx-auto">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Confirm Command Execution
          </DrawerTitle>
          <DrawerDescription>
            Level {job.level} command requires explicit confirmation
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 space-y-4">
          {/* Command Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={job.level === 2 ? 'secondary' : 'destructive'}>
                Level {job.level}
              </Badge>
              <code className="text-sm bg-muted px-2 py-1 rounded">{job.command.kind}</code>
            </div>
            <div className="text-sm">{getCommandDescription(job.command)}</div>
          </div>

          <Separator />

          {/* Risk Assessment */}
          <Alert variant={riskLevel === 'high' ? 'destructive' : 'default'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">
                  Risk Level: {riskLevel.toUpperCase()}
                </div>
                {riskLevel === 'high' && (
                  <div className="text-sm">
                    ⚠️ This action may affect system stability and user experience. 
                    Ensure you have tested changes in a safe environment.
                  </div>
                )}
                {riskLevel === 'medium' && (
                  <div className="text-sm">
                    ⚠️ This action will modify application structure or appearance.
                    Review the changes carefully before proceeding.
                  </div>
                )}
                {riskLevel === 'low' && (
                  <div className="text-sm">
                    ℹ️ This action has minimal risk but requires confirmation.
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Command Details */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Command Payload</label>
            <div className="p-3 bg-muted rounded-md">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(job.command.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isLevel2 ? 'Type CONFIRM to proceed:' : `Type APPROVE ${job.id.slice(-8).toUpperCase()} to proceed:`}
            </label>
            <Input
              value={confirmationPhrase}
              onChange={(e) => setConfirmationPhrase(e.target.value)}
              placeholder={requiredPhrase}
              className="font-mono"
              disabled={loading}
            />
            {confirmationPhrase && !phraseMatches && (
              <div className="text-sm text-destructive">
                Phrase doesn't match. Please type exactly: {requiredPhrase}
              </div>
            )}
          </div>

          {/* Additional Level 3 Warnings */}
          {isLevel3 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Owner Approval Required</div>
                  <div className="text-sm">
                    This Level 3 command can only be executed by the project owner.
                    It may have irreversible effects on the system.
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* DAP Reminders */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">Distortion Audit Protocol</div>
                <div className="text-sm">✅ Sovereignty: No forced user actions</div>
                <div className="text-sm">✅ Transparency: Changes are auditable</div>
                <div className="text-sm">✅ Service Integrity: Command serves community</div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <DrawerFooter>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!phraseMatches || loading}
              variant={isLevel3 ? 'destructive' : 'default'}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isLevel2 ? 'Confirm & Execute' : 'Approve & Execute'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}