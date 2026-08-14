import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base =
  process.env.GITHUB_ACTIONS && repositoryName
    ? `/${repositoryName}/beam/`
    : '/'

export default defineConfig({
  base,
  output: 'static',
  vite: {
    resolve: {
      alias: {
        '@danixts/border-beam': fileURLToPath(
          new URL('../../packages/border-beam/src/index.ts', import.meta.url),
        ),
      },
    },
  },
})
