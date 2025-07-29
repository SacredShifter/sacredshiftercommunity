import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useAuth } from '@/hooks/useAuth';
import { Search, Users, Lock, Globe, Plus, X } from 'lucide-react';
import { CreateCircleModal } from './CreateCircleModal';

interface CircleDiscoveryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CircleDiscoveryPanel = ({ open, onOpenChange }: CircleDiscoveryPanelProps) => {
  const { user } = useAuth();
  const { circles, loading, joinCircle, leaveCircle } = useSacredCircles();
  const [searchQuery, setSearchQuery] = useState('');
  const [chakraFilter, setChakraFilter] = useState<string>('all');
  const [privacyFilter, setPrivacyFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const chakras = ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'];

  const filteredCircles = circles.filter(circle => {
    const matchesSearch = !searchQuery || 
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesChakra = chakraFilter === 'all' || 
      circle.chakra_focus === chakraFilter;
    
    const matchesPrivacy = privacyFilter === 'all' ||
      (privacyFilter === 'public' && !circle.is_private) ||
      (privacyFilter === 'private' && circle.is_private);

    return matchesSearch && matchesChakra && matchesPrivacy;
  });

  const getChakraColor = (chakra?: string) => {
    const colors: Record<string, string> = {
      'Root': 'hsl(0, 84%, 60%)',
      'Sacral': 'hsl(25, 95%, 53%)',
      'Solar Plexus': 'hsl(60, 100%, 50%)',
      'Heart': 'hsl(120, 61%, 50%)',
      'Throat': 'hsl(195, 100%, 50%)',
      'Third Eye': 'hsl(240, 100%, 50%)',
      'Crown': 'hsl(280, 100%, 50%)',
    };
    return colors[chakra || ''] || 'hsl(var(--primary))';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleJoinLeave = async (circle: typeof circles[0]) => {
    try {
      if (circle.is_member) {
        await leaveCircle(circle.id);
      } else {
        await joinCircle(circle.id);
      }
    } catch (error) {
      console.error('Error joining/leaving circle:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden p-0">
          <div className="bg-gradient-to-br from-background/95 to-muted/50 backdrop-blur-xl border border-white/10">
            <DialogHeader className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Sacred Circles
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Discover communities of consciousness and resonance
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-primary to-primary/80"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Circle
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Filters */}
            <div className="p-6 border-b border-white/10 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search circles by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Select value={chakraFilter} onValueChange={setChakraFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by chakra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Chakras</SelectItem>
                      {chakras.map(chakra => (
                        <SelectItem key={chakra} value={chakra}>
                          {chakra} Chakra
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Circles</SelectItem>
                      <SelectItem value="public">Public Circles</SelectItem>
                      <SelectItem value="private">Private Circles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                    <Card key={circle.id} className="hover:shadow-lg transition-all duration-300 hover:shadow-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback 
                                className="text-white font-bold"
                                style={{ 
                                  background: `linear-gradient(135deg, ${getChakraColor(circle.chakra_focus)} 0%, ${getChakraColor(circle.chakra_focus)}80 100%)`
                                }}
                              >
                                {getInitials(circle.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <CardTitle className="text-lg truncate">{circle.name}</CardTitle>
                                {circle.is_private ? (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Globe className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {circle.member_count || 0} members
                                </span>
                              </div>
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