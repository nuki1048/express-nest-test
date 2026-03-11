-- Rename Apartment to HolidayRental
ALTER TABLE "Apartment" RENAME TO "HolidayRental";

-- Rename ApartmentVariant to HolidayRentalVariant and update FK column
ALTER TABLE "ApartmentVariant" RENAME TO "HolidayRentalVariant";
ALTER TABLE "HolidayRentalVariant" RENAME COLUMN "apartmentId" TO "holidayRentalId";

-- Drop old FK and index, add new ones
ALTER TABLE "HolidayRentalVariant" DROP CONSTRAINT IF EXISTS "ApartmentVariant_apartmentId_fkey";
DROP INDEX IF EXISTS "ApartmentVariant_apartmentId_idx";
CREATE INDEX "HolidayRentalVariant_holidayRentalId_idx" ON "HolidayRentalVariant"("holidayRentalId");
ALTER TABLE "HolidayRentalVariant" ADD CONSTRAINT "HolidayRentalVariant_holidayRentalId_fkey" FOREIGN KEY ("holidayRentalId") REFERENCES "HolidayRental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create YourFutureHome table
CREATE TABLE "YourFutureHome" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mainPhoto" TEXT NOT NULL,
    "airbnb" TEXT,
    "booking" TEXT,
    "translations" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YourFutureHome_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "YourFutureHome_slug_key" ON "YourFutureHome"("slug");

-- Create YourFutureHomeVariant table
CREATE TABLE "YourFutureHomeVariant" (
    "id" TEXT NOT NULL,
    "yourFutureHomeId" TEXT NOT NULL,
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

    CONSTRAINT "YourFutureHomeVariant_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "YourFutureHomeVariant_yourFutureHomeId_idx" ON "YourFutureHomeVariant"("yourFutureHomeId");
ALTER TABLE "YourFutureHomeVariant" ADD CONSTRAINT "YourFutureHomeVariant_yourFutureHomeId_fkey" FOREIGN KEY ("yourFutureHomeId") REFERENCES "YourFutureHome"("id") ON DELETE CASCADE ON UPDATE CASCADE;
