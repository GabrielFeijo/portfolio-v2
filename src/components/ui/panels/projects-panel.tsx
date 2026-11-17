import { PROJECTS, type ProjectCategory } from '@/data/portfolio';
import { useSpaceStore } from '@/store/space-store';
import { m } from 'framer-motion';
import { Layers3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PanelIntroCard, createCursorHandlers } from './panel-primitives';
import { ProjectCard } from './projects/project-card';

const ALL_PROJECTS_FILTER = 'all' as const;
type ProjectFilter = ProjectCategory | typeof ALL_PROJECTS_FILTER;

export function ProjectsPanel() {
  const setCursorVariant = useSpaceStore((state) => state.setCursorVariant);
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(PROJECTS[0]?.id ?? null);
  const [filter, setFilter] = useState<ProjectFilter>(ALL_PROJECTS_FILTER);
  const linkCursor = useMemo(() => createCursorHandlers(setCursorVariant), [setCursorVariant]);

  const categories: ProjectFilter[] = useMemo(
    () => [
      ALL_PROJECTS_FILTER,
      ...Array.from(new Set(PROJECTS.map((project) => project.category))),
    ],
    []
  );
  const filtered = useMemo(() => {
    const matching =
      filter === ALL_PROJECTS_FILTER
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === filter);
    return [...matching].sort((a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year);
  }, [filter]);
  const getFilterLabel = (value: ProjectFilter) => {
    if (value === ALL_PROJECTS_FILTER) return t('projects.filters.all');
    return t(`projects.filters.${value}`);
  };

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={Layers3}
        eyebrow={t('planets.projects.subtitle')}
        title={t('planets.projects.name')}
        description={t('planets.projects.description')}
      >
        <div className="mt-5 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <m.button
              key={cat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(cat)}
              {...linkCursor}
              className="px-3.5 py-1.5 text-xs font-medium cursor-none transition-all duration-200 border"
              style={{
                background:
                  filter === cat
                    ? 'linear-gradient(180deg, var(--panel-accent), var(--panel-glow))'
                    : 'var(--surface-interactive)',
                borderColor: filter === cat ? 'var(--panel-border-strong)' : 'var(--panel-border)',
                color: filter === cat ? 'var(--color-white)' : 'var(--text-secondary)',
                boxShadow:
                  filter === cat
                    ? '0 16px 32px color-mix(in srgb, var(--panel-glow) 26%, transparent)'
                    : 'none',
              }}
            >
              {getFilterLabel(cat)}
            </m.button>
          ))}
        </div>
      </PanelIntroCard>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
      >
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
          );
        })}
      </div>
    </m.div>
  );
}
