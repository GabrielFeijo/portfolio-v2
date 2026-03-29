import { motion } from 'framer-motion'
import { useSpaceStore, PanelType } from '@/store/space-store'
import { PLANETS } from '@/data/portfolio'
import { AboutPanel } from './panels/about-panel'
import { SkillsPanel } from './panels/skills-panel'
import { ProjectsPanel } from './panels/projects-panel'
import { ExperiencePanel } from './panels/experience-panel'
import { AccomplishmentsPanel } from './panels/accomplishments-panel'
import { ContactPanel } from './panels/contact-panel'
import type { ComponentType } from 'react'

const PANELS: Record<string, ComponentType> = {
  about: AboutPanel,
  skills: SkillsPanel,
  projects: ProjectsPanel,
  experience: ExperiencePanel,
  accomplishments: AccomplishmentsPanel,
  contact: ContactPanel,
}

export function PlanetPanel() {
  const { activePanel, closePanel, openPanel, setActivePlanet, setCursorVariant } = useSpaceStore()
  if (!activePanel) return null

  const planet = PLANETS.find(p => p.id === activePanel)
  const PanelContent = PANELS[activePanel]
  if (!planet || !PanelContent) return null

  const idx = PLANETS.findIndex(p => p.id === activePanel)
  const prev = PLANETS[idx - 1]
  const next = PLANETS[idx + 1]

  const handleNav = (id: string) => {
    setActivePlanet(id)
    closePanel() // Hide current panel immediately
    setTimeout(() => openPanel(id as PanelType), 800) // Wait for warp
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] pointer-events-none flex"
    >
      {/* Invisible backdrop for closing when clicking outside the panel */}
      <div 
        className="absolute inset-0 pointer-events-auto cursor-none" 
        onClick={closePanel} 
        onMouseEnter={() => setCursorVariant('default')}
      />

      {/* Decorative Gradient Line representing the orbit cut */}
      <div className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
        style={{ background: `linear-gradient(90deg,transparent,${planet.glowColor}80,transparent)`, boxShadow: `0 0 20px ${planet.glowColor}` }}
      />
      
      {/* Spacer to push panel to the right */}
      <div className="flex-1" />

      {/* The Dashboard Panel */}
      <motion.div
        initial={{ x: '100%', opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 32, mass: 0.8 }}
        className="relative w-full sm:w-[520px] h-full flex flex-col pointer-events-auto overflow-hidden"
        style={{
          background: `linear-gradient(280deg, rgba(2,2,10,0.85) 0%, rgba(5,5,15,0.65) 100%)`,
          backdropFilter: 'blur(48px) saturate(160%)',
          WebkitBackdropFilter: 'blur(48px) saturate(160%)',
          borderLeft: `1px solid ${planet.glowColor}40`,
          boxShadow: `-40px 0 100px rgba(0,0,0,0.7), inset 1px 0 0 ${planet.glowColor}60, -80px 0 200px ${planet.glowColor}15`,
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Subtle grid texture inside the panel */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${planet.glowColor} 1px, transparent 1px),
                              linear-gradient(90deg, ${planet.glowColor} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* High-End Header */}
        <div
          className="flex flex-col px-10 py-10 flex-shrink-0 relative"
          style={{
            background: `radial-gradient(120% 100% at top left, ${planet.glowColor}25, transparent)`,
            borderBottom: `1px solid ${planet.glowColor}15`,
          }}
        >
          {/* Close button top right */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={closePanel}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center cursor-none
                       bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]
                       text-[#F0F4FF] hover:bg-[rgba(255,255,255,0.15)] transition-colors z-10"
          >✕</motion.button>

          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: planet.color, boxShadow: `0 0 16px ${planet.glowColor}` }}
            />
            <div className="font-mono-space text-[10px] text-[rgba(240,244,255,0.6)] tracking-[0.3em]">
              {planet.subtitle.toUpperCase()}
            </div>
          </div>
          
          <div
            className="font-display text-[38px] font-black tracking-widest uppercase leading-none"
            style={{ color: planet.color, textShadow: `0 0 40px ${planet.glowColor}60` }}
          >
            {planet.name}
          </div>
          <div className="font-body-exo text-[13px] text-[rgba(240,244,255,0.4)] mt-3 max-w-[85%] font-light">
            {planet.description}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div
          className="flex-1 overflow-y-auto px-10 py-8 relative z-10"
          style={{ scrollbarWidth: 'none' }} // ultra clean no scrollbar visually
        >
          <PanelContent />
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between px-10 py-6 flex-shrink-0 relative z-10"
             style={{ 
               background: `linear-gradient(to top, rgba(0,0,5,0.8), transparent)`,
               borderTop: `1px solid ${planet.glowColor}15` 
             }}>
          {prev ? (
            <motion.button
              whileHover={{ x: -6 }}
              onClick={() => handleNav(prev.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className="cursor-none font-display font-bold text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-full
                         transition-colors hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-2"
              style={{ border: `1px solid ${prev.glowColor}30`, color: prev.glowColor }}
            >← <span className="opacity-70">{prev.name}</span></motion.button>
          ) : <div />}

          {next ? (
            <motion.button
              whileHover={{ x: 6 }}
              onClick={() => handleNav(next.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className="cursor-none font-display font-bold text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-full
                         transition-colors hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-2"
              style={{ border: `1px solid ${next.glowColor}30`, color: next.glowColor }}
            ><span className="opacity-70">{next.name}</span> →</motion.button>
          ) : <div />}
        </div>
      </motion.div>
    </motion.div>
  )
}
