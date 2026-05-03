import { AboutInfoPill } from '@/components/ui/panels/about/about-info-pill'
import { render, screen } from '@testing-library/react'
import { User } from 'lucide-react'
import { describe, expect, it } from 'vitest'

describe('AboutInfoPill', () => {
  it('renders label correctly', () => {
    render(<AboutInfoPill icon={User} label="Developer" />)
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })
})
