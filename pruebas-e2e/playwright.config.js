const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  reporter: [["list"], ["html", { open: "never" }], ["json", { outputFile: "../evidencias/final/playwright.json" }]],
  use: {
    baseURL: process.env.WEB_URL || "http://localhost:3335",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "escritorio", use: devices["Desktop Chrome"] },
    { name: "móvil", use: devices["Pixel 7"] },
  ],
});
