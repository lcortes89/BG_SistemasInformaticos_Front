import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // "@/..." means "src/..."
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    // npm run test:coverage -> coverage/index.html (BGSI-266)
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/main.js'], // only starts the app
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 },
    },
  },
})
