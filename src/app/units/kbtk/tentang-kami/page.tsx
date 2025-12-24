// src/app/units/kbtk/tentang-kami/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Target,
  Eye,
  CheckCircle,
  Award,
  Building2,
  Users,
  BookOpen,
  Shield,
  Sparkles,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

export default function TentangKamiPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20KBTK%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const misi = [
    'Menjadikan sekolah berkualitas',
    'Berdakwah melalui dunia pendidikan',
    'Menjadikan lembaga yang bermanfaat untuk lingkungan sekitar',
    'Menumbuhkan fitrah anak agar cinta kepada Allah SWT dan Rasul-Nya melalui aktivitas yang menyenangkan',
    'Membangun dan membiasakan perilaku yang mencerminkan akhlak karimah',
    'Menyelenggarakan pendidikan dan pengajaran untuk mengembangkan seluruh aspek perkembangan anak secara optimal',
    'Menciptakan dan menyiapkan lingkungan sebagai sumber belajar yang menarik, aman, nyaman, dan ramah anak',
    'Menjalin kemitraan dengan orang tua untuk pengasuhan bersama agar pendidikan di sekolah dan di rumah selaras',
  ];

  const tujuan = [
    { icon: Heart, text: 'Cinta kepada Allah SWT dan Rasul-Nya' },
    { icon: BookOpen, text: 'Terbiasa membaca dan mencintai Al-Qur\'an' },
    { icon: Award, text: 'Memiliki perilaku dan akhlak yang Islami' },
    { icon: Users, text: 'Tertanam dasar-dasar kepemimpinan (leadership) sejak usia dini' },
    { icon: Sparkles, text: 'Senang belajar dan bermain sehingga tumbuh kembang optimal' },
    { icon: Shield, text: 'Menjadi anak yang percaya diri dan mandiri' },
    { icon: Target, text: 'Siap melanjutkan pendidikan ke jenjang selanjutnya' },
  ];

  const fasilitas = [
    { name: 'Ruang Kelas ber-AC', description: 'Ruang belajar nyaman dan kondusif' },
    { name: 'Lapangan Olahraga', description: 'Area luas untuk aktivitas fisik' },
    { name: 'Masjid', description: 'Fasilitas ibadah untuk sholat berjamaah' },
    { name: 'Kolam Renang', description: 'Untuk program renang dan aktivitas air' },
    { name: 'CCTV', description: 'Sistem keamanan untuk memantau kegiatan' },
    { name: 'Poliklinik', description: 'Layanan kesehatan untuk siswa' },
    { name: 'Area Parkir Luas', description: 'Tempat parkir yang aman' },
    { name: 'Ruangan Serba Guna', description: 'Untuk berbagai kegiatan dan acara' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("/images/kbtk/kegiatan/kbtk-front-01.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Tentang Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              KBTK Al Muhajirin Rewwin
            </h1>
            <p className="text-lg text-[#B2EBF2]">
              Lembaga pendidikan anak usia dini dengan metode BCCT dan pendekatan Islami Montessori
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tentang KBTK Al Muhajirin
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Day Care, Kelompok Bermain, dan Taman Kanak-Kanak (KBTK) Al Muhajirin Rewwin adalah
                lembaga pendidikan anak usia dini yang berdedikasi untuk membimbing generasi masa
                depan yang berakidah mantap, berakhlak karimah, dan mampu mengembangkan potensinya
                secara optimal.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dengan komitmen untuk menjadi sekolah berkualitas dan bermanfaat bagi lingkungan
                sekitar, kami menerapkan metode pembelajaran inovatif <strong>Beyond Centra and Circle
                Time (BCCT)</strong> dengan pendekatan <strong>Islami Montessori</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Pendekatan ini dirancang untuk menstimulasi seluruh aspek perkembangan anak—mulai
                dari sensorimotor, kognitif, bahasa, hingga sosial-emosional—dalam lingkungan yang
                nyaman, aman, dan menyenangkan.
              </p>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/kbtk/kegiatan/kbtk-front-02.jpg"
                  alt="KBTK Al Muhajirin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="visi-misi" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vision */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-4">
                <Eye className="h-5 w-5" />
                <span className="text-sm font-medium">Visi</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#00BCD4] to-[#006064] rounded-2xl p-8 text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">
                &quot;Membimbing anak beraqidah mantap, berakhlak karimah, dan berprestasi optimal&quot;
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-[#4CAF50]/10 text-[#2E7D32] px-4 py-2 rounded-full mb-4">
                <Target className="h-5 w-5" />
                <span className="text-sm font-medium">Misi</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {misi.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-[#4CAF50]">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Motto */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-[#FFB300] to-[#FF8F00] rounded-2xl p-8 text-center">
              <p className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wider">Motto</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                &quot;Berakhlak, Berilmu, dan Kreatif&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">Tujuan Pendidikan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Membimbing Siswa-Siswi Kami
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tujuan.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-2xl hover:bg-[#00BCD4]/5 transition-colors group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#00BCD4] to-[#006064] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-700 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="fasilitas" className="py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-full mb-4">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Fasilitas</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fasilitas Sekolah
            </h2>
            <p className="text-[#B2EBF2] max-w-2xl mx-auto">
              Fasilitas lengkap untuk mendukung proses belajar mengajar yang kondusif dan menyenangkan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fasilitas.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-colors"
              >
                <CheckCircle className="h-8 w-8 text-[#80DEEA] mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-[#B2EBF2] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-6">
              Ingin Mengetahui Lebih Lanjut?
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Hubungi kami untuk informasi lebih lanjut atau jadwalkan kunjungan ke sekolah kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi via WhatsApp</span>
              </button>
              <Link
                href="/kontak"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Lihat Kontak & Lokasi</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
