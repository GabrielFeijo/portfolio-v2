import { motion } from 'framer-motion'
import { SKILLS } from '@/data/portfolio'

export function SkillsPanel() {
  const categories = [
    { key: 'frontend', label: 'FRONTEND', icon: '◈', color: '#00D4FF', skills: SKILLS.frontend },
    { key: 'backend', label: 'BACKEND', icon: '⬡', color: '#00FF88', skills: SKILLS.backend },
    { key: 'devops', label: 'DEVOPS & TOOLS', icon: '⚙', color: '#FFB800', skills: SKILLS.devops },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
    >
      <div>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 11, color: '#00FF88',
          letterSpacing: '0.3em', marginBottom: 8,
        }}>
          ◈ TECHNOLOGY ARSENAL
        </div>
        <p style={{
          fontFamily: 'Exo 2, sans-serif',
          fontSize: 14, color: 'rgba(240,244,255,0.55)',
          lineHeight: 1.7,
        }}>
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
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 16,
          }}>
            <div style={{
              width: 30, height: 30,
              background: `${cat.color}15`,
              border: `1px solid ${cat.color}30`,
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: cat.color, fontSize: 14,
            }}>
              {cat.icon}
            </div>
            <span style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 11, fontWeight: 700,
              color: cat.color, letterSpacing: '0.3em',
            }}>
              {cat.label}
            </span>
            <div style={{
              flex: 1, height: 1,
              background: `linear-gradient(90deg, ${cat.color}30, transparent)`,
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 10,
          }}>
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
        style={{
          background: 'rgba(0,212,255,0.04)',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: 12, padding: 20,
        }}
      >
        <div style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: 10, color: '#00D4FF',
          letterSpacing: '0.3em', marginBottom: 14,
        }}>
          ◈ ALSO FLUENT IN
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            'Figma', 'GraphQL', 'React Native', 'Prisma', 'Socket.io',
            'Swagger', 'ESLint', 'Vitest', 'Webpack', 'CI/CD',
            'Agile', 'Scrum', 'Git Flow', 'TDD', 'Clean Architecture',
          ].map((skill) => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.08, y: -2 }}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 9, letterSpacing: '0.15em',
                padding: '5px 12px',
                background: 'rgba(0,212,255,0.06)',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: 20,
                color: 'rgba(240,244,255,0.6)',
                cursor: 'none',
              }}
            >
              {skill}
            </motion.span>
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
      style={{
        background: 'rgba(2,2,21,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8, padding: '12px 14px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${skill.level}%` }}
        transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          background: `linear-gradient(90deg, ${skill.color}12, transparent)`,
          borderRadius: 8,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: skill.color,
            boxShadow: `0 0 6px ${skill.color}`,
          }} />
          <span style={{
            fontFamily: 'Exo 2, sans-serif',
            fontSize: 13, fontWeight: 600,
            color: '#F0F4FF',
          }}>
            {skill.name}
          </span>
        </div>
        <span style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: 10, color: skill.color,
          letterSpacing: '0.1em',
        }}>
          {skill.level}%
        </span>
      </div>

      <div style={{
        height: 3, background: 'rgba(255,255,255,0.06)',
        borderRadius: 2, overflow: 'hidden', position: 'relative',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ delay: delay + 0.3, duration: 1.2, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
            borderRadius: 2,
            boxShadow: `0 0 6px ${skill.color}`,
          }}
        />
      </div>
    </motion.div>
  )
}
