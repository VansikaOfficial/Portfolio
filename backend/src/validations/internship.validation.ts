import { z } from 'zod';

export const createInternshipSchema = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(150),
  duration: z.string().min(1).max(100),
  description: z.string().optional(),
  skillsUsed: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(0),
});

export const updateInternshipSchema = createInternshipSchema.partial();

export type CreateInternshipInput = z.infer<typeof createInternshipSchema>;
export type UpdateInternshipInput = z.infer<typeof updateInternshipSchema>;
