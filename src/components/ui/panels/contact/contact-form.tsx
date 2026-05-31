import { submitContactForm } from '@/lib/contact-api'
import { contactFormSchema, type ContactFormValues } from '@/schemas/contact-form-schema'
import type { CursorVariant } from '@/types/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { createCursorHandlers } from '../panel-primitives'
import { useTemporaryFlag } from '../use-temporary-flag'
import { ContactFormField, getContactFieldClassName } from './contact-form-field'

interface ContactFormProps {
  setCursorVariant: (variant: CursorVariant) => void
}

export function ContactForm({ setCursorVariant }: ContactFormProps) {
  const { t } = useTranslation()
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

  const messageValue = watch('message')
  const resolveErrorMessage = (message?: string) =>
    message ? t(message, { defaultValue: message }) : undefined

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null)

    try {
      await submitContactForm(values)
      trigger()
      reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t('contact.form.error_fallback'))
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <ContactFormField
          errorId="contact-name-error"
          label={t('contact.form.name')}
          error={resolveErrorMessage(errors.name?.message)}
          input={
            <input
              type="text"
              placeholder={t('contact.form.name_placeholder')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby="contact-name-error"
              {...register('name')}
              className={getContactFieldClassName(Boolean(errors.name))}
            />
          }
        />

        <ContactFormField
          errorId="contact-email-error"
          label={t('contact.form.email')}
          error={resolveErrorMessage(errors.email?.message)}
          input={
            <input
              type="email"
              placeholder={t('contact.form.email_placeholder')}
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
        label={t('contact.form.message')}
        error={
          resolveErrorMessage(errors.message?.message) ??
          resolveErrorMessage(submitError ?? undefined)
        }
        helperText={`${messageValue.trim().length}/600 ${t('contact.form.characters')}`}
        input={
          <textarea
            placeholder={t('contact.form.message_placeholder')}
            rows={5}
            aria-invalid={Boolean(errors.message)}
            aria-describedby="contact-message-error"
            {...register('message')}
            className={getContactFieldClassName(
              Boolean(errors.message),
              'min-h-38 resize-none rounded-[22px]'
            )}
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
        {sent
          ? t('contact.form.sent')
          : isSubmitting
            ? t('contact.form.sending')
            : t('contact.send_message')}
      </motion.button>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {sent && t('contact.form.sent')}
        {isSubmitting && t('contact.form.sending')}
        {submitError && submitError}
      </div>
    </form>
  )
}
