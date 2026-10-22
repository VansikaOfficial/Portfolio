import { z } from 'zod';

export const createExperienceSchema = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(150),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().default(false),
  location: z.string().max(150).optional(),
  responsibilities: z.array(z.string()).default([]),
  skillsUsed: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(0),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
