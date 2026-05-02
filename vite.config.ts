import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    build: {
      // Do not inline any env vars starting with VITE_ into the bundle text
      // beyond what Vite already does — this reminds contributors not to
      // add VITE_ prefixes to server-only secrets.
      sourcemap: false, // disable sourcemaps in production to reduce info leakage
    },
  };
});
