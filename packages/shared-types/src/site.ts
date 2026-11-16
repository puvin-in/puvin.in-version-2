import type { ServiceSummaryDto, SkillDto } from './content.js';

export interface SocialLink {
  platform: string;
  url: string;
  label?: string;
}

export interface ProfileDto {
  displayName: string;
  headline: string;
  /** Rotating role titles for the hero animation. */
  roles: string[];
  heroIntro: string[];
  aboutSummary: string[];
  highlights: string[];
  availability: { available: boolean; label: string };
  email?: string;
  phone?: string;
  location?: string;
  social: SocialLink[];
  photoUrl?: string;
  resumeUrl?: string;
}

export interface BrandingDto {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  colors: {
    accent: string;
    accent2: string;
  };
}

export interface ProcessStep {
  title: string;
  description?: string;
}

export interface HomeContentDto {
  heroHeadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  process: ProcessStep[];
  contactCta: { heading: string; text: string };
}

export interface SeoDefaultsDto {
  siteTitle: string;
  titleTemplate: string;
  description: string;
  canonicalOrigin: string;
  indexable: boolean;
  defaultSocialImageUrl?: string;
}

/** Everything the public website needs to render global chrome and the homepage. */
export interface PublicSiteDto {
  branding: BrandingDto;
  profile: ProfileDto;
  home: HomeContentDto;
  seo: SeoDefaultsDto;
  skills: SkillDto[];
  services: ServiceSummaryDto[];
  contentVersion: number;
}
