import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end checks against a built site served by `astro preview`.
 * Build first, including the draft fixtures:  SHOW_DRAFTS=1 npm run build
 * Without downloaded Playwright browsers, use an installed one:  PW_CHANNEL=msedge npm run test:e2e
 */
const channel = process.env.PW_CHANNEL || undefined;
const PORT = 4322;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}/`,
    channel,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel, viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel } },
  ],
  webServer: {
    command: `npx astro preview --port ${PORT} --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
});
