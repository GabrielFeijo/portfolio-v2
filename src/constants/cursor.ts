import type { CursorVariant } from '@/types/store'

export const CURSOR_VARIANTS: Record<
  CursorVariant,
  { width: number; height: number; borderWidth: number; opacity: number }
> = {
  default: { width: 16, height: 16, borderWidth: 1.5, opacity: 0.9 },
  planet: { width: 32, height: 32, borderWidth: 2, opacity: 1 },
  link: { width: 24, height: 24, borderWidth: 1.5, opacity: 0.8 },
  drag: { width: 40, height: 40, borderWidth: 1, opacity: 0.7 },
}

export const CURSOR_COLORS: Record<CursorVariant, string> = {
  default: '#00D4FF',
  planet: '#FFB800',
  link: '#00FF88',
  drag: '#FF1493',
}
