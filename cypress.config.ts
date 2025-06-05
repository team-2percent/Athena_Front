import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "rsnppr",

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 8000,
  },
});
