import { motion } from 'framer-motion'
import { ACCOMPLISHMENTS, CERTIFICATES } from '@/data/portfolio'
import * as LucideIcons from 'lucide-react'
import { GraduationCap, Award, Trophy } from 'lucide-react'

export function AccomplishmentsPanel() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <section className="panel-card-strong p-6 sm:p-7">
        <div className="panel-orbit-grid" />
        <div className="panel-surface-dust" />
        <div className="panel-orbit-ring -right-16 -top-12 h-44 w-44" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center panel-icon-chip">
            <Trophy size={18} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">Marcos relevantes</div>
            <h2 className="text-2xl font-semibold text-(--text-primary)">Conquistas e reconhecimento</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-(--text-secondary) leading-7 max-w-2xl">
          Competições, formações e sinais claros de crescimento profissional ao longo da jornada.
        </p>
      </section>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {ACCOMPLISHMENTS.map((item, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-3xl p-5 sm:p-6 cursor-none panel-card transition-all"
          >
            <div className="absolute inset-x-0 top-0 h-20 opacity-60 pointer-events-none" style={{ background: `linear-gradient(180deg, ${item.color}20, transparent)` }} />

            <div className="relative">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-4 flex justify-start"
              >
                {(() => {
                  const IconComp = (LucideIcons as any)[item.icon] || Award
                  return (
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${item.color}18`, border: `1px solid ${item.color}40`, boxShadow: `0 0 24px ${item.color}15` }}>
                      <IconComp size={20} style={{ color: item.color }} />
                    </div>
                  )
                })()}
              </motion.div>

              <div className="text-[11px] uppercase tracking-[0.18em] panel-eyebrow font-mono-space mb-2">{item.category}</div>
              <h3 className="text-base font-semibold text-(--text-primary) mb-2">{item.title}</h3>
              <p className="text-sm text-(--text-secondary) leading-7">{item.description}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {CERTIFICATES.length > 0 && (
        <section className="panel-shell p-6 sm:p-7">
          <div className="panel-core-glow right-6 top-4 h-20 w-20" />
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center panel-icon-chip">
              <GraduationCap size={18} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">Formação complementar</div>
              <h3 className="text-lg font-semibold text-(--text-primary)">Certificados</h3>
            </div>
          </div>

          <div className="space-y-4">
            {CERTIFICATES.map((cert, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.2 }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 p-4 rounded-[22px] cursor-none panel-card transition-all"
              >
                {cert.image ? (
                  <img src={cert.image} alt={cert.name} className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-(--border)" />
                ) : (
                  <div className="w-3 h-3 rounded-full shrink-0 mt-2" style={{ background: 'var(--panel-accent)' }} />
                )}

                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-(--text-primary)">{cert.name}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] panel-eyebrow font-mono-space">
                    {cert.issuer} • {cert.year}
                  </div>
                  {cert.description && (
                    <p className="text-sm text-(--text-secondary) leading-7 mt-3">{cert.description}</p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  )
}
