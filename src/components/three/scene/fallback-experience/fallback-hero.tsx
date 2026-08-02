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
      <div className="inline-flex max-w-full items-center gap-2 rounded-[10px] border border-[rgba(223,181,59,0.18)] bg-[rgba(223,181,59,0.07)] px-3 py-1.5 font-mono-space text-[9px] font-semibold uppercase tracking-[0.18em] text-[rgba(255,214,122,0.9)] sm:text-[10px] sm:tracking-[0.22em]">
        <Compass size={13} className="shrink-0 text-[#FFD67A]" />
        <span className="min-w-0 break-words">{t('fallback_2d.kicker')}</span>
      </div>

      <h1 className="mt-5 w-full max-w-none font-display text-[clamp(1.75rem,10.2vw,4rem)] leading-[0.96] font-black tracking-[-0.06em] text-[#FFF7E6] sm:max-w-[11ch] sm:text-[clamp(1.95rem,6vw,4rem)] sm:leading-[0.98] sm:tracking-[-0.055em]">
        {t('fallback_2d.title')}
      </h1>

      <p className="mt-4 w-full max-w-none text-sm leading-7 text-[rgba(240,244,255,0.7)] sm:max-w-xl sm:text-base sm:leading-8 sm:pr-4">
        {t('fallback_2d.description')}
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ActionButton onClick={onProjects}>
          {t('fallback_2d.primary_cta')}
          <ArrowRight size={16} />
        </ActionButton>
        <SecondaryActionButton onClick={onAbout}>{t('fallback_2d.secondary_cta')}</SecondaryActionButton>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {DEVELOPER.stats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
}
