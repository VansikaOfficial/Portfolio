import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(250),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
