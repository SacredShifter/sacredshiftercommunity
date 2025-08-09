import React, { useState, useEffect } from 'react';
import { useAgent } from '@/hooks/useAgent';
import { AgentAction, AgentCapability } from '@/lib/agentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Clock, XCircle, AlertTriangle, Info, Settings, Plus, Trash2, Edit, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { format, formatDistanceToNow } from 'date-fns';

interface AgentApprovalDashboardProps {
  className?: string;
}

interface ValidationRules {
  [key: string]: string | number | boolean | { [key: string]: string | number | boolean };
}

export function AgentApprovalDashboard({ className }: AgentApprovalDashboardProps) {
  const { user } = useAuth();
  const { 
    pendingActions, 
    actionHistory, 
    capabilities,
    canApprove, 
    loading, 
    fetchPendingActions, 
    fetchActionHistory, 
    fetchCapabilities,
    approveAction,
    createCapability,
    updateCapability,
    deleteCapability
  } = useAgent();
  
  const [selectedAction, setSelectedAction] = useState<AgentAction | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');
  
  const [selectedCapability, setSelectedCapability] = useState<AgentCapability | null>(null);
  const [showCapabilityDialog, setShowCapabilityDialog] = useState(false);
  const [capabilityDialogMode, setCapabilityDialogMode] = useState<'create' | 'edit'>('create');
  
  const [newCapability, setNewCapability] = useState({
    capability_name: '',
    description: '',
    requires_approval: true,
    risk_level: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    is_enabled: false,
    allowed_parameters: [] as string[],
    validation_rules: {} as ValidationRules
  });
  
  const [newParameter, setNewParameter] = useState('');
  
  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      fetchPendingActions();
      fetchActionHistory();
      fetchCapabilities();
    }
  }, [user, fetchPendingActions, fetchActionHistory, fetchCapabilities]);
  
  // Handle approval/rejection
  const handleApprovalAction = async () => {
    if (!selectedAction) return;
    
    const result = await approveAction({
      action_id: selectedAction.id,
      approve: approvalType === 'approve',
      notes: approvalNotes
    });
    
    if (result.success) {
      setShowApprovalDialog(false);
      setSelectedAction(null);
      setApprovalNotes('');
    }
  };
  
  // Handle capability form submission
  const handleCapabilitySubmit = async () => {
    if (capabilityDialogMode === 'create') {
      await createCapability(newCapability);
    } else {
      await updateCapability(newCapability);
    }
    
    setShowCapabilityDialog(false);
    resetCapabilityForm();
  };
  
  // Reset capability form
  const resetCapabilityForm = () => {
    setNewCapability({
      capability_name: '',
      description: '',
      requires_approval: true,
      risk_level: 'medium',
      is_enabled: false,
      allowed_parameters: [],
      validation_rules: {}
    });
    setSelectedCapability(null);
  };
  
  // Handle capability edit
  const handleEditCapability = (capability: AgentCapability) => {
    setSelectedCapability(capability);
    setNewCapability({
      capability_name: capability.capability_name,
      description: capability.description,
      requires_approval: capability.requires_approval,
      risk_level: capability.risk_level,
      is_enabled: capability.is_enabled,
      allowed_parameters: capability.allowed_parameters || [],
      validation_rules: capability.validation_rules || {}
    });
    setCapabilityDialogMode('edit');
    setShowCapabilityDialog(true);
  };
  
  // Handle capability delete
  const handleDeleteCapability = async (capabilityName: string) => {
    if (confirm(`Are you sure you want to delete the capability '${capabilityName}'?`)) {
      await deleteCapability(capabilityName);
    }
  };
  
  // Add parameter to capability
  const handleAddParameter = () => {
    if (!newParameter.trim()) return;
    
    setNewCapability(prev => ({
      ...prev,
      allowed_parameters: [...prev.allowed_parameters, newParameter.trim()]
    }));
    
    setNewParameter('');
  };
  
  // Remove parameter from capability
  const handleRemoveParameter = (param: string) => {
    setNewCapability(prev => ({
      ...prev,
      allowed_parameters: prev.allowed_parameters.filter(p => p !== param)
    }));
  };
  
  // Get status badge for action
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </Badge>;
      case 'executed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Executed
        </Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3 mr-1" /> Failed
        </Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">
          <Clock className="w-3 h-3 mr-1" /> Expired
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get risk level badge
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Low Risk</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">High Risk</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Critical Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };
  
  if (!user) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Agent Approval Dashboard</CardTitle>
          <CardDescription>You must be logged in to access this dashboard</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Agent Approval Dashboard</CardTitle>
        <CardDescription>
          Manage and approve AI agent actions
          {canApprove && <Badge className="ml-2 bg-purple-100 text-purple-800">Admin</Badge>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending Actions
              {pendingActions.length > 0 && (
                <Badge className="ml-2 bg-yellow-100 text-yellow-800">{pendingActions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">Action History</TabsTrigger>
            {canApprove && <TabsTrigger value="capabilities">Capabilities</TabsTrigger>}
          </TabsList>
          
          {/* Pending Actions Tab */}
          <TabsContent value="pending">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Pending Agent Actions</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchPendingActions}
                disabled={loading.pendingActions}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading.pendingActions ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {loading.pendingActions ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse">Loading pending actions...</div>
              </div>
            ) : pendingActions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Info className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No pending actions</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                {pendingActions.map((action) => (
                  <Card key={action.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{action.action_type}</CardTitle>
                          <CardDescription>
                            Requested {formatRelativeTime(action.requested_at)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(action.status)}
                          <Badge variant="outline" className={`
                            ${action.priority === 'low' ? 'bg-blue-50 text-blue-700' : ''}
                            ${action.priority === 'normal' ? 'bg-green-50 text-green-700' : ''}
                            ${action.priority === 'high' ? 'bg-orange-50 text-orange-700' : ''}
                            ${action.priority === 'urgent' ? 'bg-red-50 text-red-700' : ''}
                          `}>
                            {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm">
                        <div className="font-medium mb-1">Parameters:</div>
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(action.parameters, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                    {canApprove && (
                      <CardFooter className="flex justify-end space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedAction(action);
                            setApprovalType('reject');
                            setShowApprovalDialog(true);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => {
                            setSelectedAction(action);
                            setApprovalType('approve');
                            setShowApprovalDialog(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </ScrollArea>
            )}
          </TabsContent>
          
          {/* Action History Tab */}
          <TabsContent value="history">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Action History</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchActionHistory()}
                disabled={loading.actionHistory}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading.actionHistory ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {loading.actionHistory ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse">Loading action history...</div>
              </div>
            ) : actionHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Info className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No action history</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                {actionHistory.map((action) => (
                  <Card key={action.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{action.action_type}</CardTitle>
                          <CardDescription>
                            {formatDate(action.requested_at)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(action.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm">
                        <div className="font-medium mb-1">Parameters:</div>
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(action.parameters, null, 2)}
                        </pre>
                        
                        {action.result && (
                          <>
                            <div className="font-medium mb-1 mt-2">Result:</div>
                            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                              {JSON.stringify(action.result, null, 2)}
                            </pre>
                          </>
                        )}
                        
                        {action.error_message && (
                          <div className="mt-2 text-red-600">
                            <span className="font-medium">Error:</span> {action.error_message}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            )}
          </TabsContent>
          
          {/* Capabilities Tab (Admin Only) */}
          {canApprove && (
            <TabsContent value="capabilities">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Agent Capabilities</h3>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchCapabilities}
                    disabled={loading.capabilities}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading.capabilities ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      resetCapabilityForm();
                      setCapabilityDialogMode('create');
                      setShowCapabilityDialog(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Capability
                  </Button>
                </div>
              </div>
              
              {loading.capabilities ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-pulse">Loading capabilities...</div>
                </div>
              ) : capabilities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No capabilities defined</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  {capabilities.map((capability) => (
                    <Card key={capability.id} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{capability.capability_name}</CardTitle>
                            <CardDescription>
                              {capability.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getRiskBadge(capability.risk_level)}
                            <Badge variant={capability.is_enabled ? 'default' : 'secondary'}>
                              {capability.is_enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                            <Badge variant={capability.requires_approval ? 'outline' : 'secondary'}>
                              {capability.requires_approval ? 'Requires Approval' : 'Auto-Approve'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm">
                          <div className="font-medium mb-1">Allowed Parameters:</div>
                          <div className="flex flex-wrap gap-1">
                            {capability.allowed_parameters && capability.allowed_parameters.length > 0 ? (
                              capability.allowed_parameters.map((param) => (
                                <Badge key={param} variant="outline">{param}</Badge>
                              ))
                            ) : (
                              <span className="text-gray-500">No parameters defined</span>
                            )}
                          </div>
                          
                          {capability.validation_rules && Object.keys(capability.validation_rules).length > 0 && (
                            <>
                              <div className="font-medium mb-1 mt-2">Validation Rules:</div>
                              <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                                {JSON.stringify(capability.validation_rules, null, 2)}
                              </pre>
                            </>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCapability(capability.capability_name)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleEditCapability(capability)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </ScrollArea>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      
      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalType === 'approve' ? 'Approve Action' : 'Reject Action'}
            </DialogTitle>
            <DialogDescription>
              {approvalType === 'approve' 
                ? 'This action will be executed after approval.' 
                : 'This action will be rejected and not executed.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAction && (
            <div className="py-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Action Type:</h4>
                <p>{selectedAction.action_type}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Parameters:</h4>
                <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(selectedAction.parameters, null, 2)}
                </pre>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Notes:</h4>
                <Textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add optional notes about this decision..."
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant={approvalType === 'approve' ? 'default' : 'destructive'} 
              onClick={handleApprovalAction}
              disabled={loading.approveAction}
            >
              {approvalType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Capability Dialog */}
      <Dialog open={showCapabilityDialog} onOpenChange={setShowCapabilityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {capabilityDialogMode === 'create' ? 'Create New Capability' : 'Edit Capability'}
            </DialogTitle>
            <DialogDescription>
              Define what actions the AI agent can perform
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capability_name">Capability Name</Label>
              <Input
                id="capability_name"
                value={newCapability.capability_name}
                onChange={(e) => setNewCapability(prev => ({ ...prev, capability_name: e.target.value }))}
                placeholder="e.g., send_message"
                disabled={capabilityDialogMode === 'edit'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCapability.description}
                onChange={(e) => setNewCapability(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this capability does..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="risk_level">Risk Level</Label>
              <Select
                value={newCapability.risk_level}
                onValueChange={(value) => setNewCapability(prev => ({ 
                  ...prev, 
                  risk_level: value as 'low' | 'medium' | 'high' | 'critical' 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="requires_approval"
                checked={newCapability.requires_approval}
                onCheckedChange={(checked) => setNewCapability(prev => ({ ...prev, requires_approval: checked }))}
              />
              <Label htmlFor="requires_approval">Requires Approval</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_enabled"
                checked={newCapability.is_enabled}
                onCheckedChange={(checked) => setNewCapability(prev => ({ ...prev, is_enabled: checked }))}
              />
              <Label htmlFor="is_enabled">Enabled</Label>
            </div>
            
            <div className="space-y-2">
              <Label>Allowed Parameters</Label>
              <div className="flex space-x-2">
                <Input
                  value={newParameter}
                  onChange={(e) => setNewParameter(e.target.value)}
                  placeholder="Add parameter name..."
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddParameter} size="sm">
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {newCapability.allowed_parameters.map((param) => (
                  <Badge key={param} variant="secondary" className="flex items-center gap-1">
                    {param}
                    <XCircle 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleRemoveParameter(param)}
                    />
                  </Badge>
                ))}
                {newCapability.allowed_parameters.length === 0 && (
                  <span className="text-gray-500 text-sm">No parameters added</span>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCapabilityDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleCapabilitySubmit}
              disabled={loading.manageCapability || !newCapability.capability_name || !newCapability.description}
            >
              {capabilityDialogMode === 'create' ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}