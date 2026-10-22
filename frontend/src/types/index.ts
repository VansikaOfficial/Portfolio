export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface About {
  id: string;
  fullName: string;
  tagline: string;
  roles: string[];
  biography: string;
  careerObjective: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  availableForWork: boolean;
  currentStatus: string;
  languages: string[];
  interests: string[];
  profilePhoto: string | null;
  bannerImage: string | null;
  updatedAt: string;
}

export type SkillCategory =
  | 'Programming'
  | 'Databases'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Visualization'
  | 'Cloud'
  | 'Tools'
  | 'Frameworks'
  | 'Soft Skills';

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  level: string | null;
  category: SkillCategory;
  icon: string | null;
  color: string | null;
  displayOrder: number;
}

export type ProjectStatus = 'in_progress' | 'completed' | 'archived';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string | null;
  techStack: string[];
  githubLink: string | null;
  liveDemoLink: string | null;
  thumbnail: string | null;
  images: string[];
  status: ProjectStatus;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  cgpa: string | null;
  percentage: string | null;
  startYear: string;
  endYear: string | null;
  description: string | null;
  displayOrder: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string | null;
  responsibilities: string[];
  skillsUsed: string[];
  displayOrder: number;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string | null;
  skillsUsed: string[];
  certificateImage: string | null;
  displayOrder: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string | null;
  issueDate: string | null;
  credentialUrl: string | null;
  image: string;
  displayOrder: number;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  caption: string | null;
  image: string;
  displayOrder: number;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string | null;
  company: string | null;
  message: string;
  avatar: string | null;
  rating: number;
  isApproved: boolean;
}

export interface Setting {
  id: string;
  siteTitle: string;
  siteDescription: string | null;
  favicon: string | null;
  defaultTheme: string;
  primaryColor: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  ogImage: string | null;
  googleAnalyticsId: string | null;
  maintenanceMode: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  isVisible: boolean;
  displayOrder: number;
}

export interface Resume {
  id: string;
  filePath: string | null;
  originalName: string | null;
  version: string | null;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}
