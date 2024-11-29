/*
  Warnings:

  - You are about to drop the column `status` on the `instances` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "instances" DROP COLUMN "status";

-- DropEnum
DROP TYPE "InstanceStatusEnumType";
