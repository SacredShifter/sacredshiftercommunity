import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Calendar, Sparkles, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCodex } from '@/hooks/useCodex';
import { CodexEntryModal } from './CodexEntryModal';
import { format } from 'date-fns/format';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';
import { ContextualHelp, HelpTooltips } from '@/components/HelpSystem/ContextualHelp';

const ENTRY_TYPES = [
  'Dream', 'Lesson', 'Download', 'Integration', 'Fragment', 'Vision', 'Revelation', 'Memory'
];

const SOURCE_MODULES = [
  'Mirror Journal', 'Breath of Source', 'Sacred Circles', 'Collective Codex', 'Manual'
];

export function CodexList() {
  const { entries, loading, createEntry, updateEntry, deleteEntry } = useCodex();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sortField, setSortField] = useState<'created_at' | 'title' | 'type'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedEntries = useMemo(() => {
    const filtered = entries.filter(entry => {
      const matchesSearch = !searchQuery || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.resonance_tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = !typeFilter || typeFilter === 'all' || entry.type === typeFilter;
      const matchesSource = !sourceFilter || sourceFilter === 'all' || entry.source_module === sourceFilter;
      
      return matchesSearch && matchesType && matchesSource;
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [entries, searchQuery, typeFilter, sourceFilter, sortField, sortOrder]);

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

  const handleSort = (field: 'created_at' | 'title' | 'type') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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
          
          <TooltipWrapper content={HelpTooltips.create}>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </TooltipWrapper>
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
          <TooltipWrapper content={HelpTooltips.search}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your codex..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </TooltipWrapper>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <TooltipWrapper content={HelpTooltips.filter}>
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
            </TooltipWrapper>
            
            <TooltipWrapper content="Filter entries by where they originated in your spiritual practice">
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
            </TooltipWrapper>
            
            {(searchQuery || typeFilter !== 'all' || sourceFilter !== 'all') && (
              <TooltipWrapper content="Clear all active filters and show all entries">
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </TooltipWrapper>
            )}
          </div>
        </div>
        
        {filteredAndSortedEntries.length !== entries.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {filteredAndSortedEntries.length} of {entries.length} entries
            </Badge>
            {searchQuery && <Badge variant="outline">Search: "{searchQuery}"</Badge>}
            {typeFilter !== 'all' && <Badge variant="outline">Type: {typeFilter}</Badge>}
            {sourceFilter !== 'all' && <Badge variant="outline">Source: {sourceFilter}</Badge>}
          </div>
        )}
      </motion.div>

      {/* Contextual Help */}
      {entries.length === 0 && (
        <ContextualHelp
          title="Welcome to Your Personal Codex"
          description="This is your private spiritual memory bank. Start by creating your first entry to capture insights, dreams, or downloads from your consciousness journey."
          tips={[
            "Use different entry types to organize your experiences (Dreams, Lessons, Downloads, etc.)",
            "Add resonance tags to help find related entries later",
            "The timeline view helps you see patterns over time",
            "All entries are completely private to you"
          ]}
          className="max-w-2xl mx-auto mb-8"
        />
      )}

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
      ) : filteredAndSortedEntries.length === 0 ? (
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
          className="bg-card/30 backdrop-blur border rounded-lg overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-2">
                    Type
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-2">
                    Created
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEntries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-border/30 hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="max-w-[300px]">
                      <div className="font-semibold truncate">{entry.title}</div>
                      {entry.content && (
                        <div className="text-sm text-muted-foreground truncate mt-1">
                          {entry.content.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {entry.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {entry.source_module || 'Manual'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {entry.resonance_tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.resonance_tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.resonance_tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur border-border/50">
                        <DropdownMenuItem 
                          onClick={() => handleEditEntry(entry)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteEntry(entry.id)}
                          className="cursor-pointer text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
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