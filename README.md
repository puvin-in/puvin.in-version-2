# PUVIN.IN

The root npm workspace serves the original immersive homepage from `app/index.html`, Angular public content pages, an Angular CMS at `/admin/`, and an Express API backed by MongoDB.

## Run the platform

For a single URL with Docker, follow the [Docker and EC2 guide](docs/EC2.md). For native development, install Node.js 24 or later and run:

```text
npm ci
npm run seed
```

Seed the database before starting the development API when using the default local MongoDB instance. Create a CMS owner with `npm run admin:create -- owner@example.com "Site Owner"`, passing a password of at least 12 characters via standard input. The [deployment guide](docs/EC2.md#create-the-owner-and-verify) shows a masked Bash prompt.

Open three terminals and run one command in each:

| Process | Command | URL |
| --- | --- | --- |
| API | `npm run dev:api` | `http://localhost:4100/api/v1/health/ready` |
| Public website | `npm run dev:website` | `http://localhost:4200/` |
| Admin | `npm run dev:admin` | `http://localhost:4300/admin/` |

If the admin runs on a different origin, set `ADMIN_URL` to match it. The API requires this origin on admin mutations. The default development database persists under `.data/mongo`. For an external MongoDB instance, set `MONGODB_URI` and optionally `MONGODB_DB_NAME` in the root `.env`.

## Use the CMS

- Create posts, projects, or services as drafts. Publish to make them visible on the public site. Archive to take them offline.
- Upload a public image in Media, then paste its URL into a featured-image field or structured block.
- Read and triage incoming contact messages under Messages.
- Edit branding, homepage copy, SEO, and the owner profile under Settings. Manage staff accounts under Users with the owner login.

Run `npm test` for the API and Angular test suites and `npm run build` for production output.
