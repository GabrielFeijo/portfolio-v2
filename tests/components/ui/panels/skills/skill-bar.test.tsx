import { SkillBar } from '@/components/ui/panels/skills/skill-bar'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('SkillBar', () => {
  it('renders correctly for expert level', () => {
    const skill = { name: 'React', level: 96, color: '#fff' }
    render(<SkillBar delay={0} skill={skill} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('skills.levels.expert')).toBeInTheDocument()
  })

  it('renders correctly for advanced level', () => {
    const skill = { name: 'TS', level: 86, color: '#fff' }
    render(<SkillBar delay={0} skill={skill} />)
    expect(screen.getByText('skills.levels.advanced')).toBeInTheDocument()
  })

  it('renders correctly for proficient level', () => {
    const skill = { name: 'Node', level: 76, color: '#fff' }
    render(<SkillBar delay={0} skill={skill} />)
    expect(screen.getByText('skills.levels.proficient')).toBeInTheDocument()
  })

  it('renders correctly for intermediate level', () => {
    const skill = { name: 'Docker', level: 61, color: '#fff' }
    render(<SkillBar delay={0} skill={skill} />)
    expect(screen.getByText('skills.levels.intermediate')).toBeInTheDocument()
  })

  it('renders correctly for evolving level', () => {
    const skill = { name: 'Rust', level: 30, color: '#fff' }
    render(<SkillBar delay={0} skill={skill} />)
    expect(screen.getByText('skills.levels.evolving')).toBeInTheDocument()
  })
})
