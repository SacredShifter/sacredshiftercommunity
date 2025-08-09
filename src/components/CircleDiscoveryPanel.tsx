import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateCircleModal } from './CreateCircleModal';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, Plus, Lock, Globe, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CircleDiscoveryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SacredCircle {
  id: string;
  name: string;
  description?: string;
  chakra_focus?: string;
  is_private: boolean;
  is_member: boolean;
  member_count: number;
  frequency_range?: string;
}

export const CircleDiscoveryPanel: React.FC<CircleDiscoveryPanelProps> = ({
  open,
  onOpenChange
}) => {
  const { circles, loading, joinCircle, leaveCircle, fetchCircles } = useSacredCircles();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [chakraFilter, setChakraFilter] = useState('all');
  const [privacyFilter, setPrivacyFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load circles when panel opens
  useEffect(() => {
    if (open) {
      fetchCircles();
    }
  }, [open, fetchCircles]);

  // Filter circles based on search and filters
  const filteredCircles = circles.filter((circle: SacredCircle) => {
    const matchesSearch = circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         circle.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesChakra = chakraFilter === 'all' || circle.chakra_focus === chakraFilter;
    
    const matchesPrivacy = privacyFilter === 'all' || 
                          (privacyFilter === 'public' && !circle.is_private) ||
                          (privacyFilter === 'private' && circle.is_private);

    return matchesSearch && matchesChakra && matchesPrivacy;
  });

  const handleJoinLeave = async (circle: SacredCircle) => {
    try {
      if (circle.is_member) {
        const success = await leaveCircle(circle.id);
        if (success) {
          // Refresh circles to update membership status
          await fetchCircles();
        }
      } else {
        const success = await joinCircle(circle.id);
        if (success) {
          // Refresh circles to update membership status
          await fetchCircles();
        }
      }
    } catch (error) {
      console.error('Error joining/leaving circle:', error);
      toast({
        title: "Error",
        description: "Failed to update circle membership. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getChakraColor = (chakra: string) => {
    const chakraColors: Record<string, string> = {
      'root': '#E53E3E',
      'sacral': '#FF8C00',
      'solar': '#FFD700',
      'heart': '#38A169',
      'throat': '#3182CE',
      'third-eye': '#805AD5',
      'crown': '#9F7AEA'
    };
    return chakraColors[chakra.toLowerCase()] || '#718096';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Discover Sacred Circles
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search circles by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={chakraFilter} onValueChange={setChakraFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Chakra" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chakras</SelectItem>
                    <SelectItem value="root">Root</SelectItem>
                    <SelectItem value="sacral">Sacral</SelectItem>
                    <SelectItem value="solar">Solar Plexus</SelectItem>
                    <SelectItem value="heart">Heart</SelectItem>
                    <SelectItem value="throat">Throat</SelectItem>
                    <SelectItem value="third-eye">Third Eye</SelectItem>
                    <SelectItem value="crown">Crown</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Privacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Circles Grid */}
            <ScrollArea className="h-[400px] p-6">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredCircles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🌸</div>
                  <h3 className="text-lg font-semibold mb-2">No circles found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || chakraFilter !== 'all' || privacyFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Be the first to create a sacred circle'}
                  </p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Circle
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCircles.map((circle) => (
                    <Card key={circle.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              {circle.is_private ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Globe className="h-4 w-4 text-muted-foreground" />
                              )}
                              {circle.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {circle.member_count || 0} members
                              </span>
                              {circle.is_member && (
                                <Badge variant="secondary" className="text-xs">
                                  Joined
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {circle.description && (
                          <CardDescription className="mb-3 line-clamp-2">
                            {circle.description}
                          </CardDescription>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                          {circle.chakra_focus && (
                            <Badge 
                              variant="outline"
                              style={{ 
                                borderColor: getChakraColor(circle.chakra_focus),
                                color: getChakraColor(circle.chakra_focus)
                              }}
                            >
                              {circle.chakra_focus} Chakra
                            </Badge>
                          )}
                          {circle.frequency_range && (
                            <Badge variant="secondary">
                              {circle.frequency_range}
                            </Badge>
                          )}
                        </div>

                        <Button
                          onClick={() => handleJoinLeave(circle)}
                          variant={circle.is_member ? "outline" : "default"}
                          className={circle.is_member ? "" : "bg-gradient-to-r from-primary to-primary/80"}
                          size="sm"
                          disabled={loading}
                        >
                          {circle.is_member ? 'Leave Circle' : 'Join Circle'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <CreateCircleModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
};