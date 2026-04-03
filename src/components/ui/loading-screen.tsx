import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const phases = [
  'SINCRONIZANDO NAVEGAÇÃO ESTELAR...',
  'CARREGANDO ARQUIVOS DE PORTFÓLIO...',
  'CALIBRANDO SINAIS DO UNIVERSO...',
  'ESTABILIZANDO ORBITAS E PAINÉIS...',
  'MAPEANDO SEÇÕES INTERATIVAS...',
  'SISTEMA ONLINE',
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
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center font-display
                 bg-[#000005]"
    >
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="absolute top-10 left-10 w-12 h-px bg-[rgba(0,212,255,0.3)]" />
      <div className="absolute top-10 left-10 w-px h-12 bg-[rgba(0,212,255,0.3)]" />
      <div className="absolute bottom-10 right-10 w-12 h-px bg-[rgba(0,212,255,0.3)]" />
      <div className="absolute bottom-10 right-10 w-px h-12 bg-[rgba(0,212,255,0.3)]" />

      <div className="relative w-64 h-64 mb-16 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-[rgba(0,212,255,0.1)]"
          style={{ borderStyle: 'dashed' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-8 rounded-full border border-[rgba(0,212,255,0.05)]"
        />
        
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[10px] font-mono-space tracking-[0.8em] text-[#00D4FF] mb-2 translate-x-1"
          >
            CARREGANDO
          </motion.div>
          <div className="font-display text-4xl font-black text-white tracking-widest flex items-center gap-2">
            <span className="opacity-20">0</span>
            <span className="text-[#00D4FF] drop-shadow-[0_0_12px_rgba(0,212,255,0.5)]">
              {Math.floor(progress).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center max-w-xs w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <div className="font-display text-[18px] font-black tracking-[0.4em] text-white uppercase mb-1">
            Gabriel Feijó
          </div>
          <div className="font-mono-space text-[9px] tracking-[0.3em] text-[rgba(240,244,255,0.3)] uppercase">
            Full Stack Universe
          </div>
        </motion.div>

        <div className="w-full h-px bg-[rgba(255,255,255,0.05)] relative mb-4">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-[#00D4FF]"
            style={{ 
              width: `${progress}%`, 
              boxShadow: '0 0 10px rgba(0,212,255,0.8), 0 0 20px rgba(0,212,255,0.3)' 
            }}
          />
        </div>

        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono-space text-[9px] tracking-[0.3em] text-[#00FF88] opacity-60 uppercase"
        >
          {phases[phase]}
        </motion.div>
      </div>
    </motion.div>
  )
}
