import { DEVELOPER } from '@/data/portfolio';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InfoChip } from './shared';

export function FallbackHeader() {
  const { t } = useTranslation();

  return (
    <header className="flex flex-col gap-4 rounded-xl border border-(--panel-border) bg-(--panel-surface-strong) px-4 py-4 shadow-(--shadow-overlay) backdrop-blur-xl sm:px-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 font-mono-space text-micro font-semibold uppercase tracking-caps-lg text-(--fallback-accent-readable) sm:text-caption sm:tracking-caps-2xl">
          <span className="h-2 w-2 rounded-full bg-(--accent-blue) shadow-(--shadow-status-strong)" />
          <span className="wrap-break-word">{t('fallback_2d.eyebrow')}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-(--accent-border) bg-(--accent-surface) font-mono-space text-xs font-bold tracking-caps-sm text-(--fallback-accent) shadow-(--shadow-fallback-icon)">
            GF
          </div>
          <div className="min-w-0">
            <strong className="block truncate font-display text-base font-semibold text-(--fallback-text-strong) sm:text-lg">
              {DEVELOPER.name}
            </strong>
            <p className="truncate text-sm text-(--fallback-text-subtle)">{t('developer.title')}</p>
          </div>
        </div>
      </div>

      <InfoChip icon={MapPin}>{t('developer.location')}</InfoChip>
    </header>
  );
}
