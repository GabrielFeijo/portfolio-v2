import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPERIENCE } from '@/data/portfolio'

export function ExperiencePanel() {
  const [expanded, setExpanded] = useState<string | null>(EXPERIENCE[0].id)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      <div>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 11, color: '#FF4500',
          letterSpacing: '0.3em', marginBottom: 8,
        }}>
          ◈ CHRONOS RECORD — PROFESSIONAL TIMELINE
        </div>
        <p style={{
          fontFamily: 'Exo 2, sans-serif',
          fontSize: 13, color: 'rgba(240,244,255,0.5)',
          lineHeight: 1.7,
        }}>
          A chronicle of professional missions and conquered frontiers.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 20, top: 0, bottom: 0,
          width: 1,
          background: 'linear-gradient(to bottom, #FF4500, #FF450030)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              style={{ paddingLeft: 52, position: 'relative' }}
            >
              <div style={{
                position: 'absolute', left: 12, top: 20,
                width: 17, height: 17, borderRadius: '50%',
                background: expanded === exp.id ? exp.color : 'rgba(2,2,21,0.9)',
                border: `2px solid ${exp.color}`,
                boxShadow: expanded === exp.id ? `0 0 12px ${exp.color}` : 'none',
                transition: 'all 0.3s',
                zIndex: 1,
              }} />

              <div style={{
                position: 'absolute', left: -40, top: 17,
                fontFamily: 'Space Mono, monospace',
                fontSize: 7, color: 'rgba(240,244,255,0.25)',
                letterSpacing: '0.1em', width: 50, textAlign: 'right',
              }}>
                {exp.period.split('—')[0].trim()}
              </div>

              <motion.div
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                whileHover={{ x: 4 }}
                style={{
                  background: expanded === exp.id
                    ? `rgba(${hexRgb(exp.color)}, 0.08)`
                    : 'rgba(2,2,21,0.7)',
                  border: `1px solid ${expanded === exp.id ? exp.color + '40' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 12, padding: '18px 20px',
                  cursor: 'none', transition: 'all 0.3s',
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: 12,
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'Orbitron, monospace',
                      fontSize: 13, fontWeight: 700,
                      color: '#F0F4FF', letterSpacing: '0.1em',
                      marginBottom: 4,
                    }}>
                      {exp.role}
                    </div>
                    <div style={{
                      display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
                    }}>
                      <span style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: 10, color: exp.color, letterSpacing: '0.15em',
                      }}>
                        {exp.company}
                      </span>
                      <span style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: 8, color: 'rgba(240,244,255,0.3)',
                      }}>
                        {exp.period}
                      </span>
                      <span style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: 7, color: exp.color,
                        border: `1px solid ${exp.color}40`,
                        padding: '2px 8px', borderRadius: 2,
                        letterSpacing: '0.2em',
                      }}>
                        {exp.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: expanded === exp.id ? 90 : 0 }}
                    style={{ color: exp.color, fontSize: 12, flexShrink: 0 }}
                  >
                    ▶
                  </motion.div>
                </div>

                <AnimatePresence>
                  {expanded === exp.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        fontFamily: 'Exo 2, sans-serif',
                        fontSize: 13, lineHeight: 1.8,
                        color: 'rgba(240,244,255,0.65)',
                        marginTop: 16, marginBottom: 16,
                      }}>
                        {exp.description}
                      </p>

                      <div style={{
                        background: 'rgba(0,0,8,0.5)',
                        borderRadius: 8, padding: '14px 16px',
                        marginBottom: 14,
                      }}>
                        <div style={{
                          fontFamily: 'Space Mono, monospace',
                          fontSize: 9, color: '#00FF88',
                          letterSpacing: '0.25em', marginBottom: 10,
                        }}>
                          KEY ACHIEVEMENTS
                        </div>
                        {exp.achievements.map((ach, ai) => (
                          <div key={ai} style={{
                            display: 'flex', gap: 10, marginBottom: 8,
                          }}>
                            <span style={{ color: exp.color, fontSize: 12, flexShrink: 0 }}>▸</span>
                            <span style={{
                              fontFamily: 'Exo 2, sans-serif',
                              fontSize: 12, color: 'rgba(240,244,255,0.6)',
                              lineHeight: 1.5,
                            }}>
                              {ach}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {exp.tech.map(t => (
                          <span key={t} style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: 8, letterSpacing: '0.15em',
                            color: 'rgba(0,212,255,0.7)',
                            border: '1px solid rgba(0,212,255,0.2)',
                            padding: '3px 9px', borderRadius: 3,
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
