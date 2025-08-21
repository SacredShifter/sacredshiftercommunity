import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Sparkles, MoreHorizontal, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegistryOfResonance, RegistryEntry } from '@/hooks/useRegistryOfResonance';
import { EntryModal } from './EntryModal';
import { EntryForm } from './EntryForm';
import { motion } from 'framer-motion';
import { format } from 'date-fns/format';

export function RegistryList() {
  const { entries, categories, loading, fetchEntries } = useRegistryOfResonance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RegistryEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<RegistryEntry | null>(null);
  const [activeTab, setActiveTab] = useState('my');
  const [sortField, setSortField] = useState<'created_at' | 'title' | 'type'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchEntries(value as 'my' | 'collective' | 'drafts');
  };

  const handleSort = (field: 'created_at' | 'title' | 'type') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Get all unique tags from entries
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags || [])));

  // Get categories for display
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    const filtered = entries.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => entry.tags?.includes(tag));
      const matchesVerified = !verifiedOnly || entry.is_verified;
      const matchesCategory = selectedCategory === 'all' || !selectedCategory || entry.category_id === selectedCategory;
      
      return matchesSearch && matchesTags && matchesVerified && matchesCategory;
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'type':
          aValue = a.entry_type || '';
          bValue = b.entry_type || '';
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
  }, [entries, searchTerm, selectedTags, selectedCategory, verifiedOnly, sortField, sortOrder]);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Collective Codex
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 blur-3xl -z-10" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personal archive of Truth-aligned frequency records, organized by resonance, not opinion.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search entries by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 backdrop-blur-sm border-primary/20"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.level > 0 ? '  ' : ''}{category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant={verifiedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Verified Only
            </Button>
            
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </Button>
          </div>
        </motion.div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
              >
                {tag}
              </Badge>
            ))}
          </motion.div>
        )}

        {/* View Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-fit md:grid-cols-3">
              <TabsTrigger value="my" className="gap-2">
                My Records
              </TabsTrigger>
              <TabsTrigger value="collective" className="gap-2">
                Collective Archive
              </TabsTrigger>
              <TabsTrigger value="drafts" className="gap-2">
                Drafts & Private
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="animate-pulse flex flex-col items-center space-y-4">
                    <Sparkles className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading collective archive...</p>
                  </div>
                </div>
              ) : filteredAndSortedEntries.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle>No entries found</CardTitle>
                      <CardDescription>
                        {activeTab === 'my' ? 'Start building your resonance archive' : 
                         activeTab === 'collective' ? 'No verified public entries yet' :
                         'No drafts or private entries'}
                      </CardDescription>
                      <Button onClick={() => setShowForm(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create First Entry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
                        <TableHead>Category</TableHead>
                        <TableHead>Resonance</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Status</TableHead>
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
                          className="border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <TableCell className="font-medium">
                            <div className="max-w-[300px]">
                              <div className="font-semibold truncate">{entry.title}</div>
                              <div className="text-sm text-muted-foreground truncate mt-1">
                                {entry.content.substring(0, 100)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-medium">
                              {entry.entry_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryName(entry.category_id)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-2 bg-muted rounded-full">
                                <div 
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${(entry.resonance_rating / 10) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {entry.resonance_rating}/10
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {entry.tags?.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {entry.tags && entry.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{entry.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {entry.is_verified && (
                                <Badge variant="default" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                              {entry.is_pinned && (
                                <Badge variant="outline" className="text-xs">
                                  Pinned
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditEntry(entry);
                                    setShowForm(true);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
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
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Entry Modal */}
        {selectedEntry && (
          <EntryModal
            entry={selectedEntry}
            open={!!selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onEdit={() => {
              setEditEntry(selectedEntry);
              setSelectedEntry(null);
              setShowForm(true);
            }}
            onVerificationChange={() => {
              // Refresh entries after verification change
              fetchEntries(activeTab as 'my' | 'collective' | 'drafts');
            }}
          />
        )}

        {/* Entry Form Modal */}
        {(showForm || editEntry) && (
          <EntryForm
            open={showForm || !!editEntry}
            onClose={() => {
              setShowForm(false);
              setEditEntry(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditEntry(null);
              fetchEntries(activeTab as 'my' | 'collective' | 'drafts');
            }}
            editEntry={editEntry}
          />
        )}
      </div>
    </div>
  );
}