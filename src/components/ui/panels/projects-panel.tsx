import { useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS, type ProjectCategory } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Layers3 } from 'lucide-react'
import { PanelIntroCard, createCursorHandlers } from './panel-primitives'
import { ProjectCard } from './projects/project-card'

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
