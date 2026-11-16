import { z } from 'zod';
import { CONTENT_STATUSES, SKILL_CATEGORIES } from '@puvin/shared-types';
import { slugSchema } from './common.js';

export const contentStatusSchema = z.enum(CONTENT_STATUSES);

export const skillInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  category: z.enum(SKILL_CATEGORIES),
  icon: z.string().trim().max(60).optional(),
  proficiency: z.string().trim().max(60).optional(),
  displayOrder: z.number().int().min(0).max(10_000).default(0),
  visible: z.boolean().default(true),
});

export const serviceInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: slugSchema,
  summary: z.string().trim().max(400).default(''),
  icon: z.string().trim().max(60).optional(),
  displayOrder: z.number().int().min(0).max(10_000).default(0),
  status: contentStatusSchema.default('draft'),
});

export type SkillInput = z.infer<typeof skillInputSchema>;
export type ServiceInput = z.infer<typeof serviceInputSchema>;
