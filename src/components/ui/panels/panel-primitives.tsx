import type { CursorVariant } from '@/types/store'
import { motion, type Variants } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Clock, Hammer, HelpCircle, Radio, Trophy, User, Zap } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

export const panelStagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

export const panelFadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function createCursorHandlers(
  setCursorVariant: (variant: CursorVariant) => void,
  variant: CursorVariant = 'link'
) {
  return {
    onMouseEnter: () => setCursorVariant(variant),
    onMouseLeave: () => setCursorVariant('default'),
  }
}

export function getLucideIcon(name: string) {
  const iconMap: Record<string, LucideIcon> = {
    Clock,
    Hammer,
    Radio,
    Trophy,
    User,
    Zap,
  }

  return iconMap[name] ?? HelpCircle
}

interface PanelHeaderProps {
  icon: LucideIcon
  eyebrow: string
  title: string
  description?: string
}

export function PanelHeader({ icon: Icon, eyebrow, title, description }: PanelHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <PanelIconBadge icon={Icon} />
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">
            {eyebrow}
          </div>
          <h2 className="text-2xl font-semibold text-(--text-primary)">{title}</h2>
        </div>
      </div>

      {description && (
        <p className="mt-4 max-w-2xl text-sm leading-7 text-(--text-secondary)">{description}</p>
      )}
    </>
  )
}

interface PanelIntroCardProps extends PanelHeaderProps {
  children?: ReactNode
  className?: string
  ringClassName?: string
  glowClassName?: string
}

export function PanelIntroCard({
  icon,
  eyebrow,
  title,
  description,
  children,
  className,
  ringClassName,
  glowClassName,
}: PanelIntroCardProps) {
  return (
    <section className={cn('panel-card-strong p-6 sm:p-7', className)}>
      <div className="panel-orbit-grid" />
      <div className="panel-surface-dust" />
      {ringClassName && <div className={cn('panel-orbit-ring', ringClassName)} />}
      {glowClassName && <div className={cn('panel-core-glow', glowClassName)} />}
      <PanelHeader icon={icon} eyebrow={eyebrow} title={title} description={description} />
      {children}
    </section>
  )
}

interface PanelSectionProps extends PanelHeaderProps {
  children: ReactNode
  className?: string
  ringClassName?: string
  glowClassName?: string
}

export function PanelSection({
  icon,
  eyebrow,
  title,
  children,
  className,
  ringClassName,
  glowClassName,
}: PanelSectionProps) {
  return (
    <motion.section variants={panelFadeUp} className={cn('panel-shell p-6 sm:p-7', className)}>
      {ringClassName && <div className={cn('panel-orbit-ring', ringClassName)} />}
      {glowClassName && <div className={cn('panel-core-glow', glowClassName)} />}
      <div className="mb-5">
        <PanelHeader icon={icon} eyebrow={eyebrow} title={title} />
      </div>
      {children}
    </motion.section>
  )
}

export function PanelIconBadge({
  icon: Icon,
  className,
  style,
}: {
  icon: LucideIcon
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-2xl panel-icon-chip',
        className
      )}
      style={style}
    >
      <Icon size={18} />
    </div>
  )
}

export function PanelMetaChip({
  icon: Icon,
  children,
  className,
}: {
  icon?: LucideIcon
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full panel-meta-chip px-3 py-1.5',
        className
      )}
    >
      {Icon && <Icon size={13} />}
      <span>{children}</span>
    </div>
  )
}

export function PanelBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full panel-planet-badge px-3 py-1.5',
        className
      )}
    >
      {children}
    </div>
  )
}
