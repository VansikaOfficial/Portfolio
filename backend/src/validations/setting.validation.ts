import { z } from 'zod';

export const updateSettingSchema = z.object({
  siteTitle: z.string().min(1).max(150).optional(),
  siteDescription: z.string().max(300).nullable().optional(),
  defaultTheme: z.enum(['light', 'dark', 'system']).optional(),
  primaryColor: z.string().max(20).nullable().optional(),
  metaTitle: z.string().max(200).nullable().optional(),
  metaDescription: z.string().max(300).nullable().optional(),
  metaKeywords: z.array(z.string()).optional(),
  googleAnalyticsId: z.string().nullable().optional(),
  maintenanceMode: z.boolean().optional(),
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
