-- AlterTable
ALTER TABLE "instances" ADD COLUMN     "lastBackupAt" TIMESTAMP(3),
ADD COLUMN     "lastBackupBucket" TEXT,
ADD COLUMN     "lastBackupKey" TEXT;
