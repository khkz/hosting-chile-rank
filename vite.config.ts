
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "http";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Include XML files as assets
  assetsInclude: ['**/*.xml'],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Preserve XML files in their original location
          if (assetInfo.name && assetInfo.name.endsWith('.xml')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  // Configure server to serve XML files with correct MIME type
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url && req.url.endsWith('.xml')) {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
      next();
    });
  },
  // Configure preview server for production builds
  preview: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
}));
