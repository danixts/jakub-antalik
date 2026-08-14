import { afterEach, describe, expect, it } from 'vitest'
import { createBorderBeam } from '../src'

function host(): HTMLElement {
  const element = document.createElement('article')
  const content = document.createElement('div')
  content.style.borderRadius = '20px'
  element.append(content)
  document.body.append(element)
  return element
}

afterEach(() => {
  document.body.replaceChildren()
  document.head.querySelectorAll('style').forEach((element) => element.remove())
})

describe('createBorderBeam', () => {
  it('mounts, updates, and removes only its owned decoration', () => {
    const element = host()
    const content = element.firstElementChild
    const beam = createBorderBeam(element, { size: 'line', strength: 0.5 })

    expect(element.dataset.beam).toMatch(/^bb-/)
    expect(element.hasAttribute('data-active')).toBe(true)
    expect(element.style.getPropertyValue('--beam-strength')).toBe('0.5')
    expect(element.querySelector('[data-beam-bloom]')).not.toBeNull()

    beam.update({ strength: 0.8 })
    expect(element.style.getPropertyValue('--beam-strength')).toBe('0.8')

    beam.update({ inset: 8 })
    expect(document.head.querySelector('style')?.textContent).toContain(
      'inset: 8px !important',
    )

    beam.destroy()
    expect(element.firstElementChild).toBe(content)
    expect(element.dataset.beam).toBeUndefined()
    expect(element.querySelector('[data-beam-bloom]')).toBeNull()
  })

  it('keeps simultaneous instances isolated', () => {
    const first = host()
    const second = host()
    const firstBeam = createBorderBeam(first)
    const secondBeam = createBorderBeam(second)

    expect(first.dataset.beam).not.toBe(second.dataset.beam)
    firstBeam.destroy()
    expect(second.querySelector('[data-beam-bloom]')).not.toBeNull()
    secondBeam.destroy()
  })

  it('aligns the generated radius with the host surface', () => {
    const element = document.createElement('button')
    element.style.borderRadius = '13px'
    document.body.append(element)

    const beam = createBorderBeam(element, { size: 'md' })

    expect(document.head.querySelector('style')?.textContent).toContain(
      'border-radius: 13px',
    )
    beam.destroy()
  })
})
