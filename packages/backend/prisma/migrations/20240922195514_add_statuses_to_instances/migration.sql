/*
  Warnings:

  - Added the required column `status` to the `instances` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InstanceStatusEnumType" AS ENUM ('creating', 'active', 'stopping', 'starting', 'deleting');

-- AlterTable
ALTER TABLE "instances" ADD COLUMN     "status" "InstanceStatusEnumType" NOT NULL;
