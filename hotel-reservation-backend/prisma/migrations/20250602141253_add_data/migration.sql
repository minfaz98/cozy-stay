/*
  Warnings:

  - The values [CLERK] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `capacity` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CUSTOMER', 'COMPANY', 'MANAGER');
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "capacity" SET NOT NULL,
ALTER COLUMN "amenities" DROP DEFAULT;
