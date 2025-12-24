// src/app/units/daycare/tentang-kami/page.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Heart, Users, Home, Target, BookOpen, Award, CheckCircle, Calendar, ArrowRight, Phone } from 'lucide-react';

/**
 * Tentang Kami page for Daycare Al Muhajirin Rewwin
 * Comprehensive information about the daycare's history, vision, mission, and approach
 */
export default function TentangKamiPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Daycare%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const visiMisi = [
    {
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      title: "Pengasuhan Penuh Cinta",
      description: "Memberikan pengasuhan yang penuh cinta dan perhatian untuk setiap anak"
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Pengembangan Potensi",
      description: "Mengembangkan potensi anak melalui kegiatan belajar dan bermain yang menyenangkan"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Nilai-Nilai Islami",
      description: "Membiasakan nilai-nilai Islami sejak usia dini melalui kegiatan sehari-hari"
    },
    {
      icon: <Home className="h-8 w-8 text-purple-600" />,
      title: "Lingkungan Mendukung",
      description: "Menciptakan lingkungan yang sehat, nyaman dan mendukung tumbuh kembang anak"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Kemitraan Orang Tua",
      description: "Menjalin komunikasi yang baik dengan orang tua sebagai mitra dalam mendukung perkembangan anak"
    }
  ];

  const tujuanUtama = [
    {
      icon: "🛡️",
      title: "Keamanan & Kebahagiaan",
      description: "Anak merasa aman dan bahagia selama berada di Daycare Al Muhajirin Rewwin"
    },
    {
      icon: "👫",
      title: "Pembelajaran Sosial",
      description: "Anak belajar bersosialisasi dan berbagi dengan teman-teman sebayanya"
    },
    {
      icon: "🤲",
      title: "Nilai Keagamaan",
      description: "Anak mulai mengenal konsep ibadah dan nilai-nilai keagamaan secara sederhana"
    },
    {
      icon: "🌟",
      title: "Kebiasaan Baik",
      description: "Anak memiliki kebiasaan baik dalam kebersihan, sopan santun, dan kemandirian"
    },
    {
      icon: "💞",
      title: "Kepercayaan Orang Tua",
      description: "Orang tua merasa percaya dan nyaman menitipkan anak di Daycare Al Muhajirin Rewwin"
    }
  ];

  const pilarPembelajaran = [
    {
      icon: "🧠",
      title: "Pendidikan",
      features: [
        "Stimulasi 6 aspek perkembangan",
        "Pembelajaran yang menyenangkan",
        "Mengenal huruf, angka, dan warna",
        "Persiapan masuk jenjang pendidikan selanjutnya"
      ],
      color: "blue"
    },
    {
      icon: "🤲",
      title: "Spiritual",
      features: [
        "Hafalan surah-surah pendek",
        "Doa-doa harian",
        "Pembelajaran wudhu sederhana",
        "Kisah-kisah teladan Nabi"
      ],
      color: "green"
    },
    {
      icon: "🎨",
      title: "Kreativitas",
      features: [
        "Menggambar dan mewarnai",
        "Bermain musik dan bernyanyi",
        "Kerajinan tangan sederhana",
        "Eksplorasi seni dan imajinasi"
      ],
      color: "purple"
    },
    {
      icon: "🏃‍♂️",
      title: "Fisik Motorik",
      features: [
        "Bermain di luar ruangan",
        "Senam dan gerakan",
        "Permainan edukatif",
        "Pengembangan koordinasi tubuh"
      ],
      color: "orange"
    },
    {
      icon: "🧸",
      title: "Kemandirian",
      features: [
        "Toilet training",
        "Aktivitas harian mandiri",
        "Kebersihan diri",
        "Tanggung jawab sederhana"
      ],
      color: "pink"
    }
  ];

  const keunggulanKompetitif = [
    {
      title: "Pengalaman Terpercaya",
      description: "Didirikan 2022 dengan dukungan Yayasan Al Muhajirin Rewwin",
      details: [
        "Semakin dipercaya orang tua karena lingkungan aman dan pengasuh tulus",
        "Menjadi bagian penting dalam mendukung tumbuh kembang anak di masa emas"
      ]
    },
    {
      title: "Pendekatan Holistik",
      description: "Stimulasi 6 aspek perkembangan anak secara seimbang",
      details: [
        "Program pembelajaran yang menyenangkan dengan metode bermain",
        "Perpaduan pendidikan formal dan nilai-nilai spiritual"
      ]
    },
    {
      title: "Lokasi Strategis",
      description: "Terletak di komplek perumahan Rewwin yang aman dan nyaman",
      details: [
        "Mudah diakses oleh orang tua yang bekerja",
        "Lingkungan mendukung dengan fasilitas lengkap"
      ]
    },
    {
      title: "Kemitraan Keluarga",
      description: "Komunikasi terbuka dan berkelanjutan dengan orang tua",
      details: [
        "Laporan perkembangan anak secara berkala",
        "Konsultasi pengasuhan dan pendidikan"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-800 px-6 py-2">Lebih dari Sekadar Tempat Penitipan Anak</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Mitra Terpercaya dalam{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Mendidik & Mengasuh
              </span>{' '}
              Buah Hati Anda
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Kami adalah mitra terpercaya dalam mendidik dan mengasuh buah hati Anda dengan pendekatan Islami yang penuh kasih sayang.
            </p>
          </div>
        </div>
      </section>

      {/* Sejarah & Visi Misi */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perjalanan Kami Mengabdi untuk Generasi Islami
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sejarah Singkat</h3>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Daycare Al Muhajirin Rewwin didirikan pada tahun <strong className="text-blue-600">2022</strong> atas prakarsa pengurus
                  Yayasan Al Muhajirin Rewwin sebagai bentuk kepedulian terhadap kebutuhan tempat pengasuhan anak yang aman,
                  nyaman, dan bernuansa Islami di lingkungan perumahan.
                </p>
                <p className="leading-relaxed">
                  Berlokasi strategis di komplek perumahan Rewwin, kami hadir untuk memberikan alternatif pengasuhan yang
                  mendidik bagi orang tua yang membutuhkan dukungan dalam merawat dan mengembangkan anak-anak usia dini.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-3xl font-bold text-blue-600 mb-2">2022</h4>
                <p className="text-gray-700 font-medium">Tahun Pendirian</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">100+</div>
                    <div className="text-sm text-gray-600">Anak Dipercayakan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">95%</div>
                    <div className="text-sm text-gray-600">Tingkat Kepuasan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visi */}
          <div className="text-center mb-16">
            <div className="bg-green-50 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Visi Kami</h3>
              <p className="text-xl md:text-2xl text-green-800 font-medium leading-relaxed">
                &ldquo;Menjadi tempat pengasuhan anak yang Islami, aman dan menyenangkan untuk membentuk anak yang cerdas,
                berakhlak mulia, dan penuh kasih sayang.&rdquo;
              </p>
            </div>
          </div>

          {/* Misi */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Misi Kami</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiMisi.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg text-gray-900">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tujuan Kami */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Komitmen Kami untuk Buah Hati Anda
            </h2>
            <p className="text-xl text-gray-600">
              Lima tujuan utama yang menjadi fokus dalam setiap program kami
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tujuanUtama.map((item, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Keunggulan Kompetitif */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Keunggulan yang Membuat Kami Berbeda
            </h2>
            <p className="text-xl text-gray-600">
              Empat pilar yang menjadikan kami pilihan terbaik untuk buah hati Anda
            </p>
          </div>

          <div className="space-y-12">
            {keunggulanKompetitif.map((item, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <Card className="h-full border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Award className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 text-lg mb-6">{item.description}</p>
                      <ul className="space-y-3">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 text-center">
                    <div className="text-6xl mb-4">
                      {index === 0 ? '🏆' : index === 1 ? '🎯' : index === 2 ? '🏠' : '🤝'}
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">
                      {index === 0 ? 'Terpercaya' : index === 1 ? 'Holistik' : index === 2 ? 'Strategis' : 'Partnership'}
                    </h4>
                    <p className="text-gray-600">
                      {index === 0 ? 'Pengalaman dan dedikasi' :
                       index === 1 ? 'Pendekatan menyeluruh' :
                       index === 2 ? 'Lokasi dan akses mudah' :
                       'Komunikasi dan kerjasama'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pendekatan Pembelajaran */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Metode Pembelajaran yang Terbukti Efektif
            </h2>
            <p className="text-xl text-gray-600">
              Lima pilar pembelajaran yang mengembangkan seluruh aspek tumbuh kembang anak
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pilarPembelajaran.map((pilar, index) => (
              <Card key={index} className={`bg-white hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group ${index === 4 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}>
                <div className={`h-2 bg-gradient-to-r ${
                  pilar.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  pilar.color === 'green' ? 'from-green-500 to-green-600' :
                  pilar.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  pilar.color === 'orange' ? 'from-orange-500 to-orange-600' :
                  'from-pink-500 to-pink-600'
                }`}></div>
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {pilar.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{pilar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pilar.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                          pilar.color === 'blue' ? 'text-blue-600' :
                          pilar.color === 'green' ? 'text-green-600' :
                          pilar.color === 'purple' ? 'text-purple-600' :
                          pilar.color === 'orange' ? 'text-orange-600' :
                          'text-pink-600'
                        }`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Komitmen Kualitas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Standar Kualitas yang Tidak Berkompromi
            </h2>
            <p className="text-xl text-gray-600">
              Jaminan kualitas terbaik dalam setiap aspek layanan kami
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "✅", title: "Standar Pengasuhan", desc: "SOP lengkap untuk semua aktivitas" },
              { icon: "🛡️", title: "Keamanan Maksimal", desc: "CCTV 24 jam di seluruh area" },
              { icon: "🏥", title: "Kesehatan Terjaga", desc: "Klinik kesehatan in-house" },
              { icon: "🏠", title: "Fasilitas Premium", desc: "Ruangan ber-AC untuk kenyamanan" }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-gray-50 border-0">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pencapaian */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Kepercayaan yang Terus Bertumbuh
            </h2>
            <p className="text-xl text-blue-100">
              Pencapaian yang membanggakan berkat kepercayaan keluarga-keluarga di Rewwin
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "100+", label: "Keluarga Terdaftar", icon: "👨‍👩‍👧‍👦" },
              { number: "95%+", label: "Tingkat Kepuasan", icon: "⭐" },
              { number: "0", label: "Zero Incident Keamanan", icon: "🛡️" },
              { number: "#1", label: "Referensi Daycare Islami", icon: "🏆" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{stat.icon}</div>
                    <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bergabunglah dengan Keluarga Besar Al Muhajirin
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Jadilah bagian dari komunitas orang tua yang mempercayakan pendidikan anak kepada kami.
              Hubungi kami hari ini untuk konsultasi gratis dan kunjungan fasilitas.
            </p>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: <Phone className="h-8 w-8" />, title: "Konsultasi Gratis", desc: "Diskusi kebutuhan anak" },
                { icon: <Home className="h-8 w-8" />, title: "Kunjungan Fasilitas", desc: "Tour lengkap dan gratis" },
                { icon: <Users className="h-8 w-8" />, title: "Trial Class", desc: "Mencoba program kami" },
                { icon: <BookOpen className="h-8 w-8" />, title: "Program Lengkap", desc: "Penjelasan detail program" }
              ].map((service, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleWhatsAppClick}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
              >
                WhatsApp Kami Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2"
              >
                <Link href="/fasilitas">Lihat Fasilitas Kami</Link>
              </Button>
            </div>

            <div className="mt-8 p-6 bg-green-50 rounded-2xl">
              <p className="text-green-800 font-medium mb-2">Alamat Lengkap</p>
              <p className="text-green-700">Jl. Rajawali No. 207 RT 11 RW 06, Rewwin, Waru, Sidoarjo</p>
              <p className="text-green-700">0813-1466-191 (Ustadzah Iin)</p>
              <p className="text-green-700">Senin - Jumat: 07:00 - 17:00 WIB</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
