import { motion } from 'framer-motion'
import { useSpaceStore } from '@/store/space-store'
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
    setTimeout(() => openPanel(id as any), 800) // Wait for warp
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-sm"
      style={{ background: 'radial-gradient(ellipse at center, rgba(2,2,21,0.93) 0%, rgba(0,0,8,0.98) 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '46px 46px',
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg,transparent,${planet.glowColor},transparent)`, boxShadow: `0 0 20px ${planet.glowColor}` }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${planet.glowColor}50,transparent)` }}
      />

      <motion.div
        initial={{ scale: 0.9, y: 28 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: -14 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="glass-strong relative flex flex-col overflow-hidden"
        style={{
          width: '92%', maxWidth: 960, maxHeight: '90vh',
          borderColor: `${planet.glowColor}30`,
          borderTopColor: `${planet.glowColor}60`,
          boxShadow: `0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 ${planet.glowColor}40, 0 0 120px ${planet.glowColor}08`,
        }}
      >
        {[
          { top: 0, left: 0, borderWidth: '2px 0 0 2px' },
          { top: 0, right: 0, borderWidth: '2px 2px 0 0' },
          { bottom: 0, left: 0, borderWidth: '0 0 2px 2px' },
          { bottom: 0, right: 0, borderWidth: '0 2px 2px 0' },
        ].map((s, i) => (
          <div key={i} className="absolute w-5 h-5 z-10"
            style={{ borderColor: planet.glowColor, borderStyle: 'solid', ...s }}
          />
        ))}

        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${planet.glowColor}18`,
            background: `linear-gradient(to right, ${planet.glowColor}0c, transparent)`,
          }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 rounded-full"
              style={{ background: planet.color, boxShadow: `0 0 12px ${planet.glowColor}` }}
            />
            <div>
              <div
                className="font-display text-[19px] font-extrabold tracking-[0.2em]"
                style={{ color: planet.glowColor, textShadow: `0 0 20px ${planet.glowColor}50` }}
              >
                {planet.name}
              </div>
              <div className="font-mono-space text-[9px] text-[rgba(240,244,255,0.45)] tracking-[0.28em] mt-0.5">
                {planet.subtitle.toUpperCase()} · {planet.description.toUpperCase()}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={closePanel}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-none
                       bg-[rgba(240,244,255,0.05)] border border-[rgba(240,244,255,0.15)]
                       text-[#F0F4FF] text-base hover:bg-[rgba(240,244,255,0.12)] transition-colors"
          >✕</motion.button>
        </div>

        <div
          className="flex-1 overflow-y-auto p-7"
          style={{ scrollbarWidth: 'thin', scrollbarColor: `${planet.glowColor}50 transparent` }}
        >
          <PanelContent />
        </div>

        <div className="flex justify-between px-6 py-3.5 flex-shrink-0 border-t border-[rgba(0,212,255,0.07)]">
          {prev ? (
            <motion.button
              whileHover={{ x: -4 }}
              onClick={() => handleNav(prev.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className="cursor-none font-mono-space text-[9px] tracking-[0.22em] px-4 py-1.5 rounded
                         bg-transparent transition-colors hover:bg-[rgba(255,255,255,0.04)]"
              style={{ border: `1px solid ${prev.glowColor}35`, color: prev.glowColor }}
            >← {prev.name}</motion.button>
          ) : <div />}

          {next ? (
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => handleNav(next.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className="cursor-none font-mono-space text-[9px] tracking-[0.22em] px-4 py-1.5 rounded
                         bg-transparent transition-colors hover:bg-[rgba(255,255,255,0.04)]"
              style={{ border: `1px solid ${next.glowColor}35`, color: next.glowColor }}
            >{next.name} →</motion.button>
          ) : <div />}
        </div>
      </motion.div>
    </motion.div>
  )
}
