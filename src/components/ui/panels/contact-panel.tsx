import { motion } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Code, Briefcase, Mail, Globe, Send, MapPin, MessageSquareQuote } from 'lucide-react'
import { PanelIconBadge, PanelIntroCard, PanelMetaChip, PanelSection, createCursorHandlers } from './panel-primitives'
import { useTemporaryFlag } from './use-temporary-flag'

const contactLinks = [
  { icon: Code, label: 'GitHub', href: DEVELOPER.github, desc: 'Repositórios, estudos e projetos autorais' },
  { icon: Briefcase, label: 'LinkedIn', href: DEVELOPER.linkedin, desc: 'Perfil profissional e networking' },
  { icon: Mail, label: 'Email', href: `mailto:${DEVELOPER.email}`, desc: DEVELOPER.email },
  { icon: Globe, label: 'Website', href: DEVELOPER.website, desc: 'gabrielfeijo.com.br' },
]

export function ContactPanel() {
  const { setCursorVariant } = useSpaceStore()
  const { active: sent, trigger } = useTemporaryFlag(3500)
  const linkCursor = createCursorHandlers(setCursorVariant)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formElement = e.currentTarget
    trigger()
    formElement.reset()
  }

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
        {contactLinks.map((link) => {
          const Icon = link.icon
          return (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={!link.href.startsWith('mailto:') ? 'noopener noreferrer' : undefined}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              {...linkCursor}
              className="flex items-start gap-4 p-5 rounded-[22px] panel-card no-underline cursor-none transition-all hover:-translate-y-0.5"
            >
              <PanelIconBadge icon={Icon} className="h-11 w-11 shrink-0" />

              <div className="min-w-0">
                <div className="text-sm font-semibold text-(--text-primary)">{link.label}</div>
                <div className="text-xs text-(--text-muted) mt-1 leading-6">{link.desc}</div>
              </div>
            </motion.a>
          )
        })}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="Seu nome"
              required
              className="px-4 py-3 rounded-2xl panel-input text-sm transition-colors cursor-none"
            />

            <input
              type="email"
              placeholder="voce@email.com"
              required
              className="px-4 py-3 rounded-2xl panel-input text-sm transition-colors cursor-none"
            />
          </div>

          <textarea
            placeholder="Conte brevemente sobre a oportunidade, projeto ou ideia."
            rows={5}
            required
            className="px-4 py-3 rounded-[22px] panel-input text-sm resize-none transition-colors cursor-none"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            {...linkCursor}
            className="px-4 py-3 rounded-2xl panel-cta font-medium text-sm cursor-none transition-colors"
          >
            {sent ? '✓ Mensagem recebida!' : 'Enviar mensagem'}
          </motion.button>
        </form>
      </PanelSection>
    </motion.div>
  )
}
