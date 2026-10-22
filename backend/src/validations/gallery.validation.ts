import { z } from 'zod';

export const createGallerySchema = z.object({
  title: z.string().max(200).optional(),
  caption: z.string().max(250).optional(),
  displayOrder: z.coerce.number().int().default(0),
});

export const updateGallerySchema = createGallerySchema.partial();

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
