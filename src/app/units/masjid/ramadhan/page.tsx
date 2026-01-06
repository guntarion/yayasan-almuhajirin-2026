// src/app/units/masjid/ramadhan/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import {
  Heart,
  Target,
  Users,
  BookOpen,
  Sparkles,
  TrendingUp,
  HandHeart,
  Calendar,
  CheckCircle,
  DollarSign,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  Moon,
  Sunrise,
  Star,
  Gift,
  Utensils,
  Radio,
  Trophy,
  School,
} from 'lucide-react';

export default function RamadhanPage() {
  const [copied, setCopied] = React.useState(false);

  const handleWhatsAppClick = () => {
    window.open(
      'https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20berdonasi%20untuk%20Program%20Ramadhan%201447H',
      '_blank'
    );
  };

  const handleCopyRekening = () => {
    navigator.clipboard.writeText('7195656578');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const programs = [
    {
      icon: Moon,
      title: 'Ibadah Inti Harian',
      subtitle: 'Sholat Tarawih & Ceramah Shubuh',
      description: 'Keterlaksanaan semua sesi (30 hari Tarawih dan harian Subuh) sesuai jadwal dan ketersediaan penceramah.',
      target: 'Sukses (100% Sesuai Jadwal)',
      color: 'from-[#9C27B0] to-[#6A1B9A]',
      activities: [
        'Sholat Tarawih 20 rakaat setiap malam',
        'Ceramah ba\'da Shubuh setiap pagi',
        'Doa bersama setiap malam',
      ],
    },
    {
      icon: Sunrise,
      title: 'Ibadah Intensif',
      subtitle: 'Tadarrus & Qiyamul Lail',
      description: 'Keterlaksanaan Tadarrus Ba\'da Tarawih, Sholat Tasbih, dan Sholat Tahajud (Qiyamul Lail) sesuai agenda yang ditetapkan.',
      target: 'Sukses (100% Terlaksana)',
      color: 'from-[#FF9800] to-[#E65100]',
      activities: [
        'Tadarrus Al-Qur\'an ba\'da Tarawih',
        'Sholat Tasbih setiap Jumat malam',
        'Qiyamul Lail 10 malam terakhir',
      ],
    },
    {
      icon: School,
      title: 'Program Pra-Ramadhan & Edukasi',
      subtitle: 'Kerja Bakti, Tarhib, Lomba-lomba',
      description: 'Keterlaksanaan semua program Pra-Ramadhan (Kerja Bakti) dan Lomba-lomba Tarhib sesuai jadwal dan ketentuan.',
      target: 'Sukses (100% Terlaksana)',
      color: 'from-[#4CAF50] to-[#2E7D32]',
      activities: [
        'Kerja bakti bersih-bersih masjid',
        'Tarhib Ramadhan & kultum',
        'Lomba adzan, kaligrafi, hafalan',
      ],
    },
    {
      icon: Utensils,
      title: 'Pelayanan Sosial & Logistik',
      subtitle: 'Takjil & Sahur Bersama',
      description: 'Ketersediaan Takjil harian (30 hari) dan fasilitas Sahur Bersama di 10 hari terakhir yang memenuhi standar kebersihan, logistik, dan dilaksanakan bersamaan dengan mekanisme PDM.',
      target: 'Sukses (Tersedia Setiap Hari)',
      color: 'from-[#00BCD4] to-[#006064]',
      activities: [
        'Takjil gratis setiap sore (30 hari)',
        'Sahur bersama 10 malam terakhir',
        'Pendataan jamaah (Proyek Data Masjid)',
      ],
    },
    {
      icon: Radio,
      title: 'Program Sosial Media',
      subtitle: 'Ramadhan on Air',
      description: 'Keterlaksanaan program Ramadhan on Air (tadarus di Suara Muslim Surabaya). Koordinasi dengan pihak penyiaran (radio), peserta terpenuhi, ontime.',
      target: 'Sukses (100% Terlaksana)',
      color: 'from-[#E91E63] to-[#AD1457]',
      activities: [
        'Tadarus on air di radio',
        'Konten digital Ramadhan',
        'Live streaming kajian',
      ],
    },
    {
      icon: Gift,
      title: 'Pengelolaan ZIS',
      subtitle: 'Zakat, Sedekah, Bingkisan',
      description: 'Ketersediaan tim amil, administrasi dan audit laporan yang rapi, serta penyaluran Zakat/Bingkisan tepat waktu (sebelum Sholat Idul Fitri).',
      target: 'Sukses (Audit Laporan 100% Jelas)',
      color: 'from-[#FFB300] to-[#FF6F00]',
      activities: [
        'Penerimaan zakat fitrah',
        'Penyaluran tepat waktu',
        'Bingkisan Idul Fitri',
      ],
    },
  ];

  const budgetIncome = [
    { label: 'Infaq Taraweh', amount: 50000000 },
    { label: 'Infaq Takjil/Ifthar', amount: 54400000 },
    { label: 'Infaq Sholat Idul Fitri', amount: 10000000 },
    { label: 'Infaq Sahur Qiyamul Lail', amount: 7000000 },
    { label: 'Infaq dari Ustadz', amount: 3500000 },
    { label: 'Infaq Tadarrus', amount: 2800000 },
    { label: 'Infaq Nuzulul Qur\'an', amount: 1500000 },
    { label: 'Lain-lain', amount: 2900000 },
  ];

  const budgetExpense = [
    { category: 'Bisyaroh', amount: 29800000, color: '#9C27B0' },
    { category: 'Konsumsi', amount: 70250000, color: '#00BCD4' },
    { category: 'Perlengkapan', amount: 5020000, color: '#FF9800' },
    { category: 'Event', amount: 6052500, color: '#4CAF50' },
    { category: 'Lain-lain', amount: 2860000, color: '#E91E63' },
  ];

  const totalIncome = budgetIncome.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = budgetExpense.reduce((sum, item) => sum + item.amount, 0);
  const projectedBalance = totalIncome - totalExpense;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const objectives = [
    {
      icon: Heart,
      title: 'Meningkatkan Ketakwaan',
      description: 'Meningkatkan kualitas keimanan dan ibadah individu seluruh jamaah mencapai derajat Taqwa.',
    },
    {
      icon: Users,
      title: 'Mempererat Ukhuwah',
      description: 'Mempererat persaudaraan (Ukhuwah Islamiyah) dan meningkatkan kepedulian sosial.',
    },
    {
      icon: Target,
      title: 'Optimasi Fungsi Masjid',
      description: 'Mengoptimalkan fungsi masjid sebagai pusat edukasi, spiritual, dan kontribusi sosial.',
    },
  ];

  const timeline = [
    {
      phase: 'Pra-Ramadhan',
      date: '25 Feb - 28 Feb 2026',
      items: ['Kerja Bakti', 'Tarhib Ramadhan', 'Persiapan Panitia'],
    },
    {
      phase: 'Ramadhan 1-10',
      date: '1 Mar - 10 Mar 2026',
      items: ['Tarawih & Ceramah', 'Takjil Harian', 'Tadarrus'],
    },
    {
      phase: 'Ramadhan 11-20',
      date: '11 Mar - 20 Mar 2026',
      items: ['Nuzulul Qur\'an', 'Lomba-lomba', 'Ramadhan on Air'],
    },
    {
      phase: 'Ramadhan 21-30',
      date: '21 Mar - 30 Mar 2026',
      items: ['Qiyamul Lail', 'Sahur Bersama', 'Pengumpulan Zakat'],
    },
    {
      phase: 'Pasca Ramadhan',
      date: '31 Mar - 2 Apr 2026',
      items: ['Sholat Idul Fitri', 'Bingkisan', 'Halal Bihalal'],
    },
  ];

  const gallery = [
    { src: '/images/masjid/lomba-adzan.jpg', alt: 'Lomba Adzan Ramadhan' },
    { src: '/images/masjid/lomba-kaligrafi-anak.jpg', alt: 'Lomba Kaligrafi Anak' },
    { src: '/images/masjid/pelatihan-kaligrafi.jpeg', alt: 'Pelatihan Kaligrafi' },
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
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-medium">1 Ramadhan 1447 H - 1 Syawal 1447 H</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Ramadhan 1447 H
                <span className="block text-[#80DEEA] text-3xl md:text-4xl mt-2">
                  MADRASAH KITA
                </span>
              </h1>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <p className="text-xl md:text-2xl text-white font-semibold mb-2">
                  Membangun PRIBADI TAQWA
                </p>
                <p className="text-xl md:text-2xl text-[#B2EBF2] font-semibold">
                  Mewujudkan Kontribusi MULIA
                </p>
              </div>

              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Masjid Muhajirin Rewwin menghadirkan program Ramadhan yang terstruktur dan terukur
                untuk menjadikan bulan suci ini sebagai madrasah pembentukan ketakwaan dan kontribusi nyata bagi umat.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <HandHeart className="h-5 w-5" />
                  <span>Donasi Sekarang</span>
                </button>
                <a
                  href="#program"
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-[#006064] px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Lihat Program</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/logo-masjid-almuhajirin.jpg"
                  alt="Masjid Al Muhajirin Ramadhan"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#006064]/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-2xl font-bold">Masjid Al Muhajirin Rewwin</p>
                  <p className="text-sm text-white/90 mt-2">Pusat Pembinaan Umat & Silaturahmi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-6 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#006064]">30</div>
              <div className="text-sm text-[#00838F]">Hari Penuh Berkah</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#006064]">6</div>
              <div className="text-sm text-[#00838F]">Program Utama</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#006064]">250+</div>
              <div className="text-sm text-[#00838F]">Jamaah Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#006064]">100%</div>
              <div className="text-sm text-[#00838F]">Target Sukses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">Latar Belakang</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ramadhan: Madrasah Terbaik
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Bulan Suci Ramadhan adalah momentum agung yang dinantikan oleh seluruh umat Muslim,
                di mana pintu rahmat dan maghfirah Allah dibuka lebar-lebar. Ramadhan adalah{' '}
                <strong>Madrasah terbaik</strong> untuk menempa kualitas diri dan meningkatkan ketakwaan.
              </p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                Masjid Muhajirin Rewwin, sebagai Pusat Pembinaan Umat dan simpul utama silaturahmi
                di lingkungan Perumahan REWWIN, Kec. Waru, Kab. Sidoarjo, memikul tanggung jawab besar
                untuk memfasilitasi setiap jamaah dalam meraih keutamaan bulan ini.
              </p>

              <div className="bg-gradient-to-r from-[#00BCD4]/5 to-[#006064]/5 rounded-2xl p-6 md:p-8 my-8">
                <p className="text-[#006064] text-lg md:text-xl font-semibold mb-4">
                  Panitia Ramadhan 1447 H bertekad:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4CAF50] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      Menjadikan masjid sebagai institusi yang memberikan solusi dan mengoptimalkan potensi jamaah
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4CAF50] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <strong>Membangun Pribadi Taqwa</strong> adalah proses yang harus berlanjut (istiqomah) di 11 bulan berikutnya
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4CAF50] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <strong>Mewujudkan Kontribusi Mulia</strong> adalah hasil jangka panjang yang memiliki dampak positif
                      bagi kemajuan umat Islam (terutama dalam aspek ekonomi dan sosial yang berlipat ganda)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#4CAF50]/10 text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">Tujuan Kegiatan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tujuan Program Ramadhan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tiga pilar utama yang menjadi fokus program Ramadhan 1447 H
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {objectives.map((obj, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10 flex items-center justify-center mb-4 group-hover:from-[#00BCD4] group-hover:to-[#006064] transition-all duration-300">
                  <obj.icon className="h-8 w-8 text-[#00BCD4] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{obj.title}</h3>
                <p className="text-gray-600 leading-relaxed">{obj.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#006064] to-[#00838F] rounded-2xl p-6 md:p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
                <Sparkles className="h-6 w-6 mr-3 text-white" />
                Tujuan Khusus Panitia
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#80DEEA]" />
                  <div>
                    <p className="font-semibold">Penyediaan Sarana Madrasah Optimal</p>
                    <p className="text-[#B2EBF2] text-sm mt-1">
                      Memastikan semua program kegiatan Ramadhan terlaksana dengan kualitas tinggi
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#80DEEA]" />
                  <div>
                    <p className="font-semibold">Penciptaan Database Komprehensif (Proyek Data Masjid)</p>
                    <p className="text-[#B2EBF2] text-sm mt-1">
                      Menghasilkan database kontak, kehadiran, dan potensi jamaah untuk program DKM pasca-Ramadhan
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <HandHeart className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#80DEEA]" />
                  <div>
                    <p className="font-semibold">Optimasi Dampak Multiplier (Kontribusi Mulia)</p>
                    <p className="text-[#B2EBF2] text-sm mt-1">
                      Memetakan minat dan kompetensi jamaah untuk kemakmuran Masjid di masa mendatang
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="program" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#9C27B0]/10 text-[#6A1B9A] px-4 py-2 rounded-full mb-6">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">Program Kegiatan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              6 Program Operasional Utama
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rangkaian program terstruktur untuk memaksimalkan ibadah dan kebersamaan di bulan Ramadhan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`h-2 bg-gradient-to-r ${program.color}`}></div>
                <div className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${program.color} flex items-center justify-center mb-4`}>
                    <program.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-sm font-semibold text-[#00BCD4] mb-3">{program.subtitle}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{program.description}</p>

                  <div className="space-y-2 mb-4">
                    {program.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-[#4CAF50] mr-2 mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`px-3 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r ${program.color} text-center`}>
                    Target: {program.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Timeline Kegiatan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jadwal Program Ramadhan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tahapan kegiatan dari pra-Ramadhan hingga pasca Ramadhan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {timeline.map((phase, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{phase.phase}</h3>
                      <p className="text-sm text-gray-500 mt-1">{phase.date}</p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10 text-[#006064]">
                        Fase {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {phase.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-gray-700 text-sm bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <CheckCircle className="h-4 w-4 text-[#4CAF50] mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Budget Transparency Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#4CAF50]/10 text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Transparansi Keuangan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rencana Anggaran & Belanja
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pengelolaan dana yang transparan dan akuntabel untuk kesuksesan program Ramadhan
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-2xl p-6 text-white">
                <p className="text-sm text-white/80 mb-2">Total Rencana Pemasukan</p>
                <p className="text-3xl font-bold">{formatRupiah(totalIncome)}</p>
              </div>
              <div className="bg-gradient-to-br from-[#FF9800] to-[#E65100] rounded-2xl p-6 text-white">
                <p className="text-sm text-white/80 mb-2">Total Rencana Pengeluaran</p>
                <p className="text-3xl font-bold">{formatRupiah(totalExpense)}</p>
              </div>
              <div className="bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-2xl p-6 text-white">
                <p className="text-sm text-white/80 mb-2">Proyeksi Saldo</p>
                <p className="text-3xl font-bold">{formatRupiah(projectedBalance)}</p>
              </div>
            </div>

            {/* Detailed Budget */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Income */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 text-[#4CAF50] mr-3" />
                  Rencana Pemasukan
                </h3>
                <div className="space-y-3">
                  {budgetIncome.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700 text-sm">{item.label}</span>
                      <span className="font-semibold text-gray-900">{formatRupiah(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-3 bg-[#4CAF50]/5 rounded-lg px-3 mt-4">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-[#4CAF50] text-lg">{formatRupiah(totalIncome)}</span>
                  </div>
                </div>
              </div>

              {/* Expense */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <HandHeart className="h-6 w-6 text-[#FF9800] mr-3" />
                  Rencana Pengeluaran
                </h3>
                <div className="space-y-4">
                  {budgetExpense.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{item.category}</span>
                        <span className="font-semibold text-gray-900">{formatRupiah(item.amount)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(item.amount / totalExpense) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-3 bg-[#FF9800]/5 rounded-lg px-3 mt-4">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-[#FF9800] text-lg">{formatRupiah(totalExpense)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-8 bg-[#00BCD4]/5 rounded-2xl p-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Catatan:</strong> Anggaran ini merupakan proyeksi berdasarkan pengalaman tahun sebelumnya.
                Realisasi akan disesuaikan dengan kebutuhan aktual dan infaq yang terkumpul. Laporan keuangan lengkap
                akan dipublikasikan setelah Ramadhan berakhir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#FFB300]/10 text-[#FF8F00] px-4 py-2 rounded-full mb-6">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">Galeri Kegiatan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dokumentasi Ramadhan Sebelumnya
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Momen-momen berharga dari kegiatan Ramadhan tahun lalu
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {gallery.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-semibold">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Mari Bersama Memakmurkan Ramadhan
              </h2>
              <p className="text-[#B2EBF2] text-lg">
                Setiap infaq Anda adalah investasi pahala yang akan terus mengalir sepanjang bulan Ramadhan.
                Mari bersama mewujudkan program Ramadhan yang berkah dan bermanfaat.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <div className="space-y-4 mb-6">
                  {[
                    'Program Tarawih & Ceramah setiap malam',
                    'Takjil gratis untuk 250+ jamaah',
                    'Sahur bersama 10 malam terakhir',
                    'Qiyamul Lail & program edukasi',
                    'Penyaluran zakat & bingkisan',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#80DEEA] mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Konfirmasi Donasi</span>
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-white/80 text-sm mb-2">Transfer Donasi ke:</p>
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
                <p className="text-white/60 text-xs text-center mt-4">
                  Setelah transfer, mohon konfirmasi via WhatsApp untuk bukti dan doa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-6">
              Jadilah Bagian dari Kesuksesan Ramadhan 1447 H
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Mari bersama menjadikan Ramadhan sebagai madrasah untuk membangun pribadi taqwa
              dan mewujudkan kontribusi mulia bagi umat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <HandHeart className="h-5 w-5" />
                <span>Donasi via WhatsApp</span>
              </button>
              <a
                href="/units/masjid"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Kembali ke Masjid</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
