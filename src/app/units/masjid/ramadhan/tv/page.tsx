// src/app/units/masjid/ramadhan/tv/page.tsx
// Dashboard Donasi Ramadhan untuk Layar Smart TV (16:9)
// Tampilan optimized untuk layar besar dengan fokus pada keterbacaan dan desain menarik
// Data mockup: langsung embed di file ini (CRUD menyusul)
'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Star, Gift, Calendar, CreditCard, Phone, Moon, Droplets, Leaf } from 'lucide-react';

// ─────────────────────────────────────────────
// DATA MOCKUP (ganti dengan API call nantinya)
// ─────────────────────────────────────────────

const HARI_RAMADHAN = 8; // Hari ke-berapa Ramadhan saat ini (dari 30)

const TOTAL_INFAQ = {
  terkumpul: 71_605_517,
  target: 132_500_000,
  progress: 54.04,
};

const PROGRAM_DATA = [
  {
    nama: 'Ifthar (Berbuka)',
    kategori: 'Makanan',
    terkumpul: 21,
    totalTarget: 30,
    satuan: 'hari',
    progress: 70,
    kebutuhanPerHari: 1_800_000,
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: '#10B981',
    iconName: 'gift' as const,
  },
  {
    nama: 'Air Mineral',
    kategori: 'Takjil',
    terkumpul: 12,
    totalTarget: 30,
    satuan: 'hari',
    progress: 40,
    kebutuhanPerHari: null,
    color: '#0EA5E9',
    bgColor: 'rgba(14, 165, 233, 0.08)',
    borderColor: '#0EA5E9',
    iconName: 'droplets' as const,
  },
  {
    nama: 'Kurma',
    kategori: 'Takjil',
    terkumpul: 7,
    totalTarget: 30,
    satuan: 'hari',
    progress: 23,
    kebutuhanPerHari: null,
    color: '#D97706',
    bgColor: 'rgba(217, 119, 6, 0.08)',
    borderColor: '#D97706',
    iconName: 'leaf' as const,
  },
  {
    nama: 'Sahur (Qiyamul Lail)',
    kategori: 'Ibadah',
    terkumpul: 8,
    totalTarget: 30,
    satuan: 'hari',
    progress: 27,
    kebutuhanPerHari: null,
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.08)',
    borderColor: '#8B5CF6',
    iconName: 'moon' as const,
  },
];

// Total 8.000.000 dalam 8 hari (data aktual Tarawih 1447H)
const INFAQ_HARIAN = [
  { hari: 1, jumlah: 1_700_000 },
  { hari: 2, jumlah: 1_600_000 },
  { hari: 3, jumlah:   950_000 },
  { hari: 4, jumlah: 1_050_000 },
  { hari: 5, jumlah:   650_000 },
  { hari: 6, jumlah:   650_000 },
  { hari: 7, jumlah:   750_000 },
  { hari: 8, jumlah:   650_000 },
];

const DONATUR_LIST = [
  { nama: 'Bpk. Pa***u Na******a', program: 'Tadarrus',    jumlah:   300_000 },
  { nama: 'Ibu. Ok**o',            program: 'Ifthar',      jumlah: 1_800_000 },
  { nama: 'Bpk. Ar**f Bu****n',    program: 'Ifthar',      jumlah: 1_000_000 },
  { nama: 'Bpk. A. Gu***r',        program: 'Ifthar',      jumlah:   900_000 },
  { nama: 'Ibu Da****o',           program: 'Ifthar',      jumlah:   500_000 },
  { nama: 'Bpk. Ba****g W',        program: 'Air Mineral', jumlah:   350_000 },
  { nama: 'Dr. Ri**l',             program: 'Air Mineral', jumlah:   250_000 },
  { nama: 'Ibu An*a Mu****r',      program: 'Ifthar',      jumlah:   200_000 },
  { nama: 'Bpk. Bu*i Pr*******o',  program: 'Ifthar',      jumlah:   200_000 },
  { nama: 'Ibu Wi***u',            program: 'Ifthar',      jumlah:   200_000 },
  { nama: 'Bpk. Bu*i P',           program: 'Ifthar',      jumlah:   100_000 },
  { nama: 'Ibu Su***g',            program: 'Ifthar',      jumlah:   100_000 },
  { nama: 'Ibu Ar*f',              program: 'Ifthar',      jumlah:   100_000 },
];

const UCAPAN_DOA_LIST = [
  {
    nama: 'Bpk. Pandhu Narwatama',
    program: 'Tadarrus',
    doa: "Semoga menjadi amal jariyah yang mengalirkan pahala, dan dimudahkan segala urusannya oleh Allah SWT.",
  },
  {
    nama: 'Ibu. Oktio',
    program: 'Ifthar',
    doa: 'Semoga Allah melipatgandakan rezekinya, memanjangkan umurnya dalam kebaikan, dan meridhoi setiap langkahnya.',
  },
  {
    nama: 'Bpk. Arief Budiman',
    program: 'Ifthar',
    doa: 'Semoga keluarganya senantiasa dalam lindungan Allah, hartanya diberkahi, dan doanya dikabulkan.',
  },
  {
    nama: 'Bpk. A. Guntar',
    program: 'Ifthar',
    doa: 'Semoga dijauhkan dari segala musibah, diberikan kesehatan yang sempurna dan kebahagiaan dunia akhirat.',
  },
  {
    nama: 'Ibu Darsono',
    program: 'Ifthar',
    doa: 'Semoga Allah mengampuni dosa-dosanya, meluaskan rizkinya, dan menjadikan Ramadhan ini penuh keberkahan.',
  },
  {
    nama: 'Bpk. Bambang W',
    program: 'Air Mineral',
    doa: 'Semoga keluarganya diberikan kesehatan, keselamatan, dan kemuliaan di sisi Allah SWT.',
  },
  {
    nama: 'Dr. Rizal',
    program: 'Air Mineral',
    doa: 'Semoga ilmu dan amalnya bermanfaat bagi umat, serta diberikan keberkahan dalam setiap pekerjaannya.',
  },
  {
    nama: 'Ibu Anna Muchtar',
    program: 'Ifthar',
    doa: 'Semoga segala kebaikannya dibalas berlipat ganda oleh Allah dan menjadi bekal di hari akhirat.',
  },
  {
    nama: 'Bpk. Budi Prihantono',
    program: 'Ifthar',
    doa: 'Semoga infaqnya menjadi cahaya di hari kiamat dan keluarganya senantiasa dalam ridho Allah.',
  },
  {
    nama: 'Ibu Winantu',
    program: 'Ifthar',
    doa: 'Semoga Allah membalas dengan kebaikan yang berlipat dan dimudahkan segala hajatnya.',
  },
  {
    nama: 'Bpk. Budi P',
    program: 'Ifthar',
    doa: 'Semoga Ramadhan ini menjadi momentum terbaik untuk meraih ampunan dan ridho Allah SWT.',
  },
  {
    nama: 'Ibu Sugeng',
    program: 'Ifthar',
    doa: 'Semoga keluarganya selalu rukun, sehat, dan senantiasa berada dalam keberkahan Allah SWT.',
  },
  {
    nama: 'Ibu Arif',
    program: 'Ifthar',
    doa: 'Semoga amal ibadahnya di bulan Ramadhan ini diterima Allah dan doanya diijabah.',
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getProgramColor(program: string): string {
  switch (program) {
    case 'Ifthar':     return '#10B981';
    case 'Air Mineral': return '#0EA5E9';
    case 'Kurma':      return '#D97706';
    case 'Tadarrus':   return '#F59E0B';
    default:           return '#6B7280';
  }
}

type IconName = 'gift' | 'star' | 'calendar' | 'droplets' | 'leaf' | 'moon';

function ProgramIcon({ name, color }: { name: IconName; color: string }) {
  const cls = 'w-8 h-8 shrink-0';
  if (name === 'gift')     return <Gift      className={cls} style={{ color }} />;
  if (name === 'star')     return <Star      className={cls} style={{ color }} />;
  if (name === 'droplets') return <Droplets  className={cls} style={{ color }} />;
  if (name === 'leaf')     return <Leaf      className={cls} style={{ color }} />;
  if (name === 'moon')     return <Moon      className={cls} style={{ color }} />;
  return <Calendar className={cls} style={{ color }} />;
}

// ─────────────────────────────────────────────
// KOMPONEN: Bar Chart Infaq Harian (CSS murni)
// ─────────────────────────────────────────────

function InfaqBarChart({ data, compact = false }: { data: typeof INFAQ_HARIAN; compact?: boolean }) {
  const maxJumlah = Math.max(...data.map((d) => d.jumlah));
  const barH = compact ? 52 : 88;
  const containerH = compact ? 'h-20' : 'h-36';
  return (
    <div className={`flex items-end justify-around gap-2 ${containerH}`}>
      {data.map((item) => {
        const pct = Math.round((item.jumlah / maxJumlah) * 100);
        return (
          <div key={item.hari} className="flex flex-col items-center gap-0.5 flex-1">
            <span className="text-xs font-bold text-green-700">
              {(item.jumlah / 1_000_000).toFixed(1)}jt
            </span>
            <div className="w-full bg-gray-100 rounded-t relative" style={{ height: `${barH}px` }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t transition-all duration-700"
                style={{ height: `${pct}%`, backgroundColor: '#059669' }}
              />
            </div>
            <span className="text-xs text-gray-400">H-{item.hari}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// KOMPONEN UTAMA TV DISPLAY
// ─────────────────────────────────────────────

export default function TVDisplayPage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doaIndex, setDoaIndex] = useState(0);
  const [donaturIndex, setDonaturIndex] = useState(0);
  const [showInfaqTotal, setShowInfaqTotal] = useState(false);

  const totalInfaqHarian = INFAQ_HARIAN.reduce((s, d) => s + d.jumlah, 0);

  // Jam & tanggal real-time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDate(now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setTime(now.toLocaleTimeString('id-ID'));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Rotasi ucapan doa setiap 6 detik
  useEffect(() => {
    const id = setInterval(() => setDoaIndex((i) => (i + 1) % UCAPAN_DOA_LIST.length), 6000);
    return () => clearInterval(id);
  }, []);

  // Rotasi donatur setiap 4 detik
  useEffect(() => {
    const id = setInterval(() => setDonaturIndex((i) => (i + 1) % (DONATUR_LIST.length - 2)), 4000);
    return () => clearInterval(id);
  }, []);

  // Alternatif tampilan Infaq Harian / Total Infaq setiap 6 detik
  useEffect(() => {
    const id = setInterval(() => setShowInfaqTotal((v) => !v), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Overlay fixed: menutupi navbar & footer parent layout */}
      <div
        className="fixed inset-0 z-[9999] overflow-hidden flex flex-col"
        style={{ backgroundColor: '#F0FDF4' }}
      >
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes gradientFlow {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulseSlow {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.015); }
          }
          .tv-fade-in  { animation: fadeSlideIn 0.5s ease-out forwards; }
          .tv-gradient {
            background: linear-gradient(135deg, #047857, #1e40af, #047857);
            background-size: 250% 250%;
            animation: gradientFlow 12s ease infinite;
          }
          .tv-pulse { animation: pulseSlow 4s ease-in-out infinite; }
        `}</style>

        {/* ══ HEADER ══ */}
        <header className="bg-green-800 text-white px-8 py-3 flex justify-between items-center shadow-xl shrink-0">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/Logo-YAMR.png" alt="Logo YAMR" className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-3xl font-extrabold leading-tight text-sky-300">Dashboard Ramadhan 1447H</h1>
              <p className="text-base text-green-300">Masjid Al Muhajirin Rewwin • RAMADHAN MADRASAH KITA</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <div className="text-3xl font-bold tabular-nums">{time}</div>
            <div className="text-sm text-green-300">{date}</div>
            <div className="mt-1 bg-green-700 border border-green-500 px-3 py-0.5 rounded-full text-sm font-semibold">
              Hari ke-{HARI_RAMADHAN} Ramadhan
            </div>
          </div>
        </header>

        {/* ══ MAIN CONTENT ══ */}
        <main className="flex-1 grid grid-cols-12 gap-4 px-6 py-4 overflow-hidden">

          {/* ── KOLOM KIRI (7/12) ── */}
          <div className="col-span-7 flex flex-col gap-4 overflow-hidden">

            {/* Card: Jazakumullah Khairan — flex-1 agar isi sisa ruang */}
            <div className="tv-gradient rounded-xl shadow-xl p-5 text-white relative overflow-hidden flex-1">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Heart className="w-36 h-36" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-7 h-7 text-pink-300" />
                <h2 className="text-2xl font-bold text-sky-300">Jazakumullah Khairan</h2>
              </div>
              <div key={doaIndex} className="tv-fade-in">
                <p className="text-lg leading-relaxed">
                  Terima kasih,{' '}
                  <span className="font-bold text-yellow-200">{UCAPAN_DOA_LIST[doaIndex].nama}</span>,
                  atas donasi program{' '}
                  <span className="italic">{UCAPAN_DOA_LIST[doaIndex].program}</span>-nya.{' '}
                  {UCAPAN_DOA_LIST[doaIndex].doa} Aamiin.
                </p>
              </div>
              <div className="flex gap-1.5 mt-3">
                {UCAPAN_DOA_LIST.map((_, i) => (
                  <span
                    key={i}
                    className="block h-2 w-2 rounded-full transition-all"
                    style={{ backgroundColor: i === doaIndex ? 'white' : 'rgba(255,255,255,0.3)' }}
                  />
                ))}
              </div>
            </div>

            {/* Card: Progress 4 Program — 2x2 Grid, shrink-0 agar tinggi sesuai konten */}
            <div className="bg-white rounded-xl shadow-xl p-4 shrink-0">
              <h2 className="text-base font-bold mb-2 text-gray-700">Progress Donasi Program</h2>
              <div className="grid grid-cols-2 gap-2">
                {PROGRAM_DATA.map((p) => (
                  <div
                    key={p.nama}
                    className="rounded-lg p-3 flex flex-col gap-2"
                    style={{ borderLeft: `5px solid ${p.borderColor}`, backgroundColor: p.bgColor }}
                  >
                    {/* Header program */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ProgramIcon name={p.iconName} color={p.color} />
                        <div>
                          <div className="font-bold text-gray-800 text-sm leading-tight">{p.nama}</div>
                          <div className="text-xs text-gray-500">{p.kategori}</div>
                        </div>
                      </div>
                      <span className="text-2xl font-extrabold" style={{ color: p.color }}>
                        {p.progress}%
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div>
                      <div className="w-full bg-gray-200 rounded-full h-5 mb-1">
                        <div
                          className="h-5 rounded-full transition-all duration-1000"
                          style={{ width: `${p.progress}%`, backgroundColor: p.color }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{p.terkumpul}/{p.totalTarget} {p.satuan} terpenuhi</span>
                        {p.kebutuhanPerHari && (
                          <span className="opacity-70">{formatRupiah(p.kebutuhanPerHari)}/hari</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── KOLOM KANAN (5/12) ── */}
          <div className="col-span-5 flex flex-col gap-4 overflow-hidden">

            {/* Card: Donatur Terkini */}
            <div className="bg-white rounded-xl shadow-xl p-4 flex-1 overflow-hidden">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-800">
                <Star className="w-5 h-5 text-yellow-500" />
                Donatur Terkini
              </h2>
              <div className="flex flex-col gap-1.5">
                {DONATUR_LIST.slice(donaturIndex, donaturIndex + 4).map((d, idx) => (
                  <div
                    key={`${d.nama}-${idx}`}
                    className="tv-fade-in flex justify-between items-center px-3 py-2 rounded-lg bg-gray-50 border-l-4"
                    style={{
                      borderColor: getProgramColor(d.program),
                      animationDelay: `${idx * 0.12}s`,
                    }}
                  >
                    <div>
                      <span className="font-semibold text-sm text-gray-800">{d.nama}</span>
                      <span className="text-xs ml-1.5 text-gray-500">({d.program})</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: getProgramColor(d.program) }}>
                      {formatRupiah(d.jumlah)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card: Infaq Harian / Total Infaq (alternating) */}
            <div className="bg-white rounded-xl shadow-xl p-4 shrink-0">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-bold text-gray-800">
                  {showInfaqTotal ? 'Total Infaq Terkumpul' : 'Infaq Harian'}
                </h2>
                {!showInfaqTotal && (
                  <span className="text-sm font-bold text-green-700">{formatRupiah(totalInfaqHarian)}</span>
                )}
              </div>
              {showInfaqTotal ? (
                <div key="total" className="tv-fade-in flex flex-col gap-2 py-1">
                  <div className="text-2xl font-extrabold text-green-700">{formatRupiah(TOTAL_INFAQ.terkumpul)}</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-yellow-400 transition-all duration-1000"
                      style={{ width: `${TOTAL_INFAQ.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="font-bold text-yellow-600">{TOTAL_INFAQ.progress}% terkumpul</span>
                    <span>Target: {formatRupiah(TOTAL_INFAQ.target)}</span>
                  </div>
                </div>
              ) : (
                <div key="harian" className="tv-fade-in">
                  <InfaqBarChart data={INFAQ_HARIAN} compact />
                </div>
              )}
            </div>

            {/* Card: Ajakan Donasi */}
            <div className="tv-pulse bg-gradient-to-br from-green-700 to-blue-800 rounded-xl shadow-xl p-4 text-white shrink-0">
              <h2 className="text-base font-bold mb-2 text-sky-300">Mari Berdonasi</h2>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <CreditCard className="w-4 h-4 shrink-0 opacity-80" />
                  <span className="opacity-80">Bank BRI:</span>
                  <span className="font-bold">0211.01.004869.53.6</span>
                  <span className="text-xs opacity-75">a.n. Al Muhajirin Rewwin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 opacity-80" />
                  <span className="opacity-80">Konfirmasi WA:</span>
                  <span className="font-bold">0812-2334-3416</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
