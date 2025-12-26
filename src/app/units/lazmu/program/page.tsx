// src/app/units/lazmu/program/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  GraduationCap,
  Stethoscope,
  Users,
  Ambulance,
  ArrowRight,
  MessageCircle,
  Phone,
  AlertTriangle,
  Scissors,
  Package,
  HeartHandshake,
  Siren,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Program {
  title: string;
  kode: string;
  description: string;
  details?: { label: string; value: string }[];
  contohInfaq?: string;
  icon: LucideIcon;
  color: string;
  images?: string[];
}

export default function ProgramPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281223343416?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20program%20LAZ%20Muhajirin', '_blank');
  };

  const programPendidikan = [
    {
      title: 'Beasiswa Pendidikan',
      kode: '11',
      description: 'Memberikan beasiswa kepada siswa kurang mampu untuk melanjutkan pendidikan.',
      details: [
        { label: 'Target 2025', value: '40 siswa penerima beasiswa' },
        { label: 'SD & SMP', value: 'Rp600.000/semester' },
        { label: 'SMA & SMK', value: 'Rp750.000/semester' },
        { label: 'Total Kebutuhan', value: 'Rp50.700.000/tahun' },
      ],
      contohInfaq: 'Rp1.000.011',
      icon: GraduationCap,
      color: 'bg-blue-500',
      images: [
        '/images/laz/penerima-beasiswa-para-penerima.jpg',
        '/images/laz/penerima-beasiswa-acara-pembekalan.jpg',
      ],
    },
    {
      title: 'Beasiswa D1 Akademi Dakwah Indonesia',
      kode: '-',
      description: 'Beasiswa pendidikan dakwah untuk mencetak kader dai profesional di ADI Jawa Timur.',
      details: [
        { label: 'Program', value: 'Diploma 1 (D1)' },
        { label: 'Lokasi', value: 'ADI Jawa Timur' },
      ],
      icon: GraduationCap,
      color: 'bg-indigo-500',
    },
  ];

  const programKesehatan = [
    {
      title: 'Ambulance Gratis',
      kode: '21',
      description: 'Layanan ambulance gratis untuk masyarakat yang membutuhkan, tersedia 24 jam.',
      details: [
        { label: 'Kebutuhan Operasional', value: 'Rp22.220.000/tahun' },
        { label: 'Call Center', value: '081-55-4444-576 (24 Jam)' },
      ],
      contohInfaq: 'Rp500.021',
      icon: Ambulance,
      color: 'bg-red-500',
      images: ['/images/laz/ambulance-almuhajirin.png'],
    },
    {
      title: 'Poliklinik Gratis',
      kode: '22',
      description: 'Layanan kesehatan gratis meliputi pemeriksaan dan pengobatan dasar.',
      details: [
        { label: 'Jadwal Buka', value: 'Selasa & Jumat, 10.00 WIB' },
        { label: 'Kebutuhan Operasional', value: 'Rp60.000.000/tahun' },
      ],
      contohInfaq: 'Rp1.000.022',
      icon: Stethoscope,
      color: 'bg-green-500',
    },
    {
      title: 'Hijrah Hapus Tato dan Bekam',
      kode: '14',
      description: 'Program hapus tato gratis dan terapi bekam untuk membantu saudara yang ingin berhijrah.',
      details: [
        { label: 'Jadwal', value: 'Agustus/September (4x setahun)' },
        { label: 'Kebutuhan Dana', value: 'Rp3.000.000/tahun' },
      ],
      contohInfaq: 'Rp100.014',
      icon: HeartHandshake,
      color: 'bg-purple-500',
      images: ['/images/laz/program-hapus-tato.png'],
    },
  ];

  const programSosial = [
    {
      title: 'Khitan Ceria',
      kode: '12',
      description: 'Program khitan massal gratis untuk anak-anak kurang mampu.',
      details: [
        { label: 'Jadwal', value: 'Juni/Juli setiap tahun' },
        { label: 'Target 2025', value: '75 peserta' },
        { label: 'Paket Peserta', value: 'Uang saku, tas sekolah, sarung & peci' },
        { label: 'Kebutuhan Dana', value: 'Rp45.000.000' },
      ],
      contohInfaq: 'Rp1.000.012',
      icon: Scissors,
      color: 'bg-orange-500',
    },
    {
      title: 'Bakti Sosial / Sembako Murah',
      kode: '13',
      description: 'Pembagian sembako dengan harga murah pada bulan Ramadhan.',
      details: [
        { label: 'Jadwal', value: 'Setiap Ramadhan' },
        { label: 'Kebutuhan Dana', value: 'Rp8.000.000' },
      ],
      contohInfaq: 'Rp500.013',
      icon: Package,
      color: 'bg-amber-500',
      images: ['/images/laz/berbagi-paket-ramadhan.png'],
    },
    {
      title: 'Penyaluran Beras Zakat Fitrah',
      kode: '-',
      description: 'Penyaluran zakat fitrah dalam bentuk beras kepada mustahik yang berhak.',
      icon: Package,
      color: 'bg-lime-500',
    },
    {
      title: 'Penyaluran Fidyah',
      kode: '-',
      description: 'Penyaluran fidyah dalam bentuk makanan siap santap kepada yang berhak.',
      icon: Heart,
      color: 'bg-pink-500',
    },
  ];

  const programJenazah = [
    {
      title: 'Perawatan Jenazah dan Pelatihan',
      kode: '31',
      description: 'Layanan pemulasaraan jenazah dan pelatihan bagi masyarakat umum.',
      details: [
        { label: 'Kebutuhan Dana', value: 'Rp3.200.000/tahun' },
        { label: 'Call Center', value: '0813-3102-6307' },
      ],
      contohInfaq: 'Rp100.031',
      icon: Users,
      color: 'bg-gray-600',
      images: [
        '/images/laz/pelatihan-jenazah-pria.jpg',
        '/images/laz/pelatihan-jenazah-perempuan.jpg',
      ],
    },
  ];

  const programBencana = [
    {
      title: 'Tanggap Bencana dan Pelatihan',
      kode: '32',
      description: 'Siaga darurat untuk merespon bencana alam dan musibah.',
      details: [
        { label: 'Kebutuhan Dana Pelatihan', value: 'Rp1.000.000/tahun' },
        { label: 'Dana Khusus', value: 'Penggalangan khusus jika terjadi musibah' },
      ],
      contohInfaq: 'Rp100.032',
      icon: Siren,
      color: 'bg-red-600',
    },
  ];

  const ProgramCard = ({ program, showImages = true }: { program: Program, showImages?: boolean }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className={`h-2 ${program.color}`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 ${program.color} rounded-xl flex items-center justify-center`}>
            <program.icon className="h-7 w-7 text-white" />
          </div>
          {program.kode !== '-' && (
            <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-3 py-1 rounded-full">
              Kode: {program.kode}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
        <p className="text-gray-600 mb-4">{program.description}</p>

        {program.details && (
          <div className="space-y-2 mb-4">
            {program.details.map((detail, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-500">{detail.label}</span>
                <span className="font-semibold text-gray-900">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        {program.contohInfaq && (
          <div className="bg-[#FFF8E1] p-3 rounded-lg mb-4">
            <p className="text-sm text-[#FF8F00]">
              <span className="font-semibold">Contoh Infaq:</span> {program.contohInfaq}
            </p>
          </div>
        )}

        {showImages && program.images && program.images.length > 0 && (
          <div className={`grid ${program.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mt-4`}>
            {program.images.map((img, idx) => (
              <div key={idx} className="relative h-32 rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt={program.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">Program Unggulan 2025</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Program Kami
            </h1>
            <p className="text-lg text-[#C8E6C9]">
              Berbagai program sosial dan kemanusiaan yang kami selenggarakan untuk membantu
              sesama dan meningkatkan kesejahteraan umat.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <GraduationCap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">Program Pendidikan</p>
            </div>
            <div className="text-center">
              <Stethoscope className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Program Kesehatan</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-sm text-gray-600">Program Sosial</p>
            </div>
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">Layanan Darurat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pendidikan Section */}
      <section id="pendidikan" className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pendidikan</h2>
              <p className="text-gray-600">Program beasiswa dan pendidikan</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {programPendidikan.map((program, index) => (
              <ProgramCard key={index} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* Kesehatan Section */}
      <section id="kesehatan" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kesehatan</h2>
              <p className="text-gray-600">Layanan kesehatan untuk masyarakat</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {programKesehatan.map((program, index) => (
              <ProgramCard key={index} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* Sosial Section */}
      <section id="sosial" className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sosial Kemanusiaan</h2>
              <p className="text-gray-600">Program bantuan sosial untuk masyarakat</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programSosial.map((program, index) => (
              <ProgramCard key={index} program={program} showImages={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Jenazah Section */}
      <section id="jenazah" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-14 h-14 bg-gray-600 rounded-xl flex items-center justify-center">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Layanan Jenazah</h2>
              <p className="text-gray-600">Perawatan jenazah dan pelatihan</p>
            </div>
          </div>
          <div className="max-w-2xl">
            {programJenazah.map((program, index) => (
              <ProgramCard key={index} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* Bencana Section */}
      <section id="bencana" className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center">
              <Siren className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tanggap Bencana</h2>
              <p className="text-gray-600">Siaga darurat dan penanganan bencana</p>
            </div>
          </div>
          <div className="max-w-2xl">
            {programBencana.map((program, index) => (
              <ProgramCard key={index} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Ambulance className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ambulance Gratis 24 Jam</h3>
                <p className="text-red-100">Layanan darurat untuk masyarakat</p>
              </div>
            </div>
            <a
              href="tel:081554444576"
              className="flex items-center space-x-2 bg-white text-red-600 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Phone className="h-5 w-5" />
              <span>081-55-4444-576</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Dukung <span className="text-[#2E7D32]">Program Kami</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Setiap donasi Anda akan membantu keberlanjutan program-program sosial
              dan kemanusiaan untuk masyarakat yang membutuhkan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi Kami</span>
              </button>
              <Link
                href="/donasi"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300"
              >
                <Heart className="h-5 w-5" />
                <span>Donasi Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
