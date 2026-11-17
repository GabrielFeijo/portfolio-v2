import { DEVELOPER } from '@/data/portfolio';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function LoadingScreen() {
  const { t } = useTranslation();

  return (
    <m.div
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
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
          <div className="loading-bar-track h-full w-1/2 bg-(--accent-blue)" />
        </div>
      </div>
    </m.div>
  );
}
