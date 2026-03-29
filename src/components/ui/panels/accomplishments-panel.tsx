import { motion } from 'framer-motion'
import { ACCOMPLISHMENTS, CERTIFICATES } from '@/data/portfolio'

export function AccomplishmentsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
    >
      <div>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 11, color: '#A855F7',
          letterSpacing: '0.3em', marginBottom: 8,
        }}>
          ◈ AETHER ARCHIVES — HONORS & MILESTONES
        </div>
        <p style={{
          fontFamily: 'Exo 2, sans-serif',
          fontSize: 13, color: 'rgba(240,244,255,0.5)',
          lineHeight: 1.7,
        }}>
          A constellation of achievements earned across the development universe.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 14,
      }}>
        {ACCOMPLISHMENTS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              background: `rgba(${hexRgb(item.color)}, 0.06)`,
              border: `1px solid ${item.color}25`,
              borderRadius: 14, padding: '20px 16px',
              textAlign: 'center', position: 'relative',
              overflow: 'hidden', cursor: 'none',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)`,
            }} />

            <div style={{
              position: 'absolute', top: 10, right: 10,
              fontFamily: 'Space Mono, monospace',
              fontSize: 6, letterSpacing: '0.15em',
              color: item.color, border: `1px solid ${item.color}40`,
              padding: '2px 5px', borderRadius: 2,
            }}>
              {item.category.toUpperCase()}
            </div>

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 38, marginBottom: 14 }}
            >
              {item.icon}
            </motion.div>

            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 11, fontWeight: 700,
              color: '#F0F4FF', letterSpacing: '0.1em',
              marginBottom: 8, lineHeight: 1.4,
            }}>
              {item.title}
            </div>

            <p style={{
              fontFamily: 'Exo 2, sans-serif',
              fontSize: 11, lineHeight: 1.6,
              color: 'rgba(240,244,255,0.5)',
            }}>
              {item.description}
            </p>

            <div style={{
              position: 'absolute', inset: 0, borderRadius: 14,
              background: `radial-gradient(circle at 50% 50%, ${item.color}08, transparent 70%)`,
            }} />
          </motion.div>
        ))}
      </div>

      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
        }}>
          <div style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: 11, color: '#A855F7', letterSpacing: '0.3em',
          }}>
            ◈ CERTIFICATIONS
          </div>
          <div style={{
            flex: 1, height: 1,
            background: 'linear-gradient(90deg, #A855F730, transparent)',
          }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CERTIFICATES.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.4 }}
              whileHover={{ x: 6 }}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(2,2,21,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderLeft: `3px solid ${cert.color}`,
                borderRadius: '0 8px 8px 0',
                padding: '14px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: cert.color, boxShadow: `0 0 8px ${cert.color}`,
                }} />
                <div>
                  <div style={{
                    fontFamily: 'Exo 2, sans-serif',
                    fontSize: 13, fontWeight: 600,
                    color: '#F0F4FF',
                  }}>
                    {cert.name}
                  </div>
                  <div style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 9, color: 'rgba(240,244,255,0.4)',
                    letterSpacing: '0.1em', marginTop: 3,
                  }}>
                    {cert.issuer}
                  </div>
                </div>
              </div>

              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 12, fontWeight: 700,
                color: cert.color, letterSpacing: '0.1em',
              }}>
                {cert.year}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function hexRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
