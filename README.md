# Jakub Antalik Effects — native ports

Framework-free ports of Jakub Antalik's **Border Beam** and **Liquid Gooey**, designed for native browser APIs and direct use from Astro or Vue.

> Original concepts and implementations by [Jakub Antalik](https://github.com/Jakubantalik). This is an independent port, not an official fork. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Public packages

| Package                                                                        | Runtime dependencies | Playground                                                         |
| ------------------------------------------------------------------------------ | -------------------: | ------------------------------------------------------------------ |
| [`@danixts/border-beam`](https://www.npmjs.com/package/@danixts/border-beam)   |                    0 | [Astro playground](https://danixts.github.io/jakub-antalik/beam/)  |
| [`@danixts/liquid-gooey`](https://www.npmjs.com/package/@danixts/liquid-gooey) |                    0 | [Astro playground](https://danixts.github.io/jakub-antalik/gooey/) |

```bash
npm install @danixts/border-beam @danixts/liquid-gooey
```

Both packages expose small DOM controllers with independent state, reactive `update()` methods, and deterministic `destroy()` cleanup. They can be imported during SSR because browser work starts only when a controller is created. First-class components are available from the `/astro` and `/vue` exports.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

Both playgrounds are Astro sites. Their interactive examples compare native TypeScript controllers with real Vue 3 component islands.
