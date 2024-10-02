const { defineConfig } = require('cypress');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    // To test the action
    specPattern: 'cypress/e2e/rename_sequence.cy.js',
    setupNodeEvents(on, config) {
      on('task', {
        readFileMaybe(filename) {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, 'utf8');
          }

          return null;
        },
      });
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
    baseUrl: 'http://localhost:3000',
    experimentalStudio: true,
    numTestsKeptInMemory: 2,
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },

  retries: {
    runMode: 2,
  },
});
