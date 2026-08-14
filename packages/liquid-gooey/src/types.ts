import type { CornerRadii } from './geometry'
import type { EvolveOptions, MoveOptions } from './observer'
import type { Transition } from './spring'

export interface LiquidGroupOptions {
  blur?: number
  contrast?: number
  fill?: string
  shadow?: string
  filterPadding?: number
}

export interface DissolveOptions {
  blur?: number
  warp?: number
  pull?: number
  range?: number
  zone?: number
  mix?: number
  gravity?: number
  taper?: number
  warpFreq?: number
  flowSpeed?: number
  warpStyle?: 'fractalNoise' | 'turbulence'
  detail?: number
  active?: boolean
  releaseMs?: number
  fadeMs?: number
  strength?: number
  sink?: number
}

export interface MorphTuning {
  shape?: boolean
  speed?: number
  bounce?: number
  contentBlur?: number
  advanced?: {
    evolve?: EvolveOptions
    blobInset?: number
    bridgeGrow?: number
  }
}

export interface MoveTuning {
  springiness?: number
  wobble?: number
  stretch?: number
  trail?: number
  advanced?: MoveOptions
}

export interface LiquidItemOptions {
  effect?: 'morph' | 'move'
  morph?: MorphTuning
  move?: MoveTuning
  dissolve?: boolean | number | DissolveOptions
  x?: number
  y?: number
  scale?: number
  transition?: Transition
  delay?: number
  radius?: number | CornerRadii
}

export interface LiquidItemController {
  readonly element: HTMLElement
  update(options: Partial<LiquidItemOptions>): void
  destroy(): void
}

export interface LiquidGroupController {
  readonly element: HTMLElement
  add(element: HTMLElement, options?: LiquidItemOptions): LiquidItemController
  update(options: Partial<LiquidGroupOptions>): void
  wake(): void
  destroy(): void
}
