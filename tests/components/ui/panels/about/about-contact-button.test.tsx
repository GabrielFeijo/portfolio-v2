import { AboutContactButton } from '@/components/ui/panels/about/about-contact-button'
import { fireEvent, render, screen } from '@testing-library/react'
import { Mail } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

describe('AboutContactButton', () => {
  it('renders correctly and handles external link', () => {
    const setCursorVariant = vi.fn()
    render(
      <AboutContactButton
        href="https://github.com"
        icon={Mail}
        label="GitHub"
        setCursorVariant={setCursorVariant}
      />
    )

    const link = screen.getByRole('link', { name: /GitHub/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com')
    expect(link).toHaveAttribute('target', '_blank')

    fireEvent.mouseEnter(link)
    expect(setCursorVariant).toHaveBeenCalledWith('link')

    fireEvent.mouseLeave(link)
    expect(setCursorVariant).toHaveBeenCalledWith('default')
  })

  it('renders mailto link correctly', () => {
    render(
      <AboutContactButton
        href="mailto:test@example.com"
        icon={Mail}
        label="Mail"
        setCursorVariant={vi.fn()}
      />
    )
    const link = screen.getByRole('link', { name: /Mail/i })
    expect(link).not.toHaveAttribute('target')
  })
})
