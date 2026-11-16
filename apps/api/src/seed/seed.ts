import {
  brandingSchema,
  homeContentSchema,
  profileSchema,
  seoDefaultsSchema,
  serviceInputSchema,
  skillInputSchema,
} from '@puvin/shared-validation';
import { ServiceModel } from '../modules/services/service.model.js';
import { OWNER_PROFILE_ID, ProfileModel } from '../modules/site/profile.model.js';
import { SITE_SETTINGS_ID, SiteSettingsModel } from '../modules/site/site-settings.model.js';
import { SkillModel } from '../modules/skills/skill.model.js';
import * as content from './verified-content.js';

export interface SeedReport {
  settings: 'created' | 'kept';
  profile: 'created' | 'kept';
  skillsCreated: number;
  servicesCreated: number;
}

/**
 * Idempotent: only inserts what is missing (`$setOnInsert`), so re-running it never
 * overwrites content an editor has changed in the CMS.
 */
export async function seedInitialContent(): Promise<SeedReport> {
  await Promise.all([
    SiteSettingsModel.syncIndexes(),
    ProfileModel.syncIndexes(),
    SkillModel.syncIndexes(),
    ServiceModel.syncIndexes(),
  ]);

  const settingsResult = await SiteSettingsModel.updateOne(
    { _id: SITE_SETTINGS_ID },
    {
      $setOnInsert: {
        branding: brandingSchema.parse(content.branding),
        home: homeContentSchema.parse(content.home),
        seo: seoDefaultsSchema.parse(content.seo),
        contentVersion: 1,
      },
    },
    { upsert: true, runValidators: true },
  );

  const profileResult = await ProfileModel.updateOne(
    { _id: OWNER_PROFILE_ID },
    { $setOnInsert: profileSchema.parse(content.profile) },
    { upsert: true, runValidators: true },
  );

  const skillOps = content.skills.flatMap(({ category, names }) =>
    names.map((name, index) => {
      const skill = skillInputSchema.parse({ name, category, displayOrder: index });
      return {
        updateOne: {
          filter: { category: skill.category, name: skill.name },
          update: { $setOnInsert: skill },
          upsert: true,
          collation: { locale: 'en', strength: 2 },
        },
      };
    }),
  );
  const skillsResult = await SkillModel.bulkWrite(skillOps);

  const now = new Date();
  const serviceOps = content.services.map((service, index) => {
    const parsed = serviceInputSchema.parse({ ...service, displayOrder: index, status: 'published' });
    return {
      updateOne: {
        filter: { slug: parsed.slug },
        update: { $setOnInsert: { ...parsed, publishedAt: now } },
        upsert: true,
      },
    };
  });
  const servicesResult = await ServiceModel.bulkWrite(serviceOps);

  return {
    settings: settingsResult.upsertedCount ? 'created' : 'kept',
    profile: profileResult.upsertedCount ? 'created' : 'kept',
    skillsCreated: skillsResult.upsertedCount,
    servicesCreated: servicesResult.upsertedCount,
  };
}
