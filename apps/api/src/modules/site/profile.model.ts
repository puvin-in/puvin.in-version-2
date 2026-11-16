import { Schema, model } from 'mongoose';
import type { ProfileDto } from '@puvin/shared-types';

export const OWNER_PROFILE_ID = 'owner';

/** Singleton portfolio-owner profile, edited from the admin dashboard. */
export interface Profile extends ProfileDto {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<Profile>(
  {
    _id: { type: String, default: OWNER_PROFILE_ID },
    displayName: { type: String, required: true, maxlength: 120 },
    headline: { type: String, required: true, maxlength: 160 },
    roles: { type: [String], default: [] },
    heroIntro: { type: [String], default: [] },
    aboutSummary: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    availability: {
      available: { type: Boolean, default: false },
      label: { type: String, default: '' },
    },
    email: String,
    phone: String,
    location: String,
    social: [new Schema({ platform: String, url: String, label: String }, { _id: false })],
    photoUrl: String,
    resumeUrl: String,
  },
  { timestamps: true, collection: 'profiles', optimisticConcurrency: true },
);

export const ProfileModel = model<Profile>('Profile', profileSchema);
