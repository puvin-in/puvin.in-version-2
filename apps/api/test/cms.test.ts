import sharp from 'sharp';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { passwordHash, User } from '../src/modules/cms/auth.js';
import { seedInitialContent } from '../src/seed/seed.js';
import { useTestApp } from './helpers.js';

describe('CMS workflows', () => {
  const app = useTestApp();
  const origin = 'http://localhost:4300';
  const email = 'owner@example.test';
  const password = 'example-test-password';
  const api = '/api/v1';

  beforeAll(async () => {
    await seedInitialContent();
    await User.create({ name: 'Owner', email, owner: true, passwordHash: await passwordHash(password) });
  });

  async function signIn(address = email) {
    const agent = request.agent(app());
    const response = await agent.post(api + '/auth/login').set('Origin', origin).send({ email: address, password }).expect(200);
    const cookies = response.headers['set-cookie'] as unknown as string[];
    expect(cookies.find(value => value.startsWith('puvin_session='))).toContain('HttpOnly');
    const token = cookies.find(value => value.startsWith('puvin_xsrf='))!.split(';')[0]!.split('=')[1]!;
    return { agent, headers: { Origin: origin, 'X-XSRF-TOKEN': token } };
  }

  it('protects mutations and exposes only published records', async () => {
    await request(app()).get(api + '/admin/posts').expect(401);
    const { agent, headers } = await signIn();
    const path = api + '/admin/posts';
    await agent.post(path).set('Origin', origin).send({ title: 'Draft article' }).expect(403);
    const draft = await agent.post(path).set(headers).send({ title: 'Draft article' }).expect(201);
    const listed = await request(app()).get(api + '/public/posts').expect(200);
    expect(listed.body.data).toEqual([]);
    await request(app()).get(api + '/public/posts/draft-article').expect(404);

    await agent.put(path + '/' + draft.body.data.id).set(headers)
      .send({ title: 'Draft article', status: 'published', blocks: [{ type: 'paragraph', text: 'Body' }] }).expect(200);
    const article = await request(app()).get(api + '/public/posts/draft-article').expect(200);
    expect(article.body.data.blocks).toEqual([{ type: 'paragraph', text: 'Body' }]);
    await agent.post(api + '/auth/logout').set(headers).expect(204);
    await agent.get(path).expect(401);
  });

  it('limits user management to owners and revokes disabled staff sessions', async () => {
    const { agent, headers } = await signIn();
    const staffEmail = 'staff@example.test';
    const staff = await agent.post(api + '/admin/users').set(headers)
      .send({ name: 'Staff', email: staffEmail, password }).expect(201);
    expect(staff.body.data).not.toHaveProperty('passwordHash');
    const staffSession = await signIn(staffEmail);
    await staffSession.agent.get(api + '/admin/users').expect(403);
    await staffSession.agent.get(api + '/admin/projects').expect(200);
    await agent.patch(api + '/admin/users/' + staff.body.data._id).set(headers).send({ active: false }).expect(200);
    await staffSession.agent.get(api + '/auth/me').expect(401);
  });

  it('persists contact messages, media and CMS settings', async () => {
    const { agent, headers } = await signIn();
    await request(app()).post(api + '/public/contact').send({ name: 'Visitor', email, message: 'Hello' }).expect(201);
    const messages = await agent.get(api + '/admin/messages').expect(200);
    expect(messages.body.data[0]).toMatchObject({ message: 'Hello', read: false });
    const marked = await agent.patch(api + '/admin/messages/' + messages.body.data[0]._id)
      .set(headers).send({ read: true }).expect(200);
    expect(marked.body.data.read).toBe(true);

    const image = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'red' } }).png().toBuffer();
    const uploaded = await agent.post(api + '/admin/media').set(headers).field('alt', 'Red square')
      .attach('image', image, 'square.png').expect(201);
    await request(app()).get(uploaded.body.data.url).expect('Content-Type', /image\/webp/).expect(200);
    const media = await agent.get(api + '/admin/media').expect(200);
    expect(media.body.data[0]).not.toHaveProperty('image');

    const { body: { data: { profile, ...settings } } } = await agent.get(api + '/admin/settings').expect(200);
    settings.branding.brandName = 'Updated brand';
    await agent.put(api + '/admin/settings').set(headers).send(settings).expect(200);
    await agent.put(api + '/admin/settings/profile').set(headers).send({ ...profile, headline: 'Updated headline' }).expect(200);
    const site = await request(app()).get(api + '/public/site').expect(200);
    expect(site.body.data.branding.brandName).toBe('Updated brand');
    expect(site.body.data.profile.headline).toBe('Updated headline');
  });
});
