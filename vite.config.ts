
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
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
        // IMPORTANTE: nombres SIN hash. El HTML prerenderizado commiteado en public/
        // referencia /assets/index.js y /assets/index.css; con hashes, cada rebuild
        // de la plataforma rompería esas referencias. El cache-busting se pierde,
        // pero garantiza que los HTML estáticos sigan hidratando tras cada publish.
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          // Preserve XML and TXT files in their original location at root
          if (assetInfo.name && (assetInfo.name.endsWith('.xml') || assetInfo.name.endsWith('.txt'))) {
            return '[name][extname]';
          }
          return 'assets/[name][extname]';
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
