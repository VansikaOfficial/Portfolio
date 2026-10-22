import type { MetadataRoute } from 'next';
import { projectsApi, blogsApi } from '@/lib/api';

const STATIC_ROUTES = [
  '',
  'about',
  'skills',
  'experience',
  'internships',
  'education',
  'projects',
  'certificates',
  'achievements',
  'blogs',
  'services',
  'testimonials',
  'resume',
  'gallery',
  'contact',
  'privacy-policy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));

  let projectEntries: MetadataRoute.Sitemap = [];
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const projects = await projectsApi.list();
    projectEntries = projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {
    // API may be unreachable at build time — sitemap still returns static routes
  }

  try {
    const blogs = await blogsApi.list();
    blogEntries = blogs
      .filter((b) => b.published)
      .map((b) => ({
        url: `${siteUrl}/blogs/${b.slug}`,
        lastModified: new Date(b.createdAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
  } catch {
    // API may be unreachable at build time — sitemap still returns static routes
  }

  return [...staticEntries, ...projectEntries, ...blogEntries];
}
