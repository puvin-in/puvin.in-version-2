import { Schema, model, type Types } from 'mongoose';
import { CONTENT_STATUSES, type ContentStatus } from '@puvin/shared-types';

/**
 * Phase 1 holds the summary fields used on the homepage. Detail-page fields
 * (blocks, features, FAQs, SEO …) are added with the Services module in Phase 3.
 */
export interface Service {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  icon?: string;
  displayOrder: number;
  status: ContentStatus;
  publishedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<Service>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, lowercase: true, trim: true, maxlength: 120 },
    summary: { type: String, default: '', maxlength: 400 },
    icon: { type: String, maxlength: 60 },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: CONTENT_STATUSES, default: 'draft' },
    publishedAt: Date,
    deletedAt: Date,
  },
  { timestamps: true, collection: 'services', optimisticConcurrency: true },
);

// Like WordPress, trashing renames the slug to `<slug>__trashed` so the original can be reused.
serviceSchema.index({ slug: 1 }, { unique: true });
serviceSchema.index({ status: 1, displayOrder: 1 });

export const ServiceModel = model<Service>('Service', serviceSchema);
