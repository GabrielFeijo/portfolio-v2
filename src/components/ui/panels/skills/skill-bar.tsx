import type { SkillItem } from '@/data/portfolio';
import { motion } from 'framer-motion';

interface SkillBarProps {
  delay: number;
  skill: SkillItem;
}

export function SkillBar({ delay, skill }: SkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden px-4 py-4 panel-card"
    >
      <div className="relative z-10">
        <span className="text-sm font-semibold text-(--text-primary)">{skill.name}</span>
      </div>
    </motion.div>
  );
}
