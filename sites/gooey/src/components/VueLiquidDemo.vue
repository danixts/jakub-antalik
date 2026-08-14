<script setup lang="ts">
import { LiquidGroup, LiquidItem } from '@danixts/liquid-gooey/vue'
import { ref } from 'vue'

const open = ref(true)
const blur = ref(8)
const positions = [-72, 0, 72] as const
</script>

<template>
  <div class="vue-liquid-demo">
    <LiquidGroup
      class="vue-liquid-group"
      :blur="blur"
      :contrast="18"
      fill="#8f7cff"
    >
      <LiquidItem
        v-for="(x, index) in positions"
        :key="x"
        as="button"
        class="vue-liquid-item"
        :x="open ? x : 0"
        :y="open ? -42 : 0"
        :delay="index * 28"
        transition="bouncy"
        type="button"
      >
        {{ index + 1 }}
      </LiquidItem>
      <button class="vue-liquid-trigger" type="button" @click="open = !open">
        {{ open ? 'Close' : 'Open' }}
      </button>
    </LiquidGroup>
    <label>
      Blur
      <input v-model.number="blur" type="range" min="3" max="14" />
      <output>{{ blur }}px</output>
    </label>
  </div>
</template>

<style scoped>
.vue-liquid-demo {
  display: grid;
  justify-items: center;
  gap: 12px;
}
.vue-liquid-group {
  position: relative;
  width: 300px;
  height: 170px;
  display: grid;
  place-items: center;
}
.vue-liquid-item,
.vue-liquid-trigger {
  position: absolute;
  border: 0;
  color: white;
  cursor: pointer;
}
.vue-liquid-item {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: transparent;
  font-weight: 600;
}
.vue-liquid-trigger {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  background: #8f7cff;
  z-index: 3;
  font-size: 0.7rem;
}
label {
  display: grid;
  grid-template-columns: auto 110px 36px;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 0.7rem;
}
input {
  accent-color: var(--accent);
}
output {
  font-family: ui-monospace, monospace;
}
</style>
