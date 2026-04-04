import { AnimatePresence, motion } from 'framer-motion'
import { Code, ExternalLink } from 'lucide-react'
import type { Project } from '@/data/portfolio'
import type { CursorVariant } from '@/store/space-store'
import { createCursorHandlers } from '../panel-primitives'
import { PanelBulletList, PanelImageFrame, PanelInsetCard, PanelTagList, PanelTopGlow } from '../panel-content-primitives'
import { ProjectLink } from './project-link'

interface ProjectCardProps {
  isSelected: boolean
  onToggle: () => void
  project: Project
  setCursorVariant: (variant: CursorVariant) => void
  transition: { delay: number }
}

export function ProjectCard({
  isSelected,
  onToggle,
  project,
  setCursorVariant,
  transition,
}: ProjectCardProps) {
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
          <div className="mt-1 font-mono-space text-[11px] uppercase tracking-[0.16em] panel-eyebrow">
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
                <div className="mb-3 font-mono-space text-[11px] uppercase tracking-[0.18em] panel-eyebrow">
                  Destaques do projeto
                </div>
                <PanelBulletList items={project.highlights} />
              </PanelInsetCard>
            )}

            <div className="flex gap-2">
              <ProjectLink href={project.live} icon={ExternalLink} label="Abrir projeto" primary setCursorVariant={setCursorVariant} />
              <ProjectLink href={project.github} icon={Code} label="Ver código" setCursorVariant={setCursorVariant} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
