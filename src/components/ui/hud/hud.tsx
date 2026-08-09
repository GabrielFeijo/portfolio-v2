import { DEVELOPER, PLANETS } from '@/data/portfolio';
import { useSpaceStore } from '@/store/space-store';
import { ArrowUpRight, Code2, Mail, Settings2 } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { cn, createCursorHandlers } from '../panels/panel-primitives';

export function HUD() {
  const { activePanel, navigateToPanel, openSettings, setCursorVariant, setLanguage } =
    useSpaceStore(
      useShallow((state) => ({
        activePanel: state.activePanel,
        navigateToPanel: state.navigateToPanel,
        openSettings: state.openSettings,
        setCursorVariant: state.setCursorVariant,
        setLanguage: state.setLanguage,
      }))
    );
  const { t, i18n } = useTranslation();
  const linkCursor = useMemo(() => createCursorHandlers(setCursorVariant), [setCursorVariant]);
  const currentLang = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'pt';

  useEffect(() => {
    setLanguage(currentLang);
    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';
    document.title = t('app.document_title');
  }, [currentLang, setLanguage, t]);

  const changeLanguage = useCallback(
    (lang: 'pt' | 'en') => {
      void i18n.changeLanguage(lang);
      setLanguage(lang);
    },
    [i18n, setLanguage]
  );

  return (
    <>
      <header className="pointer-events-auto absolute top-5 inset-x-6 z-100 min-h-16 flex items-center justify-between gap-6 rounded-xl border border-(--border) bg-(--surface-glass) px-3 py-2.5 pl-2.5 shadow-(--shadow-hud-header) backdrop-blur-glass max-md:inset-x-2.5 max-md:top-2.5 max-md:min-h-15">
        <button
          type="button"
          className="group cursor-none flex items-center gap-3 text-left transition-transform duration-200 hover:-translate-y-px"
          onClick={() => navigateToPanel('about')}
          {...linkCursor}
          aria-label={t('planets.about.name')}
        >
          <span
            className="grid h-10.5 w-10.5 place-items-center rounded-xl border border-(--accent-border) bg-(--accent-surface-faint) font-mono text-label leading-none font-bold tracking-heading text-(--accent-blue) transition-all duration-200 group-hover:border-(--accent-focus) group-hover:bg-(--accent-surface-hover) group-hover:shadow-(--shadow-brand-tile)"
            aria-hidden="true"
          >
            GF
          </span>
          <span>
            <strong className="block font-display text-sm leading-copy font-semibold tracking-label text-(--text-primary)">
              {DEVELOPER.name}
            </strong>
            <small className="mt-0.5 block text-label tracking-micro text-(--text-muted)">
              {t('developer.title')}
            </small>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span
            className="h-1.75 w-1.75 rounded-full bg-(--status-success) shadow-(--shadow-status) max-md:hidden"
            aria-hidden="true"
          />
          <span className="font-mono text-label tracking-micro text-(--text-muted) max-md:hidden">
            {t('developer.location')}
          </span>
          <button
            type="button"
            onClick={() => navigateToPanel('contact')}
            {...linkCursor}
            aria-label={t('planets.contact.name')}
            className="cursor-none inline-flex min-h-10 items-center justify-center gap-2 rounded-control border border-(--accent-border) bg-(--accent-surface-subtle) px-3.75 font-mono text-caption leading-none font-semibold tracking-caps-sm text-(--text-primary) uppercase transition-all duration-180 hover:-translate-y-px hover:border-(--accent-focus) hover:bg-(--accent-surface-hover) hover:shadow-(--shadow-action) active:translate-y-0 max-md:w-10 max-md:px-0"
          >
            <Mail size={15} />
            <span className="max-md:hidden">{t('planets.contact.name')}</span>
          </button>
        </div>
      </header>

      <nav
        className="pointer-events-auto absolute top-1/2 left-6 z-210 hidden w-47 -translate-y-1/2 rounded-xl border border-(--border) bg-(--surface-glass-muted) p-4 shadow-(--shadow-hud-navigation) backdrop-blur-glass md:block"
        aria-label={t('nav.planets_aria')}
      >
        <div className="mx-2 mb-2.5 font-mono text-micro leading-none font-semibold tracking-caps-2xl text-(--text-muted) uppercase opacity-80">
          {t('nav.sections')}
        </div>
        <ul className="grid gap-1">
          {PLANETS.map((planet, index) => (
            <li key={planet.id}>
              <button
                type="button"
                onClick={() => navigateToPanel(planet.id)}
                {...linkCursor}
                aria-current={activePanel === planet.id ? 'page' : undefined}
                className={cn(
                  'group cursor-none flex min-h-9.5 w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 text-left font-display text-label leading-none font-medium tracking-wider text-(--text-secondary) transition-all duration-180 hover:border-(--accent-border-subtle) hover:bg-(--accent-surface-subtle) hover:text-(--text-primary) focus-visible:border-(--accent-border-hover) focus-visible:bg-(--accent-surface-hover) focus-visible:text-(--text-primary) focus-visible:outline-none',
                  activePanel === planet.id &&
                    'is-active border-(--accent-border-strong) bg-(--accent-surface) text-(--text-primary) shadow-(--shadow-navigation-active)'
                )}
              >
                <span className="font-mono text-micro leading-none font-medium text-(--text-muted) opacity-70 transition-colors duration-180 group-hover:text-(--accent-blue) group-hover:opacity-100">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{t(`planets.${planet.id}.name`)}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="pointer-events-auto absolute right-6 bottom-5 z-100 flex items-center gap-2 rounded-xl border border-(--border) bg-(--surface-glass) p-1.5 shadow-(--shadow-hud-footer) backdrop-blur-glass max-md:fixed max-md:right-(--layout-safe-area-right) max-md:bottom-(--layout-safe-area-bottom)">
        <div className="flex gap-0.5 border-r border-r-(--border) pr-1.5" aria-label="Language">
          {(['pt', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => changeLanguage(lang)}
              {...linkCursor}
              aria-pressed={currentLang === lang}
              className={cn(
                'cursor-none h-8 w-8 rounded-md font-mono text-micro leading-none font-semibold uppercase text-(--text-muted) transition-all duration-180 hover:bg-(--surface-interactive-hover) hover:text-(--text-primary)',
                currentLang === lang &&
                  'is-active border border-(--accent-border) bg-(--accent-surface) text-(--text-primary)'
              )}
            >
              {lang}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={openSettings}
          {...linkCursor}
          aria-label={t('settings.title')}
          className="cursor-none inline-flex h-8.5 min-w-8.5 items-center justify-center gap-0.5 rounded-lg text-(--text-muted) transition-all duration-180 hover:border hover:border-(--accent-border-subtle) hover:bg-(--accent-surface-subtle) hover:text-(--text-primary)"
        >
          <Settings2 size={16} />
        </button>
        <a
          href={DEVELOPER.github}
          target="_blank"
          rel="noopener noreferrer"
          {...linkCursor}
          className="cursor-none inline-flex h-8.5 min-w-8.5 items-center justify-center gap-0.5 rounded-lg text-(--text-muted) transition-all duration-180 hover:border hover:border-(--accent-border-subtle) hover:bg-(--accent-surface-subtle) hover:text-(--text-primary)"
          aria-label="GitHub"
        >
          <Code2 size={16} />
          <ArrowUpRight size={12} />
        </a>
      </footer>
    </>
  );
}
