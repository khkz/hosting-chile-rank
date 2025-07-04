
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
  // Include XML and TXT files as assets
  assetsInclude: ['**/*.xml', '**/*.txt'],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Preserve XML and TXT files in their original location at root
          if (assetInfo.name && (assetInfo.name.endsWith('.xml') || assetInfo.name.endsWith('.txt'))) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Copy static files to build output
    copyPublicDir: true,
  },
  // Configure server to serve XML and TXT files with correct MIME type
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url) {
        if (req.url.endsWith('.xml')) {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600');
        } else if (req.url.endsWith('.txt')) {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=86400');
        }
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
