// src/app/units/kbtk/program-kurikulum/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Heart,
  Music,
  Palette,
  Users,
  Sparkles,
  Star,
  ArrowRight,
  MessageCircle,
  Baby,
  School,
  Calendar
} from 'lucide-react';

export default function ProgramKurikulumPage() {
  const [activeTab, setActiveTab] = useState('sentra');

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20program%20KBTK%20Al%20Muhajirin', '_blank');
  };

  const sentra = [
    { name: 'Sentra Ibadah', description: 'Pengenalan dan praktik ibadah sehari-hari', icon: Heart, color: 'from-green-500 to-emerald-600' },
    { name: 'Sentra Main Peran', description: 'Mengembangkan kreativitas dan imajinasi', icon: Users, color: 'from-pink-500 to-rose-500' },
    { name: 'Sentra Balok', description: 'Melatih logika dan kemampuan konstruksi', icon: GraduationCap, color: 'from-blue-500 to-indigo-600' },
    { name: 'Sentra Bahan Alam', description: 'Eksplorasi dan pengenalan sains dasar', icon: Sparkles, color: 'from-amber-500 to-orange-500' },
    { name: 'Sentra Persiapan', description: 'Kesiapan akademik membaca dan menulis', icon: BookOpen, color: 'from-purple-500 to-violet-600' },
    { name: 'Sentra Seni', description: 'Mengembangkan kreativitas dan ekspresi', icon: Palette, color: 'from-red-500 to-pink-500' },
    { name: 'Sentra Fisik Motorik', description: 'Perkembangan motorik kasar dan halus', icon: Star, color: 'from-[#00BCD4] to-[#006064]' },
  ];

  const programKeagamaan = [
    { name: 'Mengaji & Hafalan', desc: 'Belajar membaca Al-Quran dan menghafal surat-surat pendek Juz 30' },
    { name: 'Sholat Berjamaah', desc: 'Pembiasaan sholat Dhuha dan Dhuhur berjamaah' },
    { name: 'PHBI', desc: 'Peringatan Hari Besar Islam (Maulid Nabi, Isra Mi\'raj, dll)' },
    { name: 'Manasik Haji', desc: 'Praktik pelaksanaan ibadah haji secara sederhana' },
    { name: 'Infaq & Bakti Sosial', desc: 'Melatih kepekaan sosial dan jiwa berbagi' },
    { name: 'Maqomat Al-Qur\'an', desc: 'Pelatihan nada bacaan Al-Qur\'an' },
    { name: 'Kaligrafi', desc: 'Seni menulis huruf Arab' },
  ];

  const programAkademik = [
    { name: 'Jurnal Pagi', desc: 'Kegiatan menulis atau menggambar untuk melatih motorik halus' },
    { name: 'Presentasi Anak', desc: 'Melatih kepercayaan diri dan kemampuan berbicara di depan umum' },
    { name: 'Pojok Baca & Hari Literasi', desc: 'Menumbuhkan minat baca sejak dini' },
    { name: 'Proyek Tema', desc: 'Pembelajaran mendalam berbasis proyek' },
    { name: 'English Class', desc: 'Pengenalan Bahasa Inggris dasar melalui permainan dan lagu' },
  ];

  const programKeterampilan = [
    { name: 'Toddler Gymnastic', desc: 'Melatih kelincahan dan koordinasi motorik', icon: Star },
    { name: 'Tari Tradisional', desc: 'Menjaga warisan budaya Indonesia', icon: Music },
    { name: 'Ekstra Musik', desc: 'Mengasah kepekaan seni dan kreativitas', icon: Music },
    { name: 'Cooking Class', desc: 'Mengembangkan kemandirian dan kreativitas', icon: Sparkles },
    { name: 'Outdoor Learning & Field Trip', desc: 'Belajar langsung dari lingkungan', icon: Users },
    { name: 'Renang', desc: 'Melatih motorik kasar dan keberanian', icon: Star },
    { name: 'Mini Bazar', desc: 'Mengajarkan dasar-dasar kewirausahaan', icon: GraduationCap },
  ];

  const jadwalTK = [
    { waktu: '07.15 - 07.30', durasi: '15 Menit', kegiatan: 'Jurnal Pagi & Pembukaan', desc: 'Do\'a sebelum belajar dan aktivitas pagi' },
    { waktu: '07.30 - 08.00', durasi: '30 Menit', kegiatan: 'Olah Raga', desc: 'Senam, gerak dan lagu, atau kegiatan motorik kasar' },
    { waktu: '08.00 - 09.10', durasi: '70 Menit', kegiatan: 'Islamic Value', desc: 'Do\'a, mengaji, dan materi hafalan surat pendek/hadits' },
    { waktu: '09.15 - 09.30', durasi: '15 Menit', kegiatan: 'Makan Bekal Sesi 1', desc: 'Snack/makanan ringan' },
    { waktu: '09.30 - 11.00', durasi: '90 Menit', kegiatan: 'Kegiatan Inti (Sentra)', desc: 'Materi pagi dan pembelajaran berbasis sentra' },
    { waktu: '11.00 - 11.20', durasi: '20 Menit', kegiatan: 'Makan Bekal Sesi 2', desc: 'Makan siang/makanan berat' },
    { waktu: '11.20 - 11.30', durasi: '10 Menit', kegiatan: 'Gosok Gigi & Wudhu', desc: 'Kebersihan diri dan persiapan sholat' },
    { waktu: '11.30 - 12.00', durasi: '30 Menit', kegiatan: 'Sholat Dhuhur & Penutupan', desc: 'Sholat berjamaah, review, dan do\'a pulang' },
  ];

  const jadwalKB = [
    { waktu: '07.15 - 07.30', durasi: '15 Menit', kegiatan: 'Jurnal Pagi & Pembukaan', desc: 'Do\'a, kalender harian, aktivitas motorik' },
    { waktu: '07.30 - 08.00', durasi: '30 Menit', kegiatan: 'Olah Raga & Aktivitas Pagi', desc: 'Senam, gerak lagu, menyiram tanaman' },
    { waktu: '08.00 - 08.30', durasi: '30 Menit', kegiatan: 'Islamic Value', desc: 'Do\'a, hafalan, dan sholat Dhuha' },
    { waktu: '08.30 - 09.00', durasi: '30 Menit', kegiatan: 'Mengaji', desc: 'Belajar membaca Al-Qur\'an' },
    { waktu: '09.00 - 09.15', durasi: '15 Menit', kegiatan: 'Makan Bekal', desc: 'Istirahat dan makan bersama' },
    { waktu: '09.15 - 09.30', durasi: '15 Menit', kegiatan: 'Gosok Gigi', desc: 'Kebiasaan kebersihan diri' },
    { waktu: '09.30 - 10.50', durasi: '80 Menit', kegiatan: 'Materi Pagi & Kegiatan Inti', desc: 'Pembelajaran dan aktivitas sentra' },
    { waktu: '10.50 - 11.00', durasi: '10 Menit', kegiatan: 'Penutupan', desc: 'Review kegiatan dan do\'a pulang' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-medium">Program & Kurikulum</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Program & Kurikulum
            </h1>
            <p className="text-lg text-[#B2EBF2]">
              Kurikulum Nasional + Kurikulum Khas Al Muhajirin dengan metode BCCT dan pendekatan Montessori
            </p>
          </div>
        </div>
      </section>

      {/* Jenjang Pendidikan */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Jenjang Pendidikan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Program pendidikan disesuaikan dengan tahap perkembangan anak</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Day Care */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-100 hover:border-pink-300 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <Baby className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Day Care</h3>
              <p className="text-pink-600 font-semibold mb-4">Usia 1-3 Tahun</p>
              <p className="text-gray-600">Program penitipan anak dengan pengasuhan penuh kasih sayang dan stimulasi perkembangan optimal.</p>
            </div>

            {/* Kelompok Bermain */}
            <div className="bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] rounded-2xl p-8 border-2 border-[#80DEEA] hover:border-[#00BCD4] transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00BCD4] to-[#006064] rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Kelompok Bermain</h3>
              <p className="text-[#006064] font-semibold mb-4">Usia 3-4 Tahun</p>
              <p className="text-gray-600">Belajar sambil bermain dengan metode BCCT untuk mengembangkan seluruh aspek perkembangan.</p>
            </div>

            {/* TK A & TK B */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-100 hover:border-green-300 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] rounded-2xl flex items-center justify-center mb-6">
                <School className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">TK A & TK B</h3>
              <p className="text-green-600 font-semibold mb-4">Usia 4-6 Tahun</p>
              <p className="text-gray-600">Persiapan menuju jenjang pendidikan selanjutnya dengan kurikulum terintegrasi nilai-nilai Islami.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'sentra', label: 'Sentra Pembelajaran', icon: GraduationCap },
              { id: 'program', label: 'Program Unggulan', icon: Star },
              { id: 'jadwal', label: 'Jadwal Kegiatan', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Sentra Content */}
          {activeTab === 'sentra' && (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">7 Sentra Pembelajaran</h3>
                <p className="text-gray-600">Pembelajaran berbasis sentra untuk memfasilitasi minat dan bakat anak</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sentra.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Program Content */}
          {activeTab === 'program' && (
            <div className="space-y-12">
              {/* Program Keagamaan */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] rounded-xl flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Program Keagamaan & Akhlak</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programKeagamaan.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-[#006064] mb-1">{item.name}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Akademik */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#00BCD4] to-[#006064] rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Program Akademik & Literasi</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programAkademik.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-[#006064] mb-1">{item.name}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Keterampilan */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FFB300] to-[#FF8F00] rounded-xl flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Keterampilan & Pengembangan Diri</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programKeterampilan.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-[#006064] mb-1">{item.name}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Jadwal Content */}
          {activeTab === 'jadwal' && (
            <div className="space-y-12">
              {/* Jadwal TK */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#00BCD4] to-[#006064] rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Jadwal TK A & TK B</h3>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white">
                        <tr>
                          <th className="px-6 py-4 text-left">Waktu</th>
                          <th className="px-6 py-4 text-left">Durasi</th>
                          <th className="px-6 py-4 text-left">Kegiatan</th>
                          <th className="px-6 py-4 text-left hidden md:table-cell">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {jadwalTK.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-[#006064]">{item.waktu}</td>
                            <td className="px-6 py-4 text-gray-600">{item.durasi}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{item.kegiatan}</td>
                            <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{item.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Jadwal KB */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Jadwal Kelompok Bermain (Semester 2)</h3>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white">
                        <tr>
                          <th className="px-6 py-4 text-left">Waktu</th>
                          <th className="px-6 py-4 text-left">Durasi</th>
                          <th className="px-6 py-4 text-left">Kegiatan</th>
                          <th className="px-6 py-4 text-left hidden md:table-cell">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {jadwalKB.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-[#2E7D32]">{item.waktu}</td>
                            <td className="px-6 py-4 text-gray-600">{item.durasi}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{item.kegiatan}</td>
                            <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{item.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kegiatan Pembelajaran</h2>
            <p className="text-gray-600">Lihat berbagai aktivitas menyenangkan di KBTK Al Muhajirin</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              '/images/kbtk/kegiatan/toddler-gym.jpg',
              '/images/kbtk/kegiatan/alzaitun-al-muhajirin-02.jpg',
              '/images/kbtk/kegiatan/anak-diperiksa-dokter-gigi.jpg',
              '/images/kbtk/kegiatan/almuhajirin-using-laptop.jpg',
            ].map((src, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                <Image src={src} alt={`Kegiatan ${index + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-6">
              Tertarik dengan Program Kami?
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Hubungi kami untuk informasi lebih lanjut atau daftarkan putra-putri Anda sekarang!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi via WhatsApp</span>
              </button>
              <Link
                href="/pendaftaran"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                <span>Info Pendaftaran</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
