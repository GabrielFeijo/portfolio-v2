import { useTranslation } from 'react-i18next';

export function FallbackFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-6 rounded-xl border border-[rgba(223,181,59,0.1)] bg-[rgba(8,10,16,0.8)] px-4 py-4 font-mono-space text-[10px] uppercase tracking-[0.18em] text-[rgba(255,214,122,0.55)] backdrop-blur-xl sm:px-5 lg:mt-8">
      <div className="flex flex-col gap-2 pr-18 sm:pr-22 xl:flex-row xl:items-center xl:justify-between xl:pr-0">
        <span>{t('fallback_2d.bottom_hint')}</span>
        <span>{t('fallback_2d.bottom_hint_secondary')}</span>
      </div>
    </footer>
  );
}
