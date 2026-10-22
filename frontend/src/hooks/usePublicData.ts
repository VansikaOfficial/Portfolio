import { useQuery } from '@tanstack/react-query';
import {
  aboutApi,
  skillsApi,
  projectsApi,
  educationApi,
  experienceApi,
  internshipsApi,
  certificatesApi,
  galleryApi,
  blogsApi,
  testimonialsApi,
  settingsApi,
  socialLinksApi,
  resumeApi,
} from '@/lib/api';

export const useAbout = () => useQuery({ queryKey: ['about'], queryFn: aboutApi.get });

export const useSkills = () => useQuery({ queryKey: ['skills'], queryFn: skillsApi.list });

export const useProjects = (params?: { featured?: boolean; status?: string }) =>
  useQuery({ queryKey: ['projects', params], queryFn: () => projectsApi.list(params) });

export const useProjectBySlug = (slug: string) =>
  useQuery({ queryKey: ['project', slug], queryFn: () => projectsApi.getBySlug(slug), enabled: !!slug });

export const useEducation = () => useQuery({ queryKey: ['education'], queryFn: educationApi.list });

export const useExperience = () => useQuery({ queryKey: ['experience'], queryFn: experienceApi.list });

export const useInternships = () => useQuery({ queryKey: ['internships'], queryFn: internshipsApi.list });

export const useCertificates = () => useQuery({ queryKey: ['certificates'], queryFn: certificatesApi.list });

export const useGallery = () => useQuery({ queryKey: ['gallery'], queryFn: galleryApi.list });

export const useBlogs = () => useQuery({ queryKey: ['blogs'], queryFn: blogsApi.list });

export const useBlogBySlug = (slug: string) =>
  useQuery({ queryKey: ['blog', slug], queryFn: () => blogsApi.getBySlug(slug), enabled: !!slug });

export const useTestimonials = () => useQuery({ queryKey: ['testimonials'], queryFn: testimonialsApi.list });

export const useSettings = () => useQuery({ queryKey: ['settings'], queryFn: settingsApi.get });

export const useSocialLinks = () => useQuery({ queryKey: ['social-links'], queryFn: socialLinksApi.list });

export const useResume = () => useQuery({ queryKey: ['resume'], queryFn: resumeApi.get });
