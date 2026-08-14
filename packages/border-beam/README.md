# @danixts/border-beam

A zero-dependency, framework-free Border Beam for native browser APIs, Astro, and Vue.

[Playground](https://danixts.github.io/jakub-antalik/beam/) · [npm](https://www.npmjs.com/package/@danixts/border-beam) · [Source](https://github.com/danixts/jakub-antalik)

```bash
npm install @danixts/border-beam
```

## Native API

```ts
import { createBorderBeam } from '@danixts/border-beam'

const beam = createBorderBeam(document.querySelector('[data-card]'), {
  size: 'pulse-inner',
  inset: 6,
  colorVariant: 'ocean',
  theme: 'auto',
  strength: 0.8,
})

beam.update({ duration: 8 })
beam.deactivate()
beam.activate()
beam.destroy()
```

The host remains your element. The controller adds one decorative layer, supports multiple independent instances, and removes every resource it owns in `destroy()`.

## Variants

- Sizes: `sm`, `md`, `line`, `pulse-inner`, `pulse-outside`
- Colors: `colorful`, `mono`, `ocean`, `sunset`
- Themes: `dark`, `light`, `auto`
- Controls: active state, inset, duration, strength, saturation, brightness, hue range, border radius, and static colors

## Tint

The beam paints its core white on the dark theme and black on the light one, which no
filter can recolour. Pass `tint` with any CSS colour to paint it in your own instead:

```ts
createBorderBeam(card, { size: 'pulse-inner', tint: 'var(--primary)' })
```

It sets `--beam-tint` on the host, so a stylesheet can hand each surface its own colour
without touching the controller:

```css
.card { --beam-tint: var(--accent); }
```

`strength` multiplies every opacity and now accepts up to `3`, so a beam can be pushed
past its natural brightness on busy backgrounds.

## Astro

```astro
---
import { BorderBeam } from '@danixts/border-beam/astro'
---

<BorderBeam as="button" size="md" colorVariant="ocean" inset={4} type="button">
  Continue
</BorderBeam>
```

The Astro component mounts the native controller, supports multiple independent instances, and cleans up automatically during view transitions.

## Vue 3

```vue
<script setup lang="ts">
import { BorderBeam } from '@danixts/border-beam/vue'
</script>

<template>
  <BorderBeam as="article" size="pulse-inner" color-variant="ocean" :inset="6">
    Content
  </BorderBeam>
</template>
```

Vue is an optional peer dependency. Consumers of only the native controller do not install a framework runtime.

## Credits

Independent native port of [Border Beam by Jakub Antalik](https://github.com/Jakubantalik/Libraries/tree/main/packages/border-beam). It is not an official fork or endorsed by the original author. The original MIT copyright and license are preserved in this package.
