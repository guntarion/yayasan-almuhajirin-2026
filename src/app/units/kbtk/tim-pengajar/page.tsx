// src/app/units/kbtk/tim-pengajar/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, GraduationCap, Heart, Quote, ArrowRight, MessageCircle } from 'lucide-react';

export default function TimPengajarPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281292359103?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20KBTK%20Al%20Muhajirin', '_blank');
  };

  const teachers = [
    {
      name: 'Septina Indarlin, M.Pd',
      panggilan: 'Ustadzah Indar',
      role: 'Kepala Sekolah',
      pendidikan: 'S2 Pendidikan',
      image: 'Septina Indarlin.jpg',
      pesan: 'Setiap anak adalah anugerah Allah yang luar biasa. Tugas kita adalah menumbuhkan potensi mereka dengan cinta, kesabaran, dan nilai-nilai Islami. Bersama-sama, mari kita wujudkan generasi yang berakhlak mulia dan berprestasi.',
    },
    {
      name: 'Azmil Adibah, S.Pd.I',
      panggilan: 'Ustadzah Azmil',
      role: 'Guru',
      pendidikan: 'S1 Pendidikan Islam',
      image: 'Azmil Adibah.jpg',
      pesan: 'Anak-anakku tersayang, setiap langkah kecilmu dalam belajar adalah ibadah. Allah mencintai anak yang rajin dan berbakti. Jadilah pribadi yang selalu membawa kebaikan di mana pun berada.',
    },
    {
      name: 'Siti Ruqoiyah, S.Pd.I',
      panggilan: 'Ustadzah Ria',
      role: 'Guru',
      pendidikan: 'S1 Pendidikan Islam',
      image: 'Siti Ruqoiyah.jpg',
      pesan: 'Anak-anakku yang sholih dan sholihah, menuntut ilmu adalah jalan menuju surga. Setiap huruf yang kalian pelajari, setiap ayat yang kalian hafal, Allah akan memudahkan langkah kalian menuju kebaikan.',
    },
    {
      name: 'Lilik Abidah, S.Pd.I',
      panggilan: 'Ustadzah Lilik',
      role: 'Guru',
      pendidikan: 'S1 Pendidikan Islam',
      image: 'Lilik Abidah.jpg',
      pesan: 'Pantang menyerah adalah kunci kesuksesan. Setiap kesulitan adalah pelajaran berharga. Ingatlah, apa yang kalian pelajari hari ini akan menjadi bekal berharga di masa depan. Semangat meraih cita-cita!',
    },
    {
      name: 'Masruroh, S.Pd.I., S.Pd',
      panggilan: 'Ustadzah Ruroh',
      role: 'Guru',
      pendidikan: 'S1 Pendidikan Islam + S1 Pendidikan',
      image: 'Masruroh.jpg',
      pesan: 'Ilmu adalah cahaya yang menerangi hidup. Tidak ada manusia yang lahir dalam keadaan berilmu, maka teruslah belajar dengan semangat. Jadilah seperti lebah yang selalu membawa manfaat bagi sekitar.',
    },
    {
      name: 'Sri Indayani, S.Pd.I., S.Pd',
      panggilan: 'Ustadzah Iin',
      role: 'Guru',
      pendidikan: 'S1 Pendidikan Islam + S1 Pendidikan',
      image: 'Sri Indayani.jpg',
      pesan: 'Jadilah anak yang taat kepada Allah, berbakti kepada orang tua, hormat kepada guru, dan menyayangi sesama. Jaga sholat, rajin berdoa, dan sebarkan kebaikan setiap hari. Itulah bekal menuju kesuksesan dunia dan akhirat.',
    },
    {
      name: 'Tinuk Lailil, S.Pd.I., S.Pd',
      panggilan: 'Ustadzah Tinuk',
      role: 'Guru',
      pendidikan: 'S1 Pendidikan Islam + S1 Pendidikan',
      image: 'Tinuk Lailil.jpg',
      pesan: 'Kalian adalah bintang-bintang yang bersinar terang. Setiap usaha dan kerja keras kalian akan membuahkan hasil yang indah. Jangan pernah berhenti bermimpi dan berusaha menjadi versi terbaik diri kalian!',
    },
    {
      name: 'Nur Arlis, S.Pd.I., S.Pd',
      panggilan: 'Ustadzah Arlis',
      role: 'Guru',
      pendidikan: 'S1 Pendidikan Islam + S1 Pendidikan',
      image: 'Nur Arlis.jpg',
      pesan: 'Mimpi adalah awal dari segala pencapaian besar. Jangan pernah berhenti bermimpi dan berusaha, karena setiap impian yang dilandasi doa dan usaha akan membawa kalian pada kebesaran di masa depan.',
    },
    {
      name: 'Chalimatus Sa\'diyah, S.Sos',
      panggilan: 'Ustadzah Dyah',
      role: 'Guru',
      pendidikan: 'S1 Sosial',
      image: '',
      pesan: 'Perjalanan menuju cita-cita memang panjang, namun setiap langkah adalah kemajuan. Pegang teguh agamamu, jaga sholatmu, hormati orang tuamu, dan sayangi sesamamu. InsyaAllah kalian akan menjadi generasi unggul yang berakhlakul karimah.',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Tim Pengajar</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tim Pengajar
            </h1>
            <p className="text-lg text-[#B2EBF2]">
              Di tangan para asatidzah yang berdedikasi, masa depan generasi penerus bangsa insyaAllah terbentuk
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <GraduationCap className="h-12 w-12 text-[#006064] mx-auto mb-4" />
            <p className="text-lg text-[#006064] leading-relaxed">
              KBTK Al Muhajirin memiliki asatidzah terbaik yang berdedikasi, tidak hanya menguasai materi pelajaran,
              tetapi juga memiliki kemampuan untuk memfasilitasi siswa dalam menjelajahi potensi mereka.
              Mereka menggali keingintahuan siswa, memberdayakan mereka untuk belajar, dan menciptakan lingkungan
              yang kondusif bagi setiap anak untuk tumbuh dan berkembang dalam fondasi nilai-nilai keislaman.
            </p>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Photo */}
                <div className="relative h-64 bg-gradient-to-br from-[#00BCD4]/20 to-[#006064]/20">
                  {teacher.image ? (
                    <Image
                      src={`/images/kbtk/foto-pengajar/${teacher.image}`}
                      alt={teacher.name}
                      fill
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-[#00BCD4] to-[#006064] rounded-full flex items-center justify-center">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  )}
                  {/* Role Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      teacher.role === 'Kepala Sekolah'
                        ? 'bg-[#FFB300] text-white'
                        : teacher.role === 'Guru'
                        ? 'bg-[#00BCD4] text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {teacher.role}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{teacher.name}</h3>
                  <p className="text-[#00BCD4] font-semibold mb-2">{teacher.panggilan}</p>
                  <p className="text-gray-500 text-sm mb-4">{teacher.pendidikan}</p>

                  {/* Message */}
                  {teacher.pesan && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-[#00BCD4]/5 to-[#006064]/5 rounded-xl">
                      <Quote className="h-5 w-5 text-[#00BCD4] mb-2" />
                      <p className="text-gray-600 text-sm italic leading-relaxed">
                        &quot;{teacher.pesan}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-12 w-12 text-[#80DEEA] mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-white italic mb-6">
              &quot;We Put A Strong Emphasis on Islamic Foundation and Value&quot;
            </blockquote>
            <p className="text-[#B2EBF2] leading-relaxed">
              Di KBTK Al Muhajirin, kami memberi penekanan kuat pada fondasi dan nilai-nilai Islami
              sebagai landasan utama dalam mendidik anak Anda. Berpegang teguh pada ajaran Al-Qur&apos;an
              dan tuntunan Rasulullah SAW, kami berkomitmen untuk menanamkan adab dan akhlak mulia
              dalam setiap aspek kehidupan anak.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Bergabunglah dengan Keluarga Besar Al Muhajirin
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Berikan anak Anda pondasi terbaik untuk masa depan yang gemilang bersama
              tim pengajar kami yang berpengalaman dan berdedikasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi Kami</span>
              </button>
              <Link
                href="/pendaftaran"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
