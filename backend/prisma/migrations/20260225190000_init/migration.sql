-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "phoneNumbers" TEXT[] NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "links" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactFormSubmission" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactFormSubmission_pkey" PRIMARY KEY ("id")
);
