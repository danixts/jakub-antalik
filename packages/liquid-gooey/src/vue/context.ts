import type { InjectionKey, ShallowRef } from 'vue'
import type { LiquidGroupController } from '../types'

export interface LiquidGroupContext {
  controller: ShallowRef<LiquidGroupController | undefined>
}

export const liquidGroupKey = Symbol(
  'LiquidGroup',
) as InjectionKey<LiquidGroupContext>
