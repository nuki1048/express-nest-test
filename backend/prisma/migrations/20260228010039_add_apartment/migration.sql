-- CreateTable
CREATE TABLE "Apartment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "maxPeople" INTEGER NOT NULL,
    "couches" INTEGER NOT NULL,
    "showers" INTEGER NOT NULL,
    "viewFromWindow" TEXT NOT NULL,
    "hasAc" BOOLEAN NOT NULL DEFAULT false,
    "mainPhoto" TEXT NOT NULL,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);
