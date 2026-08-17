import { defineConfig } from '@playwright/test'

/**
 * E2E against the LIVE site — curl misses real-browser faults, so the
 * tests ride the same deployment Ronin's browser does.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'https://shadowwulf.silverwulf.org',
    headless: true,
    args: ['--mute-audio'],
    // headless Chromium answers "reduce" and the site honestly disables its
    // motion for that — but these tests exist to prove the full experience
    reducedMotion: 'no-preference',
  },
})
