import { ContactForm } from '@/components/ui/panels/contact/contact-form'
import { submitContactForm } from '@/lib/contact-api'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue || key,
  }),
}))

vi.mock('@/lib/contact-api', () => ({
  submitContactForm: vi.fn(),
}))

describe('ContactForm', () => {
  it('submits form successfully', async () => {
    vi.mocked(submitContactForm).mockResolvedValueOnce({} as any)
    const setCursorVariant = vi.fn()

    render(<ContactForm setCursorVariant={setCursorVariant} />)

    const nameInput = screen.getByPlaceholderText('contact.form.name_placeholder')
    const emailInput = screen.getByPlaceholderText('contact.form.email_placeholder')
    const messageInput = screen.getByPlaceholderText('contact.form.message_placeholder')
    const submitButton = screen.getByRole('button')

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(messageInput, {
        target: { value: 'Hello, this is a test message with enough length.' },
      })
      fireEvent.click(submitButton)
    })

    expect(submitContactForm).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, this is a test message with enough length.',
    })

    expect(screen.getAllByText('contact.form.sent')[0]).toBeInTheDocument()
  })

  it('shows error state when submission fails', async () => {
    vi.mocked(submitContactForm).mockRejectedValueOnce(new Error('Network error'))
    const setCursorVariant = vi.fn()

    render(<ContactForm setCursorVariant={setCursorVariant} />)

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('contact.form.name_placeholder'), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByPlaceholderText('contact.form.email_placeholder'), {
        target: { value: 'j@e.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('contact.form.message_placeholder'), {
        target: { value: 'Message length enough' },
      })
      fireEvent.click(screen.getByRole('button'))
    })

    expect((await screen.findAllByText('Network error'))[0]).toBeInTheDocument()
  })

  it('uses fallback error text for non-error rejections', async () => {
    vi.mocked(submitContactForm).mockRejectedValueOnce('nope')
    const setCursorVariant = vi.fn()

    render(<ContactForm setCursorVariant={setCursorVariant} />)

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('contact.form.name_placeholder'), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByPlaceholderText('contact.form.email_placeholder'), {
        target: { value: 'j@e.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('contact.form.message_placeholder'), {
        target: { value: 'Message length enough' },
      })
      fireEvent.click(screen.getByRole('button'))
    })

    expect((await screen.findAllByText('contact.form.error_fallback'))[0]).toBeInTheDocument()
  })
})
