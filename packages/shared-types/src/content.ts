export const CONTENT_STATUSES = [
  'draft',
  'pending_review',
  'scheduled',
  'published',
  'archived',
  'trashed',
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const SKILL_CATEGORIES = [
  'frontend',
  'backend',
  'database',
  'cloud',
  'tools',
  'other',
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  database: 'Database Technologies',
  cloud: 'Cloud and Deployment',
  tools: 'Developer Tools',
  other: 'Additional Technologies',
};

export interface SkillDto {
  id: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  /** Free-text proficiency supplied by the owner. Never a generated percentage. */
  proficiency?: string;
  displayOrder: number;
}

export interface ServiceSummaryDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  icon?: string;
  displayOrder: number;
}
