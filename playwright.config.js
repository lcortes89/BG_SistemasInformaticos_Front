import { defineConfig, devices } from '@playwright/test'

// BGSI-88 / BGSI-175: end-to-end tests against the real app (front + back + MySQL).
// Admin credentials live in .env.e2e.local (never committed, *.local is in .gitignore)
try {
  process.loadEnvFile('.env.e2e.local')
} catch {
  // No file: the admin tests are skipped
}

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.js', // not *.spec.js, so Vitest does not run them
  fullyParallel: false, // the tests share the same database
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Starts Vite if it is not running yet. The backend must already be running (./mvnw spring-boot:run)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
