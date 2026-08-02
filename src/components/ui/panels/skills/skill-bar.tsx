import type { SkillItem } from '@/data/portfolio';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const getLevelKey = (level: number) => {
  if (level >= 95) return 'expert';
  if (level >= 85) return 'advanced';
  if (level >= 75) return 'proficient';
  if (level >= 60) return 'intermediate';
  return 'evolving';
};

interface SkillBarProps {
  delay: number;
  skill: SkillItem;
}

export function SkillBar({ delay, skill }: SkillBarProps) {
  const { t } = useTranslation();
  const levelText = t(`skills.levels.${getLevelKey(skill.level)}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-[20px] px-4 py-4 panel-card"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-(--text-primary)">{skill.name}</span>
          <span className="font-mono-space text-[11px] uppercase tracking-[0.16em] panel-eyebrow">
            {levelText}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
