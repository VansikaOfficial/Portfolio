import { z } from 'zod';
import { SkillCategory } from '@entities/Skill';

export const createSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100),
  percentage: z.number().min(0).max(100).default(50),
  level: z.string().max(50).optional(),
  category: z.nativeEnum(SkillCategory).default(SkillCategory.TOOLS),
  icon: z.string().max(100).optional(),
  color: z.string().max(20).optional(),
  displayOrder: z.number().int().default(0),
});

export const updateSkillSchema = createSkillSchema.partial();

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
