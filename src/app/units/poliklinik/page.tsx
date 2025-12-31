// src/app/units/poliklinik/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Stethoscope,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Heart,
  Users,
  ArrowRight,
  Activity,
  Pill,
  Scale,
  Droplets,
  ClipboardList,
  FileText,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PoliklinikPage() {
  const jadwalPraktek = [
    { hari: 'Selasa', waktu: '09.00 - 11.00 WIB' },
    { hari: 'Jumat', waktu: '09.00 - 11.00 WIB' },
  ];

  const layanan = [
    { nama: 'Pemeriksaan Umum', icon: Stethoscope },
    { nama: 'Pemeriksaan Tekanan Darah', icon: Activity },
    { nama: 'Pemeriksaan Berat & Tinggi Badan', icon: Scale },
    { nama: 'Pemeriksaan Kolesterol, Asam Urat & Gula Darah', icon: Droplets },
    { nama: 'Konsultasi Kesehatan (Dokter Umum)', icon: Users },
    { nama: 'Pengobatan Ringan', icon: Heart },
    { nama: 'Pemberian Obat', icon: Pill },
  ];

  const stats = [
    { value: '2x', label: 'Pelayanan/Minggu' },
    { value: '100+', label: 'Pasien Terdaftar' },
    { value: 'Gratis', label: 'Biaya Pelayanan' },
  ];

  const galleryImages = [
    { src: '/images/poliklinik/pemeriksaan-kesehatan.jpg', alt: 'Pemeriksaan Kesehatan' },
    { src: '/images/poliklinik/pengecekan-tekanan-darah.jpg', alt: 'Pengecekan Tekanan Darah' },
    { src: '/images/poliklinik/konsultasi-dokter-umum.jpg', alt: 'Konsultasi Dokter Umum' },
    { src: '/images/poliklinik/asisten-mencatat-data-pasien.jpg', alt: 'Pencatatan Data Pasien' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                <Stethoscope className="h-5 w-5" />
                <span className="text-sm font-medium">Layanan Kesehatan Gratis</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Poliklinik
                <span className="block text-purple-200">Al Muhajirin</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Memberikan layanan kesehatan gratis untuk masyarakat sekitar Masjid Al Muhajirin
                Rewwin. Hadir melayani dengan penuh kasih sayang dan profesionalisme.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/units/poliklinik/kunjungan"
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-purple-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ClipboardList className="h-5 w-5" />
                  <span>Antrian Hari Ini</span>
                </Link>
                <Link
                  href="/units/poliklinik/pasien-klinik"
                  className="flex items-center justify-center space-x-2 bg-purple-500/30 backdrop-blur-sm hover:bg-purple-500/40 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-white/30"
                >
                  <Users className="h-5 w-5" />
                  <span>Data Pasien</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-purple-200">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/poliklinik/female-doctor-giving-advice-female-patient.jpg"
                  alt="Konsultasi Dokter"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-lg font-semibold">Konsultasi Kesehatan</p>
                  <p className="text-sm text-white/80">Dengan dokter umum yang berpengalaman</p>
                </div>
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 max-w-[200px]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">100% Gratis</p>
                    <p className="text-xs text-gray-500">Tanpa Biaya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="py-6 bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 text-purple-800">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Selasa & Jumat, 09.00 WIB</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-purple-400/30" />
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Masjid Al Muhajirin Rewwin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Klinik</h2>
            <p className="text-gray-600 mt-2">Akses cepat ke fitur pengelolaan klinik</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/units/poliklinik/kunjungan">
              <Card className="hover:shadow-lg transition-all duration-300 hover:border-purple-300 cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
                    <ClipboardList className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Antrian</h3>
                  <p className="text-sm text-gray-500 mt-1">Kelola kunjungan hari ini</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/units/poliklinik/pasien-klinik">
              <Card className="hover:shadow-lg transition-all duration-300 hover:border-purple-300 cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Pasien</h3>
                  <p className="text-sm text-gray-500 mt-1">Data master pasien</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/units/poliklinik/kunjungan/baru">
              <Card className="hover:shadow-lg transition-all duration-300 hover:border-purple-300 cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Pendaftaran</h3>
                  <p className="text-sm text-gray-500 mt-1">Daftarkan kunjungan baru</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/units/poliklinik/obat">
              <Card className="hover:shadow-lg transition-all duration-300 hover:border-purple-300 cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                    <Pill className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Obat</h3>
                  <p className="text-sm text-gray-500 mt-1">Inventaris obat</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Jadwal Section */}
      <section id="jadwal" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-6">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-medium">Jadwal Pelayanan</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hadir Melayani Anda
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Poliklinik Al Muhajirin hadir 2 kali dalam seminggu untuk memberikan layanan
                kesehatan gratis kepada masyarakat. Silakan datang langsung tanpa harus mendaftar
                terlebih dahulu.
              </p>

              <div className="space-y-4">
                {jadwalPraktek.map((jadwal, index) => (
                  <Card
                    key={index}
                    className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 rounded-2xl"
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{jadwal.hari}</p>
                          <p className="text-sm text-gray-500">Setiap minggu</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-700">{jadwal.waktu}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <Stethoscope className="h-5 w-5" />
                <span className="text-sm font-medium">Layanan Tersedia</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900">Jenis Layanan</h3>

              <div className="grid grid-cols-1 gap-3">
                {layanan.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors border border-gray-100 hover:border-purple-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.nama}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-100">
                <div className="flex items-center space-x-3 mb-3">
                  <Heart className="h-6 w-6 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Pelayanan Gratis</h4>
                </div>
                <p className="text-purple-700 text-sm">
                  Semua layanan kesehatan di Poliklinik Al Muhajirin diberikan secara gratis tanpa
                  dipungut biaya apapun. Didukung oleh donasi dari para donatur LAZMU.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-6">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">Baarakallaahu Fiik</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Silahkan Berkunjung
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dapatkan layanan kesehatan gratis yang berkualitas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-6">
              Butuh Layanan Kesehatan?
            </h2>
            <p className="text-lg text-purple-700 mb-8">
              Datang langsung ke Poliklinik Al Muhajirin di hari Selasa atau Jumat pukul 09.00 WIB.
              Kami siap melayani Anda dengan sepenuh hati.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/units/poliklinik/kunjungan"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ClipboardList className="h-5 w-5" />
                <span>Lihat Antrian</span>
              </Link>
              <a
                href="https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Poliklinik%20Al%20Muhajirin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-white text-purple-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200"
              >
                <Phone className="h-5 w-5" />
                <span>Hubungi Kami</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lokasi Poliklinik</h2>
            <p className="text-gray-600 mb-2">
              <strong>Yayasan Al Muhajirin Rewwin</strong>
            </p>
            <p className="text-gray-500">
              Jl. Rajawali No.207, Ngeni, Kepuhkiriman
              <br />
              Kec. Waru, Kabupaten Sidoarjo, Jawa Timur 61256
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
