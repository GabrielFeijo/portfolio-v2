import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { ExternalLink, Code } from 'lucide-react'

export function ProjectsPanel() {
  const { setCursorVariant } = useSpaceStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))]
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter)
  const selectedProject = PROJECTS.find(p => p.id === selected)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
          Projects & Work
        </h2>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(cat)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium cursor-none
                         transition-all duration-200 border"
              style={{
                background: filter === cat ? 'var(--accent-blue)' : 'var(--surface)',
                borderColor: filter === cat ? 'var(--accent-blue)' : 'var(--border)',
                color: filter === cat ? 'white' : 'var(--text-secondary)',
              }}
            >{cat}</motion.button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filtered.map((project, i) => {
          const isSelected = selected === project.id
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(isSelected ? null : project.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className={`relative overflow-hidden rounded-lg p-5 cursor-none transition-all duration-200 border
                         ${isSelected ? 'glass-strong' : 'glass'}`}
              style={{
                borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border)',
              }}
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded
                               bg-[var(--accent-blue)] text-white">
                  Featured
                </div>
              )}

              {/* Title & Year */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                  {project.name}
                </h3>
                <div className="text-xs text-[var(--text-muted)]">
                  {project.year} • {project.category}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.slice(0, 3).map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded
                                          bg-[var(--surface)] text-[var(--text-secondary)]
                                          border border-[var(--border)]">
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="text-xs px-2 py-1 text-[var(--text-muted)]">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>

              {/* Links */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex gap-2 pt-4 border-t border-[var(--border)]"
                  >
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md
                                 text-xs font-medium bg-[var(--accent-blue)] text-white cursor-none
                                 transition-colors hover:bg-[#0969DA]"
                    >
                      <ExternalLink size={14} />
                      Live
                    </motion.a>
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md
                                 text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] cursor-none
                                 transition-colors hover:bg-[var(--surface)]"
                    >
                      <Code size={14} />
                      Code
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

    </motion.div>
  )
}
