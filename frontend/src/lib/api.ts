import { api } from './axios';
import {
  ApiResponse,
  About,
  Skill,
  Project,
  Education,
  Experience,
  Internship,
  Certificate,
  GalleryItem,
  Blog,
  Testimonial,
  Setting,
  SocialLink,
  Resume,
} from '@/types';

const unwrap = <T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> =>
  promise.then((res) => res.data.data);

export const aboutApi = {
  get: () => unwrap<About>(api.get('/about')),
};

export const skillsApi = {
  list: () => unwrap<Skill[]>(api.get('/skills')),
};

export const projectsApi = {
  list: (params?: { featured?: boolean; status?: string }) =>
    unwrap<Project[]>(api.get('/projects', { params })),
  getBySlug: (slug: string) => unwrap<Project>(api.get(`/projects/slug/${slug}`)),
};

export const educationApi = {
  list: () => unwrap<Education[]>(api.get('/education')),
};

export const experienceApi = {
  list: () => unwrap<Experience[]>(api.get('/experience')),
};

export const internshipsApi = {
  list: () => unwrap<Internship[]>(api.get('/internships')),
};

export const certificatesApi = {
  list: () => unwrap<Certificate[]>(api.get('/certificates')),
};

export const galleryApi = {
  list: () => unwrap<GalleryItem[]>(api.get('/gallery')),
};

export const blogsApi = {
  list: () => unwrap<Blog[]>(api.get('/blogs')),
  getBySlug: (slug: string) => unwrap<Blog>(api.get(`/blogs/slug/${slug}`)),
};

export const testimonialsApi = {
  list: () => unwrap<Testimonial[]>(api.get('/testimonials')),
};

export const settingsApi = {
  get: () => unwrap<Setting>(api.get('/settings')),
};

export const socialLinksApi = {
  list: () => unwrap<SocialLink[]>(api.get('/social-links')),
};

export const resumeApi = {
  get: () => unwrap<Resume>(api.get('/resume')),
};

export const messagesApi = {
  create: (payload: { name: string; email: string; subject?: string; message: string }) =>
    unwrap(api.post('/messages', payload)),
};
