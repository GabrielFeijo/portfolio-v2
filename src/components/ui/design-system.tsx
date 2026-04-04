import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from './panels/panel-primitives'

export function UISurface({
  children,
  className,
  strong = false,
  style,
}: {
  children: ReactNode
  className?: string
  strong?: boolean
  style?: CSSProperties
}) {
  return (
    <div className={cn(strong ? 'ds-surface-strong' : 'ds-surface', className)} style={style}>
      {children}
    </div>
  )
}

export function UIInset({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('ds-inset', className)}>{children}</div>
}

export function UIBadge({
  children,
  className,
  tone = 'cool',
}: {
  children: ReactNode
  className?: string
  tone?: 'cool' | 'warm'
}) {
  return <div className={cn(tone === 'warm' ? 'ds-badge-warm' : 'ds-badge', className)}>{children}</div>
}

export function UIIconTile({
  icon: Icon,
  className,
  tone = 'cool',
}: {
  icon: LucideIcon
  className?: string
  tone?: 'cool' | 'warm'
}) {
  return (
    <div className={cn(tone === 'warm' ? 'ds-icon-tile-warm' : 'ds-icon-tile', className)}>
      <Icon size={18} />
    </div>
  )
}

export function UIButton({
  children,
  className,
  variant = 'secondary',
}: {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}) {
  return (
    <div className={cn(variant === 'primary' ? 'ds-button-primary' : 'ds-button-secondary', className)}>
      {children}
    </div>
  )
}
