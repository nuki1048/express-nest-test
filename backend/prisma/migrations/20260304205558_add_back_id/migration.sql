/*
  Warnings:

  - The primary key for the `Apartment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BlogPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[slug]` on the table `Apartment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `BlogPost` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Apartment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `BlogPost` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP CONSTRAINT "Apartment_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_slug_key" ON "Apartment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
