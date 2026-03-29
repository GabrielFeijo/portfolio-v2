import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const phases = [
    'INITIALIZING WARP DRIVE...',
    'CALIBRATING STAR CHARTS...',
    'LOADING PLANETARY DATA...',
    'SYNCHRONIZING ORBIT PATHS...',
    'ESTABLISHING COMM LINK...',
    'LAUNCH SEQUENCE READY',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 8 + 2
        if (next >= 100) { clearInterval(interval); return 100 }
        return next
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setPhase(Math.floor((progress / 100) * (phases.length - 1)))
  }, [progress])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'radial-gradient(ellipse at center, #020215 0%, #000008 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Orbitron, monospace',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />

      <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 48 }}>
        {[1, 0.8, 0.6].map((scale, i) => (
          <motion.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 3 + i * 1.5, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: `${i * 20}px`,
              borderRadius: '50%',
              border: `1px solid rgba(0,212,255,${0.4 - i * 0.1})`,
              boxShadow: `0 0 ${10 + i * 5}px rgba(0,212,255,0.2)`,
            }}
          />
        ))}

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontSize: 56,
              filter: 'drop-shadow(0 0 20px #00D4FF)',
            }}
          >
            🚀
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: '0.3em',
          color: '#F0F4FF',
          textShadow: '0 0 30px rgba(0,212,255,0.5)',
          marginBottom: 8,
          textTransform: 'uppercase',
        }}
      >
        Gabriel Feijó
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5 }}
        style={{
          fontSize: 12,
          letterSpacing: '0.4em',
          color: '#00D4FF',
          marginBottom: 48,
          fontFamily: 'Space Mono, monospace',
        }}
      >
        SPACE PORTFOLIO v2.0
      </motion.div>

      <motion.div
        key={phase}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          fontSize: 11,
          letterSpacing: '0.25em',
          color: '#00FF88',
          fontFamily: 'Space Mono, monospace',
          marginBottom: 24,
          height: 16,
        }}
      >
        {phases[phase]}
      </motion.div>

      <div style={{
        width: 320,
        height: 2,
        background: 'rgba(0,212,255,0.15)',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <motion.div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            background: 'linear-gradient(90deg, #00D4FF, #6B21E8)',
            borderRadius: 1,
            width: `${progress}%`,
            boxShadow: '0 0 10px #00D4FF',
          }}
        />
      </div>

      <div style={{
        marginTop: 12,
        fontSize: 11,
        fontFamily: 'Space Mono, monospace',
        color: 'rgba(240,244,255,0.4)',
        letterSpacing: '0.2em',
      }}>
        {Math.floor(progress).toString().padStart(3, '0')}%
      </div>

      {[
        { t: 20, l: 20, r: 0 },
        { t: 20, rig: 20, r: 90 },
        { b: 20, rig: 20, r: 180 },
        { b: 20, l: 20, r: 270 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 't' in pos ? pos.t : undefined,
          left: 'l' in pos ? pos.l : undefined,
          right: 'rig' in pos ? pos.rig : undefined,
          bottom: 'b' in pos ? pos.b : undefined,
          width: 30, height: 30,
          transform: `rotate(${pos.r}deg)`,
          borderTop: '1px solid rgba(0,212,255,0.4)',
          borderLeft: '1px solid rgba(0,212,255,0.4)',
        }} />
      ))}
    </motion.div>
  )
}
