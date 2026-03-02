-- AlterTable
-- Convert Contact.address from TEXT to JSONB (object with label and url)
ALTER TABLE "Contact" ADD COLUMN "address_new" JSONB;

UPDATE "Contact" SET "address_new" = jsonb_build_object('label', "address", 'url', '');

ALTER TABLE "Contact" DROP COLUMN "address";

ALTER TABLE "Contact" RENAME COLUMN "address_new" TO "address";

ALTER TABLE "Contact" ALTER COLUMN "address" SET NOT NULL;
