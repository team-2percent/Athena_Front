import { defineConfig } from "cypress";
import { unlink } from 'fs/promises';

export default defineConfig({
  projectId: "7ovivy",

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        deleteFile(filename) {
          return unlink(filename)
            .then(() => null)
            .catch(() => null);
        },
      });
    },
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 5000,
    screenshotOnRunFailure: false,
    video: false,
    testIsolation: true,
    experimentalStudio: true,
    chromeWebSecurity: false,
  },
});
