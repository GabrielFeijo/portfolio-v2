import type { Accomplishment } from '@/data/portfolio';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getLucideIcon, PanelIconBadge } from '../panel-primitives';

interface AccomplishmentCardProps {
  accomplishment: Accomplishment;
  transition: { delay: number };
}

export function AccomplishmentCard({ accomplishment, transition }: AccomplishmentCardProps) {
  const { t } = useTranslation();

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden p-5 transition-all panel-card cursor-none sm:p-6"
    >
      <div className="relative">
        <div className="mb-4 flex justify-start">
          <PanelIconBadge
            icon={getLucideIcon(accomplishment.icon)}
            className="h-11 w-11"
            style={{
              background: 'var(--panel-accent-soft)',
              border: '1px solid var(--panel-border)',
              color: 'var(--panel-accent)',
            }}
          />
        </div>

        <div className="mb-2 font-mono-space text-label uppercase tracking-caps-lg panel-eyebrow">
          {t(`accomplishments_items.${accomplishment.id}.category`)}
        </div>
        <h3 className="mb-2 text-base font-semibold text-(--text-primary)">
          {t(`accomplishments_items.${accomplishment.id}.title`)}
        </h3>
        <p className="text-sm leading-7 text-(--text-secondary)">
          {t(`accomplishments_items.${accomplishment.id}.description`)}
        </p>
      </div>
    </motion.article>
  );
}
