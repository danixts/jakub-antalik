import { registerPulseInstance } from './pulseDriver'
import {
  generateBeamCSS,
  getPulseDriverConfig,
  sizePresets,
  sizeThemePresets,
} from './styles'
import type {
  BorderBeamController,
  BorderBeamOptions,
  BorderBeamTheme,
} from './types'

const DEFAULT_OPTIONS = {
  size: 'md',
  colorVariant: 'colorful',
  theme: 'dark',
  staticColors: false,
  active: true,
  hueRange: 30,
  strength: 1,
} as const satisfies BorderBeamOptions

let nextId = 0

function resolveTheme(
  theme: BorderBeamTheme,
  media: MediaQueryList,
): 'dark' | 'light' {
  return theme === 'auto' ? (media.matches ? 'dark' : 'light') : theme
}

export function createBorderBeam(
  element: HTMLElement,
  initialOptions: BorderBeamOptions = {},
): BorderBeamController {
  const documentRef = element.ownerDocument
  const windowRef = documentRef.defaultView
  if (!windowRef) throw new Error('Border Beam requires a browser document')

  const id = `bb-${++nextId}`
  const styleElement = documentRef.createElement('style')
  const bloom = documentRef.createElement('span')
  const themeMedia = windowRef.matchMedia('(prefers-color-scheme: dark)')
  const reducedMotionMedia = windowRef.matchMedia(
    '(prefers-reduced-motion: reduce)',
  )
  const previousBeam = element.getAttribute('data-beam')
  const previousStrength = element.style.getPropertyValue('--beam-strength')
  let options: BorderBeamOptions = { ...DEFAULT_OPTIONS, ...initialOptions }
  let destroyed = false
  let visible = true
  let unregisterPulse: (() => void) | undefined

  bloom.dataset.beamBloom = ''
  bloom.setAttribute('aria-hidden', 'true')
  element.dataset.beam = id
  element.append(bloom)
  documentRef.head.append(styleElement)

  const contentElement = (): HTMLElement | undefined =>
    Array.from(element.children).find(
      (node): node is HTMLElement =>
        node !== bloom && node instanceof windowRef.HTMLElement,
    )

  const detectRadius = (): number | undefined => {
    const readRadius = (node: HTMLElement): number | undefined => {
      const radius = Number.parseFloat(
        node.style.borderTopLeftRadius ||
          node.style.borderRadius ||
          windowRef.getComputedStyle(node).borderTopLeftRadius,
      )
      return Number.isFinite(radius) && radius > 0 ? radius : undefined
    }
    const child = contentElement()
    return readRadius(element) ?? (child ? readRadius(child) : undefined)
  }

  const stopPulse = () => {
    unregisterPulse?.()
    unregisterPulse = undefined
  }

  const render = () => {
    if (destroyed) return
    stopPulse()

    const size = options.size ?? DEFAULT_OPTIONS.size
    const colorVariant = options.colorVariant ?? DEFAULT_OPTIONS.colorVariant
    const resolvedTheme = resolveTheme(
      options.theme ?? DEFAULT_OPTIONS.theme,
      themeMedia,
    )
    const themeConfig = sizeThemePresets[size][resolvedTheme]
    const sizeConfig = sizePresets[size]
    const isPulse = size === 'pulse-inner' || size === 'pulse-outside'
    const borderRadius =
      options.borderRadius ?? detectRadius() ?? sizeConfig.borderRadius
    const duration =
      options.duration ?? (size === 'line' ? 3.1 : isPulse ? 2.3 : 1.96)
    const saturation = options.saturation ?? themeConfig.saturation
    const brightness = options.brightness ?? themeConfig.brightness ?? 1.3
    const requestedHue = options.hueRange ?? DEFAULT_OPTIONS.hueRange
    const hueRange = size === 'line' ? Math.min(requestedHue, 13) : requestedHue
    const staticColors =
      colorVariant === 'mono' || (options.staticColors ?? false)

    styleElement.textContent = generateBeamCSS({
      id,
      borderRadius,
      borderWidth: sizeConfig.borderWidth,
      duration,
      strokeOpacity: themeConfig.strokeOpacity,
      innerOpacity: themeConfig.innerOpacity,
      bloomOpacity: themeConfig.bloomOpacity,
      innerShadow: themeConfig.innerShadow,
      size,
      colorVariant,
      staticColors,
      brightness,
      saturation,
      hueRange,
      theme: resolvedTheme,
      inset: options.inset,
      hairlineOpacity: themeConfig.hairlineOpacity,
    })

    const active = options.active !== false
    element.style.setProperty(
      '--beam-strength',
      String(Math.max(0, Math.min(1, options.strength ?? 1))),
    )
    element.toggleAttribute('data-active', active)
    element.toggleAttribute('data-paused', active && !visible)

    if (size === 'pulse-outside') {
      const rect = contentElement()?.getBoundingClientRect()
      if (rect?.width && rect.height) {
        const clamp = (value: number) => Math.max(0.35, Math.min(4, value))
        element.style.setProperty(
          '--pulse-glow-sx',
          clamp(rect.width / 350).toFixed(3),
        )
        element.style.setProperty(
          '--pulse-glow-sy',
          clamp(rect.height / 140).toFixed(3),
        )
      }
    } else {
      element.style.removeProperty('--pulse-glow-sx')
      element.style.removeProperty('--pulse-glow-sy')
    }

    const driver = getPulseDriverConfig(
      size,
      resolvedTheme,
      duration,
      hueRange,
      staticColors,
      id,
    )
    if (driver && active && visible && !reducedMotionMedia.matches) {
      unregisterPulse = registerPulseInstance(element, driver)
    }
  }

  const onAnimationEnd = (event: AnimationEvent) => {
    if (event.animationName.includes('fade-out')) {
      element.removeAttribute('data-fading')
      options.onDeactivate?.()
    } else if (event.animationName.includes('fade-in')) {
      options.onActivate?.()
    }
  }
  const onThemeChange = () => {
    if (options.theme === 'auto') render()
  }

  const intersectionObserver =
    typeof windowRef.IntersectionObserver === 'function'
      ? new windowRef.IntersectionObserver(
          (entries) => {
            visible = entries.some((entry) => entry.isIntersecting)
            render()
          },
          { rootMargin: '256px' },
        )
      : undefined
  const resizeObserver =
    typeof windowRef.ResizeObserver === 'function'
      ? new windowRef.ResizeObserver(render)
      : undefined

  element.addEventListener('animationend', onAnimationEnd)
  themeMedia.addEventListener('change', onThemeChange)
  reducedMotionMedia.addEventListener('change', render)
  intersectionObserver?.observe(element)
  resizeObserver?.observe(element)
  render()

  return {
    element,
    update(nextOptions) {
      options = { ...options, ...nextOptions }
      render()
    },
    activate() {
      options.active = true
      element.removeAttribute('data-fading')
      render()
    },
    deactivate() {
      if (options.active === false) return
      options.active = false
      element.removeAttribute('data-active')
      element.setAttribute('data-fading', '')
      render()
    },
    destroy() {
      if (destroyed) return
      destroyed = true
      stopPulse()
      intersectionObserver?.disconnect()
      resizeObserver?.disconnect()
      themeMedia.removeEventListener('change', onThemeChange)
      reducedMotionMedia.removeEventListener('change', render)
      element.removeEventListener('animationend', onAnimationEnd)
      bloom.remove()
      styleElement.remove()
      for (const attribute of ['data-active', 'data-fading', 'data-paused']) {
        element.removeAttribute(attribute)
      }
      if (previousBeam === null) element.removeAttribute('data-beam')
      else element.setAttribute('data-beam', previousBeam)
      if (previousStrength)
        element.style.setProperty('--beam-strength', previousStrength)
      else element.style.removeProperty('--beam-strength')
      element.style.removeProperty('--pulse-glow-sx')
      element.style.removeProperty('--pulse-glow-sy')
    },
  }
}
