import { z } from 'zod'

export const contactFormSchema = z.object({
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

export type ContactFormValues = z.infer<typeof contactFormSchema>
