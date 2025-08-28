
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
    // Optimize build performance
    target: 'es2015',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        // Chunk splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
        },
        assetFileNames: (assetInfo) => {
          // Preserve XML and TXT files in their original location at root
          if (assetInfo.name && (assetInfo.name.endsWith('.xml') || assetInfo.name.endsWith('.txt'))) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
      // Tree shaking optimization
      treeshake: {
        moduleSideEffects: false,
      },
    },
    // Copy static files to build output
    copyPublicDir: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
  },
  // Configure preview server for production builds
  preview: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
}));
