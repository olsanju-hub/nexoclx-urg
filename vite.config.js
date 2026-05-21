import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }

          if (id.includes('/src/data/calculators')) {
            return 'calculators';
          }

          if (id.includes('/src/data/procedures')) {
            return 'procedures';
          }

          if (id.includes('/src/data/bibliography')) {
            return 'bibliography';
          }

          if (
            id.includes('/src/data/protocolFlows') ||
            id.includes('/src/data/protocols') ||
            id.includes('/src/data/medications')
          ) {
            return 'clinical-data';
          }
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
