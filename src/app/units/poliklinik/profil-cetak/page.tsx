// src/app/units/poliklinik/profil-cetak/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Stethoscope, MapPin, Phone, Globe, Heart, Users, CheckCircle2, CircleDot, Building2 } from 'lucide-react';

export default function ProfilCetakPoliklinik() {
  const layanan = [
    'Pemeriksaan Umum',
    'Cek Tekanan Darah',
    'Cek Kolesterol, Asam Urat, Gula Darah',
    'Konsultasi Dokter',
    'Pengobatan Ringan',
    'Pemberian Obat Gratis',
  ];

  const alurPelayanan = [
    { step: '1', title: 'Datang', desc: 'Langsung ke lokasi' },
    { step: '2', title: 'Daftar', desc: 'Ambil nomor antrian' },
    { step: '3', title: 'Periksa', desc: 'Tensi, BB, TB, Lab' },
    { step: '4', title: 'Konsultasi', desc: 'Bertemu dokter' },
    { step: '5', title: 'Obat', desc: 'Ambil obat gratis' },
  ];

  const sasaran = ["Jama'ah Masjid Al Muhajirin", 'Warga Rewwin & sekitar', 'Masyarakat kurang mampu', 'Lansia & anak-anak'];

  return (
    <div className='bg-gray-200 min-h-screen'>
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
          height: 297mm;
          margin: 0 auto;
          background: white;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
        }
        @media screen {
          .a4-page {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            margin-top: 20px;
            margin-bottom: 20px;
          }
        }
      `}</style>

      {/* Print Button */}
      <div className='no-print fixed top-4 right-4 z-50 flex gap-3'>
        <button
          onClick={() => window.print()}
          className='bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
            />
          </svg>
          Cetak Brosur (2 Halaman)
        </button>
      </div>

      {/* ========== PAGE 1: COVER/FRONT ========== */}
      <div className='a4-page page-break'>
        {/* Page Curl Effect */}
        <div className='absolute top-0 right-0 w-16 h-16 z-40'>
          <div className='absolute top-0 right-0 w-0 h-0 border-t-[60px] border-t-gray-200 border-l-[60px] border-l-transparent'></div>
        </div>

        {/* Decorative Curved Shape - Bottom Right */}
        <div className='absolute right-0 bottom-[8%] w-[60%] h-[38%]'>
          <div className='absolute inset-0 bg-gradient-to-tl from-teal-600 to-teal-500 rounded-tl-[100px]'></div>
        </div>

        {/* Medical Cross Decorations */}
        <div className='absolute top-[8%] left-[45%] text-teal-400 text-5xl font-bold opacity-50'>+</div>
        <div className='absolute top-[5%] right-[20%] text-teal-500 text-6xl font-bold'>+</div>
        <div className='absolute bottom-[42%] right-[3%] text-teal-400 text-5xl font-bold'>+</div>

        {/* Header - Logo & Tagline */}
        <div className='absolute top-8 left-8 flex items-center gap-4 z-20'>
          <div className='w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center'>
            <Stethoscope className='w-9 h-9 text-white' />
          </div>
          <div>
            <p className='font-bold text-teal-700 text-2xl'>Al Muhajirin</p>
            <p className='text-teal-600 text-lg'>Kesehatan Anda, Prioritas Kami!</p>
          </div>
        </div>

        {/* Two Images - Left Side */}
        <div className='absolute left-6 top-[16%] w-[42%] h-[52%] z-10 flex flex-col gap-3'>
          {/* Image 1 - Cek Tekanan Darah */}
          <div className='relative flex-1 rounded-2xl overflow-hidden shadow-xl border-4 border-teal-500'>
            <Image src='/images/poliklinik/cek-tekanan-darah.jpg' alt='Pemeriksaan Tekanan Darah' fill className='object-cover' />
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-900/80 to-transparent p-3'>
              <p className='text-white font-bold text-lg'>Cek Tekanan Darah</p>
            </div>
          </div>
          {/* Image 2 - Memberi Obat */}
          <div className='relative flex-1 rounded-2xl overflow-hidden shadow-xl border-4 border-cyan-500'>
            <Image src='/images/poliklinik/memberi-obat.jpg' alt='Pemberian Obat' fill className='object-cover' />
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-900/80 to-transparent p-3'>
              <p className='text-white font-bold text-lg'>Pemberian Obat Gratis</p>
            </div>
          </div>
        </div>

        {/* Main Title - Right Side */}
        <div className='absolute top-[16%] right-[4%] w-[48%] z-20'>
          <div className='bg-gradient-to-r from-teal-600 to-cyan-700 px-8 py-4 rounded-xl inline-block mb-4'>
            <h1 className='text-4xl font-black text-white tracking-wide'>POLIKLINIK</h1>
          </div>
          <h2 className='text-5xl font-bold text-teal-800 mb-5'>Al Muhajirin</h2>
          <p className='text-gray-600 text-xl leading-relaxed'>
            Layanan kesehatan <strong className='text-teal-700'>GRATIS</strong> dan berkualitas untuk masyarakat sekitar Masjid Al Muhajirin Rewwin.
          </p>
        </div>

        {/* Schedule Badge */}
        <div className='absolute left-[6%] bottom-[18%] z-20'>
          <div className='w-44 h-44 rounded-full border-[5px] border-teal-500 bg-white flex flex-col items-center justify-center shadow-2xl'>
            <span className='text-teal-600 font-bold text-lg'>BUKA</span>
            <div className='text-center'>
              <p className='text-teal-700 font-black text-xl'>SELASA</p>
              <p className='text-teal-700 font-black text-xl'>&amp; JUMAT</p>
            </div>
            <span className='text-teal-600 font-bold text-lg mt-1'>09.00 - 11.00</span>
          </div>
        </div>

        {/* Location Badge */}
        <div className='absolute left-[4%] bottom-[8%] z-20'>
          <div className='bg-white border-2 border-teal-300 rounded-full px-6 py-3 flex items-center gap-3 shadow-xl'>
            <MapPin className='w-6 h-6 text-teal-600' />
            <span className='text-gray-700 font-semibold text-lg'>Jl. Rajawali No. 207, Rewwin, Waru, Sidoarjo</span>
          </div>
        </div>

        {/* Services List */}
        <div className='absolute right-[4%] bottom-[12%] w-[52%] z-20'>
          <h3 className='text-3xl font-bold text-white mb-5'>Layanan Kami :</h3>
          <div className='space-y-3'>
            {layanan.map((item, index) => (
              <div key={index} className='flex items-center gap-4'>
                <CheckCircle2 className='w-7 h-7 text-teal-300 flex-shrink-0' />
                <span className='text-white text-xl font-semibold'>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Contact Bar */}
        <div className='absolute bottom-0 left-0 right-0 bg-white py-4 px-8 flex items-center justify-center gap-12 border-t-2 border-gray-200 z-30'>
          <div className='flex items-center gap-3'>
            <Phone className='w-6 h-6 text-teal-600' />
            <span className='text-gray-700 font-semibold text-xl'>0821-2638-0665</span>
          </div>
          <div className='flex items-center gap-3'>
            <Globe className='w-6 h-6 text-teal-600' />
            <span className='text-gray-700 font-semibold text-xl'>poliklinik.muhajirinrewwin.or.id</span>
          </div>
        </div>
      </div>

      {/* ========== PAGE 2: BACK/DETAILS ========== */}
      <div className='a4-page relative overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-teal-500 via-cyan-600 to-teal-500'></div>
        <div className='absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-teal-500 via-cyan-600 to-teal-500'></div>
        <div className='absolute top-24 right-0 w-48 h-48 bg-teal-100 rounded-full opacity-40 blur-3xl'></div>
        <div className='absolute bottom-40 left-0 w-56 h-56 bg-cyan-100 rounded-full opacity-40 blur-3xl'></div>
        <div className='absolute top-[12%] left-[40%] text-teal-300 text-4xl font-bold opacity-40'>+</div>
        <div className='absolute bottom-[20%] right-[8%] text-teal-300 text-5xl font-bold opacity-30'>+</div>

        <div className='relative z-10 h-full flex flex-col p-6 pt-5'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center'>
                <Stethoscope className='w-7 h-7 text-white' />
              </div>
              <div>
                <p className='font-bold text-teal-700 text-xl'>Poliklinik Al Muhajirin</p>
                <p className='text-teal-600'>Informasi Lengkap</p>
              </div>
            </div>
          </div>

          {/* GRATIS Highlight */}
          <div className='rounded-2xl p-4 mb-4 text-white text-center' style={{ backgroundColor: '#319a9c' }}>
            <p className='text-4xl font-black mb-1'>LAYANAN 100% GRATIS</p>
            <p className='text-xl font-medium'>Pemeriksaan, Konsultasi, dan Obat — Tanpa Dipungut Biaya</p>
          </div>

          {/* Main Content - 2 Columns */}
          <div className='flex-1 grid grid-cols-2 gap-5'>
            {/* Left Column */}
            <div className='space-y-4'>
              {/* Alur Pelayanan */}
              <div>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-1.5 h-7 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full'></div>
                  <h3 className='text-xl font-bold text-teal-800'>ALUR PELAYANAN</h3>
                </div>
                <div className='space-y-2'>
                  {alurPelayanan.map((item, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
                        {item.step}
                      </div>
                      <div className='flex-1 bg-teal-50 rounded-xl px-3 py-2 border-2 border-teal-100'>
                        <p className='font-bold text-teal-800 text-lg'>{item.title}</p>
                        <p className='text-teal-600'>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className='text-teal-600 mt-2 italic'>* Bisa datang tanpa daftar online</p>
              </div>

              {/* Sasaran Layanan */}
              <div className='bg-teal-50 rounded-2xl p-4 border-2 border-teal-200'>
                <div className='flex items-center gap-2 mb-3'>
                  <Users className='w-6 h-6 text-teal-600' />
                  <h3 className='text-xl font-bold text-teal-800'>UNTUK SIAPA?</h3>
                </div>
                <ul className='space-y-2'>
                  {sasaran.map((item, index) => (
                    <li key={index} className='flex items-center gap-2 text-teal-700'>
                      <CircleDot className='w-4 h-4 text-teal-500 flex-shrink-0' />
                      <span className='font-semibold text-lg'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-4'>
              {/* Image - Konsultasi Dokter */}
              <div className='relative h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-teal-400'>
                <Image src='/images/poliklinik/konsultasi-dokter-umum.jpg' alt='Konsultasi Dokter Umum' fill className='object-cover' />
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-900/90 to-transparent p-3'>
                  <p className='text-white font-bold text-lg'>Konsultasi Dokter Umum</p>
                </div>
              </div>

              {/* Lokasi */}
              <div className='bg-white rounded-2xl p-4 border-2 border-teal-200'>
                <div className='flex items-center gap-2 mb-2'>
                  <MapPin className='w-6 h-6 text-teal-600' />
                  <h3 className='text-xl font-bold text-teal-800'>LOKASI</h3>
                </div>
                <p className='font-bold text-gray-800 text-lg mb-1'>Masjid Al Muhajirin Rewwin</p>
                <p className='text-gray-600 text-base'>Jl. Rajawali No. 207, Ngeni, Kepuhkiriman, Kec. Waru, Sidoarjo 61256</p>
              </div>

              {/* Donasi + Kontak Combined */}
              <div className='bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-4 text-white'>
                <div className='flex items-center gap-2 mb-2'>
                  <Heart className='w-6 h-6 text-white' />
                  <h3 className='text-xl font-bold text-white'>DUKUNG LAYANAN INI</h3>
                </div>
                <p className='text-teal-100 text-base mb-3'>Donasi melalui LAZ Muhajirin Rewwin</p>
                <div className='flex gap-3 items-center'>
                  {/* Bank Info */}
                  <div className='flex-1 bg-white/20 backdrop-blur rounded-xl p-3'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold text-teal-100'>Bank Muamalat</span>
                      <Building2 className='w-4 h-4 text-teal-200' />
                    </div>
                    <p className='font-bold text-2xl tracking-wider'>7070007500</p>
                    <p className='text-teal-200 text-sm mt-1'>
                      a/n. <strong>LAZ Muhajirin Rewwin</strong>
                    </p>
                  </div>
                  {/* QRIS */}
                  <div className='w-36 h-36 bg-white rounded-xl p-2 flex-shrink-0'>
                    <div className='relative w-full h-full'>
                      <Image src='/images/q-ris-laz-box.jpeg' alt='QRIS LAZ Muhajirin' fill className='object-contain rounded-lg' />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kontak */}
              <div className='bg-teal-50 rounded-2xl p-4 border-2 border-teal-200'>
                <div className='flex items-center gap-3 mb-2'>
                  <Phone className='w-6 h-6 text-teal-600' />
                  <h3 className='text-xl font-bold text-teal-800'>HUBUNGI KAMI</h3>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='bg-green-500 text-white px-3 py-1.5 rounded-full text-base font-bold'>WhatsApp</div>
                  <span className='text-2xl font-bold text-teal-800'>0821-2638-0665</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='mt-3 pt-3 border-t-2 border-teal-200'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center'>
                  <Stethoscope className='w-6 h-6 text-white' />
                </div>
                <div>
                  <p className='font-bold text-teal-800 text-lg'>Unit Poliklinik</p>
                  <p className='text-teal-600 text-sm'>Yayasan Al Muhajirin Rewwin</p>
                </div>
              </div>
              <div className='text-right max-w-[55%]'>
                <p className='text-teal-1200 italic'>&ldquo;Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain&rdquo;</p>
                <p className='text-teal-500 text-sm'>(HR. Ahmad)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
