import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from './panels/panel-primitives'

interface UISurfaceProps {
  children: ReactNode
  className?: string
  strong?: boolean
  style?: CSSProperties
}

export function UISurface({
  children,
  className,
  strong = false,
  style,
}: UISurfaceProps) {
  return (
    <div className={cn(strong ? 'ds-surface-strong' : 'ds-surface', className)} style={style}>
      {children}
    </div>
  )
}

UISurface.displayName = 'UISurface'

interface UIInsetProps {
  children: ReactNode
  className?: string
}

export function UIInset({
  children,
  className,
}: UIInsetProps) {
  return <div className={cn('ds-inset', className)}>{children}</div>
}

UIInset.displayName = 'UIInset'

type UIBadgeTone = 'cool' | 'warm' | 'danger'

interface UIBadgeProps {
  children: ReactNode
  className?: string
  tone?: UIBadgeTone
}

export function UIBadge({
  children,
  className,
  tone = 'cool',
}: UIBadgeProps) {
  const toneClassName = tone === 'warm' ? 'ds-badge-warm' : tone === 'danger' ? 'ds-badge-danger' : 'ds-badge'

  return <div className={cn(toneClassName, className)}>{children}</div>
}

UIBadge.displayName = 'UIBadge'

type UIIconTileTone = 'cool' | 'warm'

interface UIIconTileProps {
  icon: LucideIcon
  className?: string
  tone?: UIIconTileTone
}

export function UIIconTile({
  icon: Icon,
  className,
  tone = 'cool',
}: UIIconTileProps) {
  return (
    <div className={cn(tone === 'warm' ? 'ds-icon-tile-warm' : 'ds-icon-tile', className)}>
      <Icon size={18} />
    </div>
  )
}

UIIconTile.displayName = 'UIIconTile'

interface UIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}

export function UIButton({
  children,
  className,
  onClick,
  type = 'button',
  variant = 'secondary',
  ...props
}: UIButtonProps) {
  return (
    <button
      className={cn(variant === 'primary' ? 'ds-button-primary' : 'ds-button-secondary', className)}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

UIButton.displayName = 'UIButton'
