import { resolve } from 'path';
import react from '@vitejs/plugin-react';

module.exports = {
  // this was changed
  plugins: [
    react({
      include: '**/*.disabled',
    }),
  ],
  root: resolve('./react-app'),
  base: '/static/',
  server: {
    host: 'localhost',
    // port: 3000,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  resolve: {
    extensions: ['.js', '.json','jsx'],
    alias: {
      '@': resolve('./react-app/src'), // Add this alias
      '~assets': resolve('./react-app/src/assets'), // Optional assets alias
    },
    
  },
  build: {
    outDir: resolve('./react-app/dist'),
    assetsDir: 'media',
    manifest: true,
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve('./react-app/src/main.jsx'), // <- renamed from main.js
      },
      output: {
        chunkFileNames: undefined,
        assetFileNames: 'media/[name].[hash].[ext]',
      },
    },
  },
};
