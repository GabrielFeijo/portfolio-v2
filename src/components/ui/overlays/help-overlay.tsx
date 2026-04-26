import { useRef } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Compass, MousePointerClick, Sparkles, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useSpaceStore } from '@/store/space-store'
import { UIBadge, UIIconTile, UIInset, UISurface } from '../design-system'
import { createCursorHandlers } from '../panels/panel-primitives'

export function HelpOverlay() {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const { closeHelp, setCursorVariant } = useSpaceStore()
  const linkCursor = createCursorHandlers(setCursorVariant)
  useFocusTrap(dialogRef, true)
  const quickSteps = t('help.quick_steps', { returnObjects: true }) as string[]
  const sections = t('help.sections', { returnObjects: true }) as Array<{ title: string; description: string }>

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
        className="absolute inset-0 bg-[rgba(2,4,12,0.72)] backdrop-blur-md pointer-events-auto cursor-none"
        onClick={closeHelp}
        onMouseEnter={() => setCursorVariant('default')}
      />

      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-4xl pointer-events-auto"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <UISurface strong className="max-h-[calc(100vh-2rem)] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,184,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.35) 1px, transparent 1px)',
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

          <div className="relative grid max-h-[calc(100vh-2rem)] gap-0 overflow-y-auto lg:grid-cols-[1.15fr_0.85fr]">
            <section className="border-b border-[rgba(255,255,255,0.08)] px-5 py-6 sm:px-8 sm:py-8 lg:border-b-0 lg:border-r lg:border-r-[rgba(255,255,255,0.08)]">
              <UIBadge tone="warm" className="mb-6 font-mono-space text-[11px] uppercase tracking-[0.28em]">
                <Sparkles size={14} />
                {t('help.badge')}
              </UIBadge>

              <h2 id="help-overlay-title" className="max-w-2xl font-display text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">
                {t('help.title')}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(240,244,255,0.72)] sm:text-[15px]">
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
                <div className="mb-4 text-[11px] font-mono-space uppercase tracking-[0.3em] text-[rgba(255,214,122,0.72)]">
                  {t('help.how_to_navigate')}
                </div>
                <div className="space-y-3">
                  {quickSteps.map((step, index) => (
                    <UIInset key={step} className="flex gap-4 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(255,184,0,0.12)] text-sm font-semibold text-[#FFD67A]">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-[rgba(240,244,255,0.75)]">{step}</p>
                    </UIInset>
                  ))}
                </div>
              </UIInset>
            </section>

            <aside className="px-5 py-6 sm:px-8 sm:py-8">
              <div className="mb-4 text-[11px] font-mono-space uppercase tracking-[0.3em] text-[rgba(255,214,122,0.72)]">
                {t('help.planets_overview')}
              </div>

              <div className="space-y-3">
                {sections.map((section) => (
                  <UIInset key={section.title} className="px-4 py-4">
                    <div className="font-display text-lg font-bold uppercase tracking-[0.08em] text-white">
                      {section.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[rgba(240,244,255,0.68)]">
                      {section.description}
                    </p>
                  </UIInset>
                ))}
              </div>

              <UIInset className="mt-6 border-[rgba(255,184,0,0.12)] bg-[rgba(255,184,0,0.06)] p-5">
                <div className="text-[11px] font-mono-space uppercase tracking-[0.28em] text-[#FFD67A]">
                  {t('help.project_summary_title')}
                </div>
                <p className="mt-3 text-sm leading-6 text-[rgba(240,244,255,0.75)]">
                  {t('help.project_summary_description')}
                </p>
              </UIInset>
            </aside>
          </div>
        </UISurface>
      </motion.div>
    </motion.div>
  )
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Compass
  title: string
  description: string
}) {
  return (
    <UIInset className="p-5">
      <UIIconTile icon={Icon} tone="warm" className="mb-4" />
      <div className="font-display text-sm font-bold uppercase tracking-[0.08em] text-white">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-[rgba(240,244,255,0.68)]">
        {description}
      </p>
    </UIInset>
  )
}
