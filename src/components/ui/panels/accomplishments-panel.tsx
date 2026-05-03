import { ACCOMPLISHMENTS, CERTIFICATES } from '@/data/portfolio'
import { motion } from 'framer-motion'
import { GraduationCap, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AccomplishmentCard } from './accomplishments/accomplishment-card'
import { CertificateCard } from './accomplishments/certificate-card'
import { PanelIntroCard, PanelSection } from './panel-primitives'

export function AccomplishmentsPanel() {
  const { t } = useTranslation()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={Trophy}
        eyebrow={t('planets.accomplishments.subtitle')}
        title={t('planets.accomplishments.name')}
        description={t('planets.accomplishments.description')}
        ringClassName="-right-16 -top-12 h-44 w-44"
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {ACCOMPLISHMENTS.map((item, i) => (
          <AccomplishmentCard
            key={item.id}
            accomplishment={item}
            transition={{ delay: i * 0.06 }}
          />
        ))}
      </div>

      {CERTIFICATES.length > 0 && (
        <PanelSection
          icon={GraduationCap}
          eyebrow={t('accomplishments.section.eyebrow')}
          title={t('accomplishments.section.title')}
          glowClassName="right-6 top-4 h-20 w-20"
        >
          <div className="space-y-4">
            {CERTIFICATES.map((cert, i) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                transition={{ delay: i * 0.06 + 0.2 }}
              />
            ))}
          </div>
        </PanelSection>
      )}
    </motion.div>
  )
}
