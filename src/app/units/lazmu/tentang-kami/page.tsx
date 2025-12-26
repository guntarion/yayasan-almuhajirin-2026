// src/app/units/lazmu/tentang-kami/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  Shield,
  Target,
  Award,
  Eye,
  Compass,
  CheckCircle2,
  FileCheck,
  Users,
  Heart,
  ArrowRight,
  MessageCircle,
  Handshake,
  Scale,
  BookOpen,
} from 'lucide-react';

export default function TentangKamiPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281223343416?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20LAZ%20Muhajirin', '_blank');
  };

  const misi = [
    'Menghimpun dana Zakat, Infaq, Sedekah, dan Wakaf secara halal, legal, dan transparan',
    'Menyalurkan dana ZISWAF kepada mustahik yang berhak secara tepat sasaran',
    'Memberikan layanan kesehatan, pendidikan, dan sosial kemanusiaan kepada masyarakat',
    'Membangun lembaga yang amanah, profesional, dan mudah diakses',
    'Mendukung program dakwah dan pemberdayaan umat di wilayah Sidoarjo dan sekitarnya',
  ];

  const keunggulan = [
    {
      icon: Shield,
      title: 'Amanah & Transparan',
      description: 'Pengelolaan dana ZISWAF secara akuntabel dengan laporan berkala kepada donatur dan masyarakat.',
    },
    {
      icon: Award,
      title: 'Profesional',
      description: 'Dikelola oleh tim yang kompeten dan berpengalaman di bidang pengelolaan zakat.',
    },
    {
      icon: Handshake,
      title: 'Terafiliasi Resmi',
      description: 'Mitra resmi LAZNAS Dewan Da\'wah Islamiyah Indonesia dengan legalitas yang jelas.',
    },
    {
      icon: Users,
      title: 'Akses Mudah',
      description: 'Berbagai channel donasi tersedia: transfer bank, QRIS, dan layanan jemput zakat.',
    },
    {
      icon: Target,
      title: 'Program Terpadu',
      description: 'Program komprehensif meliputi pendidikan, kesehatan, sosial kemanusiaan, dan dakwah.',
    },
    {
      icon: Building2,
      title: 'Berbasis Komunitas',
      description: 'Beroperasi di tengah jamaah Masjid Al Muhajirin dengan kedekatan langsung kepada mustahik.',
    },
  ];

  const legalitas = [
    {
      icon: FileCheck,
      title: 'SK Pengurus',
      value: 'NO.001/S.K PENGURUS/MPZ/IX/1446H/2025M',
    },
    {
      icon: Handshake,
      title: 'Afiliasi',
      value: 'Mitra LAZNAS Dewan Da\'wah Islamiyah Indonesia Provinsi Jawa Timur',
    },
    {
      icon: Scale,
      title: 'Pengawasan',
      value: 'Beroperasi sesuai regulasi BAZNAS dan Kementerian Agama RI',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Tentang Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              LAZ Muhajirin
            </h1>
            <p className="text-lg text-[#C8E6C9]">
              Lembaga Amil Zakat Muhajirin Rewwin - Mitra LAZNAS Dewan Da&apos;wah Islamiyah Indonesia Provinsi Jawa Timur
            </p>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Profil <span className="text-[#2E7D32]">Singkat</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                LAZ Muhajirin (LAZMU) adalah Lembaga Amil Zakat yang beroperasi di bawah naungan
                Yayasan Al Muhajirin Rewwin, Sidoarjo. Sebagai mitra resmi LAZNAS Dewan Da&apos;wah
                Islamiyah Indonesia Provinsi Jawa Timur, LAZMU berkomitmen menghimpun dan
                menyalurkan dana Zakat, Infaq, Sedekah, dan Wakaf (ZISWAF) secara amanah,
                profesional, dan transparan.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Sejak berdirinya Masjid Al Muhajirin Rewwin, LAZ Muhajirin telah menjadi
                bagian integral dalam melayani kebutuhan umat, menghimpun dan menyalurkan
                amanah dari para donatur kepada mereka yang membutuhkan di wilayah Sidoarjo
                dan sekitarnya.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#4CAF50] to-[#81C784] rounded-3xl opacity-20 blur-2xl"></div>
                <div className="relative w-72 h-72 rounded-3xl overflow-hidden border-4 border-[#E8F5E9] shadow-2xl">
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
      </section>

      {/* Legalitas Section */}
      <section id="legalitas" className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <FileCheck className="h-5 w-5" />
              <span className="text-sm font-semibold">Legalitas & Akreditasi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Lembaga <span className="text-[#2E7D32]">Resmi</span> & Terpercaya
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {legalitas.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section id="visi-misi" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Visi */}
            <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-3xl p-8 text-white">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Eye className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Visi</h2>
              </div>
              <p className="text-lg text-[#C8E6C9] leading-relaxed">
                Menjadi lembaga amil zakat terdepan di Sidoarjo yang amanah dalam mengelola
                ZISWAF untuk mendukung dakwah dan kesejahteraan umat.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-[#E8F5E9] rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-xl flex items-center justify-center">
                  <Compass className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Misi</h2>
              </div>
              <ul className="space-y-4">
                {misi.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section id="keunggulan" className="py-16 bg-gradient-to-b from-white to-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#E8F5E9] text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <Award className="h-5 w-5" />
              <span className="text-sm font-semibold">Keunggulan Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa <span className="text-[#2E7D32]">LAZ Muhajirin?</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai keunggulan yang menjadikan LAZ Muhajirin sebagai pilihan tepat
              untuk menyalurkan zakat, infaq, sedekah, dan wakaf Anda.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keunggulan.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Golongan Mustahik */}
      <section className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-semibold">Penerima Zakat</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              8 Golongan <span className="text-[#2E7D32]">Mustahik</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sesuai syariat Islam, ada 8 golongan yang berhak menerima zakat
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              'Fakir',
              'Miskin',
              'Amil',
              'Muallaf',
              'Hamba Sahaya',
              'Gharimin',
              'Fisabilillah',
              'Ibnu Sabil',
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl text-center shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                  {index + 1}
                </div>
                <p className="font-semibold text-gray-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Siap Menyalurkan <span className="text-[#2E7D32]">ZISWAF Anda?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tunaikan zakat, infaq, sedekah, dan wakaf Anda melalui LAZ Muhajirin.
              Amanah dalam mengelola, profesional dalam menyalurkan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi Kami</span>
              </button>
              <Link
                href="/donasi"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300"
              >
                <Heart className="h-5 w-5" />
                <span>Donasi Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
