import type { ShadowLayer } from './shadow'

const SVG_NS = 'http://www.w3.org/2000/svg'
const BINARIZE = '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 100 -50'

export function createSvgElement<K extends keyof SVGElementTagNameMap>(
  documentRef: Document,
  name: K,
  attributes: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const element = documentRef.createElementNS(SVG_NS, name)
  for (const [key, value] of Object.entries(attributes))
    element.setAttribute(key, String(value))
  return element
}

function appendInsetPass(
  documentRef: Document,
  filter: SVGFilterElement,
  shadow: ShadowLayer,
  index: number,
): void {
  let source = 'bin'
  if (shadow.spread !== 0) {
    const result = `s${index}-er`
    filter.append(
      createSvgElement(documentRef, 'feMorphology', {
        in: source,
        operator: shadow.spread > 0 ? 'erode' : 'dilate',
        radius: Math.abs(shadow.spread),
        result,
      }),
    )
    source = result
  }
  if (shadow.x !== 0 || shadow.y !== 0) {
    const result = `s${index}-o`
    filter.append(
      createSvgElement(documentRef, 'feOffset', {
        in: source,
        dx: shadow.x,
        dy: shadow.y,
        result,
      }),
    )
    source = result
  }
  if (shadow.blur > 0) {
    const result = `s${index}-b`
    filter.append(
      createSvgElement(documentRef, 'feGaussianBlur', {
        in: source,
        stdDeviation: shadow.blur / 2,
        result,
      }),
    )
    source = result
  }
  filter.append(
    createSvgElement(documentRef, 'feComposite', {
      in: 'bin',
      in2: source,
      operator: 'out',
      result: `s${index}-band`,
    }),
    createSvgElement(documentRef, 'feFlood', {
      'flood-color': shadow.color,
      result: `s${index}-c`,
    }),
    createSvgElement(documentRef, 'feComposite', {
      in: `s${index}-c`,
      in2: `s${index}-band`,
      operator: 'in',
      result: `s${index}`,
    }),
  )
}

function appendOuterPass(
  documentRef: Document,
  filter: SVGFilterElement,
  shadow: ShadowLayer,
  index: number,
): void {
  let source = 'shape'
  if (shadow.spread !== 0) {
    const result = `s${index}-sp`
    filter.append(
      createSvgElement(documentRef, 'feMorphology', {
        in: 'bin',
        operator: shadow.spread > 0 ? 'dilate' : 'erode',
        radius: Math.abs(shadow.spread),
        result,
      }),
    )
    source = result
  }
  if (shadow.blur > 0) {
    const result = `s${index}-b`
    filter.append(
      createSvgElement(documentRef, 'feGaussianBlur', {
        in: source,
        stdDeviation: shadow.blur / 2,
        result,
      }),
    )
    source = result
  }
  if (shadow.x !== 0 || shadow.y !== 0) {
    const result = `s${index}-o`
    filter.append(
      createSvgElement(documentRef, 'feOffset', {
        in: source,
        dx: shadow.x,
        dy: shadow.y,
        result,
      }),
    )
    source = result
  }
  filter.append(
    createSvgElement(documentRef, 'feFlood', {
      'flood-color': shadow.color,
      result: `s${index}-c`,
    }),
    createSvgElement(documentRef, 'feComposite', {
      in: `s${index}-c`,
      in2: source,
      operator: 'in',
      result: `s${index}`,
    }),
  )
}

export function renderFilterPrimitives(
  documentRef: Document,
  filter: SVGFilterElement,
  blur: number,
  contrast: number,
  shadows: ShadowLayer[],
): void {
  filter.replaceChildren()
  const intercept = Math.round((0.5 - contrast * (5 / 12)) * 100) / 100
  filter.append(
    createSvgElement(documentRef, 'feGaussianBlur', {
      in: 'SourceGraphic',
      stdDeviation: blur,
      result: 'blur',
    }),
    createSvgElement(documentRef, 'feColorMatrix', {
      in: 'blur',
      type: 'matrix',
      values: `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${contrast} ${intercept}`,
      result: 'goo',
    }),
    createSvgElement(documentRef, 'feComposite', {
      in: 'SourceGraphic',
      in2: 'goo',
      operator: 'atop',
      result: 'shape',
    }),
  )
  if (shadows.some((shadow) => shadow.inset || shadow.spread !== 0)) {
    filter.append(
      createSvgElement(documentRef, 'feColorMatrix', {
        in: 'shape',
        type: 'matrix',
        values: BINARIZE,
        result: 'bin',
      }),
    )
  }
  shadows.forEach((shadow, index) => {
    if (shadow.inset) appendInsetPass(documentRef, filter, shadow, index)
    else appendOuterPass(documentRef, filter, shadow, index)
  })
  if (shadows.length === 0) return

  const merge = createSvgElement(documentRef, 'feMerge')
  shadows
    .map((shadow, index) => (shadow.inset ? -1 : index))
    .filter((index) => index >= 0)
    .reverse()
    .forEach((index) =>
      merge.append(
        createSvgElement(documentRef, 'feMergeNode', { in: `s${index}` }),
      ),
    )
  merge.append(createSvgElement(documentRef, 'feMergeNode', { in: 'shape' }))
  shadows.forEach((shadow, index) => {
    if (shadow.inset)
      merge.append(
        createSvgElement(documentRef, 'feMergeNode', { in: `s${index}` }),
      )
  })
  filter.append(merge)
}
