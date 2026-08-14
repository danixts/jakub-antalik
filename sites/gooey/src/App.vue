<script setup lang="ts">
import {
  createBorderBeam,
  type BorderBeamController,
} from '@danixts/border-beam'
import {
  createLiquidGroup,
  type LiquidGroupController,
  type LiquidItemController,
} from '@danixts/liquid-gooey'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const beamHost = ref<HTMLElement | null>(null)
const mergeHost = ref<HTMLElement | null>(null)
const shapeHost = ref<HTMLElement | null>(null)
const moveHost = ref<HTMLElement | null>(null)
const dissolveHost = ref<HTMLElement | null>(null)
const mergeElements = ref<HTMLElement[]>([])
const shapeElement = ref<HTMLElement | null>(null)
const moveElement = ref<HTMLElement | null>(null)
const dissolveElement = ref<HTMLElement | null>(null)
const mergeOpen = ref(true)
const shapeWide = ref(false)
const moveRight = ref(false)
const dissolving = ref(false)
const blur = ref(9)
const contrast = ref(18)
const fill = ref('#8b5cf6')
let beam: BorderBeamController | undefined
const groups: LiquidGroupController[] = []
let mergeItems: LiquidItemController[] = []
let shapeItem: LiquidItemController | undefined
let moveItem: LiquidItemController | undefined
let dissolveItem: LiquidItemController | undefined

function setMergeElement(element: unknown, index: number): void {
  if (element instanceof HTMLElement) mergeElements.value[index] = element
}

function groupOptions(color: string) {
  return {
    blur: blur.value,
    contrast: contrast.value,
    fill: color,
    shadow: '0 18px 45px rgba(35, 20, 78, 0.38)',
  }
}

function syncMerge(): void {
  const positions = mergeOpen.value
    ? [
        { x: -82, y: -34 },
        { x: 0, y: -92 },
        { x: 82, y: -34 },
      ]
    : [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ]
  mergeItems.forEach((item, index) =>
    item.update({
      ...positions[index],
      morph: { speed: 1, bounce: 0.7 },
      transition: 'bouncy',
      delay: index * 35,
    }),
  )
}

function syncShape(): void {
  shapeItem?.update({
    morph: { shape: true, speed: 1.15, bounce: 0.65 },
    scale: shapeWide.value ? 1.08 : 1,
    transition: 'smooth',
  })
}

function syncMove(): void {
  moveItem?.update({
    effect: 'move',
    x: moveRight.value ? 92 : -92,
    move: { springiness: 0.72, wobble: 0.78, stretch: 0.7, trail: 0.72 },
    transition: 'bouncy',
  })
}

function syncDissolve(): void {
  dissolveItem?.update({
    x: dissolving.value ? 88 : -88,
    scale: dissolving.value ? 0.7 : 1,
    dissolve: {
      active: true,
      strength: dissolving.value ? 1 : 0.3,
      warp: 30,
      blur: 9,
      gravity: 70,
      flowSpeed: 24,
    },
    transition: 'smooth',
  })
}

onMounted(() => {
  if (beamHost.value)
    beam = createBorderBeam(beamHost.value, {
      size: 'pulse-outside',
      colorVariant: 'sunset',
      theme: 'dark',
      strength: 0.65,
    })

  if (mergeHost.value) {
    const group = createLiquidGroup(mergeHost.value, groupOptions(fill.value))
    groups.push(group)
    mergeItems = mergeElements.value.map((element) =>
      group.add(element, { transition: 'bouncy' }),
    )
    syncMerge()
  }
  if (shapeHost.value && shapeElement.value) {
    const group = createLiquidGroup(shapeHost.value, groupOptions('#22c7a9'))
    groups.push(group)
    shapeItem = group.add(shapeElement.value, {
      morph: { shape: true },
      transition: 'smooth',
    })
  }
  if (moveHost.value && moveElement.value) {
    const group = createLiquidGroup(moveHost.value, groupOptions('#ff9a55'))
    groups.push(group)
    moveItem = group.add(moveElement.value, { effect: 'move', x: -92 })
  }
  if (dissolveHost.value && dissolveElement.value) {
    const group = createLiquidGroup(dissolveHost.value, groupOptions('#6d8cff'))
    groups.push(group)
    dissolveItem = group.add(dissolveElement.value, { x: -88, dissolve: 0.3 })
  }
})

watch(mergeOpen, syncMerge)
watch(shapeWide, syncShape)
watch(moveRight, syncMove)
watch(dissolving, syncDissolve)
watch([blur, contrast], ([nextBlur, nextContrast]) =>
  groups.forEach((group) =>
    group.update({ blur: nextBlur, contrast: nextContrast }),
  ),
)
watch(fill, (value) => groups[0]?.update({ fill: value }))

onBeforeUnmount(() => {
  beam?.destroy()
  groups.forEach((group) => group.destroy())
})
</script>

<template>
  <main>
    <section ref="beamHost" class="hero-beam">
      <div class="hero-card">
        <p class="eyebrow">Native browser controller · Vue 3</p>
        <h1>Interfaces with<br /><em>surface tension.</em></h1>
        <p class="intro">
          Morph, shape evolution, spring movement, and dissolve. Each specimen
          is an isolated native controller managed by Vue's lifecycle.
        </p>
        <nav aria-label="Project links">
          <a href="https://www.npmjs.com/package/@danixts/liquid-gooey">npm</a>
          <a href="https://github.com/danixts/jakub-antalik">GitHub</a>
          <a href="../beam/">Border Beam</a>
        </nav>
      </div>
    </section>

    <section class="global-controls" aria-label="Liquid group controls">
      <div><span>Group controls</span><strong>Shared filter</strong></div>
      <label
        >Blur <output>{{ blur }}px</output
        ><input v-model.number="blur" type="range" min="3" max="16" step="1"
      /></label>
      <label
        >Contrast <output>{{ contrast }}</output
        ><input
          v-model.number="contrast"
          type="range"
          min="8"
          max="28"
          step="1"
      /></label>
      <label>Merge color <input v-model="fill" type="color" /></label>
    </section>

    <section class="specimen-grid">
      <article class="specimen specimen-large">
        <div class="specimen-copy">
          <span>01 · Morph</span>
          <h2>Merge nearby pieces.</h2>
          <p>
            Three ordinary buttons share one SVG silhouette while their DOM
            content remains interactive.
          </p>
          <button type="button" class="action" @click="mergeOpen = !mergeOpen">
            {{ mergeOpen ? 'Collapse' : 'Expand' }}
          </button>
        </div>
        <div class="stage">
          <div ref="mergeHost" class="liquid-group merge-group">
            <button
              v-for="(label, index) in ['Image', 'Link', 'Note']"
              :key="label"
              :ref="(element) => setMergeElement(element, index)"
              class="liquid-item"
              type="button"
              :aria-label="label"
            >
              {{ label.slice(0, 1) }}
            </button>
            <button
              class="trigger"
              type="button"
              :aria-expanded="mergeOpen"
              @click="mergeOpen = !mergeOpen"
            >
              {{ mergeOpen ? '−' : '+' }}
            </button>
          </div>
        </div>
      </article>

      <article class="specimen">
        <div class="specimen-copy">
          <span>02 · Morph shape</span>
          <h2>Evolve the silhouette.</h2>
          <p>Resize and radius changes settle through the morph spring.</p>
          <button type="button" class="action" @click="shapeWide = !shapeWide">
            Change shape
          </button>
        </div>
        <div class="stage">
          <div ref="shapeHost" class="liquid-group compact-group">
            <button
              ref="shapeElement"
              class="shape-item"
              :class="{ wide: shapeWide }"
              type="button"
              @click="shapeWide = !shapeWide"
            >
              {{ shapeWide ? 'Wide' : 'Round' }}
            </button>
          </div>
        </div>
      </article>

      <article class="specimen">
        <div class="specimen-copy">
          <span>03 · Move</span>
          <h2>Spring, wobble, stretch.</h2>
          <p>
            Velocity deforms the blob while the native button follows its
            transform.
          </p>
          <button type="button" class="action" @click="moveRight = !moveRight">
            Send across
          </button>
        </div>
        <div class="stage">
          <div ref="moveHost" class="liquid-group compact-group">
            <button
              ref="moveElement"
              class="move-item"
              type="button"
              @click="moveRight = !moveRight"
            >
              Move
            </button>
          </div>
        </div>
      </article>

      <article class="specimen specimen-wide">
        <div class="specimen-copy">
          <span>04 · Dissolve</span>
          <h2>Warp into particles.</h2>
          <p>
            Noise, gravity, flow, blur, and strength are combined in the
            dissolve blend pipeline.
          </p>
          <button
            type="button"
            class="action"
            @click="dissolving = !dissolving"
          >
            {{ dissolving ? 'Restore' : 'Dissolve' }}
          </button>
        </div>
        <div class="stage">
          <div ref="dissolveHost" class="liquid-group dissolve-group">
            <button
              ref="dissolveElement"
              class="dissolve-item"
              type="button"
              @click="dissolving = !dissolving"
            >
              Flow
            </button>
          </div>
        </div>
      </article>
    </section>

    <section class="api-note">
      <span>One API</span><code>createLiquidGroup(element, options)</code>
      <p>
        Add any descendant with <code>group.add()</code>, update it reactively,
        then destroy the group on unmount.
      </p>
    </section>

    <footer>
      Original effect by
      <a href="https://github.com/Jakubantalik/Libraries">Jakub Antalik</a>.
      Independent native port for Astro and Vue.
    </footer>
  </main>
</template>
