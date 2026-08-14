import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import { fileURLToPath } from 'node:url'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base =
  process.env.GITHUB_ACTIONS && repositoryName
    ? `/${repositoryName}/beam/`
    : '/'

export default defineConfig({
  base,
  integrations: [vue()],
  output: 'static',
  vite: {
    resolve: {
      alias: [
        {
          find: '@danixts/border-beam/astro',
          replacement: fileURLToPath(
            new URL(
              '../../packages/border-beam/src/astro/index.ts',
              import.meta.url,
            ),
          ),
        },
        {
          find: '@danixts/border-beam/vue',
          replacement: fileURLToPath(
            new URL(
              '../../packages/border-beam/src/vue/index.ts',
              import.meta.url,
            ),
          ),
        },
        {
          find: '@danixts/border-beam',
          replacement: fileURLToPath(
            new URL('../../packages/border-beam/src/index.ts', import.meta.url),
          ),
        },
      ],
    },
  },
})
