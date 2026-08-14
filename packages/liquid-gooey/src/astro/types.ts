import type { HTMLTag, Polymorphic } from 'astro/types'
import type { LiquidGroupOptions, LiquidItemOptions } from '../types'

export type LiquidGroupProps<Tag extends HTMLTag = 'div'> = LiquidGroupOptions &
  Polymorphic<{ as: Tag }>

export type LiquidItemProps<Tag extends HTMLTag = 'div'> = LiquidItemOptions &
  Polymorphic<{ as: Tag }>

export type LiquidGroupAstroComponent = <Tag extends HTMLTag = 'div'>(
  props: LiquidGroupProps<Tag>,
) => unknown

export type LiquidItemAstroComponent = <Tag extends HTMLTag = 'div'>(
  props: LiquidItemProps<Tag>,
) => unknown
