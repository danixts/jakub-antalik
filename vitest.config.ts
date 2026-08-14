import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['packages/**/test/**/*.test.ts'],
    coverage: { reporter: ['text', 'json-summary'] },
  },
})
