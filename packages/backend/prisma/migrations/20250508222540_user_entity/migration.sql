/*
  Warnings:

  - You are about to drop the column `objectsCount` on the `s3_buckets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "s3_buckets" DROP COLUMN "objectsCount";
