import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { createCursorHandlers } from '../panel-primitives'
import type { CursorVariant } from '@/types/store'

interface ProjectLinkProps {
  href: string
  icon: LucideIcon
  label: string
  primary?: boolean
  setCursorVariant: (variant: CursorVariant) => void
}

export function ProjectLink({
  href,
  icon: Icon,
  label,
  primary = false,
  setCursorVariant,
}: ProjectLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      {...createCursorHandlers(setCursorVariant)}
      className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-3.5 py-3 text-xs font-medium transition-colors cursor-none ${
        primary ? 'panel-cta' : 'panel-cta-secondary hover:bg-[rgba(255,255,255,0.04)]'
      }`}
    >
      <Icon size={14} />
      {label}
    </motion.a>
  )
}
