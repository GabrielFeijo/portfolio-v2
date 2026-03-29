import { motion } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'

export function AboutPanel() {
  const { setCursorVariant } = useSpaceStore()

  const stats = [
    { label: 'YEARS EXP', value: '3+', color: '#00D4FF' },
    { label: 'PROJECTS', value: '50+', color: '#00FF88' },
    { label: 'CLIENTS', value: '30+', color: '#FFB800' },
    { label: 'COMMITS', value: '2K+', color: '#FF1493' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
    >
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex', gap: 32, alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: -8,
              borderRadius: '50%',
              border: '1px dashed rgba(0,212,255,0.4)',
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: -16,
              borderRadius: '50%',
              border: '1px solid rgba(0,212,255,0.15)',
            }}
          />
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E40AF, #6B21E8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 52,
            border: '2px solid rgba(0,212,255,0.3)',
            boxShadow: '0 0 30px rgba(0,212,255,0.3)',
          }}>
            👨‍💻
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <motion.h1
            variants={itemVariants}
            style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(20px, 3vw, 30px)',
              fontWeight: 900,
              color: '#F0F4FF',
              letterSpacing: '0.1em',
              marginBottom: 8,
              background: 'linear-gradient(135deg, #00D4FF, #6B21E8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {DEVELOPER.name}
          </motion.h1>

          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 12, color: '#00D4FF',
            letterSpacing: '0.3em', marginBottom: 16,
          }}>
            {DEVELOPER.title.toUpperCase()} · {DEVELOPER.location.toUpperCase()}
          </div>

          <p style={{
            fontFamily: 'Exo 2, sans-serif',
            fontSize: 14, lineHeight: 1.8,
            color: 'rgba(240,244,255,0.7)',
            maxWidth: 480,
          }}>
            {DEVELOPER.bio}
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05, y: -4 }}
            style={{
              background: `rgba(${hexRgb(stat.color)}, 0.08)`,
              border: `1px solid ${stat.color}30`,
              borderRadius: 12,
              padding: '20px 16px',
              textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
            }} />
            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 28, fontWeight: 900,
              color: stat.color,
              textShadow: `0 0 20px ${stat.color}60`,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 9, letterSpacing: '0.25em',
              color: 'rgba(240,244,255,0.4)',
              marginTop: 6,
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          background: 'rgba(0,212,255,0.04)',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: 12, padding: 24,
          position: 'relative',
        }}
      >
        <div style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: 11, color: '#00D4FF',
          letterSpacing: '0.3em', marginBottom: 16,
        }}>
          ◈ MISSION BRIEF
        </div>

        <p style={{
          fontFamily: 'Exo 2, sans-serif',
          fontSize: 14, lineHeight: 2,
          color: 'rgba(240,244,255,0.7)',
        }}>
          I'm a passionate <span style={{ color: '#00FF88' }}>Full Stack Developer</span> from{' '}
          <span style={{ color: '#00D4FF' }}>Recife, Brazil</span>, dedicated to building
          scalable, performant web applications. My journey spans from crafting pixel-perfect
          frontends to architecting robust backend systems.
        </p>

        <p style={{
          fontFamily: 'Exo 2, sans-serif',
          fontSize: 14, lineHeight: 2,
          color: 'rgba(240,244,255,0.7)',
          marginTop: 12,
        }}>
          I believe in <span style={{ color: '#FFB800' }}>clean code</span>,{' '}
          <span style={{ color: '#FF1493' }}>thoughtful UX</span>, and{' '}
          <span style={{ color: '#00FF88' }}>continuous learning</span>. When I'm not coding,
          I contribute to open source, write tech articles, and explore new technologies that push
          the boundaries of what's possible on the web.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          textAlign: 'center',
          fontFamily: 'Orbitron, monospace',
          fontSize: 13,
          color: 'rgba(0,212,255,0.5)',
          letterSpacing: '0.2em',
          fontStyle: 'italic',
          padding: '0 20px',
        }}
      >
        "{DEVELOPER.tagline}"
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {[
          { label: '⬡ GITHUB', href: DEVELOPER.github, color: '#F0F4FF' },
          { label: '◈ LINKEDIN', href: DEVELOPER.linkedin, color: '#0A66C2' },
          { label: '✉ EMAIL', href: `mailto:${DEVELOPER.email}`, color: '#00FF88' },
          { label: '⊙ WEBSITE', href: DEVELOPER.website, color: '#00D4FF' },
        ].map(link => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            style={{
              background: 'rgba(2,2,21,0.8)',
              border: `1px solid ${link.color}40`,
              color: link.color,
              fontFamily: 'Space Mono, monospace',
              fontSize: 10, letterSpacing: '0.25em',
              padding: '10px 20px', borderRadius: 6,
              textDecoration: 'none', cursor: 'none',
              boxShadow: `0 0 12px ${link.color}20`,
            }}
          >
            {link.label}
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  )
}

function hexRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
