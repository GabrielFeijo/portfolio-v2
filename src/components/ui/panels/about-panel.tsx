import { DEVELOPER, type DeveloperEducation } from '@/data/portfolio';
import { useSpaceStore } from '@/store/space-store';
import { getTranslatedArray } from '@/utils/i18n';
import { motion } from 'framer-motion';
import { Briefcase, Code, GraduationCap, Laptop2, Mail, MapPin, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AboutContactButton } from './about/about-contact-button';
import { AboutInfoPill } from './about/about-info-pill';
import { PanelNotice } from './panel-content-primitives';
import { PanelBadge, PanelSection, panelFadeUp, panelStagger } from './panel-primitives';

export function AboutPanel() {
  const setCursorVariant = useSpaceStore((state) => state.setCursorVariant);
  const { t } = useTranslation();

  const stats = DEVELOPER.stats.map((stat) => ({
    label: t(`developer.stats.${stat.id}`),
    value: stat.value,
  }));
  const summary = getTranslatedArray<string>(t, 'developer.summary');
  const education = getTranslatedArray<DeveloperEducation>(t, 'developer.education');

  return (
    <motion.div
      variants={panelStagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 sm:gap-10"
    >
      <motion.section variants={panelFadeUp} className="panel-card-strong p-6 sm:p-7">
        <div className="relative flex gap-6 items-start flex-col sm:flex-row">
          <div className="relative shrink-0">
            <img
              src={DEVELOPER.profileImage}
              alt={DEVELOPER.name}
              className="w-32 h-32 sm:w-36 sm:h-36 object-cover border shadow-(--shadow-image)"
              style={{
                borderColor: 'var(--panel-border-strong)',
                borderRadius: 'var(--panel-radius)',
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <PanelBadge className="text-label tracking-caps-xl uppercase font-mono-space">
              <UserRound size={12} />
              {t('planets.about.subtitle')}
            </PanelBadge>

            <motion.h1
              variants={panelFadeUp}
              className="mt-3 text-3xl sm:text-4xl font-bold tracking-display text-(--text-primary)"
            >
              {DEVELOPER.name}
            </motion.h1>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <AboutInfoPill icon={Laptop2} label={t('developer.title')} />
              <AboutInfoPill
                icon={MapPin}
                label={`${t('developer.location')} • ${DEVELOPER.age} ${t('developer.age_suffix')}`}
              />
            </div>

            <p className="mt-4 text-sm sm:text-body-md text-(--text-secondary) leading-7 max-w-2xl">
              {t('developer.tagline')}
            </p>
          </div>
        </div>
      </motion.section>

      <motion.div variants={panelFadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="panel-card relative overflow-hidden p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-bold text-(--text-primary)">{stat.value}</div>
            <div className="mt-2 text-xs uppercase tracking-caps text-(--text-muted)">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={panelFadeUp} className="flex gap-3 flex-wrap">
        <AboutContactButton
          href={DEVELOPER.github}
          label={t('contact.links.github')}
          icon={Code}
          setCursorVariant={setCursorVariant}
        />
        <AboutContactButton
          href={DEVELOPER.linkedin}
          label={t('contact.links.linkedin')}
          icon={Briefcase}
          setCursorVariant={setCursorVariant}
        />
        <AboutContactButton
          href={`mailto:${DEVELOPER.email}`}
          label={t('contact.links.email')}
          icon={Mail}
          setCursorVariant={setCursorVariant}
        />
      </motion.div>

      <PanelSection
        icon={Laptop2}
        eyebrow={t('about.sections.identity.eyebrow')}
        title={t('planets.about.name')}
      >
        {summary.map((paragraph, index) => (
          <p key={index} className="text-sm text-(--text-secondary) leading-7 mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </PanelSection>

      <PanelSection
        icon={GraduationCap}
        eyebrow={t('about.sections.education.eyebrow')}
        title={t('about.sections.education.title')}
      >
        {education.map((entry, index) => (
          <div key={index} className="panel-card p-5">
            <div className="text-base font-semibold text-(--text-primary)">{entry.title}</div>
            <div className="mt-1 text-xs uppercase tracking-caps panel-eyebrow">
              {entry.institution} • {entry.period}
            </div>
            <p className="text-sm text-(--text-secondary) leading-7 mt-4">{entry.description}</p>
          </div>
        ))}
      </PanelSection>

      <PanelSection
        icon={Code}
        eyebrow={t('about.sections.approach.eyebrow')}
        title={t('about.sections.approach.title')}
      >
        <p className="text-sm text-(--text-secondary) leading-7 mb-4">{t('developer.bio')}</p>
        <PanelNotice>{t('developer.availability')}</PanelNotice>
      </PanelSection>
    </motion.div>
  );
}
