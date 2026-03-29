import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSpaceStore } from '@/store/space-store'
import { DEVELOPER } from '@/data/portfolio'

export function IntroSequence() {
  const { setShowIntro } = useSpaceStore()
  const [step, setStep] = useState(0)
  const [glitch, setGlitch] = useState(false)

  const lines = [
    { text: `> NEURAL LINK ESTABLISHED — ${DEVELOPER.name.toUpperCase()}`, delay: 0 },
    { text: '> BIOGRAPHY RECORD: ACCESSED ✓', delay: 700 },
    { text: `> LOCATION: ${DEVELOPER.location.toUpperCase()}`, delay: 1300 },
    { text: `> SPECIALIZATION: ${DEVELOPER.title.toUpperCase()}`, delay: 1900 },
    { text: '> SCANNING PLANETARY SYSTEM...', delay: 2500 },
    { text: '> 6 WORLDS DISCOVERED. CLICK TO EXPLORE.', delay: 3100 },
  ]

  useEffect(() => {
    const timers = lines.map((line, i) =>
      setTimeout(() => setStep(i + 1), line.delay + 400)
    )
    const exit = setTimeout(() => setShowIntro(false), 5000)
    const glitchInterval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 120)
    }, 2800)

    return () => { timers.forEach(clearTimeout); clearTimeout(exit); clearInterval(glitchInterval) }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center font-mono-space
                 bg-[radial-gradient(ellipse_at_center,rgba(2,2,21,0.97)_0%,rgba(0,0,8,0.99)_100%)]"
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.018) 3px, rgba(0,212,255,0.018) 4px)',
        }}
      />

      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-[90%] max-w-[680px]">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`font-display text-[clamp(22px,4vw,40px)] font-black text-[#00D4FF]
                      tracking-[0.2em] text-center mb-10 ${glitch ? 'animate-[glitch_0.1s_ease]' : ''}`}
          style={{ textShadow: '0 0 30px #00D4FF, 0 0 60px rgba(0,212,255,0.3)' }}
        >
          ◈ SPACE PORTFOLIO ◈
        </motion.div>

        <div className="relative rounded-lg border border-[rgba(0,212,255,0.3)]
                        bg-[rgba(0,0,8,0.85)] p-7 min-h-[240px]"
          style={{ boxShadow: '0 0 60px rgba(0,212,255,0.08), inset 0 0 60px rgba(0,212,255,0.02)' }}
        >
          {['tl', 'tr', 'bl', 'br'].map(c => (
            <div key={c} className={`hud-corner hud-corner-${c}`} />
          ))}

          <div className="flex gap-2 mb-5">
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
            <span className="ml-2 text-[11px] text-[rgba(240,244,255,0.3)] tracking-[0.2em]">
              SYSTEM://PORTFOLIO.EXE
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {lines.slice(0, step).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono-space text-[clamp(10px,1.5vw,13px)] leading-relaxed"
                style={{ color: i === step - 1 ? '#00FF88' : 'rgba(240,244,255,0.7)' }}
              >
                {line.text}
              </motion.div>
            ))}

            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="text-[#00D4FF] text-sm"
            >█</motion.span>
          </div>
        </div>

        <div className="mt-4 h-0.5 bg-[rgba(0,212,255,0.1)] rounded overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${(step / lines.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#6B21E8] rounded"
            style={{ boxShadow: '0 0 8px #00D4FF' }}
          />
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.02 }}
          onClick={() => setShowIntro(false)}
          className="block mx-auto mt-6 cursor-none font-mono-space text-[11px] tracking-[0.3em]
                     bg-transparent border border-[rgba(0,212,255,0.3)] text-[#00D4FF]
                     px-7 py-2.5 rounded transition-colors hover:bg-[rgba(0,212,255,0.08)]"
        >
          [ SKIP INTRO ]
        </motion.button>
      </div>
    </motion.div>
  )
}
