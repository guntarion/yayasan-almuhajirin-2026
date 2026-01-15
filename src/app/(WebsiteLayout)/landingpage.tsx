// src/app/(WebsiteLayout)/landingpage.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Users,
  Heart,
  BookOpen,
  GraduationCap,
  Baby,
  HandHeart,
  ArrowRight,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Yayasan%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const featuredUnits = [
    {
      icon: Building2,
      title: 'Masjid Al Muhajirin',
      subtitle: 'Unit Ketakmiran',
      description: 'Memakmurkan masjid melalui kajian rutin, program dakwah, dan pelayanan umat. Buka 24 jam dengan 6+ kajian per minggu.',
      features: ['Kajian Rutin', 'Sholat Berjamaah', 'Jumat Berkah', 'Poliklinik Gratis'],
      color: 'from-[#00BCD4] to-[#006064]',
      bgColor: 'bg-[#00BCD4]/10',
      href: 'https://masjid.muhajirinrewwin.or.id',
      contact: '0821-2638-0665',
    },
    {
      icon: Baby,
      title: 'Daycare Al Muhajirin',
      subtitle: 'Tempat Penitipan Anak',
      description: 'Pengasuhan penuh kasih sayang dengan nilai Islami untuk anak usia 3 bulan - 6 tahun. Fasilitas lengkap & tim berpengalaman.',
      features: ['Fullday Care', 'After School', 'Harian', 'Program Islami'],
      color: 'from-[#4CAF50] to-[#2E7D32]',
      bgColor: 'bg-[#4CAF50]/10',
      href: 'https://daycare.muhajirinrewwin.or.id',
      contact: '0813-1466-1918',
    },
    {
      icon: GraduationCap,
      title: 'KBTK Al Muhajirin',
      subtitle: 'Kelompok Bermain & TK',
      description: 'Pendidikan anak usia dini dengan metode BCCT & Montessori Islami. 15+ tahun pengalaman membimbing generasi berakhlak.',
      features: ['Kelompok Bermain', 'TK A & TK B', 'Hafalan Juz 30', '7 Sentra'],
      color: 'from-[#9C27B0] to-[#6A1B9A]',
      bgColor: 'bg-[#9C27B0]/10',
      href: 'https://kbtk.muhajirinrewwin.or.id',
      contact: '+62 812-9235-9103',
    },
    {
      icon: HandHeart,
      title: 'LAZMU',
      subtitle: 'Lembaga Amil Zakat',
      description: 'Pengelolaan zakat, infaq, dan sedekah yang amanah untuk kesejahteraan umat dan program pemberdayaan mustahik.',
      features: ['Zakat', 'Infaq', 'Sedekah', 'Pemberdayaan'],
      color: 'from-[#FFB300] to-[#FF8F00]',
      bgColor: 'bg-[#FFB300]/10',
      href: 'https://lazmu.muhajirinrewwin.or.id',
      contact: '0821-2638-0665',
    },
  ];

  const allUnits = [
    { name: 'Ketakmiran Masjid', icon: Building2 },
    { name: 'Daycare', icon: Baby },
    { name: 'KBTK', icon: GraduationCap },
    { name: 'TPQ', icon: BookOpen },
    { name: 'Remas Cilik', icon: Users },
    { name: 'Kemuslimatan', icon: Heart },
    { name: 'LAZMU', icon: HandHeart },
    { name: 'Poliklinik', icon: Heart },
    { name: 'Ambulans', icon: Heart },
    { name: 'Perawatan Jenazah', icon: Heart },
    { name: 'Kolam Renang', icon: Users },
    { name: 'Usaha & Pengadaan', icon: Building2 },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#006064] via-[#00838F] to-[#00BCD4]">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">Rewwin, Waru, Sidoarjo</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Yayasan
                <span className="block text-[#80DEEA]">Al Muhajirin</span>
                <span className="text-3xl md:text-4xl font-normal">Rewwin</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Lembaga sosial keagamaan yang menaungi berbagai unit bidang <strong>keagamaan</strong>,
                <strong> pendidikan</strong>, dan <strong>kemanusiaan</strong> untuk kesejahteraan umat.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Hubungi Kami</span>
                </button>
                <a
                  href="#units"
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-[#006064] px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Lihat Unit Kami</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="relative hidden lg:flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full"></div>
                <div className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center p-8">
                  <Image
                    src="/images/Logo-YAMR.png"
                    alt="Logo Yayasan Al Muhajirin"
                    width={250}
                    height={250}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="py-6 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 text-[#006064]">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Jl. Rajawali No. 207, Rewwin, Waru</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-[#006064]/30"></div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span className="font-medium">0821-2638-0665</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-[#006064]/30"></div>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span className="font-medium">info@muhajirinrewwin.or.id</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Tentang Yayasan</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Melayani Umat dengan Amanah
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Yayasan Al Muhajirin Rewwin berkedudukan di Jl. Rajawali No. 207, RT 11, RW 06
              Desa Kepuh Kiriman, Kecamatan Waru, Kabupaten Sidoarjo, Provinsi Jawa Timur.
              Kami menaungi berbagai unit yang bergerak di bidang keagamaan, pendidikan, sosial,
              dan kemanusiaan untuk kesejahteraan umat.
            </p>

            {/* Unit Overview Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-12">
              {allUnits.map((unit, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-[#00BCD4]/10 transition-colors group"
                >
                  <unit.icon className="h-6 w-6 text-[#00BCD4] mx-auto mb-2 group-hover:text-[#006064] transition-colors" />
                  <p className="text-xs font-medium text-gray-700 group-hover:text-[#006064] transition-colors">{unit.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Units Section */}
      <section id="units" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#4CAF50]/10 text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Unit Unggulan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unit-Unit Yayasan Al Muhajirin
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai unit yang melayani umat dalam bidang keagamaan, pendidikan, dan kemanusiaan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredUnits.map((unit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${unit.color}`}></div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${unit.color} flex items-center justify-center`}>
                      <unit.icon className="h-8 w-8 text-white" />
                    </div>
                    <a
                      href={unit.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm text-[#00BCD4] hover:text-[#006064] font-medium transition-colors"
                    >
                      <span>Kunjungi</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-[#00BCD4] mb-1">{unit.subtitle}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{unit.title}</h3>
                  </div>

                  <p className="text-gray-600 mb-6">{unit.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {unit.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${unit.bgColor} text-gray-700`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Phone className="h-4 w-4" />
                      <span>{unit.contact}</span>
                    </div>
                    <a
                      href={unit.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-white bg-gradient-to-r ${unit.color} hover:shadow-lg transition-all duration-300 text-sm font-semibold`}
                    >
                      <span>Selengkapnya</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">Misi Kami</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bidang Kegiatan Yayasan
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#00BCD4] flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Keagamaan</h3>
                <p className="text-[#B2EBF2] text-sm">
                  Ketakmiran Masjid, Remas Cilik, Kemuslimatan, dan kegiatan dakwah lainnya
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#4CAF50] flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Pendidikan & Sosial</h3>
                <p className="text-[#B2EBF2] text-sm">
                  Daycare, KBTK, TPQ untuk pendidikan generasi berakhlak mulia
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#FFB300] flex items-center justify-center mx-auto mb-4">
                  <HandHeart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Kemanusiaan</h3>
                <p className="text-[#B2EBF2] text-sm">
                  LAZMU, Ambulans, Perawatan Jenazah, dan Poliklinik untuk pelayanan umat
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-6">
              Mari Bersama Membangun Umat
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Bergabunglah dengan kami dalam berbagai program dan kegiatan untuk kesejahteraan umat.
              Setiap kontribusi Anda sangat berarti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi via WhatsApp</span>
              </button>
              <Link
                href="/dashboard"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Portal Admin</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
