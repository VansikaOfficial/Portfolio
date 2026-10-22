import type { Metadata } from 'next';
import ExperiencePageClient from './ExperiencePageClient';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Professional experience and work history.',
};

export default function ExperiencePage() {
  return <ExperiencePageClient />;
}
