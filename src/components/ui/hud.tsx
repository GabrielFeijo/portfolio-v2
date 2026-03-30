import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MapPin, Cpu, ExternalLink } from 'lucide-react'
import { useSpaceStore, PanelType } from '@/store/space-store'
import { PLANETS, DEVELOPER } from '@/data/portfolio'

export function HUD() {
  const { activePlanet, setActivePlanet, openPanel, closePanel, setCursorVariant } = useSpaceStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handlePlanetNav = (id: string) => {
    setActivePlanet(id)
    setTimeout(() => openPanel(id as PanelType), 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 pointer-events-none z-100"
    >
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8
                      bg-linear-to-b from-[rgba(10,14,39,0.8)] to-transparent
                      border-b border-[var(--border)] backdrop-blur-sm z-100 pointer-events-auto">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-[var(--accent-blue-bright)] text-lg font-bold"
          >
            ●
          </motion.div>
          <div>
            <div className="font-display text-sm font-semibold text-[var(--text-primary)]">
              {DEVELOPER.name}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              {DEVELOPER.title}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono-space text-xs text-[var(--text-secondary)]">
            {time.toLocaleTimeString('en-US', { hour12: false })} UTC
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">
            {DEVELOPER.location}
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="absolute left-6 top-28 flex flex-col gap-3 pointer-events-auto max-w-xs">
        {PLANETS.map((planet, i) => {
          const isActive = activePlanet === planet.id
          return (
            <motion.button
              key={planet.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ x: 8, transition: { duration: 0.2 } }}
              onClick={() => handlePlanetNav(planet.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className={`flex items-center gap-3 px-4 py-3.5 transition-all duration-200
                         cursor-none border rounded-lg text-left
                         ${isActive ? 'glass-strong' : 'glass hover:bg-[rgba(59,130,246,0.05)]'}`}
              style={{
                borderColor: isActive ? 'var(--accent-blue)' : 'var(--border)',
              }}
            >
              <motion.div
                animate={{ scale: isActive ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  background: planet.color,
                  boxShadow: `0 0 8px ${planet.color}33`
                }}
              />
              <div>
                <div className="font-display text-xs font-bold text-[var(--text-primary)]">
                  {planet.name}
                </div>
                <div className="font-body-exo text-xs text-[var(--text-muted)] mt-0.5">
                  {planet.subtitle}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-between px-8
                      bg-linear-to-t from-[rgba(10,14,39,0.8)] to-transparent
                      border-t border-[var(--border)] backdrop-blur-sm z-100 pointer-events-auto">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
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
                       text-xs font-medium border border-[var(--border)]
                       text-[var(--text-secondary)] hover:text-[var(--text-primary)]
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
