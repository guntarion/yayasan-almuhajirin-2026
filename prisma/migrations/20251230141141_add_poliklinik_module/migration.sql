-- CreateEnum
CREATE TYPE "StatusPernikahan" AS ENUM ('belum_menikah', 'menikah', 'cerai_hidup', 'cerai_mati');

-- CreateEnum
CREATE TYPE "StatusKunjungan" AS ENUM ('menunggu', 'dalam_pemeriksaan', 'selesai', 'dirujuk', 'batal');

-- CreateEnum
CREATE TYPE "JenisPelayanan" AS ENUM ('umum', 'gigi', 'konsultasi');

-- CreateEnum
CREATE TYPE "GolonganDarah" AS ENUM ('A', 'B', 'AB', 'O', 'tidak_tahu');

-- CreateTable
CREATE TABLE "pasien_klinik" (
    "id" TEXT NOT NULL,
    "nomorRM" TEXT NOT NULL,
    "jamaahId" TEXT,
    "namaLengkap" TEXT NOT NULL,
    "jenisKelamin" "Gender" NOT NULL,
    "tanggalLahir" TIMESTAMP(3),
    "tempatLahir" TEXT,
    "golonganDarah" "GolonganDarah",
    "alamat" TEXT,
    "nomorHP" TEXT,
    "nomorHPDarurat" TEXT,
    "statusPernikahan" "StatusPernikahan",
    "pekerjaan" TEXT,
    "tanggalPertamaKunjungan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "penanggungJawab" TEXT,
    "hubunganPenanggungJawab" TEXT,
    "riwayatAlergi" TEXT,
    "riwayatPenyakitKronis" TEXT,
    "catatanKhusus" TEXT,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "pasien_klinik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kunjungan_klinik" (
    "id" TEXT NOT NULL,
    "nomorKunjungan" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "tanggalKunjungan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jenisPelayanan" "JenisPelayanan" NOT NULL DEFAULT 'umum',
    "dokter" TEXT,
    "keluhanUtama" TEXT,
    "statusKunjungan" "StatusKunjungan" NOT NULL DEFAULT 'menunggu',
    "nomorAntrian" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kunjungan_klinik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rekam_medis_klinik" (
    "id" TEXT NOT NULL,
    "kunjunganId" TEXT NOT NULL,
    "keluhanUtama" TEXT,
    "riwayatPenyakitSekarang" TEXT,
    "riwayatPenyakitDahulu" TEXT,
    "riwayatAlergi" TEXT,
    "riwayatObat" TEXT,
    "tekananDarahSistolik" INTEGER,
    "tekananDarahDiastolik" INTEGER,
    "nadi" INTEGER,
    "suhu" DECIMAL(4,1),
    "pernapasan" INTEGER,
    "beratBadan" DECIMAL(5,2),
    "tinggiBadan" DECIMAL(5,2),
    "imt" DECIMAL(4,1),
    "gulaDarah" INTEGER,
    "kolesterol" INTEGER,
    "asamUrat" DECIMAL(4,1),
    "catatanPemeriksaan" TEXT,
    "diagnosisUtama" TEXT,
    "diagnosisTambahan" TEXT,
    "kodeICD10" TEXT,
    "tindakanMedis" TEXT,
    "edukasiPasien" TEXT,
    "rencanaSelanjutnya" TEXT,
    "tanggalKontrol" TIMESTAMP(3),
    "rujukan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "rekam_medis_klinik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resep_obat_klinik" (
    "id" TEXT NOT NULL,
    "rekamMedisId" TEXT NOT NULL,
    "obatId" TEXT,
    "namaObat" TEXT NOT NULL,
    "dosis" TEXT,
    "aturanPakai" TEXT,
    "lamaPemakaian" TEXT,
    "jumlahObat" INTEGER NOT NULL DEFAULT 1,
    "satuan" TEXT NOT NULL DEFAULT 'tablet',
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resep_obat_klinik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_obat" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "namaGenerik" TEXT,
    "satuan" TEXT NOT NULL DEFAULT 'tablet',
    "stokAwal" INTEGER NOT NULL DEFAULT 0,
    "stokMasuk" INTEGER NOT NULL DEFAULT 0,
    "stokKeluar" INTEGER NOT NULL DEFAULT 0,
    "stokSaatIni" INTEGER NOT NULL DEFAULT 0,
    "stokMinimum" INTEGER NOT NULL DEFAULT 10,
    "kategori" TEXT,
    "keterangan" TEXT,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_obat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stok_obat_masuk" (
    "id" TEXT NOT NULL,
    "obatId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlah" INTEGER NOT NULL,
    "sumber" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "stok_obat_masuk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pasien_klinik_nomorRM_key" ON "pasien_klinik"("nomorRM");

-- CreateIndex
CREATE UNIQUE INDEX "pasien_klinik_jamaahId_key" ON "pasien_klinik"("jamaahId");

-- CreateIndex
CREATE INDEX "pasien_klinik_namaLengkap_idx" ON "pasien_klinik"("namaLengkap");

-- CreateIndex
CREATE INDEX "pasien_klinik_nomorHP_idx" ON "pasien_klinik"("nomorHP");

-- CreateIndex
CREATE INDEX "pasien_klinik_isAktif_idx" ON "pasien_klinik"("isAktif");

-- CreateIndex
CREATE INDEX "pasien_klinik_tanggalPertamaKunjungan_idx" ON "pasien_klinik"("tanggalPertamaKunjungan");

-- CreateIndex
CREATE UNIQUE INDEX "kunjungan_klinik_nomorKunjungan_key" ON "kunjungan_klinik"("nomorKunjungan");

-- CreateIndex
CREATE INDEX "kunjungan_klinik_pasienId_idx" ON "kunjungan_klinik"("pasienId");

-- CreateIndex
CREATE INDEX "kunjungan_klinik_tanggalKunjungan_idx" ON "kunjungan_klinik"("tanggalKunjungan");

-- CreateIndex
CREATE INDEX "kunjungan_klinik_statusKunjungan_idx" ON "kunjungan_klinik"("statusKunjungan");

-- CreateIndex
CREATE INDEX "kunjungan_klinik_dokter_idx" ON "kunjungan_klinik"("dokter");

-- CreateIndex
CREATE UNIQUE INDEX "rekam_medis_klinik_kunjunganId_key" ON "rekam_medis_klinik"("kunjunganId");

-- CreateIndex
CREATE INDEX "rekam_medis_klinik_kunjunganId_idx" ON "rekam_medis_klinik"("kunjunganId");

-- CreateIndex
CREATE INDEX "resep_obat_klinik_rekamMedisId_idx" ON "resep_obat_klinik"("rekamMedisId");

-- CreateIndex
CREATE INDEX "resep_obat_klinik_obatId_idx" ON "resep_obat_klinik"("obatId");

-- CreateIndex
CREATE UNIQUE INDEX "master_obat_kode_key" ON "master_obat"("kode");

-- CreateIndex
CREATE INDEX "master_obat_nama_idx" ON "master_obat"("nama");

-- CreateIndex
CREATE INDEX "master_obat_kategori_idx" ON "master_obat"("kategori");

-- CreateIndex
CREATE INDEX "master_obat_isAktif_idx" ON "master_obat"("isAktif");

-- CreateIndex
CREATE INDEX "stok_obat_masuk_obatId_idx" ON "stok_obat_masuk"("obatId");

-- CreateIndex
CREATE INDEX "stok_obat_masuk_tanggal_idx" ON "stok_obat_masuk"("tanggal");

-- AddForeignKey
ALTER TABLE "pasien_klinik" ADD CONSTRAINT "pasien_klinik_jamaahId_fkey" FOREIGN KEY ("jamaahId") REFERENCES "jamaah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kunjungan_klinik" ADD CONSTRAINT "kunjungan_klinik_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "pasien_klinik"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rekam_medis_klinik" ADD CONSTRAINT "rekam_medis_klinik_kunjunganId_fkey" FOREIGN KEY ("kunjunganId") REFERENCES "kunjungan_klinik"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resep_obat_klinik" ADD CONSTRAINT "resep_obat_klinik_rekamMedisId_fkey" FOREIGN KEY ("rekamMedisId") REFERENCES "rekam_medis_klinik"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resep_obat_klinik" ADD CONSTRAINT "resep_obat_klinik_obatId_fkey" FOREIGN KEY ("obatId") REFERENCES "master_obat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stok_obat_masuk" ADD CONSTRAINT "stok_obat_masuk_obatId_fkey" FOREIGN KEY ("obatId") REFERENCES "master_obat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
