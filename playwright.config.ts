import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    env: {
      ...process.env,
      API_URL: "http://127.0.0.1:3000",
      PORT: "3000",
    },
  },
  testIgnore: "*test.ts",
});
