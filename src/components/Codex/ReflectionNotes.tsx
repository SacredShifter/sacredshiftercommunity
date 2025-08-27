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
  const { addReflectionNote, getReflectionNotes, updateReflectionNote, deleteReflectionNote } = useRegistryOfResonance();
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

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

  const handleEdit = (note: any) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleUpdateNote = async () => {
    if (!editingNoteId || !editingContent.trim()) return;

    const success = await updateReflectionNote(editingNoteId, editingContent);
    if (success) {
      setEditingNoteId(null);
      setEditingContent('');
      await fetchNotes();
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const success = await deleteReflectionNote(noteId);
    if (success) {
      await fetchNotes();
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent('');
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
                {editingNoteId === note.id ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdateNote}>Save</Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-foreground/90">{note.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                      </p>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(note)}>Edit</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteNote(note.id)}>Delete</Button>
                      </div>
                    </div>
                  </>
                )}
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
