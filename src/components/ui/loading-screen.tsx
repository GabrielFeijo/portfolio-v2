import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const phases = [
  'INITIALIZING WARP DRIVE...',
  'CALIBRATING STAR CHARTS...',
  'LOADING PLANETARY DATA...',
  'SYNCHRONIZING ORBIT PATHS...',
  'ESTABLISHING COMM LINK...',
  'LAUNCH SEQUENCE READY',
]

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

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
    setPhase(Math.min(phases.length - 1, Math.floor((progress / 100) * phases.length)))
  }, [progress])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center font-display
                 bg-[radial-gradient(ellipse_at_center,#020215_0%,#000008_100%)]"
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-[rgba(0,212,255,0.4)]" />
      <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-[rgba(0,212,255,0.4)]" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-[rgba(0,212,255,0.4)]" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-[rgba(0,212,255,0.4)]" />

      <div className="relative w-48 h-48 mb-12">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 3 + i * 1.6, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full border"
            style={{
              inset: `${i * 18}px`,
              borderColor: `rgba(0,212,255,${0.5 - i * 0.12})`,
              boxShadow: `0 0 ${14 + i * 6}px rgba(0,212,255,0.2)`,
            }}
          />
        ))}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00D4FF]"
            style={{ boxShadow: '0 0 8px #00D4FF' }}
          />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="text-[60px]"
            style={{ filter: 'drop-shadow(0 0 22px #00D4FF)' }}
          >🚀</motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[clamp(22px,4vw,30px)] font-bold tracking-[0.3em] text-[#F0F4FF] mb-2 uppercase"
        style={{ textShadow: '0 0 30px rgba(0,212,255,0.5)' }}
      >
        Gabriel Feijó
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ delay: 0.5 }}
        className="font-mono-space text-[11px] tracking-[0.4em] text-[#00D4FF] mb-12"
      >
        SPACE PORTFOLIO v2.0
      </motion.div>

      <motion.div
        key={phase}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-mono-space text-[11px] tracking-[0.22em] text-[#00FF88] mb-5 h-4"
      >
        {phases[phase]}
      </motion.div>

      <div className="w-80 h-0.5 bg-[rgba(0,212,255,0.15)] rounded overflow-hidden relative">
        <motion.div
          className="absolute left-0 top-0 bottom-0 rounded bg-gradient-to-r from-[#00D4FF] to-[#6B21E8]"
          style={{ width: `${progress}%`, boxShadow: '0 0 12px #00D4FF' }}
        />
      </div>

      <div className="font-mono-space text-[11px] text-[rgba(240,244,255,0.4)] tracking-[0.2em] mt-3">
        {Math.floor(progress).toString().padStart(3, '0')}%
      </div>
    </motion.div>
  )
}
