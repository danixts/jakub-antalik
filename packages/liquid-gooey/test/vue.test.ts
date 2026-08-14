import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { LiquidGroup, LiquidItem } from '../src/vue'

afterEach(() => document.body.replaceChildren())

describe('Liquid Gooey Vue components', () => {
  it('registers nested items reactively and destroys the SVG surface', async () => {
    const x = ref(0)
    const TestComponent = defineComponent(
      () => () =>
        h(LiquidGroup, { class: 'group', fill: '#8b5cf6' }, () => [
          h(
            LiquidItem,
            { as: 'button', class: 'item', x: x.value, transition: 'smooth' },
            () => 'Action',
          ),
        ]),
    )

    const wrapper = mount(TestComponent, { attachTo: document.body })
    await nextTick()

    const group = wrapper.get('.group').element
    const item = wrapper.get('.item').element as HTMLElement
    expect(group.querySelector('[data-liquid-surface]')).not.toBeNull()

    x.value = 48
    await nextTick()
    expect(item.style.transform).toContain('48px')

    wrapper.unmount()
    expect(group.querySelector('[data-liquid-surface]')).toBeNull()
  })
})
