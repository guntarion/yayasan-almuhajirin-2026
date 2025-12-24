// src/app/units/daycare/page.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Phone, MapPin, Clock, Star, Users, Shield, Heart, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

/**
 * Homepage for Daycare Al Muhajirin Rewwin
 * Indonesian interface with Islamic values and comprehensive daycare information
 */
export default function DaycareHomePage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Daycare%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const keunggulanUtama = [
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: "Pendidikan Karakter Islami",
      description: "Pembiasaan ibadah sejak dini, hafalan surah pendek & doa harian, kisah-kisah teladan Nabi, pembelajaran akhlakul karimah"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Tim Pengasuh Berpengalaman",
      description: "Kepala daycare S.Pd dengan 20+ tahun pengalaman, tim pengasuh bersertifikat PAUD, rasio pengasuh dan anak yang ideal"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Fasilitas Lengkap & Aman",
      description: "Ruangan ber-AC untuk kenyamanan, CCTV 24 jam untuk keamanan, klinik kesehatan in-house, playground yang aman dan edukatif"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-orange-600" />,
      title: "Program Holistik",
      description: "Stimulasi 6 aspek perkembangan, makan bergizi & snack sehat, kegiatan motorik & kreativitas, toilet training & kemandirian"
    }
  ];

  const paketLayanan = [
    {
      title: "FULLDAY",
      icon: "🌅",
      subtitle: "Untuk anak usia 3 bulan - 3 tahun",
      schedule: "07.00 - 17.00 WIB",
      features: [
        "Makan 2x + Snack sore",
        "Program pembelajaran lengkap",
        "Tidur siang teratur",
        "Stimulasi 6 aspek perkembangan"
      ],
      price: "Mulai dari Rp 1.400.000/bulan",
      popular: true
    },
    {
      title: "AFTER SCHOOL",
      icon: "🎒",
      subtitle: "Untuk anak usia 2 - 6 tahun",
      schedule: "setelah sekolah - 17.00 WIB",
      features: [
        "Makan 1x + Snack sore",
        "Bimbingan PR & aktivitas",
        "Program pengembangan bakat",
        "Pembentukan karakter Islami"
      ],
      price: "Mulai dari Rp 900.000/bulan",
      popular: false
    },
    {
      title: "HARIAN",
      icon: "☀️",
      subtitle: "Untuk kebutuhan fleksibel",
      schedule: "Sesuai kebutuhan",
      features: [
        "Pembayaran per hari",
        "Fasilitas sama dengan fullday",
        "Cocok untuk jadwal tidak tetap",
        "Tetap berkualitas"
      ],
      price: "Mulai dari Rp 80.000/hari",
      popular: false
    }
  ];

  const jadwalKegiatan = [
    { time: "07.00-07.30", activity: "Penyambutan & morning check", icon: "👋" },
    { time: "07.30-08.00", activity: "Doa bersama & fisik motorik", icon: "🤲" },
    { time: "08.00-08.30", activity: "Sarapan & toilet training", icon: "🍽️" },
    { time: "08.30-10.00", activity: "Pembelajaran terprogram", icon: "📚" },
    { time: "10.30-11.00", activity: "Sosialisasi & bermain", icon: "🎈" },
    { time: "11.30-12.00", activity: "Makan siang", icon: "🍛" },
    { time: "12.00-15.00", activity: "Tidur siang", icon: "😴" },
    { time: "15.00-16.00", activity: "Mandi sore & Shalat Ashar", icon: "🛁" },
    { time: "16.00-17.00", activity: "Snack & mengaji (TPQ)", icon: "📖" },
  ];

  const testimoni = [
    {
      name: "Bunda Sari",
      child: "Aisha (3 tahun)",
      text: "Alhamdulillah, sejak di Daycare Al Muhajirin, anak saya jadi lebih mandiri dan hafal banyak doa. Pengasuhnya sabar dan profesional.",
      rating: 5,
    },
    {
      name: "Bunda Maya",
      child: "Kenji (2 tahun)",
      text: "Tim pengasuhnya kompak dan komunikatif. Setiap hari saya dapat laporan detail tentang aktivitas anak. Sangat membantu kami memahami perkembangan anak.",
      rating: 5,
    },
    {
      name: "Bunda Fitri",
      child: "Zahra (18 bulan)",
      text: "Yang saya suka, pengasuhnya benar-benar menerapkan nilai-nilai Islam dalam keseharian. Anak saya jadi rajin berdoa dan suka bercerita tentang kisah Nabi.",
      rating: 5,
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-green-100 text-green-800">Daycare Terpercaya Sejak 2022</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Tempat Terbaik untuk{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Tumbuh Kembang
                </span>{' '}
                Si Kecil
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Daycare Al Muhajirin Rewwin - Solusi terpercaya bagi Ayah Bunda yang bekerja. Kami memberikan pengasuhan penuh kasih sayang, pembelajaran yang menyenangkan, dan lingkungan Islami yang aman untuk buah hati Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                >
                  DAFTAR SEKARANG
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-2"
                >
                  <Link href="/fasilitas">LIHAT FASILITAS</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 text-center">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Lingkungan Aman & Nyaman</h3>
                  <p className="text-gray-600">Fasilitas premium dengan pengasuhan penuh kasih sayang</p>
                  <div className="mt-6 flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">20+</div>
                      <div className="text-sm text-gray-600">Tahun Pengalaman</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">100+</div>
                      <div className="text-sm text-gray-600">Anak Terdaftar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">95%</div>
                      <div className="text-sm text-gray-600">Kepuasan Ortu</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                🌟
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-xl animate-pulse">
                ❤️
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mengapa Memilih Daycare Al Muhajirin */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Ribuan Orang Tua Mempercayakan Buah Hati Mereka Kepada Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami berkomitmen memberikan yang terbaik dengan standar internasional dan nilai-nilai Islami
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keunggulanUtama.map((item, index) => (
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
      </section>

      {/* Paket Layanan */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilihan Layanan Sesuai Kebutuhan Keluarga Anda
            </h2>
            <p className="text-xl text-gray-600">
              Tiga paket fleksibel dengan kualitas terjamin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {paketLayanan.map((paket, index) => (
              <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${paket.popular ? 'ring-2 ring-green-500 scale-105' : ''}`}>
                {paket.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">TERPOPULER</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-2">{paket.icon}</div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{paket.title}</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">{paket.subtitle}</CardDescription>
                  <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <Clock className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-800 font-medium">{paket.schedule}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {paket.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-2xl font-bold text-green-600 text-center">{paket.price}</p>
                  </div>
                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Konsultasi Program
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4"
            >
              KONSULTASI GRATIS SEKARANG
            </Button>
          </div>
        </div>
      </section>

      {/* Jadwal Kegiatan Harian */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Setiap Momen Adalah Pembelajaran Berharga
            </h2>
            <p className="text-xl text-gray-600">
              Rutinitas harian yang terstruktur namun menyenangkan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {jadwalKegiatan.map((item, index) => (
                <div key={index} className="flex items-center space-x-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{item.activity}</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="text-blue-600 border-blue-600">{item.time}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Orang Tua Tentang Kami?
            </h2>
            <p className="text-xl text-gray-600">
              Kepuasan dan kepercayaan orang tua adalah prioritas utama kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimoni.map((item, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">&ldquo;{item.text}&rdquo;</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-gray-600 text-sm">Ibu dari {item.child}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lokasi & Kontak */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kunjungi Kami Hari Ini!
            </h2>
            <p className="text-xl text-gray-600">
              Lokasi strategis di jantung perumahan Rewwin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Alamat Lengkap</h3>
                  <p className="text-gray-600">Jl. Rajawali No. 207 RT 11 RW 06<br />Rewwin, Waru, Sidoarjo<br />Jawa Timur 61256</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp</h3>
                  <p className="text-gray-600">0813-1466-191 (Ustadzah Iin)</p>
                  <Button
                    onClick={handleWhatsAppClick}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Chat Sekarang
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Jam Operasional</h3>
                  <p className="text-gray-600">Senin - Jumat: 07:00 - 17:00 WIB<br />Weekend: Tutup (Emergency Contact Tersedia)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Peta Lokasi</h3>
              <p className="text-gray-600 mb-6">
                Lokasi strategis, mudah dijangkau dari berbagai daerah di Sidoarjo dan Surabaya
              </p>
              <Button
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/kontak">Lihat Peta Detail</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hubungi Kami Sekarang untuk Jadwalkan Kunjungan
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Berikan yang terbaik untuk buah hati Anda. Tim kami siap membantu Anda menemukan program yang tepat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              WhatsApp Kami Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
            >
              <Link href="/biaya-pendaftaran">Lihat Biaya & Pendaftaran</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
