import { UIBadge, UIButton, UIIconTile, UIInset, UISurface } from '@/components/ui/design-system'
import { render, screen } from '@testing-library/react'
import { Orbit } from 'lucide-react'
import { describe, expect, it } from 'vitest'

describe('DesignSystem', () => {
  it('UISurface renders correctly', () => {
    const { container, rerender } = render(<UISurface>Content</UISurface>)
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('ds-surface')
    
    rerender(<UISurface strong>Content</UISurface>)
    expect(container.firstChild).toHaveClass('ds-surface-strong')
  })

  it('UIInset renders correctly', () => {
    const { container } = render(<UIInset>Content</UIInset>)
    expect(container.firstChild).toHaveClass('ds-inset')
  })

  it('UIBadge renders correctly with tones', () => {
    const { container, rerender } = render(<UIBadge>Cool</UIBadge>)
    expect(container.firstChild).toHaveClass('ds-badge')
    
    rerender(<UIBadge tone="warm">Warm</UIBadge>)
    expect(container.firstChild).toHaveClass('ds-badge-warm')
    
    rerender(<UIBadge tone="danger">Danger</UIBadge>)
    expect(container.firstChild).toHaveClass('ds-badge-danger')
  })

  it('UIIconTile renders correctly', () => {
    const { container, rerender } = render(<UIIconTile icon={Orbit} />)
    expect(container.firstChild).toHaveClass('ds-icon-tile')
    
    rerender(<UIIconTile icon={Orbit} tone="warm" />)
    expect(container.firstChild).toHaveClass('ds-icon-tile-warm')
  })

  it('UIButton renders variants', () => {
    const { container, rerender } = render(<UIButton>Secondary</UIButton>)
    expect(container.firstChild).toHaveClass('ds-button-secondary')
    
    rerender(<UIButton variant="primary">Primary</UIButton>)
    expect(container.firstChild).toHaveClass('ds-button-primary')
  })
})
