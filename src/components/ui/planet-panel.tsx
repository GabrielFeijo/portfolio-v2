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
  const { activePanel, closePanel, openPanel, setCursorVariant } = useSpaceStore()
  if (!activePanel) return null

  const planet = PLANETS.find(p => p.id === activePanel)
  const PanelContent = PANELS[activePanel]
  if (!planet || !PanelContent) return null

  const idx = PLANETS.findIndex(p => p.id === activePanel)
  const prev = PLANETS[idx - 1]
  const next = PLANETS[idx + 1]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(2,2,21,0.93) 0%, rgba(0,0,8,0.98) 100%)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.018) 1px,transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg,transparent,${planet.glowColor},transparent)`,
        boxShadow: `0 0 18px ${planet.glowColor}`,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg,transparent,${planet.glowColor}50,transparent)`,
      }} />

      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        style={{
          width: '91%', maxWidth: 920, maxHeight: '90vh',
          background: 'rgba(2,2,21,0.97)',
          border: `1px solid ${planet.glowColor}35`,
          borderRadius: 16, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: `0 0 70px ${planet.glowColor}18, 0 0 140px ${planet.glowColor}08`,
          position: 'relative',
        }}
      >
        {[
          { top: 0, left: 0, borderWidth: '2px 0 0 2px' },
          { top: 0, right: 0, borderWidth: '2px 2px 0 0' },
          { bottom: 0, left: 0, borderWidth: '0 0 2px 2px' },
          { bottom: 0, right: 0, borderWidth: '0 2px 2px 0' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: 20, height: 20,
            borderColor: planet.glowColor, borderStyle: 'solid',
            zIndex: 10, ...s,
          }} />
        ))}

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 26px',
          borderBottom: `1px solid ${planet.glowColor}18`,
          background: `linear-gradient(to right,${planet.glowColor}0d,transparent)`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 11, height: 11, borderRadius: '50%', background: planet.color, boxShadow: `0 0 10px ${planet.glowColor}` }}
            />
            <div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 19, fontWeight: 800, color: planet.glowColor, letterSpacing: '0.2em', textShadow: `0 0 18px ${planet.glowColor}55` }}>
                {planet.name}
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(240,244,255,0.45)', letterSpacing: '0.28em', marginTop: 2 }}>
                {planet.subtitle.toUpperCase()} · {planet.description.toUpperCase()}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.12, rotate: 90 }} whileTap={{ scale: 0.9 }}
            onClick={closePanel}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(240,244,255,0.05)',
              border: '1px solid rgba(240,244,255,0.18)',
              color: '#F0F4FF', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none',
            }}
          >✕</motion.button>
        </div>

        <div style={{
          flex: 1, overflowY: 'auto', padding: '26px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${planet.glowColor}50 transparent`,
        }}>
          <PanelContent />
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '14px 26px',
          borderTop: '1px solid rgba(0,212,255,0.07)',
          flexShrink: 0,
        }}>
          {prev ? (
            <motion.button whileHover={{ x: -4 }}
              onClick={() => openPanel(prev.id as any)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              style={{ background: 'transparent', border: `1px solid ${prev.glowColor}35`, color: prev.glowColor, fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: '0.22em', padding: '7px 15px', borderRadius: 4, cursor: 'none' }}
            >← {prev.name}</motion.button>
          ) : <div />}

          {next ? (
            <motion.button whileHover={{ x: 4 }}
              onClick={() => openPanel(next.id as any)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              style={{ background: 'transparent', border: `1px solid ${next.glowColor}35`, color: next.glowColor, fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: '0.22em', padding: '7px 15px', borderRadius: 4, cursor: 'none' }}
            >{next.name} →</motion.button>
          ) : <div />}
        </div>
      </motion.div>
    </motion.div>
  )
}
