import { z } from 'zod';

export const createCertificateSchema = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().max(150).optional(),
  issueDate: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  displayOrder: z.coerce.number().int().default(0),
});

export const updateCertificateSchema = createCertificateSchema.partial();

export type CreateCertificateInput = z.infer<typeof createCertificateSchema>;
export type UpdateCertificateInput = z.infer<typeof updateCertificateSchema>;
