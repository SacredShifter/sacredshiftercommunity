import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '127.0.0.1',
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' ? componentTagger() : null,
    // Sentry plugin must be last
    process.env.SENTRY_AUTH_TOKEN ? sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }) : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    sourcemap: true,
  }
}))
