import { Schema, model } from 'mongoose';
import type { BrandingDto, HomeContentDto, SeoDefaultsDto } from '@puvin/shared-types';

export const SITE_SETTINGS_ID = 'site';

/** Singleton document holding site-wide CMS settings. Grows section by section in later phases. */
export interface SiteSettings {
  _id: string;
  branding: BrandingDto;
  home: HomeContentDto;
  seo: SeoDefaultsDto;
  /** Bumped on every publish so caches can be invalidated by version. */
  contentVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const ctaSchema = new Schema({ label: String, href: String }, { _id: false });

const siteSettingsSchema = new Schema<SiteSettings>(
  {
    _id: { type: String, default: SITE_SETTINGS_ID },
    branding: {
      brandName: { type: String, required: true, maxlength: 60 },
      tagline: { type: String, default: '', maxlength: 160 },
      logoUrl: String,
      faviconUrl: String,
      colors: {
        accent: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
        accent2: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
      },
    },
    home: {
      heroHeadline: { type: String, required: true, maxlength: 160 },
      primaryCta: ctaSchema,
      secondaryCta: ctaSchema,
      process: [new Schema({ title: String, description: String }, { _id: false })],
      contactCta: { heading: String, text: String },
    },
    seo: {
      siteTitle: { type: String, required: true, maxlength: 70 },
      titleTemplate: { type: String, required: true },
      description: { type: String, default: '', maxlength: 320 },
      canonicalOrigin: { type: String, required: true },
      indexable: { type: Boolean, default: false },
      defaultSocialImageUrl: String,
    },
    contentVersion: { type: Number, default: 1 },
  },
  { timestamps: true, collection: 'site_settings', optimisticConcurrency: true },
);

export const SiteSettingsModel = model<SiteSettings>('SiteSettings', siteSettingsSchema);
