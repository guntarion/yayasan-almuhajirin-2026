// src/app/units/masjid/ramadhan/sponsorship/surat-pengantar/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';

export default function SuratPengantarSponsorshipPage() {
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
        }
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm 25mm;
          margin: 0 auto;
          background: white;
          box-sizing: border-box;
          font-family: 'Times New Roman', Times, serif;
        }
        @media screen {
          .a4-page {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin-top: 20px;
            margin-bottom: 20px;
          }
        }
      `}</style>

      {/* Print Button */}
      <div className="no-print fixed top-20 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-[#1976D2] to-[#0D47A1] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all font-sans"
        >
          Cetak Surat
        </button>
      </div>

      <div className="a4-page">
        {/* Kop Surat */}
        <div className="flex items-start gap-4 pb-4 border-b-2 border-[#1976D2] mb-6">
          <div className="flex-shrink-0">
            <Image
              src="/images/Logo-YAMR.png"
              alt="Logo Al Muhajirin"
              width={90}
              height={90}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1565C0]">PANITIA RUN-MADAN 2026</h1>
            <h2 className="text-lg font-bold text-[#0D47A1]">TAKMIR MASJID AL-MUHAJIRIN REWWIN</h2>
            <p className="text-sm text-gray-700">Jl. Rajawali No. 207 REWWIN, Waru, Sidoarjo</p>
            <p className="text-sm text-gray-700">TELP. +62 887-3303-012, +62 812-2334-3416</p>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/images/masjid/logo-run-madan2.png"
              alt="Logo Run-Madan"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>

        {/* Nomor Surat */}
        <div className="mb-6 text-sm">
          <table className="text-gray-800">
            <tbody>
              <tr>
                <td className="font-semibold pr-4 py-1">Nomor</td>
                <td className="pr-2">:</td>
                <td>017/PRM-AMR/I/2026</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4 py-1">Lampiran</td>
                <td className="pr-2">:</td>
                <td>1 (satu) berkas</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4 py-1">Perihal</td>
                <td className="pr-2">:</td>
                <td className="font-semibold text-[#0D47A1]">Permohonan Sponsorship Kegiatan Run-Madan 2026</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tujuan Surat */}
        <div className="mb-6 text-sm text-gray-800">
          <p>Kepada Yth.</p>
          <p className="font-semibold">Bapak/Ibu Pimpinan Perusahaan</p>
          <p>di Tempat</p>
        </div>

        {/* Isi Surat */}
        <div className="text-sm text-gray-800 leading-relaxed space-y-4 text-justify">
          <p><span className="italic">Assalamu&apos;alaikum warahmatullahi wabarakatuh,</span></p>

          <p>
            Segala puji bagi Allah SWT yang telah melimpahkan rahmat dan karunia-Nya. Shalawat dan salam semoga senantiasa tercurah kepada Rasulullah SAW, keluarga, sahabat, dan pengikutnya hingga akhir zaman.
          </p>

          <p>
            Dalam rangka menyambut <span className="font-semibold text-[#0D47A1]">Bulan Suci Ramadhan 1447 H</span>, Panitia Run-Madan Masjid Al Muhajirin Rewwin bermaksud menyelenggarakan kegiatan <span className="font-semibold text-[#0D47A1]">&ldquo;Run-Madan 2026 - Edu Run & Edukasi Kesehatan REWWIN&rdquo;</span> dengan tema <span className="font-semibold">&ldquo;Sehat Bersama, Peduli Sesama&rdquo;</span>.
          </p>

          <p>
            Kegiatan ini merupakan media edukasi dan sosialisasi layanan kesehatan masyarakat, khususnya memperkenalkan keberadaan dan fungsi Layanan Poliklinik Gratis serta Ambulans Sosial Gratis yang melayani warga REWWIN dan sekitarnya.
          </p>

          <p>
            Rangkaian kegiatan meliputi:
          </p>

          <ul className="list-disc pl-8 space-y-1">
            <li><span className="font-semibold">Run-Madan</span> - Fun Run ramah pemula dengan jarak 3 Km</li>
            <li><span className="font-semibold">Senam Sehat Bersama</span> - Senam pagi untuk warga dan peserta</li>
            <li><span className="font-semibold">Sesi Edukasi Kesehatan</span> - &quot;From Couch to 5K&quot; & &quot;Terapi Running&quot;</li>
            <li><span className="font-semibold">Booth UMKM</span> - Memfasilitasi pelaku usaha lokal</li>
          </ul>

          <p>
            Kegiatan ini akan dilaksanakan pada:
          </p>

          <div className="bg-[#F8FAFC] border border-[#BBDEFB] rounded-lg p-3 my-3">
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold pr-4 py-0.5">Hari/Tanggal</td>
                  <td className="pr-2">:</td>
                  <td>Minggu, 8 Februari 2026</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-0.5">Waktu</td>
                  <td className="pr-2">:</td>
                  <td>06.00 - 09.30 WIB</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-0.5">Lokasi</td>
                  <td className="pr-2">:</td>
                  <td>Area Masjid Al Muhajirin REWWIN</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-4 py-0.5">Target Peserta</td>
                  <td className="pr-2">:</td>
                  <td>500+ peserta dan pengunjung</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Untuk mensukseskan kegiatan ini, kami mengajukan <span className="font-semibold text-[#0D47A1]">permohonan sponsorship</span> kepada Bapak/Ibu. Melalui kerjasama ini, perusahaan Bapak/Ibu akan mendapatkan eksposur brand yang optimal kepada ratusan peserta dan pengunjung, sekaligus turut berkontribusi dalam kegiatan sosial dan edukasi kesehatan masyarakat.
          </p>

          <p>
            Sebagai bahan pertimbangan, bersama surat ini kami lampirkan <span className="font-semibold">Proposal Sponsorship Run-Madan 2026</span> yang memuat rincian paket sponsorship dan benefit yang akan diperoleh.
          </p>

          <p>
            Demikian surat permohonan ini kami sampaikan. Atas perhatian, kepercayaan, dan kerjasama Bapak/Ibu, kami mengucapkan <span className="italic">Jazakumullahu Khairan Katsiran</span>. Semoga Allah SWT membalas setiap kebaikan dengan pahala yang berlipat ganda.
          </p>

          <p><span className="italic">Wassalamu&apos;alaikum warahmatullahi wabarakatuh.</span></p>
        </div>

        {/* Tanda Tangan */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 text-right mb-4">Sidoarjo, Januari 2026</p>

          <div className="text-sm text-center mb-3">
            <p>Hormat kami,</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="text-center">
              <p className="text-gray-600 mb-16">
                Ketua Yayasan<br />
                Al Muhajirin Rewwin
              </p>
              <p className="font-bold text-[#0D47A1]">H. CAHYO HUSNI TAMRIN, ST, MM</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-16">
                Ketua Panitia Run-Madan 2026<br />
                Masjid Al Muhajirin Rewwin
              </p>
              <p className="font-bold text-[#0D47A1]">ARIF BUDI SANTOSO</p>
            </div>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="mt-6 pt-3 border-t border-[#BBDEFB]">
          <p className="text-xs text-gray-500 text-center">
            Informasi & Konfirmasi: +62 887-3303-012 (Panitia) | +62 812-2334-3416 (Bendahara)
          </p>
        </div>
      </div>
    </div>
  );
}
