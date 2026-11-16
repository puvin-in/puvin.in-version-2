# Deploy PUVIN.IN on Amazon EC2

This guide deploys the root npm workspace. Caddy terminates TLS and routes the public Angular SSR site, the Angular admin SPA at `/admin/`, and Express at `/api/v1/`. MongoDB uses a persistent Docker volume on the instance.

## Run locally with Docker

Copy `.env.example` to `.env` and set `MONGO_PASSWORD` to a random hexadecimal value. Then run:

```bash
docker compose config --quiet
docker compose up -d --build
docker compose exec api node apps/api/dist/scripts/seed.js
```

Open [the website](http://localhost:8080/) and [the admin sign-in](http://localhost:8080/admin/). Create the owner account with the command below first.

## Launch and configure EC2

1. Launch an Ubuntu 24.04 LTS instance with a persistent EBS volume sized for Docker images, MongoDB, and uploads. For on-instance Angular image builds, allow at least 4 GiB RAM and monitor memory and disk usage.
2. Assign a stable public IPv4 address. Allow inbound TCP 80 and 443. Restrict TCP 22 to your IP, or connect through Systems Manager if it is configured. Keep ports 27017, 4000, and 4100 private. See [Amazon EC2 setup](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html).
3. Point the site's DNS A record at the public IP. Remove stale AAAA records if the instance is IPv4-only. Caddy will obtain the certificate after DNS and inbound HTTP/HTTPS work.
4. Install Docker Engine and the Compose plugin using [Docker's Ubuntu instructions](https://docs.docker.com/engine/install/ubuntu/), then verify with `docker compose version`. Run the following commands with a Docker-authorized account.

Clone the repository, check out the revision containing these deployment files, and create `.env`:

```bash
git clone https://github.com/puvin-in/puvin.in-version-2.git
cd puvin.in-version-2
umask 077
cp .env.example .env
openssl rand -hex 32
```

Put the generated value in `MONGO_PASSWORD` in `.env`. Use the verified public domain for all three site settings below:

```dotenv
SITE_ADDRESS=puvin.in
SITE_HOST=puvin.in
SITE_ORIGIN=https://puvin.in
BIND_IP=0.0.0.0
HTTP_PORT=80
HTTPS_PORT=443
```

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose exec api node apps/api/dist/scripts/seed.js
```

## Create the owner and verify

In Bash, use a masked prompt and pass the password over standard input. Replace the email and name with your own.

```bash
read -r -s -p 'Owner password (at least 12 characters): ' owner_password
printf '\n'
printf '%s\n' "$owner_password" | docker compose exec -T api node apps/api/dist/scripts/create-admin.js owner@example.com 'Site Owner'
unset owner_password
```

Run the same command with the same email to reset the owner's password. Existing sessions for that account become invalid. Staff accounts are managed under **Users**.

Check `https://puvin.in/api/v1/health/ready` for a healthy database, then open the public homepage and sign in at `https://puvin.in/admin/`. Publish a test draft, verify that it appears on its public list, and submit a contact message. Messages appear in the dashboard inbox. Update the canonical URL and search indexing under **Settings** after finalizing the domain. In **Media**, upload only images intended to be publicly reachable.

## Updates and MongoDB backups

Before upgrades, dump the database and store an encrypted copy off the instance. The dump includes media and contact messages. Keep `.env` in protected storage. Mongo initializes its credentials only on a new volume, so changing the deployment variable alone does not rotate an existing Mongo password.

```bash
umask 077
docker compose exec -T mongo sh -c 'mongodump --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --db puvin --archive --gzip' > puvin-backup.archive.gz
git pull --ff-only
docker compose up -d --build
docker compose ps
```

Verify restores on a separate deployment with the same MongoDB major version before relying on a backup. Use `docker compose logs --tail=100 gateway website api mongo` to diagnose failed starts or TLS setup. Keep the named volumes when replacing containers.
