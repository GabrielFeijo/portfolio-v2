import { DEVELOPER } from '@/data/portfolio';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function LoadingScreen() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-1000 flex items-center justify-center bg-(--void) px-6"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-xl border border-(--accent-border) bg-(--accent-surface) font-mono-space text-label font-semibold tracking-heading text-(--accent-blue)">
          GF
        </div>
        <div className="font-display text-lg font-semibold tracking-label text-(--text-primary)">
          {DEVELOPER.name}
        </div>
        <div className="mt-2 text-xs text-(--text-muted)">{t('common.loading')}</div>
        <div className="mt-7 h-px overflow-hidden bg-(--border-strong)">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-1/2 bg-(--accent-blue)"
          />
        </div>
      </div>
    </motion.div>
  );
}
