// src/app/units/masjid/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Heart,
  Users,
  Clock,
  Calendar,
  MapPin,
  ArrowRight,
  MessageCircle,
  Star,
  CheckCircle,
  Newspaper,
  HandHeart,
  Copy,
  Check,
} from 'lucide-react';

export default function MasjidPage() {
  const [copied, setCopied] = React.useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Masjid%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const handleCopyRekening = () => {
    navigator.clipboard.writeText('7195656578');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kajianSchedule = [
    {
      day: 'Sabtu',
      time: "Ba'da Subuh",
      title: 'Kitab Riyadhus Shalihin',
      ustadz: 'Ust. H. Ma\'ruf Nur Salam, LC.',
      color: 'from-[#00BCD4] to-[#006064]',
    },
    {
      day: 'Ahad',
      time: "Ba'da Subuh",
      title: 'Aqidah',
      ustadz: 'Ust. H. M. Nur Yasin Zain, LC.',
      color: 'from-[#4CAF50] to-[#2E7D32]',
    },
    {
      day: 'Ahad',
      time: "Ba'da Maghrib",
      title: 'TARJIM (Belajar Menterjemahkan Al-Qur\'an)',
      ustadz: 'Ust. H. M. Sya\'roni, M.Pd.I.',
      color: 'from-[#9C27B0] to-[#6A1B9A]',
    },
    {
      day: 'Selasa',
      time: "Ba'da Maghrib",
      title: 'TAHSIN (Belajar Memperbaiki Bacaan Al-Qur\'an)',
      ustadz: 'Ust. M. Ramdhani, SP. MM.',
      color: 'from-[#FF9800] to-[#E65100]',
    },
    {
      day: 'Rabu',
      time: "Ba'da Maghrib",
      title: 'Tadabbur Al-Qur\'an',
      ustadz: 'Ust. H. Nur Halim, M.Pd.',
      color: 'from-[#00BCD4] to-[#006064]',
    },
    {
      day: 'Kamis',
      time: "Ba'da Subuh",
      title: 'Kajian Tematik',
      ustadz: 'Ust. H. Asmara Tambunan',
      color: 'from-[#4CAF50] to-[#2E7D32]',
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Kajian Rutin',
      description: 'Kajian harian dengan berbagai tema, dari tahsin hingga tafsir Al-Qur\'an.',
    },
    {
      icon: Users,
      title: 'Sholat Berjamaah',
      description: 'Lima waktu sholat berjamaah dengan imam yang fasih dan khusyuk.',
    },
    {
      icon: HandHeart,
      title: 'Jumat Berkah',
      description: 'Program pembagian nasi bungkus setiap Jumat untuk jamaah dan masyarakat.',
    },
    {
      icon: Heart,
      title: 'Poliklinik Gratis',
      description: 'Layanan kesehatan gratis setiap Selasa dan Jumat pukul 09.00 WIB.',
    },
    {
      icon: Calendar,
      title: 'Program PHBI',
      description: 'Peringatan Hari Besar Islam: Isra Mi\'raj, Ramadhan, Idul Adha, Maulid Nabi.',
    },
    {
      icon: Star,
      title: 'Pembinaan Muallaf',
      description: 'Ikrar masuk Islam dan pembinaan berkelanjutan bagi muallaf.',
    },
  ];

  const stats = [
    { value: '5x', label: 'Sholat Berjamaah' },
    { value: '6+', label: 'Kajian Rutin/Minggu' },
    { value: '250+', label: 'Jamaah Aktif' },
    { value: '24', label: 'Jam Buka Masjid' },
  ];

  const galleryImages = [
    { src: '/images/masjid/tahsin.jpeg', alt: 'Kajian Tahsin' },
    { src: '/images/masjid/lomba-adzan.jpg', alt: 'Lomba Adzan' },
    { src: '/images/masjid/pelatihan-kaligrafi.jpeg', alt: 'Pelatihan Kaligrafi' },
    { src: '/images/masjid/almuhajirin-berkisah.jpg', alt: 'Al Muhajirin Berkisah' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-[#006064] via-[#00838F] to-[#00BCD4]">
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
                Masjid Al Muhajirin
                <span className="block text-[#80DEEA]">Rewwin</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Memakmurkan masjid melalui <strong>kajian rutin</strong>, <strong>program dakwah</strong>,
                dan <strong>pelayanan umat</strong>. Bersama membangun jamaah yang beriman, berilmu, dan beramal shalih.
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
                  href="/kajian"
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-[#006064] px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Jadwal Kajian</span>
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

            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/masjid/tahsin.jpeg"
                  alt="Masjid Al Muhajirin"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#006064]/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-lg font-semibold">Kajian Tahsin</p>
                  <p className="text-sm text-white/80">Belajar memperbaiki bacaan Al-Qur&apos;an</p>
                </div>
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 max-w-[200px]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Buka 24 Jam</p>
                    <p className="text-xs text-gray-500">Untuk Ibadah</p>
                  </div>
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
              <Clock className="h-5 w-5" />
              <span className="font-medium">Poliklinik Gratis: Selasa & Jumat, 09.00 WIB</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-[#006064]/30"></div>
            <div className="flex items-center space-x-2">
              <HandHeart className="h-5 w-5" />
              <span className="font-medium">Jumat Berkah: Pembagian Nasi Bungkus</span>
            </div>
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
                <span className="text-sm font-medium">Tentang Ketakmiran</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Memakmurkan Masjid, Membangun Umat
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Unit Ketakmiran Masjid Al Muhajirin menjalankan dua fungsi utama:
                <strong> Idharah (manajemen)</strong> untuk pengelolaan sehari-hari masjid, dan
                <strong> Imarah (memakmurkan)</strong> untuk menyusun dan melaksanakan berbagai program keagamaan.
              </p>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Kami berkomitmen membentuk komunitas masjid yang solid melalui kegiatan yang
                meningkatkan kebersamaan dan ukhuwah islamiyah.
              </p>

              <div className="space-y-4">
                {[
                  'Kajian rutin harian dengan ustadz berpengalaman',
                  'Sholat berjamaah 5 waktu dengan imam yang fasih',
                  'Program Jumat Berkah untuk masyarakat',
                  'Layanan poliklinik gratis',
                  'Pembinaan muallaf dan penghijrah',
                ].map((item, index) => (
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
                      src="/images/masjid/tadarus-senin.jpeg"
                      alt="Tadarus"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/masjid/almuhajirin-berkisah.jpg"
                      alt="Al Muhajirin Berkisah"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/masjid/pelatihan-kaligrafi.jpeg"
                      alt="Pelatihan Kaligrafi"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/masjid/lomba-adzan.jpg"
                      alt="Lomba Adzan"
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

      {/* Kajian Schedule Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Jadwal Kajian</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kajian Rutin Mingguan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hadirilah kajian rutin untuk menambah ilmu dan mendekatkan diri kepada Allah SWT
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kajianSchedule.map((kajian, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`h-2 bg-gradient-to-r ${kajian.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${kajian.color}`}>
                      {kajian.day}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {kajian.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{kajian.title}</h3>
                  <p className="text-gray-600 text-sm flex items-center">
                    <Users className="h-4 w-4 mr-2 text-[#00BCD4]" />
                    {kajian.ustadz}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/kajian"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Lihat Detail Kajian</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#4CAF50]/10 text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">Program Unggulan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan & Program Masjid
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai program dan layanan untuk memakmurkan masjid dan melayani umat
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

      {/* Donation Section */}
      <section className="py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                  <HandHeart className="h-5 w-5" />
                  <span className="text-sm font-medium">Infaq & Donasi</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Mari Berinfaq untuk Kemakmuran Masjid
                </h2>
                <p className="text-[#B2EBF2] mb-6">
                  Setiap infaq Anda akan digunakan untuk operasional masjid, program kajian,
                  dan berbagai kegiatan sosial untuk umat.
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Konfirmasi Infaq</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-white/80 text-sm mb-2">Transfer ke:</p>
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Image
                      src="/images/Logo-Yayasan-AlMuhajirin.png"
                      alt="BSI"
                      width={60}
                      height={30}
                      className="object-contain"
                    />
                    <span className="text-sm text-gray-500">Bank BSI</span>
                  </div>
                  <p className="text-2xl font-bold text-[#006064]">719.5656.578</p>
                  <p className="text-sm text-gray-600">a/n. Infaq Masjid Al-Muhajirin Rewwin</p>
                </div>
                <button
                  onClick={handleCopyRekening}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  <span>{copied ? 'Nomor Rekening Tersalin!' : 'Salin Nomor Rekening'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#FFB300]/10 text-[#FF8F00] px-4 py-2 rounded-full mb-6">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">Galeri</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dokumentasi Kegiatan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Momen-momen berharga dari berbagai kegiatan masjid
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium">{image.alt}</p>
                </div>
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

      {/* Articles Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
              <Newspaper className="h-5 w-5" />
              <span className="text-sm font-medium">Artikel & Berita</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Informasi Terkini
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berita dan artikel seputar kegiatan masjid
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/artikel"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Lihat Semua Artikel</span>
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
              Mari Bersama Memakmurkan Masjid
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Setiap langkah ke masjid adalah pahala. Hadirilah kajian rutin,
              sholat berjamaah, dan jadilah bagian dari jamaah yang aktif.
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
                href="/kontak"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Lokasi & Kontak</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
