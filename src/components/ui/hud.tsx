import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, ExternalLink, Orbit } from 'lucide-react'
import { useSpaceStore } from '@/store/space-store'
import { DEVELOPER } from '@/data/portfolio'

export function HUD() {
  const { setCursorVariant } = useSpaceStore()
  const [time, setTime] = useState(new Date())

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
      <div className="absolute top-0 left-0 right-0 min-h-20 flex items-start sm:items-center justify-between px-4 sm:px-8 py-4
                      bg-linear-to-b from-[rgba(6,8,20,0.82)] to-transparent
                      border-b border-(--border) backdrop-blur-sm z-100 pointer-events-auto">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-(--accent-blue-bright) text-lg font-bold shrink-0"
          >
            ●
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
          <div className="font-mono-space text-[11px] sm:text-xs text-(--text-secondary)">
            {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[11px] sm:text-xs text-(--text-muted) mt-0.5">
            {DEVELOPER.location}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 min-h-16 flex items-center justify-between gap-4 px-4 sm:px-8 py-4
                      bg-linear-to-t from-[rgba(6,8,20,0.82)] to-transparent
                      border-t border-(--border) backdrop-blur-sm z-100 pointer-events-auto">
        <div className="flex items-center gap-3 text-[11px] sm:text-xs text-(--text-muted)">
          <span className="inline-flex items-center gap-2">
            <Cpu size={14} />
            Portfolio orbital
          </span>
          <span className="hidden sm:inline-flex items-center gap-2">
            <Orbit size={14} />
            Clique em um planeta para explorar
          </span>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <a href={DEVELOPER.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md
                       text-xs font-medium border border-(--border)
                       text-(--text-secondary) hover:text-(--text-primary)
                       transition-colors cursor-none">
              <ExternalLink size={12} />
              Código
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
