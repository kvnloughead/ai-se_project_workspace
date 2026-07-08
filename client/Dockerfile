FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY client/package.json ./client/
RUN npm ci -w client
COPY client/ ./client/
RUN npm run build -w client

FROM caddy:2-alpine
COPY --from=build /app/client/dist /srv
COPY client/Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
