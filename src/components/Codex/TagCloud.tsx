import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface TagCloudProps {
  tags: string[];
}

const TagCloud: React.FC<TagCloudProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <h3 className="text-sm font-semibold text-muted-foreground mr-2">Resonance Tags:</h3>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className="px-3 py-1 text-sm rounded-full border-primary/30 hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <Tag className="h-3 w-3 mr-2" />
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default TagCloud;
