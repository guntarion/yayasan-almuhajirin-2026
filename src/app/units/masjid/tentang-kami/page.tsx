// src/app/units/masjid/tentang-kami/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Users,
  Target,
  Eye,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Building,
  BookOpen,
  Shield,
  Wrench,
  Calendar,
  Megaphone,
  FileText,
} from 'lucide-react';

export default function TentangKamiPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Masjid%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const fungsiKetakmiran = [
    {
      icon: Wrench,
      title: 'Idharah (Manajemen)',
      description: 'Bertanggung jawab atas pengelolaan sehari-hari masjid, termasuk kebersihan, kenyamanan, dan keamanan.',
      color: 'from-[#00BCD4] to-[#006064]',
    },
    {
      icon: Heart,
      title: 'Imarah (Memakmurkan)',
      description: 'Menyusun dan melaksanakan berbagai program keagamaan yang mendukung pengembangan iman dan ilmu jamaah.',
      color: 'from-[#4CAF50] to-[#2E7D32]',
    },
  ];

  const tugasKetakmiran = [
    {
      icon: Building,
      title: 'Manajemen Operasional',
      items: [
        'Menjadi saluran infaq dan donasi',
        'Menyusun jadwal kegiatan harian masjid',
        'Mengelola jadwal imam dan muadzin',
        'Melaksanakan pelatihan calon imam rawatib',
      ],
    },
    {
      icon: BookOpen,
      title: 'Penyelenggaraan Ibadah',
      items: [
        "Menyelenggarakan sholat Jum'at dan sholat sunnah",
        'Mengatur pelaksanaan kajian rutin',
        'Melaksanakan ikrar masuk Islam',
        "Pembinaan mua'llaf",
      ],
    },
    {
      icon: Shield,
      title: 'Pengelolaan Fasilitas',
      items: [
        'Pemeliharaan rutin infrastruktur masjid',
        'Mengawasi kebersihan fasilitas',
        'Pemeliharaan tempat wudhu dan ruang sholat',
        'Koordinasi dengan bagian pembangunan',
      ],
    },
    {
      icon: Users,
      title: 'Pengembangan Jamaah',
      items: [
        'Program dakwah untuk menarik jamaah',
        'Menyelenggarakan seminar dan workshop',
        'Kegiatan kajian pengetahuan umum',
        'Membangun ukhuwah islamiyah',
      ],
    },
    {
      icon: Calendar,
      title: 'Kegiatan & Program',
      items: [
        'Program Hari Besar Islam (PHBI)',
        'Rangkaian kegiatan Ramadhan',
        'Halal bihalal Syawal',
        'Peringatan Maulid Nabi',
      ],
    },
    {
      icon: Megaphone,
      title: 'Komunikasi & Publikasi',
      items: [
        'Informasi kegiatan via media sosial',
        'Papan pengumuman masjid',
        'Menjaga hubungan baik dengan jamaah',
        'Koordinasi dengan komunitas sekitar',
      ],
    },
  ];

  const visiMisi = {
    visi: 'Menjadikan Masjid Al Muhajirin sebagai pusat ibadah, dakwah, dan kegiatan sosial yang memakmurkan umat dan masyarakat sekitar.',
    misi: [
      'Menyelenggarakan sholat berjamaah lima waktu dengan imam yang fasih dan khusyuk',
      'Menyelenggarakan kajian rutin harian dengan ustadz yang kompeten',
      'Memberikan pelayanan sosial kepada masyarakat melalui program Jumat Berkah dan Poliklinik Gratis',
      'Membina muallaf dan penghijrah dengan program berkelanjutan',
      'Menjadi wadah ukhuwah islamiyah bagi jamaah dan masyarakat',
    ],
  };

  const fasilitas = [
    'Ruang sholat utama ber-AC dengan kapasitas 500+ jamaah',
    'Tempat wudhu pria dan wanita yang bersih',
    'Area parkir yang luas',
    'Sound system dan multimedia',
    'Perpustakaan masjid',
    'Sekretariat ketakmiran',
    'Ruang pertemuan',
    'Toilet yang bersih dan terawat',
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#006064] via-[#00838F] to-[#00BCD4]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">Tentang Kami</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Unit Ketakmiran Masjid Al Muhajirin
            </h1>

            <p className="text-lg text-white/90 leading-relaxed">
              Memakmurkan masjid melalui pengelolaan profesional dan program-program keagamaan
              yang mendukung pengembangan iman dan ilmu jamaah.
            </p>
          </div>
        </div>
      </section>

      {/* Fungsi Ketakmiran Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fungsi Ketakmiran
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unit Ketakmiran menjalankan dua fungsi utama dalam memakmurkan masjid
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {fungsiKetakmiran.map((fungsi, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${fungsi.color}`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${fungsi.color} flex items-center justify-center mb-6`}>
                    <fungsi.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{fungsi.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{fungsi.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-2xl max-w-4xl mx-auto">
            <p className="text-gray-600 text-center">
              <strong className="text-[#006064]">Catatan:</strong> Fungsi ri&apos;ayah (pemeliharaan aset) termasuk pembangunan dan renovasi dipegang oleh yayasan sebagai pengelola resmi aset.
            </p>
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section id="visi-misi" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Visi */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#00BCD4] to-[#006064] flex items-center justify-center">
                    <Eye className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Visi</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">{visiMisi.visi}</p>
              </div>

              {/* Misi */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] flex items-center justify-center">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Misi</h2>
                </div>
                <ul className="space-y-4">
                  {visiMisi.misi.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-[#4CAF50] mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tugas Ketakmiran Section */}
      <section id="struktur" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Tugas & Tanggung Jawab</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tugas Ketakmiran
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai tugas dan tanggung jawab yang diemban oleh Unit Ketakmiran
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tugasKetakmiran.map((tugas, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-[#00BCD4]/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10 flex items-center justify-center">
                    <tugas.icon className="h-6 w-6 text-[#00BCD4]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{tugas.title}</h3>
                </div>
                <ul className="space-y-2">
                  {tugas.items.map((item, idx) => (
                    <li key={idx} className="text-gray-600 text-sm flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-[#00BCD4] rounded-full mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section id="fasilitas" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#4CAF50]/10 text-[#2E7D32] px-4 py-2 rounded-full mb-6">
                <Building className="h-5 w-5" />
                <span className="text-sm font-medium">Fasilitas</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Fasilitas Masjid
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Masjid Al Muhajirin dilengkapi dengan berbagai fasilitas untuk kenyamanan jamaah dalam beribadah.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {fasilitas.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#4CAF50]" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/masjid/tahsin.jpeg"
                    alt="Fasilitas Masjid"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg mt-8">
                  <Image
                    src="/images/masjid/tadarus-senin.jpeg"
                    alt="Kegiatan Masjid"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-6">
              Bergabung Bersama Kami
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Mari bersama memakmurkan masjid. Hadirilah kajian rutin dan jadilah bagian dari jamaah yang aktif.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi Kami</span>
              </button>
              <Link
                href="/kajian"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Lihat Jadwal Kajian</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
