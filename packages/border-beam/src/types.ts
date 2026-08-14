export type BorderBeamSize =
  'sm' | 'md' | 'line' | 'pulse-outside' | 'pulse-inner'

export type BorderBeamTheme = 'dark' | 'light' | 'auto'

export type BorderBeamColorVariant = 'colorful' | 'mono' | 'ocean' | 'sunset'

export interface SizeConfig {
  borderRadius: number
  borderWidth: number
  width?: number
  height?: number
}

export interface ThemeColors {
  strokeOpacity: number
  innerOpacity: number
  bloomOpacity: number
  innerShadow: string
  saturation: number
  brightness?: number
  hairlineOpacity?: number
}

export interface BorderBeamOptions {
  size?: BorderBeamSize
  colorVariant?: BorderBeamColorVariant
  theme?: BorderBeamTheme
  staticColors?: boolean
  duration?: number
  active?: boolean
  inset?: number
  borderRadius?: number
  brightness?: number
  saturation?: number
  hueRange?: number
  /** Colour the beam paints itself with; defaults to white on dark, black on light. */
  tint?: string
  /** Multiplies every opacity. Above 1 the beam burns brighter, up to 3. */
  strength?: number
  onActivate?: () => void
  onDeactivate?: () => void
}

export interface BorderBeamController {
  readonly element: HTMLElement
  update(options: Partial<BorderBeamOptions>): void
  activate(): void
  deactivate(): void
  destroy(): void
}
