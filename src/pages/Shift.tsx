import React, { useEffect } from 'react';
import { useLearningStore } from '@/stores/learningStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const nodes = ['cube', 'sphere', 'pyramid', 'torus'];

const Shift: React.FC = () => {
  const { activeNode, onChapterJump } = useLearningStore();

  // Load from localStorage on mount
  useEffect(() => {
    const savedNode = localStorage.getItem('activeNode');
    if (savedNode && savedNode !== activeNode) {
      onChapterJump(savedNode);
    }
  }, [activeNode, onChapterJump]);

  // Save to localStorage on change
  useEffect(() => {
    if (activeNode) {
      localStorage.setItem('activeNode', activeNode);
    } else {
      localStorage.removeItem('activeNode');
    }
  }, [activeNode]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Shift Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Select a node to see the state change and persist across reloads.</p>
          <div className="flex space-x-2">
            {nodes.map((node) => (
              <Button
                key={node}
                onClick={() => onChapterJump(node)}
                variant={activeNode === node ? 'default' : 'outline'}
              >
                {node}
              </Button>
            ))}
          </div>
          <div className="mt-4">
            <p>Active Node: <span data-testid="active-node">{activeNode || 'None'}</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shift;
