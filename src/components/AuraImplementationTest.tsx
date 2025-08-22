import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Sparkles } from 'lucide-react';
import { useAuraImplementation } from '@/hooks/useAuraImplementation';
import { toast } from 'sonner';

export function AuraImplementationTest() {
  const { implementCode, loading } = useAuraImplementation();

  const testImplementation = async () => {
    const testCode = `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FrequencyTunerProps {
  className?: string;
}

export default function FrequencyTuner({ className }: FrequencyTunerProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary">⚡</span>
          Frequency Tuner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Sacred frequency tuning interface - coming online.
        </p>
      </CardContent>
    </Card>
  );
}`;

    try {
      const result = await implementCode({
        generated_code: testCode,
        file_path: 'src/components/FrequencyTuner.tsx',
        component_name: 'FrequencyTuner',
        code_type: 'component',
        update_navigation: false,
        update_routes: false
      });

      if (result) {
        toast.success('Test implementation successful!');
      }
    } catch (error) {
      toast.error('Test implementation failed');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Implementation Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testImplementation}
          disabled={loading}
          className="w-full"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Test Aura Implementation
        </Button>
      </CardContent>
    </Card>
  );
}