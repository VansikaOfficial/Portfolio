import type { Metadata } from 'next';
import ProjectsPageClient from './ProjectsPageClient';

export const metadata: Metadata = {
  title: 'Projects',
  description: "A collection of things I've built — data pipelines, dashboards, and machine learning systems.",
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
