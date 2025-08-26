import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export const CosmogramInfo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm p-4 rounded-lg text-white max-w-sm"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          The Cosmogram
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>A cosmogram is a map of the self, a symbolic representation of the journey of liberation. Each symbol represents a stage or an aspect of this journey.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Cube:</strong> The foundation, the structure of the self.</li>
          <li><strong>Circle:</strong> The unified self, wholeness.</li>
          <li><strong>Witness:</strong> The observer, the part of you that is aware.</li>
          <li><strong>Eros:</strong> The life force, the creative energy.</li>
          <li><strong>Butterfly:</strong> Transformation, the process of change.</li>
          <li><strong>Justice:</strong> Balance, the universal law of cause and effect.</li>
        </ul>
      </CardContent>
    </motion.div>
  );
};
