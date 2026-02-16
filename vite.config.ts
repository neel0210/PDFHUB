import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Use a relative base for maximum compatibility on GitHub Pages
  base: './', 
  
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      // These MUST match the keys in your index.html importmap exactly
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        'framer-motion',
        'lucide-react',
        'pdf-lib',
        'pdfjs-dist'
      ],
    },
  },
});