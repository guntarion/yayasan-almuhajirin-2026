// src/app/units/masjid/kajian/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Clock,
  Users,
  MapPin,
  Calendar,
  MessageCircle,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

export default function KajianPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20jadwal%20kajian%20Masjid%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const kajianSchedule = [
    {
      id: 'sabtu',
      day: 'Sabtu',
      time: "Ba'da Subuh",
      title: 'Kitab Riyadhus Shalihin',
      ustadz: 'Ust. H. Ma\'ruf Nur Salam, LC.',
      description: 'Pembahasan kitab Riyadhus Shalihin karya Imam An-Nawawi yang berisi hadits-hadits pilihan tentang akhlak dan adab.',
      color: 'from-[#00BCD4] to-[#006064]',
      bgColor: 'bg-[#00BCD4]/10',
    },
    {
      id: 'ahad-subuh',
      day: 'Ahad',
      time: "Ba'da Subuh",
      title: 'Aqidah',
      ustadz: 'Ust. H. M. Nur Yasin Zain, LC.',
      description: 'Kajian tentang dasar-dasar aqidah Islam yang shahih berdasarkan Al-Qur\'an dan Sunnah.',
      color: 'from-[#4CAF50] to-[#2E7D32]',
      bgColor: 'bg-[#4CAF50]/10',
    },
    {
      id: 'ahad-maghrib',
      day: 'Ahad',
      time: "Ba'da Maghrib",
      title: 'TARJIM (Belajar Menterjemahkan Al-Qur\'an)',
      ustadz: 'Ust. H. M. Sya\'roni, M.Pd.I.',
      description: 'Program belajar menterjemahkan Al-Qur\'an secara langsung untuk memahami makna ayat-ayat suci.',
      color: 'from-[#9C27B0] to-[#6A1B9A]',
      bgColor: 'bg-[#9C27B0]/10',
    },
    {
      id: 'selasa',
      day: 'Selasa',
      time: "Ba'da Maghrib",
      title: 'TAHSIN (Belajar Memperbaiki Bacaan Al-Qur\'an)',
      ustadz: 'Ust. M. Ramdhani, SP. MM.',
      description: 'Program perbaikan bacaan Al-Qur\'an dengan metode yang sistematis dan mudah dipahami.',
      color: 'from-[#FF9800] to-[#E65100]',
      bgColor: 'bg-[#FF9800]/10',
    },
    {
      id: 'rabu',
      day: 'Rabu',
      time: "Ba'da Maghrib",
      title: 'Tadabbur Al-Qur\'an',
      ustadz: 'Ust. H. Nur Halim, M.Pd.',
      description: 'Kajian mendalam tentang makna dan hikmah dari ayat-ayat Al-Qur\'an untuk diamalkan dalam kehidupan sehari-hari.',
      color: 'from-[#00BCD4] to-[#006064]',
      bgColor: 'bg-[#00BCD4]/10',
    },
    {
      id: 'kamis',
      day: 'Kamis',
      time: "Ba'da Subuh",
      title: 'Kajian Tematik',
      ustadz: 'Ust. H. Asmara Tambunan',
      description: 'Kajian dengan tema yang bervariasi sesuai kebutuhan jamaah dan isu-isu kontemporer.',
      color: 'from-[#4CAF50] to-[#2E7D32]',
      bgColor: 'bg-[#4CAF50]/10',
    },
  ];

  const ustadzList = [
    {
      name: 'Ust. H. Ma\'ruf Nur Salam, LC.',
      specialty: 'Hadits & Fiqih',
      kajian: 'Kitab Riyadhus Shalihin',
    },
    {
      name: 'Ust. H. M. Nur Yasin Zain, LC.',
      specialty: 'Aqidah',
      kajian: 'Kajian Aqidah',
    },
    {
      name: 'Ust. H. M. Sya\'roni, M.Pd.I.',
      specialty: 'Bahasa Arab & Terjemah',
      kajian: 'TARJIM',
    },
    {
      name: 'Ust. M. Ramdhani, SP. MM.',
      specialty: 'Tahsin & Tajwid',
      kajian: 'TAHSIN',
    },
    {
      name: 'Ust. H. Nur Halim, M.Pd.',
      specialty: 'Tafsir',
      kajian: 'Tadabbur Al-Qur\'an',
    },
    {
      name: 'Ust. H. Asmara Tambunan',
      specialty: 'Tematik',
      kajian: 'Kajian Tematik',
    },
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
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Jadwal Kajian</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Kajian Rutin Mingguan
            </h1>

            <p className="text-lg text-white/90 leading-relaxed mb-8">
              Hadirilah kajian rutin untuk menambah ilmu dan mendekatkan diri kepada Allah SWT.
              Setiap langkah ke masjid adalah pahala.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Masjid Al Muhajirin Rewwin</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>6+ Kajian per Minggu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jadwal Kajian
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih kajian sesuai minat dan kebutuhan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kajianSchedule.map((kajian) => (
              <div
                key={kajian.id}
                id={kajian.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`h-2 bg-gradient-to-r ${kajian.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${kajian.color}`}>
                      {kajian.day}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {kajian.time}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{kajian.title}</h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{kajian.description}</p>

                  <div className={`${kajian.bgColor} rounded-xl p-4`}>
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-[#006064]" />
                      {kajian.ustadz}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ustadz Section */}
      <section id="ustadz" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#4CAF50]/10 text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-medium">Asatidz</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Para Ustadz Pengajar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Belajar langsung dari para ustadz yang kompeten dan berpengalaman
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ustadzList.map((ustadz, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#006064] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{ustadz.name}</h3>
                    <p className="text-sm text-[#00BCD4] font-medium mb-2">{ustadz.specialty}</p>
                    <p className="text-sm text-gray-600">{ustadz.kajian}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materi Section */}
      <section id="materi" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">Materi Kajian</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Berbagai Tema Kajian
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Kajian di Masjid Al Muhajirin mencakup berbagai tema penting dalam Islam,
                mulai dari aqidah, fiqih, akhlak, hingga tafsir Al-Qur&apos;an.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Aqidah', desc: 'Dasar-dasar keimanan yang shahih' },
                  { title: 'Hadits', desc: 'Kitab Riyadhus Shalihin dan hadits pilihan' },
                  { title: 'Tahsin', desc: 'Perbaikan bacaan Al-Qur\'an' },
                  { title: 'Tarjim', desc: 'Belajar menterjemahkan Al-Qur\'an' },
                  { title: 'Tadabbur', desc: 'Memahami makna dan hikmah Al-Qur\'an' },
                  { title: 'Tematik', desc: 'Isu-isu kontemporer dalam Islam' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#00BCD4] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-gray-900">{item.title}</span>
                      <span className="text-gray-600"> - {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/masjid/tahsin.jpeg"
                  alt="Kajian di Masjid"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#006064]/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-lg font-semibold">Kajian Rutin</p>
                  <p className="text-sm text-white/80">Belajar bersama untuk meningkatkan iman dan ilmu</p>
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
              Hadirilah Kajian Rutin
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Tidak ada syarat khusus untuk mengikuti kajian. Semua jamaah dipersilakan hadir.
              Mari bersama menuntut ilmu untuk bekal akhirat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Tanya via WhatsApp</span>
              </button>
              <a
                href="https://maps.app.goo.gl/WBXFy8CczJ5o4us27"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MapPin className="h-5 w-5" />
                <span>Lihat Lokasi</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
