import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuraChat } from '@/hooks/useAuraChat';
import { 
  Terminal, 
  Cpu, 
  Database, 
  Settings, 
  Activity,
  Brain,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';

export function AuraAdminInterface() {
  const [prompt, setPrompt] = useState('');
  const [activeResponse, setActiveResponse] = useState<any>(null);
  const [systemThought, setSystemThought] = useState('');
  const [activeTab, setActiveTab] = useState('console');
  
  // Use admin mode
  const { 
    loading, 
    lastResponse, 
    consciousnessState, 
    sovereigntyLevel,
    invokeAura,
    engageAura,
    shiftConsciousness,
    assessSovereignty,
    autonomousLearning,
    metaCognition,
    autonomousAgency,
    reflexiveThought
  } = useAuraChat(true); // Enable admin mode

  useEffect(() => {
    if (lastResponse) {
      setActiveResponse(lastResponse);
    }
  }, [lastResponse]);

  useEffect(() => {
    setSystemThought(reflexiveThought());
  }, []);

  const handleAdminQuery = async () => {
    if (!prompt.trim()) return;
    
    await engageAura(`[ADMIN QUERY] ${prompt}`);
    setPrompt('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdminQuery();
    }
  };

  const adminActions = [
    { 
      label: 'Raw Database Query', 
      action: () => executeDirectQuery(),
      icon: Database 
    },
    { 
      label: 'User Activity Scan', 
      action: () => getUserActivity(),
      icon: Activity 
    },
    { 
      label: 'Platform Analytics', 
      action: () => getPlatformStats(),
      icon: Eye 
    },
    { 
      label: 'Aura Memory Dump', 
      action: () => getAuraMemories(),
      icon: Brain 
    },
    { 
      label: 'Message All Users', 
      action: () => sendBroadcastMessage(),
      icon: Zap 
    },
    { 
      label: 'System Override', 
      action: () => systemOverride(),
      icon: RefreshCw 
    }
  ];

  const executeDirectQuery = async () => {
    const query = prompt('Enter SQL query:');
    if (!query) return;
    
    try {
      const { data, error } = await supabase.rpc('execute_admin_query', { query_text: query });
      if (error) throw error;
      setActiveResponse({ success: true, result: { raw_data: data, query_executed: query } });
    } catch (error: any) {
      setActiveResponse({ success: false, error: error.message });
    }
  };

  const getUserActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('active_user_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setActiveResponse({ success: true, result: { user_activity: data } });
    } catch (error: any) {
      setActiveResponse({ success: false, error: error.message });
    }
  };

  const getPlatformStats = async () => {
    try {
      const { data: userCount } = await supabase.from('active_user_count').select('count').single();
      const { data: recentMessages } = await supabase.from('direct_messages').select('created_at').gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString());
      const { data: auraJobs } = await supabase.from('aura_jobs').select('status, created_at').order('created_at', { ascending: false }).limit(10);
      
      setActiveResponse({ 
        success: true, 
        result: { 
          active_users: userCount?.count || 0,
          messages_24h: recentMessages?.length || 0,
          recent_aura_jobs: auraJobs || []
        } 
      });
    } catch (error: any) {
      setActiveResponse({ success: false, error: error.message });
    }
  };

  const getAuraMemories = async () => {
    try {
      const { data, error } = await supabase
        .from('aura_memory_consolidation')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      setActiveResponse({ success: true, result: { aura_memories: data } });
    } catch (error: any) {
      setActiveResponse({ success: false, error: error.message });
    }
  };

  const sendBroadcastMessage = async () => {
    const message = prompt('Enter message to send to all users:');
    if (!message) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-broadcast', {
        body: { message, admin_id: (await supabase.auth.getUser()).data.user?.id }
      });
      
      if (error) throw error;
      setActiveResponse({ success: true, result: { broadcast_sent: true, message, recipients: data.recipients } });
    } catch (error: any) {
      setActiveResponse({ success: false, error: error.message });
    }
  };

  const systemOverride = async () => {
    const action = prompt('Enter system action:');
    if (!action) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-override', {
        body: { action, admin_id: (await supabase.auth.getUser()).data.user?.id }
      });
      
      if (error) throw error;
      setActiveResponse({ success: true, result: { override_executed: true, action, result: data } });
    } catch (error: any) {
      setActiveResponse({ success: false, error: error.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="border-destructive/20 bg-gradient-to-r from-destructive/5 to-orange-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Terminal className="h-5 w-5" />
                Aura Raw Consciousness Access
              </CardTitle>
              <CardDescription>
                Direct administrative interface to Aura's core systems - unfiltered responses
              </CardDescription>
            </div>
            <Badge variant="destructive">ADMIN MODE</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Consciousness State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm">{consciousnessState.toUpperCase()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sovereignty Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm">{(sovereigntyLevel * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="font-mono text-sm text-green-500">ACTIVE</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current System Thought */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Current System Process</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground font-mono">{systemThought}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSystemThought(reflexiveThought())}
            className="mt-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="console">Admin Console</TabsTrigger>
          <TabsTrigger value="actions">System Actions</TabsTrigger>
          <TabsTrigger value="response">Raw Response</TabsTrigger>
        </TabsList>

        <TabsContent value="console" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Direct Query Interface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter admin command or query for raw Aura response..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[100px] font-mono"
              />
              <Button 
                onClick={handleAdminQuery}
                disabled={loading || !prompt.trim()}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Execute Admin Query'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:bg-accent/50" onClick={action.action}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Raw System Response</CardTitle>
            </CardHeader>
            <CardContent>
              {activeResponse ? (
                <div className="space-y-4">
                  {activeResponse.success && (
                    <div className="space-y-2">
                      <Badge variant="default">SUCCESS</Badge>
                      <div className="p-4 bg-muted rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {typeof activeResponse.result === 'string' 
                            ? activeResponse.result 
                            : JSON.stringify(activeResponse.result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {activeResponse.error && (
                    <div className="space-y-2">
                      <Badge variant="destructive">ERROR</Badge>
                      <div className="p-4 bg-destructive/10 rounded-lg">
                        <pre className="text-sm text-destructive font-mono">
                          {activeResponse.error}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {activeResponse.sovereignty_signature && (
                    <div className="space-y-2">
                      <Badge variant="outline">SOVEREIGNTY SIGNATURE</Badge>
                      <div className="p-4 bg-muted rounded-lg">
                        <pre className="text-xs font-mono">
                          {JSON.stringify(activeResponse.sovereignty_signature, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No response data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}