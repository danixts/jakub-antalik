# @danixts/liquid-gooey

Zero-dependency liquid UI effects for native browser APIs, Astro, and Vue.

[Playground](https://danixts.github.io/jakub-antalik/gooey/) · [npm](https://www.npmjs.com/package/@danixts/liquid-gooey) · [Source](https://github.com/danixts/jakub-antalik)

```bash
npm install @danixts/liquid-gooey
```

## Native API

```ts
import { createLiquidGroup } from '@danixts/liquid-gooey'

const group = createLiquidGroup(document.querySelector('[data-liquid]'), {
  blur: 8,
  contrast: 18,
  fill: '#8b5cf6',
})

const item = group.add(document.querySelector('[data-liquid-item]'), {
  effect: 'move',
  move: { springiness: 0.7, wobble: 0.65, stretch: 0.6 },
})

item.update({ x: 120, transition: 'bouncy' })
group.destroy()
```

Each group owns an isolated SVG surface, observer engine, and item registry. Multiple accounts, widgets, or groups can run on the same page without shared state.

## Effects

- Morph: merge nearby items and tune speed, bounce, content blur, and bridge growth
- Shape: evolve bounds and corner radii through a spring
- Move: springiness, wobble, stretch, trail, and advanced motion values
- Dissolve: noise style, warp, pull, gravity, flow, detail, strength, fade, and release
- Group surface: blur, contrast, fill, shadow, and filter padding

## Vue 3

```vue
<script setup lang="ts">
import { LiquidGroup, LiquidItem } from '@danixts/liquid-gooey/vue'
</script>

<template>
  <LiquidGroup :blur="8" :contrast="18" fill="#8b5cf6">
    <LiquidItem as="button" :x="-52" transition="bouncy">One</LiquidItem>
    <LiquidItem as="button" :x="52" transition="bouncy">Two</LiquidItem>
  </LiquidGroup>
</template>
```

`LiquidGroup` and `LiquidItem` map reactive props to isolated native controllers and clean them up automatically. Vue remains an optional peer dependency.

## Astro

Call `createLiquidGroup()` from a processed TypeScript `<script>`, add descendants after the DOM exists, and destroy the group on `astro:before-swap` when using view transitions.

## Credits

Independent native port of [Liquid Gooey by Jakub Antalik](https://github.com/Jakubantalik/Libraries/tree/main/packages/liquid-gooey). It is not an official fork or endorsed by the original author. The original MIT copyright and license are preserved in this package.
