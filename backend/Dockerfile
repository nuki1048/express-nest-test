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

# DATABASE_URL from env_file at runtime. Migrate then start; exec keeps node as PID 1.
CMD ["sh", "-c", "if [ -z \"$DATABASE_URL\" ]; then echo 'Error: DATABASE_URL is not set'; exit 1; fi; npx prisma migrate deploy && exec node dist/main.js"]
