import { motion } from 'framer-motion'
import { SKILLS } from '@/data/portfolio'
import { Layout, Server, Terminal, Cpu } from 'lucide-react'

const getLevelText = (level: number) => {
  if (level >= 95) return 'EXPERT'
  if (level >= 85) return 'ADVANCED'
  if (level >= 75) return 'PROFICIENT'
  if (level >= 60) return 'INTERMEDIATE'
  return 'FAMILIAR'
}

export function SkillsPanel() {
  const categories = [
    { key: 'frontend', label: 'FRONTEND',       icon: Layout, color: '#00D4FF', skills: SKILLS.frontend },
    { key: 'backend',  label: 'BACKEND',         icon: Server, color: '#00FF88', skills: SKILLS.backend },
    { key: 'devops',   label: 'DEVOPS & TOOLS',  icon: Terminal, color: '#FFB800', skills: SKILLS.devops },
  ]

  const extras = [
    'Figma','GraphQL','React Native','Prisma','Socket.io',
    'Swagger','ESLint','Vitest','Webpack','CI/CD',
    'Agile','Scrum','Git Flow','TDD','Clean Architecture',
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-7">
      <div>
        <div className="font-display text-[11px] text-[#00FF88] tracking-[0.3em] mb-2 flex items-center gap-2">
          <Cpu size={14} /> TECHNOLOGY ARSENAL
        </div>
        <p className="font-body-exo text-[13px] text-[rgba(240,244,255,0.55)] leading-snug">
          Technologies and tools mastered across the full stack spectrum.
        </p>
      </div>

      {categories.map((cat, ci) => (
        <motion.div
          key={cat.key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: ci * 0.15 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-md"
              style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30`, color: cat.color }}
            >
              <cat.icon size={16} />
            </div>
            <span className="font-display text-[11px] font-bold tracking-[0.3em]" style={{ color: cat.color }}>
              {cat.label}
            </span>
            <div className="flex-1 h-px ml-1" style={{ background: `linear-gradient(90deg, ${cat.color}30, transparent)` }} />
          </div>

          <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {cat.skills.map((skill, si) => (
              <SkillBar key={skill.name} skill={skill} delay={si * 0.07} />
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass p-6"
      >
        <div className="font-display text-[10px] text-[#00D4FF] tracking-[0.3em] mb-4">ALSO FLUENT IN</div>
        <div className="flex flex-wrap gap-2">
          {extras.map(skill => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.08, y: -2 }}
              className="font-mono-space text-[9px] tracking-[0.15em] px-3 py-1.5 cursor-none
                         glass
                         rounded-full text-[rgba(240,244,255,0.8)] transition-colors hover:bg-[rgba(0,212,255,0.12)]"
            >{skill}</motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function SkillBar({ skill, delay }: { skill: { name: string; level: number; color: string }; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-lg px-3.5 py-3 glass"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${skill.level}%` }}
        transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
        className="absolute left-0 top-0 bottom-0 rounded-lg"
        style={{ background: `linear-gradient(90deg, ${skill.color}14, transparent)` }}
      />

      <div className="relative flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: skill.color, boxShadow: `0 0 6px ${skill.color}` }} />
          <span className="font-body-exo text-[13px] font-semibold text-[#F0F4FF]">{skill.name}</span>
        </div>
        <span className="font-display text-[10px] tracking-[0.1em]" style={{ color: skill.color }}>{getLevelText(skill.level)}</span>
      </div>

      <div className="h-0.5 bg-[rgba(255,255,255,0.06)] rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ delay: delay + 0.3, duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded"
          style={{
            background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
            boxShadow: `0 0 6px ${skill.color}`,
          }}
        />
      </div>
    </motion.div>
  )
}
