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
  borderRadius?: number
  brightness?: number
  saturation?: number
  hueRange?: number
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
