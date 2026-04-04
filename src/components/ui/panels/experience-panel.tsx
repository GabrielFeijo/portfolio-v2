import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPERIENCE } from '@/data/portfolio'
import { ChevronRight, Calendar, Building2, BriefcaseBusiness } from 'lucide-react'

export function ExperiencePanel() {
  const [expanded, setExpanded] = useState<string | null>(EXPERIENCE[0].id)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <section className="panel-card-strong p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center panel-icon-chip">
            <BriefcaseBusiness size={18} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">Linha do tempo</div>
            <h2 className="text-2xl font-semibold text-(--text-primary)">Experiência profissional</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-(--text-secondary) leading-7 max-w-2xl">
          Histórico de atuação, contexto de negócio e principais entregas que marcaram minha evolução técnica.
        </p>
      </section>

      <div className="relative">
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, var(--panel-border-strong), rgba(255,255,255,0.04))' }} />

        <div className="flex flex-col gap-4">
          {EXPERIENCE.map((exp, i) => {
            const isOpen = expanded === exp.id
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
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
                  onClick={() => setExpanded(isOpen ? null : exp.id)}
                  whileHover={{ x: 3 }}
                  className={`rounded-3xl px-5 py-5 sm:px-6 sm:py-6 cursor-none transition-all duration-200 ${isOpen ? 'panel-card-strong' : 'panel-card'}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="text-[11px] uppercase tracking-[0.16em] panel-eyebrow font-mono-space mb-2">
                        {exp.type}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-(--text-primary)">{exp.role}</h3>
                      <div className="mt-3 flex flex-wrap gap-3 items-center text-xs">
                        <div className="flex items-center gap-1.5 text-(--text-secondary)">
                          <Building2 size={14} />
                          {exp.company}
                        </div>
                        <div className="flex items-center gap-1.5 text-(--text-muted)">
                          <Calendar size={14} />
                          {exp.period}
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
                        <p className="text-sm leading-7 text-(--text-secondary) mt-5 mb-5">{exp.description}</p>

                        {exp.achievements.length > 0 && (
                          <div className="panel-card rounded-[20px] px-4 py-4 mb-4">
                            <div className="text-[11px] font-semibold panel-eyebrow tracking-[0.18em] uppercase font-mono-space mb-3">
                              Principais entregas
                            </div>
                            <div className="flex flex-col gap-2">
                              {exp.achievements.map((ach, ai) => (
                                <div key={ai} className="flex gap-2.5">
                                  <ChevronRight size={14} className="shrink-0 panel-highlight-text mt-1" />
                                  <span className="text-xs text-(--text-secondary) leading-6">{ach}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {exp.tech.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-3 py-1.5 rounded-full panel-meta-chip"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
