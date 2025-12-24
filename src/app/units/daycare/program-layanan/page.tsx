// src/app/(WebsiteLayout)/program-layanan/page.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Clock, Star, Users, Heart, BookOpen, CheckCircle, ArrowRight, Phone, Calendar, Target, Palette, Activity, Baby } from 'lucide-react';

/**
 * Program & Layanan page for Daycare Al Muhajirin Rewwin
 * Comprehensive information about all programs, services, and curriculum
 */
export default function ProgramLayananPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Program%20%26%20Layanan%20Daycare%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const paketLayanan = [
    {
      title: "FULLDAY CARE",
      icon: "👶",
      ageRange: "Usia 3 Bulan - 3 Tahun",
      schedule: "07.00 - 17.00 WIB",
      features: [
        "Makan 2x + Snack sore (menu bergizi seimbang)",
        "Program pembelajaran terstruktur sesuai usia",
        "Tidur siang dengan tempat tidur individual",
        "Aktivitas fisik motorik dan kreativitas",
        "Pembiasaan ibadah dan akhlak Islami",
        "Toilet training untuk yang sudah siap",
        "Pengawasan kesehatan berkala"
      ],
      keunggulan: [
        "Stimulasi 6 aspek perkembangan secara optimal",
        "Rasio pengasuh 1:4 untuk perhatian maksimal",
        "Laporan harian perkembangan anak",
        "Konsultasi parenting gratis"
      ],
      price: "Mulai dari Rp 1.400.000/bulan",
      popular: true,
      color: "blue"
    },
    {
      title: "AFTER SCHOOL",
      icon: "🎒",
      ageRange: "Usia 2 - 6 Tahun",
      schedule: "Setelah sekolah - 17.00 WIB",
      features: [
        "Makan 1x + Snack sehat",
        "Bimbingan mengerjakan PR sekolah",
        "Program pengembangan bakat (seni, musik, olahraga)",
        "Kegiatan sosial dan bermain bersama",
        "Pembiasaan mengaji dan doa harian",
        "Rest time untuk pemulihan energi"
      ],
      keunggulan: [
        "Jembatan antara sekolah formal dan rumah",
        "Mengoptimalkan waktu sore dengan kegiatan positif",
        "Mengurangi screen time dengan aktivitas edukatif",
        "Pembentukan karakter Islami"
      ],
      price: "Mulai dari Rp 900.000/bulan",
      popular: false,
      color: "green"
    },
    {
      title: "HARIAN (FLEXIBLE)",
      icon: "☀️",
      ageRange: "Semua Usia",
      schedule: "Sesuai kebutuhan",
      features: [
        "Pembayaran per hari tanpa komitmen bulanan",
        "Fasilitas sama dengan fullday",
        "Fleksibilitas jadwal sesuai kebutuhan orang tua",
        "Cocok untuk jadwal kerja tidak tetap"
      ],
      keunggulan: [
        "Solusi darurat saat pengasuh rumah berhalangan",
        "Trial sebelum memutuskan paket bulanan",
        "Hemat untuk kebutuhan sesekali",
        "Tetap berkualitas tanpa mengurangi standar"
      ],
      price: "Mulai dari Rp 80.000/hari",
      popular: false,
      color: "purple"
    }
  ];

  const programPendidikan = [
    {
      title: "Program Kognitif",
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      description: "Pembelajaran dasar untuk mengembangkan kemampuan berpikir dan bernalar",
      pembelajaran: [
        "Mengenal Huruf: A-Z dengan metode fun learning",
        "Belajar Angka: 1-20 dengan permainan matematika sederhana",
        "Pengenalan Warna: Melalui seni dan kreativitas",
        "Bentuk Geometri: Lingkaran, persegi, segitiga",
        "Stimulasi Bahasa: Vocabulary building dan story telling"
      ],
      metode: [
        "Learning by Playing: Belajar sambil bermain",
        "Multi-sensory Approach: Melibatkan semua indera",
        "Individual Pace: Sesuai kecepatan masing-masing anak",
        "Positive Reinforcement: Sistem reward dan apresiasi"
      ]
    },
    {
      title: "Program Spiritual",
      icon: <Heart className="h-8 w-8 text-green-600" />,
      description: "Pembentukan karakter Islami melalui pembiasaan ibadah sejak dini",
      pembelajaran: [
        "Hafalan Surah Pendek: Al-Fatihah, Al-Ikhlas, An-Nas, Al-Falaq",
        "Doa Harian: Doa makan, tidur, masuk-keluar rumah",
        "Belajar Wudhu: Gerakan dan urutan sederhana",
        "Kisah Nabi: Teladan Rasulullah dan para Nabi",
        "Akhlak Terpuji: Berbagi, sabar, jujur, sopan santun"
      ],
      metode: [
        "Shalat Berjamaah: Ashar untuk yang sudah mampu",
        "Mengaji (TPQ): Pengenalan huruf hijaiyah",
        "Islamic Songs: Lagu-lagu Islami edukatif",
        "Doa Bersama: Memulai dan mengakhiri aktivitas"
      ]
    },
    {
      title: "Program Kreativitas",
      icon: <Palette className="h-8 w-8 text-purple-600" />,
      description: "Mengembangkan imajinasi dan ekspresi diri melalui seni dan musik",
      pembelajaran: [
        "Menggambar Bebas: Ekspresikan imajinasi",
        "Mewarnai Terarah: Melatih fokus dan koordinasi",
        "Finger Painting: Sensory play yang menyenangkan",
        "Paper Craft: Kerajinan kertas sederhana",
        "Clay Modeling: Bermain dengan playdough"
      ],
      metode: [
        "Bernyanyi: Lagu anak-anak edukatif",
        "Bermain Alat Musik: Sederhana seperti tamborin, triangle",
        "Gerak dan Lagu: Koordinasi musik dan gerakan",
        "Drama Sederhana: Role play dan story telling"
      ]
    },
    {
      title: "Program Fisik Motorik",
      icon: <Activity className="h-8 w-8 text-orange-600" />,
      description: "Pengembangan kemampuan fisik dan koordinasi motorik kasar dan halus",
      pembelajaran: [
        "Senam Pagi: Pemanasan dan olahraga ringan",
        "Bermain Bola: Melempar, menangkap, menendang",
        "Lari dan Melompat: Di area playground aman",
        "Panjat Tebing Mini: Melatih keberanian dan kekuatan",
        "Permainan Tradisional: Engklek, petak umpet"
      ],
      metode: [
        "Menyusun Balok: Koordinasi mata-tangan",
        "Menggunting: Dengan gunting aman anak",
        "Meronce: Melatih ketelitian",
        "Mewarnai dalam Garis: Kontrol gerakan tangan",
        "Bermain Puzzle: Problem solving sederhana"
      ]
    },
    {
      title: "Program Kemandirian",
      icon: <Target className="h-8 w-8 text-pink-600" />,
      description: "Membentuk kemandirian dan life skills dasar untuk kehidupan sehari-hari",
      pembelajaran: [
        "Toilet Training: Bertahap sesuai kesiapan anak",
        "Makan Sendiri: Menggunakan sendok dan garpu",
        "Memakai Sepatu: Velcro dan tali sederhana",
        "Membereskan Mainan: Tanggung jawab personal",
        "Cuci Tangan: Kebersihan diri"
      ],
      metode: [
        "Antri dengan Sabar: Disiplin dan menghargai giliran",
        "Berbagi dengan Teman: Empati dan kepedulian",
        "Meminta Maaf: Mengakui kesalahan",
        "Mengucap Terima Kasih: Menghargai kebaikan",
        "Membantu Teman: Gotong royong"
      ]
    }
  ];

  const jadwalHarian = [
    { time: "07.00-07.30", activity: "Penyambutan anak", focus: "Social-emotional", icon: "👋" },
    { time: "07.30-08.00", activity: "Doa bersama & fisik motorik", focus: "Spiritual & physical", icon: "🤲" },
    { time: "08.00-08.30", activity: "Sarapan & toilet training", focus: "Life skills", icon: "🍽️" },
    { time: "08.30-09.00", activity: "Pembelajaran terprogram", focus: "Cognitive", icon: "📚" },
    { time: "09.00-09.30", activity: "Snack & free play", focus: "Nutrition & social", icon: "🍎" },
    { time: "09.30-10.30", activity: "Pembelajaran lanjutan", focus: "Cognitive", icon: "✏️" },
    { time: "10.30-11.00", activity: "Sosialisasi & bermain", focus: "Social-emotional", icon: "🎈" },
    { time: "11.00-11.30", activity: "Toilet training", focus: "Life skills", icon: "🚽" },
    { time: "11.30-12.00", activity: "Makan siang", focus: "Nutrition", icon: "🍛" },
    { time: "12.00-15.00", activity: "Tidur siang", focus: "Rest & recovery", icon: "😴" },
    { time: "15.00-16.00", activity: "Mandi sore & Shalat Ashar", focus: "Hygiene & spiritual", icon: "🛁" },
    { time: "16.00-16.15", activity: "Snack sore", focus: "Nutrition", icon: "🥪" },
    { time: "16.15-17.00", activity: "Mengaji & bermain bebas", focus: "Spiritual & social", icon: "📖" }
  ];

  const programUnggulan = [
    {
      title: "Klinik Tumbuh Kembang",
      description: "Program evaluasi dan monitoring perkembangan anak secara komprehensif",
      features: [
        "Assessment Berkala: Evaluasi perkembangan",
        "Konsultasi Psikolog: Jika diperlukan",
        "Early Intervention: Deteksi dini keterlambatan",
        "Laporan Komprehensif: Untuk orang tua"
      ],
      icon: "🏥"
    },
    {
      title: "Parenting Workshop",
      description: "Program edukasi dan konsultasi untuk orang tua dalam mengasuh anak",
      features: [
        "Workshop Bulanan: Topik parenting terkini",
        "Konsultasi Individual: Masalah spesifik anak",
        "Support Group: Komunitas orang tua",
        "Expert Session: Dengan ahli tamu"
      ],
      icon: "👨‍👩‍👧‍👦"
    }
  ];

  const programKhusus = [
    {
      title: "Untuk Siswa KB-TK Al Muhajirin",
      subtitle: "Paket Hemat untuk Keluarga Internal",
      features: [
        "Potongan biaya pendaftaran",
        "Integrated program sekolah-daycare",
        "Continuity pengasuhan dan pembelajaran"
      ],
      icon: "💝"
    },
    {
      title: "Trial Package",
      subtitle: "Coba Dulu, Puas Baru Lanjut",
      features: [
        "1 minggu trial dengan biaya khusus",
        "Full experience semua program",
        "Konsultasi lengkap dengan tim"
      ],
      icon: "🎯"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-100 text-purple-800 px-6 py-2">📚 Program Komprehensif untuk Tumbuh Kembang Optimal</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Program yang{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Mengoptimalkan
              </span>{' '}
              Setiap Aspek Perkembangan Anak
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Setiap program dirancang khusus untuk mengoptimalkan perkembangan fisik, mental, spiritual, 
              dan sosial anak sesuai tahapan usianya.
            </p>
          </div>
        </div>
      </section>

      {/* Paket Layanan Utama */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilih Paket yang Sesuai Kebutuhan Keluarga Anda
            </h2>
            <p className="text-xl text-gray-600">
              Tiga paket layanan dengan standar kualitas terbaik
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {paketLayanan.map((paket, index) => (
              <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${paket.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                {paket.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">TERPOPULER ⭐</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4">{paket.icon}</div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{paket.title}</CardTitle>
                  <CardDescription className="text-gray-600 font-medium text-lg">{paket.ageRange}</CardDescription>
                  <div className={`bg-${paket.color}-50 rounded-lg p-4 mt-4`}>
                    <Clock className={`h-6 w-6 text-${paket.color}-600 mx-auto mb-2`} />
                    <p className={`text-${paket.color}-800 font-semibold`}>{paket.schedule}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Fasilitas Lengkap:</h4>
                    <div className="space-y-2">
                      {paket.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Keunggulan:</h4>
                    <div className="space-y-2">
                      {paket.keunggulan.map((keung, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <Star className={`h-5 w-5 text-${paket.color}-600 flex-shrink-0 mt-0.5`} />
                          <span className="text-gray-700 text-sm">{keung}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className={`text-2xl font-bold text-${paket.color}-600 text-center mb-4`}>{paket.price}</p>
                    <Button 
                      onClick={handleWhatsAppClick}
                      className={`w-full bg-${paket.color}-600 hover:bg-${paket.color}-700 text-white`}
                    >
                      Konsultasi Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleWhatsAppClick}
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg"
            >
              KONSULTASI PROGRAM SEKARANG
            </Button>
          </div>
        </div>
      </section>

      {/* Program Pendidikan */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kurikulum Terpadu untuk Pengembangan Holistik
            </h2>
            <p className="text-xl text-gray-600">
              Lima pilar program pendidikan yang mengembangkan seluruh aspek tumbuh kembang anak
            </p>
          </div>

          <Tabs defaultValue="kognitif" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-12">
              <TabsTrigger value="kognitif">🧠 Kognitif</TabsTrigger>
              <TabsTrigger value="spiritual">🤲 Spiritual</TabsTrigger>
              <TabsTrigger value="kreativitas">🎨 Kreativitas</TabsTrigger>
              <TabsTrigger value="motorik">🏃‍♂️ Motorik</TabsTrigger>
              <TabsTrigger value="kemandirian">🧸 Kemandirian</TabsTrigger>
            </TabsList>
            
            {programPendidikan.map((program, index) => (
              <TabsContent 
                key={index}
                value={index === 0 ? 'kognitif' : index === 1 ? 'spiritual' : index === 2 ? 'kreativitas' : index === 3 ? 'motorik' : 'kemandirian'}
                className="mt-8"
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader className="text-center pb-6">
                    <div className="mx-auto mb-4 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      {program.icon}
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900">{program.title}</CardTitle>
                    <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-6">Pembelajaran Dasar</h4>
                      <div className="space-y-4">
                        {program.pembelajaran.map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                              <p className="text-gray-800 font-medium">{item.split(':')[0]}:</p>
                              <p className="text-gray-600">{item.split(':')[1]}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-6">Metode & Kegiatan</h4>
                      <div className="space-y-4">
                        {program.metode.map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <Star className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                              <p className="text-gray-800 font-medium">{item.split(':')[0]}:</p>
                              <p className="text-gray-600">{item.split(':')[1]}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Jadwal Pembelajaran */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rutinitas Terstruktur untuk Hasil Optimal
            </h2>
            <p className="text-xl text-gray-600">
              Jadwal harian fullday yang seimbang antara pembelajaran, bermain, dan istirahat
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6">
              <h3 className="text-2xl font-bold text-white text-center">Jadwal Harian Fullday</h3>
            </div>
            
            <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {jadwalHarian.map((item, index) => (
                  <div key={index} className={`p-6 border-b border-r border-gray-200 hover:bg-gray-50 transition-colors ${
                    index % 3 === 2 ? 'lg:border-r-0' : ''
                  } ${index >= jadwalHarian.length - 3 ? 'border-b-0' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-blue-600 border-blue-600 mb-2">
                            {item.time}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{item.activity}</h4>
                        <p className="text-sm text-gray-600">{item.focus}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Unggulan */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Program Tambahan untuk Pengembangan Maksimal
            </h2>
            <p className="text-xl text-gray-600">
              Layanan khusus yang memberikan nilai tambah untuk tumbuh kembang anak
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {programUnggulan.map((program, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow border-0">
                <CardHeader className="text-center pb-6">
                  <div className="text-6xl mb-4">{program.icon}</div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{program.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-800">{feature.split(':')[0]}: </span>
                          <span className="text-gray-600">{feature.split(':')[1]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Solusi Khusus untuk Kebutuhan Spesifik</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {programKhusus.map((program, index) => (
                <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{program.icon}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h4>
                    <p className="text-gray-600 mb-4 font-medium">{program.subtitle}</p>
                    <ul className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center justify-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Mulai Perjalanan Terbaik untuk Buah Hati Anda
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Dengan program yang komprehensif dan tim yang berpengalaman, kami siap membantu mengoptimalkan 
            tumbuh kembang buah hati Anda.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { step: "1", icon: <Phone className="h-8 w-8" />, title: "Hubungi Kami", desc: "Konsultasi gratis via WhatsApp" },
              { step: "2", icon: <Users className="h-8 w-8" />, title: "Kunjungi Fasilitas", desc: "Lihat langsung lingkungan dan program" },
              { step: "3", icon: <Calendar className="h-8 w-8" />, title: "Isi Formulir", desc: "Pendaftaran mudah dan cepat" },
              { step: "4", icon: <Baby className="h-8 w-8" />, title: "Mulai Program", desc: "Anak siap memulai petualangan pembelajaran" }
            ].map((step, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {step.icon}
                </div>
                <div className="text-white font-bold text-lg mb-2">
                  {step.step}. {step.title}
                </div>
                <p className="text-purple-100 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleWhatsAppClick}
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              KONSULTASI PROGRAM SEKARANG
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold"
            >
              <Link href="/biaya-pendaftaran">DAFTAR TRIAL PACKAGE</Link>
            </Button>
          </div>

          <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
            <p className="text-white font-medium mb-2">📱 Konsultasi & Informasi</p>
            <p className="text-purple-100">WhatsApp: 0813-1466-191 (Ustadzah Iin)</p>
            <p className="text-purple-100">Tersedia setiap saat untuk diskusi program anak</p>
          </div>
        </div>
      </section>
    </div>
  );
}