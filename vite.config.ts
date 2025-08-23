import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shift/supa': path.resolve(__dirname, 'packages/supa/src'),
      '@shift/ui': path.resolve(__dirname, 'packages/ui/src'),
      '@shift/schema': path.resolve(__dirname, 'packages/schema'),
    },
    // avoids symlink weirdness with pnpm workspaces
    preserveSymlinks: true,
  },
  server: {
    // allow importing files outside project root (packages/)
    fs: { allow: ['.', 'packages'] },
  },
  optimizeDeps: {
    // optional but helps when mixing linked deps
    include: ['three'],
  },
});
