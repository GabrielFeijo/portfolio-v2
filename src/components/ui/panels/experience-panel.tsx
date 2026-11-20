import { EXPERIENCE } from '@/data/portfolio';
import { m } from 'framer-motion';
import { BriefcaseBusiness } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExperienceCompanyGroup } from './experience/experience-company-group';
import { ExperienceItem } from './experience/experience-item';
import { TIMELINE_TRACK_STYLE } from './experience/experience-timeline-styles';
import { groupExperiencesByCompany } from './experience/group-experiences';
import { PanelIntroCard } from './panel-primitives';

export function ExperiencePanel() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(EXPERIENCE[0].id);
  const experienceGroups = useMemo(() => groupExperiencesByCompany(EXPERIENCE), []);

  const toggleExperience = (id: string) => {
    setExpanded((current) => (current === id ? null : id));
  };

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={BriefcaseBusiness}
        eyebrow={t('planets.experience.subtitle')}
        title={t('planets.experience.name')}
        description={t('planets.experience.description')}
      />

      <div className="relative">
        <div
          className="absolute left-4 sm:left-6 top-0 bottom-0 w-px"
          style={TIMELINE_TRACK_STYLE}
        />

        <div className="flex flex-col gap-4">
          {experienceGroups.map((group, index) =>
            group.items.length === 1 ? (
              <ExperienceItem
                key={group.id}
                experience={group.items[0]}
                isOpen={expanded === group.items[0].id}
                onToggle={() => toggleExperience(group.items[0].id)}
                transition={{ delay: index * 0.08 }}
              />
            ) : (
              <ExperienceCompanyGroup
                key={group.id}
                group={group}
                expandedId={expanded}
                onToggle={toggleExperience}
                transition={{ delay: index * 0.08 }}
              />
            )
          )}
        </div>
      </div>
    </m.div>
  );
}
