// src/app/units/ambulans/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Ambulance,
  Clock,
  MapPin,
  Phone,
  Heart,
  Users,
  ArrowRight,
  Siren,
  Hospital,
  ShieldCheck,
  Truck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AmbulansPage() {
  const layanan = [
    { nama: 'Evakuasi Medis Darurat', icon: Siren, desc: 'Transportasi pasien gawat darurat' },
    { nama: 'Antar Pasien ke RS', icon: Hospital, desc: 'Rawat jalan, cuci darah, rujukan' },
    { nama: 'Transportasi Jenazah', icon: Heart, desc: 'Antar ke rumah duka/pemakaman' },
    { nama: 'Standby Acara', icon: ShieldCheck, desc: 'Siaga di acara massal' },
    { nama: 'Tanggap Bencana', icon: AlertCircle, desc: 'Evakuasi korban bencana' },
  ];

  const stats = [
    { value: '24', label: 'Jam Layanan', suffix: 'JAM' },
    { value: 'Seikhlasnya', label: 'Biaya Layanan', suffix: '' },
    { value: 'Sidoarjo', label: 'Area Layanan', suffix: '& Sekitar' },
  ];

  const galleryImages = [
    { src: '/images/ambulans/placeholder-1.jpg', alt: 'Armada Ambulans' },
    { src: '/images/ambulans/placeholder-2.jpg', alt: 'Tim Medis' },
    { src: '/images/ambulans/placeholder-3.jpg', alt: 'Peralatan Medis' },
    { src: '/images/ambulans/placeholder-4.jpg', alt: 'Evakuasi Pasien' },
  ];

  const alurLayanan = [
    { step: '1', title: 'Hubungi Hotline', desc: '0859-1807-79439' },
    { step: '2', title: 'Verifikasi', desc: 'Lokasi & kondisi pasien' },
    { step: '3', title: 'Tim Berangkat', desc: 'Menuju lokasi Anda' },
    { step: '4', title: 'Penanganan', desc: 'Stabilisasi & evakuasi' },
    { step: '5', title: 'Transportasi', desc: 'Antar ke RS tujuan' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-red-700 via-red-600 to-orange-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                <Siren className="h-5 w-5" />
                <span className="text-sm font-medium">Layanan 24 Jam</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Ambulans
                <span className="block text-red-200">Al Muhajirin</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Layanan transportasi medis darurat untuk masyarakat Sidoarjo dan sekitarnya.
                Respon cepat, layanan amanah.
              </p>

              {/* Hotline CTA */}
              <div className="bg-white rounded-2xl p-6 mb-8 shadow-2xl max-w-md">
                <p className="text-red-600 font-semibold mb-2">HOTLINE 24 JAM</p>
                <a href="tel:085918077943" className="text-4xl font-black text-gray-900 hover:text-red-600 transition-colors">
                  0859-1807-79439
                </a>
                <p className="text-gray-500 mt-2 text-sm">Telepon atau WhatsApp</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/6285918077943?text=Assalamualaikum,%20saya%20butuh%20ambulans"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                  <span>WhatsApp Sekarang</span>
                </a>
                <Link
                  href="/units/ambulans/profil-cetak"
                  className="flex items-center justify-center space-x-2 bg-red-500/30 backdrop-blur-sm hover:bg-red-500/40 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-white/30"
                >
                  <Truck className="h-5 w-5" />
                  <span>Lihat Brosur</span>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/laz/ambulance-almuhajirin.png"
                  alt="Ambulans Al Muhajirin"
                  fill
                  className="object-contain bg-white"
                  priority
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 max-w-[200px]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Siaga 24 Jam</p>
                    <p className="text-xs text-gray-500">Setiap Hari</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 bg-gradient-to-r from-red-100 via-orange-100 to-red-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-red-800">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-700">
                  {stat.value} <span className="text-lg">{stat.suffix}</span>
                </div>
                <div className="text-sm text-red-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Layanan Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-6">
              <Ambulance className="h-5 w-5" />
              <span className="text-sm font-medium">Layanan Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jenis Layanan Ambulans
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan transportasi medis untuk memenuhi kebutuhan masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layanan.map((item, index) => (
              <Card
                key={index}
                className="border-2 border-red-100 hover:border-red-300 transition-all duration-300 rounded-2xl"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{item.nama}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tarif Info */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <Heart className="h-12 w-12 text-red-500" />
                <div>
                  <h3 className="text-2xl font-bold text-red-800">Bayar Seikhlasnya</h3>
                  <p className="text-red-600">GRATIS untuk masyarakat tidak mampu</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-600 mb-2">Infaq digunakan untuk operasional ambulans</p>
                <p className="text-sm text-gray-500">Tidak ada tarif minimum yang diwajibkan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Layanan */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Alur Layanan Darurat
            </h2>
            <p className="text-gray-600">Proses cepat dan terkoordinasi</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {alurLayanan.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-100 text-center min-w-[160px]">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                {index < alurLayanan.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-red-400 mx-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Placeholder for 4 images */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-6">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">Dokumentasi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Galeri Kegiatan
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-lg bg-gray-200"
              >
                {/* Placeholder - replace with actual images */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-100">
                  <div className="text-center p-4">
                    <Ambulance className="h-12 w-12 text-red-400 mx-auto mb-2" />
                    <p className="text-red-600 font-medium text-sm">{image.alt}</p>
                    <p className="text-red-400 text-xs mt-1">Foto #{index + 1}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wilayah Layanan */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Wilayah Layanan
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-red-700 mb-2">Area Utama:</h3>
                  <ul className="space-y-2">
                    {['Kec. Waru, Sidoarjo', 'Kec. Gedangan, Sidoarjo', 'Kec. Sedati, Sidoarjo', 'Kec. Taman, Sidoarjo'].map((area, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-red-700 mb-2">Area Diperluas:</h3>
                  <p className="text-gray-600">Seluruh Sidoarjo, Surabaya, dan wilayah lain dengan koordinasi khusus</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-100">
              <h3 className="font-bold text-gray-900 text-xl mb-4">RS Rujukan Terdekat</h3>
              <ul className="space-y-3">
                {[
                  'RS Siti Khodijah Sepanjang',
                  'RSU Waru',
                  'RS Mitra Keluarga Waru',
                  'RSUD Sidoarjo',
                  'RS Premier Surabaya',
                ].map((rs, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Hospital className="h-5 w-5 text-red-500" />
                    <span className="text-gray-700">{rs}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Siren className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Butuh Ambulans Sekarang?
            </h2>
            <p className="text-xl text-white/90 mb-4">
              Hubungi Hotline 24 Jam Kami
            </p>
            <a href="tel:085918077943" className="text-5xl md:text-6xl font-black hover:text-red-200 transition-colors">
              0859-1807-79439
            </a>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/6285918077943?text=Assalamualaikum,%20saya%20butuh%20ambulans"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-white text-red-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Phone className="h-5 w-5" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:085918077943"
                className="flex items-center justify-center space-x-2 bg-red-500/30 backdrop-blur-sm hover:bg-red-500/40 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-white/30"
              >
                <Phone className="h-5 w-5" />
                <span>Telepon Langsung</span>
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
            <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lokasi Pool Ambulans</h2>
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
