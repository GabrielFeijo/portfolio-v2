import { ANIMATION_SETTINGS } from '@/constants/animation';
import { PLANETS, type PanelId } from '@/data/portfolio';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useSpaceStore } from '@/store/space-store';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';
import { lazy, Suspense, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { createCursorHandlers } from './panels/panel-primitives';

const AboutPanel = lazy(() =>
  import('./panels/about-panel').then((module) => ({ default: module.AboutPanel }))
);
const SkillsPanel = lazy(() =>
  import('./panels/skills-panel').then((module) => ({ default: module.SkillsPanel }))
);
const ProjectsPanel = lazy(() =>
  import('./panels/projects-panel').then((module) => ({ default: module.ProjectsPanel }))
);
const ExperiencePanel = lazy(() =>
  import('./panels/experience-panel').then((module) => ({ default: module.ExperiencePanel }))
);
const AccomplishmentsPanel = lazy(() =>
  import('./panels/accomplishments-panel').then((module) => ({
    default: module.AccomplishmentsPanel,
  }))
);
const ContactPanel = lazy(() =>
  import('./panels/contact-panel').then((module) => ({ default: module.ContactPanel }))
);

const PANELS: Record<PanelId, ComponentType> = {
  about: AboutPanel,
  skills: SkillsPanel,
  projects: ProjectsPanel,
  experience: ExperiencePanel,
  accomplishments: AccomplishmentsPanel,
  contact: ContactPanel,
};

interface PanelTheme extends CSSProperties {
  '--panel-accent': string;
  '--panel-glow': string;
  '--panel-accent-soft': string;
  '--panel-accent-faint': string;
  '--panel-border': string;
  '--panel-border-strong': string;
}

export function PlanetPanel() {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { activePanel, closePanel, navigateToPanel, setCursorVariant, transitionAnimations } =
    useSpaceStore(
      useShallow((state) => ({
        activePanel: state.activePanel,
        closePanel: state.closePanel,
        navigateToPanel: state.navigateToPanel,
        setCursorVariant: state.setCursorVariant,
        transitionAnimations: state.experienceSettings.transitionAnimations,
      }))
    );

  useFocusTrap(panelRef, Boolean(activePanel));

  const planet = PLANETS.find((p) => p.id === activePanel);
  const PanelContent = activePanel ? PANELS[activePanel] : null;
  const linkCursor = useMemo(() => createCursorHandlers(setCursorVariant), [setCursorVariant]);
  const idx = PLANETS.findIndex((p) => p.id === activePanel);
  const prev = idx > -1 ? PLANETS[idx - 1] : undefined;
  const next = idx > -1 ? PLANETS[idx + 1] : undefined;

  const fallbackTheme = useMemo<PanelTheme>(
    () => ({
      '--panel-accent': '#dfb53b',
      '--panel-glow': '#f59e0b',
      '--panel-accent-soft': '#dfb53b20',
      '--panel-accent-faint': '#f59e0b12',
      '--panel-border': '#f59e0b22',
      '--panel-border-strong': '#f59e0b48',
    }),
    []
  );

  const handleNav = useCallback(
    (id: PanelId) => {
      navigateToPanel(id);
    },
    [navigateToPanel]
  );

  const panelTheme = fallbackTheme;

  if (!activePanel || !planet || !PanelContent) return null;

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
        aria-hidden="true"
      />

      <div
        className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg,transparent,rgba(223,181,59,0.72),transparent)',
        }}
      />

      <div className="flex-1" />

      <motion.div
        initial={{ x: '100%', opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={transitionAnimations ? ANIMATION_SETTINGS.panelSpring : { duration: 0 }}
        className="relative h-full w-full pointer-events-auto overflow-hidden sm:w-155"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="planet-panel-title"
        style={panelTheme}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-drawer">
          <div className="panel-drawer-header relative shrink-0 px-5 py-5 sm:px-6 sm:py-5">
            <motion.button
              whileTap={transitionAnimations ? { scale: 0.96 } : undefined}
              onClick={closePanel}
              {...linkCursor}
              aria-label={t('planet_panel.close_aria')}
              className="panel-close-button absolute right-5 top-4 z-10 h-10 w-10 cursor-none transition-colors hover:bg-[rgba(255,255,255,0.08)]"
            >
              <X size={18} />
            </motion.button>

            <div
              id="planet-panel-title"
              className="pr-16 font-display text-lg font-bold leading-10 tracking-[0.08em] uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              {t(`planets.${planet.id}.name`)}
            </div>
          </div>

          <div className="panel-drawer-body relative z-10 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            <Suspense
              fallback={
                <div className="panel-card p-5 text-sm text-(--text-secondary)">
                  {t('common.loading_short')}
                </div>
              }
            >
              <PanelContent />
            </Suspense>
          </div>

          <div className="panel-drawer-footer relative z-10 flex shrink-0 justify-between px-5 py-4 sm:px-6 sm:py-5">
            {prev ? (
              <motion.button
                whileTap={transitionAnimations ? { scale: 0.98 } : undefined}
                onClick={() => handleNav(prev.id)}
                {...linkCursor}
                aria-label={t('planet_panel.previous_aria', { name: t(`planets.${prev.id}.name`) })}
                className="panel-nav-button cursor-none font-display text-[10px] font-bold tracking-[0.2em] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                style={{ border: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}
              >
                <ChevronLeft size={14} />
                <span className="opacity-80">{t(`planets.${prev.id}.name`)}</span>
              </motion.button>
            ) : (
              <div />
            )}

            {next ? (
              <motion.button
                whileTap={transitionAnimations ? { scale: 0.98 } : undefined}
                onClick={() => handleNav(next.id)}
                {...linkCursor}
                aria-label={t('planet_panel.next_aria', { name: t(`planets.${next.id}.name`) })}
                className="panel-nav-button cursor-none font-display text-[10px] font-bold tracking-[0.2em] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                style={{ border: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}
              >
                <span className="opacity-80">{t(`planets.${next.id}.name`)}</span>
                <ChevronRight size={14} />
              </motion.button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
