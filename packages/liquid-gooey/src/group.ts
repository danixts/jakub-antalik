import { createSvgElement, renderFilterPrimitives } from './filter'
import { normalizeRadius } from './geometry'
import { resolveBlend, resolveDynamics } from './mapping'
import { ObserveEngine } from './observer'
import { parseShadow } from './shadow'
import { resolveTransition } from './spring'
import type {
  LiquidGroupController,
  LiquidGroupOptions,
  LiquidItemController,
  LiquidItemOptions,
} from './types'

const DEFAULT_GROUP_OPTIONS = {
  blur: 6,
  contrast: 18,
  fill: '#fff',
  filterPadding: 24,
} as const satisfies LiquidGroupOptions

let nextGroupId = 0

export function createLiquidGroup(
  element: HTMLElement,
  initialOptions: LiquidGroupOptions = {},
): LiquidGroupController {
  const documentRef = element.ownerDocument
  const windowRef = documentRef.defaultView
  if (!windowRef) throw new Error('Liquid Gooey requires a browser document')

  const id = `liquid-${++nextGroupId}`
  const filterId = `${id}-filter`
  const silhouetteId = `${id}-silhouette`
  const maskId = `${id}-mask`
  const originalPosition = element.style.position
  const originalIsolation = element.style.isolation
  let options: LiquidGroupOptions = {
    ...DEFAULT_GROUP_OPTIONS,
    ...initialOptions,
  }
  let destroyed = false

  const surfaceSvg = createSvgElement(documentRef, 'svg', {
    'aria-hidden': 'true',
    focusable: 'false',
    'data-liquid-surface': '',
  })
  const surfaceDefs = createSvgElement(documentRef, 'defs')
  const filter = createSvgElement(documentRef, 'filter', {
    id: filterId,
    filterUnits: 'userSpaceOnUse',
    'color-interpolation-filters': 'sRGB',
  })
  const silhouette = createSvgElement(documentRef, 'g', {
    id: silhouetteId,
    filter: `url(#${filterId})`,
  })
  surfaceDefs.append(filter)
  surfaceSvg.append(surfaceDefs, silhouette)

  const overlaySvg = createSvgElement(documentRef, 'svg', {
    'aria-hidden': 'true',
    focusable: 'false',
    'data-liquid-overlay': '',
  })
  const overlayDefs = createSvgElement(documentRef, 'defs')
  const mask = createSvgElement(documentRef, 'mask', {
    id: maskId,
    maskUnits: 'userSpaceOnUse',
  })
  mask.append(
    createSvgElement(documentRef, 'use', { href: `#${silhouetteId}` }),
  )
  overlayDefs.append(mask)
  const masked = createSvgElement(documentRef, 'g', {
    mask: `url(#${maskId})`,
  })
  const meltPortal = createSvgElement(documentRef, 'g')
  masked.append(meltPortal)
  overlaySvg.append(overlayDefs, masked)

  Object.assign(surfaceSvg.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    overflow: 'visible',
    pointerEvents: 'none',
    zIndex: '0',
    willChange: 'filter, transform',
  })
  Object.assign(overlaySvg.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    overflow: 'visible',
    pointerEvents: 'none',
    zIndex: '9999',
  })
  element.style.position =
    windowRef.getComputedStyle(element).position === 'static'
      ? 'relative'
      : element.style.position
  element.style.isolation = 'isolate'
  element.prepend(surfaceSvg)
  element.append(overlaySvg)

  const engine = new ObserveEngine(() => element)
  const items = new Set<LiquidItemController>()

  const render = () => {
    const blur = options.blur ?? DEFAULT_GROUP_OPTIONS.blur
    const contrast = options.contrast ?? DEFAULT_GROUP_OPTIONS.contrast
    const shadows = parseShadow(options.shadow)
    const svgShadows = shadows.filter(
      (shadow) => shadow.inset || shadow.spread !== 0,
    )
    const cssShadows = shadows
      .filter((shadow) => !shadow.inset && shadow.spread === 0)
      .map(
        (shadow) =>
          `drop-shadow(${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color})`,
      )
      .join(' ')
    const shadowExtent = svgShadows.reduce(
      (maximum, shadow) =>
        Math.max(
          maximum,
          Math.max(Math.abs(shadow.x), Math.abs(shadow.y)) +
            shadow.blur * 1.5 +
            Math.max(0, shadow.spread),
        ),
      0,
    )
    const padding = Math.ceil(
      blur * 3 +
        shadowExtent +
        (options.filterPadding ?? DEFAULT_GROUP_OPTIONS.filterPadding),
    )
    const width = element.offsetWidth
    const height = element.offsetHeight

    for (const target of [filter, mask]) {
      target.setAttribute('x', String(-padding))
      target.setAttribute('y', String(-padding))
      target.setAttribute('width', String(width + padding * 2))
      target.setAttribute('height', String(height + padding * 2))
    }
    surfaceSvg.style.filter = cssShadows
    silhouette.style.fill = options.fill ?? DEFAULT_GROUP_OPTIONS.fill
    engine.gooBlur = blur
    renderFilterPrimitives(documentRef, filter, blur, contrast, svgShadows)
    engine.wake()
  }

  const resizeObserver =
    typeof windowRef.ResizeObserver === 'function'
      ? new windowRef.ResizeObserver(render)
      : undefined
  resizeObserver?.observe(element)
  render()

  const controller: LiquidGroupController = {
    element,
    add(target, initialItemOptions = {}) {
      if (destroyed)
        throw new Error('Cannot add an item to a destroyed Liquid group')
      if (!element.contains(target))
        throw new Error('Liquid items must be descendants of their group')

      const blob = createSvgElement(documentRef, 'rect', {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      })
      const meltHost = createSvgElement(documentRef, 'g', { opacity: 0 })
      blob.style.willChange = 'transform'
      blob.style.transformBox = 'fill-box'
      blob.style.transformOrigin = 'center'
      silhouette.append(blob)
      meltPortal.append(meltHost)

      const originalTransform = target.style.transform
      const originalTransition = target.style.transition
      const originalFilter = target.style.filter
      const originalPosition = target.style.position
      const originalZIndex = target.style.zIndex
      if (windowRef.getComputedStyle(target).position === 'static') {
        target.style.position = 'relative'
      }
      if (windowRef.getComputedStyle(target).zIndex === 'auto') {
        target.style.zIndex = '1'
      }
      let itemOptions: LiquidItemOptions = { ...initialItemOptions }
      let unregister: (() => void) | undefined
      let itemDestroyed = false

      const register = () => {
        unregister?.()
        const reducedMotion = windowRef.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        const transition = resolveTransition(
          itemOptions.transition,
          reducedMotion,
        )
        const x = itemOptions.x ?? 0
        const y = itemOptions.y ?? 0
        const scale = itemOptions.scale ?? 1
        target.style.transition =
          transition.duration === 0
            ? 'none'
            : `transform ${transition.duration}ms ${transition.easing} ${itemOptions.delay ?? 0}ms`
        target.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`

        const blend = resolveBlend(itemOptions, meltHost)
        const dynamics = resolveDynamics(itemOptions)
        const radius =
          itemOptions.radius === undefined
            ? undefined
            : normalizeRadius(itemOptions.radius)[0]
        unregister = engine.add({
          target,
          blob,
          radius,
          blobInset: itemOptions.morph?.advanced?.blobInset,
          bridgeGrow: itemOptions.morph?.advanced?.bridgeGrow,
          blend,
          dynamics,
        })

        engine.wake()
      }

      const itemController: LiquidItemController = {
        element: target,
        update(nextOptions) {
          if (itemDestroyed) return
          itemOptions = { ...itemOptions, ...nextOptions }
          register()
        },
        destroy() {
          if (itemDestroyed) return
          itemDestroyed = true
          unregister?.()
          blob.remove()
          meltHost.remove()
          target.style.transform = originalTransform
          target.style.transition = originalTransition
          target.style.filter = originalFilter
          target.style.position = originalPosition
          target.style.zIndex = originalZIndex
          items.delete(itemController)
        },
      }
      items.add(itemController)
      register()
      return itemController
    },
    update(nextOptions) {
      if (destroyed) return
      options = { ...options, ...nextOptions }
      render()
    },
    wake() {
      if (!destroyed) engine.wake()
    },
    destroy() {
      if (destroyed) return
      destroyed = true
      for (const item of items) item.destroy()
      resizeObserver?.disconnect()
      engine.dispose()
      surfaceSvg.remove()
      overlaySvg.remove()
      element.style.position = originalPosition
      element.style.isolation = originalIsolation
    },
  }

  return controller
}
