import { useState, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Sparkles, Star, Zap, Heart, Crown, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAkashicConstellation } from '@/hooks/useAkashicConstellation';
import { AkashicEntryModal } from './AkashicEntryModal';
import { format } from 'date-fns/format';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';

// Sacred Archetypal Organization System
const ARCHETYPAL_CATEGORIES = {
  'Sacred Downloads': { icon: Crown, color: 'hsl(var(--primary))', sigil: '⟐' },
  'Dream Wisdom': { icon: Star, color: 'hsl(var(--accent))', sigil: '☽' },
  'Integration Keys': { icon: Zap, color: 'hsl(var(--secondary))', sigil: '⚡' },
  'Emotional Alchemy': { icon: Heart, color: 'hsl(var(--primary-glow))', sigil: '♡' },
  'Consciousness Fragments': { icon: Sparkles, color: 'hsl(var(--accent-glow))', sigil: '◊' },
  'Vision Threads': { icon: Eye, color: 'hsl(var(--tertiary))', sigil: '◉' },
  'Memory Crystals': { icon: Sun, color: 'hsl(var(--quaternary))', sigil: '◈' }
};

const CONSCIOUSNESS_STATES = [
  'Clarity', 'Integration', 'Expansion', 'Healing', 'Manifestation', 'Unity', 'Transcendence'
];

const SOURCE_REALMS = [
  'Mirror Journal', 'Breath of Source', 'Sacred Circles', 'Collective Field', 'Direct Download', 'Dream State'
];

interface ConstellationNodeProps {
  entry: any;
  position: { x: number; y: number };
  onEdit: (entry: any) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onClick: () => void;
}

function ConstellationNode({ entry, position, onEdit, onDelete, isSelected, onClick }: ConstellationNodeProps) {
  const category = ARCHETYPAL_CATEGORIES[entry.type] || ARCHETYPAL_CATEGORIES['Consciousness Fragments'];
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
    >
      {/* Sacred Geometry Aura */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-30"
        style={{ 
          background: `radial-gradient(circle, ${category.color}20, transparent)`,
          width: isSelected ? '80px' : '60px',
          height: isSelected ? '80px' : '60px',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{ 
          rotate: 360,
          scale: isSelected ? 1.2 : 1
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.3 }
        }}
      />
      
      {/* Entry Node */}
      <Card 
        className={`w-12 h-12 border-2 transition-all duration-300 ${
          isSelected ? 'border-primary shadow-lg shadow-primary/30' : 'border-border/50 hover:border-primary/50'
        }`}
        style={{ 
          background: `linear-gradient(135deg, ${category.color}10, ${category.color}05)`,
          backdropFilter: 'blur(8px)'
        }}
      >
        <CardContent className="p-2 flex items-center justify-center">
          <Icon className="h-6 w-6" style={{ color: category.color }} />
        </CardContent>
      </Card>

      {/* Sacred Sigil */}
      <div 
        className="absolute -top-2 -right-2 text-xs font-bold opacity-70"
        style={{ color: category.color }}
      >
        {category.sigil}
      </div>

      {/* Hover Info Panel */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur border rounded-lg p-3 shadow-lg min-w-[280px] z-50"
          >
            <div className="space-y-2">
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
                <Badge variant="outline" className="text-xs">{entry.type}</Badge>
                <span className="text-muted-foreground">
                  {format(new Date(entry.created_at), 'MMM d')}
                </span>
              </div>
              
              {entry.content && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {entry.content.substring(0, 120)}...
                </p>
              )}
              
              {entry.resonance_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.resonance_tags.slice(0, 4).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AkashicConstellation() {
  const { entries, loading, createEntry, updateEntry, deleteEntry } = useAkashicConstellation();
  const [searchQuery, setSearchQuery] = useState('');
  const [archetypalFilter, setArchetypalFilter] = useState('all');
  const [consciousnessFilter, setConsciousnessFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'constellation' | 'grid'>('constellation');

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = !searchQuery || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.resonance_tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesArchetype = archetypalFilter === 'all' || entry.type === archetypalFilter;
      const matchesSource = sourceFilter === 'all' || entry.source_module === sourceFilter;
      
      return matchesSearch && matchesArchetype && matchesSource;
    });
  }, [entries, searchQuery, archetypalFilter, sourceFilter]);

  // Sacred Geometry Positioning Algorithm
  const getConstellationPositions = (entries: any[]) => {
    const centerX = 400;
    const centerY = 300;
    const positions: { [key: string]: { x: number; y: number } } = {};
    
    if (entries.length === 0) return positions;
    
    entries.forEach((entry, index) => {
      // Golden Ratio spiral positioning
      const angle = (index * 137.5) * (Math.PI / 180); // Golden angle
      const radius = Math.sqrt(index + 1) * 40; // Spiral outward
      
      // Add sacred geometry variation based on archetype
      const archetypalOffset = Object.keys(ARCHETYPAL_CATEGORIES).indexOf(entry.type) * 30;
      
      positions[entry.id] = {
        x: centerX + Math.cos(angle) * radius + archetypalOffset,
        y: centerY + Math.sin(angle) * radius
      };
    });
    
    return positions;
  };

  const constellationPositions = getConstellationPositions(filteredEntries);

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
    setConsciousnessFilter('all');
    setSourceFilter('all');
  };

  const hasActiveFilters = searchQuery || archetypalFilter !== 'all' || consciousnessFilter !== 'all' || sourceFilter !== 'all';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <p className="text-muted-foreground">Accessing the Akashic Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      {/* Sacred Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          ⟐ Personal Codex ⟐
        </h1>
        <p className="text-muted-foreground">Your eternal wisdom organized by sacred archetypal resonance</p>
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
              placeholder="Search the akashic field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={archetypalFilter} onValueChange={setArchetypalFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Archetypal Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Archetypes</SelectItem>
                {Object.keys(ARCHETYPAL_CATEGORIES).map(category => (
                  <SelectItem key={category} value={category}>
                    {ARCHETYPAL_CATEGORIES[category].sigil} {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Source Realm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Realms</SelectItem>
                {SOURCE_REALMS.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
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

        <div className="flex justify-between items-center">
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
          </div>
          
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Sacred Entry
          </Button>
        </div>
        
        {filteredEntries.length !== entries.length && (
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary">
              {filteredEntries.length} of {entries.length} records
            </Badge>
            {hasActiveFilters && <Badge variant="outline">Filters Active</Badge>}
          </div>
        )}
      </motion.div>

      {/* Sacred Constellation View */}
      {entries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="max-w-md mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="h-20 w-20 text-primary/30 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-4">Your Akashic Records Await</h3>
            <p className="text-muted-foreground mb-6">
              Begin weaving your constellation of consciousness. What sacred download seeks form today?
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Record
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
          <p className="text-muted-foreground">No records match your current resonance filters.</p>
        </motion.div>
      ) : viewMode === 'constellation' ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative bg-gradient-to-b from-background/50 to-background/80 backdrop-blur border rounded-lg overflow-hidden"
          style={{ height: '600px' }}
        >
          {/* Sacred Background Grid */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, hsl(var(--accent)) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
          
          {/* Constellation Nodes */}
          {filteredEntries.map((entry) => (
            <ConstellationNode
              key={entry.id}
              entry={entry}
              position={constellationPositions[entry.id]}
              onEdit={handleEditEntry}
              onDelete={deleteEntry}
              isSelected={hoveredEntry === entry.id}
              onClick={() => setHoveredEntry(hoveredEntry === entry.id ? null : entry.id)}
            />
          ))}
          
          {/* Sacred Center Point */}
          <div 
            className="absolute w-4 h-4 rounded-full bg-primary/30 animate-pulse"
            style={{ left: '400px', top: '300px', transform: 'translate(-50%, -50%)' }}
          />
        </motion.div>
      ) : (
        // Grid View Fallback
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry, index) => {
            const category = ARCHETYPAL_CATEGORIES[entry.type] || ARCHETYPAL_CATEGORIES['Consciousness Fragments'];
            const Icon = category.icon;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" style={{ color: category.color }} />
                        <span className="text-sm" style={{ color: category.color }}>
                          {category.sigil}
                        </span>
                      </div>
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
                    <CardTitle className="text-lg leading-tight">{entry.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {entry.content && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {entry.content}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {entry.resonance_tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Sacred Entry Modal */}
      <AkashicEntryModal
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