import { motion } from 'framer-motion'
import React from 'react'
import { ACCOMPLISHMENTS, CERTIFICATES } from '@/data/portfolio'
import * as LucideIcons from 'lucide-react'
import { Trophy, GraduationCap, Award, LucideIcon } from 'lucide-react'

export function AccomplishmentsPanel() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">

      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Achievements & Recognition
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Awards, certifications, and important milestones in my professional journey.
        </p>
      </div>

      {/* Accomplishments Grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {ACCOMPLISHMENTS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-lg p-5 cursor-none
                       glass border border-[var(--border)] transition-all"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-[var(--border)]" />

            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-3.5 flex justify-start text-[var(--accent-blue-bright)]"
            >
              {(() => {
                const IconComp = (LucideIcons as any)[item.icon] || Award
                return <IconComp size={28} />
              })()}
            </motion.div>

            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5">
              {item.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {item.description}
            </p>

            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <span className="text-xs font-medium px-2 py-1 rounded
                             bg-[var(--surface)] border border-[var(--border)]
                             text-[var(--text-muted)]">
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certificates Section */}
      {CERTIFICATES.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap size={16} className="text-[var(--accent-blue-bright)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Certifications
            </h3>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <div className="flex flex-col gap-3">
            {CERTIFICATES.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-4 rounded-lg cursor-none
                           glass border border-[var(--border)] transition-all"
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: 'var(--accent-blue)' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-primary)]">{cert.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {cert.issuer} • {cert.year}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
