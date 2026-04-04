import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPERIENCE, type Experience } from '@/data/portfolio'
import { ChevronRight, Calendar, Building2, BriefcaseBusiness } from 'lucide-react'
import { PanelIntroCard } from './panel-primitives'
import { PanelBulletList, PanelInsetCard, PanelTagList } from './panel-content-primitives'

export function ExperiencePanel() {
  const [expanded, setExpanded] = useState<string | null>(EXPERIENCE[0].id)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={BriefcaseBusiness}
        eyebrow="Linha do tempo"
        title="Experiência profissional"
        description="Histórico de atuação, contexto de negócio e principais entregas que marcaram minha evolução técnica."
        ringClassName="-left-12 -top-10 h-32 w-32"
      />

      <div className="relative">
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, var(--panel-border-strong), rgba(255,255,255,0.04))' }} />

        <div className="flex flex-col gap-4">
          {EXPERIENCE.map((exp, i) => {
            return (
              <ExperienceItem
                key={exp.id}
                experience={exp}
                isOpen={expanded === exp.id}
                onToggle={() => setExpanded(expanded === exp.id ? null : exp.id)}
                transition={{ delay: i * 0.08 }}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

function ExperienceItem({
  experience,
  isOpen,
  onToggle,
  transition,
}: {
  experience: Experience
  isOpen: boolean
  onToggle: () => void
  transition: { delay: number }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transition}
      className="pl-10 sm:pl-16 relative"
    >
      <div
        className="absolute left-2.25 sm:left-4.25 top-7 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10"
        style={{
          background: isOpen ? 'var(--panel-accent)' : 'var(--deep-space)',
          borderColor: 'var(--panel-accent)',
          boxShadow: isOpen ? '0 0 20px color-mix(in srgb, var(--panel-glow) 40%, transparent)' : 'none',
        }}
      />

      <motion.article
        onClick={onToggle}
        whileHover={{ x: 3 }}
        className={`rounded-3xl px-5 py-5 sm:px-6 sm:py-6 cursor-none transition-all duration-200 ${isOpen ? 'panel-card-strong' : 'panel-card'}`}
        style={{
          boxShadow: isOpen ? '0 18px 40px rgba(0,0,0,0.24), 0 0 34px color-mix(in srgb, var(--panel-glow) 12%, transparent)' : undefined,
        }}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-[0.16em] panel-eyebrow font-mono-space mb-2">
              {experience.type}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-(--text-primary)">{experience.role}</h3>
            <div className="mt-3 flex flex-wrap gap-3 items-center text-xs">
              <div className="flex items-center gap-1.5 text-(--text-secondary)">
                <Building2 size={14} />
                {experience.company}
              </div>
              <div className="flex items-center gap-1.5 text-(--text-muted)">
                <Calendar size={14} />
                {experience.period}
              </div>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="shrink-0 panel-highlight-text mt-1"
          >
            <ChevronRight size={18} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <p className="text-sm leading-7 text-(--text-secondary) mt-5 mb-5">{experience.description}</p>

              {experience.achievements.length > 0 && (
                <PanelInsetCard className="mb-4">
                  <div className="text-[11px] font-semibold panel-eyebrow tracking-[0.18em] uppercase font-mono-space mb-3">
                    Principais entregas
                  </div>
                  <PanelBulletList items={experience.achievements} />
                </PanelInsetCard>
              )}

              <PanelTagList items={experience.tech} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </motion.div>
  )
}
