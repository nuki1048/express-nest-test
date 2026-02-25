# real-estate-rental

## Setup

### 1. Database

**Docker (recommended):**

```bash
docker compose up -d postgres
```

**Or local PostgreSQL:** install and start (e.g. `brew install postgresql@16 && brew services start postgresql@16`), then `createdb appartaments_rent`. Use your local user in `DATABASE_URL` (see below).

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit DATABASE_URL if not using Docker default
yarn install
```

Migrations are in `backend/prisma/migrations`. For a **clean database** (e.g. first run or after reset), run once from `backend/`: `npx prisma migrate deploy` (or start the stack with Docker; the API runs it on startup).

`.env` for Docker Postgres:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appartaments_rent"
```

### 3. Seed

- **Docker:** `docker compose --profile tools run --rm seed`
- **Host:** from `backend/` run `yarn seed` (ensure `.env` points at your DB)

### 4. Run

- **Full stack:** `docker compose up` (API + Postgres). The API container runs `prisma migrate deploy` on startup, then starts the server.
- **API only (local):** from `backend/` run `yarn start:dev`

### Clean slate (P3009 or “failed migration” / “No migration found”)

If the database has an old or failed migration state, reset it and apply the single `init` migration from scratch.

**Docker:** from project root:

```bash
docker compose down -v
docker compose up --build
```

`-v` removes the Postgres volume, so the DB is recreated empty and `prisma migrate deploy` will apply the init migration on startup.

**Local Postgres:** drop and recreate the database (e.g. `dropdb appartaments_rent && createdb appartaments_rent`), then from `backend/` run `npx prisma migrate deploy`.
