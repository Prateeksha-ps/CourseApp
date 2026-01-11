import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envDir: '../',
  base: '/',
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
  },
  server: {
    port: 6001,
  },
});
