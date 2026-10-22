import type { Metadata } from 'next';
import InternshipsPageClient from './InternshipsPageClient';

export const metadata: Metadata = {
  title: 'Internships',
  description: 'Hands-on experience gained through internship programs.',
};

export default function InternshipsPage() {
  return <InternshipsPageClient />;
}
