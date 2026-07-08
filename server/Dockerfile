FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY server/package.json ./server/
RUN npm ci -w server
COPY server/ ./server/
RUN npm run build -w server

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY server/package.json ./server/
RUN npm ci -w server --omit=dev
WORKDIR /app/server
COPY --from=build /app/server/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
