
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Explicitly import process to ensure Node.js types are used for process.cwd()
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Shims the process.env.API_KEY variable used in the services
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      target: 'esnext',
      sourcemap: false
    }
  };
});
