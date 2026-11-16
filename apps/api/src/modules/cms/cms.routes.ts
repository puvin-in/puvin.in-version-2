import { Router, type Request, type RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { model, Schema } from 'mongoose';
import multer from 'multer';
import sharp from 'sharp';
import { z } from 'zod';
import {
  brandingSchema, contactInputSchema, homeContentSchema, postInputSchema,
  profileSchema, projectInputSchema, seoDefaultsSchema, serviceCmsInputSchema,
} from '@puvin/shared-validation';
import { AppError, notFound } from '../../core/errors.js';
import { ProfileModel, OWNER_PROFILE_ID } from '../site/profile.model.js';
import { SiteSettingsModel, SITE_SETTINGS_ID } from '../site/site-settings.model.js';
import { PostModel, ProjectModel, ServiceModel, type Service } from '../services/service.model.js';
import { adminOnly, credentials, emailSchema, passwordHash, User } from './auth.js';

const status = z.enum(['draft', 'published', 'archived']).default('draft');
const content = {
  posts: { model: PostModel, input: postInputSchema.omit({ scheduledAt: true }).extend({ status }) },
  projects: { model: ProjectModel, input: projectInputSchema.omit({ scheduledAt: true }).extend({ status }) },
  services: { model: ServiceModel, input: serviceCmsInputSchema.omit({ scheduledAt: true }).extend({ status }) },
};

const Message = model('ContactMessage', new Schema({
  name: String, email: String, subject: String, message: String,
  read: { type: Boolean, default: false },
}, { timestamps: true }));
const Media = model('CmsMedia', new Schema({
  name: String, alt: { type: String, default: '' }, bytes: Number,
  image: { type: Buffer, required: true, select: false },
}, { timestamps: true }));
const settingsInput = z.object({ branding: brandingSchema, home: homeContentSchema, seo: seoDefaultsSchema });
const profileInput = profileSchema;
const userName = z.string().trim().min(1).max(120);
const userCreate = credentials.extend({ name: userName });
const userUpdate = userCreate.partial().extend({ email: emailSchema.optional(), active: z.boolean().optional() });
const altInput = z.object({ alt: z.string().trim().max(300) });

function id(req: Request) {
  return z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid ID').parse(req.params['id']);
}

function page(req: Request) {
  return z.coerce.number().int().min(1).max(100_000).default(1).parse(req.query['page']);
}

const pageSize = 24;
const serialise = (record: Service) => ({
  ...record.details, id: String(record._id), title: record.title, slug: record.slug,
  summary: record.summary, icon: record.icon ?? '', featuredImage: record.featuredImage ?? '',
  status: record.status, displayOrder: record.displayOrder, publishedAt: record.publishedAt,
});
const mediaUrl = (key: string) => '/api/v1/public/media/' + key;

export function cmsRouter(originCheck: RequestHandler, required: RequestHandler) {
  const router = Router();
  router.use(originCheck, required);

  for (const [key, resource] of Object.entries(content)) {
    const path = '/' + key;
    router.get(path, async (req, res) => {
      const data = await resource.model.find().sort({ updatedAt: -1, _id: -1 })
        .skip((page(req) - 1) * pageSize).limit(pageSize + 1).lean();
      res.json({ data: data.slice(0, pageSize).map(serialise), hasMore: data.length > pageSize });
    });
    const values = (body: unknown) => {
      const input = resource.input.parse(body);
      const { title, summary, status: nextStatus, featuredImage, ...details } = input;
      const slug = input.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 120).replace(/^-|-$/g, '');
      if (!slug) throw new AppError(400, 'VALIDATION_FAILED', 'Enter a slug for this title');
      return { title, summary, slug, status: nextStatus, featuredImage, details,
        displayOrder: 'displayOrder' in input ? input.displayOrder : 0,
        icon: 'icon' in input ? input.icon : '' };
    };
    router.post(path, async (req, res) => {
      const input = values(req.body);
      const saved = await resource.model.create({
        ...input, publishedAt: input.status === 'published' ? new Date() : undefined,
      });
      res.status(201).json({ data: serialise(saved) });
    });
    router.put(path + '/:id', async (req, res) => {
      const saved = await resource.model.findById(id(req));
      if (!saved) throw notFound();
      const input = values(req.body);
      if (input.status === 'published' && saved.status !== 'published') saved.publishedAt = new Date();
      saved.set(input);
      await saved.save();
      res.json({ data: serialise(saved) });
    });
  }

  router.get('/settings', async (_req, res) => {
    const [settings, profile] = await Promise.all([
      SiteSettingsModel.findById(SITE_SETTINGS_ID).select('branding home seo -_id').lean(),
      ProfileModel.findById(OWNER_PROFILE_ID).select('-_id -__v -createdAt -updatedAt').lean(),
    ]);
    if (!settings || !profile) throw notFound('Seeded site settings');
    res.json({ data: { ...settings, profile } });
  });
  router.put('/settings', async (req, res) => {
    const settings = settingsInput.parse(req.body);
    await SiteSettingsModel.updateOne({ _id: SITE_SETTINGS_ID }, {
      $set: settings, $inc: { contentVersion: 1 },
    }, { upsert: true, setDefaultsOnInsert: false });
    res.json({ data: settings });
  });
  router.put('/settings/profile', async (req, res) => {
    const profile = profileInput.parse(req.body);
    const existing = await ProfileModel.findById(OWNER_PROFILE_ID);
    await ProfileModel.replaceOne({ _id: OWNER_PROFILE_ID }, {
      _id: OWNER_PROFILE_ID, ...profile, ...(existing ? { createdAt: existing.createdAt } : {}),
    }, { upsert: true });
    res.json({ data: profile });
  });

  router.get('/users', adminOnly, async (req, res) => {
    const data = await User.find().sort({ email: 1 }).select('email name active owner')
      .skip((page(req) - 1) * pageSize).limit(pageSize + 1).lean();
    res.json({ data: data.slice(0, pageSize), hasMore: data.length > pageSize });
  });
  router.post('/users', adminOnly, async (req, res) => {
    const { password, ...user } = userCreate.parse(req.body);
    const saved = await User.create({ ...user, passwordHash: await passwordHash(password) });
    res.status(201).json({ data: { _id: saved.id, ...user, active: true, owner: false } });
  });
  router.patch('/users/:id', adminOnly, async (req, res) => {
    const { password, ...updates } = userUpdate.parse(req.body);
    const user = await User.findOneAndUpdate({ _id: id(req), owner: false }, {
      $set: { ...updates, ...(password ? { passwordHash: await passwordHash(password) } : {}) },
      $inc: { version: 1 },
    }, { returnDocument: 'after' }).select('email name active owner');
    if (!user) throw notFound('Staff account');
    res.json({ data: user });
  });

  router.get('/messages', async (req, res) => {
    const data = await Message.find().sort({ createdAt: -1, _id: -1 })
      .skip((page(req) - 1) * pageSize).limit(pageSize + 1).lean();
    res.json({ data: data.slice(0, pageSize), hasMore: data.length > pageSize });
  });
  router.patch('/messages/:id', async (req, res) => {
    const updates = z.object({ read: z.boolean() }).parse(req.body);
    const result = await Message.findByIdAndUpdate(id(req), updates, { returnDocument: 'after' });
    if (!result) throw notFound('Message');
    res.json({ data: result });
  });

  router.get('/media', async (req, res) => {
    const data = await Media.find().sort({ createdAt: -1, _id: -1 })
      .skip((page(req) - 1) * pageSize).limit(pageSize + 1).lean();
    res.json({ data: data.slice(0, pageSize).map(item => ({ ...item, url: mediaUrl(String(item._id)) })),
      hasMore: data.length > pageSize });
  });
  const upload = multer({ limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 1, fieldSize: 2048 } }).single('image');
  router.post('/media', (req, res, next) => upload(req, res, error => {
    if (!error) return next();
    if (error.code === 'LIMIT_FILE_SIZE') return next(new AppError(413, 'PAYLOAD_TOO_LARGE', 'Image exceeds 5 MiB'));
    return next(new AppError(400, 'BAD_REQUEST', 'Invalid image upload'));
  }), async (req, res) => {
    const { alt } = altInput.parse(req.body);
    if (!req.file) throw new AppError(400, 'BAD_REQUEST', 'Choose an image');
    let image: Buffer;
    try {
      const decoder = sharp(req.file.buffer, { limitInputPixels: 20_000_000 });
      const { format } = await decoder.metadata();
      if (!format || !['png', 'jpeg', 'webp'].includes(format)) throw new Error('Unsupported format');
      image = await decoder.rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp().toBuffer();
    } catch {
      throw new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Upload a valid PNG, JPEG, or WebP image up to 20 megapixels');
    }
    const saved = await Media.create({ name: req.file.originalname.slice(0, 240), alt, image, bytes: image.length });
    res.status(201).json({ data: { _id: saved.id, name: saved.name, alt, url: mediaUrl(saved.id) } });
  });
  router.patch('/media/:id', async (req, res) => {
    const saved = await Media.findByIdAndUpdate(id(req), altInput.parse(req.body), { returnDocument: 'after' });
    if (!saved) throw notFound('Image');
    res.json({ data: { ...saved.toObject(), url: mediaUrl(saved.id) } });
  });
  return router;
}

export function publicCmsRouter() {
  const router = Router();
  for (const [key, resource] of Object.entries(content)) {
    router.get('/' + key, async (req, res) => {
      const currentPage = page(req);
      const items = await resource.model.find({ status: 'published', deletedAt: null })
        .select('title slug summary featuredImage')
        .sort({ displayOrder: 1, publishedAt: -1, _id: -1 })
        .skip((currentPage - 1) * pageSize).limit(pageSize + 1).lean();
      res.json({ data: items.slice(0, pageSize), hasMore: items.length > pageSize });
    });
    router.get('/' + key + '/:slug', async (req, res) => {
      const item = await resource.model.findOne({ slug: req.params['slug'], status: 'published', deletedAt: null }).lean();
      if (!item) throw notFound();
      res.json({ data: serialise(item) });
    });
  }
  router.get('/media/:id', async (req, res) => {
    const item = await Media.findById(id(req)).select('+image');
    if (!item) throw notFound('Image');
    res.set('Cache-Control', 'public, max-age=86400').type('image/webp').send(item.image);
  });
  router.post('/contact', rateLimit({
    windowMs: 15 * 60_000,
    limit: 5,
    message: { error: { code: 'RATE_LIMITED', message: 'Please try again later' } },
  }), async (req, res) => {
    if (!req.is('application/json')) throw new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Send JSON');
    const { website, name, email, subject, message } = contactInputSchema.parse(req.body);
    if (!website) await Message.create({ name, email, subject, message });
    res.status(201).json({ data: { received: true } });
  });
  return router;
}
