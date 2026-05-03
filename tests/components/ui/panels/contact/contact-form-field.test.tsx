import { ContactFormField, getContactFieldClassName } from '@/components/ui/panels/contact/contact-form-field'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('ContactFormField', () => {
  it('renders helper text without an error', () => {
    render(
      <ContactFormField
        label="Name"
        helperText="Optional"
        input={<input aria-label="Name input" />}
      />
    )

    expect(screen.getByText('Optional')).toBeInTheDocument()
  })

  it('builds field class names for neutral and error states', () => {
    expect(getContactFieldClassName(false, 'extra')).toContain('extra')
    expect(getContactFieldClassName(false)).not.toContain('border-[#FF9A52]')
    expect(getContactFieldClassName(true)).toContain('border-[#FF9A52]')
  })
})
