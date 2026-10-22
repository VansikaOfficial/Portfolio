import type { Metadata } from 'next';
import TestimonialsPageClient from './TestimonialsPageClient';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'What colleagues, clients, and collaborators have said about working with me.',
};

export default function TestimonialsPage() {
  return <TestimonialsPageClient />;
}
