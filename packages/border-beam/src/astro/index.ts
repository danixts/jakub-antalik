/// <reference path="../astro-modules.d.ts" />

import BorderBeamComponent from './BorderBeam.astro'
import type { BorderBeamAstroComponent } from './types'

export const BorderBeam = BorderBeamComponent as BorderBeamAstroComponent
export type { BorderBeamProps } from './types'
