# Deploy PUVIN CMS on AWS EC2

This folder is a small, self-contained Node deployment. Its content database is a Docker volume, so it is suitable for a single-site EC2 installation. Take regular volume backups before upgrades.

## 1. Create the server

Create an Ubuntu 24.04 LTS EC2 instance. Attach an Elastic IP and use a security group that permits port `22` only from your IP, and ports `80`/`443` from the internet. Do **not** expose port `8080` publicly.

Connect with SSH, then install Docker using the current Docker Engine instructions for Ubuntu. Clone or upload this `app/` folder to `/opt/puvin`.

## 2. Configure secrets and start

```sh
cd /opt/puvin
cp .env.example .env
# Edit .env: set a long random SESSION_SECRET, an admin email and a 12+ character ADMIN_PASSWORD.
docker compose up -d --build
curl http://127.0.0.1:8080/api/v1/health
```

Open `https://your-domain/admin/` only after the proxy and TLS steps below. The first configured `ADMIN_EMAIL` / `ADMIN_PASSWORD` pair creates the administrator on initial startup. Remove `ADMIN_PASSWORD` from `.env` once that account exists; create future users from the dashboard.

## 3. Put TLS in front of it

Point the domain’s `A` record to the Elastic IP. Use a reverse proxy such as Caddy or Nginx on ports 80 and 443 and proxy requests to `127.0.0.1:8080`. Set `COOKIE_SECURE=true` in `.env` once HTTPS is serving, then run `docker compose up -d` again. Keep the container port bound only on loopback when a proxy runs on the host.

Example Nginx server block after obtaining a certificate:

```nginx
server {
  listen 443 ssl http2;
  server_name puvin.in www.puvin.in;
  ssl_certificate /etc/letsencrypt/live/puvin.in/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/puvin.in/privkey.pem;
  location / { proxy_pass http://127.0.0.1:8080; proxy_set_header Host $host; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; }
}
```

## 4. Backup and updates

Run this before updating the image:

```sh
docker compose exec -T puvin sh -c 'cat /data/store.json' > "puvin-backup-$(date +%F).json"
docker compose up -d --build
```

Copy backups to encrypted S3 or another location outside the instance. Enable EC2 automatic recovery/monitoring, patch the host regularly, restrict SSH, and use an IAM role with only the permissions the instance needs.
