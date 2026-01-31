// src/app/units/ambulans/profil-cetak/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Ambulance, MapPin, Phone, Globe, Heart, Users, CheckCircle2, CircleDot, Building2, Clock, Siren, Hospital, Truck } from 'lucide-react';

export default function ProfilCetakAmbulans() {
  const layanan = [
    'Evakuasi Medis Darurat',
    'Antar Pasien ke Rumah Sakit',
    'Antar Pasien Cuci Darah',
    'Transportasi Jenazah',
    'Standby Acara',
    'Tanggap Bencana',
  ];

  const alurPelayanan = [
    { step: '1', title: 'Hubungi', desc: 'Hotline 24 jam' },
    { step: '2', title: 'Verifikasi', desc: 'Lokasi & kondisi' },
    { step: '3', title: 'Dispatch', desc: 'Tim berangkat' },
    { step: '4', title: 'Evakuasi', desc: 'Penanganan pasien' },
    { step: '5', title: 'Antar', desc: 'Ke RS tujuan' },
  ];

  const wilayah = ['Kec. Waru, Sidoarjo', 'Kec. Gedangan, Sidoarjo', 'Kec. Sedati, Sidoarjo', 'Seluruh Sidoarjo & Surabaya'];

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
          className='bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2'
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
        {/* Decorative Curved Shape - Bottom Right */}
        <div className='absolute right-0 bottom-[6%] w-[65%] h-[40%]'>
          <div className='absolute inset-0 bg-gradient-to-tl from-red-600 to-red-500 rounded-tl-[100px]'></div>
        </div>

        {/* Medical Cross / Plus Decorations */}
        <div className='absolute top-[6%] left-[42%] text-red-400 text-6xl font-bold opacity-50'>+</div>
        <div className='absolute top-[4%] right-[18%] text-red-500 text-7xl font-bold'>+</div>
        <div className='absolute bottom-[44%] right-[2%] text-red-400 text-5xl font-bold'>+</div>

        {/* Header - Logo & Tagline */}
        <div className='absolute top-8 left-8 flex items-center gap-4 z-20'>
          <div className='w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center'>
            <Ambulance className='w-9 h-9 text-white' />
          </div>
          <div>
            <p className='font-bold text-red-700 text-2xl'>Al Muhajirin</p>
            <p className='text-red-600 text-lg'>Respon Cepat, Layanan Amanah</p>
          </div>
        </div>

        {/* Ambulance Image - Large */}
        <div className='absolute left-4 top-[14%] w-[55%] h-[42%] z-10'>
          <div className='relative w-full h-full'>
            <Image src='/images/laz/ambulance-almuhajirin.png' alt='Ambulans Al Muhajirin' fill className='object-contain' />
          </div>
        </div>

        {/* Main Title - Right Side */}
        <div className='absolute top-[14%] right-[4%] w-[42%] z-20'>
          <div className='bg-gradient-to-r from-red-600 to-orange-600 px-8 py-4 rounded-xl inline-block mb-4'>
            <h1 className='text-4xl font-black text-white tracking-wide'>AMBULANS</h1>
          </div>
          <h2 className='text-5xl font-bold text-red-800 mb-4'>Al Muhajirin</h2>
          <p className='text-gray-600 text-xl leading-relaxed'>
            Layanan transportasi medis darurat <strong className='text-red-700'>24 JAM</strong> untuk masyarakat Sidoarjo dan sekitarnya.
          </p>
        </div>

        {/* Hotline Badge - Large & Prominent */}
        <div className='absolute left-[4%] bottom-[20%] z-20'>
          <div className='bg-white rounded-2xl p-5 shadow-2xl border-4 border-red-500'>
            <p className='text-red-600 font-bold text-xl mb-1'>HOTLINE 24 JAM</p>
            <p className='text-5xl font-black text-gray-900'>0859-1807-79439</p>
            <p className='text-gray-500 mt-1 text-lg'>Telepon / WhatsApp</p>
          </div>
        </div>

        {/* Location Badge */}
        <div className='absolute left-[4%] bottom-[8%] z-20'>
          <div className='bg-white border-2 border-red-300 rounded-full px-6 py-3 flex items-center gap-3 shadow-xl'>
            <MapPin className='w-6 h-6 text-red-600' />
            <span className='text-gray-700 font-semibold text-lg'>Jl. Rajawali No. 207, Rewwin, Waru, Sidoarjo</span>
          </div>
        </div>

        {/* Services List */}
        <div className='absolute right-[4%] bottom-[10%] w-[55%] z-20'>
          <h3 className='text-3xl font-bold text-white mb-5'>Layanan Kami :</h3>
          <div className='grid grid-cols-2 gap-3'>
            {layanan.map((item, index) => (
              <div key={index} className='flex items-center gap-3'>
                <CheckCircle2 className='w-6 h-6 text-red-200 flex-shrink-0' />
                <span className='text-white text-lg font-semibold'>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Contact Bar */}
        <div className='absolute bottom-0 left-0 right-0 bg-white py-4 px-8 flex items-center justify-center gap-12 border-t-2 border-gray-200 z-30'>
          <div className='flex items-center gap-3'>
            <Phone className='w-6 h-6 text-red-600' />
            <span className='text-gray-700 font-bold text-2xl'>0859-1807-79439</span>
          </div>
          <div className='flex items-center gap-3'>
            <Globe className='w-6 h-6 text-red-600' />
            <span className='text-gray-700 font-semibold text-xl'>ambulans.muhajirinrewwin.or.id</span>
          </div>
        </div>
      </div>

      {/* ========== PAGE 2: BACK/DETAILS ========== */}
      <div className='a4-page relative overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-500'></div>
        <div className='absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-500'></div>
        <div className='absolute top-24 right-0 w-48 h-48 bg-red-100 rounded-full opacity-40 blur-3xl'></div>
        <div className='absolute bottom-40 left-0 w-56 h-56 bg-orange-100 rounded-full opacity-40 blur-3xl'></div>
        <div className='absolute top-[12%] left-[40%] text-red-300 text-4xl font-bold opacity-40'>+</div>
        <div className='absolute bottom-[20%] right-[8%] text-red-300 text-5xl font-bold opacity-30'>+</div>

        <div className='relative z-10 h-full flex flex-col p-6 pt-5'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center'>
                <Ambulance className='w-7 h-7 text-white' />
              </div>
              <div>
                <p className='font-bold text-red-700 text-xl'>Ambulans Al Muhajirin</p>
                <p className='text-red-600'>Informasi Lengkap</p>
              </div>
            </div>
          </div>

          {/* Bayar Seikhlasnya Highlight */}
          <div className='rounded-2xl p-4 mb-4 text-white text-center' style={{ backgroundColor: '#dc2626' }}>
            <p className='text-4xl font-black mb-1'>BAYAR SEIKHLASNYA</p>
            <p className='text-xl font-medium'>GRATIS untuk Masyarakat Tidak Mampu</p>
          </div>

          {/* Main Content - 2 Columns */}
          <div className='flex-1 grid grid-cols-2 gap-5'>
            {/* Left Column */}
            <div className='space-y-4'>
              {/* Alur Pelayanan */}
              <div>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-1.5 h-7 bg-gradient-to-b from-red-500 to-orange-500 rounded-full'></div>
                  <h3 className='text-xl font-bold text-red-800'>ALUR LAYANAN</h3>
                </div>
                <div className='space-y-2'>
                  {alurPelayanan.map((item, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
                        {item.step}
                      </div>
                      <div className='flex-1 bg-red-50 rounded-xl px-3 py-2 border-2 border-red-100'>
                        <p className='font-bold text-red-800 text-lg'>{item.title}</p>
                        <p className='text-red-600'>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wilayah Layanan */}
              <div className='bg-red-50 rounded-2xl p-4 border-2 border-red-200'>
                <div className='flex items-center gap-2 mb-3'>
                  <MapPin className='w-6 h-6 text-red-600' />
                  <h3 className='text-xl font-bold text-red-800'>WILAYAH LAYANAN</h3>
                </div>
                <ul className='space-y-2'>
                  {wilayah.map((item, index) => (
                    <li key={index} className='flex items-center gap-2 text-red-700'>
                      <CircleDot className='w-4 h-4 text-red-500 flex-shrink-0' />
                      <span className='font-semibold text-lg'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-4'>
              {/* Gallery Placeholder - 4 Images Grid */}
              <div className='grid grid-cols-2 gap-2'>
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className='relative h-24 rounded-xl overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 border-2 border-red-200'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <Truck className='w-8 h-8 text-red-400 mx-auto' />
                        <p className='text-red-500 text-xs font-medium mt-1'>Foto #{num}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lokasi */}
              <div className='bg-white rounded-2xl p-4 border-2 border-red-200'>
                <div className='flex items-center gap-2 mb-2'>
                  <Hospital className='w-6 h-6 text-red-600' />
                  <h3 className='text-xl font-bold text-red-800'>LOKASI POOL</h3>
                </div>
                <p className='font-bold text-gray-800 text-lg mb-1'>Masjid Al Muhajirin Rewwin</p>
                <p className='text-gray-600'>Jl. Rajawali No. 207, Ngeni, Kepuhkiriman, Kec. Waru, Sidoarjo 61256</p>
              </div>

              {/* Donasi */}
              <div className='bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-4 text-white'>
                <div className='flex items-center gap-2 mb-2'>
                  <Heart className='w-6 h-6 text-white' />
                  <h3 className='text-xl font-bold text-white'>DUKUNG LAYANAN INI</h3>
                </div>
                <p className='text-red-100 text-base mb-3'>Donasi melalui LAZ Muhajirin Rewwin</p>
                <div className='flex gap-3 items-center'>
                  {/* Bank Info */}
                  <div className='flex-1 bg-white/20 backdrop-blur rounded-xl p-3'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold text-red-100'>Bank Muamalat</span>
                      <Building2 className='w-4 h-4 text-red-200' />
                    </div>
                    <p className='font-bold text-2xl tracking-wider'>7070007500</p>
                    <p className='text-red-200 text-sm mt-1'>
                      a/n. <strong>LAZ Muhajirin Rewwin</strong>
                    </p>
                  </div>
                  {/* QRIS */}
                  <div className='w-32 h-32 bg-white rounded-xl p-2 flex-shrink-0'>
                    <div className='relative w-full h-full'>
                      <Image src='/images/q-ris-laz-box.jpeg' alt='QRIS LAZ Muhajirin' fill className='object-contain rounded-lg' />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kontak - Large */}
              <div className='bg-red-50 rounded-2xl p-4 border-2 border-red-200'>
                <div className='flex items-center gap-2 mb-2'>
                  <Phone className='w-6 h-6 text-red-600' />
                  <h3 className='text-xl font-bold text-red-800'>HUBUNGI KAMI</h3>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='bg-green-500 text-white px-3 py-1.5 rounded-full text-base font-bold'>WhatsApp</div>
                  <span className='text-3xl font-black text-red-800'>0859-1807-79439</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='mt-3 pt-3 border-t-2 border-red-200'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center'>
                  <Ambulance className='w-6 h-6 text-white' />
                </div>
                <div>
                  <p className='font-bold text-red-800 text-lg'>Unit Ambulans</p>
                  <p className='text-red-600 text-sm'>Yayasan Al Muhajirin Rewwin</p>
                </div>
              </div>
              <div className='text-right max-w-[55%]'>
                <p className='text-red-700 italic'>&ldquo;Barangsiapa meringankan kesulitan seorang mukmin, Allah akan meringankan kesulitannya&rdquo;</p>
                <p className='text-red-500 text-sm'>(HR. Muslim)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
