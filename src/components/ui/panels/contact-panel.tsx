import { motion } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Code, Briefcase, Mail, Globe, Send, MapPin, MessageSquareQuote } from 'lucide-react'
import { PanelIntroCard, PanelMetaChip, PanelSection } from './panel-primitives'
import { ContactForm } from './contact/contact-form'
import { ContactLinkCard } from './contact/contact-link-card'

const contactLinks = [
  { icon: Code, label: 'GitHub', href: DEVELOPER.github, desc: 'Repositórios, estudos e projetos autorais' },
  { icon: Briefcase, label: 'LinkedIn', href: DEVELOPER.linkedin, desc: 'Perfil profissional e networking' },
  { icon: Mail, label: 'Email', href: `mailto:${DEVELOPER.email}`, desc: DEVELOPER.email },
  { icon: Globe, label: 'Website', href: DEVELOPER.website, desc: 'gabrielfeijo.com.br' },
]

export function ContactPanel() {
  const { setCursorVariant } = useSpaceStore()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={MessageSquareQuote}
        eyebrow="Canal aberto"
        title="Contato"
        description="Aberto para oportunidades, freelas, colaborações ou uma boa conversa sobre tecnologia, produto e engenharia."
        ringClassName="-right-12 -top-12 h-36 w-36"
        glowClassName="left-8 top-8 h-20 w-20"
      >
        <PanelMetaChip icon={MapPin} className="mt-4 text-sm">
          {DEVELOPER.location}
        </PanelMetaChip>
      </PanelIntroCard>

      <div className="grid gap-3 md:grid-cols-2">
        {contactLinks.map((link) => (
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
        eyebrow="Mensagem rápida"
        title="Enviar mensagem"
        ringClassName="-left-8 bottom-5 h-24 w-24"
      >
        <p className="text-sm text-(--text-secondary) leading-7 mb-5">
          Este formulário funciona como um atalho visual dentro do portfólio. Para contato imediato, GitHub, LinkedIn e email acima são os canais mais rápidos.
        </p>

        <ContactForm setCursorVariant={setCursorVariant} />
      </PanelSection>
    </motion.div>
  )
}
