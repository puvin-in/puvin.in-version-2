# PUVIN.IN — Technical Blueprint

Status: Phase 0 complete, Phase 1 in progress. Last updated 2026-11-04.
Exact framework versions are in [VERSIONS.md](VERSIONS.md). They are written there after installation, not guessed.

---

## 1. Audit of the existing website (https://puvin.in, fetched 2026-11-04)

### 1.1 Platform
| Finding | Evidence |
|---|---|
| WordPress | `wp-content/`, `wp-content/uploads/` paths |
| Theme: **Imroz** (commercial, by Rainbow-Themes) | `wp-content/themes/imroz`, links to `rainbowit.net/themes/imroz` and themeforest |
| Elementor page builder | `uploads/elementor/thumbs/` |
| WooCommerce, demo data only | `/shop-2/`, `/product/*`, `/cart-2/`, `/checkout-2/`, `/my-account-2/` |
| Cloudflare in front | `/cdn-cgi/` email-obfuscation script |
| No XML sitemap | `/wp-sitemap.xml` and `/sitemap_index.xml` both return 404 |

### 1.2 Verified owner content (safe to migrate)
Only content that is specific to the owner and not theme filler:

- **Display name:** Poornima Thanaraju. The site title is "Poorni" and the logo file is `Poornima-Logo.svg`.
- **Title:** Full Stack Developer. Top bar: "AVAILABLE FOR FREELANCE".
- **Hero copy:** "I'm a Full Stack Developer specializing in building fast, scalable, and user-friendly web applications." / "I build complete solutions from responsive frontends with React to powerful backends with Node.js, APIs & databases."
- **About copy:** five sentences, starting "I'm a passionate Full Stack Developer with a strong focus on creating efficient, scalable, and user-centric web applications…"
- **Skills, as stated on the site:**
  - Frontend: React.js, Next.js, JavaScript, HTML5, CSS3, Tailwind CSS
  - Backend: Node.js, Express.js, REST APIs, Authentication
  - Database & tools: MongoDB, MySQL, Git, GitHub, Postman
  - Deployment: Vercel, cPanel, Hostinger
- **"What I Bring":** "Clean code, problem-solving mindset, on-time delivery, and a commitment to continuous learning and quality."
- **Collaboration value points:** End-to-End Development; Clean, Scalable Code with Modern Tech Stack (MERN); Responsive Design & High Performance for All Devices; On-Time Delivery with Lifetime Support & Maintenance.
- **Logo SVGs:** `/wp-content/uploads/2026/09/Poornima-Logo.svg` and `Poornima-Logo-1.svg`. These are owner assets and can be imported manually.

> ⚠ The current copy says React/Next.js/MERN, but the new platform is MEAN (Angular). Skills are CMS data, so the owner should review the list before launch. I have not added Angular to the owner's verified skills.

### 1.3 Content that must NOT be migrated
| Item | Why |
|---|---|
| ~20 demo homepages (Main Demo, Corporate Agency, Insurance, Startup …) | Imroz theme demos |
| "Elements" pages (pricing, team, counters, Google Map …) | Theme showcase pages |
| Shop, products, cart, checkout, my-account | WooCommerce sample data |
| 6 blog posts dated 2021-09-09, including a lorem-ipsum slug | Theme sample posts |
| Portfolio items (Game Development, SEO Marketing, Photoshop Design …) | Lorem-ipsum case studies; the "Live Preview" link goes to the theme vendor |
| Phone `+111 (0)55 5869 8976`, `+47 254 3657 456`, `+87 739 0740 223`, `01235 088 233` | Demo numbers |
| Emails `admin@trydo.com`, `hello@trydo.com`, `hr@example.com` | Theme vendor / example addresses |
| Address "5678 Bangla Main Road…" | Demo address |
| Social links (`facebook.com/`, `twitter.com/` …) | Root URLs, not real profiles |
| Hero image alt "Portfolio 2" (Elementor thumb) | Origin unclear and likely a theme asset. Replace it with an owner-supplied photo. |
| Theme CSS/JS/images | Licensed to the theme vendor |

### 1.4 Issues found
- **Navigation is unusable:** 6 top-level menus with ~60 demo links. Several point off-site to `rainbowit.net`.
- **Broken link:** the "VIEW MY PROJECTS" CTA links to `#https://puvin.in/`.
- **Contact page has no form fields.** It contains only lorem ipsum and demo contact data.
- **Identity mismatch:** the 404 and search pages are the theme vendor's demo URLs. The contact page says "Call us" on a personal site.
- **SEO:** no sitemap, no meaningful meta description, and demo pages are indexable. This dilutes the domain's search presence.
- **Accessibility:** placeholder alt text ("Portfolio 2", "about-11"), and the process section uses image links without labels.
- **Missing data the owner must supply:** real email, phone (optional), social profile URLs, profile photo, resume PDF, real projects, real services copy, privacy policy text.

### 1.5 Old → new URL map (to be loaded into the Redirects module)
| Old URL | New URL | Code |
|---|---|---|
| `/` | `/` | — |
| `/about-me/`, `/about/`, `/about-classic/` | `/about` | 301 |
| `/our-services/`, `/service-details/` | `/services` | 301 |
| `/our-portfolio/`, `/portfolio/*` (demo items) | `/portfolio` | 301 |
| `/blog/`, `/blog-list/` | `/blog` | 301 |
| `/contact/` | `/contact` | 301 (trailing-slash normalization) |
| `/privacy/` | `/privacy-policy` | 301 |
| Demo homepages, `/shop-2/`, `/product/*`, `/cart-2/`, `/checkout-2/`, `/my-account-2/`, element pages, demo blog posts | — | **410 Gone**, so search engines drop them |
| `/wp-admin/*`, `/wp-login.php` | — | 410 |

The full slug list is captured by `scripts/migration/crawl-old-urls` in Phase 7, before DNS cutover. That crawl must run while the old site is still live.

---

## 2. New sitemap

```
/                         Home (CMS-driven sections)
/about                    About
/services                 Service list
/services/:slug           Service detail
/portfolio                Project grid (filter/search/paginate)
/portfolio/:slug          Case study
/blog                     Blog index
/blog/:slug               Article
/blog/category/:slug      Category archive
/blog/tag/:slug           Tag archive
/contact                  Contact form
/search?q=                Site search
/privacy-policy           CMS page
/terms                    CMS page
/:slug                    Any other CMS page (catch-all, last)
/sitemap.xml, /sitemap-{pages,posts,projects,services}.xml
/rss.xml, /robots.txt
/admin/**                 Admin SPA (noindex)
/api/v1/**                REST API
```

---

## 3. Frontend architecture

Two Angular applications share types, validation and UI primitives.

| App | Rendering | Base path | Why |
|---|---|---|---|
| `apps/website` | SSR + hydration. Static pages (`/about`, `/privacy-policy`) are prerendered when content allows. Search uses CSR. | `/` | SEO, fast LCP |
| `apps/admin` | CSR single-page app | `/admin/` | Authenticated with no SEO value, so no SSR cost. It is served as static files by nginx. |

### Layering in each app
```
src/app/
  core/          http interceptors, API client services, config, guards, SEO service
  layout/        header, footer, mobile menu, theme switcher (website) / sidebar, topbar (admin)
  features/<x>/  routed feature folders; page components are smart, children are presentational
  blocks/        (website) allowlisted block renderer registry: blockType -> component
  shared/        app-specific pipes and directives
packages/ui/     cross-app primitives: button, card, skeleton, empty-state, error-state, badge …
```

- **State:** Angular Signals in feature-scoped services. Most state is server data, so no global store is needed.
- **HTTP:** typed `ApiClient` services return `ApiResponse<T>` from `@puvin/shared-types`.
  - On the server, an interceptor rewrites relative `/api/*` URLs to `API_INTERNAL_URL`.
  - `TransferState` (`withHttpTransferCacheOptions`) prevents the browser from fetching again during hydration.
- **Forms:** Reactive Forms. Validators are derived from the shared zod schemas, so client and server rules match.
- **Styling:** Tailwind CSS v4. Theme values are CSS custom properties (`--color-bg`, `--color-accent` …). The CMS theme settings override them on `<html>` at SSR time, so a theme change does not need a rebuild.
- **Block editor (admin, Phase 4):**
  - A JSON block document with `schemaVersion`.
  - Angular CDK drag-drop for block ordering.
  - **Tiptap (ProseMirror)** for rich-text blocks.
  - The website renders blocks through an allowlist registry. Unknown block types render nothing.
  - Rich text is stored as Tiptap JSON, not HTML. It is rendered through a mark/node allowlist, so there is no `innerHTML` of user content.
- **Icons:** `lucide-angular`.
- **Charts:** Chart.js (Phase 5). Every chart has a data-table fallback for accessibility.

---

## 4. Backend architecture (`apps/api`)

Express + TypeScript. Code is organized by feature, and each feature owns its routes, handlers, service, repository, model, schemas, permissions and tests.

```
apps/api/src/
  config/           env parsing (zod) — the process refuses to start on invalid config
  core/
    db.ts           mongoose connection + memory-server dev fallback
    logger.ts       pino with redaction of password/token/cookie/authorization fields
    errors.ts       AppError hierarchy + stable error codes
    http.ts         ok()/paginated() response envelope helpers
    middleware/     request-id, security headers, CORS, rate limit, error handler, 404, validate()
  modules/
    health/         GET /health, /health/ready
    site/           site settings, profile, public site payload
    skills/  services/  (Phase 1: models + public read)
    auth/  users/  roles/  sessions/                       (Phase 2)
    media/                                                  (Phase 2)
    pages/  posts/  projects/  categories/  tags/  revisions/  (Phase 3–4)
    menus/  forms/  comments/  contact/  newsletter/  redirects/  seo/  analytics/
    notifications/  audit-logs/  import-export/  backups/  webhooks/   (Phase 5)
  jobs/             scheduler: Mongo-backed locked jobs (scheduled publish, cleanup, backups)
  providers/        mail (SMTP/console), storage (local/S3-compatible), cache (memory/Redis)
  app.ts            builds the Express app; no listen(), so tests import it directly
  server.ts         listen + graceful shutdown
```

### Cross-cutting decisions
| Concern | Decision |
|---|---|
| Validation | zod schemas in `@puvin/shared-validation`. They act as allowlists, which prevents mass assignment. Mongoose `sanitizeFilter` is enabled globally to stop operator injection. |
| Auth | Opaque random session id in an HttpOnly, Secure, SameSite=Lax cookie. Only its SHA-256 hash is stored in the `sessions` collection. Sessions have a 30 min idle timeout and a 7 day absolute timeout. `/auth/refresh` rotates the id, and so does any privilege change. Logout and admin actions revoke the server-side row. No JWT, no localStorage. |
| CSRF | Double-submit token: a non-HttpOnly `puvin_xsrf` cookie plus an `X-XSRF-TOKEN` header (Angular HttpClient sends it natively). The server also checks `Origin` on mutations. |
| Passwords | Argon2id via `@node-rs/argon2` (prebuilt binaries, no node-gyp). Minimum 12 characters, and the password is checked against a breached-password list. |
| Brute force | Per-IP and per-account progressive limiter. The account locks after N failures with exponential backoff, and every failure is audit-logged. |
| First admin | `npm run admin:create` CLI. Production has no default credentials and no open sign-up route. |
| RBAC | Permission strings (`posts.publish`, `media.delete` …) are defined in `@puvin/shared-config`. Roles are permission sets stored in the database. `requirePermission()` middleware runs on every admin route, and services also check ownership (for example, an Author can edit only their own posts). |
| Scheduling | A job loop claims due jobs with an atomic `findOneAndUpdate` lock. It is safe with several API instances, and scheduled posts publish without anyone visiting the site. |
| Logging | pino JSON in production and pretty output in development. Every request gets an id. Bodies are never logged. |
| API docs | OpenAPI 3.1, generated from the zod schemas and served at `/api/v1/docs` (disabled in production unless `API_DOCS_PUBLIC=true`). |
| Cache invalidation | A publish event bumps `contentVersion`. SSR responses use `Cache-Control: s-maxage` with the version in an ETag, and a publish purges the CDN when one is configured. |

### Response envelope
```jsonc
// success
{ "data": { ... }, "meta": { "page": 1, "pageSize": 20, "total": 134 } }
// error
{ "error": { "code": "VALIDATION_FAILED", "message": "…", "details": [{ "path": "title", "message": "Required" }], "requestId": "…" } }
```

---

## 5. MongoDB schema design

All collections have `createdAt`/`updatedAt` timestamps. Content collections use optimistic concurrency (`versionKey` + `optimisticConcurrency: true`) and soft delete via `deletedAt`.

| Collection | Key fields | Indexes |
|---|---|---|
| `users` | name, email, passwordHash, roleIds[], avatarId, profile{bio,title,social[]}, emailVerified, status, totp{secretEnc,enabled}, failedLogins, lockedUntil, lastLoginAt | `email` unique (collation strength 2) |
| `roles` | key, name, permissions[], system | `key` unique |
| `sessions` | tokenHash, userId, ip, userAgent, lastSeenAt, expiresAt, revokedAt | `tokenHash` unique, `expiresAt` TTL |
| `site_settings` | singleton `_id:"site"`: general, branding, reading, discussion, permalinks, seo, email, security, integrations, performance | — |
| `profiles` | singleton owner profile: displayName, headline, roles[], summary, about, availability, location, email, phone, social[], resumeMediaId, photoMediaId | — |
| `themes` | name, tokens{colors,fonts,radius,spacing}, header/footer layout, isActive, history | `isActive` |
| `pages` | title, slug, template, blocks(doc), parentId, navVisible, status, seo, publishedAt, authorId | `{slug,deletedAt}` unique partial, `{status,publishedAt}` |
| `posts` | title, slug, excerpt, blocks, featuredImageId, authorId, categoryIds[], tagIds[], status, seo, featured, publishedAt, scheduledAt, readingMinutes, wordCount, commentsEnabled | `slug` unique partial, `{status,publishedAt:-1}`, `categoryIds`, `tagIds`, text index (title, excerpt, plainText) |
| `projects` | title, slug, summary, blocks, overview, problem, solution, responsibilities[], technologies[], categoryIds[], screenshots[{mediaId,caption}], results, timeline, liveUrl, repositoryUrl, client{name,url,show}, featured, displayOrder, status, seo | `slug` unique, `{status,featured,displayOrder}` |
| `services` | title, slug, summary, description, blocks, icon, imageId, features[], technologies[], deliverables[], process[], faqs[{q,a}], relatedProjectIds[], displayOrder, status, seo | `slug` unique, `{status,displayOrder}` |
| `skills` | name, icon, category, displayOrder, visible, proficiency (optional, free text, never an invented percentage) | `{category,displayOrder}` |
| `categories` / `tags` | scope (`post`/`project`), name, slug, description, parentId | `{scope,slug}` unique |
| `media` | filename, originalName, mimeType (sniffed), storageProvider, storageKey, publicUrl, fileSize, width, height, variants[{w,format,key,url,size}], altText, caption, title, folder, checksum, uploadedBy | `checksum`, `folder`, text(title, altText) |
| `media_usages` | mediaId, refType, refId, field | `mediaId`. Used to warn before deleting media that content still references. |
| `revisions` | refType, refId, version, snapshot, authorId, message | `{refType,refId,version}` unique. Snapshots store media ids, not file bytes. |
| `comments` | postId, parentId, author{name,emailHash}, body, status(pending/approved/spam/trash), ipHash | `{postId,status,createdAt}` |
| `menus` | location (header/footer/mobile), items[] (tree: label, type, ref/url, children, visibility) | `location` unique |
| `forms` / `form_submissions` | form definition (fields, rules, recipients) / formId, data, meta, status | `{formId,createdAt}` |
| `contact_messages` | name, email, subject, message, status(new/read/replied/spam/archived), ipHash, userAgent | `{status,createdAt}`, TTL by retention setting |
| `newsletter_subscribers` | email, status, consent{at,ipHash,text}, verifyTokenHash, unsubscribeTokenHash | `email` unique |
| `testimonials` | author, role, company, quote, approved, sourceNote, displayOrder | `{approved,displayOrder}` |
| `redirects` | from, to, code(301/302/410), hits, lastHitAt | `from` unique |
| `not_found_log` | path, referrer, hits, lastAt | `path` unique |
| `notifications` | userId/role, type, payload, readAt | `{userId,readAt}` |
| `audit_logs` | actorId, action, target{type,id}, diff, ip, at | `{at:-1}`, `{target.type,target.id}`, TTL by retention |
| `analytics_daily` | date, path, views, uniquesApprox, referrers{} (no IP, no cookies unless consented) | `{date,path}` unique |
| `jobs` | type, runAt, payload, status, lockedUntil, attempts, lastError | `{status,runAt}` |
| `backups` | type, storageKey, size, checksum, status, startedAt, verifiedAt | `startedAt` |
| `webhooks` | url, events[], secretEnc, active, lastDelivery | — |

### Block document
```jsonc
{ "schemaVersion": 1,
  "blocks": [
    { "id": "b_8f2", "type": "heading", "props": { "level": 2, "text": "…" },
      "style": { "align": "left", "spacing": { "top": "md" }, "visibility": { "mobile": true } } },
    { "id": "b_9a1", "type": "richText", "props": { "doc": { /* Tiptap JSON */ } } },
    { "id": "b_c33", "type": "columns", "props": { "ratio": "1:1" }, "children": [[ … ], [ … ]] } ] }
```
Each block type has a zod schema keyed by `type`. Unknown types, or blocks that fail validation, are rejected on save. Migrations upgrade old `schemaVersion` documents when they are read.

---

## 6. API route specification (`/api/v1`)

### Health (Phase 1)
- `GET /health` — liveness
- `GET /health/ready` — readiness, including DB ping

### Auth (Phase 2)
`POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/verify-email`, `GET /auth/me`, `POST /auth/change-password`, `POST /auth/2fa/{setup,enable,disable}`, `GET|DELETE /auth/sessions[/:id]`

### Public (read-only, published content only)
`GET /public/site`, `GET /public/pages/:slug`, `GET /public/posts`, `GET /public/posts/:slug`, `GET /public/categories`, `GET /public/tags`, `GET /public/projects`, `GET /public/projects/:slug`, `GET /public/services`, `GET /public/services/:slug`, `GET /public/search`, `GET /public/preview/:token`, `POST /public/contact`, `POST /public/newsletter`, `GET /public/newsletter/{verify,unsubscribe}`, `POST /public/comments`, `POST /public/forms/:id/submit`, `POST /public/analytics/hit`, `GET /public/redirects/resolve?path=`

### Admin (session + CSRF + permission on every route)
- `GET /admin/dashboard`
- Standard resource set for `pages`, `posts`, `projects`, `services`, `categories`, `tags`, `media`, `menus`, `forms`, `comments`, `users`, `roles`, `redirects`, `testimonials`, `skills`:
  - `GET /` (list: `page`, `pageSize`, `sort`, `q`, `status`, filters)
  - `POST /`
  - `GET /:id`
  - `PATCH /:id` (with `If-Match` version)
  - `DELETE /:id` (soft delete to trash)
- Actions:
  - `POST /:id/publish`, `/unpublish`, `/schedule`, `/archive`, `/restore`, `/duplicate`, `/preview-token`
  - `POST /bulk` with `{ action, ids[] }`
- Revisions: `GET /admin/revisions?refType&refId`, `GET /admin/revisions/:id`, `POST /admin/revisions/:id/restore`
- Settings: `GET|PATCH /admin/settings/:section`, `POST /admin/settings/email/test`, `GET|PATCH /admin/profile-site`, `GET|POST /admin/themes`, `POST /admin/themes/:id/activate`
- SEO: `GET|PATCH /admin/seo`, `GET /admin/seo/audit`, `GET /admin/seo/404s`
- Contact: `GET /admin/contact-messages`, `PATCH /admin/contact-messages/:id`, `GET /admin/contact-messages/export.csv`
- Newsletter: `GET /admin/newsletter`, `GET /admin/newsletter/export.csv`
- Analytics: `GET /admin/analytics/{overview,traffic,content,conversions}?from&to`, `GET /admin/analytics/export.csv`
- Audit: `GET /admin/audit-logs`
- Notifications: `GET /admin/notifications`, `POST /admin/notifications/read`
- Import/export/backups:
  - `POST /admin/import/{json,csv,wxr,wp-rest}`
  - `GET /admin/export/{type}`
  - `GET|POST /admin/backups`, `POST /admin/backups/:id/{verify,restore}`
- Webhooks: `GET|POST|PATCH|DELETE /admin/webhooks`
- Features: `GET|PATCH /admin/features`

### SEO endpoints (served by the website SSR server, not under `/api`)
`/sitemap.xml`, `/sitemap-*.xml`, `/rss.xml`, `/robots.txt`

---

## 7. Admin information architecture

The sidebar follows the brief. Each item is visible only when the user holds the relevant permission.

```
Dashboard
Content       Pages · Posts · Categories · Tags · Comments
Portfolio     All Projects · Add Project · Project Categories
Services      All Services · Add Service
Media         Library · Upload
Appearance    Themes · Customize · Menus · Sections · Page Builder
Marketing     SEO Manager · Redirects · Newsletter · Campaigns*
Communication Contact Messages · Forms · Submissions
Analytics     Overview · Traffic · Content · Conversions
Users         All Users · Roles · My Profile
Tools         Import · Export · Backups · Audit Logs · API/Webhooks
Settings      General · Branding · Reading · Writing · Discussion · Permalinks · Email · Security · Integrations · Performance
```
\* Campaigns is an extension point only: provider interface plus documentation. It is not built in the core launch.

Dashboard widgets: published/draft posts, published pages, projects, new and unread inquiries, recent activity (from the audit log), scheduled content, traffic and popular posts (only when analytics data exists), leads, and system health (DB, job loop, storage, mail, last backup).

Shared admin patterns:
- A `ResourceListComponent`: searchable, sortable, filterable, paginated, bulk-select.
- A `ResourceFormShell`: save-state indicator, unsaved-changes guard, `If-Match` conflict dialog.
- Toasts and a confirm dialog.

---

## 8. Design system

| Token | Dark (default) | Light |
|---|---|---|
| `--color-bg` | `#090B12` | `#F8FAFC` |
| `--color-surface` | `#111827` | `#FFFFFF` |
| `--color-surface-2` | `#1A2233` | `#F1F5F9` |
| `--color-border` | `rgb(148 163 184 / 0.14)` | `rgb(15 23 42 / 0.10)` |
| `--color-text` | `#F8FAFC` | `#0F172A` |
| `--color-muted` | `#94A3B8` | `#475569` |
| `--color-accent` | `#7C3AED` | `#6D28D9` |
| `--color-accent-2` | `#22D3EE` | `#0891B2` |
| `--color-success / warning / error` | `#10B981 / #F59E0B / #EF4444` | `#059669 / #B45309 / #DC2626` |

- **Type:** Space Grotesk for display headings and Inter for UI/body, both self-hosted through `@fontsource`. JetBrains Mono is used for code accents.
- **Type scale:** fluid `clamp()` from 14px to 72px.
- **Radius:** 6 / 10 / 16 / 24 px.
- **Shadows:**
  - Dark mode uses a soft inner border plus a coloured glow on hover.
  - Light mode uses layered neutral shadows.
- **Spacing:** 4 px base.
- **Layout:** sections use a bento grid with a 12-column container (max width 1200 px) and a 16 px gutter on mobile.
- **Motion:** 150–300 ms ease-out. Everything is wrapped in `@media (prefers-reduced-motion: no-preference)`.
- **Accessibility:** WCAG 2.2 AA. All text pairs above are ≥ 4.5:1 against their background. The muted colour is used only for secondary text at ≥ 14 px. The focus ring is a 2 px accent-2 outline with 2 px offset. Touch targets are at least 44 px.

---

## 9. Repository structure

```
puvin.in/                       (this folder = puvin-platform)
  apps/
    api/                        Express + Mongoose API
    website/                    Angular SSR public site
    admin/                      Angular CSR admin (/admin/)
  packages/
    shared-types/               DTOs, envelope, enums (pure TS)
    shared-validation/          zod schemas used by API and admin forms
    shared-config/              permissions, roles, route constants, content statuses
    ui/                         Angular standalone primitives (consumed via TS path alias)
  infrastructure/
    docker/                     Dockerfiles
    nginx/                      reverse proxy config
    deployment/                 VPS runbook, systemd/compose overrides
  scripts/
    database/                   seed, create-admin, indexes
    migration/                  old-URL crawl, WXR import
    backup/                     mongodump/restore + verify
  docs/                         this blueprint, versions, guides
  tests/e2e/                    Playwright (Phase 3+)
  .env.example  README.md  package.json (npm workspaces)  tsconfig.base.json
```
Tooling: npm workspaces (no Nx/Turbo, to keep the stack simple), Prettier, ESLint, Vitest for the API, and the Angular CLI test runner for the apps.

---

## 10. Incremental implementation plan

| Phase | Deliverable | Done when |
|---|---|---|
| **0** Discovery | This document | ✅ |
| **1** Foundation | Monorepo, shared packages, API (config, logging, errors, security headers, rate limit, DB, health, `GET /public/site`), seed of verified content, Angular website (SSR, Tailwind, theme toggle, header/footer, homepage rendering live API data), Angular admin shell (system health page), Dockerfiles, nginx, compose, `.env.example` | `npm run build` passes; API tests pass; SSR HTML of `/` contains seeded MongoDB content |
| **2** Auth + CMS core | Users, roles, sessions, CSRF, login/logout/reset, create-admin CLI, admin layout and guards, settings module, generic CRUD kit, media library (local + S3 provider, sharp variants, sniffed MIME, usage tracking), audit log | Integration tests for auth, RBAC and upload rejection; admin can log in and change settings, and the change persists |
| **3** Public website | About, Services(+detail), Portfolio(+detail, filters), Contact (stored, emailed, rate-limited, honeypot plus timing check), menus, SEO service (meta, JSON-LD), sitemap/robots, redirects middleware | Playwright e2e tests 11–14 and 18 pass |
| **4** CMS + blog | Pages, block editor (CDK + Tiptap), posts, categories/tags, revisions, autosave, preview tokens, scheduler, search, RSS, SEO panel | Playwright e2e tests 1–10, 16, 17 and 20 pass |
| **5** Advanced admin | Comments, form builder, newsletter, analytics (first-party), notifications, import/export (JSON, CSV, WXR), webhooks, feature registry, themes with rollback | Module tests pass; dashboard shows real counts |
| **6** Hardening | Security review, CSP tuning, dependency audit, a11y (axe), Lighthouse runs, query/index review | Measured reports committed to `docs/reports/` |
| **7** Launch | Staging, old-URL crawl and redirects, content entry by the owner, backups verified by a restore, TLS, monitoring, cutover | All acceptance criteria in brief §31 pass |

### Information needed from the owner (blocking launch, not development)
1. Public contact email (and optionally phone and location)
2. Social profile URLs (LinkedIn, GitHub …)
3. Profile photo and resume PDF
4. Real portfolio projects, each with screenshots, links and a verified outcome
5. Final service list and descriptions
6. Privacy policy and terms text (or approval of a drafted version)
7. Whether the skills list should change from React/MERN to include Angular/MEAN
8. Hosting choice (VPS provider) and an email/SMTP provider
