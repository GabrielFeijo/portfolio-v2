import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { motion } from 'framer-motion'
import { Briefcase, Code, Globe, Mail, MapPin, MessageSquareQuote, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ContactForm } from './contact/contact-form'
import { ContactLinkCard } from './contact/contact-link-card'
import { PanelIntroCard, PanelMetaChip, PanelSection } from './panel-primitives'

export function ContactPanel() {
  const { setCursorVariant } = useSpaceStore()
  const { t } = useTranslation()

  const links = [
    { icon: Code, label: t('contact.links.github'), href: DEVELOPER.github, desc: t('contact.github_desc') },
    { icon: Briefcase, label: t('contact.links.linkedin'), href: DEVELOPER.linkedin, desc: t('contact.linkedin_desc') },
    { icon: Mail, label: t('contact.links.email'), href: `mailto:${DEVELOPER.email}`, desc: DEVELOPER.email },
    { icon: Globe, label: t('contact.links.website'), href: DEVELOPER.website, desc: t('contact.website_desc') },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={MessageSquareQuote}
        eyebrow={t('planets.contact.subtitle')}
        title={t('planets.contact.name')}
        description={t('planets.contact.description')}
        ringClassName="-right-12 -top-12 h-36 w-36"
        glowClassName="left-8 top-8 h-20 w-20"
      >
        <PanelMetaChip icon={MapPin} className="mt-4 text-sm">
          {t('developer.location')}
        </PanelMetaChip>
      </PanelIntroCard>

      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <ContactLinkCard
            key={link.label}
            desc={link.desc}
            href={link.href}
            icon={link.icon}
            label={link.label}
            setCursorVariant={setCursorVariant}
          />
        ))}
      </div>

      <PanelSection
        icon={Send}
        eyebrow={t('contact.quick_message')}
        title={t('contact.send_message')}
        ringClassName="-left-8 bottom-5 h-24 w-24"
      >
        <p className="text-sm text-(--text-secondary) leading-7 mb-5">
          {t('contact.form_notice')}
        </p>

        <ContactForm setCursorVariant={setCursorVariant} />
      </PanelSection>
    </motion.div>
  )
}
