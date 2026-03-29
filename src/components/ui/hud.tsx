import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSpaceStore } from '@/store/space-store'
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
    if (activePlanet === id) { openPanel(id as any) }
    else { setActivePlanet(id); closePanel() }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
        background: 'linear-gradient(to bottom, rgba(0,0,8,0.85) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(0,212,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <motion.div
            animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: 20, color: '#00D4FF' }}
          >◈</motion.div>
          <div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 14, fontWeight: 700, color: '#F0F4FF', letterSpacing: '0.15em' }}>
              {DEVELOPER.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#00D4FF', letterSpacing: '0.3em', marginTop: 1 }}>
              {DEVELOPER.title.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FF88' }} />
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#00FF88', letterSpacing: '0.2em' }}>
            AVAILABLE FOR WORK
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(240,244,255,0.45)', letterSpacing: '0.15em' }}>
            {time.toLocaleTimeString('en-US', { hour12: false })} UTC
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(0,212,255,0.35)', letterSpacing: '0.1em', marginTop: 2 }}>
            X:{String(coords.x).padStart(4, '0')} Y:{String(coords.y).padStart(4, '0')}
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 7,
        pointerEvents: 'auto',
      }}>
        {PLANETS.map((planet, i) => {
          const isActive = activePlanet === planet.id
          return (
            <motion.button
              key={planet.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.2 }}
              whileHover={{ x: 8, transition: { duration: 0.15 } }}
              onClick={() => handlePlanetNav(planet.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              style={{
                display: 'flex', alignItems: 'center', gap: 11,
                background: isActive ? `rgba(${hr(planet.glowColor)},0.18)` : 'rgba(2,2,21,0.65)',
                border: `1px solid ${isActive ? planet.glowColor : 'rgba(0,212,255,0.13)'}`,
                borderRadius: 8, padding: '9px 15px',
                cursor: 'none', backdropFilter: 'blur(12px)',
                boxShadow: isActive ? `0 0 18px ${planet.glowColor}35` : 'none',
                minWidth: 175,
                transition: 'background 0.25s, border-color 0.25s',
              }}
            >
              <motion.div
                animate={{ scale: isActive ? [1, 1.4, 1] : 1 }}
                transition={{ duration: 1.8, repeat: isActive ? Infinity : 0 }}
                style={{ width: 9, height: 9, borderRadius: '50%', background: planet.color, boxShadow: `0 0 7px ${planet.glowColor}`, flexShrink: 0 }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 9, fontWeight: 700, color: isActive ? planet.glowColor : '#F0F4FF', letterSpacing: '0.22em' }}>
                  {planet.name}
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 7, color: isActive ? 'rgba(240,244,255,0.65)' : 'rgba(240,244,255,0.3)', letterSpacing: '0.1em', marginTop: 2 }}>
                  {planet.subtitle.toUpperCase()}
                </div>
              </div>
              {isActive && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ marginLeft: 'auto', color: planet.glowColor, fontSize: 9 }}>▶</motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
        background: 'linear-gradient(to top, rgba(0,0,8,0.85) 0%, transparent 100%)',
        borderTop: '1px solid rgba(0,212,255,0.07)',
      }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(0,212,255,0.45)', letterSpacing: '0.2em' }}>
          ◈ MOVE MOUSE · CLICK PLANET · CLICK AGAIN TO ENTER
        </div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(240,244,255,0.2)', letterSpacing: '0.15em' }}>
          {DEVELOPER.location.toUpperCase()} · FULL STACK DEVELOPER
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setHelpVisible(v => !v)}
          onMouseEnter={() => setCursorVariant('link')}
          onMouseLeave={() => setCursorVariant('default')}
          style={{
            background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)',
            color: 'rgba(0,212,255,0.6)', fontFamily: 'Space Mono, monospace',
            fontSize: 9, letterSpacing: '0.2em', padding: '5px 12px',
            borderRadius: 4, cursor: 'none', pointerEvents: 'auto',
          }}
        >
          [ ? HELP ]
        </motion.button>
      </div>

      {activePlanet && !helpVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          style={{
            position: 'absolute', bottom: 55, right: 28,
            fontFamily: 'Space Mono, monospace', fontSize: 10,
            color: '#00D4FF', letterSpacing: '0.2em', pointerEvents: 'none',
          }}
        >
          ↑ CLICK AGAIN TO ENTER PLANET
        </motion.div>
      )}

      {helpVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', bottom: 60, right: 20,
            background: 'rgba(2,2,21,0.92)', border: '1px solid rgba(0,212,255,0.25)',
            borderRadius: 10, padding: '18px 22px',
            pointerEvents: 'auto', backdropFilter: 'blur(20px)',
            minWidth: 240,
          }}
        >
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: '#00D4FF', letterSpacing: '0.3em', marginBottom: 14 }}>
            NAVIGATION
          </div>
          {[
            ['HOVER', 'See planet name'],
            ['CLICK ×1', 'Focus camera on planet'],
            ['CLICK ×2', 'Open planet details'],
            ['LEFT NAV', 'Quick-jump to section'],
            ['ESC / ✕', 'Close panel & return'],
            ['← →', 'Navigate between planets'],
          ].map(([key, val]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 8 }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#00D4FF', letterSpacing: '0.15em' }}>{key}</span>
              <span style={{ fontFamily: 'Exo 2, sans-serif', fontSize: 11, color: 'rgba(240,244,255,0.55)' }}>{val}</span>
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
