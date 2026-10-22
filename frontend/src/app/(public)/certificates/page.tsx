import type { Metadata } from 'next';
import CertificatesPageClient from './CertificatesPageClient';

export const metadata: Metadata = {
  title: 'Certificates',
  description: "Courses, specializations, and credentials I've completed.",
};

export default function CertificatesPage() {
  return <CertificatesPageClient />;
}
