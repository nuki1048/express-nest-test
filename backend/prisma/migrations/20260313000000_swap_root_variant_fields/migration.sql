-- HolidayRental: Add new root columns (from variants)
ALTER TABLE "HolidayRental" ADD COLUMN "bedrooms_new" INTEGER;
ALTER TABLE "HolidayRental" ADD COLUMN "maxPeople_new" INTEGER;
ALTER TABLE "HolidayRental" ADD COLUMN "couches_new" INTEGER;
ALTER TABLE "HolidayRental" ADD COLUMN "showers_new" INTEGER;
ALTER TABLE "HolidayRental" ADD COLUMN "viewFromWindow_new" TEXT;
ALTER TABLE "HolidayRental" ADD COLUMN "hasAc_new" BOOLEAN DEFAULT false;
ALTER TABLE "HolidayRental" ADD COLUMN "photos_new" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- HolidayRentalVariant: Add new columns (from root)
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "title_new" TEXT;
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "description_new" TEXT;
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "airbnb_new" TEXT;
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "booking_new" TEXT;

-- Migrate: first variant -> root
UPDATE "HolidayRental" hr
SET
  bedrooms_new = v."bedrooms",
  maxPeople_new = v."maxPeople",
  couches_new = v."couches",
  showers_new = v."showers",
  viewFromWindow_new = v."viewFromWindow",
  hasAc_new = COALESCE(v."hasAc", false),
  photos_new = COALESCE(v."photos", ARRAY[]::TEXT[])
FROM (
  SELECT DISTINCT ON ("holidayRentalId") *
  FROM "HolidayRentalVariant"
  ORDER BY "holidayRentalId", "createdAt"
) v
WHERE hr."id" = v."holidayRentalId";

-- Migrate: root -> all variants
UPDATE "HolidayRentalVariant" v
SET
  title_new = hr."title",
  description_new = hr."description",
  airbnb_new = hr."airbnb",
  booking_new = hr."booking"
FROM "HolidayRental" hr
WHERE v."holidayRentalId" = hr."id";

-- Fill NULLs for root records without variants (fallback)
UPDATE "HolidayRental" SET bedrooms_new = 1 WHERE bedrooms_new IS NULL;
UPDATE "HolidayRental" SET maxPeople_new = 1 WHERE maxPeople_new IS NULL;
UPDATE "HolidayRental" SET couches_new = 0 WHERE couches_new IS NULL;
UPDATE "HolidayRental" SET showers_new = 1 WHERE showers_new IS NULL;
UPDATE "HolidayRental" SET viewFromWindow_new = '' WHERE viewFromWindow_new IS NULL;
UPDATE "HolidayRental" SET hasAc_new = false WHERE hasAc_new IS NULL;
UPDATE "HolidayRental" SET photos_new = ARRAY[]::TEXT[] WHERE photos_new IS NULL;

-- HolidayRental: Drop old, rename new
ALTER TABLE "HolidayRental" DROP COLUMN "title";
ALTER TABLE "HolidayRental" DROP COLUMN "description";
ALTER TABLE "HolidayRental" DROP COLUMN "airbnb";
ALTER TABLE "HolidayRental" DROP COLUMN "booking";

ALTER TABLE "HolidayRental" RENAME COLUMN "bedrooms_new" TO "bedrooms";
ALTER TABLE "HolidayRental" RENAME COLUMN "maxPeople_new" TO "maxPeople";
ALTER TABLE "HolidayRental" RENAME COLUMN "couches_new" TO "couches";
ALTER TABLE "HolidayRental" RENAME COLUMN "showers_new" TO "showers";
ALTER TABLE "HolidayRental" RENAME COLUMN "viewFromWindow_new" TO "viewFromWindow";
ALTER TABLE "HolidayRental" RENAME COLUMN "hasAc_new" TO "hasAc";
ALTER TABLE "HolidayRental" RENAME COLUMN "photos_new" TO "photos";

-- HolidayRentalVariant: Drop old, rename new
ALTER TABLE "HolidayRentalVariant" DROP COLUMN "bedrooms";
ALTER TABLE "HolidayRentalVariant" DROP COLUMN "maxPeople";
ALTER TABLE "HolidayRentalVariant" DROP COLUMN "couches";
ALTER TABLE "HolidayRentalVariant" DROP COLUMN "showers";
ALTER TABLE "HolidayRentalVariant" DROP COLUMN "viewFromWindow";
ALTER TABLE "HolidayRentalVariant" DROP COLUMN "hasAc";
ALTER TABLE "HolidayRentalVariant" DROP COLUMN "photos";

ALTER TABLE "HolidayRentalVariant" RENAME COLUMN "title_new" TO "title";
ALTER TABLE "HolidayRentalVariant" RENAME COLUMN "description_new" TO "description";
ALTER TABLE "HolidayRentalVariant" RENAME COLUMN "airbnb_new" TO "airbnb";
ALTER TABLE "HolidayRentalVariant" RENAME COLUMN "booking_new" TO "booking";

ALTER TABLE "HolidayRentalVariant" ALTER COLUMN "title" SET NOT NULL;
ALTER TABLE "HolidayRentalVariant" ALTER COLUMN "description" SET NOT NULL;

-- YourFutureHome: Same transformation
ALTER TABLE "YourFutureHome" ADD COLUMN "bedrooms_new" INTEGER;
ALTER TABLE "YourFutureHome" ADD COLUMN "maxPeople_new" INTEGER;
ALTER TABLE "YourFutureHome" ADD COLUMN "couches_new" INTEGER;
ALTER TABLE "YourFutureHome" ADD COLUMN "showers_new" INTEGER;
ALTER TABLE "YourFutureHome" ADD COLUMN "viewFromWindow_new" TEXT;
ALTER TABLE "YourFutureHome" ADD COLUMN "hasAc_new" BOOLEAN DEFAULT false;
ALTER TABLE "YourFutureHome" ADD COLUMN "photos_new" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "title_new" TEXT;
ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "description_new" TEXT;
ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "airbnb_new" TEXT;
ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "booking_new" TEXT;

UPDATE "YourFutureHome" yfh
SET
  bedrooms_new = v."bedrooms",
  maxPeople_new = v."maxPeople",
  couches_new = v."couches",
  showers_new = v."showers",
  viewFromWindow_new = v."viewFromWindow",
  hasAc_new = COALESCE(v."hasAc", false),
  photos_new = COALESCE(v."photos", ARRAY[]::TEXT[])
FROM (
  SELECT DISTINCT ON ("yourFutureHomeId") *
  FROM "YourFutureHomeVariant"
  ORDER BY "yourFutureHomeId", "createdAt"
) v
WHERE yfh."id" = v."yourFutureHomeId";

UPDATE "YourFutureHomeVariant" v
SET
  title_new = yfh."title",
  description_new = yfh."description",
  airbnb_new = yfh."airbnb",
  booking_new = yfh."booking"
FROM "YourFutureHome" yfh
WHERE v."yourFutureHomeId" = yfh."id";

-- Fill NULLs for YourFutureHome without variants (empty table case)
UPDATE "YourFutureHome" SET bedrooms_new = 1 WHERE bedrooms_new IS NULL;
UPDATE "YourFutureHome" SET maxPeople_new = 1 WHERE maxPeople_new IS NULL;
UPDATE "YourFutureHome" SET couches_new = 0 WHERE couches_new IS NULL;
UPDATE "YourFutureHome" SET showers_new = 1 WHERE showers_new IS NULL;
UPDATE "YourFutureHome" SET viewFromWindow_new = '' WHERE viewFromWindow_new IS NULL;
UPDATE "YourFutureHome" SET hasAc_new = false WHERE hasAc_new IS NULL;
UPDATE "YourFutureHome" SET photos_new = ARRAY[]::TEXT[] WHERE photos_new IS NULL;

ALTER TABLE "YourFutureHome" DROP COLUMN "title";
ALTER TABLE "YourFutureHome" DROP COLUMN "description";
ALTER TABLE "YourFutureHome" DROP COLUMN "airbnb";
ALTER TABLE "YourFutureHome" DROP COLUMN "booking";

ALTER TABLE "YourFutureHome" RENAME COLUMN "bedrooms_new" TO "bedrooms";
ALTER TABLE "YourFutureHome" RENAME COLUMN "maxPeople_new" TO "maxPeople";
ALTER TABLE "YourFutureHome" RENAME COLUMN "couches_new" TO "couches";
ALTER TABLE "YourFutureHome" RENAME COLUMN "showers_new" TO "showers";
ALTER TABLE "YourFutureHome" RENAME COLUMN "viewFromWindow_new" TO "viewFromWindow";
ALTER TABLE "YourFutureHome" RENAME COLUMN "hasAc_new" TO "hasAc";
ALTER TABLE "YourFutureHome" RENAME COLUMN "photos_new" TO "photos";

ALTER TABLE "YourFutureHomeVariant" DROP COLUMN "bedrooms";
ALTER TABLE "YourFutureHomeVariant" DROP COLUMN "maxPeople";
ALTER TABLE "YourFutureHomeVariant" DROP COLUMN "couches";
ALTER TABLE "YourFutureHomeVariant" DROP COLUMN "showers";
ALTER TABLE "YourFutureHomeVariant" DROP COLUMN "viewFromWindow";
ALTER TABLE "YourFutureHomeVariant" DROP COLUMN "hasAc";
ALTER TABLE "YourFutureHomeVariant" DROP COLUMN "photos";

ALTER TABLE "YourFutureHomeVariant" RENAME COLUMN "title_new" TO "title";
ALTER TABLE "YourFutureHomeVariant" RENAME COLUMN "description_new" TO "description";
ALTER TABLE "YourFutureHomeVariant" RENAME COLUMN "airbnb_new" TO "airbnb";
ALTER TABLE "YourFutureHomeVariant" RENAME COLUMN "booking_new" TO "booking";

ALTER TABLE "YourFutureHomeVariant" ALTER COLUMN "title" SET NOT NULL;
ALTER TABLE "YourFutureHomeVariant" ALTER COLUMN "description" SET NOT NULL;
