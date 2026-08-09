import { SkillBar } from '@/components/ui/panels/skills/skill-bar';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('SkillBar', () => {
  it('renders a skill without subjective proficiency labels', () => {
    const skill = { name: 'React', color: '#fff' };
    render(<SkillBar delay={0} skill={skill} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText(/skills\.levels\./)).not.toBeInTheDocument();
  });
});
