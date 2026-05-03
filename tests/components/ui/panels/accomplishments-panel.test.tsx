import { AccomplishmentsPanel } from '@/components/ui/panels/accomplishments-panel'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockCertificates } = vi.hoisted(() => ({
  mockCertificates: [] as any[],
}))

vi.mock('@/data/portfolio', async () => {
    const actual = await vi.importActual('@/data/portfolio')
    return {
        ...actual,
        CERTIFICATES: mockCertificates,
        ACCOMPLISHMENTS: [{ id: '1', title: 'Acc 1', date: '2021', icon: 'User' }],
    }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('AccomplishmentsPanel', () => {
  beforeEach(() => {
    mockCertificates.length = 0
  })

  it('renders correctly without certificates', () => {
    render(<AccomplishmentsPanel />)
    expect(screen.getByText('planets.accomplishments.subtitle')).toBeInTheDocument()
    expect(screen.queryByText('accomplishments.section.title')).toBeNull()
  })

  it('renders with certificates', () => {
    mockCertificates.push({ id: 'c1', name: 'Cert 1', issuer: 'Issuer 1', date: '2021' })
    render(<AccomplishmentsPanel />)
    expect(screen.getByText('accomplishments.section.title')).toBeInTheDocument()
  })
})
