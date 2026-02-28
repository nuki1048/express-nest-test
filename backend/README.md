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

For **apartment image uploads** in the admin panel, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`, and create a **public** Storage bucket named `apartments` in the Supabase Dashboard (Storage → New bucket).

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
