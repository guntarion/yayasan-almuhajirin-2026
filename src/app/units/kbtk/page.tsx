// src/app/units/kbtk/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  GraduationCap,
  Heart,
  BookOpen,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Calendar,
  Award,
  Sparkles,
  Baby,
  School
} from 'lucide-react';

export default function KBTKPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20KBTK%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const programs = [
    {
      icon: Baby,
      title: 'Day Care',
      age: '1-3 Tahun',
      description: 'Program penitipan anak dengan pengasuhan penuh kasih sayang dan stimulasi perkembangan optimal.',
      color: 'from-pink-500 to-rose-500',
      href: 'https://daycare.almuhajirin.or.id',
      isExternal: true,
    },
    {
      icon: Sparkles,
      title: 'Kelompok Bermain',
      age: '3-4 Tahun',
      description: 'Belajar sambil bermain dengan metode BCCT untuk mengembangkan seluruh aspek perkembangan anak.',
      color: 'from-[#00BCD4] to-[#006064]',
      href: '/program-kurikulum',
      isExternal: false,
    },
    {
      icon: School,
      title: 'TK A & TK B',
      age: '4-6 Tahun',
      description: 'Persiapan menuju jenjang pendidikan selanjutnya dengan kurikulum yang terintegrasi nilai-nilai Islami.',
      color: 'from-[#4CAF50] to-[#2E7D32]',
      href: '/program-kurikulum',
      isExternal: false,
    },
  ];

  const features = [
    {
      icon: Heart,
      title: 'Pendekatan Islami',
      description: 'Menanamkan nilai-nilai Islam dan akhlak mulia sejak dini melalui pembiasaan sehari-hari.',
    },
    {
      icon: BookOpen,
      title: 'Metode BCCT & Montessori',
      description: 'Pembelajaran berbasis sentra dengan pendekatan yang child-centered dan menyenangkan.',
    },
    {
      icon: Users,
      title: 'Guru Berkualitas',
      description: 'Tenaga pendidik berpengalaman dan berdedikasi dengan latar belakang pendidikan yang baik.',
    },
    {
      icon: Award,
      title: 'Fasilitas Lengkap',
      description: 'Ruang kelas ber-AC, kolam renang, masjid, playground, dan fasilitas pendukung lainnya.',
    },
    {
      icon: Calendar,
      title: 'Program Unggulan',
      description: 'Hafalan Juz 30, tari tradisional, musik, renang, cooking class, dan kegiatan menarik lainnya.',
    },
    {
      icon: Star,
      title: 'Kemitraan Orang Tua',
      description: 'Komunikasi terbuka dan program home visit untuk keselarasan pendidikan di sekolah dan rumah.',
    },
  ];

  const stats = [
    { value: '15+', label: 'Tahun Pengalaman' },
    { value: '9', label: 'Guru Berdedikasi' },
    { value: '7', label: 'Sentra Pembelajaran' },
    { value: '100%', label: 'Komitmen Islami' },
  ];

  const galleryImages = [
    { src: '/images/kbtk/kegiatan/kbtk-front-01.jpg', alt: 'KBTK Front' },
    { src: '/images/kbtk/kegiatan/al-muhajirin-anaksholih.jpg', alt: 'Anak Sholih' },
    { src: '/images/kbtk/kegiatan/toddler-gym.jpg', alt: 'Toddler Gym' },
    { src: '/images/kbtk/kegiatan/almuhajirin-using-laptop.jpg', alt: 'Belajar dengan Laptop' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/kbtk/kegiatan/al-muhajirin-hero-welcome2.png"
            alt="KBTK Al Muhajirin Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#006064]/90 via-[#006064]/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-medium">Kelompok Bermain & Taman Kanak-Kanak</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Membimbing Generasi
              <span className="block text-[#80DEEA]">Berakhlak & Berprestasi</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              KBTK Al Muhajirin Rewwin - Lembaga pendidikan anak usia dini dengan metode
              <strong> Beyond Centra and Circle Time (BCCT)</strong> dan pendekatan
              <strong> Islami Montessori</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi Kami</span>
              </button>
              <Link
                href="/pendaftaran"
                className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-[#006064] px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Info Pendaftaran</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#80DEEA]">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Motto & Vision Section */}
      <section className="py-16 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-[#006064] mb-2 uppercase tracking-wider">Motto Kami</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-4">
              &quot;Berakhlak, Berilmu, dan Kreatif&quot;
            </h2>
            <p className="text-lg text-[#00838F]">
              Membimbing anak beraqidah mantap, berakhlak karimah, dan berprestasi optimal
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
                <Heart className="h-5 w-5" />
                <span className="text-sm font-medium">Tentang Kami</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Lingkungan Aman & Penuh Kasih Sayang untuk Buah Hati Anda
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Di KBTK Al Muhajirin, kami memahami betapa pentingnya menciptakan lingkungan yang
                aman dan penuh kasih sayang bagi anak-anak Anda. Mengedepankan prinsip-prinsip Islami,
                sekolah kami menawarkan suasana yang hangat, mendukung, dan inklusif.
              </p>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Dengan tim profesional yang berdedikasi dan fasilitas yang memadai, kami berkomitmen
                untuk melindungi kebahagiaan serta kesejahteraan anak-anak, sambil mengembangkan
                potensi mereka dalam aspek akademik, sosial, dan emosional.
              </p>

              <div className="space-y-4">
                {['Kurikulum Nasional + Kurikulum Islami', 'Metode BCCT dengan 7 Sentra Pembelajaran', 'Hafalan Juz 30 & Pendidikan Akhlak', 'Fasilitas Lengkap & Lingkungan Aman'].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#4CAF50]" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/tentang-kami"
                className="inline-flex items-center space-x-2 mt-8 text-[#00BCD4] hover:text-[#006064] font-semibold transition-colors"
              >
                <span>Pelajari Lebih Lanjut</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/kbtk/kegiatan/kbtk-front-02.jpg"
                      alt="KBTK Building"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/kbtk/kegiatan/alzaitun-al-muhajirin-01.jpg"
                      alt="Kegiatan Siswa"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/kbtk/kegiatan/two-kids-al-muhajirin.jpg"
                      alt="Siswa KBTK"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/kbtk/kegiatan/almuhajirin-siswi-perkenalkan-kbtk.jpg"
                      alt="Siswi KBTK"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-medium">Program Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jenjang Pendidikan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan program pendidikan untuk berbagai usia, disesuaikan dengan
              tahap perkembangan anak
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`h-2 bg-gradient-to-r ${program.color}`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${program.color} flex items-center justify-center mb-6`}>
                    <program.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-[#00BCD4] mb-2">{program.age}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{program.title}</h3>
                  <p className="text-gray-600 mb-6">{program.description}</p>
                  {program.isExternal ? (
                    <a
                      href={program.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#00BCD4] hover:text-[#006064] font-semibold transition-colors"
                    >
                      <span>Kunjungi Website</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      href={program.href}
                      className="inline-flex items-center text-[#00BCD4] hover:text-[#006064] font-semibold transition-colors"
                    >
                      <span>Selengkapnya</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#4CAF50]/10 text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">Keunggulan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih KBTK Al Muhajirin?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menawarkan pendidikan berkualitas dengan fondasi nilai-nilai Islami yang kuat
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-gray-100 hover:border-[#00BCD4]/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10 flex items-center justify-center mb-4 group-hover:from-[#00BCD4] group-hover:to-[#006064] transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-[#00BCD4] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Preview Section */}
      <section className="py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Tim Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Guru Berkualitas & Berdedikasi
            </h2>
            <p className="text-[#B2EBF2] max-w-2xl mx-auto">
              Di tangan para asatidzah yang berdedikasi, masa depan generasi penerus bangsa insyaAllah terbentuk
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { name: 'Ustadzah Indar', role: 'Kepala Sekolah', image: 'Septina Indarlin.jpg' },
              { name: 'Ustadzah Azmil', role: 'Guru', image: 'Azmil Adibah.jpg' },
              { name: 'Ustadzah Ria', role: 'Guru', image: 'Siti Ruqoiyah.jpg' },
              { name: 'Ustadzah Lilik', role: 'Guru', image: 'Lilik Abidah.jpg' },
              { name: 'Ustadzah Ruroh', role: 'Guru', image: 'Masruroh.jpg' },
            ].map((teacher, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-white/20 group-hover:border-[#80DEEA] transition-colors shadow-lg">
                  <Image
                    src={`/images/kbtk/foto-pengajar/${teacher.image}`}
                    alt={teacher.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 font-semibold text-white">{teacher.name}</h3>
                <p className="text-sm text-[#80DEEA]">{teacher.role}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/tim-pengajar"
              className="inline-flex items-center space-x-2 bg-white hover:bg-gray-100 text-[#006064] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Lihat Semua Pengajar</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#FFB300]/10 text-[#FF8F00] px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Galeri</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Momen Berharga di KBTK Al Muhajirin
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lihat berbagai kegiatan dan aktivitas menyenangkan yang dilakukan siswa-siswi kami
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/galeri"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Lihat Semua Galeri</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-6">
              Siap Memberikan Pendidikan Terbaik untuk Putra-Putri Anda?
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Jangan lewatkan kesempatan untuk memberikan anak Anda awal yang terbaik dalam
              perjalanan pendidikan mereka. Dapatkan asesmen perkembangan anak GRATIS!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Daftar via WhatsApp</span>
              </button>
              <Link
                href="/pendaftaran"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Lihat Info Pendaftaran</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
