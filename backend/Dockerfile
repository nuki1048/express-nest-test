# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY prisma.config.ts ./
COPY prisma ./prisma/
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src/

RUN yarn build

# Run stage
FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

# Run migrations then start the API (migrate deploy applies pending migrations)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
