/**
 * Initial CMS content for PUVIN.IN.
 *
 * Sources, so every value can be traced:
 *   [site]  copied verbatim from https://puvin.in as audited on 2026-11-04 (docs/BLUEPRINT.md §1.2)
 *   [brief] supplied by the owner in the project brief
 *   [draft] neutral starter wording derived from [site]/[brief]; the owner should review it
 *
 * Deliberately absent: contact email/phone, social profiles, photo, resume, projects and
 * testimonials. The old site only had theme-demo placeholders for these.
 */
import type { SkillCategory } from '@puvin/shared-types';
import type {
  BrandingInput,
  HomeContentInput,
  ProfileInput,
  SeoDefaultsInput,
} from '@puvin/shared-validation';

export const branding: BrandingInput = {
  brandName: 'PUVIN', // [brief]
  tagline: 'Full Stack Developer', // [site]
  colors: { accent: '#7C3AED', accent2: '#22D3EE' }, // [brief]
};

export const profile: ProfileInput = {
  displayName: 'Poornima Thanaraju', // [site]
  headline: 'Full Stack Developer', // [site]
  roles: ['Full Stack Developer'], // [site] — add more roles from the admin
  heroIntro: [
    // [site]
    "I'm a Full Stack Developer specializing in building fast, scalable, and user-friendly web applications.",
    'I build complete solutions from responsive frontends with React to powerful backends with Node.js, APIs & databases.',
  ],
  aboutSummary: [
    // [site]
    "I'm a passionate Full Stack Developer with a strong focus on creating efficient, scalable, and user-centric web applications. I love turning complex problems into simple, beautiful, and intuitive solutions.",
    'I work with both frontend and backend technologies to build complete products - from clean UI to powerful server-side logic, APIs, and databases. My goal is to build digital experiences that not only look great but also perform at the highest level.',
  ],
  highlights: [
    // [site]
    'End-to-End Development - From Frontend to Backend & Deployment',
    'Clean, Scalable Code with Modern Tech Stack',
    'Responsive Design & High Performance for All Devices',
    'On-Time Delivery with Lifetime Support & Maintenance',
  ],
  availability: { available: true, label: 'Available for freelance' }, // [site]
  social: [],
};

export const home: HomeContentInput = {
  heroHeadline: 'Building Powerful Digital Experiences with Modern Web Technologies.', // [brief]
  primaryCta: { label: 'Hire Me', href: '#contact' }, // [brief]
  // Points at services until the Portfolio module (Phase 3) has real projects to show.
  secondaryCta: { label: 'View Services', href: '#services' }, // [draft]
  process: ['Discovery', 'Planning', 'Design', 'Development', 'Testing', 'Deployment'].map(
    (title) => ({ title }),
  ), // [brief]
  contactCta: {
    heading: "Have An Idea? Let's Make It Real", // [site]
    text: "Let's Collaborate & Build Something Amazing", // [site]
  },
};

export const seo: SeoDefaultsInput = {
  siteTitle: 'PUVIN',
  titleTemplate: '%s | PUVIN',
  description:
    'Full Stack Developer specializing in building fast, scalable, and user-friendly web applications.', // [site]
  canonicalOrigin: 'https://puvin.in',
  // Stays off until launch so staging and unfinished pages are never indexed.
  indexable: false,
};

/** [site] — grouped exactly as the current site lists them. No proficiency levels are invented. */
export const skills: Array<{ category: SkillCategory; names: string[] }> = [
  { category: 'frontend', names: ['React.js', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'] },
  { category: 'backend', names: ['Node.js', 'Express.js', 'REST APIs', 'Authentication'] },
  { category: 'database', names: ['MongoDB', 'MySQL'] },
  { category: 'tools', names: ['Git', 'GitHub', 'Postman'] },
  { category: 'cloud', names: ['Vercel', 'cPanel', 'Hostinger'] },
];

/** Titles: [brief]. Summaries: [site] wording where it exists, otherwise [draft]. */
export const services = [
  {
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    icon: 'layers',
    summary: 'End-to-end development, from frontend to backend and deployment.',
  },
  {
    title: 'Frontend Application Development',
    slug: 'frontend-application-development',
    icon: 'monitor',
    summary: 'Responsive and interactive user interfaces that perform well on every device.',
  },
  {
    title: 'Backend API Development',
    slug: 'backend-api-development',
    icon: 'server',
    summary: 'REST APIs, authentication and server-side logic to power your application.',
  },
  {
    title: 'Database Architecture',
    slug: 'database-architecture',
    icon: 'database',
    summary: 'Data models and queries designed for MongoDB and MySQL.',
  },
  {
    title: 'Website Modernization',
    slug: 'website-modernization',
    icon: 'refresh-cw',
    summary: 'Rebuilding existing websites on a modern, maintainable stack.',
  },
  {
    title: 'Performance Optimization',
    slug: 'performance-optimization',
    icon: 'gauge',
    summary: 'Faster pages and leaner code for a better experience on every device.',
  },
  {
    title: 'Deployment and Maintenance',
    slug: 'deployment-and-maintenance',
    icon: 'rocket',
    summary: 'Deployment, monitoring and ongoing support and maintenance after launch.',
  },
];
