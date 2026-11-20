import type { Experience } from '@/data/portfolio';
import { m } from 'framer-motion';
import { Building2, Calendar, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../panel-primitives';
import { ExperienceRoleDetails } from './experience-role-details';
import { ExperienceTimelineNode } from './experience-timeline-node';
import {
  TIMELINE_TRACK_STYLE,
  getExperienceCardClassName,
  getExperienceCardStyle,
  getTimelineDotStyle,
} from './experience-timeline-styles';
import { type ExperienceGroup, formatCompanyPeriod } from './group-experiences';

interface ExperienceGroupRoleProps {
  experience: Experience;
  isOpen: boolean;
  isLast: boolean;
  onToggle: (id: string) => void;
}

function ExperienceGroupRole({ experience, isOpen, isLast, onToggle }: ExperienceGroupRoleProps) {
  const { t } = useTranslation();

  return (
    <div className={cn('relative pl-6 sm:pl-7', !isLast && 'pb-5')}>
      {!isLast && (
        <div
          aria-hidden="true"
          className="absolute left-1.25 top-5.5 -bottom-1 w-px -translate-x-1/2"
          style={TIMELINE_TRACK_STYLE}
        />
      )}

      <div
        aria-hidden="true"
        className="absolute left-0 top-2 z-10 h-2.5 w-2.5 rounded-full border-2 transition-all duration-300"
        style={getTimelineDotStyle(isOpen, 14)}
      />

      <button
        type="button"
        onClick={() => onToggle(experience.id)}
        aria-expanded={isOpen}
        className="flex w-full cursor-none items-start justify-between gap-4 text-left transition-transform duration-200 hover:translate-x-0.5"
      >
        <span className="flex-1">
          <span className="block text-sm font-semibold text-(--text-primary) sm:text-base">
            {t(`experience_items.${experience.id}.role`)}
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-xs text-(--text-muted)">
            <Calendar size={13} />
            <span>{t(`experience_items.${experience.id}.period`)}</span>
          </span>
        </span>

        <m.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          className="mt-0.5 shrink-0 panel-highlight-text"
        >
          <ChevronRight size={17} />
        </m.span>
      </button>

      <ExperienceRoleDetails experience={experience} isOpen={isOpen} />
    </div>
  );
}

interface ExperienceCompanyGroupProps {
  group: ExperienceGroup;
  expandedId: string | null;
  onToggle: (id: string) => void;
  transition: { delay: number };
}

export function ExperienceCompanyGroup({
  group,
  expandedId,
  onToggle,
  transition,
}: ExperienceCompanyGroupProps) {
  const { t } = useTranslation();
  const hasOpenRole = group.items.some((item) => item.id === expandedId);
  const companyPeriod = formatCompanyPeriod(
    group.items.map((item) => t(`experience_items.${item.id}.period`))
  );

  return (
    <ExperienceTimelineNode isActive={hasOpenRole} transition={transition}>
      <section
        aria-label={group.company}
        className={cn(
          'px-5 py-5 transition-all duration-200 sm:px-6 sm:py-6',
          getExperienceCardClassName(hasOpenRole)
        )}
        style={getExperienceCardStyle(hasOpenRole)}
      >
        <header className="mb-5 border-b border-(--border) pb-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 font-mono-space text-label uppercase tracking-caps panel-eyebrow">
            <span>{t(`experience.types.${group.type}`)}</span>
            <span aria-hidden="true" className="text-(--text-muted)">
              ·
            </span>
            <span className="text-(--text-muted)">
              {t('experience.positions', { count: group.items.length })}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-semibold text-(--text-primary) sm:text-lg">
              <Building2 size={16} className="shrink-0 panel-highlight-text" />
              <span>{group.company}</span>
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-(--text-muted)">
              <Calendar size={14} />
              <span>{companyPeriod}</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col">
          {group.items.map((experience, index) => (
            <ExperienceGroupRole
              key={experience.id}
              experience={experience}
              isOpen={expandedId === experience.id}
              isLast={index === group.items.length - 1}
              onToggle={onToggle}
            />
          ))}
        </div>
      </section>
    </ExperienceTimelineNode>
  );
}
