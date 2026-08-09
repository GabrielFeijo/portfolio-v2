import { AccomplishmentCard } from '@/components/ui/panels/accomplishments/accomplishment-card';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockAccomplishment = {
  id: 'acc-1',
  icon: 'Award',
  color: '#ff0000',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AccomplishmentCard', () => {
  it('renders correctly', () => {
    render(
      <AccomplishmentCard accomplishment={mockAccomplishment as any} transition={{ delay: 0 }} />
    );
    expect(screen.getByText('accomplishments_items.acc-1.title')).toBeInTheDocument();
    expect(screen.getByText('accomplishments_items.acc-1.category')).toBeInTheDocument();
  });

  it('falls back to the award icon for unknown icon names', () => {
    render(
      <AccomplishmentCard
        accomplishment={{ ...mockAccomplishment, icon: 'UnknownIcon' } as any}
        transition={{ delay: 0 }}
      />
    );

    expect(screen.getByText('accomplishments_items.acc-1.title')).toBeInTheDocument();
  });
});
