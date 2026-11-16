import { z } from 'zod';
import { hexColorSchema, httpUrlSchema, linkHrefSchema } from './common.js';

const text = (max: number) => z.string().trim().max(max);

export const socialLinkSchema = z.object({
  platform: text(40).min(1),
  url: httpUrlSchema,
  label: text(80).optional(),
});

export const profileSchema = z.object({
  displayName: text(120).min(1),
  headline: text(160).min(1),
  roles: z.array(text(80).min(1)).max(10),
  heroIntro: z.array(text(400)).max(5),
  aboutSummary: z.array(text(1200)).max(12),
  highlights: z.array(text(200)).max(12),
  availability: z.object({ available: z.boolean(), label: text(80) }),
  email: z.string().trim().email().max(254).optional(),
  phone: text(40).optional(),
  location: text(120).optional(),
  social: z.array(socialLinkSchema).max(20),
  photoUrl: httpUrlSchema.optional(),
  resumeUrl: httpUrlSchema.optional(),
});

export const brandingSchema = z.object({
  brandName: text(60).min(1),
  tagline: text(160),
  logoUrl: httpUrlSchema.optional(),
  faviconUrl: httpUrlSchema.optional(),
  colors: z.object({ accent: hexColorSchema, accent2: hexColorSchema }),
});

const ctaSchema = z.object({ label: text(40).min(1), href: linkHrefSchema });

export const homeContentSchema = z.object({
  heroHeadline: text(160).min(1),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
  process: z
    .array(z.object({ title: text(60).min(1), description: text(300).optional() }))
    .max(12),
  contactCta: z.object({ heading: text(120), text: text(400) }),
});

export const seoDefaultsSchema = z.object({
  siteTitle: text(70).min(1),
  titleTemplate: text(80).refine((v) => v.includes('%s'), 'Template must contain %s'),
  description: text(320),
  canonicalOrigin: httpUrlSchema,
  indexable: z.boolean(),
  defaultSocialImageUrl: httpUrlSchema.optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type BrandingInput = z.infer<typeof brandingSchema>;
export type HomeContentInput = z.infer<typeof homeContentSchema>;
export type SeoDefaultsInput = z.infer<typeof seoDefaultsSchema>;
