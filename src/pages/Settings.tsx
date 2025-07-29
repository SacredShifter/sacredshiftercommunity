import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Download, Shield, Eye, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Privacy settings state
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataRetentionPreference, setDataRetentionPreference] = useState<'minimal' | 'standard' | 'extended'>('standard');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings from Supabase on mount
  useEffect(() => {
    loadPrivacySettings();
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading privacy settings:', error);
        toast({
          title: "Error Loading Settings",
          description: "Failed to load your privacy settings.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setAnalyticsConsent(data.analytics_consent);
        setMarketingConsent(data.marketing_consent);
        setProfileVisibility(data.profile_visibility);
        setNotificationsEnabled(data.notifications_enabled);
        setDataRetentionPreference((data.data_retention_preference as 'minimal' | 'standard' | 'extended') || 'standard');
      }
    } catch (error) {
      console.error('Unexpected error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings to Supabase using the secure function
  const savePrivacySettings = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase.rpc('update_privacy_settings', {
        p_analytics_consent: analyticsConsent,
        p_marketing_consent: marketingConsent,
        p_profile_visibility: profileVisibility,
        p_notifications_enabled: notificationsEnabled,
        p_data_retention_preference: dataRetentionPreference
      });

      if (error) {
        console.error('Error saving privacy settings:', error);
        toast({
          title: "Error Saving Settings",
          description: "Failed to save your privacy settings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Sync with localStorage for offline access
      const settings = {
        analyticsConsent,
        marketingConsent,
        profileVisibility,
        notificationsEnabled,
        dataRetentionPreference,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('privacySettings', JSON.stringify(settings));

      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved securely.",
      });
    } catch (error) {
      console.error('Unexpected error saving settings:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDataExport = async () => {
    if (!user) return;

    try {
      // Create data export request
      const { error: requestError } = await supabase
        .from('data_access_requests')
        .insert({
          user_id: user.id,
          request_type: 'export',
          request_details: {
            requested_data: ['privacy_settings', 'consent_history', 'profiles'],
            format: 'json'
          }
        });

      if (requestError) {
        console.error('Error creating export request:', requestError);
        toast({
          title: "Error",
          description: "Failed to create data export request.",
          variant: "destructive",
        });
        return;
      }

      // For now, create a basic export file with current settings
      // In production, this would be handled by a background job
      const { data: settingsData } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: consentHistory } = await supabase
        .from('privacy_consent_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const exportData = {
        user: {
          email: user.email,
          id: user.id
        },
        privacySettings: settingsData,
        consentHistory: consentHistory || [],
        exportDate: new Date().toISOString(),
        exportRequestId: crypto.randomUUID()
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sacred-shifter-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Export Complete",
        description: "Your personal data has been exported and downloaded. A formal export request has been logged for compliance.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Error",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDataDeletion = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      'Are you sure you want to request deletion of all your personal data? This action cannot be undone and will be processed within 30 days as required by Australian Privacy Act.'
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('data_access_requests')
        .insert({
          user_id: user.id,
          request_type: 'deletion',
          request_details: {
            deletion_scope: 'all_personal_data',
            reason: 'user_requested',
            confirmation_provided: true
          }
        });

      if (error) {
        console.error('Error creating deletion request:', error);
        toast({
          title: "Error",
          description: "Failed to submit data deletion request.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Data Deletion Requested",
        description: "Your deletion request has been submitted and logged. Personal data will be removed within 30 days as required by the Australian Privacy Act. You will receive email confirmation.",
        variant: "destructive"
      });

      // Clear local storage immediately
      localStorage.removeItem('privacySettings');
      localStorage.removeItem('profileData');
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      toast({
        title: "Request Error",
        description: "Failed to submit deletion request. Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings & Privacy</h1>
          <p className="text-muted-foreground">Manage your account and privacy preferences</p>
        </div>
      </div>

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Controls
          </CardTitle>
          <CardDescription>
            Control how your data is used and shared. These settings comply with the Australian Privacy Act 1988 (Privacy Act) and Australian Privacy Principles (APPs).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <Label htmlFor="analytics" className="text-base">Analytics & Performance</Label>
              <p className="text-sm text-muted-foreground">Allow collection of anonymous usage data to improve the platform</p>
            </div>
            <Switch 
              id="analytics"
              checked={analyticsConsent}
              onCheckedChange={setAnalyticsConsent}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <Label htmlFor="marketing" className="text-base">Marketing Communications</Label>
              <p className="text-sm text-muted-foreground">Receive updates about new features and spiritual content</p>
            </div>
            <Switch 
              id="marketing"
              checked={marketingConsent}
              onCheckedChange={setMarketingConsent}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <Label htmlFor="profile" className="text-base">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Allow other users to see your profile in circles</p>
            </div>
            <Switch 
              id="profile"
              checked={profileVisibility}
              onCheckedChange={setProfileVisibility}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <Label htmlFor="notifications" className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications about circle activities and messages</p>
            </div>
            <Switch 
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <Label htmlFor="retention" className="text-base">Data Retention</Label>
                <p className="text-sm text-muted-foreground">Choose how long to keep your data</p>
              </div>
              <select 
                id="retention"
                value={dataRetentionPreference}
                onChange={(e) => setDataRetentionPreference(e.target.value as 'minimal' | 'standard' | 'extended')}
                className="px-3 py-1 border rounded-md bg-background"
              >
                <option value="minimal">Minimal (1 year)</option>
                <option value="standard">Standard (3 years)</option>
                <option value="extended">Extended (7 years)</option>
              </select>
            </div>

            <div className="pt-4">
              <Button 
                onClick={savePrivacySettings} 
                className="w-full"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle>Your Data Rights</CardTitle>
          <CardDescription>
            Under the Australian Privacy Act, you have rights regarding your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Data Storage:</strong> Your personal information is stored securely within Australia using Supabase infrastructure. 
              We comply with all Australian Privacy Principles (APPs) and provide you with full control over your data.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Export Your Data</h3>
                <p className="text-sm text-muted-foreground">Download a copy of all your personal data</p>
              </div>
              <Button variant="outline" onClick={handleDataExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
              <div>
                <h3 className="font-semibold text-destructive">Delete All Data</h3>
                <p className="text-sm text-muted-foreground">Permanently remove all your personal data (cannot be undone)</p>
              </div>
              <Button variant="destructive" onClick={handleDataDeletion}>
                <Trash2 className="h-4 w-4 mr-2" />
                Request Deletion
              </Button>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Your Rights Include:</strong> Access to your information, correction of inaccurate data, 
              deletion of personal information, opt-out of data processing, and complaint resolution. 
              Data deletion requests are processed within 30 days as required by law.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account ID:</span>
              <span className="font-mono text-xs">{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data Location:</span>
              <span>Australia (Supabase Sydney)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;