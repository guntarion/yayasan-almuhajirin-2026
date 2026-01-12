-- AlterTable
ALTER TABLE "event_tenants" ADD COLUMN     "statusPembayaran" "StatusPembayaran" NOT NULL DEFAULT 'belum_bayar',
ADD COLUMN     "tanggalBayar" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "event_tenants_statusPembayaran_idx" ON "event_tenants"("statusPembayaran");
