import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, ExternalLink, Orbit } from 'lucide-react'
import { useSpaceStore } from '@/store/space-store'
import { DEVELOPER } from '@/data/portfolio'
import { UIButton, UIBadge, UIIconTile } from './design-system'
import { createCursorHandlers } from './panels/panel-primitives'

export function HUD() {
  const { setCursorVariant } = useSpaceStore()
  const [time, setTime] = useState(new Date())
  const linkCursor = createCursorHandlers(setCursorVariant)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 pointer-events-none z-100"
    >
      <div className="ds-topbar absolute top-3 left-3 right-3 min-h-20 rounded-[26px] flex items-start sm:items-center justify-between px-4 sm:px-6 py-4 z-100 pointer-events-auto">
        <div className="flex items-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <UIIconTile icon={Orbit} className="h-11 w-11" />
          </motion.div>
          <div>
            <div className="font-display text-sm sm:text-base font-semibold tracking-[0.08em] text-(--text-primary)">
              {DEVELOPER.name}
            </div>
            <div className="text-xs text-(--text-muted)">
              {DEVELOPER.title}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono-space text-[11px] sm:text-xs text-(--text-secondary) uppercase tracking-[0.18em]">
            {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[11px] sm:text-xs text-(--text-muted) mt-0.5">
            {DEVELOPER.location}
          </div>
        </div>
      </div>

      <div className="ds-topbar absolute bottom-3 left-3 right-3 min-h-16 rounded-3xl flex items-center justify-between gap-4 px-4 sm:px-6 py-4 z-100 pointer-events-auto">
        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-(--text-muted)">
          <UIBadge className="font-mono-space text-[11px] tracking-[0.18em] uppercase">
            <Cpu size={14} />
            Portfolio orbital
          </UIBadge>
          <UIBadge className="hidden sm:inline-flex font-mono-space text-[11px] tracking-[0.18em] uppercase">
            <Orbit size={14} />
            Clique em um planeta para explorar
          </UIBadge>
        </div>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} {...linkCursor}>
            <a href={DEVELOPER.github} target="_blank" rel="noopener noreferrer"
              className="cursor-none">
              <UIButton>
                <ExternalLink size={12} />
                Código
              </UIButton>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
