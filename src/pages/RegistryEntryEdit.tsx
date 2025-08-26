import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Using the same interface from RegistryEntry page
interface RegistryEntry {
  id: string;
  title: string;
  content: string;
  quick_abstract?: string;
  author_name?: string;
  author_bio?: string;
  // ... other fields
}

export default function RegistryEntryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateEntry } = useRegistryOfResonance();
  const [entry, setEntry] = useState<Partial<RegistryEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/registry');
      return;
    }
    // Fetch existing entry data
    const fetchEntry = async () => {
      // This is a simplified fetch, ideally the hook would have a getEntryById function
      const { data, error } = await import('@/integrations/supabase/client')
        .then(module => module.supabase.from('registry_of_resonance').select('*').eq('id', id).single());

      if (error || !data) {
        toast.error('Failed to fetch entry for editing.');
        navigate('/registry');
      } else {
        // Security check: only author can edit
        if (data.user_id !== user?.id) {
          toast.error("You don't have permission to edit this entry.");
          navigate(`/resonance/entries/${id}`);
          return;
        }
        setEntry(data);
      }
      setLoading(false);
    };
    fetchEntry();
  }, [id, navigate, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const { title, content, author_name, author_bio, quick_abstract } = entry;
    const success = await updateEntry(id, { title, content, author_name, author_bio, quick_abstract });
    if (success) {
      toast.success('Entry updated successfully!');
      navigate(`/resonance/entries/${id}`);
    }
  };

  if (loading) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editing Registry Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
              <Input id="title" name="title" value={entry.title || ''} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="author_name" className="block text-sm font-medium mb-1">Author Name</label>
              <Input id="author_name" name="author_name" value={entry.author_name || ''} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="author_bio" className="block text-sm font-medium mb-1">Author Bio</label>
              <Textarea id="author_bio" name="author_bio" value={entry.author_bio || ''} onChange={handleChange} rows={3} />
            </div>
             <div>
              <label htmlFor="quick_abstract" className="block text-sm font-medium mb-1">Quick Abstract</label>
              <Textarea id="quick_abstract" name="quick_abstract" value={entry.quick_abstract || ''} onChange={handleChange} rows={3} />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">Content (Markdown)</label>
              <Textarea id="content" name="content" value={entry.content || ''} onChange={handleChange} rows={15} />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(`/resonance/entries/${id}`)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
