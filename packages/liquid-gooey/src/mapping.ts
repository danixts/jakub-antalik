import { EVOLVE_DEFAULTS, MOVE_DEFAULTS } from './observer'
import type {
  BlendConfig,
  EvolveOptions,
  ItemDynamics,
  MoveOptions,
} from './observer'
import type {
  DissolveOptions,
  LiquidItemOptions,
  MorphTuning,
  MoveTuning,
} from './types'

function dampingRatio(bounce: number): number {
  return Math.max(0.12, 1 - 1.1 * Math.min(1, Math.max(0, bounce)))
}

function mapMorph(tuning: MorphTuning | undefined): Required<EvolveOptions> {
  const speed = Math.max(0.25, tuning?.speed ?? 1)
  const dampingScale = dampingRatio(tuning?.bounce ?? 0.5) / dampingRatio(0.5)
  return {
    ...EVOLVE_DEFAULTS,
    massStiffness: EVOLVE_DEFAULTS.massStiffness * speed * speed,
    massDamping: EVOLVE_DEFAULTS.massDamping * speed * dampingScale,
    sizeStiffness: EVOLVE_DEFAULTS.sizeStiffness * speed * speed,
    sizeDamping: EVOLVE_DEFAULTS.sizeDamping * speed * dampingScale,
    radiusStiffness: EVOLVE_DEFAULTS.radiusStiffness * speed * speed,
    radiusDamping: EVOLVE_DEFAULTS.radiusDamping * speed,
    cornerDuration: EVOLVE_DEFAULTS.cornerDuration / speed,
    contentBlur: tuning?.contentBlur ?? EVOLVE_DEFAULTS.contentBlur,
    ...tuning?.advanced?.evolve,
  } as Required<EvolveOptions>
}

function mapMove(tuning: MoveTuning | undefined): Required<MoveOptions> {
  const springiness = Math.min(1, Math.max(0, tuning?.springiness ?? 0.5))
  const stiffness = MOVE_DEFAULTS.stiffness * 10 ** (springiness - 0.5)
  const damping =
    MOVE_DEFAULTS.damping *
    Math.sqrt(stiffness / MOVE_DEFAULTS.stiffness) *
    (dampingRatio(tuning?.wobble ?? 0.5) / dampingRatio(0.5))
  return {
    ...MOVE_DEFAULTS,
    stiffness,
    damping,
    stretch: 0.5 * Math.min(1, Math.max(0, tuning?.stretch ?? 0.36)),
    tail: 0.8 * Math.min(1, Math.max(0, tuning?.trail ?? 0.575)),
    ...tuning?.advanced,
  } as Required<MoveOptions>
}

function dissolveDefaults(value: boolean | number): DissolveOptions {
  const strength =
    typeof value === 'number' ? Math.min(1, Math.max(0, value)) : 1
  return {
    warp: 26,
    blur: 8,
    mix: 0.7,
    gravity: 60,
    taper: 1,
    warpFreq: 1.7,
    flowSpeed: 22,
    detail: 2,
    zone: 18,
    range: 49,
    releaseMs: 110,
    strength,
  }
}

export function resolveDynamics(
  options: LiquidItemOptions,
): ItemDynamics | undefined {
  if (options.effect === 'move') {
    return {
      evolve: false,
      move: true,
      evolveOpts: EVOLVE_DEFAULTS,
      moveOpts: mapMove(options.move),
    }
  }
  if (options.morph?.shape) {
    return {
      evolve: true,
      move: false,
      evolveOpts: mapMorph(options.morph),
      moveOpts: MOVE_DEFAULTS,
    }
  }
  return undefined
}

export function resolveBlend(
  options: LiquidItemOptions,
  host: SVGGElement,
): BlendConfig | undefined {
  if (
    options.effect === 'move' ||
    options.dissolve === undefined ||
    options.dissolve === false
  )
    return undefined
  const resolved =
    typeof options.dissolve === 'object'
      ? { ...dissolveDefaults(true), ...options.dissolve }
      : dissolveDefaults(options.dissolve)
  return {
    host,
    blur: resolved.blur ?? 8,
    warp: resolved.warp ?? 26,
    pull: resolved.pull ?? 4,
    range: resolved.range,
    zone: resolved.zone,
    mix: resolved.mix ?? 0,
    gravity: resolved.gravity ?? 60,
    taper: resolved.taper ?? 1,
    warpFreq: resolved.warpFreq ?? 1.7,
    flowSpeed: resolved.flowSpeed ?? 22,
    warpStyle: resolved.warpStyle ?? 'fractalNoise',
    detail: resolved.detail ?? 2,
    active: resolved.active !== false,
    releaseMs: resolved.releaseMs ?? 240,
    fadeMs: resolved.fadeMs,
    strength: resolved.strength ?? 1,
    sink: resolved.sink,
  }
}
