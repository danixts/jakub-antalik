import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { BorderBeam } from '../src/vue'

afterEach(() => {
  document.body.replaceChildren()
  document.head.querySelectorAll('style').forEach((element) => element.remove())
})

describe('BorderBeam Vue component', () => {
  it('maps reactive props to the native controller and cleans up', async () => {
    const wrapper = mount(BorderBeam, {
      attachTo: document.body,
      props: { size: 'md', strength: 0.7 },
      slots: { default: '<div style="border-radius: 16px">Content</div>' },
    })

    expect(wrapper.element.getAttribute('data-beam')).toMatch(/^bb-/)
    expect(
      (wrapper.element as HTMLElement).style.getPropertyValue(
        '--beam-strength',
      ),
    ).toBe('0.7')

    await wrapper.setProps({ inset: 6, strength: 0.45 })
    await nextTick()

    expect(document.head.querySelector('style')?.textContent).toContain(
      'inset: 6px !important',
    )
    expect(
      (wrapper.element as HTMLElement).style.getPropertyValue(
        '--beam-strength',
      ),
    ).toBe('0.45')

    const element = wrapper.element
    wrapper.unmount()
    expect(element.getAttribute('data-beam')).toBeNull()
  })
})
