import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base =
  process.env.GITHUB_ACTIONS && repositoryName
    ? `/${repositoryName}/gooey/`
    : '/'

export default defineConfig({
  base,
  integrations: [vue()],
  output: 'static',
  vite: {
    resolve: {
      alias: [
        {
          find: '@danixts/liquid-gooey/vue',
          replacement: fileURLToPath(
            new URL(
              '../../packages/liquid-gooey/src/vue/index.ts',
              import.meta.url,
            ),
          ),
        },
        {
          find: '@danixts/liquid-gooey',
          replacement: fileURLToPath(
            new URL(
              '../../packages/liquid-gooey/src/index.ts',
              import.meta.url,
            ),
          ),
        },
      ],
    },
  },
})
