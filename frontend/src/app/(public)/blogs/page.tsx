import type { Metadata } from 'next';
import BlogsPageClient from './BlogsPageClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: "Notes on data, machine learning, and things I'm learning along the way.",
};

export default function BlogsPage() {
  return <BlogsPageClient />;
}
