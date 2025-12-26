// src/app/units/lazmu/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  GraduationCap,
  Stethoscope,
  Users,
  Quote,
  ArrowRight,
  CheckCircle2,
  Phone,
  CreditCard,
  QrCode,
  Truck,
  Shield,
  Building2,
  Target,
  Award,
  Ambulance,
  MessageCircle,
} from 'lucide-react';

export default function LazmuPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281223343416?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20LAZ%20Muhajirin', '_blank');
  };

  const programs = [
    {
      icon: GraduationCap,
      title: 'Beasiswa Pendidikan',
      description: 'Memberikan beasiswa kepada siswa kurang mampu untuk melanjutkan pendidikan.',
      target: '40 siswa/tahun',
      color: 'bg-blue-500',
    },
    {
      icon: Ambulance,
      title: 'Ambulance Gratis',
      description: 'Layanan ambulance gratis untuk masyarakat yang membutuhkan, tersedia 24 jam.',
      target: 'Call: 081-55-4444-576',
      color: 'bg-red-500',
    },
    {
      icon: Stethoscope,
      title: 'Poliklinik Gratis',
      description: 'Layanan kesehatan gratis meliputi pemeriksaan dan pengobatan dasar.',
      target: 'Selasa & Jumat',
      color: 'bg-green-500',
    },
    {
      icon: Users,
      title: 'Khitan Ceria',
      description: 'Program khitan massal gratis untuk anak-anak kurang mampu setiap tahun.',
      target: '75 peserta/tahun',
      color: 'bg-purple-500',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Amanah & Transparan',
      description: 'Pengelolaan dana ZISWAF secara akuntabel dengan laporan berkala kepada donatur.',
    },
    {
      icon: Award,
      title: 'Terafiliasi Resmi',
      description: 'Mitra resmi LAZNAS Dewan Da\'wah Islamiyah Indonesia dengan legalitas jelas.',
    },
    {
      icon: Target,
      title: 'Program Terpadu',
      description: 'Program komprehensif meliputi pendidikan, kesehatan, sosial, dan dakwah.',
    },
    {
      icon: Building2,
      title: 'Berbasis Komunitas',
      description: 'Beroperasi di tengah jamaah Masjid Al Muhajirin dengan kedekatan langsung.',
    },
  ];

  const donationMethods = [
    {
      icon: CreditCard,
      title: 'Transfer Bank',
      description: 'Bank Muamalat',
      detail: '707.000.7500',
    },
    {
      icon: QrCode,
      title: 'QRIS',
      description: 'Scan & Pay',
      detail: 'Semua E-Wallet',
    },
    {
      icon: Truck,
      title: 'Jemput Zakat',
      description: 'Layanan Antar',
      detail: '0812-2334-3416',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="absolute inset-0 bg-[url('/images/pattern-islamic.png')] opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                <Shield className="h-5 w-5 text-[#FFB300]" />
                <span className="text-sm font-medium">Mitra LAZNAS Dewan Da&apos;wah Jawa Timur</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                Bersihkan Harta,<br />
                <span className="text-[#FFB300]">Berbagi Sesama</span>
              </h1>
              <p className="text-lg md:text-xl text-[#C8E6C9] mb-8 leading-relaxed">
                Salurkan Zakat, Infaq, dan Sedekah Anda melalui LAZ Muhajirin - Lembaga Amil Zakat
                terpercaya yang telah melayani umat sejak berdirinya Masjid Al Muhajirin Rewwin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/donasi"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FFB300] to-[#FFC107] hover:from-[#FFA000] hover:to-[#FFB300] text-gray-900 px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Heart className="h-6 w-6" />
                  <span>Tunaikan Zakat Sekarang</span>
                </Link>
                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                  <span>Jadwalkan Jemput Zakat</span>
                </button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#FFB300] to-[#81C784] rounded-full opacity-20 blur-3xl"></div>
                <div className="relative w-80 h-80 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl">
                  <Image
                    src="/images/Logo-LAZ-Muhajirin.jpg"
                    alt="LAZ Muhajirin"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-1 bg-[#4CAF50] rounded"></div>
              <Shield className="h-8 w-8 text-[#4CAF50]" />
              <div className="w-12 h-1 bg-[#4CAF50] rounded"></div>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 italic">
              &quot;Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan
              dan menyucikan mereka...&quot;
            </p>
            <p className="text-[#2E7D32] font-semibold mt-2">— QS. At-Taubah: 103</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#E8F5E9] text-[#2E7D32] px-4 py-2 rounded-full mb-6">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-semibold">Tentang Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                LAZ Muhajirin <span className="text-[#2E7D32]">(LAZMU)</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                LAZ Muhajirin adalah Lembaga Amil Zakat yang beroperasi di bawah naungan
                Yayasan Al Muhajirin Rewwin, Sidoarjo. Sebagai mitra resmi LAZNAS Dewan Da&apos;wah
                Islamiyah Indonesia Provinsi Jawa Timur, LAZMU berkomitmen menghimpun dan
                menyalurkan dana Zakat, Infaq, Sedekah, dan Wakaf (ZISWAF) secara amanah,
                profesional, dan transparan.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-[#4CAF50]" />
                  <span className="text-gray-700">SK NO.001/S.K PENGURUS/MPZ/IX/1446H/2025M</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-[#4CAF50]" />
                  <span className="text-gray-700">Mitra LAZNAS Dewan Da&apos;wah Jawa Timur</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-[#4CAF50]" />
                  <span className="text-gray-700">Beroperasi sesuai regulasi BAZNAS</span>
                </div>
              </div>
              <Link
                href="/tentang-kami"
                className="inline-flex items-center space-x-2 text-[#2E7D32] font-semibold hover:text-[#1B5E20] transition-colors"
              >
                <span>Selengkapnya</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-semibold">Program Unggulan 2025</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Program <span className="text-[#2E7D32]">Kami</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai program sosial dan kemanusiaan yang kami selenggarakan untuk membantu
              sesama dan meningkatkan kesejahteraan umat.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className={`h-2 ${program.color}`}></div>
                <div className="p-6">
                  <div className={`w-16 h-16 ${program.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <program.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-[#2E7D32]">{program.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/program"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Lihat Semua Program</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Methods Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#FFF8E1] text-[#FF8F00] px-4 py-2 rounded-full mb-6">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-semibold">Cara Berdonasi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Salurkan <span className="text-[#FFB300]">Donasi Anda</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai kemudahan untuk menyalurkan zakat, infaq, sedekah, dan wakaf Anda.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {donationMethods.map((method, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <method.icon className="h-10 w-10 text-[#2E7D32]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-2">{method.description}</p>
                <p className="text-2xl font-bold text-[#2E7D32]">{method.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center text-white">
              <div>
                <p className="text-[#A5D6A7] text-sm mb-1">Zakat, Infaq, Sedekah</p>
                <p className="font-bold">Bank Muamalat</p>
                <p className="text-2xl font-mono text-[#FFB300]">707.000.7500</p>
              </div>
              <div>
                <p className="text-[#A5D6A7] text-sm mb-1">Wakaf</p>
                <p className="font-bold">Bank Muamalat</p>
                <p className="text-2xl font-mono text-[#FFB300]">707.000.7498</p>
              </div>
              <div>
                <p className="text-[#A5D6A7] text-sm mb-1">Zakat Maal</p>
                <p className="font-bold">Bank Muamalat</p>
                <p className="text-2xl font-mono text-[#FFB300]">707.000.7499</p>
              </div>
            </div>
            <p className="text-center text-[#A5D6A7] mt-4">a.n. LAZ Muhajirin Rewwin</p>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/donasi"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="h-5 w-5" />
              <span>Donasi Sekarang</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-12 w-12 text-[#FFB300] mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-white italic mb-6">
              &quot;Jadikan Harta Anda Berkah. Tunaikan kewajiban zakat Anda sekarang.
              Setiap rupiah yang Anda salurkan akan menjadi berkah bagi sesama.&quot;
            </blockquote>
            <div className="w-24 h-1 bg-[#FFB300] mx-auto mb-6 rounded"></div>
            <p className="text-[#C8E6C9] text-lg">
              LAZ Muhajirin - Amanah dalam Mengelola, Profesional dalam Menyalurkan
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Jadilah Bagian dari <span className="text-[#2E7D32]">Kebaikan</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Mari bergabung menjadi donatur tetap LAZ Muhajirin Rewwin. Dengan menjadi donatur tetap,
              Anda membantu keberlanjutan program-program sosial kami dan menjadi bagian dari gerakan kepedulian umat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi via WhatsApp</span>
              </button>
              <Link
                href="/donasi"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300"
              >
                <span>Daftar Donatur Tetap</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Ambulance className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ambulance Gratis 24 Jam</h3>
                <p className="text-red-100">Layanan darurat untuk masyarakat</p>
              </div>
            </div>
            <a
              href="tel:081554444576"
              className="flex items-center space-x-2 bg-white text-red-600 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Phone className="h-5 w-5" />
              <span>081-55-4444-576</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
