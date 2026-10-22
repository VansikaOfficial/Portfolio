import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Have a project, a question, or just want to say hi? Send a message.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
