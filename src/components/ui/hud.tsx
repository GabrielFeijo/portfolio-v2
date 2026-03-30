import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, ExternalLink } from 'lucide-react'
import { useSpaceStore, PanelType } from '@/store/space-store'
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
      <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8
                      bg-linear-to-b from-[rgba(10,14,39,0.8)] to-transparent
                      border-b border-(--border) backdrop-blur-sm z-100 pointer-events-auto">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-(--accent-blue-bright) text-lg font-bold"
          >
            ●
          </motion.div>
          <div>
            <div className="font-display text-sm font-semibold text-(--text-primary)">
              {DEVELOPER.name}
            </div>
            <div className="text-xs text-(--text-muted)">
              {DEVELOPER.title}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono-space text-xs text-(--text-secondary)">
            {time.toLocaleTimeString('en-US', { hour12: false })} UTC
          </div>
          <div className="text-xs text-(--text-muted) mt-0.5">
            {DEVELOPER.location}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-between px-8
                      bg-linear-to-t from-[rgba(10,14,39,0.8)] to-transparent
                      border-t border-(--border) backdrop-blur-sm z-100 pointer-events-auto">
        <div className="flex items-center gap-2 text-xs text-(--text-muted)">
          <Cpu size={14} />
          Portfolio v2.0
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
              Source
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
