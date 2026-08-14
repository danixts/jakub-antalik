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
import { createLiquidGroup } from '@danixts/liquid-gooey'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const groupHost = ref<HTMLElement | null>(null)
const item = ref<HTMLElement | null>(null)
let group: ReturnType<typeof createLiquidGroup> | undefined

onMounted(() => {
  if (!groupHost.value || !item.value) return
  group = createLiquidGroup(groupHost.value, { fill: '#8b5cf6' })
  group.add(item.value, { morph: { shape: true } })
})
onBeforeUnmount(() => group?.destroy())
</script>

<template>
  <div ref="groupHost"><button ref="item">Action</button></div>
</template>
```

## Astro

Call `createLiquidGroup()` from a processed `<script>`, add descendants after the DOM exists, and destroy the group on `astro:before-swap` when using view transitions.

## Credits

Independent native port of [Liquid Gooey by Jakub Antalik](https://github.com/Jakubantalik/Libraries/tree/main/packages/liquid-gooey). It is not an official fork or endorsed by the original author. The original MIT copyright and license are preserved in this package.
