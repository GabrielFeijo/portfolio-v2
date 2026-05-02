import { lazy, Suspense, useCallback, useMemo, useRef } from 'react'
import type { ComponentType, CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { ANIMATION_SETTINGS } from '@/constants/animation'
import { PLANETS, type PanelId } from '@/data/portfolio'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useSpaceStore } from '@/store/space-store'
import { createCursorHandlers, getLucideIcon } from './panels/panel-primitives'
import { UIBadge } from './design-system'

const AboutPanel = lazy(() => import('./panels/about-panel').then((module) => ({ default: module.AboutPanel })))
const SkillsPanel = lazy(() => import('./panels/skills-panel').then((module) => ({ default: module.SkillsPanel })))
const ProjectsPanel = lazy(() => import('./panels/projects-panel').then((module) => ({ default: module.ProjectsPanel })))
const ExperiencePanel = lazy(() => import('./panels/experience-panel').then((module) => ({ default: module.ExperiencePanel })))
const AccomplishmentsPanel = lazy(() => import('./panels/accomplishments-panel').then((module) => ({ default: module.AccomplishmentsPanel })))
const ContactPanel = lazy(() => import('./panels/contact-panel').then((module) => ({ default: module.ContactPanel })))

const PANELS: Record<PanelId, ComponentType> = {
  about: AboutPanel,
  skills: SkillsPanel,
  projects: ProjectsPanel,
  experience: ExperiencePanel,
  accomplishments: AccomplishmentsPanel,
  contact: ContactPanel,
}

interface PanelTheme extends CSSProperties {
  '--panel-accent': string
  '--panel-glow': string
  '--panel-accent-soft': string
  '--panel-accent-faint': string
  '--panel-border': string
  '--panel-border-strong': string
}

export function PlanetPanel() {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const {
    activePanel,
    closePanel,
    navigateToPanel,
    setCursorVariant,
    settings,
  } = useSpaceStore(useShallow((state) => ({
    activePanel: state.activePanel,
    closePanel: state.closePanel,
    navigateToPanel: state.navigateToPanel,
    setCursorVariant: state.setCursorVariant,
    settings: state.experienceSettings,
  })))

  useFocusTrap(panelRef, Boolean(activePanel))

  const planet = PLANETS.find(p => p.id === activePanel)
  const PanelContent = activePanel ? PANELS[activePanel] : null
  const linkCursor = createCursorHandlers(setCursorVariant)
  const idx = PLANETS.findIndex(p => p.id === activePanel)
  const prev = idx > -1 ? PLANETS[idx - 1] : undefined
  const next = idx > -1 ? PLANETS[idx + 1] : undefined

  const fallbackTheme = useMemo<PanelTheme>(() => ({
    '--panel-accent': '#7dd3fc',
    '--panel-glow': '#2b6fff',
    '--panel-accent-soft': '#7dd3fc20',
    '--panel-accent-faint': '#2b6fff12',
    '--panel-border': '#2b6fff22',
    '--panel-border-strong': '#2b6fff48',
  }), [])

  const handleNav = useCallback((id: PanelId) => {
    navigateToPanel(id)
  }, [navigateToPanel])

  const planetTheme = useMemo<PanelTheme | null>(() => planet ? ({
    '--panel-accent': planet.color,
    '--panel-glow': planet.glowColor,
    '--panel-accent-soft': `${planet.color}20`,
    '--panel-accent-faint': `${planet.glowColor}12`,
    '--panel-border': `${planet.glowColor}22`,
    '--panel-border-strong': `${planet.glowColor}48`,
  }) : null, [planet])
  const panelTheme = planetTheme ?? fallbackTheme

  if (!activePanel || !planet || !PanelContent) return null

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
        transition={settings.transitionAnimations ? ANIMATION_SETTINGS.panelSpring : { duration: 0 }}
        className="relative h-full w-full pointer-events-auto overflow-hidden sm:w-155"
        ref={panelRef}
        role="dialog"
        aria-labelledby="planet-panel-title"
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
              aria-label={t('planet_panel.close_aria')}
              className="panel-close-button absolute right-5 top-5 z-10 h-11 w-11 cursor-none transition-colors hover:bg-[rgba(255,255,255,0.12)]"
            >
              <X size={18} />
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
                {t(`planets.${planet.id}.subtitle`).toUpperCase()}
              </UIBadge>
            </div>

            <div
              id="planet-panel-title"
              className="font-display text-[34px] font-black leading-none tracking-[0.12em] uppercase sm:text-[38px]"
              style={{ color: planet.color, textShadow: `0 0 40px ${planet.glowColor}60` }}
            >
              {t(`planets.${planet.id}.name`)}
            </div>
            <div className="mt-4 max-w-[92%] font-body-exo text-[13px] font-light leading-6 text-[rgba(240,244,255,0.62)]">
              {t(`planets.${planet.id}.description`)}
            </div>
          </div>

          <div
            className="panel-drawer-body relative z-10 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6"
          >
            <Suspense fallback={<div className="panel-card p-5 text-sm text-(--text-secondary)">{t('common.loading_short')}</div>}>
              <PanelContent />
            </Suspense>
          </div>

          <div className="panel-drawer-footer relative z-10 flex shrink-0 justify-between px-5 py-4 sm:px-6 sm:py-5">
            {prev ? (
              <motion.button
                whileHover={{ x: -6 }}
                onClick={() => handleNav(prev.id)}
                {...linkCursor}
                aria-label={t('planet_panel.previous_aria', { name: t(`planets.${prev.id}.name`) })}
                className="panel-nav-button cursor-none font-display text-[10px] font-bold tracking-[0.2em] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                style={{ border: `1px solid ${prev.glowColor}30`, color: prev.glowColor }}
              >
                <ChevronLeft size={14} />
                <span className="opacity-80">{t(`planets.${prev.id}.name`)}</span>
              </motion.button>
            ) : <div />}

            {next ? (
              <motion.button
                whileHover={{ x: 6 }}
                onClick={() => handleNav(next.id)}
                {...linkCursor}
                aria-label={t('planet_panel.next_aria', { name: t(`planets.${next.id}.name`) })}
                className="panel-nav-button cursor-none font-display text-[10px] font-bold tracking-[0.2em] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                style={{ border: `1px solid ${next.glowColor}30`, color: next.glowColor }}
              >
                <span className="opacity-80">{t(`planets.${next.id}.name`)}</span>
                <ChevronRight size={14} />
              </motion.button>
            ) : <div />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
