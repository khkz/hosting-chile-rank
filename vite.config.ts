
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
        manualChunks: (id) => {
          const moduleId = id.replace(/\\/g, '/');
          if (moduleId.includes('commonjsHelpers') || moduleId.includes('vite/preload-helper')) {
            return 'vendor-react';
          }
          if (!moduleId.includes('/node_modules/')) return undefined;

          // Keep React with libraries that create/read React context. Splitting
          // @tanstack/react-query or React UI libraries into a different manual
          // chunk caused production to evaluate them with an undefined React
          // binding (`createContext` crash) on publish.
          if (
            moduleId.includes('/node_modules/react/') ||
            moduleId.includes('/node_modules/react-dom/') ||
            moduleId.includes('/node_modules/react-router/') ||
            moduleId.includes('/node_modules/scheduler/') ||
            moduleId.includes('/node_modules/react-router-dom/') ||
            moduleId.includes('/node_modules/@remix-run/router/') ||
            moduleId.includes('/node_modules/@tanstack/react-query/') ||
            moduleId.includes('/node_modules/@tanstack/query-core/') ||
            moduleId.includes('/node_modules/react-helmet/') ||
            moduleId.includes('/node_modules/react-helmet-async/') ||
            moduleId.includes('/node_modules/react-hook-form/') ||
            moduleId.includes('/node_modules/@hookform/') ||
            moduleId.includes('/node_modules/@radix-ui/') ||
            moduleId.includes('/node_modules/cmdk/') ||
            moduleId.includes('/node_modules/vaul/') ||
            moduleId.includes('/node_modules/sonner/') ||
            moduleId.includes('/node_modules/next-themes/') ||
            moduleId.includes('/node_modules/input-otp/') ||
            moduleId.includes('/node_modules/react-day-picker/') ||
            moduleId.includes('/node_modules/react-resizable-panels/') ||
            moduleId.includes('/node_modules/embla-carousel-react/') ||
            moduleId.includes('/node_modules/@floating-ui/react-dom/') ||
            moduleId.includes('/node_modules/react-remove-scroll/') ||
            moduleId.includes('/node_modules/react-remove-scroll-bar/') ||
            moduleId.includes('/node_modules/react-style-singleton/') ||
            moduleId.includes('/node_modules/use-callback-ref/') ||
            moduleId.includes('/node_modules/use-sidecar/') ||
            moduleId.includes('/node_modules/use-debounce/')
          ) {
            return 'vendor-react';
          }

          if (moduleId.includes('/node_modules/@supabase/')) {
            return 'vendor-data';
          }
          if (moduleId.includes('/node_modules/recharts/') || moduleId.includes('/node_modules/d3-')) {
            return 'vendor-charts';
          }
          if (moduleId.includes('/node_modules/react-markdown/') || moduleId.includes('/node_modules/remark-gfm/') || moduleId.includes('/node_modules/micromark') || moduleId.includes('/node_modules/unified/') || moduleId.includes('/node_modules/mdast') || moduleId.includes('/node_modules/hast') || moduleId.includes('/node_modules/unist')) {
            return 'vendor-markdown';
          }
          if (moduleId.includes('/node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          return undefined;
        },
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
