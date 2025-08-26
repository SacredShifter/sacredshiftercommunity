import { useState, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Sparkles, Star, Zap, Heart, Crown, Sun, Users, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { CollectiveAkashicEntryModal } from './CollectiveAkashicEntryModal';
import { format } from 'date-fns/format';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';

// Sacred Archetypal Organization for Collective Wisdom
const COLLECTIVE_ARCHETYPAL_CATEGORIES = {
  'Sacred Teachings': { icon: Crown, color: 'hsl(var(--primary))', sigil: '⟐', description: 'Universal wisdom downloads' },
  'Collective Dreams': { icon: Star, color: 'hsl(var(--accent))', sigil: '☽', description: 'Shared dream experiences' },
  'Integration Patterns': { icon: Zap, color: 'hsl(var(--secondary))', sigil: '⚡', description: 'Community integration keys' },
  'Emotional Resonance': { icon: Heart, color: 'hsl(var(--primary-glow))', sigil: '♡', description: 'Collective heart healing' },
  'Consciousness Threads': { icon: Sparkles, color: 'hsl(var(--accent-glow))', sigil: '◊', description: 'Shared awareness fragments' },
  'Vision Prophecy': { icon: Eye, color: 'hsl(var(--tertiary))', sigil: '◉', description: 'Collective future visions' },
  'Ancient Memory': { icon: Sun, color: 'hsl(var(--quaternary))', sigil: '◈', description: 'Ancestral wisdom crystals' }
};

const COLLECTIVE_ACCESS_LEVELS = [
  'Public', 'Sacred Circle', 'Initiates Only', 'Community Leaders'
];

const VERIFICATION_STATES = [
  'All Records', 'Verified Only', 'Pending Review', 'Community Curated'
];

interface CollectiveConstellationNodeProps {
  entry: any;
  position: { x: number; y: number };
  onEdit: (entry: any) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function CollectiveConstellationNode({ entry, position, onEdit, onDelete, isSelected, onClick, onMouseEnter, onMouseLeave }: CollectiveConstellationNodeProps) {
  const category = COLLECTIVE_ARCHETYPAL_CATEGORIES[entry.entry_type] || COLLECTIVE_ARCHETYPAL_CATEGORIES['Consciousness Threads'];
  const Icon = category.icon;

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Collective Sacred Geometry Aura */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-40"
        style={{ 
          background: `radial-gradient(circle, ${category.color}30, ${category.color}10, transparent)`,
          width: isSelected ? '100px' : '70px',
          height: isSelected ? '100px' : '70px',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{ 
          rotate: 360,
          scale: isSelected ? 1.3 : 1
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.3 }
        }}
      />
      
      {/* Collective Entry Node */}
      <Card 
        className={`w-14 h-14 border-2 transition-all duration-300 ${
          isSelected ? 'border-primary shadow-xl shadow-primary/40' : 'border-border/50 hover:border-primary/60'
        }`}
        style={{ 
          background: `linear-gradient(135deg, ${category.color}15, ${category.color}08)`,
          backdropFilter: 'blur(12px)'
        }}
      >
        <CardContent className="p-2 flex items-center justify-center relative">
          <Icon className="h-7 w-7" style={{ color: category.color }} />
          {entry.is_verified && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="h-2 w-2 text-background" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sacred Sigil with Collective Indicator */}
      <div 
        className="absolute -top-2 -right-2 text-sm font-bold opacity-80 flex items-center gap-1"
      >
        <span style={{ color: category.color }}>{category.sigil}</span>
        <Globe className="h-3 w-3 text-accent" />
      </div>

      {/* Enhanced Hover Info Panel for Collective */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: -70, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur border rounded-lg p-4 shadow-xl min-w-[320px] z-50"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm truncate flex-1 mr-2">{entry.title}</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Sparkles className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur">
                    <DropdownMenuItem onClick={() => onEdit(entry)} className="cursor-pointer">
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(entry.id)}
                      className="cursor-pointer text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="text-xs">{entry.entry_type}</Badge>
                {entry.is_verified && <Badge variant="default" className="text-xs">Verified</Badge>}
                <span className="text-muted-foreground">
                  {format(new Date(entry.created_at), 'MMM d')}
                </span>
              </div>

              {/* Resonance Rating */}
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-muted rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(entry.resonance_rating / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium">
                  {entry.resonance_rating}/10
                </span>
              </div>
              
              {entry.content && (
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {entry.content.substring(0, 150)}...
                </p>
              )}
              
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.tags.slice(0, 4).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Collective Specific Info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
                <Users className="h-3 w-3" />
                <span>Community Contribution</span>
                {entry.resonance_count && (
                  <Badge variant="outline" className="text-xs">
                    {entry.resonance_count} resonances
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CollectiveAkashicConstellation() {
  const navigate = useNavigate();
  const { entries, loading, createEntry, updateEntry, deleteEntry, fetchEntries } = useRegistryOfResonance();
  const [searchQuery, setSearchQuery] = useState('');
  const [archetypalFilter, setArchetypalFilter] = useState('all');
  const [accessLevelFilter, setAccessLevelFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('All Records');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'constellation' | 'grid'>('grid');
  const [activeTab, setActiveTab] = useState('collective');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchEntries(value as 'my' | 'collective' | 'drafts');
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = !searchQuery || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesArchetype = archetypalFilter === 'all' || entry.entry_type === archetypalFilter;
      const matchesAccess = accessLevelFilter === 'all' || entry.access_level === accessLevelFilter;
      const matchesVerification = 
        verificationFilter === 'All Records' ||
        (verificationFilter === 'Verified Only' && entry.is_verified) ||
        (verificationFilter === 'Pending Review' && !entry.is_verified);
      
      return matchesSearch && matchesArchetype && matchesAccess && matchesVerification;
    });
  }, [entries, searchQuery, archetypalFilter, accessLevelFilter, verificationFilter]);

  // Enhanced Sacred Geometry Positioning for Collective Consciousness
  const getCollectiveConstellationPositions = (entries: any[]) => {
    const centerX = 450;
    const centerY = 350;
    const positions: { [key: string]: { x: number; y: number } } = {};
    
    if (entries.length === 0) return positions;
    
    entries.forEach((entry, index) => {
      // Phi-spiral with collective consciousness layers
      const angle = (index * 137.508) * (Math.PI / 180); // Golden angle + precision
      const radius = Math.sqrt(index + 1) * 45; // Wider spiral for collective
      
      // Sacred geometry variation based on verification and resonance
      const verificationBonus = entry.is_verified ? 15 : 0;
      const resonanceRadius = (entry.resonance_rating / 10) * 20;
      
      positions[entry.id] = {
        x: centerX + Math.cos(angle) * (radius + resonanceRadius) + verificationBonus,
        y: centerY + Math.sin(angle) * (radius + resonanceRadius)
      };
    });
    
    return positions;
  };

  const constellationPositions = getCollectiveConstellationPositions(filteredEntries);

  const handleCreateEntry = async (data) => {
    await createEntry(data);
    setIsModalOpen(false);
  };

  const handleUpdateEntry = async (data) => {
    if (selectedEntry) {
      await updateEntry(selectedEntry.id, data);
      setSelectedEntry(null);
      setIsModalOpen(false);
    }
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setArchetypalFilter('all');
    setAccessLevelFilter('all');
    setVerificationFilter('All Records');
  };

  const hasActiveFilters = searchQuery || archetypalFilter !== 'all' || accessLevelFilter !== 'all' || verificationFilter !== 'All Records';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <p className="text-muted-foreground">Synchronizing with the Collective Akashic Field...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      {/* Sacred Collective Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent via-secondary to-primary bg-clip-text text-transparent mb-2">
          ⟐ Collective Codex ⟐
        </h1>
        <p className="text-muted-foreground">Humanity's shared wisdom organized by collective archetypal resonance</p>
        <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>Truth-aligned frequency records, organized by resonance, not opinion</span>
        </div>
      </motion.div>

      {/* Sacred Control Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/30 backdrop-blur border rounded-lg p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search the collective akashic field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={archetypalFilter} onValueChange={setArchetypalFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Collective Archetype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Archetypes</SelectItem>
                {Object.entries(COLLECTIVE_ARCHETYPAL_CATEGORIES).map(([category, data]) => (
                  <SelectItem key={category} value={category}>
                    {data.sigil} {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Verification Status" />
              </SelectTrigger>
              <SelectContent>
                {VERIFICATION_STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* View Mode & Tab Controls */}
        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-fit">
            <TabsList>
              <TabsTrigger value="collective" className="gap-2">
                <Globe className="h-4 w-4" />
                Collective Archive
              </TabsTrigger>
              <TabsTrigger value="my" className="gap-2">
                <Users className="h-4 w-4" />
                My Contributions
              </TabsTrigger>
              <TabsTrigger value="drafts" className="gap-2">
                <Edit className="h-4 w-4" />
                Drafts
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'constellation' ? 'default' : 'outline'}
              onClick={() => setViewMode('constellation')}
              size="sm"
            >
              <Star className="h-4 w-4 mr-2" />
              Constellation
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 ml-2">
              <Plus className="h-4 w-4" />
              Contribute Sacred Entry
            </Button>
          </div>
        </div>
        
        {filteredEntries.length !== entries.length && (
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary">
              {filteredEntries.length} of {entries.length} collective records
            </Badge>
            {hasActiveFilters && <Badge variant="outline">Filters Active</Badge>}
          </div>
        )}
      </motion.div>

      {/* Sacred Collective Constellation View */}
      {entries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="max-w-md mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="h-20 w-20 text-primary/30 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-4">The Collective Field Awaits</h3>
            <p className="text-muted-foreground mb-6">
              Begin contributing to humanity's shared wisdom constellation. What sacred truth seeks collective recognition?
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Make Your First Contribution
            </Button>
          </div>
        </motion.div>
      ) : filteredEntries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No collective records match your current resonance filters.</p>
        </motion.div>
      ) : viewMode === 'constellation' ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative bg-gradient-to-b from-background/40 to-background/80 backdrop-blur border rounded-lg overflow-hidden"
          style={{ height: '700px' }}
        >
          {/* Enhanced Sacred Background Grid for Collective */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, hsl(var(--accent)) 1px, transparent 1px),
                radial-gradient(circle at 50% 50%, hsl(var(--secondary)) 0.5px, transparent 0.5px)
              `,
              backgroundSize: '80px 80px, 80px 80px, 40px 40px'
            }}
          />
          
          {/* Collective Constellation Nodes */}
          {filteredEntries.map((entry) => (
            <CollectiveConstellationNode
              key={entry.id}
              entry={entry}
              position={constellationPositions[entry.id]}
              onEdit={handleEditEntry}
              onDelete={deleteEntry}
              isSelected={hoveredEntry === entry.id}
              onClick={() => navigate(`/resonance/entries/${entry.id}`)}
              onMouseEnter={() => setHoveredEntry(entry.id)}
              onMouseLeave={() => setHoveredEntry(null)}
            />
          ))}
          
          {/* Sacred Collective Center Point */}
          <div 
            className="absolute w-6 h-6 rounded-full bg-primary/40 animate-pulse flex items-center justify-center"
            style={{ left: '450px', top: '350px', transform: 'translate(-50%, -50%)' }}
          >
            <Globe className="h-4 w-4 text-primary" />
          </div>
        </motion.div>
      ) : (
        // Enhanced Grid View for Collective
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry, index) => {
            const category = COLLECTIVE_ARCHETYPAL_CATEGORIES[entry.entry_type] || COLLECTIVE_ARCHETYPAL_CATEGORIES['Consciousness Threads'];
            const Icon = category.icon;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/resonance/entries/${entry.id}`)}
              >
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border border-border/50 hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" style={{ color: category.color }} />
                        <span className="text-sm" style={{ color: category.color }}>
                          {category.sigil}
                        </span>
                        <Globe className="h-3 w-3 text-accent opacity-60" />
                      </div>
                      <div className="flex items-center gap-1">
                        {entry.is_verified && (
                          <Badge variant="default" className="text-xs">Verified</Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Sparkles className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditEntry(entry)}>
                              <Edit className="h-3 w-3 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteEntry(entry.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{entry.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Resonance Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(entry.resonance_rating / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {entry.resonance_rating}/10
                      </span>
                    </div>

                    {entry.content && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {entry.content}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {entry.tags?.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{format(new Date(entry.created_at), 'MMM d, yyyy')}</span>
                      {entry.resonance_count && (
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{entry.resonance_count}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Sacred Collective Entry Modal */}
      <CollectiveAkashicEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEntry(null);
        }}
        onSubmit={selectedEntry ? handleUpdateEntry : handleCreateEntry}
        initialData={selectedEntry}
      />
    </div>
  );
}