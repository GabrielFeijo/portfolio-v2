import type { Experience } from '@/data/portfolio';
import { m } from 'framer-motion';
import { Building2, Calendar, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../panel-primitives';
import { ExperienceRoleDetails } from './experience-role-details';
import { ExperienceTimelineNode } from './experience-timeline-node';
import { getExperienceCardClassName, getExperienceCardStyle } from './experience-timeline-styles';

interface ExperienceItemProps {
  experience: Experience;
  isOpen: boolean;
  onToggle: () => void;
  transition: { delay: number };
}

export function ExperienceItem({ experience, isOpen, onToggle, transition }: ExperienceItemProps) {
  const { t } = useTranslation();

  return (
    <ExperienceTimelineNode isActive={isOpen} transition={transition}>
      <m.article
        onClick={onToggle}
        whileHover={{ x: 3 }}
        className={cn(
          'cursor-none px-5 py-5 transition-all duration-200 sm:px-6 sm:py-6',
          getExperienceCardClassName(isOpen)
        )}
        style={getExperienceCardStyle(isOpen)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 font-mono-space text-label uppercase tracking-caps panel-eyebrow">
              {t(`experience.types.${experience.type}`)}
            </div>
            <h3 className="text-base font-semibold text-(--text-primary) sm:text-lg">
              {t(`experience_items.${experience.id}.role`)}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-(--text-secondary)">
                <Building2 size={14} />
                {experience.company}
              </div>
              <div className="flex items-center gap-1.5 text-(--text-muted)">
                <Calendar size={14} />
                {t(`experience_items.${experience.id}.period`)}
              </div>
            </div>
          </div>

          <m.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="mt-1 shrink-0 panel-highlight-text"
          >
            <ChevronRight size={18} />
          </m.div>
        </div>

        <ExperienceRoleDetails experience={experience} isOpen={isOpen} />
      </m.article>
    </ExperienceTimelineNode>
  );
}
