import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSpaceStore } from '@/store/space-store'
import { DEVELOPER } from '@/data/portfolio'

export function IntroSequence() {
  const { setShowIntro } = useSpaceStore()
  const [step, setStep] = useState(0)

  const lines = [
    { text: `> ESTABLISHING NEURAL LINK TO ${DEVELOPER.name.toUpperCase()}...`, delay: 0 },
    { text: '> BIOGRAPHY RECORD: ACCESSED ✓', delay: 800 },
    { text: `> LOCATION: ${DEVELOPER.location.toUpperCase()}`, delay: 1400 },
    { text: `> SPECIALIZATION: ${DEVELOPER.title.toUpperCase()}`, delay: 2000 },
    { text: '> LOADING PLANETARY SYSTEM...', delay: 2600 },
    { text: '> 6 WORLDS DISCOVERED. EXPLORE TO LEARN MORE.', delay: 3200 },
  ]

  useEffect(() => {
    const timers = lines.map((line, i) =>
      setTimeout(() => setStep(i + 1), line.delay + 500)
    )
    const exit = setTimeout(() => setShowIntro(false), 5200)
    return () => { timers.forEach(clearTimeout); clearTimeout(exit) }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(2,2,21,0.97) 0%, rgba(0,0,8,0.99) 100%)',
        fontFamily: 'Space Mono, monospace',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.02) 3px, rgba(0,212,255,0.02) 4px)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '90%', maxWidth: 640 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: 'clamp(20px, 4vw, 36px)',
            fontWeight: 900,
            color: '#00D4FF',
            letterSpacing: '0.2em',
            textAlign: 'center',
            marginBottom: 40,
            textShadow: '0 0 30px #00D4FF, 0 0 60px #00D4FF40',
          }}
        >
          ◈ SPACE PORTFOLIO ◈
        </motion.div>

        <div style={{
          background: 'rgba(0,0,8,0.8)',
          border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: 8,
          padding: '28px 32px',
          position: 'relative',
          minHeight: 220,
        }}>
          {['tl', 'tr', 'bl', 'br'].map(c => (
            <div key={c} className={`hud-corner hud-corner-${c}`} />
          ))}

          <div style={{
            display: 'flex', gap: 8, marginBottom: 20,
          }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: 11, color: 'rgba(240,244,255,0.3)', letterSpacing: '0.2em' }}>
              SYSTEM://PORTFOLIO.EXE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lines.slice(0, step).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  fontSize: 'clamp(10px, 1.5vw, 13px)',
                  color: i === step - 1 ? '#00FF88' : 'rgba(240,244,255,0.65)',
                  lineHeight: 1.6,
                  fontFamily: 'Space Mono, monospace',
                }}
              >
                {line.text}
              </motion.div>
            ))}

            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ color: '#00D4FF', fontSize: 14 }}
            >
              █
            </motion.span>
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          whileHover={{ opacity: 1 }}
          onClick={() => setShowIntro(false)}
          style={{
            display: 'block', margin: '24px auto 0',
            background: 'transparent',
            border: '1px solid rgba(0,212,255,0.3)',
            color: '#00D4FF',
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.3em',
            padding: '10px 28px',
            borderRadius: 4,
            cursor: 'none',
          }}
        >
          [ SKIP INTRO ]
        </motion.button>
      </div>
    </motion.div>
  )
}
