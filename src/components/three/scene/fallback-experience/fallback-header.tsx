import { DEVELOPER } from '@/data/portfolio';
import { BriefcaseBusiness, Code2, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton, HeaderLink, InfoChip } from './shared';

export function FallbackHeader({ onContact }: { onContact: () => void }) {
  const { t } = useTranslation();

  return (
    <header className="flex flex-col gap-4 rounded-xl border border-[rgba(223,181,59,0.14)] bg-[rgba(10,12,18,0.88)] px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 font-mono-space text-[9px] font-semibold uppercase tracking-[0.18em] text-[rgba(255,214,122,0.86)] sm:text-[10px] sm:tracking-[0.24em]">
          <span className="h-2 w-2 rounded-full bg-[rgba(223,181,59,0.96)] shadow-[0_0_16px_rgba(223,181,59,0.75)]" />
          <span className="break-words">{t('fallback_2d.eyebrow')}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(223,181,59,0.18)] bg-[rgba(223,181,59,0.08)] font-mono-space text-xs font-bold tracking-[0.12em] text-[#FFD67A] shadow-[0_0_24px_rgba(223,181,59,0.08)]">
            GF
          </div>
          <div className="min-w-0">
            <strong className="block truncate font-display text-base font-semibold text-[#FFF7E6] sm:text-lg">
              {DEVELOPER.name}
            </strong>
            <p className="truncate text-sm text-[rgba(240,244,255,0.56)]">{DEVELOPER.title}</p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-end">
        <InfoChip icon={MapPin}>{DEVELOPER.location}</InfoChip>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <HeaderLink ariaLabel="GitHub" href={DEVELOPER.github}>
            <Code2 size={15} />
            <span className="hidden sm:inline">GitHub</span>
          </HeaderLink>
          <HeaderLink ariaLabel="LinkedIn" href={DEVELOPER.linkedin}>
            <BriefcaseBusiness size={15} />
            <span className="hidden sm:inline">LinkedIn</span>
          </HeaderLink>
          <ActionButton ariaLabel={t('planets.contact.name')} compact onClick={onContact}>
            <Mail size={15} />
            <span className="hidden sm:inline">{t('planets.contact.name')}</span>
          </ActionButton>
        </div>
      </div>
    </header>
  );
}
