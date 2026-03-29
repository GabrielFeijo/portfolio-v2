import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Flame, Code2, ExternalLink } from 'lucide-react'

function hexRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export function ProjectsPanel() {
  const { setCursorVariant } = useSpaceStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))]
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter)
  const selectedProject = PROJECTS.find(p => p.id === selected)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div>
        <div className="font-display text-[11px] text-[#FFB800] tracking-[0.3em] mb-3 flex items-center gap-2">
          <Flame size={14} /> PROJECT FORGE — {PROJECTS.length} MISSIONS COMPLETED
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className="font-mono-space text-[9px] tracking-[0.2em] px-3.5 py-1.5 rounded cursor-none
                         transition-all duration-200"
              style={{
                background: filter === cat ? 'rgba(255,184,0,0.2)' : 'rgba(2,2,21,0.6)',
                border: `1px solid ${filter === cat ? '#FFB800' : 'rgba(255,255,255,0.1)'}`,
                color: filter === cat ? '#FFB800' : 'rgba(240,244,255,0.5)',
              }}
            >{cat.toUpperCase()}</motion.button>
          ))}
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {filtered.map((project, i) => {
          const isSelected = selected === project.id
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelected(isSelected ? null : project.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className={`relative overflow-hidden rounded-xl p-4.5 cursor-none transition-colors duration-300 ${isSelected ? 'glass-strong' : 'glass'}`}
              style={{
                border: `1px solid ${isSelected ? project.color : 'rgba(255,255,255,0.08)'}`,
                padding: '18px',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, ${project.color}, transparent)`, opacity: isSelected ? 1 : 0.3 }}
              />

              {project.featured && (
                <div className="absolute top-2.5 right-2.5 font-mono-space text-[7px] tracking-[0.2em]
                                text-[#FFB800] border border-[#FFB80060] px-1.5 py-0.5 rounded-sm">
                  FEATURED
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: project.color, boxShadow: `0 0 8px ${project.color}` }} />
                <span className="font-display text-[10px] font-bold text-[#F0F4FF] tracking-[0.1em]">{project.name}</span>
              </div>

              <p className="font-body-exo text-[12px] leading-snug text-[rgba(240,244,255,0.55)] mb-3 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {project.tech.slice(0, 4).map(t => (
                  <span key={t} className="font-mono-space text-[8px] tracking-[0.1em]
                                           text-[rgba(0,212,255,0.7)] border border-[rgba(0,212,255,0.2)]
                                           px-1.5 py-0.5 rounded-sm">
                    {t}
                  </span>
                ))}
                {project.tech.length > 4 && (
                  <span className="font-mono-space text-[8px] text-[rgba(240,244,255,0.3)] px-1">
                    +{project.tech.length - 4}
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-xl p-6 glass-strong"
            style={{
              border: `1px solid ${selectedProject.color}30`,
            }}
          >
            <div className="font-display text-[14px] font-bold tracking-[0.15em] mb-3"
              style={{ color: selectedProject.color }}>
              {selectedProject.name}
              <span className="font-mono-space text-[9px] text-[rgba(240,244,255,0.4)] ml-4 tracking-[0.2em]">
                {selectedProject.year} · {selectedProject.category.toUpperCase()}
              </span>
            </div>

            <p className="font-body-exo text-[13px] leading-relaxed text-[rgba(240,244,255,0.7)] mb-4">
              {selectedProject.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {selectedProject.tech.map(t => (
                <span key={t} className="font-mono-space text-[9px] tracking-[0.15em] px-2.5 py-1 rounded"
                  style={{ color: selectedProject.color, border: `1px solid ${selectedProject.color}40` }}>
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              {selectedProject.github !== '#' && (
                <a href={selectedProject.github} target="_blank" rel="noopener noreferrer"
                  onMouseEnter={() => setCursorVariant('link')} onMouseLeave={() => setCursorVariant('default')}
                  className="flex items-center gap-2 font-mono-space text-[10px] tracking-[0.2em] text-[#F0F4FF] cursor-none no-underline
                             border border-[rgba(240,244,255,0.2)] px-4 py-2 rounded hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                  <Code2 size={12} /> GITHUB
                </a>
              )}
              {selectedProject.live !== '#' && (
                <a href={selectedProject.live} target="_blank" rel="noopener noreferrer"
                  onMouseEnter={() => setCursorVariant('link')} onMouseLeave={() => setCursorVariant('default')}
                  className="flex items-center gap-2 font-mono-space text-[10px] tracking-[0.2em] cursor-none no-underline
                             px-4 py-2 rounded transition-colors"
                  style={{ color: selectedProject.color, border: `1px solid ${selectedProject.color}50` }}>
                  <ExternalLink size={12} /> LIVE DEMO
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
