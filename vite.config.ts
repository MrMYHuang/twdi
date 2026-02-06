import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/twdi/' : '/',
  plugins: [
    react(),
    nodePolyfills(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      registerType: 'autoUpdate',
      injectRegister: null,
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      fs: 'memfs',
    },
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
}));
