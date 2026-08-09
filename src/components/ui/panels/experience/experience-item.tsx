import type { Experience } from '@/data/portfolio';
import { getTranslatedArray } from '@/utils/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Calendar, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PanelBulletList, PanelInsetCard, PanelTagList } from '../panel-content-primitives';

interface ExperienceItemProps {
  experience: Experience;
  isOpen: boolean;
  onToggle: () => void;
  transition: { delay: number };
}

export function ExperienceItem({ experience, isOpen, onToggle, transition }: ExperienceItemProps) {
  const { t } = useTranslation();
  const achievements = getTranslatedArray<string>(
    t,
    `experience_items.${experience.id}.achievements`
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transition}
      className="relative pl-10 sm:pl-16"
    >
      <div
        className="absolute left-2.25 top-7 z-10 h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 sm:left-4.25"
        style={{
          background: isOpen ? 'var(--panel-accent)' : 'var(--deep-space)',
          borderColor: 'var(--panel-accent)',
          boxShadow: isOpen
            ? '0 0 20px color-mix(in srgb, var(--panel-glow) 40%, transparent)'
            : 'none',
        }}
      />

      <motion.article
        onClick={onToggle}
        whileHover={{ x: 3 }}
        className={`cursor-none px-5 py-5 transition-all duration-200 sm:px-6 sm:py-6 ${isOpen ? 'panel-card-strong' : 'panel-card'}`}
        style={{
          boxShadow: isOpen
            ? '0 18px 40px rgba(0,0,0,0.24), 0 0 34px color-mix(in srgb, var(--panel-glow) 12%, transparent)'
            : undefined,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 font-mono-space text-[11px] uppercase tracking-[0.16em] panel-eyebrow">
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

          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="mt-1 shrink-0 panel-highlight-text"
          >
            <ChevronRight size={18} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
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
                  <div className="mb-3 font-mono-space text-[11px] font-semibold uppercase tracking-[0.18em] panel-eyebrow">
                    {t('common.key_deliveries')}
                  </div>
                  <PanelBulletList items={achievements} />
                </PanelInsetCard>
              )}

              <PanelTagList items={experience.tech} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </motion.div>
  );
}
