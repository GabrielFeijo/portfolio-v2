import type { Project } from '@/data/portfolio';
import { getTranslatedArray } from '@/utils/i18n';
import type { CursorVariant } from '@/types/store';
import { AnimatePresence, motion } from 'framer-motion';
import { Code, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PanelBulletList, PanelInsetCard, PanelTagList } from '../panel-content-primitives';
import { createCursorHandlers } from '../panel-primitives';
import { ProjectLink } from './project-link';

interface ProjectCardProps {
  isSelected: boolean;
  onToggle: () => void;
  project: Project;
  setCursorVariant: (variant: CursorVariant) => void;
  transition: { delay: number };
}

export function ProjectCard({
  isSelected,
  onToggle,
  project,
  setCursorVariant,
  transition,
}: ProjectCardProps) {
  const { t } = useTranslation();
  const categoryLabel = t(`projects.filters.${project.category}`);
  const projectName = t(`projects_items.${project.id}.name`);
  const projectDescription = t(`projects_items.${project.id}.description`);
  const highlights = getTranslatedArray<string>(t, `projects_items.${project.id}.highlights`);

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
      whileHover={{ y: -4 }}
      onClick={onToggle}
      {...createCursorHandlers(setCursorVariant)}
      className={`relative overflow-hidden p-5 cursor-none transition-all duration-200 ${isSelected ? 'panel-card-strong' : 'panel-card'}`}
    >
      {project.featured && (
        <div className="absolute top-4 right-4 panel-planet-badge px-2.5 py-1 text-label font-semibold text-(--text-primary) ">
          {t('common.featured')}
        </div>
      )}

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-(--text-primary)">{projectName}</h3>
          <div className="mt-1 font-mono-space text-label uppercase tracking-caps panel-eyebrow">
            {project.year} • {categoryLabel}
          </div>
        </div>
      </div>

      <p className="mb-4 line-clamp-4 text-sm leading-7 text-(--text-secondary)">
        {projectDescription}
      </p>

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
            {highlights.length > 0 && (
              <PanelInsetCard className="mb-4">
                <div className="mb-3 font-mono-space text-label uppercase tracking-caps-lg panel-eyebrow">
                  {t('common.highlights')}
                </div>
                <PanelBulletList items={highlights} />
              </PanelInsetCard>
            )}

            <div className="flex gap-2">
              {project.live && (
                <ProjectLink
                  href={project.live}
                  icon={ExternalLink}
                  label={t('common.open_project')}
                  primary
                  setCursorVariant={setCursorVariant}
                />
              )}

              {project.github && (
                <ProjectLink
                  href={project.github}
                  icon={Code}
                  label={t('common.view_code')}
                  setCursorVariant={setCursorVariant}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
