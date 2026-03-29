import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPERIENCE } from '@/data/portfolio'

export function ExperiencePanel() {
  const [expanded, setExpanded] = useState<string | null>(EXPERIENCE[0].id)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div>
        <div className="font-mono-space text-[11px] text-[#FF4500] tracking-[0.3em] mb-2">
          ◈ CHRONOS RECORD — PROFESSIONAL TIMELINE
        </div>
        <p className="font-body-exo text-[13px] text-[rgba(240,244,255,0.5)] leading-snug">
          A chronicle of professional missions and conquered frontiers.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, #FF4500, #FF450020)' }}
        />

        <div className="flex flex-col gap-4">
          {EXPERIENCE.map((exp, i) => {
            const isOpen = expanded === exp.id
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="pl-14 relative"
              >
                <div
                  className="absolute left-3 top-5 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10"
                  style={{
                    background: isOpen ? exp.color : 'rgba(2,2,21,0.9)',
                    borderColor: exp.color,
                    boxShadow: isOpen ? `0 0 14px ${exp.color}` : 'none',
                  }}
                />

                <motion.div
                  onClick={() => setExpanded(isOpen ? null : exp.id)}
                  whileHover={{ x: 3 }}
                  className="rounded-xl px-5 py-4 cursor-none transition-all duration-300"
                  style={{
                    background: isOpen ? `${exp.color}10` : 'rgba(2,2,21,0.7)',
                    border: `1px solid ${isOpen ? exp.color + '40' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="font-display text-[13px] font-bold text-[#F0F4FF] tracking-[0.1em] mb-1.5">
                        {exp.role}
                      </div>
                      <div className="flex gap-2.5 items-center flex-wrap">
                        <span className="font-mono-space text-[10px] tracking-[0.15em]" style={{ color: exp.color }}>
                          {exp.company}
                        </span>
                        <span className="font-mono-space text-[8px] text-[rgba(240,244,255,0.3)]">{exp.period}</span>
                        <span
                          className="font-mono-space text-[7px] tracking-[0.2em] px-2 py-0.5 rounded-sm"
                          style={{ color: exp.color, border: `1px solid ${exp.color}40` }}
                        >
                          {exp.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      className="text-[12px] flex-shrink-0"
                      style={{ color: exp.color }}
                    >▶</motion.div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="font-body-exo text-[12px] leading-relaxed text-[rgba(240,244,255,0.65)] mt-4 mb-4">
                          {exp.description}
                        </p>

                        <div className="bg-[rgba(0,0,8,0.5)] rounded-lg px-4 py-3.5 mb-4">
                          <div className="font-mono-space text-[9px] text-[#00FF88] tracking-[0.25em] mb-2.5">
                            KEY ACHIEVEMENTS
                          </div>
                          {exp.achievements.map((ach, ai) => (
                            <div key={ai} className="flex gap-2.5 mb-2 last:mb-0">
                              <span className="text-[11px] flex-shrink-0 mt-0.5" style={{ color: exp.color }}>▸</span>
                              <span className="font-body-exo text-[12px] text-[rgba(240,244,255,0.6)] leading-snug">{ach}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {exp.tech.map(t => (
                            <span key={t}
                              className="font-mono-space text-[8px] tracking-[0.15em] px-2 py-1 rounded
                                         text-[rgba(0,212,255,0.7)] border border-[rgba(0,212,255,0.2)]">
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
