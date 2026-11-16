import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { createReadStream, existsSync, promises as fs } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dataFile = process.env.DATA_FILE || join(root, 'data', 'store.json');
const port = Number(process.env.PORT || 8080);
const sessions = new Map();
const resources = new Set(['users', 'posts', 'projects', 'services', 'media', 'messages']);
const mime = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2' };

const initialStore = () => ({
  settings: {
    siteName: 'PUVIN.IN',
    owner: 'Poornima Thanaraju',
    headline: 'Full Stack Developer',
    availability: 'Available for freelance',
    heroTitle: 'I build digital experiences that feel alive.',
    heroLead: 'Full-stack development, thoughtful interfaces, scalable systems and creative web experiences.',
    about: 'I build complete products from clear, responsive interfaces to dependable APIs and databases.',
    contactEmail: '',
    accent: '#b7ff3c',
    updatedAt: new Date().toISOString(),
  },
  users: [],
  posts: [{ id: 'post-welcome', title: 'Building the PUVIN platform', slug: 'building-puvin-platform', excerpt: 'A look at the system behind this portfolio.', status: 'draft', author: 'System', updatedAt: new Date().toISOString() }],
  projects: [],
  services: [
    { id: 'service-full-stack', title: 'Full-Stack Web Development', slug: 'full-stack-web-development', summary: 'End-to-end development, from frontend to backend and deployment.', status: 'published', order: 1 },
    { id: 'service-frontend', title: 'Frontend Application Development', slug: 'frontend-application-development', summary: 'Responsive and interactive user interfaces that perform well on every device.', status: 'published', order: 2 },
    { id: 'service-api', title: 'Backend API Development', slug: 'backend-api-development', summary: 'REST APIs, authentication and server-side logic to power your application.', status: 'published', order: 3 },
  ],
  media: [],
  messages: [],
});

let store;
function id(prefix) { return `${prefix}_${randomBytes(8).toString('hex')}`; }
function passwordHash(password, salt = randomBytes(16).toString('hex')) { return `${salt}:${pbkdf2Sync(password, salt, 210000, 32, 'sha256').toString('hex')}`; }
function passwordMatches(password, encoded) {
  const [salt, expected] = String(encoded || '').split(':');
  if (!salt || !expected) return false;
  const actual = pbkdf2Sync(password, salt, 210000, 32, 'sha256').toString('hex');
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
async function persist() { await fs.mkdir(dirname(dataFile), { recursive: true }); await fs.writeFile(dataFile, JSON.stringify(store, null, 2), 'utf8'); }
async function load() {
  try { store = JSON.parse(await fs.readFile(dataFile, 'utf8')); } catch { store = initialStore(); await persist(); }
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password && password.length >= 12 && !store.users.some((user) => user.email === email)) {
    store.users.push({ id: id('usr'), name: 'Site administrator', email, passwordHash: passwordHash(password), role: 'admin', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    await persist();
  }
}
function json(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(body)); }
function readJson(req) { return new Promise((resolveBody, reject) => { let body = ''; req.on('data', (part) => { body += part; if (body.length > 1_000_000) req.destroy(); }); req.on('end', () => { try { resolveBody(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON body')); } }); req.on('error', reject); }); }
function cookies(req) { return Object.fromEntries((req.headers.cookie || '').split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter(([key]) => key)); }
function auth(req) { const session = sessions.get(cookies(req).puvin_session); return session && session.expiresAt > Date.now() ? store.users.find((user) => user.id === session.userId) : null; }
function publicSite() { return { settings: store.settings, services: store.services.filter((item) => item.status === 'published').sort((a, b) => (a.order || 0) - (b.order || 0)), projects: store.projects.filter((item) => item.status === 'published'), posts: store.posts.filter((item) => item.status === 'published') }; }
function safeUser(user) { const { passwordHash: _passwordHash, ...safe } = user; return safe; }
function cleanRecord(type, data, existing = {}) {
  const now = new Date().toISOString();
  const allowed = {
    users: ['name', 'email', 'role', 'status', 'password'], posts: ['title', 'slug', 'excerpt', 'body', 'status'], projects: ['title', 'slug', 'summary', 'body', 'status', 'technologies', 'image'], services: ['title', 'slug', 'summary', 'body', 'status', 'order', 'icon'], media: ['name', 'url', 'alt', 'type'], messages: ['status'],
  }[type] || [];
  const result = { ...existing };
  for (const key of allowed) if (data[key] !== undefined) result[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
  if (type === 'users') { result.email = String(result.email || '').toLowerCase(); if (data.password) result.passwordHash = passwordHash(data.password); delete result.password; }
  result.updatedAt = now;
  return result;
}
async function api(req, res, path) {
  const user = auth(req);
  if (path === '/api/v1/health' && req.method === 'GET') return json(res, 200, { data: { status: 'ok', storage: dataFile, uptime: process.uptime() } });
  if (path === '/api/v1/public/site' && req.method === 'GET') return json(res, 200, { data: publicSite() });
  const publicCollection = path.match(/^\/api\/v1\/public\/(posts|projects|services)$/);
  if (publicCollection && req.method === 'GET') return json(res, 200, { data: publicSite()[publicCollection[1]] });
  if (path === '/api/v1/public/contact' && req.method === 'POST') {
    const body = await readJson(req);
    if (body.website || !body.name?.trim() || !/^\S+@\S+\.\S+$/.test(body.email || '') || !body.message?.trim()) return json(res, 422, { error: { message: 'Name, valid email, and message are required.' } });
    store.messages.unshift({ id: id('msg'), name: body.name.trim(), email: body.email.trim().toLowerCase(), subject: String(body.subject || '').trim(), message: body.message.trim(), status: 'new', createdAt: new Date().toISOString() }); await persist();
    return json(res, 201, { data: { received: true } });
  }
  if (path === '/api/v1/auth/login' && req.method === 'POST') {
    const body = await readJson(req); const account = store.users.find((candidate) => candidate.email === String(body.email || '').trim().toLowerCase() && candidate.status === 'active');
    if (!account || !passwordMatches(String(body.password || ''), account.passwordHash)) return json(res, 401, { error: { message: 'Invalid email or password.' } });
    const token = randomBytes(32).toString('base64url'); sessions.set(token, { userId: account.id, expiresAt: Date.now() + 1000 * 60 * 60 * 8 });
    res.setHeader('Set-Cookie', `puvin_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800${process.env.COOKIE_SECURE === 'true' ? '; Secure' : ''}`); return json(res, 200, { data: { user: safeUser(account) } });
  }
  if (path === '/api/v1/auth/logout' && req.method === 'POST') { sessions.delete(cookies(req).puvin_session); res.setHeader('Set-Cookie', 'puvin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'); return json(res, 200, { data: { loggedOut: true } }); }
  if (path === '/api/v1/auth/me' && req.method === 'GET') return user ? json(res, 200, { data: { user: safeUser(user) } }) : json(res, 401, { error: { message: 'Sign in required.' } });
  if (!path.startsWith('/api/v1/admin')) return json(res, 404, { error: { message: 'Endpoint not found.' } });
  if (!user || user.role !== 'admin') return json(res, 401, { error: { message: 'Administrator sign in required.' } });
  if (path === '/api/v1/admin/overview' && req.method === 'GET') return json(res, 200, { data: Object.fromEntries([...resources].map((type) => [type, store[type].length])) });
  if (path === '/api/v1/admin/settings') {
    if (req.method === 'GET') return json(res, 200, { data: store.settings });
    if (req.method === 'PATCH') { const body = await readJson(req); const allowed = ['siteName', 'owner', 'headline', 'availability', 'heroTitle', 'heroLead', 'about', 'contactEmail', 'accent']; for (const key of allowed) if (body[key] !== undefined) store.settings[key] = String(body[key]).trim(); store.settings.updatedAt = new Date().toISOString(); await persist(); return json(res, 200, { data: store.settings }); }
  }
  const match = path.match(/^\/api\/v1\/admin\/(users|posts|projects|services|media|messages)(?:\/([\w-]+))?$/);
  if (!match) return json(res, 404, { error: { message: 'Endpoint not found.' } });
  const [, type, recordId] = match;
  if (!recordId && req.method === 'GET') return json(res, 200, { data: store[type].map((record) => type === 'users' ? safeUser(record) : record) });
  if (!recordId && req.method === 'POST') { const body = await readJson(req); const record = cleanRecord(type, body, { id: id(type.slice(0, 3)), createdAt: new Date().toISOString() }); if (type === 'users' && (!record.email || !record.passwordHash)) return json(res, 422, { error: { message: 'Email and a password are required.' } }); store[type].unshift(record); await persist(); return json(res, 201, { data: type === 'users' ? safeUser(record) : record }); }
  const index = store[type].findIndex((record) => record.id === recordId); if (index < 0) return json(res, 404, { error: { message: 'Record not found.' } });
  if (req.method === 'PATCH') { store[type][index] = cleanRecord(type, await readJson(req), store[type][index]); await persist(); return json(res, 200, { data: type === 'users' ? safeUser(store[type][index]) : store[type][index] }); }
  if (req.method === 'DELETE') { if (type === 'users' && store[type][index].id === user.id) return json(res, 422, { error: { message: 'You cannot delete your own account.' } }); store[type].splice(index, 1); await persist(); return json(res, 200, { data: { deleted: true } }); }
  return json(res, 405, { error: { message: 'Method not allowed.' } });
}
async function staticFile(req, res, pathname) {
  let requested = pathname === '/' ? '/index.html' : pathname;
  if (requested === '/admin' || requested === '/admin/') requested = '/admin/index.html';
  let filename = resolve(root, `.${normalize(requested)}`);
  if (requested.endsWith('/') && existsSync(filename)) filename = join(filename, 'index.html');
  if (!filename.startsWith(root) || !existsSync(filename)) return json(res, 404, { error: { message: 'Not found.' } });
  res.writeHead(200, { 'Content-Type': mime[extname(filename).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' }); createReadStream(filename).pipe(res);
}
await load();
if (process.argv.includes('--seed')) { console.log(`Seeded ${dataFile}`); process.exit(0); }
createServer(async (req, res) => { try { const path = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname; if (path.startsWith('/api/')) return await api(req, res, path); return await staticFile(req, res, path); } catch (error) { console.error(error); return json(res, 500, { error: { message: 'Internal server error.' } }); } }).listen(port, '0.0.0.0', () => console.log(`PUVIN CMS running on http://0.0.0.0:${port}`));
