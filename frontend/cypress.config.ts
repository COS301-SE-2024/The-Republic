// cypress.config.ts

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    env: {
      NEXT_PUBLIC_BACKEND_URL: "http://localhost:8080",
    },
    setupNodeEvents() {
      // implement node event listeners here
    },
    specPattern: "cypress/integration/*.spec.ts",
  },
});