import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'

export function ProjectsPanel() {
  const { setCursorVariant } = useSpaceStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))]

  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter)
  const selectedProject = PROJECTS.find(p => p.id === selected)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      <div>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 11, color: '#FFB800',
          letterSpacing: '0.3em', marginBottom: 8,
        }}>
          ◈ PROJECT FORGE — {PROJECTS.length} MISSIONS COMPLETED
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              style={{
                background: filter === cat ? 'rgba(255,184,0,0.2)' : 'rgba(2,2,21,0.6)',
                border: `1px solid ${filter === cat ? '#FFB800' : 'rgba(255,255,255,0.1)'}`,
                color: filter === cat ? '#FFB800' : 'rgba(240,244,255,0.5)',
                fontFamily: 'Space Mono, monospace',
                fontSize: 9, letterSpacing: '0.2em',
                padding: '6px 14px', borderRadius: 4,
                cursor: 'none',
                transition: 'all 0.2s',
              }}
            >
              {cat.toUpperCase()}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 14,
      }}>
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            onClick={() => setSelected(selected === project.id ? null : project.id)}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            style={{
              background: selected === project.id
                ? `rgba(${hexRgb(project.color)}, 0.12)`
                : 'rgba(2,2,21,0.7)',
              border: `1px solid ${selected === project.id ? project.color : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12, padding: 18,
              cursor: 'none', position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.3s',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${project.color}, transparent)`,
              opacity: selected === project.id ? 1 : 0.3,
            }} />

            {project.featured && (
              <div style={{
                position: 'absolute', top: 10, right: 10,
                fontFamily: 'Space Mono, monospace',
                fontSize: 7, letterSpacing: '0.2em',
                color: '#FFB800', border: '1px solid #FFB80060',
                padding: '2px 6px', borderRadius: 2,
              }}>
                FEATURED
              </div>
            )}

            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 10,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: project.color,
                boxShadow: `0 0 8px ${project.color}`,
              }} />
              <span style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 10, fontWeight: 700,
                color: '#F0F4FF', letterSpacing: '0.1em',
              }}>
                {project.name}
              </span>
            </div>

            <p style={{
              fontFamily: 'Exo 2, sans-serif',
              fontSize: 12, lineHeight: 1.6,
              color: 'rgba(240,244,255,0.55)',
              marginBottom: 12,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {project.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {project.tech.slice(0, 4).map(t => (
                <span key={t} style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 8, letterSpacing: '0.1em',
                  color: 'rgba(0,212,255,0.7)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  padding: '2px 7px', borderRadius: 2,
                }}>
                  {t}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 8, color: 'rgba(240,244,255,0.3)',
                  padding: '2px 4px',
                }}>
                  +{project.tech.length - 4}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              background: `rgba(${hexRgb(selectedProject.color)}, 0.06)`,
              border: `1px solid ${selectedProject.color}30`,
              borderRadius: 12, padding: 24,
            }}
          >
            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 14, fontWeight: 700,
              color: selectedProject.color,
              marginBottom: 12, letterSpacing: '0.15em',
            }}>
              {selectedProject.name}
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 9, color: 'rgba(240,244,255,0.4)',
                marginLeft: 16, letterSpacing: '0.2em',
              }}>
                {selectedProject.year} · {selectedProject.category.toUpperCase()}
              </span>
            </div>

            <p style={{
              fontFamily: 'Exo 2, sans-serif',
              fontSize: 13, lineHeight: 1.8,
              color: 'rgba(240,244,255,0.7)',
              marginBottom: 16,
            }}>
              {selectedProject.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {selectedProject.tech.map(t => (
                <span key={t} style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 9, letterSpacing: '0.15em',
                  color: selectedProject.color,
                  border: `1px solid ${selectedProject.color}40`,
                  padding: '4px 10px', borderRadius: 4,
                }}>
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {selectedProject.github !== '#' && (
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursorVariant('link')}
                  onMouseLeave={() => setCursorVariant('default')}
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 10, letterSpacing: '0.2em',
                    color: '#F0F4FF',
                    border: '1px solid rgba(240,244,255,0.2)',
                    padding: '8px 16px', borderRadius: 6,
                    textDecoration: 'none', cursor: 'none',
                  }}
                >
                  ⬡ GITHUB
                </a>
              )}
              {selectedProject.live !== '#' && (
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursorVariant('link')}
                  onMouseLeave={() => setCursorVariant('default')}
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 10, letterSpacing: '0.2em',
                    color: selectedProject.color,
                    border: `1px solid ${selectedProject.color}50`,
                    padding: '8px 16px', borderRadius: 6,
                    textDecoration: 'none', cursor: 'none',
                  }}
                >
                  ◈ LIVE DEMO
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function hexRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
