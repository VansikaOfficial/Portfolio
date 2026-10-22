import { z } from 'zod';

export const updateAboutSchema = z.object({
  fullName: z.string().min(1).max(150).optional(),
  tagline: z.string().max(200).optional(),
  roles: z.array(z.string()).optional(),
  biography: z.string().optional(),
  careerObjective: z.string().optional(),
  location: z.string().max(150).nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  availableForWork: z.boolean().optional(),
  currentStatus: z.string().max(100).optional(),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

export type UpdateAboutInput = z.infer<typeof updateAboutSchema>;
