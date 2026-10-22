import ProjectDetailClient from './ProjectDetailClient';

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return <ProjectDetailClient slug={params.slug} />;
}
