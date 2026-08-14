import type { HTMLTag, Polymorphic } from 'astro/types'
import type { BorderBeamOptions } from '../types'

export type BorderBeamProps<Tag extends HTMLTag = 'div'> = BorderBeamOptions &
  Polymorphic<{ as: Tag }>

export type BorderBeamAstroComponent = <Tag extends HTMLTag = 'div'>(
  props: BorderBeamProps<Tag>,
) => unknown
