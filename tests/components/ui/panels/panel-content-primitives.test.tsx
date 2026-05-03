import {
  PanelBulletList,
  PanelImageFrame,
  PanelInsetCard,
  PanelNotice,
  PanelTag,
  PanelTagList,
  PanelTopGlow,
} from '@/components/ui/panels/panel-content-primitives'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('panel-content-primitives', () => {
  it('PanelTag renders content', () => {
    render(<PanelTag className="custom">React</PanelTag>)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('React')).toHaveClass('custom')
  })

  it('PanelTagList renders all items without limit', () => {
    render(<PanelTagList items={['A', 'B', 'C']} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('PanelTagList respects limit and shows hidden count', () => {
    render(<PanelTagList items={['A', 'B', 'C', 'D']} limit={2} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.queryByText('C')).not.toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('PanelBulletList renders items', () => {
    render(<PanelBulletList items={['First bullet', 'Second bullet']} />)
    expect(screen.getByText('First bullet')).toBeInTheDocument()
    expect(screen.getByText('Second bullet')).toBeInTheDocument()
  })

  it('PanelInsetCard renders children', () => {
    render(<PanelInsetCard>Inside Card</PanelInsetCard>)
    expect(screen.getByText('Inside Card')).toBeInTheDocument()
  })

  it('PanelTopGlow sets proper style', () => {
    const { container } = render(<PanelTopGlow color="#ff0000" />)
    const element = container.firstChild as HTMLElement
    expect(element.style.background).toMatch(
      /linear-gradient\(180deg, rgba\(255, 0, 0, 0\.13\d*\), transparent\)/
    )
  })

  it('PanelImageFrame renders image correctly', () => {
    render(
      <PanelImageFrame
        src="/test.jpg"
        alt="Test Image"
        className="image-class"
        style={{ zIndex: 10 }}
      />
    )
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.jpg')
    expect(img).toHaveAttribute('alt', 'Test Image')
    const wrapper = img.parentElement
    expect(wrapper).toHaveClass('image-class')
    expect(wrapper).toHaveStyle({ zIndex: 10 })
  })

  it('PanelNotice renders content', () => {
    render(<PanelNotice className="notice">Heads up</PanelNotice>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Heads up')).toHaveClass('notice')
  })
})
