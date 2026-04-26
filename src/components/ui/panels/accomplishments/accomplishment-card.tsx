import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Award } from 'lucide-react'
import type { Accomplishment } from '@/data/portfolio'
import { PanelTopGlow } from '../panel-content-primitives'
import { getLucideIcon, PanelIconBadge } from '../panel-primitives'

interface AccomplishmentCardProps {
  accomplishment: Accomplishment
  transition: { delay: number }
}

export function AccomplishmentCard({
  accomplishment,
  transition,
}: AccomplishmentCardProps) {
  const { t } = useTranslation()

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-3xl p-5 transition-all panel-card cursor-none sm:p-6"
    >
      <PanelTopGlow color={accomplishment.color} className="h-20" />

      <div className="relative">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-4 flex justify-start"
        >
          <PanelIconBadge
            icon={getLucideIcon(accomplishment.icon) ?? Award}
            className="h-11 w-11"
            style={{
              background: `${accomplishment.color}18`,
              border: `1px solid ${accomplishment.color}40`,
              boxShadow: `0 0 24px ${accomplishment.color}15`,
              color: accomplishment.color,
            }}
          />
        </motion.div>

        <div className="mb-2 font-mono-space text-[11px] uppercase tracking-[0.18em] panel-eyebrow">
          {t(`accomplishments_items.${accomplishment.id}.category`, accomplishment.category)}
        </div>
        <h3 className="mb-2 text-base font-semibold text-(--text-primary)">
          {t(`accomplishments_items.${accomplishment.id}.title`, accomplishment.title)}
        </h3>
        <p className="text-sm leading-7 text-(--text-secondary)">
          {t(`accomplishments_items.${accomplishment.id}.description`, accomplishment.description)}
        </p>
      </div>
    </motion.article>
  )
}
