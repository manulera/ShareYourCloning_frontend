import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  define: {
    // used to be global: {}
    // changed it because it was giving problems with yarn build, it would
    // replace global as an object field in a file by {}, creating a syntax error.
    // Some people in stackoverflow said to use global: 'window', but that replaced
    // the word window in the scripts, creating other problems.
    // global: {},
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
  build: {
    outDir: 'build',
  },
};
