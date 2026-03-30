import { motion } from 'framer-motion'
import { SKILLS } from '@/data/portfolio'
import { Code2, Server, Wrench } from 'lucide-react'

const getLevelText = (level: number) => {
  if (level >= 95) return 'Expert'
  if (level >= 85) return 'Advanced'
  if (level >= 75) return 'Proficient'
  if (level >= 60) return 'Intermediate'
  return 'Familiar'
}

export function SkillsPanel() {
  const categories = [
    { key: 'frontend', label: 'Frontend', icon: Code2, skills: SKILLS.frontend },
    { key: 'backend', label: 'Backend', icon: Server, skills: SKILLS.backend },
    { key: 'devops', label: 'DevOps & Tools', icon: Wrench, skills: SKILLS.devops },
  ]

  const extras = [
    'Figma', 'GraphQL', 'React Native', 'Prisma', 'Socket.io',
    'Swagger', 'ESLint', 'Vitest', 'Webpack', 'CI/CD',
    'Agile', 'Scrum', 'Git Flow', 'TDD', 'Clean Architecture',
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">

      <div>
        <h2 className="text-lg font-semibold text-(--text-primary) mb-2">
          Skills & Expertise
        </h2>
        <p className="text-sm text-(--text-secondary)">
          Full-stack capabilities across frontend, backend, and infrastructure.
        </p>
      </div>

      {categories.map((cat, ci) => (
        <motion.div
          key={cat.key}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: ci * 0.12 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-7 h-7 flex items-center justify-center rounded-md bg-(--accent-blue) bg-opacity-10"
            >
              <cat.icon size={16} className="text-(--accent-blue-bright)" />
            </div>
            <span className="text-sm font-semibold text-(--text-primary)">
              {cat.label}
            </span>
            <div className="flex-1 h-px ml-2 bg-(--border)" />
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {cat.skills.map((skill, si) => (
              <SkillBar key={skill.name} skill={skill} delay={si * 0.06} />
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass p-5 rounded-lg border border-(--border)"
      >
        <h3 className="text-sm font-semibold text-(--text-primary) mb-3">Also Proficient In</h3>
        <div className="flex flex-wrap gap-2">
          {extras.map(skill => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.05 }}
              className="text-xs px-2.5 py-1.5 cursor-none
                         bg-(--surface) border border-(--border)
                         text-(--text-secondary) rounded-md
                         transition-colors hover:bg-(--surface-light)"
            >{skill}</motion.span>
          ))}
        </div>
      </motion.div>
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
      className="relative overflow-hidden rounded-lg px-3.5 py-3 glass border border-(--border)"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${skill.level}%` }}
        transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
        className="absolute left-0 top-0 bottom-0 rounded-lg bg-(--accent-blue) opacity-5"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-(--text-primary)">
            {skill.name}
          </span>
          <span className="text-xs text-(--text-muted) font-medium">
            {levelText}
          </span>
        </div>
        <div className="w-full h-1.5 bg-(--surface) rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: skill.color }}
          />
        </div>
      </div>
    </motion.div>
  )
}
