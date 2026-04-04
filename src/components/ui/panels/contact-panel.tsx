import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Code, Briefcase, Mail, Globe, Send, MapPin, MessageSquareQuote } from 'lucide-react'
import { PanelIconBadge, PanelIntroCard, PanelMetaChip, PanelSection, createCursorHandlers } from './panel-primitives'
import { useTemporaryFlag } from './use-temporary-flag'
import { cn } from './panel-primitives'

const contactLinks = [
  { icon: Code, label: 'GitHub', href: DEVELOPER.github, desc: 'Repositórios, estudos e projetos autorais' },
  { icon: Briefcase, label: 'LinkedIn', href: DEVELOPER.linkedin, desc: 'Perfil profissional e networking' },
  { icon: Mail, label: 'Email', href: `mailto:${DEVELOPER.email}`, desc: DEVELOPER.email },
  { icon: Globe, label: 'Website', href: DEVELOPER.website, desc: 'gabrielfeijo.com.br' },
]

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe pelo menos 2 caracteres no nome.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe um email para contato.')
    .email('Digite um email valido.'),
  message: z
    .string()
    .trim()
    .min(12, 'Escreva uma mensagem com pelo menos 12 caracteres.')
    .max(600, 'A mensagem deve ter no maximo 600 caracteres.'),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactPanel() {
  const { setCursorVariant } = useSpaceStore()
  const { active: sent, trigger } = useTemporaryFlag(3500)
  const linkCursor = createCursorHandlers(setCursorVariant)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const messageValue = watch('message') ?? ''

  const onSubmit = async () => {
    trigger()
    reset()
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

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              label="Nome"
              error={errors.name?.message}
              input={
                <input
                  type="text"
                  placeholder="Seu nome"
                  aria-invalid={Boolean(errors.name)}
                  {...register('name')}
                  className={getFieldClassName(Boolean(errors.name))}
                />
              }
            />

            <FormField
              label="Email"
              error={errors.email?.message}
              input={
                <input
                  type="email"
                  placeholder="voce@email.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register('email')}
                  className={getFieldClassName(Boolean(errors.email))}
                />
              }
            />
          </div>

          <FormField
            label="Mensagem"
            error={errors.message?.message}
            helperText={`${messageValue.trim().length}/600 caracteres`}
            input={
              <textarea
                placeholder="Conte brevemente sobre a oportunidade, projeto ou ideia."
                rows={5}
                aria-invalid={Boolean(errors.message)}
                {...register('message')}
                className={getFieldClassName(Boolean(errors.message), 'rounded-[22px] resize-none min-h-[152px]')}
              />
            }
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            {...linkCursor}
            disabled={isSubmitting}
            className={cn(
              'px-4 py-3 rounded-2xl panel-cta font-medium text-sm cursor-none transition-colors',
              isSubmitting && 'opacity-70',
            )}
          >
            {sent ? '✓ Mensagem recebida!' : isSubmitting ? 'Validando...' : 'Enviar mensagem'}
          </motion.button>
        </form>
      </PanelSection>
    </motion.div>
  )
}

function FormField({
  label,
  input,
  error,
  helperText,
}: {
  label: string
  input: React.ReactNode
  error?: string
  helperText?: string
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono-space text-[11px] uppercase tracking-[0.18em] text-(--text-secondary)">
        {label}
      </span>
      {input}
      <div className="flex min-h-[1.25rem] items-start justify-between gap-3">
        <span className={cn('text-xs leading-5', error ? 'text-[#FF9A52]' : 'text-(--text-muted)')}>
          {error ?? ''}
        </span>
        {helperText && (
          <span className="text-[11px] leading-5 text-(--text-muted)">
            {helperText}
          </span>
        )}
      </div>
    </label>
  )
}

function getFieldClassName(hasError: boolean, extraClassName?: string) {
  return cn(
    'px-4 py-3 rounded-2xl panel-input text-sm transition-colors cursor-none',
    hasError && 'border-[#FF9A52] shadow-[0_0_0_1px_rgba(255,154,82,0.28)]',
    extraClassName,
  )
}
