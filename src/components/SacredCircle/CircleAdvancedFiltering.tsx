import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, Calendar, User } from 'lucide-react';

interface CircleAdvancedFilteringProps {
  messages: any[];
  onFilteredMessages: (filtered: any[]) => void;
}

export const CircleAdvancedFiltering = ({ messages, onFilteredMessages }: CircleAdvancedFilteringProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const filterTypes = [
    { id: 'sacred', label: 'Sacred', color: 'rose' },
    { id: 'quantum', label: 'Quantum', color: 'purple' },
    { id: 'classic', label: 'Classic', color: 'blue' },
    { id: 'today', label: 'Today', color: 'green' },
    { id: 'this-week', label: 'This Week', color: 'orange' },
  ];
  
  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };
  
  const applyFilters = () => {
    let filtered = messages;
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filters
    if (activeFilters.includes('today')) {
      const today = new Date().toDateString();
      filtered = filtered.filter(msg => 
        new Date(msg.created_at).toDateString() === today
      );
    }
    
    if (activeFilters.includes('this-week')) {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(msg => 
        new Date(msg.created_at) >= weekAgo
      );
    }
    
    onFilteredMessages(filtered);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Advanced Filtering</h3>
      </div>
      
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filterTypes.map((filter) => (
          <Badge
            key={filter.id}
            variant={activeFilters.includes(filter.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleFilterToggle(filter.id)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
      
      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
      
      <div className="text-sm text-muted-foreground">
        {messages.length} total messages
      </div>
    </div>
  );
};