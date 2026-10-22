import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(1).max(150),
  designation: z.string().max(150).optional(),
  company: z.string().max(150).optional(),
  message: z.string().min(1),
  rating: z.number().min(1).max(5).default(5),
  isApproved: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
