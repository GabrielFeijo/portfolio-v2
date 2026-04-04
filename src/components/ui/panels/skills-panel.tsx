import { motion } from 'framer-motion'
import { SKILLS, SKILL_GROUPS } from '@/data/portfolio'
import { Code2, Server, Wrench, Sparkles } from 'lucide-react'

const getLevelText = (level: number) => {
  if (level >= 95) return 'Especialista'
  if (level >= 85) return 'Avançado'
  if (level >= 75) return 'Proficiente'
  if (level >= 60) return 'Intermediário'
  return 'Em evolução'
}

export function SkillsPanel() {
  const categories = [
    { key: 'frontend', label: 'Frontend', icon: Code2, skills: SKILLS.frontend, tone: 'var(--panel-accent-soft)' },
    { key: 'backend', label: 'Backend', icon: Server, skills: SKILLS.backend, tone: 'color-mix(in srgb, var(--panel-glow) 18%, transparent)' },
    { key: 'devops', label: 'DevOps e Plataforma', icon: Wrench, skills: SKILLS.devops, tone: 'color-mix(in srgb, var(--panel-accent) 14%, transparent)' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <section className="panel-card-strong p-6 sm:p-7">
        <div className="panel-orbit-grid" />
        <div className="panel-surface-dust" />
        <div className="panel-orbit-ring -left-10 -top-12 h-36 w-36" />
        <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">Mapa de capacidade</div>
        <h2 className="mt-2 text-2xl font-semibold text-(--text-primary)">Habilidades e stack</h2>
        <p className="mt-3 text-sm text-(--text-secondary) leading-7 max-w-2xl">
          Uma visão equilibrada entre domínio técnico, repertório de ferramentas e capacidade de entrega em produto, frontend, backend e infraestrutura.
        </p>
      </section>

      {categories.map((cat, ci) => (
        <motion.section
          key={cat.key}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: ci * 0.12 }}
        className="panel-shell p-6 sm:p-7"
        >
          <div className="panel-core-glow right-6 top-4 h-20 w-20" />
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-2xl border panel-icon-chip"
              style={{ background: `linear-gradient(180deg, ${cat.tone}, rgba(255,255,255,0.02))` }}
            >
              <cat.icon size={18} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">Especialidade</div>
              <div className="text-lg font-semibold text-(--text-primary)">{cat.label}</div>
            </div>
            <div className="flex-1 h-px ml-2 panel-soft-divider" />
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {cat.skills.map((skill, si) => (
              <SkillBar key={skill.name} skill={skill} delay={si * 0.06} />
            ))}
          </div>
        </motion.section>
      ))}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="panel-shell p-6 sm:p-7"
      >
        <div className="panel-orbit-ring -right-10 bottom-4 h-28 w-28" />
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center panel-icon-chip">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">Expansão de repertório</div>
            <h3 className="text-lg font-semibold text-(--text-primary)">Competências complementares</h3>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title} className="panel-card p-5">
              <div className="text-sm font-semibold text-(--text-primary) mb-3">{group.title}</div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.04 }}
                    className="text-xs px-3 py-1.5 cursor-none panel-meta-chip rounded-full transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}

function SkillBar({ skill, delay }: { skill: { name: string; level: number; color: string }; delay: number }) {
  const levelText = getLevelText(skill.level)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-[20px] px-4 py-4 panel-card"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${skill.level}%` }}
        transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
        className="absolute left-0 top-0 bottom-0 opacity-[0.08]"
        style={{ background: `linear-gradient(90deg, ${skill.color}, transparent)` }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-sm font-semibold text-(--text-primary)">{skill.name}</span>
          <span className="text-[11px] uppercase tracking-[0.16em] panel-eyebrow font-mono-space">{levelText}</span>
        </div>

        <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${skill.color}, rgba(255,255,255,0.92))` }}
          />
        </div>

        <div className="mt-2 text-xs text-(--text-muted)">{skill.level}% de domínio percebido</div>
      </div>
    </motion.div>
  )
}
