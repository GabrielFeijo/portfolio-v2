import { EXPERIENCE } from '@/data/portfolio';
import { motion } from 'framer-motion';
import { BriefcaseBusiness } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExperienceItem } from './experience/experience-item';
import { PanelIntroCard } from './panel-primitives';

export function ExperiencePanel() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(EXPERIENCE[0].id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={BriefcaseBusiness}
        eyebrow={t('planets.experience.subtitle')}
        title={t('planets.experience.name')}
        description={t('planets.experience.description')}
      />

      <div className="relative">
        <div
          className="absolute left-4 sm:left-6 top-0 bottom-0 w-px"
          style={{
            background:
              'linear-gradient(180deg, var(--panel-border-strong), var(--surface-interactive-hover))',
          }}
        />

        <div className="flex flex-col gap-4">
          {EXPERIENCE.map((exp, i) => {
            return (
              <ExperienceItem
                key={exp.id}
                experience={exp}
                isOpen={expanded === exp.id}
                onToggle={() => setExpanded(expanded === exp.id ? null : exp.id)}
                transition={{ delay: i * 0.08 }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
