import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Inject the API key provided
    'process.env.API_KEY': JSON.stringify("AIzaSyCCpXPUctgKmK1mxce91RMt6zbnE9VDcGQ")
  },
  build: {
    outDir: 'dist',
  },
});