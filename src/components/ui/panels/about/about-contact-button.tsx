import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { CursorVariant } from '@/types/store'
import { createCursorHandlers } from '../panel-primitives'

interface AboutContactButtonProps {
  href: string
  icon: LucideIcon
  label: string
  setCursorVariant: (variant: CursorVariant) => void
}

export function AboutContactButton({
  href,
  icon: Icon,
  label,
  setCursorVariant,
}: AboutContactButtonProps) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      whileHover={{ y: -2, scale: 1.02 }}
      {...createCursorHandlers(setCursorVariant)}
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-(--text-primary) panel-card hover:opacity-95 transition-colors cursor-none"
    >
      <Icon size={16} />
      {label}
    </motion.a>
  )
}
