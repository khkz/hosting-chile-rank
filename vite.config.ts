
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import { readFileSync, existsSync } from "fs";

// Plugin personalizado para servir archivos estáticos
const staticFilesPlugin = () => {
  return {
    name: 'static-files-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url;
        
        if (!url) {
          next();
          return;
        }

        // Lista de archivos estáticos que deben ser servidos directamente
        const staticFiles = [
          '/sitemap.xml',
          '/robots.txt',
          '/feed/latest-domains.xml'
        ];

        // Verificar si la URL coincide con un archivo estático
        if (staticFiles.includes(url)) {
          try {
            const filePath = path.join(process.cwd(), 'public', url);
            
            if (existsSync(filePath)) {
              const content = readFileSync(filePath, 'utf8');
              
              // Configurar headers apropiados
              if (url.endsWith('.xml')) {
                res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                res.setHeader('Cache-Control', 'public, max-age=3600');
              } else if (url.endsWith('.txt')) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.setHeader('Cache-Control', 'public, max-age=86400');
              }
              
              res.statusCode = 200;
              res.end(content);
              return;
            }
          } catch (error) {
            console.error(`Error serving static file ${url}:`, error);
          }
        }
        
        next();
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    staticFilesPlugin(),
    mode === 'development' && componentTagger(),
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
  // Configure preview server for production builds
  preview: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
}));
