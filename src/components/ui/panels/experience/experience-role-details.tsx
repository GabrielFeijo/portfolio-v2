import type { Experience } from '@/data/portfolio';
import { getTranslatedArray } from '@/utils/i18n';
import { AnimatePresence, m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PanelBulletList, PanelInsetCard, PanelTagList } from '../panel-content-primitives';

interface ExperienceRoleDetailsProps {
  experience: Experience;
  isOpen: boolean;
}

export function ExperienceRoleDetails({ experience, isOpen }: ExperienceRoleDetailsProps) {
  const { t } = useTranslation();
  const achievements = getTranslatedArray<string>(
    t,
    `experience_items.${experience.id}.achievements`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.28 }}
          className="overflow-hidden"
        >
          <p className="mb-4 mt-4 text-sm leading-7 text-(--text-secondary)">
            {t(`experience_items.${experience.id}.description`)}
          </p>

          {achievements.length > 0 && (
            <PanelInsetCard className="mb-4">
              <div className="mb-3 font-mono-space text-label font-semibold uppercase tracking-caps-lg panel-eyebrow">
                {t('common.key_deliveries')}
              </div>
              <PanelBulletList items={achievements} />
            </PanelInsetCard>
          )}

          <PanelTagList items={experience.tech} />
        </m.div>
      )}
    </AnimatePresence>
  );
}
