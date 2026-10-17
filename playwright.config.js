// Konfigurasi Playwright. Memakai Chromium yang sudah terpasang (PLAYWRIGHT_BROWSERS_PATH).
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4173', browserName: 'chromium' },
  projects: [
    { name: 'laptop', use: { viewport: { width: 1366, height: 768 } } },
    { name: 'laptop-1280', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } }
  ],
  webServer: {
    command: 'node scripts/serve.mjs site 4173',
    url: 'http://localhost:4173/',
    reuseExistingServer: true
  }
});
