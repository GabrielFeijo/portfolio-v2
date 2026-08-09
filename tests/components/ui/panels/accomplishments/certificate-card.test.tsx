import { CertificateCard } from '@/components/ui/panels/accomplishments/certificate-card';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockCertificate = {
  id: 'cert-1',
  issuer: 'Platform',
  year: '2022',
  image: 'img.png',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CertificateCard', () => {
  it('renders correctly with image', () => {
    render(<CertificateCard certificate={mockCertificate as any} transition={{ delay: 0 }} />);
    expect(screen.getByText('certificates_items.cert-1.name')).toBeInTheDocument();
    expect(screen.getByAltText('certificates_items.cert-1.name')).toBeInTheDocument();
    expect(screen.getByText('certificates_items.cert-1.description')).toBeInTheDocument();
  });

  it('renders correctly without image and description', () => {
    render(
      <CertificateCard
        certificate={{ ...mockCertificate, image: undefined } as any}
        transition={{ delay: 0 }}
      />
    );
    expect(screen.getByText('certificates_items.cert-1.name')).toBeInTheDocument();
    expect(screen.queryByAltText('certificates_items.cert-1.name')).not.toBeInTheDocument();
  });
});
