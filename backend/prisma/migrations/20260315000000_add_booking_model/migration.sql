-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "holidayRentalVariantId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "guestName" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_holidayRentalVariantId_idx" ON "Booking"("holidayRentalVariantId");

-- CreateIndex
CREATE INDEX "Booking_startDate_endDate_idx" ON "Booking"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_holidayRentalVariantId_fkey" FOREIGN KEY ("holidayRentalVariantId") REFERENCES "HolidayRentalVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
