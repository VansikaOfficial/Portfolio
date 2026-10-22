import { z } from 'zod';
import { ProjectStatus } from '@entities/Project';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  githubLink: z.string().url().optional().or(z.literal('')),
  liveDemoLink: z.string().url().optional().or(z.literal('')),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.COMPLETED),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
