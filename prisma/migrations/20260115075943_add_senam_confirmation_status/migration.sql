-- CreateEnum
CREATE TYPE "StatusKonfirmasi" AS ENUM ('belum_terkonfirmasi', 'terkonfirmasi');

-- AlterTable
ALTER TABLE "senam_registrants" ADD COLUMN     "statusKonfirmasi" "StatusKonfirmasi" NOT NULL DEFAULT 'belum_terkonfirmasi',
ADD COLUMN     "tanggalKonfirmasi" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "senam_registrants_statusKonfirmasi_idx" ON "senam_registrants"("statusKonfirmasi");
