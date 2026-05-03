import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'contact.form.validation.name_min'),
  email: z
    .string()
    .trim()
    .min(1, 'contact.form.validation.email_required')
    .email('contact.form.validation.email_invalid'),
  message: z
    .string()
    .trim()
    .min(12, 'contact.form.validation.message_min')
    .max(600, 'contact.form.validation.message_max'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
