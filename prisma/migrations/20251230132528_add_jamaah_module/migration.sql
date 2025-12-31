-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "JenisProgram" AS ENUM ('pendapatan', 'pengeluaran');

-- CreateEnum
CREATE TYPE "StatusProgram" AS ENUM ('draft', 'aktif', 'selesai', 'ditunda', 'batal');

-- CreateEnum
CREATE TYPE "SifatProgram" AS ENUM ('rutin', 'proyek', 'insidental');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('income', 'expense');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'bank', 'transfer');

-- CreateEnum
CREATE TYPE "JournalEntryType" AS ENUM ('debit', 'credit');

-- CreateEnum
CREATE TYPE "AccountCategory" AS ENUM ('aset', 'kewajiban', 'aset_bersih', 'pendapatan', 'beban');

-- CreateEnum
CREATE TYPE "NormalBalance" AS ENUM ('debit', 'credit');

-- CreateEnum
CREATE TYPE "RestrictionType" AS ENUM ('temporary', 'permanent');

-- CreateEnum
CREATE TYPE "SebutanJamaah" AS ENUM ('Pak', 'Bu', 'Mas', 'Mbak', 'Kel', 'Ustadz', 'Ustadzah', 'Haji', 'Hajah');

-- CreateEnum
CREATE TYPE "AlamatRW" AS ENUM ('RW6', 'RW8', 'RW9', 'RWLainnya');

-- CreateEnum
CREATE TYPE "AlamatWilayah" AS ENUM ('Rewwin', 'Lainnya');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "unitId" TEXT;

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "subdomain" TEXT NOT NULL,
    "logo" TEXT,
    "color" TEXT DEFAULT '#0ea5e9',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT DEFAULT '#6b7280',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "unitId" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" VARCHAR(500),
    "featuredImage" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "readingTime" INTEGER,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" VARCHAR(70),
    "metaDescription" VARCHAR(160),
    "metaKeywords" TEXT,
    "canonicalUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tags" (
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("articleId","tagId")
);

-- CreateTable
CREATE TABLE "article_revisions" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" VARCHAR(500),
    "editedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "caption" TEXT,
    "folder" TEXT DEFAULT 'uploads',
    "uploadedById" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "eventDate" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_media" (
    "galleryId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "caption" TEXT,

    CONSTRAINT "gallery_media_pkey" PRIMARY KEY ("galleryId","mediaId")
);

-- CreateTable
CREATE TABLE "article_galleries" (
    "articleId" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,

    CONSTRAINT "article_galleries_pkey" PRIMARY KEY ("articleId","galleryId")
);

-- CreateTable
CREATE TABLE "fiscal_periods" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kode_akun" (
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" "AccountCategory" NOT NULL,
    "subKategori" TEXT,
    "normalBalance" "NormalBalance" NOT NULL,
    "isContraAccount" BOOLEAN NOT NULL DEFAULT false,
    "isRestricted" BOOLEAN NOT NULL DEFAULT false,
    "restrictionType" "RestrictionType",
    "deskripsi" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kode_akun_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "bidang" (
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bidang_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "unit_kerja" (
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "bidangKode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_kerja_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "program_kerja" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "bidangKode" TEXT NOT NULL,
    "unitKerjaKode" TEXT NOT NULL,
    "jenis" "JenisProgram" NOT NULL,
    "status" "StatusProgram" NOT NULL DEFAULT 'draft',
    "sifat" "SifatProgram" NOT NULL DEFAULT 'rutin',
    "kategori" TEXT,
    "pic" TEXT,
    "deskripsi" TEXT,
    "targetCapaian" TEXT,
    "fiscalYear" INTEGER NOT NULL,
    "fiscalPeriodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_items" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "kodeItem" TEXT NOT NULL,
    "namaItem" TEXT NOT NULL,
    "keterangan" TEXT,
    "volume" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "satuan" TEXT NOT NULL DEFAULT 'unit',
    "hargaSatuan" DECIMAL(15,2) NOT NULL,
    "jumlah" DECIMAL(15,2) NOT NULL,
    "kodeAkun" TEXT NOT NULL,
    "kodeAkunPasangan" TEXT,
    "isRestricted" BOOLEAN NOT NULL DEFAULT false,
    "restrictionType" "RestrictionType",
    "realisasi" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jan" DECIMAL(15,2),
    "feb" DECIMAL(15,2),
    "mar" DECIMAL(15,2),
    "apr" DECIMAL(15,2),
    "mei" DECIMAL(15,2),
    "jun" DECIMAL(15,2),
    "jul" DECIMAL(15,2),
    "agu" DECIMAL(15,2),
    "sep" DECIMAL(15,2),
    "okt" DECIMAL(15,2),
    "nov" DECIMAL(15,2),
    "des" DECIMAL(15,2),

    CONSTRAINT "program_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT NOT NULL,
    "entityName" TEXT,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'bank',
    "isRestricted" BOOLEAN NOT NULL DEFAULT false,
    "restrictionType" "RestrictionType",
    "autoJournal" BOOLEAN NOT NULL DEFAULT true,
    "attachmentPath" TEXT,
    "notes" TEXT,
    "createdBy" TEXT,
    "fiscalPeriodId" TEXT NOT NULL,
    "bidangKode" TEXT,
    "unitKerjaKode" TEXT,
    "programKerjaId" TEXT,
    "programItemId" TEXT,
    "isVoided" BOOLEAN NOT NULL DEFAULT false,
    "voidReason" TEXT,
    "voidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "entryType" "JournalEntryType" NOT NULL,
    "kodeAkun" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jamaah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "sebutan" "SebutanJamaah",
    "anonymizeDisplay" BOOLEAN NOT NULL DEFAULT false,
    "nomerHandphone" TEXT,
    "email" TEXT,
    "alamatJalan" TEXT,
    "alamatRW" "AlamatRW",
    "alamatRT" TEXT,
    "alamatWilayah" "AlamatWilayah",
    "alamatDetail" TEXT,
    "gender" "Gender",
    "tanggalLahir" TIMESTAMP(3),
    "profesi" TEXT,
    "isJamaahAktif" BOOLEAN NOT NULL DEFAULT true,
    "isPengunjungKlinik" BOOLEAN NOT NULL DEFAULT false,
    "isDonatur" BOOLEAN NOT NULL DEFAULT false,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jamaah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_klinik" (
    "id" TEXT NOT NULL,
    "jamaahId" TEXT NOT NULL,
    "tanggalKunjungan" TIMESTAMP(3) NOT NULL,
    "keluhan" TEXT,
    "diagnosa" TEXT,
    "tindakan" TEXT,
    "obat" TEXT,
    "dokter" TEXT,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riwayat_klinik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donasi_jamaah" (
    "id" TEXT NOT NULL,
    "jamaahId" TEXT NOT NULL,
    "tanggalDonasi" TIMESTAMP(3) NOT NULL,
    "jumlah" DECIMAL(15,2) NOT NULL,
    "jenisDonasi" TEXT NOT NULL,
    "programDonasi" TEXT,
    "metodePembayaran" TEXT,
    "buktiTransfer" TEXT,
    "keterangan" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donasi_jamaah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "units_slug_key" ON "units"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "units_subdomain_key" ON "units"("subdomain");

-- CreateIndex
CREATE INDEX "categories_unitId_idx" ON "categories"("unitId");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_isGlobal_idx" ON "categories"("isGlobal");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_unitId_key" ON "categories"("slug", "unitId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "articles_unitId_idx" ON "articles"("unitId");

-- CreateIndex
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");

-- CreateIndex
CREATE INDEX "articles_categoryId_idx" ON "articles"("categoryId");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE INDEX "articles_createdAt_idx" ON "articles"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_unitId_key" ON "articles"("slug", "unitId");

-- CreateIndex
CREATE INDEX "article_revisions_articleId_idx" ON "article_revisions"("articleId");

-- CreateIndex
CREATE INDEX "media_unitId_idx" ON "media"("unitId");

-- CreateIndex
CREATE INDEX "media_uploadedById_idx" ON "media"("uploadedById");

-- CreateIndex
CREATE INDEX "media_mimeType_idx" ON "media"("mimeType");

-- CreateIndex
CREATE INDEX "media_folder_idx" ON "media"("folder");

-- CreateIndex
CREATE INDEX "galleries_unitId_idx" ON "galleries"("unitId");

-- CreateIndex
CREATE INDEX "galleries_authorId_idx" ON "galleries"("authorId");

-- CreateIndex
CREATE INDEX "galleries_isPublished_idx" ON "galleries"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "galleries_slug_unitId_key" ON "galleries"("slug", "unitId");

-- CreateIndex
CREATE UNIQUE INDEX "fiscal_periods_year_key" ON "fiscal_periods"("year");

-- CreateIndex
CREATE INDEX "kode_akun_kategori_idx" ON "kode_akun"("kategori");

-- CreateIndex
CREATE INDEX "kode_akun_isActive_idx" ON "kode_akun"("isActive");

-- CreateIndex
CREATE INDEX "unit_kerja_bidangKode_idx" ON "unit_kerja"("bidangKode");

-- CreateIndex
CREATE UNIQUE INDEX "program_kerja_kode_key" ON "program_kerja"("kode");

-- CreateIndex
CREATE INDEX "program_kerja_bidangKode_idx" ON "program_kerja"("bidangKode");

-- CreateIndex
CREATE INDEX "program_kerja_unitKerjaKode_idx" ON "program_kerja"("unitKerjaKode");

-- CreateIndex
CREATE INDEX "program_kerja_fiscalPeriodId_idx" ON "program_kerja"("fiscalPeriodId");

-- CreateIndex
CREATE INDEX "program_kerja_fiscalYear_idx" ON "program_kerja"("fiscalYear");

-- CreateIndex
CREATE INDEX "program_kerja_jenis_idx" ON "program_kerja"("jenis");

-- CreateIndex
CREATE INDEX "program_kerja_status_idx" ON "program_kerja"("status");

-- CreateIndex
CREATE INDEX "program_items_programId_idx" ON "program_items"("programId");

-- CreateIndex
CREATE INDEX "program_items_kodeAkun_idx" ON "program_items"("kodeAkun");

-- CreateIndex
CREATE UNIQUE INDEX "program_items_programId_kodeItem_key" ON "program_items"("programId", "kodeItem");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_code_key" ON "transactions"("code");

-- CreateIndex
CREATE INDEX "transactions_transactionDate_idx" ON "transactions"("transactionDate");

-- CreateIndex
CREATE INDEX "transactions_fiscalPeriodId_idx" ON "transactions"("fiscalPeriodId");

-- CreateIndex
CREATE INDEX "transactions_bidangKode_idx" ON "transactions"("bidangKode");

-- CreateIndex
CREATE INDEX "transactions_unitKerjaKode_idx" ON "transactions"("unitKerjaKode");

-- CreateIndex
CREATE INDEX "transactions_programKerjaId_idx" ON "transactions"("programKerjaId");

-- CreateIndex
CREATE INDEX "transactions_programItemId_idx" ON "transactions"("programItemId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_isVoided_idx" ON "transactions"("isVoided");

-- CreateIndex
CREATE INDEX "journal_entries_transactionId_idx" ON "journal_entries"("transactionId");

-- CreateIndex
CREATE INDEX "journal_entries_kodeAkun_idx" ON "journal_entries"("kodeAkun");

-- CreateIndex
CREATE INDEX "jamaah_isJamaahAktif_idx" ON "jamaah"("isJamaahAktif");

-- CreateIndex
CREATE INDEX "jamaah_isPengunjungKlinik_idx" ON "jamaah"("isPengunjungKlinik");

-- CreateIndex
CREATE INDEX "jamaah_isDonatur_idx" ON "jamaah"("isDonatur");

-- CreateIndex
CREATE INDEX "jamaah_alamatRW_idx" ON "jamaah"("alamatRW");

-- CreateIndex
CREATE INDEX "jamaah_alamatWilayah_idx" ON "jamaah"("alamatWilayah");

-- CreateIndex
CREATE INDEX "riwayat_klinik_jamaahId_idx" ON "riwayat_klinik"("jamaahId");

-- CreateIndex
CREATE INDEX "riwayat_klinik_tanggalKunjungan_idx" ON "riwayat_klinik"("tanggalKunjungan");

-- CreateIndex
CREATE INDEX "donasi_jamaah_jamaahId_idx" ON "donasi_jamaah"("jamaahId");

-- CreateIndex
CREATE INDEX "donasi_jamaah_tanggalDonasi_idx" ON "donasi_jamaah"("tanggalDonasi");

-- CreateIndex
CREATE INDEX "donasi_jamaah_jenisDonasi_idx" ON "donasi_jamaah"("jenisDonasi");

-- CreateIndex
CREATE INDEX "donasi_jamaah_isVerified_idx" ON "donasi_jamaah"("isVerified");

-- CreateIndex
CREATE INDEX "users_unitId_idx" ON "users"("unitId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_media" ADD CONSTRAINT "gallery_media_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_media" ADD CONSTRAINT "gallery_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_galleries" ADD CONSTRAINT "article_galleries_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_galleries" ADD CONSTRAINT "article_galleries_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_kerja" ADD CONSTRAINT "unit_kerja_bidangKode_fkey" FOREIGN KEY ("bidangKode") REFERENCES "bidang"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_kerja" ADD CONSTRAINT "program_kerja_bidangKode_fkey" FOREIGN KEY ("bidangKode") REFERENCES "bidang"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_kerja" ADD CONSTRAINT "program_kerja_unitKerjaKode_fkey" FOREIGN KEY ("unitKerjaKode") REFERENCES "unit_kerja"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_kerja" ADD CONSTRAINT "program_kerja_fiscalPeriodId_fkey" FOREIGN KEY ("fiscalPeriodId") REFERENCES "fiscal_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_items" ADD CONSTRAINT "program_items_programId_fkey" FOREIGN KEY ("programId") REFERENCES "program_kerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_items" ADD CONSTRAINT "program_items_kodeAkun_fkey" FOREIGN KEY ("kodeAkun") REFERENCES "kode_akun"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_items" ADD CONSTRAINT "program_items_kodeAkunPasangan_fkey" FOREIGN KEY ("kodeAkunPasangan") REFERENCES "kode_akun"("kode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fiscalPeriodId_fkey" FOREIGN KEY ("fiscalPeriodId") REFERENCES "fiscal_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bidangKode_fkey" FOREIGN KEY ("bidangKode") REFERENCES "bidang"("kode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_unitKerjaKode_fkey" FOREIGN KEY ("unitKerjaKode") REFERENCES "unit_kerja"("kode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_programKerjaId_fkey" FOREIGN KEY ("programKerjaId") REFERENCES "program_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_programItemId_fkey" FOREIGN KEY ("programItemId") REFERENCES "program_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_kodeAkun_fkey" FOREIGN KEY ("kodeAkun") REFERENCES "kode_akun"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_klinik" ADD CONSTRAINT "riwayat_klinik_jamaahId_fkey" FOREIGN KEY ("jamaahId") REFERENCES "jamaah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donasi_jamaah" ADD CONSTRAINT "donasi_jamaah_jamaahId_fkey" FOREIGN KEY ("jamaahId") REFERENCES "jamaah"("id") ON DELETE CASCADE ON UPDATE CASCADE;
