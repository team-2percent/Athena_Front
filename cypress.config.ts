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
    // 각 테스트 파일을 독립적으로 실행
    testIsolation: true,
  },
});
