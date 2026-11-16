import { Schema, model, type Types } from 'mongoose';
import { SKILL_CATEGORIES, type SkillCategory } from '@puvin/shared-types';

export interface Skill {
  _id: Types.ObjectId;
  name: string;
  category: SkillCategory;
  icon?: string;
  proficiency?: string;
  displayOrder: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<Skill>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    category: { type: String, required: true, enum: SKILL_CATEGORIES },
    icon: { type: String, maxlength: 60 },
    proficiency: { type: String, maxlength: 60 },
    displayOrder: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'skills' },
);

skillSchema.index({ category: 1, name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
skillSchema.index({ visible: 1, category: 1, displayOrder: 1 });

export const SkillModel = model<Skill>('Skill', skillSchema);
