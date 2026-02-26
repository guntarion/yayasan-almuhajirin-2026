// src/app/units/masjid/ramadhan/proposal/surat-pengantar/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';

export default function SuratPengantarPage() {
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
          /* Ensure main content takes full page */
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
          className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all font-sans"
        >
          Cetak Surat
        </button>
      </div>

      <div className="a4-page">
        {/* Kop Surat */}
        <div className="flex items-start gap-4 pb-4 border-b-2 border-[#00BCD4] mb-6">
          <div className="flex-shrink-0">
            <Image
              src="/images/logo-masjid-almuhajirin.jpg"
              alt="Logo Masjid Al Muhajirin"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#00838F]">PANITIA RAMADHAN 1447 H</h1>
            <h2 className="text-lg font-bold text-[#006064]">TAKMIR MASJID AL-MUHAJIRIN REWWIN</h2>
            <p className="text-sm text-gray-700">Jl. Rajawali No. 207 REWWIN, Waru, Sidoarjo</p>
            <p className="text-sm text-gray-700">TELP. 0822.4534.2314, 0813.8245.4114</p>
          </div>
        </div>

        {/* Nomor Surat */}
        <div className="mb-6 text-sm">
          <table className="text-gray-800">
            <tbody>
              <tr>
                <td className="font-semibold pr-4 py-1">Nomor</td>
                <td className="pr-2">:</td>
                <td>016/PRM-AMR/I/2026</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4 py-1">Lampiran</td>
                <td className="pr-2">:</td>
                <td>1 (satu) berkas</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4 py-1">Perihal</td>
                <td className="pr-2">:</td>
                <td className="font-semibold text-[#006064]">Permohonan Donasi Program Ramadhan 1447 H</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tujuan Surat */}
        <div className="mb-6 text-sm text-gray-800">
          <p>Kepada Yth.</p>
          <p className="font-semibold">Bapak/Ibu Dermawan</p>
          <p>di Tempat</p>
        </div>

        {/* Isi Surat */}
        <div className="text-sm text-gray-800 leading-relaxed space-y-4 text-justify">
          <p><span className="italic">Assalamu&apos;alaikum warahmatullahi wabarakatuh,</span></p>

          <p>
            Segala puji bagi Allah SWT yang telah melimpahkan rahmat dan karunia-Nya. Shalawat dan salam semoga senantiasa tercurah kepada Rasulullah SAW, keluarga, sahabat, dan pengikutnya hingga akhir zaman.
          </p>

          <p>
            Dalam rangka menyambut dan menyukseskan <span className="font-semibold text-[#006064]">Bulan Suci Ramadhan 1447 H</span>, Panitia Ramadhan Masjid Al Muhajirin Rewwin bermaksud menyelenggarakan berbagai program ibadah dan sosial dengan tema <span className="font-semibold text-[#006064]">&ldquo;MADRASAH KITA: Membangun Pribadi Taqwa, Mewujudkan Kontribusi Mulia&rdquo;</span>.
          </p>

          <p>
            Program-program tersebut meliputi:
          </p>

          <ul className="list-disc pl-8 space-y-1">
            <li>Sholat Tarawih dan Ceramah Ba&apos;da Shubuh selama 30 hari</li>
            <li>Qiyamul Lail dan Tadarrus Al-Qur&apos;an</li>
            <li>Penyediaan Takjil/Ifthar untuk 250+ jamaah</li>
            <li>Sahur Bersama 10 malam terakhir Ramadhan</li>
            <li>Event Pra-Ramadhan (Run-Madan, Senam Sehat, Turnamen Futsal)</li>
            <li>Pengelolaan dan Penyaluran Zakat Fitrah</li>
          </ul>

          <p>
            Untuk mensukseskan program-program tersebut, kami memerlukan dukungan dana operasional. Dengan kerendahan hati, kami mengajukan <span className="font-semibold text-[#006064]">permohonan donasi</span> kepada Bapak/Ibu. Besar harapan kami, Bapak/Ibu berkenan menyisihkan sebagian rezeki untuk turut serta dalam keberkahan Ramadhan ini.
          </p>

          <p>
            Sebagai bahan pertimbangan, bersama surat ini kami lampirkan <span className="font-semibold">Proposal Donasi Program Ramadhan 1447 H</span> yang memuat rincian program dan kebutuhan dana.
          </p>

          <p>
            Donasi dapat disalurkan melalui rekening:
          </p>

          <div className="bg-[#F8FAFC] border border-[#B2EBF2] rounded-lg p-4 my-4">
            <p className="font-semibold text-[#0066AE]">Bank BRI</p>
            <p className="text-lg font-bold text-[#006064]">0211.01.004869.53.6</p>
            <p className="text-gray-600">a/n. Al Muhajirin Rewwin</p>
            <p className="text-xs text-gray-500 mt-2">Konfirmasi: 0812-5906-069 (Bendahara)</p>
          </div>

          <p>
            Demikian surat permohonan ini kami sampaikan. Atas perhatian, kepercayaan, dan kemurahan hati Bapak/Ibu, kami mengucapkan <span className="italic">Jazakumullahu Khairan Katsiran</span>. Semoga Allah SWT membalas setiap kebaikan dengan pahala yang berlipat ganda.
          </p>

          <p><span className="italic">Wassalamu&apos;alaikum warahmatullahi wabarakatuh.</span></p>
        </div>

        {/* Tanda Tangan */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 text-right mb-6">Sidoarjo, Januari 2026</p>

          <div className="text-sm text-center mb-4">
            <p>Hormat kami,</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="text-center">
              <p className="text-gray-600 mb-20">
                Ketua Yayasan<br />
                Al Muhajirin Rewwin
              </p>
              <p className="font-bold text-[#006064]">H. CAHYO HUSNI TAMRIN, ST, MM</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-20">
                Ketua Panitia Ramadhan 1447H<br />
                Masjid Al Muhajirin Rewwin
              </p>
              <p className="font-bold text-[#006064]">ARIF BUDI SANTOSO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
