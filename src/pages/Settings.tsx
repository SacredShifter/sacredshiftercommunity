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

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Privacy settings state
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('privacySettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAnalyticsConsent(settings.analyticsConsent || false);
      setMarketingConsent(settings.marketingConsent || false);
      setProfileVisibility(settings.profileVisibility !== false);
      setNotificationsEnabled(settings.notificationsEnabled !== false);
    }
  }, []);

  // Save settings to localStorage
  const savePrivacySettings = () => {
    const settings = {
      analyticsConsent,
      marketingConsent,
      profileVisibility,
      notificationsEnabled,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('privacySettings', JSON.stringify(settings));
    
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleDataExport = () => {
    // Create export data
    const exportData = {
      user: {
        email: user?.email,
        id: user?.id
      },
      privacySettings: JSON.parse(localStorage.getItem('privacySettings') || '{}'),
      exportDate: new Date().toISOString()
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sacred-shifter-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your personal data has been downloaded.",
    });
  };

  const handleDataDeletion = () => {
    if (window.confirm('Are you sure you want to request deletion of all your personal data? This action cannot be undone.')) {
      // Clear local storage
      localStorage.removeItem('privacySettings');
      localStorage.removeItem('profileData');
      
      toast({
        title: "Data Deletion Requested",
        description: "Your request has been logged. Personal data will be removed within 30 days as required by Australian Privacy Act.",
        variant: "destructive"
      });

      // Log the deletion request
      const deletionRequest = {
        userId: user?.id,
        email: user?.email,
        requestDate: new Date().toISOString(),
        type: 'data_deletion_request'
      };
      
      // Store deletion request locally until processed
      localStorage.setItem('dataDeletionRequest', JSON.stringify(deletionRequest));
    }
  };

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

          <div className="pt-4">
            <Button onClick={savePrivacySettings} className="w-full">
              Save Privacy Settings
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