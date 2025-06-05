/*
  Warnings:

  - Made the column `paymentMethod` on table `Billing` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Billing" ALTER COLUMN "paymentMethod" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "autoCancelAt" TIMESTAMP(3);
