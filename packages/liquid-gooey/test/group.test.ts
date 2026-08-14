import { afterEach, describe, expect, it } from 'vitest'
import { createLiquidGroup } from '../src'

afterEach(() => document.body.replaceChildren())

function fixture(): { group: HTMLElement; item: HTMLElement } {
  const group = document.createElement('section')
  const item = document.createElement('button')
  group.append(item)
  document.body.append(group)
  return { group, item }
}

describe('createLiquidGroup', () => {
  it('owns an isolated SVG surface and restores the host on destroy', () => {
    const { group, item } = fixture()
    const liquid = createLiquidGroup(group, { fill: '#8b5cf6' })
    const controller = liquid.add(item, { effect: 'morph', x: 12 })

    expect(group.querySelector('[data-liquid-surface]')).not.toBeNull()
    expect(group.querySelector('[data-liquid-overlay]')).not.toBeNull()
    expect(item.style.transform).toContain('12px')

    controller.update({ x: 24 })
    expect(item.style.transform).toContain('24px')

    liquid.destroy()
    expect(group.querySelector('[data-liquid-surface]')).toBeNull()
    expect(group.querySelector('[data-liquid-overlay]')).toBeNull()
    expect(group.firstElementChild).toBe(item)
    expect(item.style.transform).toBe('')
  })

  it('rejects items outside the group', () => {
    const { group } = fixture()
    const outside = document.createElement('button')
    const liquid = createLiquidGroup(group)

    expect(() => liquid.add(outside)).toThrow('descendants')
    liquid.destroy()
  })
})
