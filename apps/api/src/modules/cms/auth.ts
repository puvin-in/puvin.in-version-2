import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { Router, type RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { passwordSchema } from '@puvin/shared-validation';
import type { Env } from '../../config/env.js';
import { AppError } from '../../core/errors.js';

const derive = promisify(scrypt);
const token = () => randomBytes(32).toString('hex');
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const unauthorized = () => new AppError(401, 'UNAUTHENTICATED', 'Sign in with a valid account');
const sessionCookie = 'puvin_session';
const csrfCookie = 'puvin_xsrf';
const lifetime = 7 * 24 * 60 * 60 * 1000;
const idle = 30 * 60 * 1000;

export const emailSchema = z.email().trim().toLowerCase().max(254);
export const credentials = z.object({ email: emailSchema, password: passwordSchema });
const loginInput = credentials.extend({ password: z.string().min(1).max(200) });
export const User = model('CmsUser', new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true, select: false },
  active: { type: Boolean, default: true },
  owner: { type: Boolean, default: false },
  version: { type: Number, default: 0 },
}, { timestamps: true }));
const Session = model('CmsSession', new Schema({
  _id: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  version: { type: Number, required: true },
  csrf: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
  lastSeen: { type: Date, required: true },
}));

export async function passwordHash(password: string): Promise<string> {
  const salt = token();
  return salt + ':' + (await derive(password, salt, 64) as Buffer).toString('hex');
}

async function matches(password: string, stored?: string): Promise<boolean> {
  const [salt, key] = (stored ?? ('0'.repeat(64) + ':' + '0'.repeat(128))).split(':');
  const digest = await derive(password, salt!, 64) as Buffer;
  return timingSafeEqual(digest, Buffer.from(key!, 'hex')) && !!stored;
}

export const adminOnly: RequestHandler = (_req, res, next) => {
  if (!res.locals['user']?.owner) throw new AppError(403, 'FORBIDDEN', 'Only the owner can manage users');
  next();
};

export function auth(env: Env) {
  const adminOrigin = new URL(env.ADMIN_URL).origin;
  const cookie = { path: '/', secure: adminOrigin.startsWith('https:'), sameSite: 'lax' as const };
  const originCheck: RequestHandler = (req, _res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('origin') !== adminOrigin) {
      throw new AppError(403, 'CSRF_FAILED', 'Untrusted request origin');
    }
    next();
  };
  const required: RequestHandler = async (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    const value: unknown = req.cookies[sessionCookie];
    if (typeof value !== 'string' || !/^[a-f\d]{64}$/.test(value)) throw unauthorized();
    const session = await Session.findById(hash(value));
    const now = Date.now();
    if (!session || session.expiresAt.getTime() <= now || session.lastSeen.getTime() <= now - idle) throw unauthorized();
    const user = await User.findById(session.userId);
    if (!user?.active || user.version !== session.version) throw unauthorized();
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      const csrf = req.get('X-XSRF-TOKEN');
      if (!csrf || req.cookies[csrfCookie] !== csrf || hash(csrf) !== session.csrf) {
        throw new AppError(403, 'CSRF_FAILED', 'Invalid CSRF token');
      }
    }
    if (now - session.lastSeen.getTime() > 60_000) await Session.updateOne({ _id: session.id }, { lastSeen: new Date(now) });
    res.locals['user'] = { id: user.id, email: user.email, name: user.name, owner: user.owner };
    res.locals['sessionId'] = session.id;
    next();
  };
  const router = Router();
  router.use(originCheck, (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  router.post('/login', rateLimit({
    windowMs: 15 * 60_000,
    limit: 12,
    message: { error: { code: 'RATE_LIMITED', message: 'Try signing in again later' } },
  }), async (req, res) => {
    const input = loginInput.parse(req.body);
    const user = await User.findOne({ email: input.email }).select('+passwordHash');
    if (!(await matches(input.password, user?.passwordHash)) || !user?.active) throw unauthorized();
    const session = token();
    const csrf = token();
    const now = new Date();
    await Session.create({ _id: hash(session), csrf: hash(csrf), userId: user._id, version: user.version,
      lastSeen: now, expiresAt: new Date(now.getTime() + lifetime) });
    res.cookie(sessionCookie, session, { ...cookie, httpOnly: true, maxAge: lifetime });
    res.cookie(csrfCookie, csrf, { ...cookie, maxAge: lifetime });
    res.json({ data: { id: user.id, email: user.email, name: user.name, owner: user.owner } });
  });
  router.get('/me', required, (_req, res) => res.json({ data: res.locals['user'] }));
  router.post('/logout', required, async (_req, res) => {
    await Session.deleteOne({ _id: res.locals['sessionId'] });
    res.clearCookie(sessionCookie, { ...cookie, httpOnly: true });
    res.clearCookie(csrfCookie, cookie);
    res.sendStatus(204);
  });
  return { router, required, originCheck };
}
