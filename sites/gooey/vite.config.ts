import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base =
  process.env.GITHUB_ACTIONS && repositoryName
    ? `/${repositoryName}/gooey/`
    : '/'

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@danixts/border-beam': fileURLToPath(
        new URL('../../packages/border-beam/src/index.ts', import.meta.url),
      ),
      '@danixts/liquid-gooey': fileURLToPath(
        new URL('../../packages/liquid-gooey/src/index.ts', import.meta.url),
      ),
    },
  },
})
