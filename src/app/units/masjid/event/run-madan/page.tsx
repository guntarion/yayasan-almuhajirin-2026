'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Heart,
  Zap,
  Gift,
  Award,
  Target,
  Activity,
  CheckCircle2,
  AlertCircle,
  Phone,
  Share2,
  ArrowRight,
  Wallet,
  Copy,
  Check,
  Baby,
  User,
  Timer,
  Route,
  Sunrise,
  DumbbellIcon,
  HeartPulse,
  Ambulance,
  Building2,
  Star,
  ChevronRight,
} from 'lucide-react';

export default function RunMadanPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);

  // Countdown timer
  useEffect(() => {
    const eventDate = new Date('2026-02-08T05:30:00+07:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('1150014682682');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/6281314073434?text=Halo,%20saya%20ingin%20mendaftar%20Run-Madan%202026', '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Run-Madan 2026',
        text: 'Yuk ikutan Run-Madan 2026! Lari amal menyambut Ramadhan & kenali layanan kesehatan gratis Al Muhajirin',
        url: window.location.href,
      });
    }
  };

  // Event categories data
  const categories = [
    {
      id: '3K',
      name: '3K Kids Run',
      distance: '3 Kilometer',
      icon: Baby,
      participants: 'Anak-anak (Maksimal usia SMP/15 tahun)',
      price: 50000,
      cot: '60 Menit',
      color: 'from-[#72b4d7] to-[#4e8fc0]',
    },
    {
      id: '5K',
      name: '5K Run',
      distance: '5 Kilometer',
      icon: User,
      participants: 'Dewasa (16 tahun ke atas)',
      price: 100000,
      cot: '90 Menit',
      color: 'from-[#4e8fc0] to-[#043e75]',
    },
  ];

  // Unified benefits for all participants
  const allBenefits = [
    'Jersey Run-Madan eksklusif',
    'Race bib dengan nomor unik',
    'Medali finisher (finish di bawah COT)',
    'Sertifikat digital',
    'Doorprize menarik',
    'Goodie bag berisi produk sponsor (5K)',
    'Snack & air mineral',
  ];

  // Race day schedule
  const schedule = [
    { time: '04:30 - 05:15', activity: 'Registrasi Ulang & Pengambilan Race Kit', icon: CheckCircle2 },
    { time: '05:15 - 05:25', activity: 'Senam Pemanasan Bersama', icon: DumbbellIcon },
    { time: '05:15 - 06:00', activity: 'Senam Terapi Kesehatan (Ibu-ibu & Lansia)', icon: HeartPulse },
    { time: '05:30', activity: 'Start 5K Run', icon: Zap },
    { time: '05:35', activity: 'Start 3K Kids Run', icon: Zap },
    { time: '06:30 - 08:00', activity: 'Finisher Area & Refreshment', icon: Gift },
    { time: '08:00 - 08:30', activity: 'Pengumuman Pemenang & Doorprize', icon: Trophy },
    { time: '08:30 - 09:00', activity: 'Foto Bersama & Closing', icon: Award },
  ];

  // Route information
  const routeDetails = [
    {
      icon: MapPin,
      title: 'Start Point',
      description: 'Lapangan Masjid Al Muhajirin Rewwin',
      color: 'from-[#72b4d7] to-[#4e8fc0]',
    },
    {
      icon: Route,
      title: 'Rute Lari',
      description: 'Perumahan Rewwin - Jalur beraspal, aman & nyaman',
      color: 'from-[#4e8fc0] to-[#043e75]',
    },
    {
      icon: Target,
      title: 'Finish Point',
      description: 'Lapangan Masjid Al Muhajirin Rewwin',
      color: 'from-[#043e75] to-[#4e8fc0]',
    },
  ];

  // Charity impact
  const charityImpacts = [
    {
      icon: Ambulance,
      title: 'Layanan Ambulans 24/7',
      description: 'Ambulans gratis 24 jam untuk warga. Dana pendaftaran membantu operasional agar layanan tetap berjalan.',
      color: 'from-[#043e75] to-[#4e8fc0]',
    },
    {
      icon: Building2,
      title: 'Poliklinik Al Muhajirin',
      description: 'Layanan kesehatan gratis untuk semua. Dana pendaftaran mendukung keberlanjutan program ini.',
      color: 'from-[#4e8fc0] to-[#72b4d7]',
    },
    {
      icon: Heart,
      title: 'Program Sosial LAZMU',
      description: 'Sebagian dana mendukung program sosial LAZ Muhajirin untuk masyarakat yang membutuhkan.',
      color: 'from-[#72b4d7] to-[#addbf2]',
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'Apakah ada batas usia untuk mengikuti Run-Madan?',
      answer: 'Kategori 3K untuk anak-anak maksimal usia SMP (15 tahun). Kategori 5K untuk dewasa (16 tahun ke atas). Tidak ada batas usia maksimal, namun peserta harus dalam kondisi sehat dan fit.',
    },
    {
      question: 'Apa yang saya dapatkan setelah mendaftar?',
      answer: 'Peserta akan mendapatkan jersey eksklusif, race bib, medali (jika finish di bawah COT), sertifikat digital, snack, air mineral, dan kesempatan memenangkan doorprize.',
    },
    {
      question: 'Bagaimana cara pendaftaran?',
      answer: 'Pendaftaran dilakukan dengan transfer ke rekening BCA 1150014682682 a.n. Masjid Al Muhajirin. Setelah transfer, konfirmasi via WhatsApp ke 0813-1407-3434 dengan melampirkan bukti transfer dan data peserta.',
    },
    {
      question: 'Apakah ada COT (Cut Off Time)?',
      answer: 'Ya. COT untuk 5K adalah 90 menit, COT untuk 3K adalah 60 menit. Peserta yang finish di bawah COT akan mendapatkan medali finisher.',
    },
    {
      question: 'Bagaimana jika cuaca buruk?',
      answer: 'Event akan tetap berlangsung kecuali kondisi ekstrem yang membahayakan peserta. Pantau info terbaru di WhatsApp group peserta.',
    },
    {
      question: 'Apakah dana pendaftaran bisa dikembalikan?',
      answer: 'Dana pendaftaran tidak dapat dikembalikan (non-refundable) karena telah dialokasikan untuk produksi jersey, medali, dan operasional event.',
    },
    {
      question: 'Untuk apa dana pendaftaran digunakan?',
      answer: 'Dana pendaftaran digunakan untuk operasional event (jersey, medali, dan konsumsi) serta sebagian disalurkan untuk mendukung operasional layanan ambulans dan poliklinik Al Muhajirin yang GRATIS untuk masyarakat, juga program sosial LAZMU. Uang pendaftaran TIDAK digunakan untuk pengadaan hadiah atau doorprize. Layanan kesehatan tetap gratis - donasi sukarela diterima untuk keberlanjutan program.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#043e75] via-[#4e8fc0] to-[#72b4d7] text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#addbf2]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#72b4d7]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-[#4e8fc0]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Event Info */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                <Zap className="h-4 w-4" />
                Tarhib Ramadhan 1447H
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#addbf2]">
                RUN-MADAN
                <span className="block text-3xl md:text-4xl font-bold text-white mt-2">
                  2026
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 font-medium">
                Berlari Sehat, Berbagi Peduli
              </p>
              <p className="text-lg text-white/80">
                Lari Amal Menyambut Ramadhan & Memperkenalkan Layanan Kesehatan Gratis
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">Minggu, 8 Februari 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Start 05:30 WIB</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold">Masjid Al Muhajirin Rewwin</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleWhatsApp}
                  className="bg-white text-[#043e75] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#addbf2] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  Daftar Sekarang
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  Share Event
                </button>
              </div>

              {/* Countdown Timer */}
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-sm font-semibold mb-4 text-[#addbf2] uppercase tracking-wider">
                  Event dimulai dalam:
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Hari', value: timeLeft.days },
                    { label: 'Jam', value: timeLeft.hours },
                    { label: 'Menit', value: timeLeft.minutes },
                    { label: 'Detik', value: timeLeft.seconds },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-2">
                        <div className="text-3xl md:text-4xl font-black">{item.value}</div>
                      </div>
                      <div className="text-xs font-medium text-white/80">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Logo & Image */}
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#addbf2]/40 to-[#72b4d7]/40 rounded-full blur-3xl" />

                {/* Logo container with white gradient background */}
                <div className="relative bg-gradient-to-br from-white via-white to-[#addbf2]/30 rounded-full p-8 shadow-2xl">
                  <Image
                    src="/images/masjid/logo-run-madan.png"
                    alt="Run-Madan 2026 Logo"
                    width={500}
                    height={500}
                    className="w-full h-auto drop-shadow-xl"
                    priority
                  />
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-[#addbf2] text-[#043e75] px-6 py-3 rounded-full font-black text-sm shadow-lg rotate-12">
                  3K & 5K
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-[#043e75] px-6 py-3 rounded-full font-black text-sm shadow-lg -rotate-12 border-2 border-[#043e75]">
                  Charity Run
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Baby, label: '3K', value: 'Untuk Anak', color: 'from-[#72b4d7] to-[#4e8fc0]' },
              { icon: User, label: '5K', value: 'Untuk Dewasa', color: 'from-[#4e8fc0] to-[#043e75]' },
              { icon: Trophy, label: 'Hadiah', value: 'Trophy & Medali', color: 'from-[#addbf2] to-[#72b4d7]' },
              { icon: Heart, label: 'Untuk Amal', value: '50%', color: 'from-[#043e75] to-[#4e8fc0]' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xl font-bold text-gray-900">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Event */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Tentang Run-Madan 2026
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Run-Madan adalah event lari amal yang diselenggarakan oleh <strong>Masjid Al Muhajirin Rewwin</strong> untuk menyambut bulan suci Ramadhan 1447H. Event ini bukan hanya tentang berlari, tetapi juga tentang <strong>solidaritas, kesehatan, dan berbagi kebaikan</strong>.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 bg-[#addbf2]/20 p-6 rounded-xl border-2 border-[#043e75]">
              <strong className="text-[#043e75] text-xl">Lebih dari Sekadar Lari:</strong><br />
              Run-Madan 2026 juga menjadi momentum untuk <strong>memperkenalkan layanan kesehatan gratis</strong> kami kepada seluruh warga Rewwin dan sekitarnya: <strong>Poliklinik Al Muhajirin</strong> dan <strong>Layanan Ambulans 24/7</strong>. Melalui event ini, kami ingin lebih banyak warga mengenal dan memanfaatkan layanan kesehatan yang telah kami sediakan untuk kesejahteraan bersama.
            </p>

            {/* Featured Image */}
            <div className="relative aspect-[16/9] max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl mb-12">
              <Image
                src="/images/masjid/pasangan-lari.jpg"
                alt="Pasangan berlari bersama di Run-Madan"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xl font-bold drop-shadow-lg">Berlari Bersama, Berbagi Kebaikan</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: HeartPulse,
                title: 'Layanan Kesehatan Gratis',
                description: 'Memperkenalkan Poliklinik Al Muhajirin dan Ambulans 24/7 yang gratis untuk seluruh warga Rewwin dan sekitarnya.',
                color: 'from-[#043e75] to-[#4e8fc0]',
              },
              {
                icon: Activity,
                title: 'Gaya Hidup Sehat',
                description: 'Membudayakan olahraga dan hidup sehat menjelang Ramadhan dengan event lari yang fun dan meriah.',
                color: 'from-[#4e8fc0] to-[#72b4d7]',
              },
              {
                icon: Heart,
                title: 'Berbagi Kebaikan',
                description: 'Dana pendaftaran mendukung operasional layanan kesehatan dan program sosial LAZMU untuk kesejahteraan bersama.',
                color: 'from-[#72b4d7] to-[#addbf2]',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Services Programs */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#addbf2] text-[#043e75] px-4 py-2 rounded-full font-semibold mb-4">
              <HeartPulse className="h-5 w-5" />
              Program Layanan Kesehatan
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Kenali Layanan Kesehatan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Run-Madan 2026 adalah kesempatan untuk mengenal lebih dekat layanan kesehatan gratis yang telah kami sediakan untuk warga Rewwin dan sekitarnya
            </p>
          </div>

          {/* Main Health Services */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
            {/* Poliklinik */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#043e75]">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#043e75] to-[#4e8fc0] flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-[#043e75] mb-4">Poliklinik Al Muhajirin</h3>
              <p className="text-gray-700 mb-4">
                Layanan kesehatan umum yang <strong>GRATIS</strong> untuk seluruh warga Rewwin dan sekitarnya.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Pemeriksaan kesehatan umum</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Konsultasi kesehatan dengan dokter</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Pelayanan ramah dan profesional</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Gratis - Donasi Sukarela Diterima</strong></span>
                </li>
              </ul>
            </div>

            {/* Ambulans */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#043e75]">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#4e8fc0] to-[#72b4d7] flex items-center justify-center mb-6">
                <Ambulance className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-[#043e75] mb-4">Layanan Ambulans 24/7</h3>
              <p className="text-gray-700 mb-4">
                Ambulans siaga <strong>24 jam</strong> untuk keadaan darurat warga Rewwin - <strong>GRATIS</strong>.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Siaga 24 jam setiap hari</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Respons cepat untuk keadaan darurat</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Petugas terlatih dan berpengalaman</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Gratis - Donasi Sukarela Diterima</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Special Programs */}
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Data Registration */}
            <div className="bg-gradient-to-br from-[#addbf2] to-white rounded-2xl p-8 border-2 border-[#043e75] shadow-lg">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-[#043e75] flex items-center justify-center flex-shrink-0">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-[#043e75] mb-3">Pendataan Peserta untuk Layanan Kesehatan</h3>
                  <p className="text-gray-700 mb-4">
                    <strong>Setelah event lari selesai</strong>, peserta akan mendapat kesempatan untuk mendaftar dan mendata informasi diri agar lebih mudah dikenali saat menggunakan layanan Poliklinik dan Ambulans di masa mendatang.
                  </p>
                  <div className="bg-white rounded-xl p-4 border border-[#043e75]">
                    <p className="text-sm text-gray-600 mb-2"><strong>Manfaat Pendataan:</strong></p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Rekam medis lebih terorganisir</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Pelayanan lebih cepat saat keadaan darurat</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Notifikasi program kesehatan khusus (lansia, ibu hamil, dll)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Elderly Check-up Program */}
            <div className="bg-gradient-to-br from-white to-[#addbf2]/30 rounded-2xl p-8 border-2 border-[#4e8fc0] shadow-lg">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#4e8fc0] to-[#043e75] flex items-center justify-center flex-shrink-0">
                  <HeartPulse className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-[#043e75] mb-3">Program Check-Up Lansia</h3>
                  <p className="text-gray-700 mb-4">
                    Bagi lansia yang bersedia, kami menawarkan <strong>jadwal kunjungan check-up dan konsultasi kesehatan</strong> rutin di Poliklinik Al Muhajirin.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-[#043e75]">
                      <p className="font-bold text-[#043e75] mb-2">Jadwal Layanan:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#043e75]" />
                          <span>Selasa & Kamis</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#043e75]" />
                          <span>Setiap 3 bulan sekali</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-[#043e75]">
                      <p className="font-bold text-[#043e75] mb-2">Layanan Meliputi:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Pemeriksaan tekanan darah</li>
                        <li>• Pemeriksaan gula darah</li>
                        <li>• Konsultasi kesehatan</li>
                        <li>• Edukasi pola hidup sehat</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-[#addbf2] rounded-lg p-3 text-center">
                    <p className="text-sm font-bold text-[#043e75]">✨ Gratis - Donasi Sukarela Diterima ✨</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aquatic Exercise Program */}
            <div className="bg-gradient-to-br from-[#72b4d7]/20 to-white rounded-2xl p-8 border-2 border-[#72b4d7] shadow-lg">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#72b4d7] to-[#4e8fc0] flex items-center justify-center flex-shrink-0">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-[#043e75] mb-3">Senam Air untuk Ibu-Ibu Lansia</h3>
                  <p className="text-gray-700 mb-4">
                    Program <strong>senam kesehatan di kolam renang</strong> (aqua aerobics/terapi air) khusus untuk ibu-ibu lansia. Aktivitas ini sangat baik untuk melatih dan mempertahankan kekuatan tulang tanpa membebani sendi.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-[#72b4d7]">
                      <p className="font-bold text-[#043e75] mb-2">Detail Program:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Kolam kedalaman maksimal 90 cm</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Lokasi: Kolam Renang Al Muhajirin</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Dipandu instruktur berpengalaman</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-[#72b4d7]">
                      <p className="font-bold text-[#043e75] mb-2">Manfaat Senam Air:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Melatih kekuatan tulang</li>
                        <li>• Tidak membebani sendi</li>
                        <li>• Meningkatkan fleksibilitas</li>
                        <li>• Terapi relaksasi</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-[#72b4d7]/30 rounded-lg p-3 text-center">
                    <p className="text-sm font-bold text-[#043e75]">📋 Pendaftaran Setelah Event Lari Selesai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-br from-[#043e75] to-[#4e8fc0] rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-black mb-4 text-[#addbf2]">Layanan Gratis, Donasi Sukarela Diterima</h3>
            <p className="text-lg text-white/90 mb-6">
              Semua layanan kesehatan kami bersifat <strong>GRATIS</strong> untuk masyarakat. Di sisi lain, kami juga membuka kesempatan bagi siapa saja yang ingin menjadi <strong>donatur tetap</strong> untuk mendukung keberlanjutan program layanan kesehatan ini.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://lazmu.muhajirinrewwin.or.id"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#043e75] px-8 py-3 rounded-xl font-bold hover:bg-[#addbf2] transition-all duration-300 inline-flex items-center gap-2"
              >
                <Heart className="h-5 w-5" />
                Jadi Donatur Tetap
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories - Side by Side */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Pilih Kategorimu
            </h2>
            <p className="text-lg text-gray-600">
              Dua kategori lari untuk semua usia - pilih yang sesuai dengan kemampuanmu!
            </p>
          </div>

          {/* Both Categories Displayed */}
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300`}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{category.name}</h3>
                      <p className="text-lg text-white/90">{category.distance}</p>
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-white text-sm">Peserta:</div>
                        <div className="text-white/90 text-sm">{category.participants}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Wallet className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-white text-sm">Biaya Pendaftaran:</div>
                        <div className="text-3xl font-black text-white">
                          Rp {category.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Timer className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-white text-sm">Cut Off Time (COT):</div>
                        <div className="text-white/90 text-sm">{category.cot}</div>
                      </div>
                    </div>
                  </div>

                  {/* T-Shirt Image */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
                    <Image
                      src="/images/masjid/kaos-ranmadan.png"
                      alt="Jersey Run-Madan"
                      width={300}
                      height={300}
                      className="w-full h-auto rounded-lg"
                    />
                    <p className="text-center text-sm font-semibold text-white mt-2">
                      Jersey Run-Madan Eksklusif
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-white text-[#043e75] px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Phone className="h-5 w-5" />
                    Daftar {category.id}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Unified Benefits Section */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Gift className="h-7 w-7 text-[#043e75]" />
              Yang Kamu Dapatkan:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {allBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Race Day Schedule */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#addbf2] text-[#043e75] px-4 py-2 rounded-full font-semibold mb-4">
              <Sunrise className="h-5 w-5" />
              Race Day Schedule
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Jadwal Hari H
            </h2>
            <p className="text-lg text-gray-600">
              Minggu, 8 Februari 2026 - Mulai pukul 04:30 WIB
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 flex items-center gap-6"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#4e8fc0] to-[#043e75] flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-[#043e75] text-sm mb-1">{item.time}</div>
                    <div className="text-lg font-bold text-gray-900">{item.activity}</div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Special Event: Health Exercise */}
            <div className="mt-8 bg-[#addbf2] rounded-2xl p-8 border-2 border-[#043e75]">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#043e75] flex items-center justify-center flex-shrink-0">
                  <HeartPulse className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 text-[#043e75]">Senam Terapi Kesehatan</h3>
                  <p className="text-gray-700 mb-4">
                    Khusus untuk Ibu-ibu dan Lansia yang ingin tetap aktif tanpa harus berlari.
                    Senam dipandu oleh instruktur profesional dengan gerakan yang menyehatkan dan menyenangkan.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#043e75] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      GRATIS untuk peserta
                    </span>
                    <span className="bg-[#043e75] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Berlangsung selama event
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Route Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Informasi Rute
            </h2>
            <p className="text-lg text-gray-600">
              Rute lari di lingkungan Perumahan Rewwin yang aman dan nyaman
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
            {routeDetails.map((detail, index) => (
              <div
                key={index}
                className="text-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${detail.color} flex items-center justify-center`}>
                  <detail.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{detail.title}</h3>
                <p className="text-gray-600">{detail.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-[#addbf2]/20 rounded-2xl p-8 border border-[#72b4d7]">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-[#043e75]" />
              Detail Rute:
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Permukaan:</strong> Jalan beraspal halus dan rata</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Kontur:</strong> Relatif datar dengan beberapa tanjakan ringan</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Keamanan:</strong> Jalur ditutup untuk kendaraan selama event, dijaga petugas</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Pos Air:</strong> Tersedia di beberapa titik sepanjang rute</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Marshal:</strong> Petugas penunjuk arah di setiap simpang</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Charity Impact */}
      <section className="py-16 bg-gradient-to-br from-[#043e75] via-[#4e8fc0] to-[#72b4d7] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#addbf2]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold mb-4">
              <Heart className="h-5 w-5" />
              Charity Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#addbf2]">
              Dana untuk Kebaikan
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              50% dana pendaftaran disalurkan untuk mendukung operasional layanan kesehatan <strong>GRATIS</strong> dan program sosial masyarakat. Layanan ambulans dan poliklinik tetap gratis - donasi sukarela sangat dihargai untuk keberlanjutan program.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
            {charityImpacts.map((impact, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${impact.color} flex items-center justify-center mb-6`}>
                  <impact.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{impact.title}</h3>
                <p className="text-white/90">{impact.description}</p>
              </div>
            ))}
          </div>

          {/* LAZMU Partnership */}
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Partnership dengan LAZMU</h3>
            <p className="text-white/90 mb-6">
              Run-Madan 2026 didukung oleh <strong>LAZ Muhajirin (LAZMU)</strong>, lembaga zakat terpercaya yang telah berpengalaman dalam penyaluran dana amal untuk masyarakat. Semua layanan kesehatan kami bersifat <strong>GRATIS</strong> - kami sangat menghargai donasi sukarela untuk keberlanjutan program.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://lazmu.muhajirinrewwin.or.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#043e75] px-6 py-3 rounded-xl font-bold hover:bg-[#addbf2] transition-all duration-300"
              >
                Pelajari Lebih Lanjut tentang LAZMU
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Cara Pendaftaran
              </h2>
              <p className="text-lg text-gray-600">
                Ikuti langkah-langkah mudah berikut untuk mendaftar Run-Madan 2026
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-6 mb-12">
              {[
                {
                  step: 1,
                  title: 'Pilih Kategori',
                  description: 'Tentukan kategori yang ingin kamu ikuti: 3K (anak-anak) atau 5K (dewasa)',
                  icon: Route,
                },
                {
                  step: 2,
                  title: 'Transfer Biaya Pendaftaran',
                  description: 'Transfer sesuai kategori ke rekening BCA 1150014682682 a.n. Masjid Al Muhajirin',
                  icon: Wallet,
                },
                {
                  step: 3,
                  title: 'Konfirmasi via WhatsApp',
                  description: 'Kirim bukti transfer + data peserta (nama, usia, kategori, ukuran jersey) ke WhatsApp',
                  icon: Phone,
                },
                {
                  step: 4,
                  title: 'Tunggu Konfirmasi',
                  description: 'Tim panitia akan mengkonfirmasi pendaftaran dan mengirimkan nomor peserta (bib number)',
                  icon: CheckCircle2,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-6 items-start bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#4e8fc0] to-[#043e75] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-black text-white">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="h-6 w-6 text-[#043e75]" />
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bank Account */}
            <div className="bg-[#addbf2] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-[#043e75]">Rekening Pendaftaran</h3>
              <div className="bg-white rounded-xl p-6 border-2 border-[#043e75] mb-6 shadow-lg">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Bank</div>
                    <div className="text-xl font-black text-[#043e75]">BCA</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Nomor Rekening</div>
                    <div className="text-xl font-black text-[#043e75]">1150014682682</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Atas Nama</div>
                    <div className="text-xl font-black text-[#043e75]">Masjid Al Muhajirin</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleCopy}
                  className="bg-white text-[#043e75] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-md"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  {copied ? 'Tersalin!' : 'Salin Nomor Rekening'}
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="bg-[#043e75] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4e8fc0] transition-all duration-300 flex items-center gap-2 shadow-md"
                >
                  <Phone className="h-5 w-5" />
                  Konfirmasi via WhatsApp
                </button>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-8 bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                Informasi Penting:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Pendaftaran ditutup <strong>5 Februari 2026</strong> atau jika kuota terpenuhi</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Jersey dan race kit akan dibagikan saat <strong>registrasi ulang</strong> pada race day</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Biaya pendaftaran <strong>tidak dapat dikembalikan</strong> (non-refundable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Peserta wajib dalam kondisi <strong>sehat dan fit</strong> pada hari H</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-lg text-gray-600">
                Temukan jawaban atas pertanyaan umummu di sini
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isHighlighted = index === faqs.length - 1; // Last FAQ (about dana)
                return (
                  <details
                    key={index}
                    className={`rounded-xl p-6 border-2 hover:shadow-lg transition-all duration-300 group ${
                      isHighlighted
                        ? 'bg-[#addbf2]/30 border-[#043e75]'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <summary className={`font-bold cursor-pointer list-none flex items-center justify-between ${
                      isHighlighted ? 'text-[#043e75]' : 'text-gray-900'
                    }`}>
                      <span className="flex-1">{faq.question}</span>
                      <ChevronRight className={`h-5 w-5 group-open:rotate-90 transition-transform duration-300 ${
                        isHighlighted ? 'text-[#043e75]' : 'text-gray-400'
                      }`} />
                    </summary>
                    <p className={`mt-4 leading-relaxed font-medium ${
                      isHighlighted ? 'text-gray-900' : 'text-gray-600'
                    }`}>{faq.answer}</p>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-[#043e75] via-[#4e8fc0] to-[#72b4d7] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#addbf2]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-[#addbf2]">
            Siap Berlari untuk Kebaikan?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
            Daftarkan dirimu sekarang dan jadilah bagian dari Run-Madan 2026!
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Berlari sehat, berbagi kebaikan, dan kenali layanan kesehatan gratis untuk warga Rewwin
          </p>

          <div className="flex flex-wrap gap-6 justify-center items-center">
            <button
              onClick={handleWhatsApp}
              className="bg-white text-[#043e75] px-10 py-5 rounded-xl font-black text-xl hover:bg-[#addbf2] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3"
            >
              <Phone className="h-6 w-6" />
              Daftar Sekarang
              <ArrowRight className="h-6 w-6" />
            </button>

            <button
              onClick={handleShare}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-10 py-5 rounded-xl font-black text-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
            >
              <Share2 className="h-6 w-6" />
              Bagikan Event Ini
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span className="font-semibold">0813-1407-3434</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">Masjid Al Muhajirin Rewwin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2026 Masjid Al Muhajirin Rewwin. Supported by{' '}
            <a href="/units/lazmu" className="text-[#72b4d7] hover:text-[#addbf2] font-semibold">
              LAZ Muhajirin (LAZMU)
            </a>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            #RunMadan2026 #TarhibRamadhan #LariAmal #MasjidAlMuhajirin
          </p>
        </div>
      </footer>
    </div>
  );
}
