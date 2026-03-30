import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPERIENCE } from '@/data/portfolio'
import { ChevronRight, Calendar, Building2 } from 'lucide-react'

export function ExperiencePanel() {
  const [expanded, setExpanded] = useState<string | null>(EXPERIENCE[0].id)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">

      <div>
        <h2 className="text-lg font-semibold text-(--text-primary) mb-2">
          Experience
        </h2>
        <p className="text-sm text-(--text-secondary)">
          Professional roles and technical growth over the years.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-5.5 top-0 bottom-0 w-px bg-(--border)" />

        <div className="flex flex-col gap-4">
          {EXPERIENCE.map((exp, i) => {
            const isOpen = expanded === exp.id
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="pl-14 relative"
              >
                <div
                  className="absolute left-3.5 top-5 w-3 h-3 rounded-full border-2 transition-all duration-300 z-10"
                  style={{
                    background: isOpen ? 'var(--accent-blue)' : 'var(--deep-space)',
                    borderColor: 'var(--accent-blue)',
                  }}
                />

                <motion.div
                  onClick={() => setExpanded(isOpen ? null : exp.id)}
                  whileHover={{ x: 2 }}
                  className={`rounded-lg px-5 py-4 cursor-none transition-all duration-200 border ${isOpen ? 'glass-strong' : 'glass'}`}
                  style={{
                    borderColor: isOpen ? 'var(--accent-blue)' : 'var(--border)',
                  }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-(--text-primary) mb-2">
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap gap-3 items-center text-xs">
                        <div className="flex items-center gap-1.5 text-(--text-secondary)">
                          <Building2 size={14} />
                          {exp.company}
                        </div>
                        <div className="flex items-center gap-1.5 text-(--text-muted)">
                          <Calendar size={14} />
                          {exp.period}
                        </div>
                        <span className="px-2 py-1 rounded bg-(--surface) border border-(--border)
                                       text-(--text-muted) font-medium">
                          {exp.type}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      className="shrink-0 text-(--accent-blue-bright)"
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm leading-relaxed text-(--text-secondary) mt-4 mb-4">
                          {exp.description}
                        </p>

                        {exp.achievements.length > 0 && (
                          <div className="bg-(--surface) rounded-lg px-4 py-3.5 mb-4 border border-(--border)">
                            <div className="text-xs font-semibold text-(--accent-blue-bright) tracking-wide mb-2.5">
                              Key Achievements
                            </div>
                            {exp.achievements.map((ach, ai) => (
                              <div key={ai} className="flex gap-2.5 mb-2 last:mb-0">
                                <ChevronRight size={14} className="shrink-0 text-(--accent-blue-bright) mt-0.5" />
                                <span className="text-xs text-(--text-secondary) leading-relaxed">{ach}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {exp.tech.map(t => (
                            <span key={t}
                              className="text-xs px-2.5 py-1.5 rounded
                                         bg-(--surface) border border-(--border)
                                         text-(--text-secondary)">
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
