'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

/**
 * Run-Madan 2026 - Informasi untuk Ketua RW & RT
 *
 * Dokumen informasi kegiatan Run-Madan 2026 untuk disebarkan
 * kepada Ketua RW dan Ketua RT di lingkungan Rewwin.
 */

export default function InfoWargaRunMadan() {
  return (
    <div className="bg-white min-h-screen">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-break {
            page-break-after: always;
          }
        }
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          padding: 15mm 20mm;
          margin: 0 auto;
          background: white;
          box-sizing: border-box;
        }
        @media screen {
          .a4-page {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin-bottom: 20px;
          }
        }
      `}</style>

      {/* Print Button - Hidden when printing */}
      <div className="no-print fixed top-20 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Cetak Dokumen
        </button>
      </div>

      {/* ========== PAGE 1: COVER ========== */}
      <div className="a4-page page-break relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#00BCD4] via-[#006064] to-[#00BCD4]"></div>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#00BCD4] via-[#006064] to-[#00BCD4]"></div>
        <div className="absolute top-16 right-0 w-48 h-48 bg-[#B2EBF2] rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-[#00BCD4] rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-16 left-0 w-56 h-56 bg-[#80DEEA] rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-32 left-8 w-32 h-32 bg-[#006064] rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute top-1/2 -left-10 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-30 blur-3xl"></div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header with Logos */}
          <div className="flex justify-between items-start pt-4">
            <div className="p-3 bg-white rounded-xl border border-[#B2EBF2]">
              <Image
                src="/images/Logo-YAMR.png"
                alt="Logo Al Muhajirin"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#B2EBF2]">
              <Image
                src="/images/masjid/logo-run-madan2.png"
                alt="Logo Run-Madan"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

          {/* Title Section */}
          <div className="flex-1 flex flex-col justify-center text-center px-8">
            <p className="text-[#00838F] text-lg font-medium mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

            <div className="my-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B2EBF2] to-[#80DEEA] px-6 py-2 rounded-full">
                <span className="text-[#006064] font-semibold">Minggu, 8 Februari 2026 | 06:00 - 09:30 WIB</span>
              </div>
            </div>

            <h1 className="text-5xl font-bold text-[#006064] mb-3">
              RUN-MADAN 2026
            </h1>
            <h2 className="text-2xl font-bold text-[#00BCD4] mb-6">
              Informasi Kegiatan
            </h2>

            <div className="bg-gradient-to-r from-[#006064] to-[#00838F] text-white py-4 px-8 rounded-2xl mx-auto max-w-2xl">
              <p className="text-xl font-semibold text-white mb-1">&ldquo;Sehat Bersama, Peduli Sesama&rdquo;</p>
              <p className="text-sm text-[#B2EBF2]">Lari Amal Menyambut Ramadhan & Kenali Layanan Kesehatan Gratis</p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center pb-6 mt-10">
            <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#B2EBF2]">
              <h3 className="text-lg font-bold text-[#006064] mb-1">
                PANITIA RUN-MADAN 2026
              </h3>
              <p className="text-[#00838F] font-semibold">
                TAKMIR MASJID AL-MUHAJIRIN REWWIN
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Jl. Rajawali No. 207 REWWIN, Waru, Sidoarjo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PAGE 2: GAMBARAN UMUM & TUJUAN ========== */}
      <div className="a4-page page-break relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/3 -right-8 w-24 h-24 bg-[#00BCD4] rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute bottom-1/3 -left-8 w-32 h-32 bg-[#006064] rounded-full opacity-10 blur-2xl"></div>

        {/* Section 1: Gambaran Umum */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#006064]">1. GAMBARAN UMUM KEGIATAN</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-justify">
              <span className="font-semibold text-[#006064]">Run-Madan 2026</span> merupakan kegiatan lari santai dan edukasi kesehatan yang diselenggarakan oleh Masjid Al Muhajirin dalam rangka menyambut bulan suci Ramadhan.
            </p>

            <p className="text-gray-700 leading-relaxed text-justify">
              Kegiatan ini <span className="font-semibold">bukan event lomba</span>, melainkan media edukasi dan sosialisasi layanan kesehatan masyarakat, khususnya:
            </p>

            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Keberadaan dan fungsi <span className="font-semibold text-[#006064]">Layanan Poliklinik Gratis</span>, serta</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span><span className="font-semibold text-[#006064]">Ambulans sosial Gratis</span> yang melayani warga REWWIN (RW 6, RW 8, RW 9) dan sekitarnya, tanpa memandang suku, agama, dan golongan.</span>
              </li>
            </ul>

            <p className="text-gray-700 leading-relaxed text-justify">
              Melalui pendekatan olahraga yang ringan dan ramah pemula, kegiatan ini diharapkan dapat meningkatkan kesadaran masyarakat terhadap pentingnya kesehatan sekaligus memperkenalkan fasilitas kesehatan yang telah tersedia secara gratis di lingkungan REWWIN.
            </p>

            <p className="text-gray-700 leading-relaxed text-justify">
              Kegiatan ini melibatkan <span className="font-semibold">biaya partisipasi</span> yang akan digunakan untuk operasional (selain doorprize dan hadiah) dan sekaligus sebagai <span className="font-semibold">donasi operasional Poliklinik dan Ambulans</span>.
            </p>
          </div>
        </div>

        {/* Section 2: Tujuan */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#006064]">2. TUJUAN KEGIATAN</h2>
          </div>

          <p className="text-gray-700 mb-3">Tujuan utama kegiatan ini adalah:</p>

          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-700">
              <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <span className="pt-0.5">Memperkenalkan layanan poliklinik dan ambulans gratis dari Al Muhajirin kepada warga secara langsung dan praktis.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <span className="pt-0.5">Membuka kesempatan bagi warga untuk berdonasi pada layanan tersebut.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <span className="pt-0.5">Memberikan edukasi kesehatan berbasis aktivitas fisik ringan (lari santai) dan tawaran untuk medical checkup ringan serta komunitas healthy running sebagai tindak lanjut.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
              <span className="pt-0.5">Membantu masyarakat, khususnya pelari pemula, memahami cara berolahraga yang aman dan berkelanjutan.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
              <span className="pt-0.5">Menguatkan interaksi positif antara masjid dan warga sekitar.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ========== PAGE 3: SASARAN & BENTUK KEGIATAN ========== */}
      <div className="a4-page page-break relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/2 -right-8 w-24 h-24 bg-[#00BCD4] rounded-full opacity-15 blur-2xl"></div>

        {/* Section 3: Sasaran */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#006064]">3. SASARAN PESERTA</h2>
          </div>

          <p className="text-gray-700 mb-3">Kegiatan ini secara khusus menyasar:</p>

          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-gray-700">
              <div className="w-2 h-2 bg-[#00BCD4] rounded-full"></div>
              <span>Warga sekitar masjid</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <div className="w-2 h-2 bg-[#00BCD4] rounded-full"></div>
              <span>Keluarga dan anak-anak (dengan pendamping)</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <div className="w-2 h-2 bg-[#00BCD4] rounded-full"></div>
              <span>Pelari pemula yang ingin memulai atau menargetkan jarak 5 Km secara aman</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <div className="w-2 h-2 bg-[#00BCD4] rounded-full"></div>
              <span>Masyarakat umum yang ingin meningkatkan kebugaran</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Bentuk Kegiatan */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#006064]">4. BENTUK KEGIATAN</h2>
          </div>

          {/* 4.1 Fun Run */}
          <div className="mb-6">
            <h3 className="text-lg text-[#006064] mb-3">4.1 Fun Run & Senam Sehat</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[#00838F] w-20">Jarak:</span>
                <span className="text-gray-700">± 3 Km</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[#00838F] w-20">Sifat:</span>
                <span className="text-gray-700">Santai, non-kompetitif</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[#00838F] w-20">Lokasi:</span>
                <span className="text-gray-700">Start & Finish di Area Masjid Al Muhajirin</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[#00838F] w-20">Catatan:</span>
                <span className="text-gray-700">Bersamaan dengan kegiatan lari, diadakan juga Senam Sehat di area masjid</span>
              </div>
            </div>
          </div>

          {/* 4.2 Sosialisasi */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#006064] mb-3">4.2 Sosialisasi kepada Warga</h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              Pada aktivitas lari, terdapat arak-arakan semi pawai, yang melibatkan mobil pengarah, barisan anak-anak, barisan peserta run-madan yang berjalan kaki atau bersepeda, dan mobil ambulans. Mobil pengarah akan menggunakan pengeras suara dengan materi sosialisasi program poliklinik dan ambulans. Mobil Ambulans berada di posisi paling akhir, menyisir dan memberi support pada partisipan event.
            </p>
          </div>

          {/* 4.3 Edukasi */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#006064] mb-3">4.3 Edukasi & Sharing Session Kesehatan</h3>
            <p className="text-gray-700 mb-2">Setelah kegiatan lari, akan diadakan sesi berbagi singkat, antara lain:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span><span className="font-semibold">&ldquo;From Couch to 5K&rdquo;</span> - Pengenalan tahapan berlari yang aman bagi pemula</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span><span className="font-semibold">&ldquo;Terapi Running untuk Pemulihan Kesehatan&rdquo;</span> - Pemanfaatan lari sebagai bagian dari pemulihan kebugaran dan kesehatan mental</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Diskusi ringan seputar pencegahan cedera, manajemen napas, kebiasaan lari yang sehat, dan kesalahan umum pelari pemula</span>
              </li>
            </ul>
          </div>

          {/* 4.4 Follow-Up */}
          <div>
            <h3 className="text-lg font-bold text-[#006064] mb-3">4.4 Penjadwalan Kegiatan Follow-Up</h3>
            <p className="text-gray-700 mb-2">Sebagai tindak lanjut, akan ditawarkan -sesuai kesediaan- kepada para peserta program:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Check up kesehatan ringan secara berkala di Poliklinik</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Komunitas healthy-run REWWIN yang akan melakukan running secara berkala dengan edukasi dan motivasi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========== PAGE 4: WAKTU, LOKASI, RUTE ========== */}
      <div className="a4-page page-break relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>

        {/* Section 5: Waktu, Lokasi, Rute */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#006064]">5. WAKTU, LOKASI, DAN RUTE</h2>
          </div>

          <div className="mb-6">
            <div className="bg-gradient-to-r from-[#B2EBF2]/30 to-[#80DEEA]/20 rounded-xl p-5">
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <p className="text-sm text-[#00838F] font-semibold mb-1">Hari / Tanggal</p>
                  <p className="text-[#006064] font-bold">Minggu, 8 Februari 2026</p>
                </div>
                <div>
                  <p className="text-sm text-[#00838F] font-semibold mb-1">Waktu</p>
                  <p className="text-[#006064] font-bold">05:30 - 09:30 WIB</p>
                </div>
                <div>
                  <p className="text-sm text-[#00838F] font-semibold mb-1">Lokasi</p>
                  <p className="text-[#006064] font-bold">Masjid Al Muhajirin</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#006064] mb-3">Peta Rute Lari</h3>
            <p className="text-gray-700 mb-3">Rute 3 km melewati area di RW 6, RW 8, dan RW 9:</p>
            <div className="border-2 border-[#B2EBF2] rounded-xl overflow-hidden">
              <Image
                src="/images/masjid/events/denah-rute-lari-v2.jpg"
                alt="Denah Rute Lari Run-Madan 2026"
                width={700}
                height={500}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="bg-white border-2 border-[#00BCD4] rounded-xl p-5">
            <h3 className="text-lg font-bold text-[#006064] mb-3">Keamanan dan Kenyamanan</h3>
            <p className="text-gray-700 mb-2">Untuk menjaga kenyamanan warga sekitar:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Panitia lapangan dan relawan keamanan disiagakan</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Tim medis dan ambulans siaga selama kegiatan</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Anak-anak diwajibkan didampingi sesuai ketentuan usia</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-3 font-semibold text-[#006064]">
              Panitia berkomitmen menjaga kebersihan dan ketertiban sebelum, selama, dan setelah kegiatan.
            </p>
          </div>
        </div>
      </div>

      {/* ========== PAGE 5: RUNDOWN KEGIATAN ========== */}
      <div className="a4-page page-break relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>

        {/* Section: Rundown */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#006064]">RUNDOWN KEGIATAN RUN-MADAN 2026</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white">
                  <th className="px-3 py-2 text-left font-semibold">No</th>
                  <th className="px-3 py-2 text-left font-semibold">Waktu</th>
                  <th className="px-3 py-2 text-left font-semibold">Kegiatan</th>
                  <th className="px-3 py-2 text-left font-semibold">PIC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">1</td>
                  <td className="px-3 py-2 whitespace-nowrap">05:15 - 05:45</td>
                  <td className="px-3 py-2">Registrasi Ulang & Pengambilan Race Kit</td>
                  <td className="px-3 py-2">Sie Pendaftaran</td>
                </tr>
                <tr className="bg-[#F8FAFC] border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">2</td>
                  <td className="px-3 py-2 whitespace-nowrap">05:45 - 05:55</td>
                  <td className="px-3 py-2">Pemanasan Lari</td>
                  <td className="px-3 py-2">Instruktur</td>
                </tr>
                <tr className="border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">3</td>
                  <td className="px-3 py-2 whitespace-nowrap">05:55 - 06:00</td>
                  <td className="px-3 py-2">Briefing Rute & Persiapan Start</td>
                  <td className="px-3 py-2">Race Director</td>
                </tr>
                <tr className="bg-[#F8FAFC] border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">4</td>
                  <td className="px-3 py-2 whitespace-nowrap">06:00 - 06:05</td>
                  <td className="px-3 py-2">Pelepasan Kategori Adults Runner</td>
                  <td className="px-3 py-2">Ketua RW 06</td>
                </tr>
                <tr className="border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">5</td>
                  <td className="px-3 py-2 whitespace-nowrap">06:05 - 06:10</td>
                  <td className="px-3 py-2">Pelepasan Kategori Lansia (Jalan & Bersepeda)</td>
                  <td className="px-3 py-2">Ketua RW 09</td>
                </tr>
                <tr className="bg-[#F8FAFC] border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">6</td>
                  <td className="px-3 py-2 whitespace-nowrap">06:10 - 06:15</td>
                  <td className="px-3 py-2">Pelepasan Kategori Kids</td>
                  <td className="px-3 py-2">Ketua RW 08</td>
                </tr>
                <tr className="border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">7</td>
                  <td className="px-3 py-2 whitespace-nowrap">06:00 - 06:45</td>
                  <td className="px-3 py-2">Fun Run & Jalan Sehat 3K</td>
                  <td className="px-3 py-2">Panitia Lapangan</td>
                </tr>
                <tr className="bg-[#F8FAFC] border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">8</td>
                  <td className="px-3 py-2 whitespace-nowrap">06:30 - 07:30</td>
                  <td className="px-3 py-2 font-semibold text-[#006064]">Senam Sehat</td>
                  <td className="px-3 py-2">Instruktur Senam</td>
                </tr>
                <tr className="border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">9</td>
                  <td className="px-3 py-2 whitespace-nowrap">06:30 - 07:00</td>
                  <td className="px-3 py-2">Finish - Refreshment & Pendinginan</td>
                  <td className="px-3 py-2">Sie Konsumsi</td>
                </tr>
                <tr className="bg-[#F8FAFC] border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">10</td>
                  <td className="px-3 py-2 whitespace-nowrap">07:00 - 07:30</td>
                  <td className="px-3 py-2">Permainan & Games Antar Peserta</td>
                  <td className="px-3 py-2">MC & Sie Acara</td>
                </tr>
                <tr className="border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">11</td>
                  <td className="px-3 py-2 whitespace-nowrap">07:30 - 07:35</td>
                  <td className="px-3 py-2">Sambutan Panitia</td>
                  <td className="px-3 py-2">Ketua Panitia</td>
                </tr>
                <tr className="bg-[#F8FAFC] border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">12</td>
                  <td className="px-3 py-2 whitespace-nowrap">07:35 - 07:55</td>
                  <td className="px-3 py-2">Edukasi Kesehatan: Olahraga Sehat Menyambut Ramadhan</td>
                  <td className="px-3 py-2">Narasumber Kesehatan</td>
                </tr>
                <tr className="border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">13</td>
                  <td className="px-3 py-2 whitespace-nowrap">07:55 - 08:00</td>
                  <td className="px-3 py-2">Doorprize Sesi 1</td>
                  <td className="px-3 py-2">MC & Panitia</td>
                </tr>
                <tr className="bg-[#F8FAFC] border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">14</td>
                  <td className="px-3 py-2 whitespace-nowrap">08:00 - 08:15</td>
                  <td className="px-3 py-2">Sambutan Klub Lansia RW 06, RW 08 & RW 09</td>
                  <td className="px-3 py-2">Perwakilan Klub Lansia</td>
                </tr>
                <tr className="border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">15</td>
                  <td className="px-3 py-2 whitespace-nowrap">08:15 - 08:20</td>
                  <td className="px-3 py-2">Doorprize Sesi 2</td>
                  <td className="px-3 py-2">MC & Panitia</td>
                </tr>
                <tr className="bg-[#F8FAFC] border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">16</td>
                  <td className="px-3 py-2 whitespace-nowrap">08:20 - 08:50</td>
                  <td className="px-3 py-2 text-[#006064]">Pengenalan Layanan Ambulans & Poliklinik (Umum & Gigi)</td>
                  <td className="px-3 py-2">Tim Poliklinik</td>
                </tr>
                <tr className="border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">17</td>
                  <td className="px-3 py-2 whitespace-nowrap">08:50 - 08:55</td>
                  <td className="px-3 py-2">Doorprize Sesi 3</td>
                  <td className="px-3 py-2">MC & Panitia</td>
                </tr>
                <tr className="bg-[#F8FAFC] border-b border-[#B2EBF2]">
                  <td className="px-3 py-2">18</td>
                  <td className="px-3 py-2 whitespace-nowrap">08:55 - 09:00</td>
                  <td className="px-3 py-2">Doa Penutup & Foto Bersama</td>
                  <td className="px-3 py-2">Ketua Panitia</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========== PAGE 6: PENUTUP ========== */}
      <div className="a4-page relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-12 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-24 left-0 w-48 h-48 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/3 -left-8 w-28 h-28 bg-[#00BCD4] rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-1/2 right-0 w-32 h-32 bg-[#006064] rounded-full opacity-10 blur-2xl"></div>

        {/* Section: Penutup */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#006064]">6. PENUTUP</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-justify">
              <span className="font-semibold text-[#006064]">Run-Madan 2026</span> diharapkan menjadi contoh kegiatan edukatif yang:
            </p>

            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Menyehatkan</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Memberi pengetahuan praktis</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Memperkuat peran masjid sebagai pusat layanan umat</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2"></div>
                <span>Tetap menjaga harmoni lingkungan</span>
              </li>
            </ul>

            <div className="bg-gradient-to-r from-[#B2EBF2]/40 to-[#80DEEA]/30 rounded-xl p-6 mt-6">
              <p className="text-gray-700 leading-relaxed text-justify font-semibold text-[#006064]">
                Kami mengharapkan dukungan dan izin dari Ketua RW dan RT terkait agar kegiatan ini dapat berjalan dengan baik dan memberi manfaat bersama.
              </p>
            </div>
          </div>
        </div>

        {/* Informasi Kontak */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#006064]">Informasi Kontak</h2>
          </div>

          <div className="bg-white border-2 border-[#00BCD4] rounded-2xl p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-semibold text-[#006064] w-24">Panitia:</span>
                <span className="text-gray-700">Panitia Run-Madan Masjid Al Muhajirin</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-semibold text-[#006064] w-24">WhatsApp:</span>
                <span className="text-gray-700 font-semibold">+62 812-1611-7907</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-semibold text-[#006064] w-24">Website:</span>
                <span className="text-gray-700">masjid.muhajirinrewwin.or.id</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-semibold text-[#006064] w-24">Alamat:</span>
                <span className="text-gray-700">Jl. Rewwin Wetan No. 8, Kalitengah, Tanggulangin, Sidoarjo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="relative z-10 border-t-2 border-[#B2EBF2] pt-6">
          <p className="text-sm text-gray-600 mb-8">Sidoarjo, Januari 2026</p>

          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-16">Ketua Yayasan<br/>Al Muhajirin Rewwin</p>
              <p className="font-bold text-[#006064] border-t border-gray-300 pt-2">H. CAHYO HUSNI TAMRIN, ST, MM</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-16">Ketua Panitia Run-Madan 2026<br/>Masjid Al Muhajirin Rewwin</p>
              <p className="font-bold text-[#006064] border-t border-gray-300 pt-2">ARIF BUDI SANTOSO</p>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="relative z-10 mt-8 pt-4 border-t border-[#B2EBF2]">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Jl. Rajawali No. 207 REWWIN, Waru, Sidoarjo</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>+62 887-3303-012</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>masjid.muhajirinrewwin.or.id</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
