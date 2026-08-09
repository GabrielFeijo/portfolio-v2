import { SKILLS, SKILL_GROUPS } from '@/data/portfolio';
import { getTranslatedArray } from '@/utils/i18n';
import { motion } from 'framer-motion';
import { Code2, Server, Sparkles, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PanelIconBadge, PanelIntroCard } from './panel-primitives';
import { SkillBar } from './skills/skill-bar';

export function SkillsPanel() {
  const { t } = useTranslation();

  const CATEGORIES = [
    {
      key: 'frontend',
      label: t('skills.categories.frontend'),
      icon: Code2,
      skills: SKILLS.frontend,
      tone: 'var(--panel-accent-soft)',
    },
    {
      key: 'backend',
      label: t('skills.categories.backend'),
      icon: Server,
      skills: SKILLS.backend,
      tone: 'color-mix(in srgb, var(--panel-glow) 18%, transparent)',
    },
    {
      key: 'devops',
      label: t('skills.categories.devops_platform'),
      icon: Wrench,
      skills: SKILLS.devops,
      tone: 'color-mix(in srgb, var(--panel-accent) 14%, transparent)',
    },
  ] as const;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={Sparkles}
        eyebrow={t('planets.skills.subtitle')}
        title={t('planets.skills.name')}
        description={t('planets.skills.description')}
      />

      {CATEGORIES.map((cat, ci) => (
        <motion.section
          key={cat.key}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: ci * 0.12 }}
          className="panel-shell p-6 sm:p-7"
        >
          <div className="flex items-center gap-3 mb-5">
            <PanelIconBadge
              icon={cat.icon}
              style={{
                background: `linear-gradient(180deg, ${cat.tone}, var(--surface-interactive-faint))`,
              }}
            />
            <div>
              <div className="text-label uppercase tracking-caps-xl panel-eyebrow font-mono-space">
                {t('common.specialty')}
              </div>
              <div className="text-lg font-semibold text-(--text-primary)">{cat.label}</div>
            </div>
            <div className="flex-1 h-px ml-2 panel-soft-divider" />
          </div>

          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
          >
            {cat.skills.map((skill, si) => (
              <SkillBar key={skill.name} skill={skill} delay={si * 0.06} />
            ))}
          </div>
        </motion.section>
      ))}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="panel-shell p-6 sm:p-7"
      >
        <div className="flex items-center gap-3 mb-5">
          <PanelIconBadge icon={Sparkles} />
          <div>
            <div className="text-label uppercase tracking-caps-xl panel-eyebrow font-mono-space">
              {t('common.expansion')}
            </div>
            <h3 className="text-lg font-semibold text-(--text-primary)">
              {t('common.complementary_skills')}
            </h3>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {SKILL_GROUPS.map((group) => {
            const title = t(`skill_groups.${group.id}`);
            const items = getTranslatedArray<string>(t, `skills.group_items.${group.id}`);
            return (
              <div key={group.id} className="panel-card p-5">
                <div className="text-sm font-semibold text-(--text-primary) mb-3">{title}</div>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.04 }}
                      className="text-xs px-3 py-1.5 cursor-none panel-meta-chip transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
}
