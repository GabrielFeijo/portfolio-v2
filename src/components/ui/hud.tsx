import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSpaceStore, PanelType } from '@/store/space-store'
import { PLANETS, DEVELOPER } from '@/data/portfolio'

export function HUD() {
  const { activePlanet, setActivePlanet, openPanel, closePanel, setCursorVariant } = useSpaceStore()
  const [time, setTime] = useState(new Date())
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [helpVisible, setHelpVisible] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    const onMove = (e: MouseEvent) => setCoords({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => { clearInterval(t); window.removeEventListener('mousemove', onMove) }
  }, [])

  const handlePlanetNav = (id: string) => {
    setActivePlanet(id)
    setTimeout(() => openPanel(id as PanelType), 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 pointer-events-none z-[100]"
    >
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-8
                      bg-gradient-to-b from-[rgba(5,5,20,0.9)] to-transparent
                      border-b border-[rgba(255,255,255,0.05)] backdrop-blur-sm z-[100]">
        <div className="flex items-center gap-3.5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-[#00D4FF] text-xl"
          >◈</motion.div>
          <div>
            <div className="font-display text-[13px] font-bold text-[#F0F4FF] tracking-[0.15em]">
              {DEVELOPER.name.toUpperCase()}
            </div>
            <div className="font-mono-space text-[9px] text-[#00D4FF] tracking-[0.3em] mt-0.5">
              {DEVELOPER.title.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#00FF88]"
          />
          <span className="font-mono-space text-[10px] text-[#00FF88] tracking-[0.2em]">
            AVAILABLE FOR WORK
          </span>
        </div>

        <div className="text-right">
          <div className="font-mono-space text-[11px] text-[rgba(240,244,255,0.45)] tracking-[0.15em]">
            {time.toLocaleTimeString('en-US', { hour12: false })} UTC
          </div>
          <div className="font-mono-space text-[9px] text-[rgba(0,212,255,0.35)] tracking-[0.1em] mt-0.5">
            X:{String(coords.x).padStart(4, '0')} Y:{String(coords.y).padStart(4, '0')}
          </div>
        </div>
      </div>

      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-auto">
        {PLANETS.map((planet, i) => {
          const isActive = activePlanet === planet.id
          return (
            <motion.button
              key={planet.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ x: 12, scale: 1.02, transition: { duration: 0.2 } }}
              onClick={() => handlePlanetNav(planet.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className={`flex items-center gap-4 px-5 py-3.5 min-w-[220px] transition-all duration-300
                         cursor-none border text-left rounded-2xl
                         ${isActive ? 'glass-strong' : 'glass hover:bg-[rgba(20,20,40,0.4)]'}`}
              style={{
                borderColor: isActive ? planet.glowColor : 'rgba(255,255,255,0.1)',
                boxShadow: isActive ? `0 0 30px ${planet.glowColor}25, inset 0 1px 0 rgba(255,255,255,0.2)` : '',
              }}
            >
              <motion.div
                animate={{ scale: isActive ? [1, 1.4, 1] : 1 }}
                transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: planet.color, boxShadow: `0 0 12px ${planet.glowColor}` }}
              />
              <div>
                <div
                  className="font-display text-[10px] font-bold tracking-[0.25em]"
                  style={{ color: isActive ? planet.glowColor : '#F0F4FF' }}
                >
                  {planet.name}
                </div>
                <div
                  className="font-mono-space text-[8px] tracking-[0.15em] mt-1"
                  style={{ color: isActive ? 'rgba(240,244,255,0.8)' : 'rgba(240,244,255,0.4)' }}
                >
                  {planet.subtitle.toUpperCase()}
                </div>
              </div>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-auto text-[9px]"
                  style={{ color: planet.glowColor }}
                >▶</motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-11 flex items-center justify-between px-7
                      bg-gradient-to-t from-[rgba(0,0,8,0.88)] to-transparent
                      border-t border-[rgba(0,212,255,0.07)]">
        <div className="font-mono-space text-[9px] text-[rgba(0,212,255,0.45)] tracking-[0.2em]">
          ◈ DRAG MOUSE TO LOOK · CLICK PLANET TO ENTER
        </div>
        <div className="font-mono-space text-[9px] text-[rgba(240,244,255,0.2)] tracking-[0.15em]">
          {DEVELOPER.location.toUpperCase()} · FULL STACK DEVELOPER
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setHelpVisible(v => !v)}
          onMouseEnter={() => setCursorVariant('link')}
          onMouseLeave={() => setCursorVariant('default')}
          className="pointer-events-auto cursor-none font-mono-space text-[9px] tracking-[0.2em]
                     bg-[rgba(0,212,255,0.07)] border border-[rgba(0,212,255,0.2)]
                     text-[rgba(0,212,255,0.6)] rounded px-3 py-1.5 hover:bg-[rgba(0,212,255,0.14)] transition-colors"
        >
          [ ? HELP ]
        </motion.button>
      </div>



      {helpVisible && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="glass-strong absolute bottom-14 right-5 pointer-events-auto p-6 min-w-[280px]"
        >
          <div className="font-display text-[10px] text-[#00D4FF] tracking-[0.3em] mb-4">
            NAVIGATION
          </div>
          {[
            ['HOVER',    'See planet name'],
            ['CLICK',    'Enter planet details'],
            ['LEFT NAV', 'Quick-jump to section'],
            ['ESC / ✕',  'Close panel & return'],
            ['← →',      'Navigate between planets'],
          ].map(([key, val]) => (
            <div key={key} className="flex justify-between gap-6 mb-2.5 last:mb-0">
              <span className="font-mono-space text-[9px] text-[#00D4FF] tracking-[0.15em]">{key}</span>
              <span className="font-body-exo text-[11px] text-[rgba(240,244,255,0.55)]">{val}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

function hr(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${n >> 16},${(n >> 8) & 0xff},${n & 0xff}`
}
