// src/app/units/masjid/ramadhan/proposal/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import {
  Moon,
  Heart,
  Users,
  Target,
  BookOpen,
  Utensils,
  Star,
  Gift,
  Calendar,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Landmark,
} from 'lucide-react';

export default function ProposalRamadhanPage() {
  const programs = [
    {
      icon: Moon,
      title: 'Ibadah Harian',
      items: ['Sholat Tarawih 30 malam', 'Ceramah Ba\'da Shubuh', 'Doa Bersama'],
    },
    {
      icon: Star,
      title: 'Ibadah Intensif',
      items: ['Tadarrus Ba\'da Tarawih', 'Qiyamul Lail 10 malam terakhir', 'Sholat Tasbih'],
    },
    {
      icon: Utensils,
      title: 'Pelayanan Sosial',
      items: ['Takjil/Ifthar 30 hari', 'Sahur Bersama', 'Konsumsi Kajian'],
    },
    {
      icon: Gift,
      title: 'Pengelolaan ZIS',
      items: ['Penerimaan Zakat', 'Penyaluran Zakat', 'Bingkisan Idul Fitri'],
    },
  ];

  const events = [
    { name: 'Run-Madan (Lari Santai)', date: '8 Februari 2026' },
    { name: 'Senam Sehat Sambut Ramadhan', date: '8 Februari 2026' },
    { name: 'Turnamen Futsal', date: '31 Januari 2026' },
  ];

  const budgetItems = [
    { category: 'Bisyaroh Penceramah & Imam', amount: 18250000, desc: 'Honorarium untuk penceramah tarawih, shubuh, dan imam qiyamul lail' },
    { category: 'Takjil/Ifthar Berbuka Puasa', amount: 54400000, desc: 'Takjil untuk 250+ jamaah selama 30 hari' },
    { category: 'Konsumsi Sahur Qiyamul Lail', amount: 7000000, desc: 'Sahur bersama 10 malam terakhir Ramadhan' },
    { category: 'Konsumsi Tadarrus & Kajian', amount: 15500000, desc: 'Konsumsi kegiatan tadarrus dan kajian rutin' },
    { category: 'Event Pra-Ramadhan', amount: 12000000, desc: 'Run-Madan, Senam Sehat, Turnamen Futsal' },
    { category: 'Perlengkapan & Prasarana', amount: 5020000, desc: 'Dekorasi, sound system, dan kebutuhan operasional' },
  ];

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
          .page-break {
            page-break-after: always;
          }
        }
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          padding: 12mm 18mm;
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

      {/* Print Button */}
      <div className="no-print fixed top-20 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Cetak Proposal
        </button>
      </div>

      {/* ========== HALAMAN 1: COVER ========== */}
      <div className="a4-page page-break relative overflow-hidden">
        {/* Decorative Elements - Cover Page */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#00BCD4] via-[#006064] to-[#00BCD4]"></div>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#00BCD4] via-[#006064] to-[#00BCD4]"></div>
        {/* Top right accent */}
        <div className="absolute top-16 right-0 w-48 h-48 bg-[#B2EBF2] rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-[#00BCD4] rounded-full opacity-20 blur-2xl"></div>
        {/* Bottom left accent */}
        <div className="absolute bottom-16 left-0 w-56 h-56 bg-[#80DEEA] rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-32 left-8 w-32 h-32 bg-[#006064] rounded-full opacity-15 blur-2xl"></div>
        {/* Middle left accent */}
        <div className="absolute top-1/2 -left-10 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-30 blur-3xl"></div>
        {/* Top left accent */}
        <div className="absolute top-24 left-4 w-20 h-20 bg-[#00BCD4] rounded-full opacity-25 blur-xl"></div>
        {/* Bottom right accent */}
        <div className="absolute bottom-40 right-0 w-36 h-36 bg-[#80DEEA] rounded-full opacity-25 blur-2xl"></div>
        {/* Geometric shapes */}
        <div className="absolute top-40 left-0 w-1 h-32 bg-gradient-to-b from-[#00BCD4]/40 to-transparent"></div>
        <div className="absolute bottom-40 right-0 w-1 h-32 bg-gradient-to-t from-[#00BCD4]/40 to-transparent"></div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header with Logo */}
          <div className="text-center pt-4">
            <div className="inline-block p-4 bg-white rounded-2xl border border-[#B2EBF2]">
              <Image
                src="/images/logo-masjid-almuhajirin.jpg"
                alt="Logo Masjid Al Muhajirin"
                width={100}
                height={100}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Main Title */}
          <div className="flex-1 flex flex-col justify-center text-center px-8">
            <p className="text-[#00838F] text-lg font-medium mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

            <div className="my-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B2EBF2] to-[#80DEEA] px-6 py-2 rounded-full">
                <Calendar className="h-5 w-5 text-[#006064]" />
                <span className="text-[#006064] font-semibold">1 Ramadhan - 1 Syawal 1447 H</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-[#006064] mb-3">
              PROPOSAL DONASI
            </h1>
            <h2 className="text-3xl font-bold text-[#00BCD4] mb-6">
              PROGRAM RAMADHAN 1447 H
            </h2>

            <div className="bg-gradient-to-r from-[#006064] to-[#00838F] text-white py-4 px-8 rounded-2xl mx-auto max-w-lg">
              <p className="text-xl font-semibold text-white mb-1">&ldquo;MADRASAH KITA&rdquo;</p>
              <p className="text-sm text-[#B2EBF2]">Membangun Pribadi Taqwa, Mewujudkan Kontribusi Mulia</p>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#00BCD4]"></div>
              <Moon className="h-6 w-6 text-[#00BCD4]" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#00BCD4]"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-4">
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#B2EBF2]">
              <h3 className="text-xl font-bold text-[#006064] mb-2">
                PANITIA RAMADHAN 1447 H
              </h3>
              <p className="text-[#00838F] font-semibold">
                TAKMIR MASJID AL-MUHAJIRIN REWWIN
              </p>
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-[#00BCD4]" />
                <span>Jl. Rajawali No. 207 REWWIN, Waru, Sidoarjo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== HALAMAN 2: LATAR BELAKANG & TUJUAN ========== */}
      <div className="a4-page page-break relative overflow-hidden">
        {/* Decorative Elements - Page 2 (more transparent) */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/3 -right-8 w-24 h-24 bg-[#00BCD4] rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute bottom-1/3 -left-8 w-32 h-32 bg-[#006064] rounded-full opacity-10 blur-2xl"></div>

        {/* Header Bar */}
        <div className="relative z-10 flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
          <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
          <h2 className="text-2xl font-bold text-[#006064]">Latar Belakang & Tujuan</h2>
        </div>

        {/* Latar Belakang */}
        <div className="relative z-10 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-[#B2EBF2]">
              <BookOpen className="h-5 w-5 text-[#006064]" />
            </div>
            <h3 className="text-lg font-bold text-[#006064]">Latar Belakang</h3>
          </div>

          <div className="text-gray-700 leading-relaxed space-y-4 text-justify">
            <p>
              <span className="font-semibold text-[#006064]">Bulan Suci Ramadhan</span> adalah momentum agung yang dinantikan oleh seluruh umat Muslim. Di bulan penuh berkah ini, pintu rahmat dan maghfirah Allah SWT dibuka lebar-lebar. Ramadhan adalah <span className="italic">madrasah terbaik</span> untuk menempa kualitas diri dan meningkatkan ketakwaan.
            </p>
            <p>
              <span className="font-semibold text-[#006064]">Masjid Al Muhajirin Rewwin</span>, sebagai pusat pembinaan umat di Perumahan REWWIN, Kec. Waru, Kab. Sidoarjo, memikul amanah besar untuk memfasilitasi jamaah dalam meraih keutamaan Ramadhan melalui berbagai program ibadah dan sosial yang terstruktur.
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#B2EBF2]/30 to-[#80DEEA]/20 rounded-xl p-4 mt-4 border-l-4 border-[#00BCD4]">
            <p className="text-[#006064] italic text-sm">
              &ldquo;Barangsiapa yang menghidupkan Ramadhan dengan iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu.&rdquo; <span className="font-semibold">(HR. Bukhari & Muslim)</span>
            </p>
          </div>
        </div>

        {/* Tujuan */}
        <div className="relative z-10 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-[#B2EBF2]">
              <Target className="h-5 w-5 text-[#006064]" />
            </div>
            <h3 className="text-lg font-bold text-[#006064]">Tujuan Program</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#B2EBF2] hover:border-[#00BCD4] transition-colors">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BCD4] to-[#006064]">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#006064] mb-1">Meningkatkan Ketakwaan</h4>
                <p className="text-sm text-gray-600">Meningkatkan kualitas keimanan dan ibadah seluruh jamaah untuk mencapai derajat taqwa.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#B2EBF2] hover:border-[#00BCD4] transition-colors">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#2E7D32]">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#006064] mb-1">Mempererat Ukhuwah</h4>
                <p className="text-sm text-gray-600">Mempererat persaudaraan (ukhuwah islamiyah) dan meningkatkan kepedulian sosial antar jamaah.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#B2EBF2] hover:border-[#00BCD4] transition-colors">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FF9800] to-[#E65100]">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#006064] mb-1">Optimasi Fungsi Masjid</h4>
                <p className="text-sm text-gray-600">Mengoptimalkan fungsi masjid sebagai pusat edukasi, spiritual, dan kontribusi sosial bagi masyarakat.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Pra-Ramadhan */}
        <div className="relative z-10 bg-gradient-to-r from-[#006064] to-[#00838F] rounded-2xl p-4">
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-white" />
            <span className="text-white">Event Pra-Ramadhan &ldquo;Sambut Ramadhan&rdquo;</span>
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {events.map((event, index) => (
              <div key={index} className="bg-white/20 rounded-xl p-2 text-center text-sm">
                <p className="font-semibold text-sm text-white">{event.name}</p>
                <p className="text-xs text-[#B2EBF2] mt-1">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== HALAMAN 3: PROGRAM & RINCIAN KEBUTUHAN ========== */}
      <div className="a4-page page-break relative overflow-hidden">
        {/* Decorative Elements - Page 3 (more transparent) */}
        <div className="absolute top-8 left-0 w-36 h-36 bg-[#B2EBF2] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-16 right-0 w-44 h-44 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-28 h-28 bg-[#00BCD4] rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-1/4 -left-6 w-24 h-24 bg-[#006064] rounded-full opacity-10 blur-2xl"></div>

        {/* Header Bar */}
        <div className="relative z-10 flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
          <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
          <h2 className="text-2xl font-bold text-[#006064]">Program & Kebutuhan Dana</h2>
        </div>

        {/* Program Grid */}
        <div className="relative z-10 mb-4">
          <h3 className="text-lg font-bold text-[#006064] mb-4">Program Utama Ramadhan</h3>
          <div className="grid grid-cols-2 gap-3">
            {programs.map((program, index) => (
              <div key={index} className="bg-gradient-to-br from-[#F8FAFC] to-[#B2EBF2]/20 rounded-xl p-3 border border-[#B2EBF2]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BCD4] to-[#006064]">
                    <program.icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-bold text-[#006064]">{program.title}</h4>
                </div>
                <ul className="space-y-1">
                  {program.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-[#4CAF50] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Rincian Kebutuhan Dana */}
        <div className="relative z-10 text-sm">
          <h3 className="text-lg font-bold text-[#006064] mb-4">Rincian Kebutuhan Dana</h3>

          <div className="border-2 border-[#B2EBF2] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#00BCD4]/20 to-[#80DEEA]/20">
                  <th className="text-left py-3 px-4 text-[#006064] font-bold">Komponen</th>
                  <th className="text-right py-3 px-4 text-[#006064] font-bold">Estimasi</th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item, index) => (
                  <tr key={index} className="border-t border-[#B2EBF2] hover:bg-[#B2EBF2]/10">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#006064]">{item.category}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-700 tabular-nums">
                      {formatRupiah(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-[#006064] to-[#00838F]">
                  <td className="py-4 px-4 font-bold text-lg text-white">TOTAL KEBUTUHAN</td>
                  <td className="py-4 px-4 text-right font-bold text-lg tabular-nums text-white">
                    {formatRupiah(totalBudget)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-3 bg-[#FFF8E1] border border-[#FFB300] rounded-xl p-3">
            <p className="text-sm text-[#E65100]">
              <span className="font-bold">Catatan:</span> Anggaran di atas merupakan estimasi kebutuhan operasional. Jumlah aktual dapat disesuaikan dengan donasi yang terkumpul. Laporan keuangan akan dipublikasikan secara transparan setelah Ramadhan.
            </p>
          </div>
        </div>
      </div>

      {/* ========== HALAMAN 4: INFORMASI DONASI & PENUTUP ========== */}
      <div className="a4-page relative overflow-hidden">
        {/* Decorative Elements - Page 4 (more transparent) */}
        <div className="absolute top-12 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-24 left-0 w-48 h-48 bg-[#80DEEA] rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/3 -left-8 w-28 h-28 bg-[#00BCD4] rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-1/2 right-0 w-32 h-32 bg-[#006064] rounded-full opacity-10 blur-2xl"></div>

        {/* Header Bar */}
        <div className="relative z-10 flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#B2EBF2]">
          <div className="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
          <h2 className="text-2xl font-bold text-[#006064]">Informasi Donasi</h2>
        </div>

        {/* Ajakan Donasi */}
        <div className="relative z-10 bg-gradient-to-br from-[#006064] to-[#00838F] rounded-2xl p-5 mb-4">
          <h3 className="text-xl font-bold text-white mb-3">Mari Bersama Memakmurkan Ramadhan</h3>
          <p className="text-[#B2EBF2] leading-relaxed">
            Setiap rupiah yang Bapak/Ibu donasikan adalah investasi pahala yang akan terus mengalir sepanjang Ramadhan. Jadilah bagian dari kebaikan ini dan raih keberkahan bersama.
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm text-white">
            <CheckCircle className="h-5 w-5 text-[#80DEEA]" />
            <span>Insya Allah amanah dan transparan</span>
          </div>
        </div>

        {/* Rekening Donasi */}
        <div className="relative z-10 bg-white border-2 border-[#00BCD4] rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[#B2EBF2]">
              <Landmark className="h-6 w-6 text-[#006064]" />
            </div>
            <h3 className="text-lg font-bold text-[#006064]">Rekening Donasi</h3>
          </div>

          <div className="bg-gradient-to-r from-[#B2EBF2]/30 to-[#80DEEA]/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <Image
                src="/images/Logo-Yayasan-AlMuhajirin.png"
                alt="Logo Yayasan"
                width={60}
                height={30}
                className="object-contain"
              />
              <span className="text-sm font-semibold text-white bg-[#0066AE] px-3 py-1 rounded-full">Bank BRI</span>
            </div>
            <p className="text-3xl font-bold text-[#006064] tracking-wider">0211.01.004869.53.6</p>
            <p className="text-gray-600 mt-2">a/n. <span className="font-semibold">Al Muhajirin Rewwin</span></p>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-semibold text-[#006064] mb-2">Konfirmasi Donasi:</p>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#00BCD4]" />
              <span>0812-5906-069 (Bendahara)</span>
            </div>
          </div>
        </div>

        {/* Penutup */}
        <div className="relative z-10 mb-4 text-sm">
          <p className="text-gray-700 leading-relaxed text-justify">
            Demikian proposal ini kami sampaikan. Atas perhatian, kepercayaan, dan partisipasi Bapak/Ibu dalam mendukung program Ramadhan 1447 H, kami mengucapkan <span className="font-semibold text-[#006064]">Jazakumullahu Khairan Katsiran</span>. Semoga Allah SWT membalas setiap kebaikan dengan pahala yang berlipat ganda.
          </p>
        </div>

        {/* Tanda Tangan */}
        <div className="relative z-10 border-t-2 border-[#B2EBF2] pt-4">
          <p className="text-sm text-gray-600 mb-4">Sidoarjo, Januari 2026</p>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-12">Ketua Yayasan<br/>Al Muhajirin Rewwin</p>
              <p className="font-bold text-[#006064] border-t border-gray-300 pt-2">H. CAHYO HUSNI TAMRIN, ST, MM</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-12">Ketua Panitia Ramadhan 1447H<br/>Masjid Al Muhajirin Rewwin</p>
              <p className="font-bold text-[#006064] border-t border-gray-300 pt-2">ARIF BUDI SANTOSO</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-6 pt-3 border-t border-[#B2EBF2]">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Jl. Rajawali No. 207 REWWIN, Waru, Sidoarjo</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>0822-4534-2314</span>
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
