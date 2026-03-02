-- AlterTable: Replace BlogPost id with slug (derived from title)
-- Step 1: Add slug column (nullable temporarily for backfill)
ALTER TABLE "BlogPost" ADD COLUMN "slug" TEXT;

-- Step 2: Backfill slug from title (slugify: lowercase, spaces to hyphens, strip non-alphanumeric)
-- Handle duplicate slugs by appending -2, -3, etc.
WITH slug_base AS (
  SELECT
    "id",
    LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM("title"), '\s+', '-', 'g'), '[^a-z0-9-]', '', 'gi')) AS base_slug
  FROM "BlogPost"
),
slug_dedup AS (
  SELECT
    "id",
    base_slug,
    ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY "id") AS rn
  FROM slug_base
)
UPDATE "BlogPost" b
SET "slug" = CASE
  WHEN d.rn = 1 THEN d.base_slug
  ELSE d.base_slug || '-' || d.rn
END
FROM slug_dedup d
WHERE b."id" = d."id";

-- Step 3: Ensure no empty slugs (fallback for empty title)
UPDATE "BlogPost" SET "slug" = 'blog-post-' || "id" WHERE "slug" = '' OR "slug" IS NULL;

-- Step 4: Make slug NOT NULL
ALTER TABLE "BlogPost" ALTER COLUMN "slug" SET NOT NULL;

-- Step 5: Drop old primary key and set new one
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_pkey";
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("slug");

-- Step 6: Remove id column
ALTER TABLE "BlogPost" DROP COLUMN "id";
