import { ChevronRight } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from './panel-primitives'

export function PanelTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('rounded-full panel-meta-chip px-3 py-1.5 text-xs', className)}>
      {children}
    </span>
  )
}

export function PanelTagList({
  items,
  className,
  limit,
}: {
  items: string[]
  className?: string
  limit?: number
}) {
  const visibleItems = typeof limit === 'number' ? items.slice(0, limit) : items
  const hiddenCount = typeof limit === 'number' ? Math.max(items.length - limit, 0) : 0

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {visibleItems.map((item) => (
        <PanelTag key={item}>{item}</PanelTag>
      ))}
      {hiddenCount > 0 && (
        <span className="px-2 py-1.5 text-xs text-(--text-muted)">+{hiddenCount}</span>
      )}
    </div>
  )
}

export function PanelBulletList({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item) => (
        <div key={item} className="flex gap-2.5">
          <ChevronRight size={14} className="mt-1 shrink-0 panel-highlight-text" />
          <span className="text-xs leading-6 text-(--text-secondary)">{item}</span>
        </div>
      ))}
    </div>
  )
}

export function PanelInsetCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('panel-card rounded-[20px] p-4', className)}>{children}</div>
}

export function PanelTopGlow({ color, className }: { color: string; className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-x-0 top-0 opacity-60', className)}
      style={{ background: `linear-gradient(180deg, ${color}22, transparent)` }}
    />
  )
}

export function PanelImageFrame({
  src,
  alt,
  className,
  style,
}: {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn('overflow-hidden rounded-[18px] flex items-center justify-center', className)}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto max-h-[320px] object-contain transition-transform duration-500 hover:scale-[1.03]"
      />
    </div>
  )
}

export function PanelNotice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[18px] panel-planet-badge px-4 py-3 text-sm text-(--text-primary)',
        className
      )}
    >
      {children}
    </div>
  )
}
