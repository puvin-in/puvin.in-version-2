import { z } from 'zod';

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens');

/** http(s) only, so javascript:/data: URLs can never be stored as links. */
export const httpUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .url()
  .refine((value) => /^https?:\/\//i.test(value), 'Only http and https URLs are allowed');

/** A site-relative path (`/about`, `#contact`) or an absolute http(s) URL. */
export const linkHrefSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => /^(\/(?!\/)|#|https?:\/\/|mailto:)/i.test(value),
    'Use a site path, #anchor, http(s) URL or mailto: link',
  );

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex colour such as #7C3AED');

export const objectIdSchema = z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid id');

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
