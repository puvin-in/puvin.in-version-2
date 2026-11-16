import { z } from 'zod';
import { contentStatusSchema } from './content.js';
import { hexColorSchema, linkHrefSchema, slugSchema } from './common.js';

const text = (max: number) => z.string().trim().max(max);

/** A link or media path, or empty to clear the field. */
export const optionalLinkSchema = z.union([z.literal(''), linkHrefSchema]).default('');

/* ---------- Content blocks: structured data, never stored HTML ---------- */

export const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), level: z.union([z.literal(2), z.literal(3)]).default(2), text: text(200).min(1) }),
  z.object({ type: z.literal('paragraph'), text: text(10_000).min(1) }),
  z.object({ type: z.literal('list'), ordered: z.boolean().default(false), items: z.array(text(600)).min(1).max(100) }),
  z.object({ type: z.literal('quote'), text: text(1000).min(1), cite: text(200).default('') }),
  z.object({ type: z.literal('code'), language: text(40).default(''), code: z.string().max(20_000).min(1) }),
  z.object({ type: z.literal('image'), url: linkHrefSchema, alt: text(300).default(''), caption: text(300).default('') }),
  z.object({ type: z.literal('video'), url: linkHrefSchema, caption: text(300).default('') }),
  z.object({ type: z.literal('divider') }),
]);

export type ContentBlock = z.infer<typeof blockSchema>;

const seoSchema = z
  .object({
    title: text(120).default(''),
    description: text(320).default(''),
    image: optionalLinkSchema,
    canonical: optionalLinkSchema,
    noindex: z.boolean().default(false),
  })
  .default({ title: '', description: '', image: '', canonical: '', noindex: false });

const baseContent = {
  title: text(160).min(1),
  slug: z.union([z.literal(''), slugSchema]).default(''),
  summary: text(600).default(''),
  blocks: z.array(blockSchema).max(500).default([]),
  featuredImage: optionalLinkSchema,
  status: contentStatusSchema.default('draft'),
  scheduledAt: z.union([z.literal(''), z.null(), z.coerce.date()]).optional(),
  seo: seoSchema,
};

const stringList = (max: number, length = 80) => z.array(text(length).min(1)).max(max).default([]);

export const postInputSchema = z.object({
  ...baseContent,
  categories: stringList(10),
  tags: stringList(30),
  featured: z.boolean().default(false),
  allowComments: z.boolean().default(false),
});

export const projectInputSchema = z.object({
  ...baseContent,
  category: text(80).default(''),
  technologies: stringList(40),
  liveUrl: optionalLinkSchema,
  repoUrl: optionalLinkSchema,
  client: text(120).default(''),
  year: text(10).default(''),
  role: text(120).default(''),
  problem: text(3000).default(''),
  solution: text(3000).default(''),
  outcomes: text(3000).default(''),
  gallery: z.array(linkHrefSchema).max(40).default([]),
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(10_000).default(0),
});

export const serviceCmsInputSchema = z.object({
  ...baseContent,
  icon: text(60).default(''),
  features: stringList(30, 200),
  technologies: stringList(40),
  faqs: z.array(z.object({ q: text(300).min(1), a: text(2000).min(1) })).max(30).default([]),
  displayOrder: z.coerce.number().int().min(0).max(10_000).default(0),
});

export const pageInputSchema = z.object({
  ...baseContent,
  showInNav: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(10_000).default(0),
});

/* ---------- Public forms ---------- */

export const contactInputSchema = z.object({
  name: text(120).min(1, 'Required'),
  email: z.string().trim().email().max(254),
  subject: text(200).default(''),
  message: text(5000).min(1, 'Required'),
  website: z.string().max(200).default(''),
  elapsedMs: z.coerce.number().optional(),
});

export const commentInputSchema = z.object({
  postId: z.string().regex(/^[a-f0-9]{24}$/i),
  name: text(120).min(1, 'Required'),
  email: z.string().trim().email().max(254),
  message: text(3000).min(1, 'Required'),
  website: z.string().max(200).default(''),
  elapsedMs: z.coerce.number().optional(),
});

export const newsletterInputSchema = z.object({
  email: z.string().trim().email().max(254),
  website: z.string().max(200).default(''),
  elapsedMs: z.coerce.number().optional(),
});

/* ---------- Immersive theme settings ---------- */

export const HERO_SCENES = ['particles', 'crt', 'globe', 'orbit'] as const;
export const PERFORMANCE_MODES = ['high', 'medium', 'saver'] as const;
export const DISPLAY_FONTS = ['Big Shoulders Display', 'Anton', 'Oswald', 'Bebas Neue'] as const;
export const BODY_FONTS = ['Inter', 'Manrope', 'DM Sans'] as const;

export const themeSchema = z.object({
  colors: z.object({
    background: hexColorSchema,
    surface: hexColorSchema,
    surfaceRaised: hexColorSchema,
    text: hexColorSchema,
    muted: hexColorSchema,
    border: hexColorSchema,
    accent: hexColorSchema,
    success: hexColorSchema,
  }),
  displayFont: z.enum(DISPLAY_FONTS),
  bodyFont: z.enum(BODY_FONTS),
  nav: z.array(z.object({ label: text(40).min(1), href: linkHrefSchema })).min(1).max(12),
  footerText: text(300),
  heroSubtitle: text(300),
  showStats: z.boolean(),
  portraitUrl: linkHrefSchema,
  defaultScene: z.enum(HERO_SCENES),
  enabledScenes: z.array(z.enum(HERO_SCENES)).min(1),
  webglEnabled: z.boolean(),
  defaultPerformance: z.enum(PERFORMANCE_MODES),
  particleDensity: z.coerce.number().min(0.25).max(1.5),
  animations: z.boolean(),
  cursor: z.boolean(),
  pageTransitions: z.boolean(),
  loaderEnabled: z.boolean(),
  loaderTitle: text(40).min(1),
  showComments: z.boolean(),
  showNewsletter: z.boolean(),
  showRelated: z.boolean(),
});

export type ThemeSettings = z.infer<typeof themeSchema>;

export const DEFAULT_THEME: ThemeSettings = {
  colors: {
    background: '#080808',
    surface: '#101010',
    surfaceRaised: '#181818',
    text: '#F5F5F3',
    muted: '#A3A3A3',
    border: '#2A2A2A',
    accent: '#FD4766',
    success: '#A3E635',
  },
  displayFont: 'Big Shoulders Display',
  bodyFont: 'Inter',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about/' },
    { label: 'Projects', href: '/portfolio/' },
    { label: 'Services', href: '/services/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Contact', href: '/contact/' },
  ],
  footerText: 'Full Stack Developer specializing in building fast, scalable, and user-friendly web applications.',
  heroSubtitle: 'Full-stack development, thoughtful interfaces, scalable systems and creative web experiences.',
  showStats: true,
  portraitUrl: '/assets/img/portrait.png',
  defaultScene: 'particles',
  enabledScenes: ['particles', 'crt', 'globe', 'orbit'],
  webglEnabled: true,
  defaultPerformance: 'high',
  particleDensity: 1,
  animations: true,
  cursor: true,
  pageTransitions: true,
  loaderEnabled: true,
  loaderTitle: 'PUVIN.IN',
  showComments: true,
  showNewsletter: true,
  showRelated: true,
};

/* ---------- Users ---------- */

/** Long enough to resist guessing; no composition rules (NIST SP 800-63B). */
export const passwordSchema = z.string().min(12, 'Use at least 12 characters').max(200);

export const redirectInputSchema = z.object({
  from: z.string().trim().max(500).regex(/^\/(?!\/)/, 'Must start with /'),
  to: linkHrefSchema,
  code: z.union([z.literal(301), z.literal(302)]).default(301),
});
