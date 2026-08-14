<script setup lang="ts">
import { BorderBeam } from '@danixts/border-beam/vue'
import { ref } from 'vue'

const active = ref(true)
const inset = ref(4)
</script>

<template>
  <div class="vue-beam-demo">
    <BorderBeam
      as="button"
      class="vue-beam-button"
      size="md"
      color-variant="ocean"
      theme="dark"
      :active="active"
      :inset="inset"
      :strength="0.85"
      type="button"
      @click="active = !active"
    >
      Vue component
    </BorderBeam>
    <label>
      Inset
      <input v-model.number="inset" type="range" min="0" max="12" />
      <output>{{ inset }}px</output>
    </label>
  </div>
</template>

<style scoped>
.vue-beam-demo {
  display: grid;
  justify-items: center;
  gap: 24px;
}
.vue-beam-button {
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 13px;
  padding: 0 18px;
  background: var(--surface-raised);
  color: var(--text);
  cursor: pointer;
}
label {
  display: grid;
  grid-template-columns: auto 120px 36px;
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
