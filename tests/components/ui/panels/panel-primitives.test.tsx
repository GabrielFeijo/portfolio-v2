import {
  cn,
  createCursorHandlers,
  getLucideIcon,
  PanelBadge,
  PanelHeader,
  PanelIconBadge,
  PanelIntroCard,
  PanelMetaChip,
  PanelSection,
} from '@/components/ui/panels/panel-primitives'
import { render, screen } from '@testing-library/react'
import { Clock, HelpCircle, User } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

describe('panel-primitives utilities', () => {
  it('cn safely joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
    expect(cn('a', false, null, undefined, 'c')).toBe('a c')
  })

  it('createCursorHandlers sets proper variants', () => {
    const setCursorVariant = vi.fn()
    const handlers = createCursorHandlers(setCursorVariant, 'planet')

    handlers.onMouseEnter()
    expect(setCursorVariant).toHaveBeenCalledWith('planet')

    handlers.onMouseLeave()
    expect(setCursorVariant).toHaveBeenCalledWith('default')
  })

  it('createCursorHandlers defaults to link variant', () => {
    const setCursorVariant = vi.fn()
    const handlers = createCursorHandlers(setCursorVariant)

    handlers.onMouseEnter()
    expect(setCursorVariant).toHaveBeenCalledWith('link')
  })

  it('getLucideIcon returns mapped icon or default HelpCircle', () => {
    expect(getLucideIcon('User')).toBe(User)
    expect(getLucideIcon('Clock')).toBe(Clock)
    expect(getLucideIcon('UnknownIcon')).toBe(HelpCircle)
  })
})

describe('panel-primitives components', () => {
  it('PanelHeader renders with basic props', () => {
    render(<PanelHeader icon={User} eyebrow="TEST" title="Test Title" />)
    expect(screen.getByText('TEST')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('PanelHeader renders with description', () => {
    render(
      <PanelHeader
        icon={User}
        eyebrow="TEST"
        title="Test Title"
        description="Some helpful description"
      />
    )
    expect(screen.getByText('Some helpful description')).toBeInTheDocument()
  })

  it('PanelIntroCard renders correctly', () => {
    render(
      <PanelIntroCard
        icon={Clock}
        eyebrow="INTRO"
        title="Hello"
        ringClassName="custom-ring"
        glowClassName="custom-glow"
      >
        <div>Child Content</div>
      </PanelIntroCard>
    )
    expect(screen.getByText('INTRO')).toBeInTheDocument()
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('PanelSection renders correctly', () => {
    render(
      <PanelSection
        icon={Clock}
        eyebrow="SEC"
        title="Section Title"
        ringClassName="ring-class"
        glowClassName="glow-class"
      >
        <span>Section child</span>
      </PanelSection>
    )
    expect(screen.getByText('SEC')).toBeInTheDocument()
    expect(screen.getByText('Section child')).toBeInTheDocument()
  })

  it('PanelIconBadge styles support', () => {
    const { container } = render(
      <PanelIconBadge icon={User} className="bonus-class" style={{ color: 'red' }} />
    )
    expect(container.firstChild).toHaveClass('bonus-class')
    expect(container.firstChild).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('PanelMetaChip renders with and without icon', () => {
    const { rerender } = render(<PanelMetaChip>No Icon</PanelMetaChip>)
    expect(screen.getByText('No Icon')).toBeInTheDocument()

    rerender(<PanelMetaChip icon={User}>With Icon</PanelMetaChip>)
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })

  it('PanelBadge renders children', () => {
    render(<PanelBadge className="my-badge">Badge Content</PanelBadge>)
    expect(screen.getByText('Badge Content')).toBeInTheDocument()
  })
})
