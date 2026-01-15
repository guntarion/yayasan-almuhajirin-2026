// src/app/units/masjid/ramadhan/sponsorship/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Users,
  Target,
  Heart,
  Megaphone,
  Store,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Flag,
  Shirt,
  Banknote,
  Package,
  Award,
} from 'lucide-react';

export default function SponsorshipRunMadanPage() {
  const sponsorshipPackages = [
    {
      id: 1,
      name: 'Logo di Jersey Run-Madan',
      price: 2000000,
      details: 'Ukuran 10 cm x 10 cm',
      benefits: [
        'Logo sponsor tercetak di jersey peserta',
        'Eksposur langsung kepada semua peserta',
        'Dokumentasi foto dengan jersey',
        'Jersey dipakai saat event & dapat dibawa pulang peserta',
      ],
      icon: Shirt,
      color: 'from-[#1976D2] to-[#0D47A1]',
    },
    {
      id: 2,
      name: 'Logo di Backdrop Panggung',
      price: 1500000,
      details: '+ disebutkan oleh MC dalam acara',
      benefits: [
        'Logo tampil di backdrop panggung utama',
        'Disebut berulang kali oleh MC selama acara',
        'Eksposur di dokumentasi foto & video',
        'Durasi tayang: 1 hari penuh saat event',
      ],
      icon: Megaphone,
      color: 'from-[#7B1FA2] to-[#4A148C]',
    },
    {
      id: 3,
      name: 'Umbul-Umbul Sponsor',
      price: 1000000,
      details: '4 tiang @ Rp 1.000.000',
      benefits: [
        'Pemasangan umbul-umbul di 4 titik strategis',
        'Durasi tayang: 11 hari (31 Januari - 9 Februari 2026)',
        'Lokasi di sekitar rute lari dan area masjid',
        'Visibilitas tinggi kepada warga sekitar',
      ],
      icon: Flag,
      color: 'from-[#00796B] to-[#004D40]',
    },
  ];

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='bg-white min-h-screen'>
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

      {/* Print Button */}
      <div className='no-print fixed top-20 right-4 z-50'>
        <button
          onClick={() => window.print()}
          className='bg-gradient-to-r from-[#1976D2] to-[#0D47A1] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all'
        >
          Cetak Proposal
        </button>
      </div>

      {/* ========== HALAMAN 1: COVER ========== */}
      <div className='a4-page page-break relative overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#1976D2] via-[#0D47A1] to-[#1976D2]'></div>
        <div className='absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#1976D2] via-[#0D47A1] to-[#1976D2]'></div>
        <div className='absolute top-16 right-0 w-48 h-48 bg-[#BBDEFB] rounded-full opacity-40 blur-3xl'></div>
        <div className='absolute top-32 right-16 w-24 h-24 bg-[#1976D2] rounded-full opacity-20 blur-2xl'></div>
        <div className='absolute bottom-16 left-0 w-56 h-56 bg-[#90CAF9] rounded-full opacity-40 blur-3xl'></div>
        <div className='absolute bottom-32 left-8 w-32 h-32 bg-[#0D47A1] rounded-full opacity-15 blur-2xl'></div>
        <div className='absolute top-1/2 -left-10 w-40 h-40 bg-[#BBDEFB] rounded-full opacity-30 blur-3xl'></div>
        <div className='absolute top-24 left-4 w-20 h-20 bg-[#1976D2] rounded-full opacity-25 blur-xl'></div>
        <div className='absolute bottom-40 right-0 w-36 h-36 bg-[#90CAF9] rounded-full opacity-25 blur-2xl'></div>
        <div className='absolute top-40 left-0 w-1 h-32 bg-gradient-to-b from-[#1976D2]/40 to-transparent'></div>
        <div className='absolute bottom-40 right-0 w-1 h-32 bg-gradient-to-t from-[#1976D2]/40 to-transparent'></div>

        <div className='relative z-10 h-full flex flex-col'>
          {/* Header with Logos */}
          <div className='flex justify-between items-start pt-4'>
            <div className='p-3 bg-white rounded-xl border border-[#BBDEFB]'>
              <Image src='/images/Logo-YAMR.png' alt='Logo Al Muhajirin' width={100} height={100} className='object-contain' />
            </div>
            <div className='p-3 bg-white rounded-xl border border-[#BBDEFB]'>
              <Image src='/images/masjid/logo-run-madan2.png' alt='Logo Run-Madan' width={100} height={100} className='object-contain' />
            </div>
          </div>

          {/* Main Title */}
          <div className='flex-1 flex flex-col justify-center text-center px-4'>
            <p className='text-[#1565C0] text-lg font-medium mb-2'>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

            <div className='my-4'>
              <div className='inline-flex items-center gap-2 bg-gradient-to-r from-[#BBDEFB] to-[#90CAF9] px-6 py-2 rounded-full'>
                <Calendar className='h-5 w-5 text-[#0D47A1]' />
                <span className='text-[#0D47A1] font-semibold'>Minggu, 8 Februari 2026</span>
              </div>
            </div>

            <h1 className='text-4xl font-bold text-[#0D47A1] mb-2'>PROPOSAL SPONSORSHIP</h1>
            <h2 className='text-3xl font-bold text-[#1976D2] mb-4'>RUN-MADAN 2026</h2>
            <p className='text-xl text-[#1565C0] mb-4'>Edu Run & Edukasi Kesehatan REWWIN</p>

            <div className='bg-gradient-to-r from-[#0D47A1] to-[#1565C0] text-white py-4 px-8 rounded-2xl mx-auto max-w-lg'>
              <p className='text-xl font-semibold text-white mb-1'>&ldquo;Sehat Bersama, Peduli Sesama&rdquo;</p>
              <p className='text-sm text-[#BBDEFB]'>Menyambut Ramadhan 1447 H dengan Olahraga dan Kepedulian</p>
            </div>

            {/* Event Highlights */}
            <div className='flex justify-center gap-6 mt-6'>
              <div className='text-center'>
                <div className='w-12 h-12 mx-auto bg-[#BBDEFB] rounded-full flex items-center justify-center mb-2'>
                  <MapPin className='h-6 w-6 text-[#0D47A1]' />
                </div>
                <p className='text-xs text-gray-600'>Masjid Al Muhajirin</p>
              </div>
              <div className='text-center'>
                <div className='w-12 h-12 mx-auto bg-[#BBDEFB] rounded-full flex items-center justify-center mb-2'>
                  <Clock className='h-6 w-6 text-[#0D47A1]' />
                </div>
                <p className='text-xs text-gray-600'>06.00 - 09.30 WIB</p>
              </div>
              <div className='text-center'>
                <div className='w-12 h-12 mx-auto bg-[#BBDEFB] rounded-full flex items-center justify-center mb-2'>
                  <Target className='h-6 w-6 text-[#0D47A1]' />
                </div>
                <p className='text-xs text-gray-600'>Jarak 3 Km</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='text-center pb-6 mt-8'>
            <div className='bg-[#F8FAFC] rounded-2xl p-5 border border-[#BBDEFB]'>
              <h3 className='text-lg font-bold text-[#0D47A1] mb-1'>PANITIA RUN-MADAN 2026</h3>
              <p className='text-[#1565C0] font-semibold'>TAKMIR MASJID AL-MUHAJIRIN REWWIN</p>
              <div className='flex items-center justify-center gap-2 mt-2 text-sm text-gray-600'>
                <MapPin className='h-4 w-4 text-[#1976D2]' />
                <span>Jl. Rajawali No. 207 REWWIN, Waru, Sidoarjo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== HALAMAN 2: LATAR BELAKANG & GAMBARAN KEGIATAN ========== */}
      <div className='a4-page page-break relative overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute top-0 right-0 w-40 h-40 bg-[#BBDEFB] rounded-full opacity-20 blur-3xl'></div>
        <div className='absolute bottom-20 left-0 w-48 h-48 bg-[#90CAF9] rounded-full opacity-15 blur-3xl'></div>
        <div className='absolute top-1/3 -right-8 w-24 h-24 bg-[#1976D2] rounded-full opacity-15 blur-2xl'></div>
        <div className='absolute bottom-1/3 -left-8 w-32 h-32 bg-[#0D47A1] rounded-full opacity-10 blur-2xl'></div>

        {/* Header Bar */}
        <div className='relative z-10 flex items-center gap-3 mb-5 pb-3 border-b-2 border-[#BBDEFB]'>
          <div className='w-1.5 h-8 bg-gradient-to-b from-[#1976D2] to-[#0D47A1] rounded-full'></div>
          <h2 className='text-2xl font-bold text-[#0D47A1]'>Latar Belakang & Gambaran Kegiatan</h2>
        </div>

        {/* Latar Belakang */}
        <div className='relative z-10 mb-5'>
          <div className='flex items-center gap-2 mb-3'>
            <div className='p-2 rounded-lg bg-[#BBDEFB]'>
              <Heart className='h-5 w-5 text-[#0D47A1]' />
            </div>
            <h3 className='text-lg font-bold text-[#0D47A1]'>Latar Belakang</h3>
          </div>

          <div className='text-gray-700 leading-relaxed space-y-3 text-sm text-justify'>
            <p>
              <span className='font-semibold text-[#0D47A1]'>Run-Madan 2026</span> merupakan kegiatan{' '}
              <span className='font-semibold'>lari santai dan edukasi kesehatan</span> yang diselenggarakan oleh Masjid Al Muhajirin dalam rangka
              menyambut bulan suci Ramadhan 1447 H.
            </p>
            <p>
              Kegiatan ini <span className='font-semibold'>bukan event lomba</span>, melainkan{' '}
              <span className='font-semibold text-[#0D47A1]'>media edukasi dan sosialisasi layanan kesehatan masyarakat</span>, khususnya
              memperkenalkan keberadaan dan fungsi <span className='font-semibold'>Layanan Poliklinik Gratis</span> serta{' '}
              <span className='font-semibold'>Ambulans Sosial Gratis</span> yang melayani warga REWWIN (RW 6, RW 8, RW 9) dan sekitarnya.
            </p>
          </div>
        </div>

        {/* Tujuan Kegiatan */}
        <div className='relative z-10 mb-5'>
          <div className='flex items-center gap-2 mb-3'>
            <div className='p-2 rounded-lg bg-[#BBDEFB]'>
              <Target className='h-5 w-5 text-[#0D47A1]' />
            </div>
            <h3 className='text-lg font-bold text-[#0D47A1]'>Tujuan Kegiatan</h3>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='flex items-start gap-2 p-3 bg-white rounded-lg border border-[#BBDEFB]'>
              <CheckCircle className='h-4 w-4 text-[#4CAF50] flex-shrink-0 mt-0.5' />
              <p className='text-xs text-gray-700'>Memperkenalkan layanan poliklinik dan ambulans gratis kepada warga</p>
            </div>
            <div className='flex items-start gap-2 p-3 bg-white rounded-lg border border-[#BBDEFB]'>
              <CheckCircle className='h-4 w-4 text-[#4CAF50] flex-shrink-0 mt-0.5' />
              <p className='text-xs text-gray-700'>Membuka kesempatan warga untuk berdonasi pada layanan kesehatan</p>
            </div>
            <div className='flex items-start gap-2 p-3 bg-white rounded-lg border border-[#BBDEFB]'>
              <CheckCircle className='h-4 w-4 text-[#4CAF50] flex-shrink-0 mt-0.5' />
              <p className='text-xs text-gray-700'>Edukasi kesehatan berbasis aktivitas fisik ringan (lari santai)</p>
            </div>
            <div className='flex items-start gap-2 p-3 bg-white rounded-lg border border-[#BBDEFB]'>
              <CheckCircle className='h-4 w-4 text-[#4CAF50] flex-shrink-0 mt-0.5' />
              <p className='text-xs text-gray-700'>Menguatkan interaksi positif antara masjid dan warga sekitar</p>
            </div>
          </div>
        </div>

        {/* Rangkaian Kegiatan */}
        <div className='relative z-10 bg-gradient-to-r from-[#0D47A1] to-[#1565C0] rounded-2xl p-4 mb-5'>
          <h4 className='font-bold text-white mb-3 flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-white' />
            <span className='text-white'>Rangkaian Kegiatan Pra-Ramadhan (8 Februari 2026)</span>
          </h4>
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-white/20 rounded-xl p-3'>
              <p className='font-semibold text-sm text-white'>Run-Madan (Lari Santai)</p>
              <p className='text-xs text-[#BBDEFB] mt-1'>06.00 - 08.00 WIB | Jarak 3 Km</p>
              <p className='text-xs text-[#90CAF9] mt-1'>Fun run ramah pemula (peserta boleh berjalan kaki)</p>
            </div>
            <div className='bg-white/20 rounded-xl p-3'>
              <p className='font-semibold text-sm text-white'>Senam Sehat Bersama</p>
              <p className='text-xs text-[#BBDEFB] mt-1'>06.30 - 09.00 WIB | Lapangan Al Muhajirin</p>
              <p className='text-xs text-[#90CAF9] mt-1'>Senam kesehatan warga dan peserta</p>
            </div>
          </div>
          <div className='mt-3 bg-white/10 rounded-lg p-2'>
            <p className='text-xs text-white text-center'>
              Dilanjutkan dengan <span className='font-semibold'>Sesi Edukasi Kesehatan</span> dan <span className='font-semibold'>Booth UMKM</span>
            </p>
          </div>
        </div>

        {/* Sasaran Peserta */}
        <div className='relative z-10'>
          <div className='flex items-center gap-2 mb-3'>
            <div className='p-2 rounded-lg bg-[#BBDEFB]'>
              <Users className='h-5 w-5 text-[#0D47A1]' />
            </div>
            <h3 className='text-lg font-bold text-[#0D47A1]'>Target Peserta & Pengunjung</h3>
          </div>

          <div className='grid grid-cols-4 gap-2 text-center'>
            <div className='p-3 bg-[#F8FAFC] rounded-lg border border-[#BBDEFB]'>
              <p className='text-2xl font-bold text-[#0D47A1]'>100+</p>
              <p className='text-xs text-gray-600'>Peserta Fun Run/Walk</p>
            </div>
            <div className='p-3 bg-[#F8FAFC] rounded-lg border border-[#BBDEFB]'>
              <p className='text-2xl font-bold text-[#0D47A1]'>100+</p>
              <p className='text-xs text-gray-600'>Peserta Senam</p>
            </div>
            <div className='p-3 bg-[#F8FAFC] rounded-lg border border-[#BBDEFB]'>
              <p className='text-2xl font-bold text-[#0D47A1]'>500+</p>
              <p className='text-xs text-gray-600'>Pengunjung</p>
            </div>
            <div className='p-3 bg-[#F8FAFC] rounded-lg border border-[#BBDEFB]'>
              <p className='text-2xl font-bold text-[#0D47A1]'>3</p>
              <p className='text-xs text-gray-600'>RW Dilalui</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== HALAMAN 3: PAKET SPONSORSHIP ========== */}
      <div className='a4-page page-break relative overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute top-8 left-0 w-36 h-36 bg-[#BBDEFB] rounded-full opacity-15 blur-3xl'></div>
        <div className='absolute bottom-16 right-0 w-44 h-44 bg-[#90CAF9] rounded-full opacity-15 blur-3xl'></div>
        <div className='absolute top-1/2 right-0 w-28 h-28 bg-[#1976D2] rounded-full opacity-10 blur-2xl'></div>
        <div className='absolute bottom-1/4 -left-6 w-24 h-24 bg-[#0D47A1] rounded-full opacity-10 blur-2xl'></div>

        {/* Header Bar */}
        <div className='relative z-10 flex items-center gap-3 mb-5 pb-3 border-b-2 border-[#BBDEFB]'>
          <div className='w-1.5 h-8 bg-gradient-to-b from-[#1976D2] to-[#0D47A1] rounded-full'></div>
          <h2 className='text-2xl font-bold text-[#0D47A1]'>Paket Sponsorship</h2>
        </div>

        {/* Sponsorship Packages */}
        <div className='relative z-10 space-y-4 mb-5'>
          {sponsorshipPackages.map((pkg) => (
            <div key={pkg.id} className='border-2 border-[#BBDEFB] rounded-2xl overflow-hidden'>
              <div className={`bg-gradient-to-r ${pkg.color} p-4 flex items-center justify-between`}>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-white/20 rounded-lg'>
                    <pkg.icon className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h4 className='font-bold text-white text-lg'>{pkg.name}</h4>
                    <p className='text-white/80 text-sm'>{pkg.details}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>{formatRupiah(pkg.price)}</p>
                </div>
              </div>
              <div className='p-4 bg-white'>
                <p className='text-xs font-semibold text-gray-500 mb-2'>BENEFIT:</p>
                <ul className='grid grid-cols-2 gap-2'>
                  {pkg.benefits.map((benefit, idx) => (
                    <li key={idx} className='flex items-start gap-2 text-sm text-gray-700'>
                      <CheckCircle className='h-4 w-4 text-[#4CAF50] flex-shrink-0 mt-0.5' />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== HALAMAN 4: HAK & KEWAJIBAN + RUTE ========== */}
      <div className='a4-page page-break relative overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute top-12 right-0 w-40 h-40 bg-[#BBDEFB] rounded-full opacity-15 blur-3xl'></div>
        <div className='absolute bottom-24 left-0 w-48 h-48 bg-[#90CAF9] rounded-full opacity-15 blur-3xl'></div>
        <div className='absolute top-1/3 -left-8 w-28 h-28 bg-[#1976D2] rounded-full opacity-10 blur-2xl'></div>
        <div className='absolute bottom-1/2 right-0 w-32 h-32 bg-[#0D47A1] rounded-full opacity-10 blur-2xl'></div>

        {/* Header Bar */}
        <div className='relative z-10 flex items-center gap-3 mb-5 pb-3 border-b-2 border-[#BBDEFB]'>
          <div className='w-1.5 h-8 bg-gradient-to-b from-[#1976D2] to-[#0D47A1] rounded-full'></div>
          <h2 className='text-2xl font-bold text-[#0D47A1]'>Ketentuan Sponsorship</h2>
        </div>

        {/* Ketentuan Sponsor */}
        <div className='relative z-10 mb-5'>
          <div className='grid grid-cols-2 gap-4'>
            {/* Sponsor Rupiah */}
            <div className='border-2 border-[#4CAF50] rounded-2xl overflow-hidden'>
              <div className='bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] p-3'>
                <div className='flex items-center gap-2'>
                  <Banknote className='h-5 w-5 text-white' />
                  <h4 className='font-bold text-white'>Sponsor dalam Bentuk Rupiah</h4>
                </div>
              </div>
              <div className='p-4 bg-white'>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2 text-sm text-gray-700'>
                    <CheckCircle className='h-4 w-4 text-[#4CAF50] flex-shrink-0 mt-0.5' />
                    <span>
                      Mendapatkan <span className='font-semibold'>fasilitas booth/stan GRATIS</span>
                    </span>
                  </li>
                  <li className='flex items-start gap-2 text-sm text-gray-700'>
                    <CheckCircle className='h-4 w-4 text-[#4CAF50] flex-shrink-0 mt-0.5' />
                    <span>Lokasi stan strategis di area kegiatan</span>
                  </li>
                  <li className='flex items-start gap-2 text-sm text-gray-700'>
                    <CheckCircle className='h-4 w-4 text-[#4CAF50] flex-shrink-0 mt-0.5' />
                    <span>Bebas menjual produk atau promosi</span>
                  </li>
                  <li className='flex items-start gap-2 text-sm text-gray-700'>
                    <CheckCircle className='h-4 w-4 text-[#4CAF50] flex-shrink-0 mt-0.5' />
                    <span>Mendapat sertifikat apresiasi sponsor</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sponsor Produk */}
            <div className='border-2 border-[#FF9800] rounded-2xl overflow-hidden'>
              <div className='bg-gradient-to-r from-[#FF9800] to-[#E65100] p-3'>
                <div className='flex items-center gap-2'>
                  <Package className='h-5 w-5 text-white' />
                  <h4 className='font-bold text-white'>Sponsor dalam Bentuk Produk</h4>
                </div>
              </div>
              <div className='p-4 bg-white'>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2 text-sm text-gray-700'>
                    <CheckCircle className='h-4 w-4 text-[#FF9800] flex-shrink-0 mt-0.5' />
                    <span>
                      <span className='font-semibold'>Tidak</span> mendapat fasilitas booth/stan
                    </span>
                  </li>
                  <li className='flex items-start gap-2 text-sm text-gray-700'>
                    <CheckCircle className='h-4 w-4 text-[#FF9800] flex-shrink-0 mt-0.5' />
                    <span>
                      Produk dimasukkan ke <span className='font-semibold'>goodybag peserta</span>
                    </span>
                  </li>
                  <li className='flex items-start gap-2 text-sm text-gray-700'>
                    <CheckCircle className='h-4 w-4 text-[#FF9800] flex-shrink-0 mt-0.5' />
                    <span>Flier/brosur sponsor dapat disertakan</span>
                  </li>
                  <li className='flex items-start gap-2 text-sm text-gray-700'>
                    <CheckCircle className='h-4 w-4 text-[#FF9800] flex-shrink-0 mt-0.5' />
                    <span>Mendapat sertifikat apresiasi sponsor</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Rute Lari */}
        <div className='relative z-10'>
          <div className='flex items-center gap-2 mb-3'>
            <div className='p-2 rounded-lg bg-[#BBDEFB]'>
              <MapPin className='h-5 w-5 text-[#0D47A1]' />
            </div>
            <h3 className='text-lg font-bold text-[#0D47A1]'>Rute Lari Run-Madan (3 Km)</h3>
          </div>

          <div className='bg-[#F8FAFC] rounded-2xl p-4 border border-[#BBDEFB]'>
            <div className='flex gap-4'>
              <div className='flex-1'>
                <Image
                  src='/images/masjid/events/denah-rute-lari.jpg'
                  alt='Denah Rute Lari Run-Madan'
                  width={350}
                  height={250}
                  className='rounded-xl object-cover w-full'
                />
              </div>
              <div className='w-1/3'>
                <p className='text-sm text-gray-700 mb-3'>
                  Rute melalui <span className='font-semibold'>RW 6, RW 8, dan RW 9</span> area REWWIN, menjamin eksposur maksimal kepada warga
                  sekitar.
                </p>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                    <span>Start & Finish: Masjid Al Muhajirin</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                    <span>Checkpoint: Area RW 8</span>
                  </div>
                </div>
                <p className='text-xs text-gray-500 mt-3 italic'>* Rute masih dalam konfirmasi final</p>
              </div>
            </div>
          </div>
        </div>

        {/* Jersey Run-Madan */}
        <div className='relative z-10 mt-5'>
          <div className='flex items-center gap-2 mb-3'>
            <div className='p-2 rounded-lg bg-[#BBDEFB]'>
              <Shirt className='h-5 w-5 text-[#0D47A1]' />
            </div>
            <h3 className='text-lg font-bold text-[#0D47A1]'>Jersey Run-Madan 2026</h3>
          </div>

          <div className='bg-[#F8FAFC] rounded-2xl p-4 border border-[#BBDEFB]'>
            <div className='flex gap-6 items-center'>
              <div className='flex-shrink-0'>
                <Image
                  src='/images/masjid/events/kaos-run-madan-2.jpeg'
                  alt='Jersey Run-Madan 2026'
                  width={200}
                  height={200}
                  className='rounded-xl object-cover'
                />
              </div>
              <div className='flex-1'>
                <p className='text-sm text-gray-700 mb-3'>
                  Desain jersey resmi Run-Madan 2026. Logo sponsor akan ditempatkan dengan{' '}
                  <span className='font-semibold'>profesional dan estetis</span>.
                </p>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <CheckCircle className='h-4 w-4 text-[#4CAF50]' />
                    <span>
                      Ukuran logo sponsor: <span className='font-semibold'>10 cm x 10 cm</span>
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <CheckCircle className='h-4 w-4 text-[#4CAF50]' />
                    <span>Posisi strategis dan terlihat jelas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== HALAMAN 5: PENUTUP & KONTAK ========== */}
      <div className='a4-page relative overflow-hidden'>
        {/* Decorative Elements */}
        <div className='absolute top-12 right-0 w-40 h-40 bg-[#BBDEFB] rounded-full opacity-15 blur-3xl'></div>
        <div className='absolute bottom-24 left-0 w-48 h-48 bg-[#90CAF9] rounded-full opacity-15 blur-3xl'></div>
        <div className='absolute top-1/3 -left-8 w-28 h-28 bg-[#1976D2] rounded-full opacity-10 blur-2xl'></div>
        <div className='absolute bottom-1/2 right-0 w-32 h-32 bg-[#0D47A1] rounded-full opacity-10 blur-2xl'></div>

        {/* Header Bar */}
        <div className='relative z-10 flex items-center gap-3 mb-4 pb-2 border-b-2 border-[#BBDEFB]'>
          <div className='w-1.5 h-8 bg-gradient-to-b from-[#1976D2] to-[#0D47A1] rounded-full'></div>
          <h2 className='text-2xl font-bold text-[#0D47A1]'>Penutup & Informasi Kontak</h2>
        </div>

        {/* Ajakan Sponsorship */}
        <div className='relative z-10 bg-gradient-to-br from-[#0D47A1] to-[#1565C0] rounded-2xl p-4 mb-4'>
          <h3 className='text-lg font-bold text-white mb-2'>Mari Bergabung Menjadi Sponsor Run-Madan 2026!</h3>
          <p className='text-[#BBDEFB] leading-relaxed text-sm'>
            Dengan menjadi sponsor Run-Madan 2026, Anda tidak hanya mendapatkan eksposur brand yang optimal kepada ratusan peserta dan pengunjung,
            tetapi juga turut berkontribusi dalam kegiatan sosial dan edukasi kesehatan masyarakat.
          </p>
          <div className='mt-2 flex items-center gap-3 text-sm text-white'>
            <Award className='h-5 w-5 text-[#90CAF9]' />
            <span>Setiap sponsor akan mendapat sertifikat apresiasi dan dokumentasi kegiatan</span>
          </div>
        </div>

        {/* Keuntungan Sponsor */}
        <div className='relative z-10 mb-4'>
          <h4 className='font-bold text-[#0D47A1] mb-2'>Mengapa Menjadi Sponsor Run-Madan?</h4>
          <div className='grid grid-cols-3 gap-2'>
            <div className='p-2 bg-[#F8FAFC] rounded-xl border border-[#BBDEFB] text-center'>
              <Users className='h-6 w-6 text-[#1976D2] mx-auto mb-1' />
              <p className='text-sm font-semibold text-[#0D47A1]'>Eksposur Luas</p>
              <p className='text-xs text-gray-600'>500+ peserta & pengunjung</p>
            </div>
            <div className='p-2 bg-[#F8FAFC] rounded-xl border border-[#BBDEFB] text-center'>
              <Heart className='h-6 w-6 text-[#E91E63] mx-auto mb-1' />
              <p className='text-sm font-semibold text-[#0D47A1]'>Nilai Sosial</p>
              <p className='text-xs text-gray-600'>Mendukung kesehatan warga</p>
            </div>
            <div className='p-2 bg-[#F8FAFC] rounded-xl border border-[#BBDEFB] text-center'>
              <Store className='h-6 w-6 text-[#4CAF50] mx-auto mb-1' />
              <p className='text-sm font-semibold text-[#0D47A1]'>Akses Pasar</p>
              <p className='text-xs text-gray-600'>Komunitas REWWIN & sekitar</p>
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className='relative z-10 bg-white border-2 border-[#1976D2] rounded-2xl p-4 mb-4'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 rounded-lg bg-[#BBDEFB]'>
              <Phone className='h-5 w-5 text-[#0D47A1]' />
            </div>
            <h3 className='text-lg font-bold text-[#0D47A1]'>Informasi & Pendaftaran Sponsor</h3>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-gradient-to-r from-[#BBDEFB]/30 to-[#90CAF9]/20 rounded-xl p-3'>
              <p className='font-semibold text-[#0D47A1] mb-1'>Contact Person:</p>
              <div className='space-y-1'>
                <div className='flex items-center gap-2 text-sm'>
                  <Phone className='h-4 w-4 text-[#1976D2]' />
                  <span>+62 887-3303-012 (Panitia)</span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <Phone className='h-4 w-4 text-[#1976D2]' />
                  <span>+62 812-2334-3416 (Bendahara)</span>
                </div>
              </div>
            </div>
            <div className='bg-gradient-to-r from-[#BBDEFB]/30 to-[#90CAF9]/20 rounded-xl p-3'>
              <p className='font-semibold text-[#0D47A1] mb-1'>Transfer Sponsorship:</p>
              <p className='text-sm font-semibold text-[#0066AE]'>Bank BRI</p>
              <p className='text-lg font-bold text-[#0D47A1]'>0211.01.004859.53.6</p>
              <p className='text-sm text-gray-600'>a/n. Al Muhajirin Rewwin</p>
            </div>
          </div>
        </div>

        {/* Penutup */}
        <div className='relative z-10 mb-3'>
          <p className='text-gray-700 leading-relaxed text-sm text-justify'>
            Demikian proposal sponsorship ini kami sampaikan. Atas perhatian, kepercayaan, dan partisipasi Bapak/Ibu dalam mendukung kegiatan
            Run-Madan 2026, kami mengucapkan <span className='font-semibold text-[#0D47A1]'>Jazakumullahu Khairan Katsiran</span>. Semoga Allah SWT
            membalas setiap kebaikan dengan pahala yang berlipat ganda.
          </p>
        </div>

        {/* Tanda Tangan */}
        <div className='relative z-10 border-t-2 border-[#BBDEFB] pt-3'>
          <p className='text-sm text-gray-600 mb-3'>Sidoarjo, Januari 2026</p>

          <div className='grid grid-cols-2 gap-8'>
            <div className='text-center'>
              <p className='text-sm text-gray-600 mb-10'>
                Ketua Yayasan
                <br />
                Al Muhajirin Rewwin
              </p>
              <p className='font-bold text-[#0D47A1] border-t border-gray-300 pt-2'>H. CAHYO HUSNI TAMRIN, ST, MM</p>
            </div>
            <div className='text-center'>
              <p className='text-sm text-gray-600 mb-10'>
                Ketua Panitia Run-Madan 2026
                <br />
                Masjid Al Muhajirin Rewwin
              </p>
              <p className='font-bold text-[#0D47A1] border-t border-gray-300 pt-2'>ARIF BUDI SANTOSO</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='relative z-10 mt-4 pt-2 border-t border-[#BBDEFB]'>
          <div className='flex items-center justify-center gap-6 text-xs text-gray-500'>
            <div className='flex items-center gap-1'>
              <MapPin className='h-3 w-3' />
              <span>Jl. Rajawali No. 207 REWWIN, Waru, Sidoarjo</span>
            </div>
            <div className='flex items-center gap-1'>
              <Phone className='h-3 w-3' />
              <span>+62 887-3303-012</span>
            </div>
            <div className='flex items-center gap-1'>
              <Mail className='h-3 w-3' />
              <span>masjid.muhajirinrewwin.or.id</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
