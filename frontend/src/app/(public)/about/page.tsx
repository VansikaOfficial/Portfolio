import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, philosophy, and what drives my work in data and AI.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
