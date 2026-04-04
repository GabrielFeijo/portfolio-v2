import { useState } from 'react'
import { motion } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Code, Briefcase, Mail, Globe, Send, MapPin, MessageSquareQuote } from 'lucide-react'

const contactLinks = [
  { icon: Code, label: 'GitHub', href: DEVELOPER.github, desc: 'Repositórios, estudos e projetos autorais' },
  { icon: Briefcase, label: 'LinkedIn', href: DEVELOPER.linkedin, desc: 'Perfil profissional e networking' },
  { icon: Mail, label: 'Email', href: `mailto:${DEVELOPER.email}`, desc: DEVELOPER.email },
  { icon: Globe, label: 'Website', href: DEVELOPER.website, desc: 'gabrielfeijo.com.br' },
]

export function ContactPanel() {
  const { setCursorVariant } = useSpaceStore()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3500)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <section className="panel-card-strong p-6 sm:p-7">
        <div className="panel-orbit-grid" />
        <div className="panel-surface-dust" />
        <div className="panel-orbit-ring -right-12 -top-12 h-36 w-36" />
        <div className="panel-core-glow left-8 top-8 h-20 w-20" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center panel-icon-chip">
            <MessageSquareQuote size={18} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">Canal aberto</div>
            <h2 className="text-2xl font-semibold text-(--text-primary)">Contato</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-(--text-secondary) leading-7 max-w-2xl">
          Aberto para oportunidades, freelas, colaborações ou uma boa conversa sobre tecnologia, produto e engenharia.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full panel-meta-chip text-sm">
          <MapPin size={16} />
          {DEVELOPER.location}
        </div>
      </section>

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
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              className="flex items-start gap-4 p-5 rounded-[22px] panel-card no-underline cursor-none transition-all hover:translate-y-[-2px]"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center panel-icon-chip shrink-0">
                <Icon size={18} />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold text-(--text-primary)">{link.label}</div>
                <div className="text-xs text-(--text-muted) mt-1 leading-6">{link.desc}</div>
              </div>
            </motion.a>
          )
        })}
      </div>

      <section className="panel-shell p-6 sm:p-7">
        <div className="panel-orbit-ring -left-8 bottom-5 h-24 w-24" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center panel-icon-chip">
            <Send size={18} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] panel-eyebrow font-mono-space">Mensagem rápida</div>
            <h3 className="text-lg font-semibold text-(--text-primary)">Enviar mensagem</h3>
          </div>
        </div>

        <p className="text-sm text-(--text-secondary) leading-7 mb-5">
          Este formulário funciona como um atalho visual dentro do portfólio. Para contato imediato, GitHub, LinkedIn e email acima são os canais mais rápidos.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="px-4 py-3 rounded-2xl panel-input text-sm transition-colors cursor-none"
            />

            <input
              type="email"
              placeholder="voce@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="px-4 py-3 rounded-2xl panel-input text-sm transition-colors cursor-none"
            />
          </div>

          <textarea
            placeholder="Conte brevemente sobre a oportunidade, projeto ou ideia."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            required
            className="px-4 py-3 rounded-[22px] panel-input text-sm resize-none transition-colors cursor-none"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            className="px-4 py-3 rounded-2xl panel-cta font-medium text-sm cursor-none transition-colors"
          >
            {sent ? '✓ Mensagem recebida!' : 'Enviar mensagem'}
          </motion.button>
        </form>
      </section>
    </motion.div>
  )
}
