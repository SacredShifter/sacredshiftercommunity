import React, { useState } from 'react';
import { Search, Filter, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegistryOfResonance, RegistryEntry } from '@/hooks/useRegistryOfResonance';
import { RegistryEntryCard } from './RegistryEntryCard';
import { EntryModal } from './EntryModal';
import { EntryForm } from './EntryForm';
import { motion } from 'framer-motion';

export function RegistryList() {
  const { entries, loading, fetchEntries } = useRegistryOfResonance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RegistryEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<RegistryEntry | null>(null);
  const [activeTab, setActiveTab] = useState('my');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchEntries(value as 'my' | 'collective' | 'drafts');
  };

  // Get all unique tags from entries
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags || [])));

  // Filter entries based on search and filters
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => entry.tags?.includes(tag));
    const matchesVerified = !verifiedOnly || entry.is_verified;
    
    return matchesSearch && matchesTags && matchesVerified;
  });

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-20 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredEntries.length === 0 ? (
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
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RegistryEntryCard
                        entry={entry}
                        onClick={() => setSelectedEntry(entry)}
                      />
                    </motion.div>
                  ))}
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