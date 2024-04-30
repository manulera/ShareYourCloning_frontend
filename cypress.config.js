const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        readFileMaybe(filename) {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, "utf8");
          }

          return null;
        },
      });
    },
    baseUrl: "http://localhost:3000",
    experimentalStudio: true,
    numTestsKeptInMemory: 50,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
