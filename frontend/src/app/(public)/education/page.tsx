import type { Metadata } from 'next';
import EducationPageClient from './EducationPageClient';

export const metadata: Metadata = {
  title: 'Education',
  description: 'Academic background and qualifications.',
};

export default function EducationPage() {
  return <EducationPageClient />;
}
