import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCodex } from '@/hooks/useCodex';
import { CodexEntryCard } from './CodexEntryCard';
import { CodexEntryModal } from './CodexEntryModal';
import { format } from 'date-fns';

const ENTRY_TYPES = [
  'Dream', 'Lesson', 'Download', 'Integration', 'Fragment', 'Vision', 'Revelation', 'Memory'
];

const SOURCE_MODULES = [
  'Mirror Journal', 'Breath of Source', 'Sacred Circles', 'Registry of Resonance', 'Manual'
];

export function CodexList() {
  const { entries, loading, createEntry, updateEntry, deleteEntry } = useCodex();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = !searchQuery || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.resonance_tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = !typeFilter || typeFilter === 'all' || entry.type === typeFilter;
      const matchesSource = !sourceFilter || sourceFilter === 'all' || entry.source_module === sourceFilter;
      
      return matchesSearch && matchesType && matchesSource;
    });
  }, [entries, searchQuery, typeFilter, sourceFilter]);

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
    setTypeFilter('all');
    setSourceFilter('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Sparkles className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your sacred codex...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Personal Codex
            </h1>
            <p className="text-muted-foreground mt-2">Your sacred memory archive and metaphysical metadata system</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Timeline
            </Button>
            
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 backdrop-blur border rounded-lg p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your codex..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Entry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {ENTRY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Source Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {SOURCE_MODULES.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(searchQuery || typeFilter !== 'all' || sourceFilter !== 'all') && (
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {filteredEntries.length !== entries.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {filteredEntries.length} of {entries.length} entries
            </Badge>
            {searchQuery && <Badge variant="outline">Search: "{searchQuery}"</Badge>}
            {typeFilter !== 'all' && <Badge variant="outline">Type: {typeFilter}</Badge>}
            {sourceFilter !== 'all' && <Badge variant="outline">Source: {sourceFilter}</Badge>}
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {entries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto">
            <Sparkles className="h-16 w-16 text-primary/30 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">Your Codex Awaits</h3>
            <p className="text-muted-foreground mb-6">
              Begin documenting your journey. What pattern keeps reappearing in your dreams? 
              Which resonance returned today?
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Entry
            </Button>
          </div>
        </motion.div>
      ) : filteredEntries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-muted-foreground">No entries match your current filters.</p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CodexEntryCard
                    entry={entry}
                    onEdit={handleEditEntry}
                    onDelete={deleteEntry}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card/30 backdrop-blur hover:bg-card/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-sm font-medium text-primary">
                      {format(new Date(entry.created_at), 'MMM')}
                    </div>
                    <div className="text-2xl font-bold">
                      {format(new Date(entry.created_at), 'd')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CodexEntryCard
                      entry={entry}
                      onEdit={handleEditEntry}
                      onDelete={deleteEntry}
                      compact
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Entry Modal */}
      <CodexEntryModal
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