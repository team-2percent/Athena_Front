import { defineConfig } from "cypress";
import { e2eNodeEvents } from './cypress/support/setupNodeEvents';


export default defineConfig({
  projectId: "7ovivy",
  e2e: {
    setupNodeEvents: e2eNodeEvents,
    baseUrl: "http://localhost:3000",
    env: {
      NEXT_PUBLIC_API_BASE_URL: "http://localhost:9000",
    },
    experimentalInteractiveRunEvents: true,
    defaultCommandTimeout: 5000,
    screenshotOnRunFailure: false,
    video: false,
    testIsolation: true,
    experimentalStudio: true,
    chromeWebSecurity: false,
  },
});
