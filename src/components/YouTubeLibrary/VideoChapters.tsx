import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Chapter {
  time: number;
  title: string;
}

interface VideoChaptersProps {
  description: string;
  onChapterClick: (time: number) => void;
}

const VideoChapters: React.FC<VideoChaptersProps> = ({ description, onChapterClick }) => {
  const parseChapters = (desc: string): Chapter[] => {
    const chapters: Chapter[] = [];
    const lines = desc.split('\n');
    const timeRegex = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})/;

    for (const line of lines) {
      const match = line.match(timeRegex);
      if (match) {
        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        const time = hours * 3600 + minutes * 60 + seconds;
        const title = line.replace(timeRegex, '').trim();
        chapters.push({ time, title });
      }
    }
    return chapters;
  };

  const chapters = parseChapters(description);

  if (chapters.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="font-medium mb-2">Chapters</h4>
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {chapters.map((chapter) => (
            <Button
              key={chapter.time}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onChapterClick(chapter.time)}
            >
              <span className="text-muted-foreground mr-2">{new Date(chapter.time * 1000).toISOString().substr(11, 8)}</span>
              <span>{chapter.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VideoChapters;
