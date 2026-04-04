import { motion } from 'framer-motion'
import { useSpaceStore } from '@/store/space-store'
import * as LucideIcons from 'lucide-react'
import { PLANETS, type PanelId } from '@/data/portfolio'
import { AboutPanel } from './panels/about-panel'
import { SkillsPanel } from './panels/skills-panel'
import { ProjectsPanel } from './panels/projects-panel'
import { ExperiencePanel } from './panels/experience-panel'
import { AccomplishmentsPanel } from './panels/accomplishments-panel'
import { ContactPanel } from './panels/contact-panel'
import type { ComponentType, CSSProperties } from 'react'
import { createCursorHandlers, getLucideIcon } from './panels/panel-primitives'
import { UIBadge } from './design-system'

const PANELS: Record<PanelId, ComponentType> = {
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
  const linkCursor = createCursorHandlers(setCursorVariant)

  const planet = PLANETS.find(p => p.id === activePanel)
  const PanelContent = PANELS[activePanel]
  if (!planet || !PanelContent) return null

  const idx = PLANETS.findIndex(p => p.id === activePanel)
  const prev = PLANETS[idx - 1]
  const next = PLANETS[idx + 1]

  const handleNav = (id: PanelId) => {
    closePanel()
    setTimeout(() => {
      setActivePlanet(id)
      openPanel(id)
    }, 800)
  }

  const panelTheme = {
    '--panel-accent': planet.color,
    '--panel-glow': planet.glowColor,
    '--panel-accent-soft': `${planet.color}20`,
    '--panel-accent-faint': `${planet.glowColor}12`,
    '--panel-border': `${planet.glowColor}22`,
    '--panel-border-strong': `${planet.glowColor}48`,
  } as CSSProperties

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-200 pointer-events-none flex"
    >

      <div
        className="absolute inset-0 pointer-events-auto cursor-none"
        onClick={closePanel}
        onMouseEnter={() => setCursorVariant('default')}
      />

      <div className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
        style={{ background: `linear-gradient(90deg,transparent,${planet.glowColor}80,transparent)`, boxShadow: `0 0 20px ${planet.glowColor}` }}
      />

      <div className="flex-1" />

      <motion.div
        initial={{ x: '100%', opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 32, mass: 0.8 }}
        className="relative h-full w-full pointer-events-auto overflow-hidden sm:w-[620px]"
        style={panelTheme}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-drawer">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${planet.glowColor} 1px, transparent 1px),
                              linear-gradient(90deg, ${planet.glowColor} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
          />

          <div className="panel-drawer-header relative shrink-0 px-7 py-7 sm:px-8 sm:py-8">

            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closePanel}
              {...linkCursor}
              className="panel-close-button absolute right-5 top-5 z-10 h-11 w-11 cursor-none transition-colors hover:bg-[rgba(255,255,255,0.12)]"
            >
              <LucideIcons.X size={18} />
            </motion.button>

            <div className="mb-5 flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center justify-center rounded-[20px] p-3"
                style={{ background: `${planet.color}18`, border: `1px solid ${planet.glowColor}38`, boxShadow: `0 0 30px ${planet.glowColor}18` }}
              >
                {(() => {
                  const IconComp = getLucideIcon(planet.icon)
                  return <IconComp size={18} style={{ color: planet.color, filter: `drop-shadow(0 0 8px ${planet.glowColor})` }} />
                })()}
              </motion.div>

              <UIBadge className="font-mono-space text-[10px] uppercase tracking-[0.32em]" >
                {planet.subtitle.toUpperCase()}
              </UIBadge>
            </div>

            <div
              className="font-display text-[34px] font-black leading-none tracking-[0.12em] uppercase sm:text-[38px]"
              style={{ color: planet.color, textShadow: `0 0 40px ${planet.glowColor}60` }}
            >
              {planet.name}
            </div>
            <div className="mt-4 max-w-[92%] font-body-exo text-[13px] font-light leading-6 text-[rgba(240,244,255,0.62)]">
              {planet.description}
            </div>
          </div>

          <div
            className="panel-drawer-body relative z-10 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6"
          >
            <PanelContent />
          </div>

          <div className="panel-drawer-footer relative z-10 flex shrink-0 justify-between px-5 py-4 sm:px-6 sm:py-5">
            {prev ? (
              <motion.button
                whileHover={{ x: -6 }}
                onClick={() => handleNav(prev.id)}
                {...linkCursor}
                className="panel-nav-button cursor-none font-display text-[10px] font-bold tracking-[0.2em] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                style={{ border: `1px solid ${prev.glowColor}30`, color: prev.glowColor }}
              >
                <LucideIcons.ChevronLeft size={14} />
                <span className="opacity-80">{prev.name}</span>
              </motion.button>
            ) : <div />}

            {next ? (
              <motion.button
                whileHover={{ x: 6 }}
                onClick={() => handleNav(next.id)}
                {...linkCursor}
                className="panel-nav-button cursor-none font-display text-[10px] font-bold tracking-[0.2em] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                style={{ border: `1px solid ${next.glowColor}30`, color: next.glowColor }}
              >
                <span className="opacity-80">{next.name}</span>
                <LucideIcons.ChevronRight size={14} />
              </motion.button>
            ) : <div />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
