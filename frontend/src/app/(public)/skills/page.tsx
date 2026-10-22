import type { Metadata } from 'next';
import SkillsPageClient from './SkillsPageClient';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technologies and tools used across data analysis, machine learning, and AI engineering.',
};

export default function SkillsPage() {
  return <SkillsPageClient />;
}
