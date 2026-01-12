-- CreateEnum
CREATE TYPE "JenisProdukTenant" AS ENUM ('MAKANAN', 'MINUMAN', 'PRODUK_UMKM', 'PRODUK_KESEHATAN', 'LAINNYA');

-- CreateEnum
CREATE TYPE "KegiatanEventTenant" AS ENUM ('SENAM_PAGI', 'FUN_RUN', 'KEDUANYA');

-- CreateEnum
CREATE TYPE "StatusTenant" AS ENUM ('PENDING', 'DISETUJUI', 'DITOLAK', 'AKTIF', 'SELESAI');

-- CreateTable
CREATE TABLE "event_tenants" (
    "id" TEXT NOT NULL,
    "nomorRegistrasi" TEXT NOT NULL,
    "namaEvent" TEXT NOT NULL,
    "namaTenant" TEXT NOT NULL,
    "namaPenanggungJawab" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "nomorTelepon" TEXT NOT NULL,
    "email" TEXT,
    "jenisProduk" "JenisProdukTenant"[],
    "jenisProdukLainnya" TEXT,
    "namaProdukUtama" TEXT NOT NULL,
    "deskripsiProduk" TEXT,
    "butuhListrik" BOOLEAN NOT NULL DEFAULT false,
    "kebutuhanListrik" TEXT,
    "perlengkapanDibawa" TEXT,
    "kegiatanDiikuti" "KegiatanEventTenant" NOT NULL DEFAULT 'KEDUANYA',
    "tanggalPernyataan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setujuSyaratKetentuan" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusTenant" NOT NULL DEFAULT 'PENDING',
    "lokasiStan" TEXT,
    "catatanPanitia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_tenants_nomorRegistrasi_key" ON "event_tenants"("nomorRegistrasi");

-- CreateIndex
CREATE INDEX "event_tenants_namaEvent_idx" ON "event_tenants"("namaEvent");

-- CreateIndex
CREATE INDEX "event_tenants_status_idx" ON "event_tenants"("status");

-- CreateIndex
CREATE INDEX "event_tenants_namaTenant_idx" ON "event_tenants"("namaTenant");

-- CreateIndex
CREATE INDEX "event_tenants_createdAt_idx" ON "event_tenants"("createdAt");
