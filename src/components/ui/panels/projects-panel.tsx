import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { ExternalLink, Code, Layers3 } from 'lucide-react'

export function ProjectsPanel() {
  const { setCursorVariant } = useSpaceStore()
  const [selected, setSelected] = useState<string | null>(PROJECTS[0]?.id ?? null)
  const [filter, setFilter] = useState<string>('Todos')

  const categories = ['Todos', ...Array.from(new Set(PROJECTS.map((p) => p.category)))]
  const filtered = filter === 'Todos' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <section className="panel-card-strong p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center panel-icon-chip">
            <Layers3 size={18} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">Cases selecionados</div>
            <h2 className="text-2xl font-semibold text-(--text-primary)">Projetos e produtos</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-(--text-secondary) leading-7 max-w-2xl">
          Uma seleção de projetos autorais, produtos entregues e experimentos que ajudam a contar minha trajetória com mais profundidade.
        </p>

        <div className="mt-5 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(cat)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium cursor-none transition-all duration-200 border"
              style={{
                background: filter === cat ? 'linear-gradient(180deg, var(--panel-accent), var(--panel-glow))' : 'rgba(255,255,255,0.03)',
                borderColor: filter === cat ? 'var(--panel-border-strong)' : 'var(--panel-border)',
                color: filter === cat ? 'white' : 'var(--text-secondary)',
                boxShadow: filter === cat ? '0 16px 32px color-mix(in srgb, var(--panel-glow) 26%, transparent)' : 'none',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </section>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filtered.map((project, i) => {
          const isSelected = selected === project.id
          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(isSelected ? null : project.id)}
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className={`relative overflow-hidden rounded-3xl p-5 cursor-none transition-all duration-200 ${isSelected ? 'panel-card-strong' : 'panel-card'}`}
              style={{
                boxShadow: isSelected ? `0 24px 60px rgba(0,0,0,0.28), 0 0 0 1px ${project.color}22 inset, 0 0 40px ${project.color}12` : undefined,
              }}
            >
              <div className="absolute inset-x-0 top-0 h-24 opacity-60 pointer-events-none" style={{ background: `linear-gradient(180deg, ${project.color}22, transparent)` }} />

              {project.featured && (
                <div className="absolute top-4 right-4 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] text-(--text-primary)">
                  Destaque
                </div>
              )}

              {project.image && (
                <div className="mb-4 overflow-hidden rounded-[18px] border border-(--border)">
                  <img src={project.image} alt={project.name} className="w-full h-44 object-cover transition-transform duration-500 hover:scale-[1.03]" />
                </div>
              )}

              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-(--text-primary)">{project.name}</h3>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] panel-eyebrow font-mono-space">
                    {project.year} • {project.category}
                  </div>
                </div>
              </div>

              <p className="text-sm text-(--text-secondary) leading-7 mb-4 line-clamp-4">{project.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1.5 rounded-full panel-meta-chip"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 5 && <span className="text-xs px-2 py-1.5 text-(--text-muted)">+{project.tech.length - 5}</span>}
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="pt-4"
                    style={{ borderTop: '1px solid var(--panel-border)' }}
                  >
                    {project.highlights && project.highlights.length > 0 && (
                      <div className="mb-4 rounded-[18px] panel-card p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] panel-eyebrow font-mono-space mb-3">
                          Destaques do projeto
                        </div>
                        <div className="flex flex-col gap-2">
                          {project.highlights.map((highlight) => (
                            <div key={highlight} className="text-xs text-(--text-secondary) leading-6">
                              • {highlight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <ProjectLink href={project.live} label="Abrir projeto" icon={ExternalLink} primary setCursorVariant={setCursorVariant} />
                      <ProjectLink href={project.github} label="Ver código" icon={Code} setCursorVariant={setCursorVariant} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </div>
    </motion.div>
  )
}

function ProjectLink({
  href,
  label,
  icon: Icon,
  primary = false,
  setCursorVariant,
}: {
  href: string
  label: string
  icon: typeof ExternalLink
  primary?: boolean
  setCursorVariant: (variant: 'default' | 'planet' | 'link' | 'drag') => void
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      onMouseEnter={() => setCursorVariant('link')}
      onMouseLeave={() => setCursorVariant('default')}
      className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-3 rounded-2xl text-xs font-medium cursor-none transition-colors ${primary
          ? 'panel-cta'
          : 'panel-cta-secondary hover:bg-[rgba(255,255,255,0.04)]'
        }`}
    >
      <Icon size={14} />
      {label}
    </motion.a>
  )
}
