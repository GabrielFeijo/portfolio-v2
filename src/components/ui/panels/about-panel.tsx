import { motion } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { User, Code2, Briefcase, Mail, Globe, BrainCircuit } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
}
const item = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }

export function AboutPanel() {
  const { setCursorVariant } = useSpaceStore()

  const stats = [
    { label: 'YEARS EXP', value: '4+', color: '#00D4FF' },
    { label: 'PROJECTS', value: '80+', color: '#00FF88' },
    { label: 'COMMITS', value: '7K+', color: '#FF1493' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-8">

      <motion.div variants={item} className="flex gap-8 items-center flex-wrap">
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-10px] rounded-full border border-dashed border-[rgba(0,212,255,0.4)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-20px] rounded-full border border-[rgba(0,212,255,0.15)]"
          />
          <div className="w-28 h-28 rounded-full flex items-center justify-center
                          bg-gradient-to-br from-[#1E40AF] to-[#6B21E8]
                          border-2 border-[rgba(0,212,255,0.35)]"
            style={{ boxShadow: '0 0 32px rgba(0,212,255,0.3)' }}
          >
            <User size={48} className="text-[#00D4FF] drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <motion.h1
            variants={item}
            className="font-display text-[clamp(22px,3vw,32px)] font-black tracking-[0.1em] mb-2
                       bg-gradient-to-r from-[#00D4FF] to-[#6B21E8] bg-clip-text text-transparent"
          >
            {DEVELOPER.name}
          </motion.h1>
          <div className="font-mono-space text-[11px] text-[#00D4FF] tracking-[0.28em] mb-4">
            {DEVELOPER.title.toUpperCase()} · {DEVELOPER.location.toUpperCase()}
          </div>
          <p className="font-body-exo text-[13px] leading-relaxed text-[rgba(240,244,255,0.7)] max-w-[480px]">
            {DEVELOPER.bio}
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {stats.map(stat => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05, y: -4 }}
            className="relative overflow-hidden rounded-xl text-center py-5 px-4"
            style={{
              background: `rgba(${hexRgb(stat.color)}, 0.08)`,
              border: `1px solid ${stat.color}28`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
            />
            <div className="font-display text-[32px] font-black"
              style={{ color: stat.color, textShadow: `0 0 22px ${stat.color}55` }}>
              {stat.value}
            </div>
            <div className="font-mono-space text-[8px] tracking-[0.28em] text-[rgba(240,244,255,0.4)] mt-1.5">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={item}
        className="glass p-6"
      >
        <div className="font-display text-[11px] text-[#00D4FF] tracking-[0.3em] mb-4 flex items-center gap-2">
          <BrainCircuit size={16} /> MISSION BRIEF
        </div>
        <p className="font-body-exo text-[13px] leading-[2] text-[rgba(240,244,255,0.7)] mb-3">
          I'm a passionate{' '}
          <span className="text-[#00FF88]">Full Stack Developer</span> from{' '}
          <span className="text-[#00D4FF]">Recife, Brazil</span>, dedicated to building
          scalable, performant web applications. My journey spans from crafting pixel-perfect
          frontends to architecting robust backend systems.
        </p>
        <p className="font-body-exo text-[13px] leading-[2] text-[rgba(240,244,255,0.7)]">
          I believe in <span className="text-[#FFB800]">clean code</span>,{' '}
          <span className="text-[#FF1493]">thoughtful UX</span>, and{' '}
          <span className="text-[#00FF88]">continuous learning</span>. When I'm not coding,
          I contribute to open source and explore what's possible tomorrow.
        </p>
      </motion.div>

      <motion.div variants={item}
        className="text-center font-display text-[12px] text-[rgba(0,212,255,0.5)] tracking-[0.2em] italic px-5">
        "{DEVELOPER.tagline}"
      </motion.div>

      <motion.div variants={item} className="flex gap-4 flex-wrap justify-center mt-2">
        {[
          { label: 'GITHUB',   href: DEVELOPER.github,              color: '#F0F4FF', icon: Code2 },
          { label: 'LINKEDIN', href: DEVELOPER.linkedin,             color: '#0A66C2', icon: Briefcase },
          { label: 'EMAIL',    href: `mailto:${DEVELOPER.email}`,    color: '#00FF88', icon: Mail },
          { label: 'WEBSITE',  href: DEVELOPER.website,              color: '#00D4FF', icon: Globe },
        ].map(link => {
          const Icon = link.icon;
          return (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            className="flex items-center gap-2 font-mono-space text-[10px] tracking-[0.25em] px-5 py-2.5 rounded
                       glass cursor-none no-underline transition-all"
            style={{
              border: `1px solid ${link.color}38`,
              color: link.color,
              boxShadow: `0 0 14px ${link.color}18`,
            }}
          >
            <Icon size={14} />
            {link.label}
          </motion.a>
        )})}
      </motion.div>
    </motion.div>
  )
}

function hexRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
