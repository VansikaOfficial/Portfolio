import { z } from 'zod';

export const createSocialLinkSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().max(100).optional(),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const updateSocialLinkSchema = createSocialLinkSchema.partial();

export type CreateSocialLinkInput = z.infer<typeof createSocialLinkSchema>;
export type UpdateSocialLinkInput = z.infer<typeof updateSocialLinkSchema>;
