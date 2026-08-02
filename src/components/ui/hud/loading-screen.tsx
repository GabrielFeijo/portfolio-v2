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
      className="fixed inset-0 z-1000 flex items-center justify-center bg-[#08090b] px-6"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-xl border border-[rgba(223,181,59,.22)] bg-[rgba(223,181,59,.07)] font-mono-space text-[11px] font-semibold tracking-[.08em] text-[#dfb53b]">
          GF
        </div>
        <div className="font-display text-lg font-semibold tracking-[.04em] text-white">
          {DEVELOPER.name}
        </div>
        <div className="mt-2 text-xs text-[rgba(181,192,210,.7)]">{t('common.loading')}</div>
        <div className="mt-7 h-px overflow-hidden bg-[rgba(148,163,184,.14)]">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-1/2 bg-[#dfb53b]"
          />
        </div>
      </div>
    </motion.div>
  );
}
