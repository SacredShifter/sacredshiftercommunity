import React, { useState, useEffect } from 'react';
import { useAura } from '@/aura/useAura';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// This would be defined in a more central place
interface KnowledgeSeed {
  id: string;
  type: string;
  content: any;
  status: string;
  created_at: string;
}

export function SeederAuthorityDashboard() {
  const { executeCommand } = useAura();
  const { toast } = useToast();
  const [seeds, setSeeds] = useState<KnowledgeSeed[]>([]);
  const [seedType, setSeedType] = useState('knowledge_seed');
  const [seedContext, setSeedContext] = useState('');

  const handleGenerateSeed = async () => {
    try {
      await executeCommand({
        kind: 'seed.generate',
        level: 2,
        payload: {
          type: seedType as any,
          context: { text: seedContext }
        }
      });
      toast({ title: "Seed generation initiated." });
      // In a real app, we'd refresh the list of seeds here
    } catch (error) {
      toast({ title: "Failed to generate seed", description: error.message, variant: "destructive" });
    }
  };

  // Mock data for now
  useEffect(() => {
    setSeeds([
      { id: '1', type: 'knowledge_seed', content: { title: 'The Nature of Time' }, status: 'germinating', created_at: new Date().toISOString() },
      { id: '2', type: 'resonance_tag', content: { name: 'Synchronicity' }, status: 'adopted', created_at: new Date().toISOString() },
    ]);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seeder Authority Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-medium">Generate New Seed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seed-type">Seed Type</Label>
              <Select value={seedType} onValueChange={setSeedType}>
                <SelectTrigger id="seed-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="knowledge_seed">Knowledge Seed</SelectItem>
                  <SelectItem value="resonance_tag">Resonance Tag</SelectItem>
                  <SelectItem value="starter_kit">Starter Kit</SelectItem>
                  <SelectItem value="fractal_prompt">Fractal Prompt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seed-context">Context / Prompt</Label>
              <Input
                id="seed-context"
                value={seedContext}
                onChange={(e) => setSeedContext(e.target.value)}
                placeholder="e.g., 'A prompt about the nature of consciousness'"
              />
            </div>
          </div>
          <Button onClick={handleGenerateSeed}>Generate Seed</Button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Existing Seeds</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seeds.map((seed) => (
                <TableRow key={seed.id}>
                  <TableCell className="font-mono text-xs">{seed.id.substring(0, 8)}</TableCell>
                  <TableCell>{seed.type}</TableCell>
                  <TableCell>{seed.content.title || seed.content.name}</TableCell>
                  <TableCell>{seed.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">Distribute</Button>
                    <Button variant="outline" size="sm">Track</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
