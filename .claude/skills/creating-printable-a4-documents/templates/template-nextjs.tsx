// Template: Printable A4 Document for Next.js/React
// Uses Tailwind CSS for styling
// Add 'use client' directive for interactive features (print button)

'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Printable A4 Document Template
 *
 * Features:
 * - A4 dimensions (210mm x 297mm)
 * - Automatic page breaks
 * - Decorative blur color accents
 * - Print button (hidden when printing)
 * - Website header/footer hidden when printing
 *
 * Usage:
 * 1. Copy this file to your app directory
 * 2. Customize content and colors
 * 3. Adjust decorative elements as needed
 */

export default function PrintableDocumentTemplate() {
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
        {/* Decorative Elements - More prominent for cover */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#00BCD4] via-[#006064] to-[#00BCD4]"></div>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#00BCD4] via-[#006064] to-[#00BCD4]"></div>
        <div className="absolute top-16 right-0 w-48 h-48 bg-[#B2EBF2] rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-[#00BCD4] rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-16 left-0 w-56 h-56 bg-[#80DEEA] rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-32 left-8 w-32 h-32 bg-[#006064] rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute top-1/2 -left-10 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-30 blur-3xl"></div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Logo */}
          <div className="text-center pt-8">
            <div className="inline-block p-4 bg-white rounded-2xl border border-[#B2EBF2]">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Title Section */}
          <div className="flex-1 flex flex-col justify-center text-center px-8">
            <p className="text-[#00838F] text-lg font-medium mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

            <div className="my-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B2EBF2] to-[#80DEEA] px-6 py-2 rounded-full">
                <span className="text-[#006064] font-semibold">Periode Kegiatan</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-[#006064] mb-3">
              JUDUL DOKUMEN
            </h1>
            <h2 className="text-3xl font-bold text-[#00BCD4] mb-6">
              SUBJUDUL DOKUMEN
            </h2>

            <div className="bg-gradient-to-r from-[#006064] to-[#00838F] text-white py-4 px-8 rounded-2xl mx-auto max-w-lg">
              <p className="text-xl font-semibold text-white mb-1">&ldquo;TEMA&rdquo;</p>
              <p className="text-sm text-[#B2EBF2]">Tagline atau deskripsi singkat</p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center pb-8">
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#B2EBF2]">
              <h3 className="text-xl font-bold text-[#006064] mb-2">
                NAMA ORGANISASI
              </h3>
              <p className="text-[#00838F] font-semibold">
                Unit/Divisi
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Alamat Lengkap
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PAGE 2: CONTENT ========== */}
      <div className="a4-page page-break relative overflow-hidden">
        {/* Decorative Elements - More subtle for content pages */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/3 -right-8 w-24 h-24 bg-[#00BCD4] rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute bottom-1/3 -left-8 w-32 h-32 bg-[#006064] rounded-full opacity-10 blur-2xl"></div>

        {/* Section Header */}
        <div className="relative z-10 flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#B2EBF2]">
          <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
          <h2 className="text-2xl font-bold text-[#006064]">Judul Section</h2>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#006064] mb-4">Sub-judul</h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              Konten paragraf. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#006064] mb-4">Daftar Item</h3>
            <ul className="space-y-2">
              {['Item pertama', 'Item kedua', 'Item ketiga'].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-[#00BCD4] rounded-full"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ========== PAGE 3: LAST PAGE ========== */}
      <div className="a4-page relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-12 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-24 left-0 w-48 h-48 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/3 -left-8 w-28 h-28 bg-[#00BCD4] rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-1/2 right-0 w-32 h-32 bg-[#006064] rounded-full opacity-10 blur-2xl"></div>

        {/* Section Header */}
        <div className="relative z-10 flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#B2EBF2]">
          <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
          <h2 className="text-2xl font-bold text-[#006064]">Informasi Kontak</h2>
        </div>

        {/* Info Box */}
        <div className="relative z-10 bg-white border-2 border-[#00BCD4] rounded-2xl p-6 mb-6">
          <div className="bg-gradient-to-r from-[#B2EBF2]/30 to-[#80DEEA]/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-[#006064]">Rekening</span>
              <span className="text-sm font-semibold text-white bg-[#0066AE] px-3 py-1 rounded-full">Bank BRI</span>
            </div>
            <p className="text-3xl font-bold text-[#006064] tracking-wider">0211.01.004859.53.6</p>
            <p className="text-gray-600 mt-2">a/n. <span className="font-semibold">Nama Rekening</span></p>
          </div>
        </div>

        {/* Closing */}
        <div className="relative z-10 mb-6">
          <p className="text-gray-700 leading-relaxed text-justify">
            Demikian dokumen ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
          </p>
        </div>

        {/* Signatures */}
        <div className="relative z-10 border-t-2 border-[#B2EBF2] pt-6">
          <p className="text-sm text-gray-600 mb-6">Sidoarjo, Januari 2026</p>

          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-16">Jabatan 1<br/>Organisasi</p>
              <p className="font-bold text-[#006064] border-t border-gray-300 pt-2">NAMA LENGKAP</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-16">Jabatan 2<br/>Organisasi</p>
              <p className="font-bold text-[#006064] border-t border-gray-300 pt-2">NAMA LENGKAP</p>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="relative z-10 mt-8 pt-4 border-t border-[#B2EBF2]">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span>Alamat Lengkap</span>
            <span>|</span>
            <span>Telp: 0812-3456-7890</span>
            <span>|</span>
            <span>email@domain.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
