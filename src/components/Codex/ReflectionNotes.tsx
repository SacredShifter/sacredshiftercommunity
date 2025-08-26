import React, { useState, useEffect, useCallback } from 'react';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { useAuth } from '@/hooks/useAuth';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface ReflectionNotesProps {
  entryId: string;
}

const ReflectionNotes: React.FC<ReflectionNotesProps> = ({ entryId }) => {
  const { user } = useAuth();
  const { addReflectionNote, getReflectionNotes } = useRegistryOfResonance();
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const fetchedNotes = await getReflectionNotes(entryId);
    setNotes(fetchedNotes);
    setIsLoading(false);
  }, [entryId, getReflectionNotes, user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !user) return;

    setIsSubmitting(true);
    const success = await addReflectionNote(entryId, newNote);
    if (success) {
      setNewNote('');
      await fetchNotes(); // Refresh notes list
    }
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <div className="text-center text-muted-foreground py-4">
        You must be logged in to leave private reflection notes.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write your private reflection here... (visible only to you)"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={4}
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting || !newNote.trim()}>
          {isSubmitting ? 'Saving...' : 'Save Note'}
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Past Reflections</h3>
        {isLoading ? (
          <p>Loading notes...</p>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <Card key={note.id} className="bg-background/50">
              <CardContent className="p-4">
                <p className="text-foreground/90">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">You haven't written any reflections on this entry yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReflectionNotes;
