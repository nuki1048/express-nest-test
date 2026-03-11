-- Add readTime to BlogPost
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "readTime" TEXT;

-- Create ApartmentVariant table
CREATE TABLE "ApartmentVariant" (
    "id" TEXT NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "maxPeople" INTEGER NOT NULL,
    "couches" INTEGER NOT NULL,
    "showers" INTEGER NOT NULL,
    "viewFromWindow" TEXT NOT NULL,
    "hasAc" BOOLEAN NOT NULL DEFAULT false,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "translations" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApartmentVariant_pkey" PRIMARY KEY ("id")
);

-- Migrate existing apartment data to variants (one variant per apartment)
INSERT INTO "ApartmentVariant" ("id", "apartmentId", "bedrooms", "maxPeople", "couches", "showers", "viewFromWindow", "hasAc", "photos", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::text,
    "id",
    COALESCE("bedrooms", 1),
    COALESCE("maxPeople", 1),
    COALESCE("couches", 0),
    COALESCE("showers", 1),
    COALESCE("viewFromWindow", ''),
    COALESCE("hasAc", false),
    COALESCE("photos", ARRAY[]::TEXT[]),
    "createdAt",
    "updatedAt"
FROM "Apartment";

-- Add airbnb and booking to Apartment
ALTER TABLE "Apartment" ADD COLUMN IF NOT EXISTS "airbnb" TEXT;
ALTER TABLE "Apartment" ADD COLUMN IF NOT EXISTS "booking" TEXT;

-- Drop moved columns from Apartment
ALTER TABLE "Apartment" DROP COLUMN IF EXISTS "bedrooms";
ALTER TABLE "Apartment" DROP COLUMN IF EXISTS "maxPeople";
ALTER TABLE "Apartment" DROP COLUMN IF EXISTS "couches";
ALTER TABLE "Apartment" DROP COLUMN IF EXISTS "showers";
ALTER TABLE "Apartment" DROP COLUMN IF EXISTS "viewFromWindow";
ALTER TABLE "Apartment" DROP COLUMN IF EXISTS "hasAc";
ALTER TABLE "Apartment" DROP COLUMN IF EXISTS "photos";

-- Add foreign key and index for ApartmentVariant
CREATE INDEX "ApartmentVariant_apartmentId_idx" ON "ApartmentVariant"("apartmentId");
ALTER TABLE "ApartmentVariant" ADD CONSTRAINT "ApartmentVariant_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
