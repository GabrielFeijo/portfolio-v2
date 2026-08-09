import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useSpaceStore } from '@/store/space-store';
import { motion } from 'framer-motion';
import { BookOpen, Compass, MousePointerClick, Sparkles, X } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { UIBadge, UIIconTile, UIInset, UISurface } from '../design-system';
import { createCursorHandlers } from '../panels/panel-primitives';

export function HelpOverlay() {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const { closeHelp, setCursorVariant } = useSpaceStore(
    useShallow((state) => ({
      closeHelp: state.closeHelp,
      setCursorVariant: state.setCursorVariant,
    }))
  );
  const linkCursor = useMemo(() => createCursorHandlers(setCursorVariant), [setCursorVariant]);
  useFocusTrap(dialogRef, true);
  const quickSteps = t('help.quick_steps', { returnObjects: true }) as string[];
  const sections = t('help.sections', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-overlay-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-250 flex items-center justify-center p-4 sm:p-8"
    >
      <div
        className="absolute inset-0 bg-(--overlay-backdrop) pointer-events-auto cursor-none"
        onClick={closeHelp}
        onMouseEnter={() => setCursorVariant('default')}
        aria-hidden="true"
      />

      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative max-h-(--layout-overlay-max-height) w-full max-w-4xl pointer-events-auto"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <UISurface strong className="max-h-(--layout-overlay-max-height) overflow-hidden">
          <div
            className="absolute inset-0 opacity-8 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(color-mix(in srgb, var(--accent-gold) 50%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--accent-gold) 35%, transparent) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <button
            type="button"
            onClick={closeHelp}
            {...linkCursor}
            aria-label={t('help.close_aria')}
            className="absolute right-5 top-5 z-10 cursor-none"
          >
            <UIIconTile icon={X} tone="warm" />
          </button>

          <div className="relative grid max-h-(--layout-overlay-max-height) gap-0 overflow-y-auto lg:grid-cols-(--layout-help-columns)">
            <section className="border-b border-(--border) px-5 py-6 sm:px-8 sm:py-8 lg:border-b-0 lg:border-r lg:border-r-(--border)">
              <UIBadge
                tone="warm"
                className="mb-6 font-mono-space text-label uppercase tracking-caps-3xl"
              >
                <Sparkles size={14} />
                {t('help.badge')}
              </UIBadge>

              <h2
                id="help-overlay-title"
                className="max-w-2xl font-display text-3xl font-black uppercase tracking-heading text-(--text-primary) sm:text-4xl"
              >
                {t('help.title')}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-(--fallback-text-secondary) sm:text-body-md">
                {t('help.description')}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <InfoCard
                  icon={MousePointerClick}
                  title={t('help.cards.interaction.title')}
                  description={t('help.cards.interaction.description')}
                />
                <InfoCard
                  icon={Compass}
                  title={t('help.cards.flow.title')}
                  description={t('help.cards.flow.description')}
                />
                <InfoCard
                  icon={BookOpen}
                  title={t('help.cards.guided.title')}
                  description={t('help.cards.guided.description')}
                />
              </div>

              <UIInset className="mt-8 p-5 sm:p-6">
                <div className="mb-4 text-label font-mono-space uppercase tracking-caps-4xl text-(--fallback-accent-readable)">
                  {t('help.how_to_navigate')}
                </div>
                <div className="space-y-3">
                  {quickSteps.map((step, index) => (
                    <UIInset key={step} className="flex gap-4 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent-surface-hover) text-sm font-semibold text-(--fallback-accent)">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-(--fallback-text-readable)">{step}</p>
                    </UIInset>
                  ))}
                </div>
              </UIInset>
            </section>

            <aside className="px-5 py-6 sm:px-8 sm:py-8">
              <div className="mb-4 text-label font-mono-space uppercase tracking-caps-4xl text-(--fallback-accent-readable)">
                {t('help.planets_overview')}
              </div>

              <div className="space-y-3">
                {sections.map((section) => (
                  <UIInset key={section.title} className="px-4 py-4">
                    <div className="font-display text-lg font-bold uppercase tracking-heading text-(--text-primary)">
                      {section.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-(--fallback-text-muted)">
                      {section.description}
                    </p>
                  </UIInset>
                ))}
              </div>

              <UIInset className="mt-6 border-(--accent-border-subtle) bg-(--accent-surface-subtle) p-5">
                <div className="text-label font-mono-space uppercase tracking-caps-3xl text-(--fallback-accent)">
                  {t('help.project_summary_title')}
                </div>
                <p className="mt-3 text-sm leading-6 text-(--fallback-text-readable)">
                  {t('help.project_summary_description')}
                </p>
              </UIInset>
            </aside>
          </div>
        </UISurface>
      </motion.div>
    </motion.div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Compass;
  title: string;
  description: string;
}) {
  return (
    <UIInset className="p-5">
      <UIIconTile icon={Icon} tone="warm" className="mb-4" />
      <div className="font-display text-sm font-bold uppercase tracking-heading text-(--text-primary)">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-(--fallback-text-muted)">{description}</p>
    </UIInset>
  );
}
