// src/app/(WebsiteLayout)/tim-pengasuh/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, GraduationCap, MapPin, Star, CheckCircle, ArrowRight, Award, BookOpen, Target, Clock } from 'lucide-react';

/**
 * Tim Pengasuh page for Daycare Al Muhajirin Rewwin
 * Comprehensive team profiles, qualifications, and philosophy
 */
export default function TimPengasuhPage() {
  const [activeTab, setActiveTab] = useState('kepala');

  const handleWhatsAppClick = () => {
    window.open(
      'https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Tim%20Pengasuh%20Daycare%20Al%20Muhajirin%20Rewwin',
      '_blank'
    );
  };

  const pilarTim = [
    {
      title: 'KASIH SAYANG (LOVE)',
      icon: <Heart className='h-8 w-8 text-red-500' />,
      description: 'Setiap tindakan didasari kasih sayang tulus, seperti layaknya ibu kepada anak sendiri',
      color: 'red',
    },
    {
      title: 'PROFESIONALISME',
      icon: <GraduationCap className='h-8 w-8 text-blue-500' />,
      description: 'Berkomitmen pada standar pengasuhan dan pendidikan berkualitas tinggi',
      color: 'blue',
    },
    {
      title: 'NILAI ISLAMI',
      icon: <BookOpen className='h-8 w-8 text-green-500' />,
      description: 'Menanamkan akhlak mulia dan mencontohkan perilaku Islami dalam keseharian',
      color: 'green',
    },
    {
      title: 'PENGEMBANGAN BERKELANJUTAN',
      icon: <Target className='h-8 w-8 text-purple-500' />,
      description: 'Terus belajar dan meningkatkan kemampuan untuk memberikan yang terbaik',
      color: 'purple',
    },
  ];

  const kepalaSekolah = {
    name: 'Sri Indayani, S.Pd',
    position: 'Kepala Daycare Al Muhajirin Rewwin',
    education: 'S1 Pendidikan Anak Usia Dini (PAUD)',
    certification: 'Pendidik PAUD Bersertifikat',
    experience: '20+ tahun di bidang pendidikan anak',
    birthInfo: 'Bondowoso, 16 Juni 1979',
    phone: '0813-31466191',
    photo: '/team/sri-indayani.png',
    karir: [
      { period: '2000-2005', role: 'Guru TK An Nabila, Gedangan' },
      { period: '2005-2009', role: 'Guru TK Al Zaitun, Rewwin' },
      { period: '2009-2018', role: 'Kepala KB-TK Al Zaitun Rewwin (9 tahun kepemimpinan)' },
      { period: '2018-2023', role: 'Guru TK Al Zaitun Rewwin' },
      { period: '2023-sekarang', role: 'Kepala Daycare Al Muhajirin Rewwin' },
    ],
    keahlian: ['Manajemen Pendidikan Anak', 'Kurikulum Development', 'Child Psychology', 'Parent Counseling', 'Team Leadership'],
    testimonial:
      'Bu Sri adalah sosok pemimpin yang visioner dan sangat memahami dunia anak. Beliau selalu mengutamakan kepentingan terbaik untuk anak-anak dan mendorong tim untuk terus berkembang.',
  };

  const timSenior = [
    {
      name: 'Rahma Vina, S.Pt',
      position: 'Pendamping 1',
      education: 'S1 Peternakan',
      experience: '6+ tahun di bidang pengasuhan anak',
      birthInfo: 'Surabaya, 7 Mei 1982',
      address: 'Jl. Cendrawasih I, No. 1 Rewwin',
      phone: '0812-96612420',
      joinDate: '2020 - sekarang',
      photo: '/team/rahma-vina.png',
      background: ['2018-2020: Pengasuh Daycare BNI Graha Pangeran, Surabaya', '2020-sekarang: Pendamping 1 di Daycare Al Muhajirin Rewwin'],
      keahlian: ['Nutrisi Anak', 'Corporate Daycare Experience', 'Infant Care', 'Feeding Specialist'],
      quote:
        'Setiap anak unik dan spesial. Saya selalu berusaha memahami karakter masing-masing anak dan menyesuaikan pendekatan pengasuhan sesuai kebutuhan mereka.',
    },
  ];

  const timMuda = [
    {
      name: 'Faizatul Hilwin',
      position: 'Pendamping Muda',
      education: 'Mahasiswa Universitas Terbuka - Jurusan PAUD',
      experience: '2+ tahun di Al Muhajirin Rewwin',
      birthInfo: 'Lumajang, 28 September 2003',
      address: 'Wedoro Utara',
      phone: '0813-35493611',
      joinDate: '2023 - sekarang',
      photo: '/team/faizatul-hilwin.png',
      keunggulan: ['Fresh Graduate Energy', 'Up-to-date Knowledge', 'Tech Savvy', 'Creative Approach'],
      development: ['Sedang menempuh pendidikan S1 PAUD', 'Mengikuti pelatihan internal berkelanjutan', 'Target sertifikasi pendidik PAUD 2025'],
    },
    {
      name: 'Daeng Alifiya Nisya Salsabila',
      position: 'Pendamping Muda',
      education: 'SMA',
      experience: '1+ tahun di Al Muhajirin Rewwin',
      birthInfo: 'Bali, 6 Februari 2006',
      address: 'Kepuh Kiriman',
      phone: '0838-30494924',
      joinDate: '2024 - sekarang',
      photo: '/team/alifiya-nisya.png',
      keunggulan: ['Youthful Spirit', 'Quick Learner', 'Playful Approach', 'Loyal & Dedicated'],
      goals: ['Melanjutkan pendidikan ke PAUD', 'Mengembangkan spesialisasi di creative learning', 'Target menjadi senior caregiver'],
    },
  ];

  const timSupport = [
    {
      name: 'Yetty Ardiyani',
      position: 'Cleaning Service',
      education: 'SMA',
      experience: 'Berpengalaman di bidang cleaning service',
      birthInfo: 'Lamongan, 12 Agustus 1970',
      address: 'Kedung Rejo, Waru, Sidoarjo',
      phone: '0881-036630060',
      photo: '/team/yetty-ardiyani.png',
      responsibilities: ['Kebersihan Harian', 'Sanitasi', 'Laundry', 'Safety Check'],
      quote: 'Kebersihan adalah sebagian dari iman. Saya pastikan lingkungan belajar anak-anak selalu bersih, sehat, dan aman untuk beraktivitas.',
    },
  ];

  const rasioIdeal = [
    {
      ageGroup: 'Bayi (3-12 bulan)',
      ratio: '1:3',
      description: 'Satu pengasuh untuk maksimal 3 bayi',
      focus: ['Perhatian intensif untuk feeding, changing, sleeping', 'Monitoring ketat untuk safety dan development'],
    },
    {
      ageGroup: 'Toddler (1-2 tahun)',
      ratio: '1:4',
      description: 'Satu pengasuh untuk maksimal 4 toddler',
      focus: ['Focus pada toilet training dan basic skills', 'Balance antara safety dan exploration'],
    },
    {
      ageGroup: 'Preschool (2-3 tahun)',
      ratio: '1:6',
      description: 'Satu pengasuh untuk maksimal 6 anak',
      focus: ['Pembelajaran terstruktur dengan tetap fun', 'Preparation untuk formal education'],
    },
  ];

  const testimoni = [
    {
      name: 'Bunda Sari',
      child: 'Aisha (3 tahun)',
      text: 'Bu Sri dan timnya luar biasa! Mereka tidak hanya profesional tapi juga benar-benar sayang dengan anak-anak. Anak saya jadi lebih mandiri dan ceria sejak di daycare ini.',
      rating: 5,
      photo: '/avatars/dewi.png',
    },
    {
      name: 'Bunda Maya',
      child: 'Kenji (2 tahun)',
      text: 'Mbak Rahma sangat telaten mengajarkan anak saya makan sendiri. Sekarang di rumah sudah tidak susah lagi saat makan. Terima kasih untuk kesabarannya!',
      rating: 5,
      photo: '/avatars/dewi.png',
    },
    {
      name: 'Bunda Fitri',
      child: 'Zahra (18 bulan)',
      text: 'Tim pengasuhnya kompak dan komunikatif. Setiap hari saya dapat laporan detail tentang aktivitas anak. Sangat membantu kami memahami perkembangan anak.',
      rating: 5,
      photo: '/avatars/dewi.png',
    },
    {
      name: 'Bunda Rina',
      child: 'Fahmi (4 tahun)',
      text: 'Yang saya suka, pengasuhnya benar-benar menerapkan nilai-nilai Islam dalam keseharian. Anak saya jadi rajin berdoa dan suka bercerita tentang kisah Nabi.',
      rating: 5,
      photo: '/avatars/dewi.png',
    },
  ];

  interface TeamMember {
    name: string;
    position: string;
    education: string;
    experience: string;
    birthInfo: string;
    certification?: string;
    keahlian?: string[];
    keunggulan?: string[];
    responsibilities?: string[];
    quote?: string;
    [key: string]: unknown;
  }

  const renderTeamMember = (
    member: TeamMember,
    isLeader: boolean = false
  ) => (
    <Card className='bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg'>
      <CardHeader className='text-center pb-6'>
        <div className='relative mx-auto mb-6'>
          <div className='w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
            {member.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')}
          </div>
          {isLeader && (
            <div className='absolute -top-2 -right-2'>
              <Badge className='bg-yellow-500 text-white px-3 py-1 text-xs'>KEPALA</Badge>
            </div>
          )}
        </div>
        <CardTitle className='text-2xl font-bold text-gray-900'>{member.name}</CardTitle>
        <CardDescription className='text-lg text-blue-600 font-semibold'>{member.position}</CardDescription>
        {member.quote && <p className='text-gray-600 italic mt-4 text-sm'>&quot;{member.quote}&quot;</p>}
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 gap-4'>
          <div className='flex items-center space-x-3'>
            <GraduationCap className='h-5 w-5 text-blue-600' />
            <span className='text-gray-800 font-medium'>Pendidikan:</span>
            <span className='text-gray-600'>{member.education}</span>
          </div>

          <div className='flex items-center space-x-3'>
            <Clock className='h-5 w-5 text-green-600' />
            <span className='text-gray-800 font-medium'>Pengalaman:</span>
            <span className='text-gray-600'>{member.experience}</span>
          </div>

          <div className='flex items-center space-x-3'>
            <MapPin className='h-5 w-5 text-purple-600' />
            <span className='text-gray-800 font-medium'>Asal:</span>
            <span className='text-gray-600'>{member.birthInfo}</span>
          </div>

          {member.certification && (
            <div className='flex items-center space-x-3'>
              <Award className='h-5 w-5 text-orange-600' />
              <span className='text-gray-800 font-medium'>Sertifikat:</span>
              <span className='text-gray-600'>{member.certification}</span>
            </div>
          )}
        </div>

        {member.keahlian && (
          <div>
            <h4 className='font-semibold text-gray-900 mb-3'>Keahlian Khusus:</h4>
            <div className='grid grid-cols-1 gap-2'>
              {member.keahlian.map((skill: string, idx: number) => (
                <div key={idx} className='flex items-center space-x-2'>
                  <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0' />
                  <span className='text-gray-700 text-sm'>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {member.keunggulan && (
          <div>
            <h4 className='font-semibold text-gray-900 mb-3'>Keunggulan:</h4>
            <div className='grid grid-cols-1 gap-2'>
              {member.keunggulan.map((strength: string, idx: number) => (
                <div key={idx} className='flex items-center space-x-2'>
                  <Star className='h-4 w-4 text-yellow-500 flex-shrink-0' />
                  <span className='text-gray-700 text-sm'>{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {member.responsibilities && (
          <div>
            <h4 className='font-semibold text-gray-900 mb-3'>Tanggung Jawab:</h4>
            <div className='grid grid-cols-1 gap-2'>
              {member.responsibilities.map((resp: string, idx: number) => (
                <div key={idx} className='flex items-center space-x-2'>
                  <CheckCircle className='h-4 w-4 text-blue-600 flex-shrink-0' />
                  <span className='text-gray-700 text-sm'>{resp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='pt-4 border-t'>
          <Button onClick={handleWhatsAppClick} className='w-full bg-green-600 hover:bg-green-700 text-white'>
            Konsultasi dengan {member.name.split(' ')[0]}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-20 md:py-32'>
        <div className='absolute inset-0 bg-white/70'></div>
        <div className='relative container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-4xl mx-auto'>
            <Badge className='mb-6 bg-blue-100 text-blue-800 px-6 py-2'>👥 Tim Profesional Berpengalaman</Badge>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8'>
              Tim Pengasuh <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>Berpengalaman</span> dengan
              Hati yang Tulus
            </h1>
            <p className='text-xl text-gray-600 leading-relaxed'>
              Setiap anggota tim kami dipilih dengan standar tinggi dan dilatih secara berkelanjutan untuk memberikan pengasuhan terbaik bagi buah
              hati Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Filosofi Tim */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Lebih dari Sekedar Pengasuh, Kami adalah Pendidik Berjiwa Ibu</h2>
            <div className='max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8'>
              <p className='text-lg text-gray-700 italic'>
                &ldquo;Kami tidak hanya mengasuh, tetapi mendidik dengan hati. Setiap anak adalah amanah yang harus dijaga, dirawat, dan dikembangkan
                potensinya dengan penuh kasih sayang dan nilai-nilai Islami.&rdquo;
              </p>
            </div>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {pilarTim.map((pilar, index) => (
              <Card key={index} className='text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg'>
                <CardHeader className='pb-4'>
                  <div className='mx-auto mb-4 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center'>{pilar.icon}</div>
                  <CardTitle className='text-lg text-gray-900'>{pilar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-600 text-sm leading-relaxed'>{pilar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kepemimpinan */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Dipimpin oleh Ahli dengan Pengalaman 20+ Tahun</h2>
            <p className='text-xl text-gray-600'>Kepemimpinan yang visioner dan berpengalaman dalam dunia pendidikan anak</p>
          </div>

          <div className='max-w-4xl mx-auto'>{renderTeamMember(kepalaSekolah, true)}</div>

          {/* Career Journey */}
          <div className='max-w-4xl mx-auto mt-12'>
            <Card className='bg-white border-0 shadow-lg'>
              <CardHeader>
                <CardTitle className='text-2xl text-center text-gray-900'>Perjalanan Karir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {kepalaSekolah.karir.map((career, index) => (
                    <div key={index} className='flex items-start space-x-4 p-4 bg-gray-50 rounded-lg'>
                      <Badge className='bg-blue-100 text-blue-800'>{career.period}</Badge>
                      <p className='text-gray-700 font-medium'>{career.role}</p>
                    </div>
                  ))}
                </div>
                <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                  <p className='text-blue-800 italic'>&quot;{kepalaSekolah.testimonial}&quot;</p>
                  <p className='text-blue-600 font-medium mt-2'>- Tim Pengasuh Al Muhajirin</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tim Pengasuh */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Tim Pengasuh Berpengalaman dan Berdedikasi</h2>
            <p className='text-xl text-gray-600'>Dari yang berpengalaman hingga energi muda yang penuh semangat</p>
          </div>

          {/* Navigation Tabs */}
          <div className='flex justify-center mb-12'>
            <div className='bg-gray-100 rounded-full p-2 flex space-x-2'>
              <Button
                onClick={() => setActiveTab('kepala')}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === 'kepala' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
              >
                Kepemimpinan
              </Button>
              <Button
                onClick={() => setActiveTab('senior')}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === 'senior' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tim Senior
              </Button>
              <Button
                onClick={() => setActiveTab('muda')}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === 'muda' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tim Muda
              </Button>
              <Button
                onClick={() => setActiveTab('support')}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === 'support' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tim Support
              </Button>
            </div>
          </div>

          {/* Team Content */}
          {activeTab === 'kepala' && <div className='max-w-4xl mx-auto'>{renderTeamMember(kepalaSekolah, true)}</div>}

          {activeTab === 'senior' && (
            <div className='grid lg:grid-cols-1 gap-8 max-w-4xl mx-auto'>
              {timSenior.map((member, index) => (
                <div key={index}>{renderTeamMember(member)}</div>
              ))}
            </div>
          )}

          {activeTab === 'muda' && (
            <div className='grid md:grid-cols-2 gap-8 max-w-6xl mx-auto'>
              {timMuda.map((member, index) => (
                <div key={index}>{renderTeamMember(member)}</div>
              ))}
            </div>
          )}

          {activeTab === 'support' && (
            <div className='grid lg:grid-cols-1 gap-8 max-w-4xl mx-auto'>
              {timSupport.map((member, index) => (
                <div key={index}>{renderTeamMember(member)}</div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rasio Pengasuh & Anak */}
      <section className='py-20 bg-gradient-to-br from-green-50 to-blue-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Rasio Ideal untuk Perhatian Maksimal</h2>
            <p className='text-xl text-gray-600'>Kami menjaga rasio pengasuh dan anak sesuai standar internasional</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 mb-12'>
            {rasioIdeal.map((item, index) => (
              <Card key={index} className='bg-white hover:shadow-xl transition-shadow border-0 shadow-lg'>
                <CardHeader className='text-center'>
                  <div className='w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-3xl font-bold text-white'>{item.ratio}</span>
                  </div>
                  <CardTitle className='text-xl text-gray-900'>{item.ageGroup}</CardTitle>
                  <CardDescription className='text-gray-600'>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {item.focus.map((focus, idx) => (
                      <div key={idx} className='flex items-start space-x-2'>
                        <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0 mt-1' />
                        <span className='text-gray-700 text-sm'>{focus}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto'>
            <h3 className='text-2xl font-bold text-gray-900 text-center mb-6'>Kenapa Rasio Penting?</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {[
                { title: 'Individual Attention', desc: 'Setiap anak mendapat perhatian personal', icon: '👶' },
                { title: 'Safety Assurance', desc: 'Pengawasan yang lebih ketat', icon: '🛡️' },
                { title: 'Quality Interaction', desc: 'Interaksi berkualitas tinggi', icon: '💬' },
                { title: 'Early Detection', desc: 'Deteksi dini masalah perkembangan', icon: '🔍' },
                { title: 'Emotional Bonding', desc: 'Ikatan emosional yang kuat', icon: '❤️' },
              ].map((item, index) => (
                <div key={index} className='flex items-center space-x-4 p-4 bg-gray-50 rounded-lg'>
                  <span className='text-2xl'>{item.icon}</span>
                  <div>
                    <p className='font-semibold text-gray-900'>{item.title}</p>
                    <p className='text-gray-600 text-sm'>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Apa Kata Orang Tua Tentang Tim Pengasuh Kami</h2>
            <p className='text-xl text-gray-600'>Kepercayaan dan apresiasi dari orang tua adalah motivasi terbesar kami</p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {testimoni.map((item, index) => (
              <Card key={index} className='bg-white hover:shadow-xl transition-shadow border-0 shadow-lg'>
                <CardContent className='p-6'>
                  <div className='flex items-center space-x-1 mb-4'>
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className='h-4 w-4 text-yellow-400 fill-current' />
                    ))}
                  </div>
                  <p className='text-gray-700 mb-6 italic text-sm'>&ldquo;{item.text}&rdquo;</p>
                  <div className='flex items-center space-x-3'>
                    <Image src={item.photo} alt={item.name} width={40} height={40} className='w-10 h-10 rounded-full object-cover' />
                    <div>
                      <p className='font-semibold text-gray-900 text-sm'>{item.name}</p>
                      <p className='text-gray-600 text-xs'>Ibu dari {item.child}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-600'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>Tim Terbaik Siap Mengasuh Buah Hati Anda</h2>
          <p className='text-xl text-blue-100 mb-8 max-w-3xl mx-auto'>
            Dengan tim yang berpengalaman, passionate, dan terus berkembang, kami yakin dapat memberikan pengasuhan terbaik untuk buah hati Anda.
          </p>

          <div className='grid md:grid-cols-5 gap-6 mb-12 max-w-4xl mx-auto'>
            {[
              { icon: '💝', title: 'Mengasihi', desc: 'setiap anak seperti anak sendiri' },
              { icon: '🎓', title: 'Mendidik', desc: 'dengan metode terbaik dan terkini' },
              { icon: '🤲', title: 'Menanamkan', desc: 'nilai-nilai Islami dalam keseharian' },
              { icon: '📞', title: 'Berkomunikasi', desc: 'aktif dengan orang tua' },
              { icon: '🌱', title: 'Mengembangkan', desc: 'potensi unik setiap anak' },
            ].map((item, index) => (
              <div key={index} className='bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors'>
                <div className='text-3xl mb-2'>{item.icon}</div>
                <div className='text-white font-bold text-sm mb-1'>{item.title}</div>
                <p className='text-blue-100 text-xs'>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button onClick={handleWhatsAppClick} size='lg' className='bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold'>
              KENALAN DENGAN TIM SEKARANG
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
            <Button
              onClick={handleWhatsAppClick}
              variant='outline'
              size='lg'
              className='border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold'
            >
              JADWALKAN MEETING DENGAN KEPALA
            </Button>
          </div>

          <div className='mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto'>
            <p className='text-white font-medium mb-2'>📱 Konsultasi & Informasi</p>
            <p className='text-blue-100'>WhatsApp: 0813-1466-191 (Ustadzah Iin)</p>
            <p className='text-blue-100'>Tersedia setiap saat untuk diskusi tim dan kebutuhan anak</p>
          </div>
        </div>
      </section>
    </div>
  );
}
