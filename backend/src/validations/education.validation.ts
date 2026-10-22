import { z } from 'zod';

export const createEducationSchema = z.object({
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(100),
  fieldOfStudy: z.string().max(100).optional(),
  cgpa: z.string().max(20).optional(),
  percentage: z.string().max(20).optional(),
  startYear: z.string().min(1).max(50),
  endYear: z.string().max(50).optional(),
  description: z.string().optional(),
  displayOrder: z.number().int().default(0),
});

export const updateEducationSchema = createEducationSchema.partial();

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
