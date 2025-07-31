import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { RegistryEntry, useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AdminVerificationPanelProps {
  entry: RegistryEntry;
  onVerificationChange?: () => void;
}

export function AdminVerificationPanel({ entry, onVerificationChange }: AdminVerificationPanelProps) {
  const { updateEntry } = useRegistryOfResonance();
  const { userRole } = useAuth();

  console.log('AdminVerificationPanel - userRole:', userRole, 'entry:', entry?.id);

  // Only show for admins
  if (userRole !== 'admin') {
    console.log('AdminVerificationPanel - Not admin, userRole:', userRole);
    return null;
  }

  const handleVerify = async () => {
    try {
      await updateEntry(entry.id, { is_verified: true });
      toast.success('Entry verified successfully');
      onVerificationChange?.();
    } catch (error) {
      console.error('Error verifying entry:', error);
      toast.error('Failed to verify entry');
    }
  };

  const handleUnverify = async () => {
    try {
      await updateEntry(entry.id, { is_verified: false });
      toast.success('Entry unverified');
      onVerificationChange?.();
    } catch (error) {
      console.error('Error unverifying entry:', error);
      toast.error('Failed to unverify entry');
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Admin Verification Panel
        </CardTitle>
        <CardDescription>
          Review and verify this registry entry for public visibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Verification Status:</span>
            <Badge 
              variant={entry.is_verified ? "default" : "secondary"}
              className={entry.is_verified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            >
              {entry.is_verified ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Unverified
                </>
              )}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            {entry.is_verified ? (
              <Button
                onClick={handleUnverify}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Unverify
              </Button>
            ) : (
              <Button
                onClick={handleVerify}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Verify Entry
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Access Level:</strong> {entry.access_level}</p>
          <p><strong>Entry Type:</strong> {entry.entry_type}</p>
          <p><strong>Created:</strong> {new Date(entry.created_at).toLocaleDateString()}</p>
          <p><strong>Note:</strong> Only verified public entries appear in the Collective Archive</p>
        </div>
      </CardContent>
    </Card>
  );
}