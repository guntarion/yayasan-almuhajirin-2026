// src/app/units/ambulans/profil-cetak/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Ambulance, MapPin, Phone, Heart, CheckCircle2, Building2, Clock, Siren, Hospital, AlertTriangle, Stethoscope, Wind, Thermometer } from 'lucide-react';

export default function ProfilCetakAmbulans() {
  const layananDarurat = ['Serangan Jantung', 'Stroke', 'Kecelakaan', 'Kondisi Gawat Darurat'];

  const layananNonDarurat = ['Antar ke RS (Rawat Jalan)', 'Antar Pulang dari RS', 'Antar Cuci Darah', 'Rujukan Antar RS'];

  const layananLain = ['Transportasi Jenazah', 'Standby Acara', 'Tanggap Bencana'];

  const infoHubungi = ['Nama & No. HP pelapor', 'Lokasi lengkap + patokan', 'Kondisi pasien singkat', 'Tujuan RS (jika ada)'];

  const wilayah = ['Kec. Waru', 'Kec. Gedangan', 'Kec. Sedati', 'Kec. Taman'];

  const rsRujukan = ['RS Siti Khodijah Sepanjang', 'RSU Waru', 'RS Mitra Keluarga Waru', 'RSUD Sidoarjo', 'RS Premier Surabaya'];

  const peralatan = [
    { nama: 'Brankar', icon: Hospital },
    { nama: 'Tabung O2', icon: Wind },
    { nama: 'Tensimeter', icon: Stethoscope },
    { nama: 'P3K Lengkap', icon: AlertTriangle },
  ];

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
          className='text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2'
          style={{ background: 'linear-gradient(to right, #2b438a, #004aad)' }}
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
        <div className='absolute right-0 bottom-[6%] w-[60%] h-[38%]'>
          <div className='absolute inset-0 rounded-tl-[100px]' style={{ background: 'linear-gradient(to top left, #2b438a, #004aad)' }}></div>
        </div>

        {/* Yellow accent stripe */}
        <div className='absolute left-0 bottom-[44%] w-[45%] h-[35px]' style={{ backgroundColor: '#fdc801' }}></div>

        {/* Top decorative bar */}
        <div className='absolute top-0 left-0 right-0 h-2' style={{ backgroundColor: '#004aad' }}></div>

        {/* Medical Cross / Plus Decorations */}
        <div className='absolute top-[6%] left-[40%] text-6xl font-bold opacity-50' style={{ color: '#004aad' }}>+</div>
        <div className='absolute top-[4%] right-[18%] text-7xl font-bold' style={{ color: '#2b438a' }}>+</div>
        <div className='absolute bottom-[42%] right-[2%] text-5xl font-bold' style={{ color: '#004aad' }}>+</div>

        {/* Header - Logo & Tagline */}
        <div className='absolute top-8 left-8 flex items-center gap-4 z-20'>
          <div className='w-16 h-16 rounded-xl flex items-center justify-center' style={{ background: 'linear-gradient(to bottom right, #2b438a, #004aad)' }}>
            <Ambulance className='w-9 h-9 text-white' />
          </div>
          <div>
            <p className='font-bold text-2xl' style={{ color: '#2b438a' }}>Al Muhajirin</p>
            <p className='text-lg' style={{ color: '#004aad' }}>Respon Cepat, Layanan Amanah</p>
          </div>
        </div>

        {/* Ambulance Image - Large */}
        <div className='absolute left-2 top-[13%] w-[58%] h-[40%] z-10'>
          <div className='relative w-full h-full'>
            <Image src='/images/laz/ambulance-almuhajirin.png' alt='Ambulans Al Muhajirin' fill className='object-contain' />
          </div>
        </div>

        {/* Main Title - Right Side */}
        <div className='absolute top-[13%] right-[4%] w-[40%] z-20'>
          <div className='px-6 py-3 rounded-xl inline-block mb-3' style={{ background: 'linear-gradient(to right, #2b438a, #004aad)' }}>
            <h1 className='text-4xl font-black text-white tracking-wide'>AMBULANS</h1>
          </div>
          <h2 className='text-5xl font-bold mb-3' style={{ color: '#fdc801' }}>Al Muhajirin</h2>
          <p className='text-gray-600 text-xl leading-relaxed'>
            Layanan transportasi medis <strong style={{ color: '#2b438a' }}>24 JAM</strong> untuk masyarakat Sidoarjo dan sekitarnya.
          </p>

          {/* Spesifikasi Singkat */}
          <div className='mt-4 rounded-xl p-3 border-2' style={{ backgroundColor: '#f0f4ff', borderColor: '#004aad' }}>
            <p className='font-bold mb-2' style={{ color: '#2b438a' }}>Spesifikasi Armada:</p>
            <ul className='text-gray-700 space-y-1 text-base'>
              <li>• Ambulans Transportasi</li>
              <li>• Kapasitas: 1 pasien + pendamping</li>
              <li>• Sirene & Lampu Darurat</li>
              <li>• Full AC</li>
            </ul>
          </div>
        </div>

        {/* Hotline Badge - Large & Prominent */}
        <div className='absolute left-[4%] bottom-[18%] z-20'>
          <div className='bg-white rounded-2xl p-5 shadow-2xl border-4' style={{ borderColor: '#2b438a' }}>
            <div className='flex items-center gap-2 mb-1'>
              <Siren className='w-6 h-6' style={{ color: '#fdc801' }} />
              <p className='font-bold text-xl' style={{ color: '#2b438a' }}>HOTLINE 24 JAM</p>
            </div>
            <p className='text-5xl font-black text-gray-900'>0859-1807-79439</p>
            <p className='text-gray-500 mt-1 text-lg'>Telepon / WhatsApp</p>
          </div>
        </div>

        {/* Location Badge */}
        <div className='absolute left-[4%] bottom-[8%] z-20'>
          <div className='bg-white border-2 rounded-full px-5 py-2 flex items-center gap-2 shadow-xl' style={{ borderColor: '#004aad' }}>
            <MapPin className='w-5 h-5' style={{ color: '#fdc801' }} />
            <span className='text-gray-700 font-semibold'>Jl. Rajawali No. 207, Rewwin, Waru, Sidoarjo</span>
          </div>
        </div>

        {/* Layanan - Right Side on Blue Area */}
        <div className='absolute right-[4%] bottom-[10%] w-[52%] z-20'>
          <h3 className='text-2xl font-bold text-white mb-3'>Layanan Darurat:</h3>
          <div className='grid grid-cols-2 gap-2 mb-4'>
            {layananDarurat.map((item, index) => (
              <div key={index} className='flex items-center gap-2'>
                <CheckCircle2 className='w-5 h-5 flex-shrink-0' style={{ color: '#fdc801' }} />
                <span className='text-white text-lg font-medium'>{item}</span>
              </div>
            ))}
          </div>
          <h3 className='text-2xl font-bold text-white mb-3'>Layanan Non-Darurat:</h3>
          <div className='grid grid-cols-2 gap-2'>
            {layananNonDarurat.map((item, index) => (
              <div key={index} className='flex items-center gap-2'>
                <CheckCircle2 className='w-5 h-5 flex-shrink-0' style={{ color: '#fdc801' }} />
                <span className='text-white text-lg font-medium'>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Contact Bar */}
        <div className='absolute bottom-0 left-0 right-0 bg-white py-3 px-8 flex items-center justify-center gap-10 border-t-2 border-gray-200 z-30'>
          <div className='flex items-center gap-2'>
            <Phone className='w-5 h-5' style={{ color: '#fdc801' }} />
            <span className='font-bold text-2xl' style={{ color: '#2b438a' }}>0859-1807-79439</span>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='w-5 h-5' style={{ color: '#fdc801' }} />
            <span className='font-semibold text-lg' style={{ color: '#2b438a' }}>Siaga 24 Jam</span>
          </div>
        </div>
      </div>

      {/* ========== PAGE 2: BACK/DETAILS ========== */}
      <div className='a4-page relative overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute top-0 left-0 w-full h-4' style={{ background: 'linear-gradient(to right, #2b438a, #004aad, #2b438a)' }}></div>
        <div className='absolute bottom-0 left-0 w-full h-4' style={{ background: 'linear-gradient(to right, #2b438a, #004aad, #2b438a)' }}></div>
        <div className='absolute top-24 right-0 w-48 h-48 rounded-full opacity-40 blur-3xl' style={{ backgroundColor: '#e0e7ff' }}></div>
        <div className='absolute bottom-40 left-0 w-56 h-56 rounded-full opacity-40 blur-3xl' style={{ backgroundColor: '#fef3c7' }}></div>
        <div className='absolute top-[10%] left-[38%] text-4xl font-bold opacity-40' style={{ color: '#004aad' }}>+</div>
        <div className='absolute bottom-[18%] right-[6%] text-5xl font-bold opacity-30' style={{ color: '#004aad' }}>+</div>

        <div className='relative z-10 h-full flex flex-col p-6 pt-5'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-xl flex items-center justify-center' style={{ background: 'linear-gradient(to bottom right, #2b438a, #004aad)' }}>
                <Ambulance className='w-7 h-7 text-white' />
              </div>
              <div>
                <p className='font-bold text-xl' style={{ color: '#2b438a' }}>Ambulans Al Muhajirin</p>
                <p style={{ color: '#004aad' }}>Unit Ambulans dan Tanggap Bencana</p>
              </div>
            </div>
          </div>

          {/* Bayar Seikhlasnya Highlight */}
          <div className='rounded-2xl p-4 mb-4 text-white text-center' style={{ backgroundColor: '#2b438a' }}>
            <p className='text-4xl font-black mb-1'>BAYAR SEIKHLASNYA</p>
            <p className='text-xl font-medium'>GRATIS untuk Masyarakat Tidak Mampu</p>
          </div>

          {/* Main Content - 2 Columns */}
          <div className='flex-1 grid grid-cols-2 gap-5'>
            {/* Left Column */}
            <div className='space-y-4'>
              {/* Info Saat Menghubungi */}
              <div className='rounded-2xl p-4 border-2' style={{ backgroundColor: '#f0f4ff', borderColor: '#004aad' }}>
                <div className='flex items-center gap-2 mb-3'>
                  <Phone className='w-6 h-6' style={{ color: '#fdc801' }} />
                  <h3 className='text-xl font-bold' style={{ color: '#2b438a' }}>SAAT MENGHUBUNGI, SAMPAIKAN:</h3>
                </div>
                <ul className='space-y-2'>
                  {infoHubungi.map((item, index) => (
                    <li key={index} className='flex items-center gap-2' style={{ color: '#2b438a' }}>
                      <div className='w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0' style={{ backgroundColor: '#fdc801' }}>
                        {index + 1}
                      </div>
                      <span className='font-semibold text-lg'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Layanan Lain */}
              <div className='bg-white rounded-2xl p-4 border-2' style={{ borderColor: '#004aad' }}>
                <h3 className='text-xl font-bold mb-3' style={{ color: '#2b438a' }}>LAYANAN LAINNYA:</h3>
                <ul className='space-y-2'>
                  {layananLain.map((item, index) => (
                    <li key={index} className='flex items-center gap-2 text-gray-700'>
                      <CheckCircle2 className='w-5 h-5 flex-shrink-0' style={{ color: '#fdc801' }} />
                      <span className='font-semibold text-lg'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Peralatan Medis */}
              <div className='rounded-2xl p-4 border-2' style={{ backgroundColor: '#f0f4ff', borderColor: '#004aad' }}>
                <h3 className='text-xl font-bold mb-3' style={{ color: '#2b438a' }}>PERALATAN MEDIS:</h3>
                <div className='grid grid-cols-2 gap-2'>
                  {peralatan.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 bg-white rounded-lg p-2 border' style={{ borderColor: '#e0e7ff' }}>
                      <item.icon className='w-5 h-5' style={{ color: '#fdc801' }} />
                      <span className='font-medium text-gray-700'>{item.nama}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-4'>
              {/* Wilayah & RS Rujukan */}
              <div className='bg-white rounded-2xl p-4 border-2' style={{ borderColor: '#004aad' }}>
                <div className='flex items-center gap-2 mb-2'>
                  <MapPin className='w-6 h-6' style={{ color: '#fdc801' }} />
                  <h3 className='text-xl font-bold' style={{ color: '#2b438a' }}>WILAYAH LAYANAN</h3>
                </div>
                <div className='flex flex-wrap gap-2 mb-3'>
                  {wilayah.map((item, index) => (
                    <span key={index} className='px-3 py-1 rounded-full text-sm font-semibold' style={{ backgroundColor: '#f0f4ff', color: '#2b438a' }}>
                      {item}
                    </span>
                  ))}
                </div>
                <p className='text-gray-600 text-sm mb-3'>+ Seluruh Sidoarjo, Surabaya & wilayah lain (koordinasi)</p>

                <div className='border-t pt-3' style={{ borderColor: '#e0e7ff' }}>
                  <div className='flex items-center gap-2 mb-2'>
                    <Hospital className='w-5 h-5' style={{ color: '#fdc801' }} />
                    <h4 className='font-bold' style={{ color: '#2b438a' }}>RS Rujukan Terdekat:</h4>
                  </div>
                  <ul className='text-gray-600 text-sm space-y-1'>
                    {rsRujukan.map((rs, index) => (
                      <li key={index}>• {rs}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Donasi */}
              <div className='rounded-2xl p-4 text-white' style={{ background: 'linear-gradient(to bottom right, #2b438a, #004aad)' }}>
                <div className='flex items-center gap-2 mb-2'>
                  <Heart className='w-6 h-6' style={{ color: '#fdc801' }} />
                  <h3 className='text-xl font-bold text-white'>DUKUNG LAYANAN INI</h3>
                </div>
                <p className='text-sm mb-3' style={{ color: '#c7d2fe' }}>Donasi untuk BBM, perawatan kendaraan, peralatan medis & logistik bencana</p>
                <div className='flex gap-3 items-center'>
                  {/* Bank Info */}
                  <div className='flex-1 bg-white/20 backdrop-blur rounded-xl p-3'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold' style={{ color: '#fdc801' }}>Bank Muamalat</span>
                      <Building2 className='w-4 h-4' style={{ color: '#fdc801' }} />
                    </div>
                    <p className='font-bold text-2xl tracking-wider'>7070007500</p>
                    <p className='text-sm mt-1' style={{ color: '#c7d2fe' }}>
                      a/n. <strong>LAZ Muhajirin Rewwin</strong>
                    </p>
                    <p className='text-xs mt-1' style={{ color: '#c7d2fe' }}>Ket: DONASI AMBULANS</p>
                  </div>
                  {/* QRIS */}
                  <div className='w-28 h-28 bg-white rounded-xl p-1.5 flex-shrink-0'>
                    <div className='relative w-full h-full'>
                      <Image src='/images/q-ris-laz-box.jpeg' alt='QRIS LAZ Muhajirin' fill className='object-contain rounded-lg' />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kontak - Large */}
              <div className='rounded-2xl p-4 border-2' style={{ backgroundColor: '#f0f4ff', borderColor: '#004aad' }}>
                <div className='flex items-center gap-2 mb-2'>
                  <Siren className='w-6 h-6' style={{ color: '#fdc801' }} />
                  <h3 className='text-xl font-bold' style={{ color: '#2b438a' }}>HUBUNGI SEKARANG</h3>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='bg-green-500 text-white px-3 py-1 rounded-full text-base font-bold'>WhatsApp</div>
                  <span className='text-3xl font-black' style={{ color: '#2b438a' }}>0859-1807-79439</span>
                </div>
                <p className='text-sm mt-2' style={{ color: '#004aad' }}>Telepon langsung atau chat WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='mt-3 pt-3 border-t-2' style={{ borderColor: '#e0e7ff' }}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: 'linear-gradient(to bottom right, #2b438a, #004aad)' }}>
                  <Ambulance className='w-6 h-6 text-white' />
                </div>
                <div>
                  <p className='font-bold text-lg' style={{ color: '#2b438a' }}>Unit Ambulans Al Muhajirin</p>
                  <p className='text-sm' style={{ color: '#004aad' }}>Yayasan Al Muhajirin Rewwin</p>
                </div>
              </div>
              <div className='text-right max-w-[50%]'>
                <p className='italic text-sm' style={{ color: '#2b438a' }}>&ldquo;Barangsiapa meringankan kesulitan seorang mukmin, Allah akan meringankan kesulitannya&rdquo;</p>
                <p className='text-xs' style={{ color: '#004aad' }}>(HR. Muslim)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
