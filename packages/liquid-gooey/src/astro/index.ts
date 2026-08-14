/// <reference path="../astro-modules.d.ts" />

import LiquidGroupComponent from './LiquidGroup.astro'
import LiquidItemComponent from './LiquidItem.astro'
import type {
  LiquidGroupAstroComponent,
  LiquidItemAstroComponent,
} from './types'

export const LiquidGroup = LiquidGroupComponent as LiquidGroupAstroComponent
export const LiquidItem = LiquidItemComponent as LiquidItemAstroComponent
export type { LiquidGroupProps, LiquidItemProps } from './types'
