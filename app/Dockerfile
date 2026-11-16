FROM node:24-alpine
WORKDIR /app
COPY . .
RUN mkdir -p /data && chown -R node:node /app /data
USER node
ENV NODE_ENV=production DATA_FILE=/data/store.json PORT=8080
EXPOSE 8080
CMD ["node", "server.mjs"]
