FROM node:24-bookworm-slim AS build
WORKDIR /srv
ENV MONGOMS_DISABLE_POSTINSTALL=1
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY apps/website/package.json apps/website/
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/shared-config/package.json packages/shared-config/
COPY packages/shared-validation/package.json packages/shared-validation/
COPY packages/ui/package.json packages/ui/
RUN npm ci --no-audit --no-fund
COPY tsconfig.base.json ./
COPY apps ./apps
COPY app/index.html ./app/
COPY app/assets ./app/assets
COPY packages ./packages
RUN npm run build

FROM build AS production-dependencies
RUN npm prune --omit=dev --no-audit --no-fund

FROM node:24-bookworm-slim AS app
WORKDIR /srv
ENV NODE_ENV=production
COPY --from=production-dependencies /srv/node_modules ./node_modules
COPY --from=build /srv/apps/api/package.json ./apps/api/
COPY --from=build /srv/apps/api/dist ./apps/api/dist
COPY --from=build /srv/apps/website/dist/website ./apps/website/dist/website
COPY --from=build /srv/app ./app
COPY --from=build /srv/packages ./packages
# Local checkouts can have mode 0600 files from a restrictive shell umask.
RUN chmod -R a+rX /srv/apps /srv/app /srv/packages
USER node
RUN test -r apps/api/package.json && test -r app/index.html \
    && node --input-type=module -e "await import('./apps/api/dist/app.js')"
CMD ["node", "apps/api/dist/server.js"]

FROM caddy:2-alpine AS gateway
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /srv/apps/admin/dist/admin/browser /srv/admin
