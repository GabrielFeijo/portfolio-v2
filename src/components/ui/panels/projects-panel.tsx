import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, type Project, type ProjectCategory } from '@/data/portfolio'
import { useSpaceStore, type CursorVariant } from '@/store/space-store'
import { ExternalLink, Code, Layers3 } from 'lucide-react'
import { PanelIntroCard, createCursorHandlers } from './panel-primitives'
import { PanelBulletList, PanelImageFrame, PanelInsetCard, PanelTagList, PanelTopGlow } from './panel-content-primitives'

const ALL_PROJECTS_FILTER = 'Todos' as const
type ProjectFilter = ProjectCategory | typeof ALL_PROJECTS_FILTER

export function ProjectsPanel() {
  const { setCursorVariant } = useSpaceStore()
  const [selected, setSelected] = useState<string | null>(PROJECTS[0]?.id ?? null)
  const [filter, setFilter] = useState<ProjectFilter>(ALL_PROJECTS_FILTER)
  const linkCursor = createCursorHandlers(setCursorVariant)

  const categories: ProjectFilter[] = [ALL_PROJECTS_FILTER, ...Array.from(new Set(PROJECTS.map((project) => project.category)))]
  const filtered = filter === ALL_PROJECTS_FILTER ? PROJECTS : PROJECTS.filter((project) => project.category === filter)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={Layers3}
        eyebrow="Cases selecionados"
        title="Projetos e produtos"
        description="Uma seleção de projetos autorais, produtos entregues e experimentos que ajudam a contar minha trajetória com mais profundidade."
        ringClassName="-right-14 -top-14 h-40 w-40"
        glowClassName="left-10 top-8 h-24 w-24"
      >

        <div className="mt-5 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(cat)}
              {...linkCursor}
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
      </PanelIntroCard>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filtered.map((project, i) => {
          return (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={selected === project.id}
              onToggle={() => setSelected(selected === project.id ? null : project.id)}
              transition={{ delay: i * 0.05 }}
              setCursorVariant={setCursorVariant}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

function ProjectCard({
  project,
  isSelected,
  onToggle,
  transition,
  setCursorVariant,
}: {
  project: Project
  isSelected: boolean
  onToggle: () => void
  transition: { delay: number }
  setCursorVariant: (variant: CursorVariant) => void
}) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
      whileHover={{ y: -4 }}
      onClick={onToggle}
      {...createCursorHandlers(setCursorVariant)}
      className={`relative overflow-hidden rounded-3xl p-5 cursor-none transition-all duration-200 ${isSelected ? 'panel-card-strong' : 'panel-card'}`}
      style={{
        boxShadow: isSelected ? `0 24px 60px rgba(0,0,0,0.28), 0 0 0 1px ${project.color}22 inset, 0 0 40px ${project.color}12` : undefined,
      }}
    >
      <PanelTopGlow color={project.color} className="h-24" />

      {project.featured && (
        <div className="absolute top-4 right-4 rounded-full panel-planet-badge px-2.5 py-1 text-[11px] font-semibold text-(--text-primary)">
          Destaque
        </div>
      )}

      {project.image && <PanelImageFrame src={project.image} alt={project.name} className="mb-4" />}

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-(--text-primary)">{project.name}</h3>
          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] panel-eyebrow font-mono-space">
            {project.year} • {project.category}
          </div>
        </div>
      </div>

      <p className="mb-4 line-clamp-4 text-sm leading-7 text-(--text-secondary)">{project.description}</p>
      <PanelTagList items={project.tech} limit={5} className="mb-4 gap-1.5" />

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
              <PanelInsetCard className="mb-4">
                <div className="mb-3 text-[11px] uppercase tracking-[0.18em] panel-eyebrow font-mono-space">
                  Destaques do projeto
                </div>
                <PanelBulletList items={project.highlights} />
              </PanelInsetCard>
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
  setCursorVariant: (variant: CursorVariant) => void
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      {...createCursorHandlers(setCursorVariant)}
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
