import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

export default ({ mode }) => {
  const configFileName = mode === 'production' ? 'config.prod.json' : 'config.dev.json';
  return {
    plugins: [
      react(),
      {
        name: 'copy-config',
        // When running the dev server, copy the config file to the public folder
        // as config.json so it can be fetched by the frontend
        configureServer(server) {
          const configPath = resolve(__dirname, 'public', configFileName);
          const destPath = resolve(__dirname, 'public', 'config.json');
          fs.copyFileSync(configPath, destPath);
        },
        // When building the project, copy the config file to the build folder
        // as config.json so it can be fetched by the frontend
        writeBundle() {
          const configPath = resolve(__dirname, 'public', configFileName);
          const destPath = resolve(__dirname, 'build', 'config.json');
          fs.copyFileSync(configPath, destPath);
        },
      },
    ],
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
};
