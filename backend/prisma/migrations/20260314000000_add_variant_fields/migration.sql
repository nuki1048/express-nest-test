-- HolidayRentalVariant: Add bedrooms, maxPeople, couches, viewFromWindow, hasAc, photos
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "bedrooms" INTEGER;
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "maxPeople" INTEGER;
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "couches" INTEGER;
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "viewFromWindow" TEXT;
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "hasAc" BOOLEAN DEFAULT false;
ALTER TABLE "HolidayRentalVariant" ADD COLUMN "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "HolidayRentalVariant" v
SET
  bedrooms = hr."bedrooms",
  maxPeople = hr."maxPeople",
  couches = hr."couches",
  viewFromWindow = hr."viewFromWindow",
  hasAc = COALESCE(hr."hasAc", false),
  photos = COALESCE(hr."photos", ARRAY[]::TEXT[])
FROM "HolidayRental" hr
WHERE v."holidayRentalId" = hr."id";

UPDATE "HolidayRentalVariant" SET bedrooms = 1 WHERE bedrooms IS NULL;
UPDATE "HolidayRentalVariant" SET maxPeople = 1 WHERE maxPeople IS NULL;
UPDATE "HolidayRentalVariant" SET couches = 0 WHERE couches IS NULL;
UPDATE "HolidayRentalVariant" SET viewFromWindow = '' WHERE viewFromWindow IS NULL;
UPDATE "HolidayRentalVariant" SET hasAc = false WHERE hasAc IS NULL;
UPDATE "HolidayRentalVariant" SET photos = ARRAY[]::TEXT[] WHERE photos IS NULL;

ALTER TABLE "HolidayRentalVariant" ALTER COLUMN "bedrooms" SET NOT NULL;
ALTER TABLE "HolidayRentalVariant" ALTER COLUMN "maxPeople" SET NOT NULL;
ALTER TABLE "HolidayRentalVariant" ALTER COLUMN "couches" SET NOT NULL;
ALTER TABLE "HolidayRentalVariant" ALTER COLUMN "viewFromWindow" SET NOT NULL;
ALTER TABLE "HolidayRentalVariant" ALTER COLUMN "hasAc" SET NOT NULL;

-- YourFutureHomeVariant: Same
ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "bedrooms" INTEGER;
ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "maxPeople" INTEGER;
ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "couches" INTEGER;
ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "viewFromWindow" TEXT;
ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "hasAc" BOOLEAN DEFAULT false;
ALTER TABLE "YourFutureHomeVariant" ADD COLUMN "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "YourFutureHomeVariant" v
SET
  bedrooms = yfh."bedrooms",
  maxPeople = yfh."maxPeople",
  couches = yfh."couches",
  viewFromWindow = yfh."viewFromWindow",
  hasAc = COALESCE(yfh."hasAc", false),
  photos = COALESCE(yfh."photos", ARRAY[]::TEXT[])
FROM "YourFutureHome" yfh
WHERE v."yourFutureHomeId" = yfh."id";

UPDATE "YourFutureHomeVariant" SET bedrooms = 1 WHERE bedrooms IS NULL;
UPDATE "YourFutureHomeVariant" SET maxPeople = 1 WHERE maxPeople IS NULL;
UPDATE "YourFutureHomeVariant" SET couches = 0 WHERE couches IS NULL;
UPDATE "YourFutureHomeVariant" SET viewFromWindow = '' WHERE viewFromWindow IS NULL;
UPDATE "YourFutureHomeVariant" SET hasAc = false WHERE hasAc IS NULL;
UPDATE "YourFutureHomeVariant" SET photos = ARRAY[]::TEXT[] WHERE photos IS NULL;

ALTER TABLE "YourFutureHomeVariant" ALTER COLUMN "bedrooms" SET NOT NULL;
ALTER TABLE "YourFutureHomeVariant" ALTER COLUMN "maxPeople" SET NOT NULL;
ALTER TABLE "YourFutureHomeVariant" ALTER COLUMN "couches" SET NOT NULL;
ALTER TABLE "YourFutureHomeVariant" ALTER COLUMN "viewFromWindow" SET NOT NULL;
ALTER TABLE "YourFutureHomeVariant" ALTER COLUMN "hasAc" SET NOT NULL;
