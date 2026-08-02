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
    document.title =
      currentLang === 'pt'
        ? 'Gabriel Feijó — Desenvolvedor Full Stack'
        : 'Gabriel Feijó — Full Stack Developer';
  }, [currentLang, setLanguage]);

  const changeLanguage = useCallback(
    (lang: 'pt' | 'en') => {
      void i18n.changeLanguage(lang);
      setLanguage(lang);
    },
    [i18n, setLanguage]
  );

  return (
    <>
      <header className="portfolio-header pointer-events-auto">
        <button
          type="button"
          className="portfolio-identity cursor-none"
          onClick={() => navigateToPanel('about')}
          {...linkCursor}
          aria-label={t('planets.about.name')}
        >
          <span className="identity-mark" aria-hidden="true">
            GF
          </span>
          <span>
            <strong>{DEVELOPER.name}</strong>
            <small>{t('developer.title')}</small>
          </span>
        </button>

        <div className="portfolio-header-actions">
          <span className="availability-dot" aria-hidden="true" />
          <span className="availability-label">{t('developer.location')}</span>
          <button
            type="button"
            onClick={() => navigateToPanel('contact')}
            {...linkCursor}
            className="header-contact cursor-none"
          >
            <Mail size={15} />
            <span>{t('planets.contact.name')}</span>
          </button>
        </div>
      </header>

      <nav className="portfolio-nav pointer-events-auto" aria-label={t('nav.planets_aria')}>
        <div className="portfolio-nav-label">{t('nav.sections')}</div>
        <ul>
          {PLANETS.map((planet, index) => (
            <li key={planet.id}>
              <button
                type="button"
                onClick={() => navigateToPanel(planet.id)}
                {...linkCursor}
                aria-current={activePanel === planet.id ? 'page' : undefined}
                className={cn(
                  'portfolio-nav-item cursor-none',
                  activePanel === planet.id && 'is-active'
                )}
              >
                <span className="nav-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{t(`planets.${planet.id}.name`)}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="portfolio-tools pointer-events-auto">
        <div className="language-switch" aria-label="Language">
          {(['pt', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => changeLanguage(lang)}
              {...linkCursor}
              aria-pressed={currentLang === lang}
              className={cn('cursor-none', currentLang === lang && 'is-active')}
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
          className="tool-button cursor-none"
        >
          <Settings2 size={16} />
        </button>
        <a
          href={DEVELOPER.github}
          target="_blank"
          rel="noopener noreferrer"
          {...linkCursor}
          className="tool-button cursor-none"
          aria-label="GitHub"
        >
          <Code2 size={16} />
          <ArrowUpRight size={12} />
        </a>
      </div>
    </>
  );
}
