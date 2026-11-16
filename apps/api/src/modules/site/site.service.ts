import type {
  ProfileDto,
  PublicSiteDto,
  ServiceSummaryDto,
  SkillDto,
} from '@puvin/shared-types';
import { AppError } from '../../core/errors.js';
import { ServiceModel } from '../services/service.model.js';
import { SkillModel } from '../skills/skill.model.js';
import { OWNER_PROFILE_ID, ProfileModel } from './profile.model.js';
import { SITE_SETTINGS_ID, SiteSettingsModel } from './site-settings.model.js';

/** Builds the payload for global chrome + homepage. Only published / visible content. */
export async function getPublicSite(): Promise<PublicSiteDto> {
  const [settings, profile, skills, services] = await Promise.all([
    SiteSettingsModel.findById(SITE_SETTINGS_ID).lean(),
    ProfileModel.findById(OWNER_PROFILE_ID)
      .select('-_id -__v -createdAt -updatedAt')
      .lean<ProfileDto>(),
    SkillModel.find({ visible: true }).sort({ category: 1, displayOrder: 1, name: 1 }).lean(),
    ServiceModel.find({ status: 'published' })
      .sort({ displayOrder: 1, title: 1 })
      .lean(),
  ]);

  if (!settings || !profile) {
    throw new AppError(
      503,
      'SERVICE_UNAVAILABLE',
      'Site content has not been initialised yet. Run `npm run seed`.',
    );
  }

  return {
    branding: settings.branding,
    home: settings.home,
    seo: settings.seo,
    profile,
    contentVersion: settings.contentVersion,
    skills: skills.map(
      (s): SkillDto => ({
        id: s._id.toString(),
        name: s.name,
        category: s.category,
        displayOrder: s.displayOrder,
        ...(s.icon ? { icon: s.icon } : {}),
        ...(s.proficiency ? { proficiency: s.proficiency } : {}),
      }),
    ),
    services: services.map(
      (s): ServiceSummaryDto => ({
        id: s._id.toString(),
        title: s.title,
        slug: s.slug,
        summary: s.summary,
        displayOrder: s.displayOrder,
        ...(s.icon ? { icon: s.icon } : {}),
      }),
    ),
  };
}
