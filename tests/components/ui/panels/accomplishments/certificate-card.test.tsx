import { CertificateCard } from '@/components/ui/panels/accomplishments/certificate-card';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockCertificate = {
  id: 'cert-1',
  name: 'Course',
  issuer: 'Platform',
  year: '2022',
  image: 'img.png',
  description: 'Desc',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, optionsOrValue?: any) => {
      if (typeof optionsOrValue === 'string') return optionsOrValue;
      return optionsOrValue?.defaultValue ?? key;
    },
  }),
}));

describe('CertificateCard', () => {
  it('renders correctly with image', () => {
    render(<CertificateCard certificate={mockCertificate as any} transition={{ delay: 0 }} />);
    expect(screen.getByText('Course')).toBeInTheDocument();
    expect(screen.getByAltText('Course')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('renders correctly without image and description', () => {
    render(
      <CertificateCard
        certificate={{ ...mockCertificate, image: undefined, description: undefined } as any}
        transition={{ delay: 0 }}
      />
    );
    expect(screen.getByText('Course')).toBeInTheDocument();
    expect(screen.queryByAltText('Course')).not.toBeInTheDocument();
  });
});
