import { contactFormSchema } from '@/schemas/contact-form-schema';
import { describe, expect, it } from 'vitest';

describe('contactFormSchema', () => {
  it('validates valid payload', () => {
    const parsed = contactFormSchema.parse({
      name: 'Gabriel Feijo',
      email: 'gabriel@example.com',
      message: 'Mensagem com mais de doze caracteres.',
    });

    expect(parsed.name).toBe('Gabriel Feijo');
  });

  it('rejects invalid payload', () => {
    const result = contactFormSchema.safeParse({ name: 'a', email: 'x', message: 'curta' });
    expect(result.success).toBe(false);
  });
});
