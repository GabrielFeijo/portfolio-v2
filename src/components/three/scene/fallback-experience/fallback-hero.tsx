import { DEVELOPER } from '@/data/portfolio';
import { ArrowRight, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton, MetricCard, SecondaryActionButton } from './shared';

export function FallbackHero({
  onAbout,
  onProjects,
}: {
  onAbout: () => void;
  onProjects: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl">
      <div className="inline-flex max-w-full items-center gap-2 rounded-control border border-(--accent-border) bg-(--accent-surface) px-3 py-1.5 font-mono-space text-micro font-semibold uppercase tracking-caps-lg text-(--fallback-accent-readable) sm:text-caption sm:tracking-caps-extended">
        <Compass size={13} className="shrink-0 text-(--fallback-accent)" />
        <span className="min-w-0 wrap-break-word">{t('fallback_2d.kicker')}</span>
      </div>

      <h1 className="mt-5 w-full max-w-none font-display text-hero leading-hero font-black tracking-hero text-(--fallback-text-strong) sm:max-w-(--layout-hero-measure) sm:text-hero-wide sm:leading-hero-wide sm:tracking-hero-wide">
        {t('fallback_2d.title')}
      </h1>

      <p className="mt-4 w-full max-w-none text-sm leading-7 text-(--fallback-text-secondary) sm:max-w-xl sm:text-base sm:leading-8 sm:pr-4">
        {t('fallback_2d.description')}
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ActionButton onClick={onProjects}>
          {t('fallback_2d.primary_cta')}
          <ArrowRight size={16} />
        </ActionButton>
        <SecondaryActionButton onClick={onAbout}>
          {t('fallback_2d.secondary_cta')}
        </SecondaryActionButton>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {DEVELOPER.stats.map((stat) => (
          <MetricCard key={stat.id} label={t(`developer.stats.${stat.id}`)} value={stat.value} />
        ))}
      </div>
    </div>
  );
}
