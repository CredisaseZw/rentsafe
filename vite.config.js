import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default {
  plugins: [
    react({
      include: '**/*.disabled',
    }),
  ],
  root: resolve('./react-app'),
  base: '/static/',
  resolve: {
    extensions: ['.js', '.json', 'jsx'],
    alias: {
      '@': resolve('./react-app/src'),
      '~assets': resolve('./react-app/src/assets'),
      'es-errors/type': resolve(__dirname, 'node_modules/es-errors/type.js'),
    },
  },
  optimizeDeps: {
    include: ['es-errors/type'],
  },
  build: {
    outDir: resolve('./react-app/dist'),
    assetsDir: 'media',
    manifest: true,
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve('./react-app/src/main.jsx'),
      },
      output: {
        assetFileNames: 'media/[name].[hash].[ext]',
      },
    },
    commonjsOptions: {
      include: [/es-errors/, /node_modules/],
    },
  },
};
