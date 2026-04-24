import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { contactFormSchema, type ContactFormValues } from '@/schemas/contact-form-schema'
import { createCursorHandlers } from '../panel-primitives'
import { useTemporaryFlag } from '../use-temporary-flag'
import type { CursorVariant } from '@/types/store'
import { ContactFormField, getContactFieldClassName } from './contact-form-field'
import { submitContactForm } from '@/lib/contact-api'
import { useState } from 'react'

interface ContactFormProps {
  setCursorVariant: (variant: CursorVariant) => void
}

export function ContactForm({ setCursorVariant }: ContactFormProps) {
  const { active: sent, trigger } = useTemporaryFlag(3500)
  const [submitError, setSubmitError] = useState<string | null>(null)
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

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null)

    try {
      await submitContactForm(values)
      trigger()
      reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Nao foi possivel enviar sua mensagem agora.')
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <ContactFormField
          errorId="contact-name-error"
          label="Nome"
          error={errors.name?.message}
          input={
            <input
              type="text"
              placeholder="Seu nome"
              aria-invalid={Boolean(errors.name)}
              aria-describedby="contact-name-error"
              {...register('name')}
              className={getContactFieldClassName(Boolean(errors.name))}
            />
          }
        />

        <ContactFormField
          errorId="contact-email-error"
          label="Email"
          error={errors.email?.message}
          input={
            <input
              type="email"
              placeholder="voce@email.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby="contact-email-error"
              {...register('email')}
              className={getContactFieldClassName(Boolean(errors.email))}
            />
          }
        />
      </div>

      <ContactFormField
        errorId="contact-message-error"
        label="Mensagem"
        error={errors.message?.message ?? submitError ?? undefined}
        helperText={`${messageValue.trim().length}/600 caracteres`}
        input={
          <textarea
            placeholder="Conte brevemente sobre a oportunidade, projeto ou ideia."
            rows={5}
            aria-invalid={Boolean(errors.message)}
            aria-describedby="contact-message-error"
            {...register('message')}
            className={getContactFieldClassName(Boolean(errors.message), 'min-h-38 resize-none rounded-[22px]')}
          />
        }
      />

      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        {...linkCursor}
        disabled={isSubmitting}
        className={`px-4 py-3 rounded-2xl panel-cta font-medium text-sm cursor-none transition-colors ${isSubmitting ? 'opacity-70' : ''}`}
      >
        {sent ? '✓ Mensagem recebida!' : isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
      </motion.button>
    </form>
  )
}
