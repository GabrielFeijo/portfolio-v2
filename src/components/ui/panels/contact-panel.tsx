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
      <section className="glass-strong p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[rgba(125,211,252,0.1)] border border-[rgba(125,211,252,0.18)] text-(--accent-blue-bright)">
            <MessageSquareQuote size={18} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-(--text-muted) font-mono-space">Canal aberto</div>
            <h2 className="text-2xl font-semibold text-(--text-primary)">Contato</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-(--text-secondary) leading-7 max-w-2xl">
          Aberto para oportunidades, freelas, colaborações ou uma boa conversa sobre tecnologia, produto e engenharia.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-(--border) text-sm text-(--text-secondary)">
          <MapPin size={16} className="text-(--accent-blue-bright)" />
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
              className="flex items-start gap-4 p-5 rounded-[22px] glass border border-(--border) no-underline cursor-none transition-all hover:border-(--border-strong)"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[rgba(125,211,252,0.1)] border border-[rgba(125,211,252,0.18)] shrink-0">
                <Icon size={18} className="text-(--accent-blue-bright)" />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold text-(--text-primary)">{link.label}</div>
                <div className="text-xs text-(--text-muted) mt-1 leading-6">{link.desc}</div>
              </div>
            </motion.a>
          )
        })}
      </div>

      <section className="glass p-6 sm:p-7 border border-(--border)">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[rgba(125,211,252,0.1)] border border-[rgba(125,211,252,0.18)] text-(--accent-blue-bright)">
            <Send size={18} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-(--text-muted) font-mono-space">Mensagem rápida</div>
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
              className="px-4 py-3 rounded-2xl bg-[rgba(11,16,32,0.7)] border border-(--border)
                       text-(--text-primary) text-sm placeholder-(--text-muted)
                       transition-colors focus:outline-none focus:border-(--border-strong) cursor-none"
            />

            <input
              type="email"
              placeholder="voce@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="px-4 py-3 rounded-2xl bg-[rgba(11,16,32,0.7)] border border-(--border)
                       text-(--text-primary) text-sm placeholder-(--text-muted)
                       transition-colors focus:outline-none focus:border-(--border-strong) cursor-none"
            />
          </div>

          <textarea
            placeholder="Conte brevemente sobre a oportunidade, projeto ou ideia."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            required
            className="px-4 py-3 rounded-[22px] bg-[rgba(11,16,32,0.7)] border border-(--border)
                     text-(--text-primary) text-sm placeholder-(--text-muted) resize-none
                     transition-colors focus:outline-none focus:border-(--border-strong) cursor-none"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setCursorVariant('link')}
            onMouseLeave={() => setCursorVariant('default')}
            className="px-4 py-3 rounded-2xl bg-(--accent-blue) text-white font-medium text-sm
                     cursor-none transition-colors hover:bg-[#1f4fd1]"
          >
            {sent ? '✓ Mensagem recebida!' : 'Enviar mensagem'}
          </motion.button>
        </form>
      </section>
    </motion.div>
  )
}
