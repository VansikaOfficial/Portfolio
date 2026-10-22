import type { Metadata } from 'next';
import ResumePageClient from './ResumePageClient';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Download an up-to-date copy of my resume.',
};

export default function ResumePage() {
  return <ResumePageClient />;
}
