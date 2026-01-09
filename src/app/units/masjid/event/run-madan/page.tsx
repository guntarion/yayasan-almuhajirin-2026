'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Zap,
  Gift,
  Award,
  Target,
  Activity,
  CheckCircle2,
  AlertCircle,
  Phone,
  Share2,
  ArrowRight,
  Wallet,
  Copy,
  Check,
  User,
  Route,
  Sunrise,
  DumbbellIcon,
  HeartPulse,
  Ambulance,
  Building2,
  Star,
  ChevronRight,
  Download,
  QrCode,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Form types
interface Participant {
  id: string;
  namaLengkap: string;
  jenisKelamin: 'lelaki' | 'perempuan';
  tanggalLahir: string;
  ukuranKaos: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  preferensiAktivitas: 'FULL_LARI' | 'LARI_JALAN' | 'JALAN';
}

interface Registrant {
  nama: string;
  nomorHP: string;
  email: string;
  alamat: string;
}

interface ParticipantData {
  namaLengkap: string;
  usia: number;
  ukuranKaos: string;
}

interface RegistrationData {
  nomorRegistrasi: string;
  nama: string;
  nomorHP: string;
  email?: string;
  jumlahPeserta: number;
  totalBiaya: number;
  participants: ParticipantData[];
  instruksiPembayaran: {
    bank: string;
    nomorRekening: string;
    atasNama: string;
    nominal: number;
    whatsapp: string;
  };
}

export default function RunMadanPage() {

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);

  // Registration form state
  const [registrant, setRegistrant] = useState<Registrant>({
    nama: '',
    nomorHP: '',
    email: '',
    alamat: '',
  });

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      namaLengkap: '',
      jenisKelamin: 'lelaki',
      tanggalLahir: '',
      ukuranKaos: 'M',
      preferensiAktivitas: 'LARI_JALAN',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showQrisInModal, setShowQrisInModal] = useState(false);

  // Countdown timer
  useEffect(() => {
    const eventDate = new Date('2026-02-08T05:30:00+07:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('021101004859536');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/628125906069?text=Halo,%20saya%20ingin%20mendaftar%20Run-Madan%202026', '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Run-Madan 2026',
        text: 'Yuk ikutan Run-Madan 2026! Lari amal menyambut Ramadhan & kenali layanan kesehatan gratis Al Muhajirin',
        url: window.location.href,
      });
    }
  };

  // Scroll to registration form
  const scrollToRegistration = () => {
    const element = document.getElementById('registration-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Download QRIS image
  const downloadQris = () => {
    const link = document.createElement('a');
    link.href = '/images/QRIS-BRI-AlMuhajirin.jpeg';
    link.download = 'QRIS-BRI-AlMuhajirin.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add participant
  const addParticipant = () => {
    const newId = (participants.length + 1).toString();
    setParticipants([
      ...participants,
      {
        id: newId,
        namaLengkap: '',
        jenisKelamin: 'lelaki',
        tanggalLahir: '',
        ukuranKaos: 'M',
        preferensiAktivitas: 'LARI_JALAN',
      },
    ]);
  };

  // Remove participant
  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  // Update participant
  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Validate registrant
    if (!registrant.nama.trim()) errors.push('Nama pendaftar harus diisi');
    if (!registrant.nomorHP.trim()) errors.push('Nomor HP pendaftar harus diisi');
    if (!registrant.alamat.trim()) errors.push('Alamat pendaftar harus diisi');

    // Validate participants
    participants.forEach((p, index) => {
      if (!p.namaLengkap.trim()) errors.push(`Nama peserta ${index + 1} harus diisi`);
      if (!p.tanggalLahir) errors.push(`Tanggal lahir peserta ${index + 1} harus diisi`);
    });

    setFormErrors(errors);
    return errors.length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormErrors([]);

    try {
      const response = await fetch('/api/run-madan/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrant,
          participants: participants.map((p) => ({
            namaLengkap: p.namaLengkap,
            jenisKelamin: p.jenisKelamin,
            tanggalLahir: p.tanggalLahir,
            ukuranKaos: p.ukuranKaos,
            preferensiAktivitas: p.preferensiAktivitas,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      // Success - show modal with payment instructions
      setRegistrationData(data.data);
      setShowSuccessModal(true);

      // Scroll to top to see the modal
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset form
      setRegistrant({ nama: '', nomorHP: '', email: '', alamat: '' });
      setParticipants([
        {
          id: '1',
          namaLengkap: '',
          jenisKelamin: 'lelaki',
          tanggalLahir: '',
          ukuranKaos: 'M',
          preferensiAktivitas: 'LARI_JALAN',
        },
      ]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat mendaftar';
      setFormErrors([message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send payment confirmation via WhatsApp
  const sendWhatsAppConfirmation = () => {
    if (!registrationData) return;

    const message = `Halo, saya ingin konfirmasi pendaftaran Run-Madan 2026

Nomor Registrasi: ${registrationData.nomorRegistrasi}
Nama: ${registrationData.nama}
Jumlah Peserta: ${registrationData.jumlahPeserta}
Total Biaya: Rp ${registrationData.totalBiaya.toLocaleString('id-ID')}

Saya sudah melakukan transfer. Mohon konfirmasi pendaftaran saya.`;

    const whatsappUrl = `https://wa.me/628125906069?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Event categories data (currently not used in UI)
  // const categories = [
  //   {
  //     id: '3K',
  //     name: '3K Fun Run',
  //     distance: '3 Kilometer',
  //     icon: Users,
  //     participants: 'Semua Usia - Anak-anak, Dewasa, Keluarga',
  //     price: 100000,
  //     cot: '60 Menit',
  //     color: 'from-[#72b4d7] to-[#4e8fc0]',
  //     note: 'Anak-anak wajib didampingi orang tua/wali',
  //   },
  // ];

  // Unified benefits for all participants
  const allBenefits = [
    'Jersey Run-Madan eksklusif',
    'Race bib dengan nomor unik',
    'Medali finisher',
    'Sertifikat digital',
    'Doorprize menarik',
    'Goodie bag berisi produk sponsor',
    'Snack & air mineral',
    'Sesi edukasi kesehatan GRATIS',
  ];

  // Race day schedule
  const schedule = [
    { time: '05:30 - 05:45', activity: 'Edukasi Kesehatan: Olahraga Sehat Menyambut Ramadhan', icon: HeartPulse },
    { time: '06:00 - 06:10', activity: 'Pemanasan Bersama', icon: DumbbellIcon },
    { time: '06:10 - 07:10', activity: 'Lari & Jalan Sehat 3K', icon: Zap },
    { time: '07:10 - 07:30', activity: 'Finish & Refreshment', icon: Gift },
    { time: '07:30 - 07:50', activity: 'Edukasi & Donasi Sosial', icon: HeartPulse },
    { time: '07:50 - 08:00', activity: 'Penutup & Foto Bersama', icon: Award },
  ];

  // Route information
  const routeDetails = [
    {
      icon: MapPin,
      title: 'Start Point',
      description: 'Lapangan Masjid Al Muhajirin Rewwin',
      color: 'from-[#72b4d7] to-[#4e8fc0]',
    },
    {
      icon: Route,
      title: 'Rute Lari',
      description: 'Perumahan Rewwin - Jalur aman & nyaman',
      color: 'from-[#4e8fc0] to-[#043e75]',
    },
    {
      icon: Target,
      title: 'Finish Point',
      description: 'Lapangan Masjid Al Muhajirin Rewwin',
      color: 'from-[#043e75] to-[#4e8fc0]',
    },
  ];

  // Charity impact
  const charityImpacts = [
    {
      icon: Building2,
      title: 'Poliklinik Al Muhajirin',
      description: 'Layanan kesehatan gratis untuk semua. Dana pendaftaran mendukung keberlanjutan program ini.',
      color: 'from-[#4e8fc0] to-[#72b4d7]',
      image: '/images/poliklinik/pengecekan-tekanan-darah.jpg',
    },
    {
      icon: Ambulance,
      title: 'Layanan Ambulans 24/7',
      description: 'Ambulans gratis 24 jam untuk warga. Dana pendaftaran membantu operasional agar layanan tetap berjalan.',
      color: 'from-[#043e75] to-[#4e8fc0]',
      image: '/images/laz/ambulance-almuhajirin.png',
    },
    {
      icon: Heart,
      title: 'Program Sosial LAZMU',
      description: 'Sebagian dana mendukung program sosial LAZ Muhajirin untuk masyarakat yang membutuhkan.',
      color: 'from-[#72b4d7] to-[#addbf2]',
      image: '/images/laz/berbagi-paket-ramadhan.png',
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'Apakah Run-Madan ini lomba lari?',
      answer:
        'BUKAN! Run-Madan adalah Edu Run - kegiatan lari santai yang bersifat non-kompetitif dengan fokus pada edukasi kesehatan. Tidak ada klasemen waktu, tidak ada pemenang tercepat, dan tidak ada hadiah untuk yang tercepat. Ini adalah kegiatan untuk bersenang-senang sambil belajar tentang kesehatan.',
    },
    {
      question: 'Saya belum pernah ikut lari sebelumnya, apakah boleh ikut?',
      answer:
        'Sangat boleh! Run-Madan dirancang khusus untuk pelari pemula dan keluarga. Jarak hanya 3K dengan rute datar, waktu COT sangat longgar, dan akan ada sesi edukasi kesehatan yang mengajarkan cara memulai lari dengan aman. Tidak ada tekanan untuk cepat - yang penting Anda bergerak dan bersenang-senang!',
    },
    {
      question: 'Apakah ada batas usia untuk mengikuti Run-Madan?',
      answer:
        'Semua usia boleh ikut! Dari anak-anak hingga lansia. Tidak ada batas usia maksimal, namun peserta harus dalam kondisi sehat dan fit. Anak-anak wajib didampingi orang tua/wali. Lansia sangat dipersilakan ikut - bahkan ada senam terapi kesehatan khusus untuk ibu-ibu dan lansia!',
    },    
    {
      question: 'Apakah ada COT (Cut Off Time)?',
      answer:
        'Ya, tapi sangat longgar! COT untuk 3K adalah 60 menit (20 menit/km). Ini artinya Anda bisa jalan santai pun masih sempat finish. Medali diberikan untuk semua yang finish di bawah COT. Ingat, ini bukan lomba - tidak apa-apa berjalan kaki atau santai saja!',
    },
    {
      question: 'Saya tidak kuat lari jauh, boleh jalan kaki saja?',
      answer:
        'Tentu saja boleh! Run-Madan adalah kegiatan santai dan non-kompetitif. Anda bisa kombinasi jalan dan lari, atau jalan kaki saja. Yang penting Anda aktif bergerak dan menikmati kebersamaan. COT sangat longgar sehingga jalan kaki pun masih bisa finish dengan tenang.',
    },
    {
      question: 'Bagaimana jika cuaca buruk?',
      answer: 'Event akan tetap berlangsung kecuali kondisi ekstrem yang membahayakan peserta. Pantau info terbaru di WhatsApp group peserta.',
    },
    {
      question: 'Apakah dana pendaftaran bisa dikembalikan?',
      answer:
        'Dana pendaftaran tidak dapat dikembalikan (non-refundable) karena telah dialokasikan untuk produksi jersey, medali, dan operasional event.',
    },
    {
      question: 'Untuk apa dana pendaftaran digunakan?',
      answer:
        'Dana pendaftaran digunakan untuk operasional event (jersey, medali, dan konsumsi) serta sebagian disalurkan untuk mendukung operasional layanan ambulans dan poliklinik Al Muhajirin yang GRATIS untuk masyarakat, juga program sosial LAZMU. Uang pendaftaran TIDAK digunakan untuk pengadaan hadiah atau doorprize. Layanan kesehatan tetap gratis - donasi sukarela diterima untuk keberlanjutan program.',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-[#043e75] via-[#4e8fc0] to-[#72b4d7] text-white'>
        {/* Decorative elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-[#addbf2]/20 rounded-full blur-3xl' />
          <div className='absolute top-1/2 -left-40 w-96 h-96 bg-[#72b4d7]/20 rounded-full blur-3xl' />
          <div className='absolute -bottom-40 right-1/3 w-80 h-80 bg-[#4e8fc0]/20 rounded-full blur-3xl' />
        </div>

        <div className='relative container mx-auto px-4 py-16 md:py-24'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            {/* Left: Event Info */}
            <div className='space-y-6'>
              <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold'>
                <Zap className='h-4 w-4' />
                Tarhib Ramadhan 1447H
              </div>

              <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#addbf2] transition-all duration-300'>
                RUN-MADAN
                <span className='block text-xl sm:text-2xl md:text-4xl font-bold text-white mt-2'>2026</span>
              </h1>

              <p className='text-xl md:text-2xl text-white/90 font-medium'>Lari Santai Ramah Pemula, Edukasi Kesehatan</p>
              <p className='text-lg text-white/80'>
                Bukan Lomba! Ini adalah Edu Run untuk semua kalangan - Menyambut Ramadhan & Memperkenalkan Layanan Kesehatan Gratis
              </p>

              <div className='flex flex-wrap gap-4 text-sm'>
                <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg'>
                  <Calendar className='h-5 w-5' />
                  <span className='font-semibold'>Minggu, 8 Februari 2026</span>
                </div>
                <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg'>
                  <Clock className='h-5 w-5' />
                  <span className='font-semibold'>Start 05:30 WIB</span>
                </div>
                <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg'>
                  <MapPin className='h-5 w-5' />
                  <span className='font-semibold'>Masjid Al Muhajirin Rewwin</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row sm:flex-wrap gap-3 md:gap-4 pt-4'>
                <button
                  onClick={scrollToRegistration}
                  className='bg-white text-[#043e75] px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-[#addbf2] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 min-h-[48px]'
                >
                  <Users className='h-5 w-5' />
                  Daftar Sekarang
                  <ArrowRight className='h-5 w-5' />
                </button>
                <button
                  onClick={handleShare}
                  className='bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px]'
                >
                  <Share2 className='h-5 w-5' />
                  Share Event
                </button>
              </div>

              {/* Countdown Timer */}
              <div className='bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <h3 className='text-sm font-semibold mb-4 text-[#addbf2] uppercase tracking-wider'>Event dimulai dalam:</h3>
                <div className='grid grid-cols-4 gap-3'>
                  {[
                    { label: 'Hari', value: timeLeft.days },
                    { label: 'Jam', value: timeLeft.hours },
                    { label: 'Menit', value: timeLeft.minutes },
                    { label: 'Detik', value: timeLeft.seconds },
                  ].map((item) => (
                    <div key={item.label} className='text-center'>
                      <div className='bg-white/10 backdrop-blur-sm rounded-xl p-2 md:p-3 mb-2 transition-all duration-300'>
                        <div className='text-2xl sm:text-3xl md:text-4xl font-black'>{item.value}</div>
                      </div>
                      <div className='text-xs md:text-sm font-medium text-white/80'>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Logo & Image */}
            <div className='relative'>
              <div className='relative aspect-square max-w-md mx-auto'>
                {/* Glowing background */}
                <div className='absolute inset-0 bg-gradient-to-br from-[#addbf2]/40 to-[#72b4d7]/40 rounded-full blur-3xl' />

                {/* Logo container with white gradient background */}
                <div className='relative bg-gradient-to-br from-white via-white to-[#addbf2]/30 rounded-full p-8 shadow-2xl'>
                  <Image
                    src='/images/masjid/logo-run-madan.png'
                    alt='Run-Madan 2026 Logo'
                    width={500}
                    height={500}
                    className='w-full h-auto drop-shadow-xl'
                    priority
                  />
                </div>

                {/* Floating badges */}
                <div className='absolute -top-4 -right-4 bg-[#addbf2] text-[#043e75] px-6 py-3 rounded-full font-black text-sm shadow-lg rotate-12'>
                  3K Fun Run
                </div>
                <div className='absolute -bottom-4 -left-4 bg-white text-[#043e75] px-6 py-3 rounded-full font-black text-sm shadow-lg -rotate-12 border-2 border-[#043e75]'>
                  Edu Run
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Family Jogging Banner */}
      <section className='relative py-0 bg-white'>
        <div className='relative aspect-[21/9] w-full overflow-hidden'>
          <Image src='/images/events/keluarga-jogging.jpg' alt='Keluarga jogging bersama' fill className='object-cover' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent' />
          <div className='absolute inset-0 flex items-center'>
            <div className='container mx-auto px-4'>
              <div className='max-w-2xl'>
                <h3 className='text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-xl'>Run-Madan 2026</h3>
                <p className='text-xl md:text-2xl text-white/95 font-bold drop-shadow-lg'>Keluarga Sehat, Ramadhan Berkah</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className='py-12 bg-white border-b border-gray-200'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
            {[
              { icon: Users, label: '3K Fun Run', value: 'Semua Usia', color: 'from-[#72b4d7] to-[#4e8fc0]' },
              { icon: Activity, label: 'Non-Kompetitif', value: 'Santai Saja', color: 'from-[#4e8fc0] to-[#043e75]' },
              { icon: HeartPulse, label: 'Edukasi', value: 'Gratis!', color: 'from-[#addbf2] to-[#72b4d7]' },
              { icon: Heart, label: 'Amal Sosial', value: 'Kontribusi', color: 'from-[#043e75] to-[#4e8fc0]' },
            ].map((stat, index) => (
              <div
                key={index}
                className='bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300'
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className='h-7 w-7 text-white' />
                </div>
                <div className='text-3xl font-black text-gray-900 mb-1'>{stat.value}</div>
                <div className='text-xl font-bold text-gray-900'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Event */}
      <section className='py-16 bg-gradient-to-b from-white to-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-6'>Tentang Run-Madan 2026</h2>
            <p className='text-lg text-gray-700 leading-relaxed mb-4'>
              Run-Madan adalah event <strong>lari santai dan edukasi kesehatan</strong> yang diselenggarakan oleh{' '}
              <strong>Masjid Al Muhajirin Rewwin</strong> untuk menyambut bulan suci Ramadhan 1447H.
            </p>

            <p className='text-lg text-gray-700 leading-relaxed mb-8 bg-[#addbf2]/20 p-6 rounded-xl border-2 border-[#043e75]'>
              <strong className='text-[#043e75] text-xl'>Media Edukasi & Sosialisasi:</strong>
              <br />
              Melalui pendekatan olahraga yang ringan dan ramah pemula, Run-Madan 2026 menjadi momentum untuk{' '}
              <strong>memperkenalkan layanan kesehatan gratis</strong> kami kepada seluruh warga Rewwin dan sekitarnya:{' '}
              <strong>Poliklinik Al Muhajirin</strong> dan <strong>Layanan Ambulans 24/7</strong>. Kami ingin meningkatkan kesadaran masyarakat
              terhadap pentingnya kesehatan sekaligus memperkenalkan fasilitas yang telah tersedia di lingkungan masjid.
            </p>

            {/* Featured Image */}
            <div className='relative aspect-[16/9] max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl mb-12'>
              <Image src='/images/events/senior-berlari.jpg' alt='Senior aktif berlari di Run-Madan' fill className='object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
              <div className='absolute bottom-6 left-6 right-6 text-white'>
                <p className='text-xl font-bold drop-shadow-lg'>Aktif di Segala Usia, Berlari Bersama</p>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {[
              {
                icon: HeartPulse,
                title: 'Layanan Kesehatan Gratis',
                description: 'Memperkenalkan Poliklinik Al Muhajirin dan Ambulans 24/7 yang gratis untuk seluruh warga Rewwin dan sekitarnya.',
                color: 'from-[#043e75] to-[#4e8fc0]',
              },
              {
                icon: Activity,
                title: 'Gaya Hidup Sehat',
                description: 'Membudayakan olahraga dan hidup sehat menjelang Ramadhan dengan event lari yang fun dan meriah.',
                color: 'from-[#4e8fc0] to-[#72b4d7]',
              },
              {
                icon: Heart,
                title: 'Berbagi Kebaikan',
                description: 'Dana pendaftaran mendukung operasional layanan kesehatan dan program sosial LAZMU untuk kesejahteraan bersama.',
                color: 'from-[#72b4d7] to-[#addbf2]',
              },
            ].map((item, index) => (
              <div key={index} className='bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 group'>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <item.icon className='h-7 w-7 md:h-8 md:w-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>{item.title}</h3>
                <p className='text-gray-600 leading-relaxed'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Services Programs */}
      <section className='py-16 bg-gradient-to-b from-white to-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-[#addbf2] text-[#043e75] px-4 py-2 rounded-full font-semibold mb-4'>
              <HeartPulse className='h-5 w-5' />
              Program Layanan Kesehatan
            </div>
            <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-4'>Kenali Layanan Kesehatan Kami</h2>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
              Run-Madan 2026 adalah kesempatan untuk mengenal lebih dekat layanan kesehatan gratis yang telah kami sediakan untuk warga Rewwin dan
              sekitarnya
            </p>
          </div>

          {/* Main Health Services */}
          <div className='max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12'>
            {/* Poliklinik */}
            <div className='bg-white rounded-2xl p-8 shadow-xl border-2 border-[#043e75]'>
              <div className='w-16 h-16 rounded-xl bg-gradient-to-r from-[#043e75] to-[#4e8fc0] flex items-center justify-center mb-6'>
                <Building2 className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-black text-[#043e75] mb-4'>Poliklinik Al Muhajirin</h3>
              <p className='text-gray-700 mb-4'>
                Layanan kesehatan umum yang <strong>GRATIS</strong> untuk seluruh warga Rewwin dan sekitarnya.
              </p>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span>Pemeriksaan kesehatan umum</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span>Konsultasi kesehatan dengan dokter</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span>Pelayanan ramah dan profesional</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span>
                    <strong>Gratis - Donasi Sukarela Diterima</strong>
                  </span>
                </li>
              </ul>
            </div>

            {/* Ambulans */}
            <div className='bg-white rounded-2xl p-8 shadow-xl border-2 border-[#043e75]'>
              <div className='w-16 h-16 rounded-xl bg-gradient-to-r from-[#4e8fc0] to-[#72b4d7] flex items-center justify-center mb-6'>
                <Ambulance className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-black text-[#043e75] mb-4'>Layanan Ambulans 24/7</h3>
              <p className='text-gray-700 mb-4'>
                Ambulans siaga <strong>24 jam</strong> untuk keadaan darurat warga Rewwin - <strong>GRATIS</strong>.
              </p>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span>Siaga 24 jam setiap hari</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span>Respons cepat untuk keadaan darurat</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span>Petugas terlatih dan berpengalaman</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span>
                    <strong>Gratis - Donasi Sukarela Diterima</strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Special Programs */}
          <div className='max-w-5xl mx-auto space-y-8'>
            {/* Data Registration */}
            <div className='bg-gradient-to-br from-[#addbf2] to-white rounded-2xl p-8 border-2 border-[#043e75] shadow-lg'>
              <div className='flex items-start gap-6'>
                <div className='w-16 h-16 rounded-xl bg-[#043e75] flex items-center justify-center flex-shrink-0'>
                  <Users className='h-8 w-8 text-white' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-black text-[#043e75] mb-3'>Pendataan Peserta untuk Layanan Kesehatan</h3>
                  <p className='text-gray-700 mb-4'>
                    <strong>Setelah event lari selesai</strong>, peserta akan mendapat kesempatan untuk mendaftar dan mendata informasi diri agar
                    lebih mudah dikenali saat menggunakan layanan Poliklinik dan Ambulans di masa mendatang.
                  </p>
                  <div className='bg-white rounded-xl p-4 border border-[#043e75]'>
                    <p className='text-sm text-gray-600 mb-2'>
                      <strong>Manfaat Pendataan:</strong>
                    </p>
                    <ul className='space-y-2 text-sm text-gray-600'>
                      <li className='flex items-start gap-2'>
                        <CheckCircle2 className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                        <span>Rekam medis lebih terorganisir</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckCircle2 className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                        <span>Pelayanan lebih cepat saat keadaan darurat</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckCircle2 className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                        <span>Notifikasi program kesehatan khusus (lansia, ibu hamil, dll)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Elderly Check-up Program */}
            <div className='bg-gradient-to-br from-white to-[#addbf2]/30 rounded-2xl p-8 border-2 border-[#4e8fc0] shadow-lg'>
              <div className='flex items-start gap-6'>
                <div className='w-16 h-16 rounded-xl bg-gradient-to-r from-[#4e8fc0] to-[#043e75] flex items-center justify-center flex-shrink-0'>
                  <HeartPulse className='h-8 w-8 text-white' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-black text-[#043e75] mb-3'>Program Check-Up Lansia</h3>
                  <p className='text-gray-700 mb-4'>
                    Bagi lansia yang bersedia, kami menawarkan <strong>jadwal kunjungan check-up dan konsultasi kesehatan</strong> rutin di Poliklinik
                    Al Muhajirin.
                  </p>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='bg-white rounded-xl p-4 border border-[#043e75]'>
                      <p className='font-bold text-[#043e75] mb-2'>Jadwal Layanan:</p>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        <li className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4 text-[#043e75]' />
                          <span>Selasa & Kamis</span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <Clock className='h-4 w-4 text-[#043e75]' />
                          <span>Setiap 3 bulan sekali</span>
                        </li>
                      </ul>
                    </div>
                    <div className='bg-white rounded-xl p-4 border border-[#043e75]'>
                      <p className='font-bold text-[#043e75] mb-2'>Layanan Meliputi:</p>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        <li>• Pemeriksaan tekanan darah</li>
                        <li>• Pemeriksaan gula darah</li>
                        <li>• Konsultasi kesehatan</li>
                        <li>• Edukasi pola hidup sehat</li>
                      </ul>
                    </div>
                  </div>
                  <div className='mt-4 bg-[#addbf2] rounded-lg p-3 text-center'>
                    <p className='text-sm font-bold text-[#043e75]'>✨ Gratis - Donasi Sukarela Diterima ✨</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aquatic Exercise Program */}
            <div className='bg-gradient-to-br from-[#72b4d7]/20 to-white rounded-2xl p-8 border-2 border-[#72b4d7] shadow-lg'>
              <div className='flex items-start gap-6'>
                <div className='w-16 h-16 rounded-xl bg-gradient-to-r from-[#72b4d7] to-[#4e8fc0] flex items-center justify-center flex-shrink-0'>
                  <Activity className='h-8 w-8 text-white' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-black text-[#043e75] mb-3'>Senam Air untuk Ibu-Ibu Lansia</h3>
                  <p className='text-gray-700 mb-4'>
                    Program <strong>senam kesehatan di kolam renang</strong> (aqua aerobics/terapi air) khusus untuk ibu-ibu lansia. Aktivitas ini
                    sangat baik untuk melatih dan mempertahankan kekuatan tulang tanpa membebani sendi.
                  </p>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='bg-white rounded-xl p-4 border border-[#72b4d7]'>
                      <p className='font-bold text-[#043e75] mb-2'>Detail Program:</p>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        <li className='flex items-start gap-2'>
                          <CheckCircle2 className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                          <span>Kolam kedalaman maksimal 90 cm</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <CheckCircle2 className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                          <span>Lokasi: Kolam Renang Al Muhajirin</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <CheckCircle2 className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                          <span>Dipandu instruktur berpengalaman</span>
                        </li>
                      </ul>
                    </div>
                    <div className='bg-white rounded-xl p-4 border border-[#72b4d7]'>
                      <p className='font-bold text-[#043e75] mb-2'>Manfaat Senam Air:</p>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        <li>• Melatih kekuatan tulang</li>
                        <li>• Tidak membebani sendi</li>
                        <li>• Meningkatkan fleksibilitas</li>
                        <li>• Terapi relaksasi</li>
                      </ul>
                    </div>
                  </div>
                  <div className='mt-4 bg-[#72b4d7]/30 rounded-lg p-3 text-center'>
                    <p className='text-sm font-bold text-[#043e75]'>📋 Pendaftaran Setelah Event Lari Selesai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className='max-w-4xl mx-auto mt-12 bg-gradient-to-br from-[#043e75] to-[#4e8fc0] rounded-2xl p-8 text-white text-center'>
            <h3 className='text-2xl md:text-3xl font-black mb-4 text-[#addbf2]'>Layanan Gratis, Donasi Sukarela Diterima</h3>
            <p className='text-lg text-white/90 mb-6'>
              Semua layanan kesehatan kami bersifat <strong>GRATIS</strong> untuk masyarakat. Di sisi lain, kami juga membuka kesempatan bagi siapa
              saja yang ingin menjadi <strong>donatur tetap</strong> untuk mendukung keberlanjutan program layanan kesehatan ini.
            </p>
            <div className='flex flex-wrap gap-4 justify-center'>
              <a
                href='https://lazmu.muhajirinrewwin.or.id'
                target='_blank'
                rel='noopener noreferrer'
                className='bg-white text-[#043e75] px-8 py-3 rounded-xl font-bold hover:bg-[#addbf2] transition-all duration-300 inline-flex items-center gap-2'
              >
                <Heart className='h-5 w-5' />
                Jadi Donatur Tetap
                <ArrowRight className='h-5 w-5' />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Event Category */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-4'>Informasi Pendaftaran</h2>
            <p className='text-lg text-gray-600'>Run-Madan 2026 - Lari santai 3K untuk semua usia!</p>
          </div>

          {/* Simplified Registration Info */}
          <div className='max-w-3xl mx-auto mb-12'>
            <div className='bg-gradient-to-br from-[#72b4d7] via-[#4e8fc0] to-[#043e75] rounded-3xl p-6 md:p-8 shadow-2xl text-white text-center relative overflow-hidden group'>
              {/* Animated gradient overlay */}
              <div className='absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

              <div className='relative z-10'>
                <div className='w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110'>
                  <Users className='h-8 w-8 md:h-10 md:w-10 text-white' />
                </div>

                <h3 className='text-2xl md:text-3xl font-black mb-2'>3K Fun Run</h3>
                <p className='text-lg md:text-xl text-white/90 mb-6 md:mb-8'>Semua Usia - Anak-anak, Dewasa, Keluarga</p>

                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-6 border border-white/20 transition-all duration-300 group-hover:bg-white/15'>
                  <div className='text-xs md:text-sm font-bold text-white/80 mb-2'>Biaya Pendaftaran:</div>
                  <div className='text-4xl md:text-5xl font-black text-white'>Rp 100.000</div>
                </div>

                <div className='bg-yellow-400/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border-2 border-yellow-300 mb-6'>
                  <div className='flex items-start gap-3 justify-center'>
                    <AlertCircle className='h-5 w-5 text-yellow-100 mt-0.5 flex-shrink-0' />
                    <p className='text-xs md:text-sm font-bold text-yellow-50'>Anak-anak wajib didampingi orang tua/wali</p>
                  </div>
                </div>

                <button
                  onClick={scrollToRegistration}
                  className='w-full bg-white text-[#043e75] px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-[#addbf2] transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 min-h-[48px]'
                >
                  <Users className='h-5 w-5' />
                  Daftar Sekarang
                  <ArrowRight className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>

          {/* Unified Benefits Section */}
          <div className='max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg'>
            <h3 className='text-2xl font-black text-gray-900 mb-6 flex items-center gap-3'>
              <Gift className='h-7 w-7 text-[#043e75]' />
              Yang Kamu Dapatkan:
            </h3>
            <div className='grid md:grid-cols-2 gap-4'>
              {allBenefits.map((benefit, index) => (
                <div key={index} className='flex items-start gap-3'>
                  <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span className='text-gray-700 leading-relaxed'>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code Section - PROMINENT */}
      <section className='py-16 bg-gradient-to-br from-[#addbf2] to-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white rounded-3xl p-6 md:p-10 shadow-2xl border-4 border-[#043e75]'>
              <div className='text-center mb-6'>
                <div className='w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#043e75] to-[#4e8fc0] flex items-center justify-center'>
                  <AlertCircle className='h-10 w-10 text-white' />
                </div>
                <h2 className='text-3xl md:text-4xl font-black text-[#043e75] mb-3'>Ketentuan Pakaian Peserta</h2>
                <p className='text-lg text-gray-700 font-semibold'>Wajib Dipatuhi oleh Seluruh Peserta</p>
              </div>

              <div className='space-y-6'>
                {/* Main requirement - Very prominent */}
                <div className='bg-gradient-to-r from-[#043e75] to-[#4e8fc0] rounded-2xl p-6 md:p-8 text-white'>
                  <div className='flex items-start gap-4'>
                    <CheckCircle2 className='h-8 w-8 flex-shrink-0 mt-1' />
                    <div>
                      <h3 className='text-2xl font-black mb-3 text-[#addbf2]'>Pakaian Menutup Aurat Secara Layak</h3>
                      <p className='text-lg leading-relaxed mb-4'>
                        <strong>SELURUH PESERTA</strong> diwajibkan mengenakan pakaian yang menutup aurat secara Islami dan layak, sesuai dengan nilai-nilai kesopanan dan keislaman.
                      </p>
                      <div className='bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40'>
                        <p className='text-lg font-bold mb-2'>Khusus untuk Peserta Perempuan:</p>
                        <ul className='space-y-2 text-base'>
                          <li className='flex items-start gap-2'>
                            <Star className='h-5 w-5 mt-0.5 flex-shrink-0 text-[#addbf2]' />
                            <span>Wajib mengenakan <strong>jilbab/kerudung</strong> yang menutup kepala, leher, dan dada</span>
                          </li>
                          <li className='flex items-start gap-2'>
                            <Star className='h-5 w-5 mt-0.5 flex-shrink-0 text-[#addbf2]' />
                            <span>Pakaian <strong>tidak ketat</strong> dan menutup aurat dengan sempurna</span>
                          </li>
                          <li className='flex items-start gap-2'>
                            <Star className='h-5 w-5 mt-0.5 flex-shrink-0 text-[#addbf2]' />
                            <span>Celana/rok panjang yang <strong>longgar</strong> dan tidak transparan</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional notes */}
                <div className='bg-[#addbf2]/30 rounded-xl p-6 border-2 border-[#043e75]'>
                  <div className='flex items-start gap-3'>
                    <Heart className='h-6 w-6 text-[#043e75] mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='text-gray-800 leading-relaxed'>
                        Ketentuan ini dibuat untuk menjaga nilai-nilai keislaman dan kenyamanan bersama. Peserta yang <strong>tidak memenuhi ketentuan pakaian</strong> akan diminta untuk memperbaiki terlebih dahulu sebelum mengikuti acara.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='text-center pt-2'>
                  <p className='text-sm text-gray-600 italic'>Jazakumullah khairan atas perhatian dan kepatuhannya 🤲</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Race Day Schedule */}
      <section className='py-16 bg-gradient-to-b from-gray-50 to-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-[#addbf2] text-[#043e75] px-4 py-2 rounded-full font-semibold mb-4'>
              <Sunrise className='h-5 w-5' />
              Race Day Schedule
            </div>
            <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-4'>Jadwal Hari H</h2>
            <p className='text-lg text-gray-600'>Minggu, 8 Februari 2026 - Mulai pukul 05:30 WIB</p>
          </div>

          <div className='max-w-4xl mx-auto'>
            <div className='space-y-4'>
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className='bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 flex items-center gap-6'
                >
                  <div className='w-14 h-14 rounded-xl bg-gradient-to-r from-[#4e8fc0] to-[#043e75] flex items-center justify-center flex-shrink-0'>
                    <item.icon className='h-7 w-7 text-white' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-black text-[#043e75] text-sm mb-1'>{item.time}</div>
                    <div className='text-lg font-bold text-gray-900'>{item.activity}</div>
                  </div>
                  <ChevronRight className='h-6 w-6 text-gray-400' />
                </div>
              ))}
            </div>

            {/* Special Event: Health Exercise */}
            <div className='mt-8 bg-[#addbf2] rounded-2xl p-8 border-2 border-[#043e75]'>
              <div className='flex items-start gap-4'>
                <div className='w-16 h-16 rounded-xl bg-[#043e75] flex items-center justify-center flex-shrink-0'>
                  <HeartPulse className='h-8 w-8 text-white' />
                </div>
                <div>
                  <h3 className='text-2xl font-black mb-2 text-[#043e75]'>Senam Terapi Kesehatan</h3>
                  <p className='text-gray-700 mb-4'>
                    Khusus untuk Ibu-ibu dan Lansia yang ingin tetap aktif tanpa harus berlari. Senam dipandu oleh instruktur profesional dengan
                    gerakan yang menyehatkan dan menyenangkan.
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    <span className='bg-[#043e75] text-white px-4 py-2 rounded-lg text-sm font-semibold'>GRATIS untuk peserta</span>
                    <span className='bg-[#043e75] text-white px-4 py-2 rounded-lg text-sm font-semibold'>Berlangsung selama event</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beginner Runners Community Image Section */}
      <section className='py-16 bg-gradient-to-b from-white to-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto'>
            <div className='relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl'>
              <Image src='/images/events/sahabat-berlari.jpg' alt='Komunitas pelari pemula berlari bersama' fill className='object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-8 md:p-12'>
                <h3 className='text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-xl'>
                  Membangun Motivasi Lari Bersama Komunitas
                </h3>
                <p className='text-lg md:text-xl text-white/95 font-semibold drop-shadow-lg max-w-3xl'>
                  Run-Madan adalah ruang aman bagi pelari pemula untuk menemukan motivasi, belajar teknik berlari yang benar, dan membangun kebiasaan
                  sehat bersama komunitas yang suportif. Tidak ada tekanan, hanya semangat untuk berkembang bersama!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edukasi & Sharing Session */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-[#043e75] text-white px-4 py-2 rounded-full font-semibold mb-4'>
              <Activity className='h-5 w-5' />
              Bonus Edukasi Kesehatan
            </div>
            <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-4'>Edukasi & Sharing Session</h2>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
              Setelah selesai lari, peserta akan mendapatkan <strong>sesi edukasi kesehatan GRATIS</strong> dengan materi praktis dan aplikatif dari
              para ahli
            </p>
          </div>

          <div className='max-w-5xl mx-auto space-y-8'>
            {/* From Couch to 5K */}
            <div className='bg-gradient-to-br from-[#4e8fc0]/10 to-white rounded-2xl p-8 border-2 border-[#4e8fc0] shadow-lg hover:shadow-xl transition-shadow duration-300'>
              <div className='flex items-start gap-6'>
                <div className='w-16 h-16 rounded-xl bg-gradient-to-r from-[#4e8fc0] to-[#043e75] flex items-center justify-center flex-shrink-0'>
                  <Target className='h-8 w-8 text-white' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-black text-[#043e75] mb-3'>&quot;From Couch to 5K&quot;</h3>
                  <p className='text-lg text-gray-700 mb-4'>
                    <strong>Pengenalan tahapan berlari yang aman bagi pemula.</strong> Pelajari bagaimana memulai kebiasaan lari dari nol hingga bisa
                    menyelesaikan 5 kilometer dengan aman dan nyaman.
                  </p>
                  <div className='bg-white rounded-xl p-5 border border-[#4e8fc0]'>
                    <p className='font-bold text-[#043e75] mb-3'>Materi yang akan dibahas:</p>
                    <div className='grid md:grid-cols-2 gap-3'>
                      <div className='flex items-start gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                        <span className='text-sm text-gray-700'>Tahapan memulai lari untuk pemula</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                        <span className='text-sm text-gray-700'>Program latihan bertahap 0-5K</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                        <span className='text-sm text-gray-700'>Cara menghindari overtraining</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                        <span className='text-sm text-gray-700'>Tips membangun konsistensi lari</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terapi Running */}
            <div className='bg-gradient-to-br from-[#72b4d7]/10 to-white rounded-2xl p-8 border-2 border-[#72b4d7] shadow-lg hover:shadow-xl transition-shadow duration-300'>
              <div className='flex items-start gap-6'>
                <div className='w-16 h-16 rounded-xl bg-gradient-to-r from-[#72b4d7] to-[#4e8fc0] flex items-center justify-center flex-shrink-0'>
                  <HeartPulse className='h-8 w-8 text-white' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-black text-[#043e75] mb-3'>&quot;Terapi Running untuk Pemulihan Kesehatan&quot;</h3>
                  <p className='text-lg text-gray-700 mb-4'>
                    <strong>Pemanfaatan lari sebagai bagian dari pemulihan kebugaran dan kesehatan mental.</strong> Pahami manfaat lari untuk
                    kesehatan fisik dan mental, serta cara memanfaatkannya dengan benar.
                  </p>
                  <div className='bg-white rounded-xl p-5 border border-[#72b4d7]'>
                    <p className='font-bold text-[#043e75] mb-3'>Materi yang akan dibahas:</p>
                    <div className='grid md:grid-cols-2 gap-3'>
                      <div className='flex items-start gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                        <span className='text-sm text-gray-700'>Lari untuk kesehatan jantung</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                        <span className='text-sm text-gray-700'>Lari untuk kesehatan mental</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                        <span className='text-sm text-gray-700'>Pemulihan pasca sakit dengan lari</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                        <span className='text-sm text-gray-700'>Manajemen stres melalui lari</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diskusi Ringan */}
            <div className='bg-gradient-to-br from-[#addbf2]/20 to-white rounded-2xl p-8 border-2 border-[#addbf2] shadow-lg'>
              <div className='flex items-start gap-6'>
                <div className='w-16 h-16 rounded-xl bg-gradient-to-r from-[#addbf2] to-[#72b4d7] flex items-center justify-center flex-shrink-0'>
                  <Users className='h-8 w-8 text-white' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-black text-[#043e75] mb-3'>Diskusi & Tanya Jawab Ringan</h3>
                  <p className='text-lg text-gray-700 mb-4'>
                    Sesi interaktif dengan para ahli untuk membahas topik kesehatan praktis seputar lari dan olahraga
                  </p>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='bg-white rounded-xl p-4 border border-[#addbf2]'>
                      <p className='font-bold text-[#043e75] mb-2 text-sm'>Topik Diskusi:</p>
                      <ul className='space-y-2 text-sm text-gray-700'>
                        <li className='flex items-start gap-2'>
                          <ChevronRight className='h-4 w-4 text-[#043e75] mt-0.5 flex-shrink-0' />
                          <span>Pencegahan cedera saat lari</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <ChevronRight className='h-4 w-4 text-[#043e75] mt-0.5 flex-shrink-0' />
                          <span>Teknik pernapasan yang benar</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <ChevronRight className='h-4 w-4 text-[#043e75] mt-0.5 flex-shrink-0' />
                          <span>Kebiasaan lari yang sehat</span>
                        </li>
                      </ul>
                    </div>
                    <div className='bg-white rounded-xl p-4 border border-[#addbf2]'>
                      <p className='font-bold text-[#043e75] mb-2 text-sm'>Yang Sering Ditanyakan:</p>
                      <ul className='space-y-2 text-sm text-gray-700'>
                        <li className='flex items-start gap-2'>
                          <ChevronRight className='h-4 w-4 text-[#043e75] mt-0.5 flex-shrink-0' />
                          <span>Kesalahan umum pelari pemula</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <ChevronRight className='h-4 w-4 text-[#043e75] mt-0.5 flex-shrink-0' />
                          <span>Kapan waktu terbaik untuk lari?</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <ChevronRight className='h-4 w-4 text-[#043e75] mt-0.5 flex-shrink-0' />
                          <span>Nutrisi untuk pelari pemula</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA for Education */}
          <div className='max-w-4xl mx-auto mt-12 bg-gradient-to-br from-[#043e75] to-[#4e8fc0] rounded-2xl p-8 text-white text-center'>
            <h3 className='text-2xl md:text-3xl font-black mb-4 text-[#addbf2]'>Materi Sederhana & Aplikatif</h3>
            <p className='text-lg text-white/90'>
              Semua materi disampaikan dengan bahasa yang mudah dipahami dan langsung bisa dipraktikkan.{' '}
              <strong>GRATIS untuk semua peserta Run-Madan 2026!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Route Information */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-4'>Informasi Rute</h2>
            <p className='text-lg text-gray-600'>Rute lari di lingkungan Perumahan Rewwin yang aman dan nyaman</p>
          </div>

          <div className='max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-12'>
            {routeDetails.map((detail, index) => (
              <div
                key={index}
                className='text-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 hover:shadow-lg transition-shadow duration-300'
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${detail.color} flex items-center justify-center`}>
                  <detail.icon className='h-10 w-10 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>{detail.title}</h3>
                <p className='text-gray-600'>{detail.description}</p>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* Charity Impact */}
      <section className='py-16 bg-gradient-to-br from-[#043e75] via-[#4e8fc0] to-[#72b4d7] text-white relative overflow-hidden'>
        {/* Decorative elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-0 right-0 w-96 h-96 bg-[#addbf2]/20 rounded-full blur-3xl' />
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl' />
        </div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold mb-4'>
              <Heart className='h-5 w-5' />
              Charity Impact
            </div>
            <h2 className='text-4xl md:text-5xl font-black mb-4 text-[#addbf2]'>Dana untuk Kebaikan</h2>
            <p className='text-xl text-white/90 max-w-3xl mx-auto'>
              Sebagian dana pendaftaran disalurkan untuk mendukung operasional layanan kesehatan <strong>GRATIS</strong> dan program sosial masyarakat.
              Layanan ambulans dan poliklinik tetap gratis - donasi sukarela sangat dihargai untuk keberlanjutan program.
            </p>
          </div>

          <div className='max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-12'>
            {charityImpacts.map((impact, index) => (
              <div
                key={index}
                className='bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300'
              >
                <div className='relative aspect-video w-full'>
                  <Image src={impact.image} alt={impact.title} fill className='object-cover' />
                </div>
                <div className='p-6'>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${impact.color} flex items-center justify-center mb-4`}>
                    <impact.icon className='h-8 w-8 text-white' />
                  </div>
                  <h3 className='text-xl font-bold mb-3 text-white'>{impact.title}</h3>
                  <p className='text-white/90'>{impact.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* LAZMU Partnership */}
          <div className='max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center'>
            <h3 className='text-2xl font-bold mb-4 text-white'>Partnership dengan LAZMU</h3>
            <p className='text-white/90 mb-6'>
              Run-Madan 2026 didukung oleh <strong>LAZ Muhajirin (LAZMU)</strong>, lembaga zakat terpercaya yang telah berpengalaman dalam penyaluran
              dana amal untuk masyarakat. Semua layanan kesehatan kami bersifat <strong>GRATIS</strong> - kami sangat menghargai donasi sukarela untuk
              keberlanjutan program.
            </p>
            <div className='flex flex-wrap gap-4 justify-center'>
              <a
                href='https://lazmu.muhajirinrewwin.or.id'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 bg-white text-[#043e75] px-6 py-3 rounded-xl font-bold hover:bg-[#addbf2] transition-all duration-300'
              >
                Pelajari Lebih Lanjut tentang LAZMU
                <ArrowRight className='h-5 w-5' />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-4'>Cara Pendaftaran</h2>
              <p className='text-lg text-gray-600'>Ikuti langkah-langkah mudah berikut untuk mendaftar Run-Madan 2026</p>
            </div>

            {/* Steps */}
            <div className='space-y-6 mb-12'>
              {[
                {
                  step: 1,
                  title: 'Siapkan Data Peserta',
                  description: 'Siapkan data peserta: nama lengkap, usia, nomor HP, ukuran jersey (S, M, L, XL, XXL)',
                  icon: Users,
                },
                {
                  step: 2,
                  title: 'Transfer Biaya Pendaftaran',
                  description: 'Transfer Rp 100.000 ke rekening BRI 0211.01.004859.53.6 a.n. Al Muhajirin Rewwin',
                  icon: Wallet,
                },
                {
                  step: 3,
                  title: 'Konfirmasi via WhatsApp',
                  description: 'Kirim bukti transfer + data peserta (nama, usia, ukuran jersey) ke WhatsApp +62 812-5906-069',
                  icon: Phone,
                },
                {
                  step: 4,
                  title: 'Tunggu Konfirmasi',
                  description: 'Tim panitia akan mengkonfirmasi pendaftaran dan mengirimkan nomor peserta (bib number)',
                  icon: CheckCircle2,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className='flex gap-6 items-start bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all duration-300'
                >
                  <div className='w-14 h-14 rounded-xl bg-gradient-to-r from-[#4e8fc0] to-[#043e75] flex items-center justify-center flex-shrink-0'>
                    <span className='text-2xl font-black text-white'>{item.step}</span>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <item.icon className='h-6 w-6 text-[#043e75]' />
                      <h3 className='text-xl font-bold text-gray-900'>{item.title}</h3>
                    </div>
                    <p className='text-gray-600'>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bank Account & Payment Methods */}
            <div className='bg-[#addbf2] rounded-2xl p-8'>
              <h3 className='text-2xl font-bold mb-6 text-center text-[#043e75]'>Metode Pembayaran</h3>

              {/* Bank Transfer */}
              <div className='bg-white rounded-xl p-6 border-2 border-[#043e75] mb-6 shadow-lg'>
                <h4 className='text-lg font-bold text-center text-[#043e75] mb-4'>Transfer Bank</h4>
                <div className='grid md:grid-cols-3 gap-4 text-center mb-4'>
                  <div>
                    <div className='text-sm text-gray-600 mb-1'>Bank</div>
                    <div className='text-xl font-black text-[#043e75]'>BRI</div>
                  </div>
                  <div>
                    <div className='text-sm text-gray-600 mb-1'>Nomor Rekening</div>
                    <div className='text-xl font-black text-[#043e75]'>0211.01.004859.53.6</div>
                  </div>
                  <div>
                    <div className='text-sm text-gray-600 mb-1'>Atas Nama</div>
                    <div className='text-xl font-black text-[#043e75]'>Al Muhajirin Rewwin</div>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <button
                    onClick={handleCopy}
                    className='bg-[#043e75] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4e8fc0] transition-all duration-300 flex items-center gap-2 shadow-md'
                  >
                    {copied ? <Check className='h-5 w-5' /> : <Copy className='h-5 w-5' />}
                    {copied ? 'Tersalin!' : 'Salin Nomor Rekening'}
                  </button>
                </div>
              </div>

              {/* QRIS */}
              <div className='bg-white rounded-xl p-6 border-2 border-[#043e75] mb-6 shadow-lg'>
                <h4 className='text-lg font-bold text-center text-[#043e75] mb-4'>Scan QRIS</h4>
                <div className='max-w-md mx-auto'>
                  <Image
                    src='/images/QRIS-BRI-AlMuhajirin.jpeg'
                    alt='QRIS BRI Al Muhajirin'
                    width={400}
                    height={400}
                    className='w-full h-auto rounded-lg shadow-md'
                  />
                  <p className='text-center text-sm text-gray-600 mt-3 mb-4'>Scan untuk pembayaran via QRIS</p>
                  <div className='flex justify-center'>
                    <button
                      onClick={downloadQris}
                      className='bg-[#043e75] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4e8fc0] transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-xl'
                    >
                      <Download className='h-5 w-5' />
                      Download QRIS
                    </button>
                  </div>
                </div>
              </div>

              <div className='flex justify-center'>
                <button
                  onClick={handleWhatsApp}
                  className='bg-[#043e75] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4e8fc0] transition-all duration-300 flex items-center gap-3 shadow-md'
                >
                  <Phone className='h-5 w-5' />
                  Konfirmasi & Informasi: +62 812-5906-069
                  <ArrowRight className='h-5 w-5' />
                </button>
              </div>
            </div>

            {/* Important Notes */}
            <div className='mt-8 bg-yellow-50 rounded-2xl p-8 border border-yellow-200'>
              <h3 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <AlertCircle className='h-6 w-6 text-yellow-600' />
                Informasi Penting:
              </h3>
              <ul className='space-y-3 text-gray-700'>
                {/* Dress code - EMPHASIZED FIRST */}
                <li className='flex items-start gap-2 bg-[#043e75]/10 p-4 rounded-xl border-2 border-[#043e75]'>
                  <AlertCircle className='h-6 w-6 text-[#043e75] mt-0.5 flex-shrink-0' />
                  <span className='font-bold text-[#043e75]'>
                    <strong className='text-lg'>WAJIB:</strong> Seluruh peserta harus mengenakan pakaian yang <strong>menutup aurat secara layak dan Islami</strong>. Khususnya untuk peserta perempuan, wajib mengenakan jilbab/kerudung dan pakaian yang tidak ketat. Peserta yang tidak memenuhi ketentuan akan diminta memperbaiki pakaian terlebih dahulu.
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <Star className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                  <span>
                    Pendaftaran ditutup <strong>5 Februari 2026</strong> atau jika kuota terpenuhi
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <Star className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                  <span>
                    Jersey dan race kit akan dibagikan saat <strong>registrasi ulang</strong> pada race day
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <Star className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                  <span>
                    Biaya pendaftaran <strong>tidak dapat dikembalikan</strong> (non-refundable)
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <Star className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                  <span>
                    Peserta wajib dalam kondisi <strong>sehat dan fit</strong> pada hari H
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Couple Jogging Image Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto'>
            <div className='relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl'>
              <Image src='/images/events/pasangan-jogging.jpg' alt='Pasangan jogging bersama' fill className='object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-8 md:p-12'>
                <h3 className='text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-xl'>Bukan Lomba, Tapi Kebersamaan</h3>
                <p className='text-lg md:text-xl text-white/95 font-semibold drop-shadow-lg max-w-3xl'>
                  Run-Madan adalah tentang membangun gaya hidup sehat bersama, bukan tentang siapa yang paling cepat. Mari berlari santai dan nikmati
                  kebersamaan!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id='registration-form' className='py-20 bg-gradient-to-b from-white to-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto'>
            {/* Header */}
            <div className='text-center mb-12'>
              <div className='inline-flex items-center gap-2 bg-[#043e75] text-white px-4 py-2 rounded-full font-semibold mb-4'>
                <Users className='h-5 w-5' />
                Formulir Pendaftaran Online
              </div>
              <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-4'>Daftar Run-Madan 2026</h2>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                Isi formulir di bawah ini untuk mendaftar. Anda dapat mendaftarkan beberapa peserta sekaligus (diri sendiri, keluarga, atau teman).
              </p>
            </div>

            {/* Form Errors */}
            {formErrors.length > 0 && (
              <div className='mb-8 bg-red-50 border-2 border-red-500 rounded-xl p-6'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='h-6 w-6 text-red-600 flex-shrink-0 mt-0.5' />
                  <div className='flex-1'>
                    <h3 className='text-lg font-bold text-red-900 mb-2'>Mohon lengkapi data berikut:</h3>
                    <ul className='space-y-1'>
                      {formErrors.map((error, index) => (
                        <li key={index} className='text-red-700'>
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Registrant Information */}
              <div className='bg-white rounded-2xl p-8 shadow-lg border-2 border-[#043e75]'>
                <h3 className='text-2xl font-black text-[#043e75] mb-6 flex items-center gap-3'>
                  <User className='h-6 w-6' />
                  Data Pendaftar (Orang Tua/Wali/Penanggung Jawab)
                </h3>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>
                      Nama Lengkap <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={registrant.nama}
                      onChange={(e) => setRegistrant({ ...registrant, nama: e.target.value })}
                      className='w-full px-3 md:px-4 py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 focus:border-[#043e75] focus:outline-none min-h-[48px] transition-colors duration-200'
                      placeholder='Masukkan nama lengkap pendaftar'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>
                      Nomor HP (WhatsApp) <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='tel'
                      value={registrant.nomorHP}
                      onChange={(e) => setRegistrant({ ...registrant, nomorHP: e.target.value })}
                      className='w-full px-3 md:px-4 py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 focus:border-[#043e75] focus:outline-none min-h-[48px] transition-colors duration-200'
                      placeholder='08123456789'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>Email (Opsional)</label>
                    <input
                      type='email'
                      value={registrant.email}
                      onChange={(e) => setRegistrant({ ...registrant, email: e.target.value })}
                      className='w-full px-3 md:px-4 py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 focus:border-[#043e75] focus:outline-none min-h-[48px] transition-colors duration-200'
                      placeholder='email@example.com'
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>
                      Alamat Lengkap <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                      value={registrant.alamat}
                      onChange={(e) => setRegistrant({ ...registrant, alamat: e.target.value })}
                      className='w-full px-3 md:px-4 py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 focus:border-[#043e75] focus:outline-none min-h-[48px] transition-colors duration-200'
                      placeholder='Alamat lengkap termasuk RT/RW, Kelurahan, Kecamatan'
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-2xl font-black text-gray-900 flex items-center gap-3'>
                    <Activity className='h-6 w-6 text-[#043e75]' />
                    Data Peserta Lari
                  </h3>
                  <span className='text-sm font-bold text-gray-600'>
                    {participants.length} Peserta × Rp 100.000 = Rp {(participants.length * 100000).toLocaleString('id-ID')}
                  </span>
                </div>

                {participants.map((participant, index) => (
                  <div key={participant.id} className='bg-white rounded-2xl p-4 md:p-8 shadow-lg border-2 border-gray-300 relative transition-all duration-300 hover:shadow-xl'>
                    {/* Remove button */}
                    {participants.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeParticipant(participant.id)}
                        className='w-full md:w-auto md:absolute top-0 md:top-4 right-0 md:right-4 mb-4 md:mb-0 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-all duration-200 font-bold text-sm flex items-center justify-center gap-2 border-2 border-red-300 min-h-[44px]'
                        title='Hapus peserta ini'
                      >
                        <AlertCircle className='h-5 w-5' />
                        Hapus
                      </button>
                    )}

                    <h4 className='text-xl font-bold text-gray-900 mb-6'>
                      Peserta #{index + 1}
                      {participants.length > 1 && (
                        <span className='text-sm font-normal text-gray-500 ml-2'>(Klik tombol &quot;Hapus&quot; untuk menghapus)</span>
                      )}
                    </h4>

                    <div className='grid md:grid-cols-2 gap-6'>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-bold text-gray-700 mb-2'>
                          Nama Lengkap Peserta <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='text'
                          value={participant.namaLengkap}
                          onChange={(e) => updateParticipant(participant.id, 'namaLengkap', e.target.value)}
                          className='w-full px-3 md:px-4 py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 focus:border-[#043e75] focus:outline-none min-h-[48px] transition-colors duration-200'
                          placeholder='Masukkan nama lengkap peserta'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-bold text-gray-700 mb-2'>
                          Jenis Kelamin <span className='text-red-500'>*</span>
                        </label>
                        <select
                          value={participant.jenisKelamin}
                          onChange={(e) => updateParticipant(participant.id, 'jenisKelamin', e.target.value)}
                          className='w-full px-3 md:px-4 py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 focus:border-[#043e75] focus:outline-none min-h-[48px] transition-colors duration-200'
                          required
                        >
                          <option value='lelaki'>Laki-laki</option>
                          <option value='perempuan'>Perempuan</option>
                        </select>
                      </div>

                      <div>
                        <label className='block text-sm font-bold text-gray-700 mb-2'>
                          Tanggal Lahir <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='date'
                          value={participant.tanggalLahir}
                          onChange={(e) => updateParticipant(participant.id, 'tanggalLahir', e.target.value)}
                          className='w-full px-3 md:px-4 py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 focus:border-[#043e75] focus:outline-none min-h-[48px] transition-colors duration-200'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-bold text-gray-700 mb-2'>
                          Ukuran Kaos <span className='text-red-500'>*</span>
                        </label>
                        <select
                          value={participant.ukuranKaos}
                          onChange={(e) => updateParticipant(participant.id, 'ukuranKaos', e.target.value)}
                          className='w-full px-3 md:px-4 py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 focus:border-[#043e75] focus:outline-none min-h-[48px] transition-colors duration-200'
                          required
                        >
                          <option value='S'>S (Small)</option>
                          <option value='M'>M (Medium)</option>
                          <option value='L'>L (Large)</option>
                          <option value='XL'>XL (Extra Large)</option>
                          <option value='XXL'>XXL (Double XL)</option>
                        </select>
                      </div>

                      <div>
                        <label className='block text-sm font-bold text-gray-700 mb-2'>
                          Preferensi Aktivitas <span className='text-red-500'>*</span>
                        </label>
                        <select
                          value={participant.preferensiAktivitas}
                          onChange={(e) => updateParticipant(participant.id, 'preferensiAktivitas', e.target.value)}
                          className='w-full px-3 md:px-4 py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 focus:border-[#043e75] focus:outline-none min-h-[48px] transition-colors duration-200'
                          required
                        >
                          <option value='FULL_LARI'>Full Lari</option>
                          <option value='LARI_JALAN'>Lari + Jalan</option>
                          <option value='JALAN'>Jalan Saja</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Participant Button */}
                <button
                  type='button'
                  onClick={addParticipant}
                  className='w-full bg-[#addbf2] text-[#043e75] px-6 py-4 rounded-xl font-bold hover:bg-[#72b4d7] transition-all duration-300 flex items-center justify-center gap-3 border-2 border-[#043e75] border-dashed'
                >
                  <Users className='h-5 w-5' />
                  Tambah Peserta Lagi
                </button>
              </div>

              {/* Submit Button */}
              <div className='bg-gradient-to-br from-[#043e75] to-[#4e8fc0] rounded-2xl p-8 text-center'>
                <div className='mb-6'>
                  <div className='text-white/90 text-lg font-semibold mb-2'>Total Biaya Pendaftaran:</div>
                  <div className='text-5xl font-black text-[#addbf2]'>
                    Rp {(participants.length * 100000).toLocaleString('id-ID')}
                  </div>
                  <div className='text-white/80 text-sm mt-2'>{participants.length} Peserta × Rp 100.000</div>
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-white text-[#043e75] px-12 py-5 rounded-xl font-black text-xl hover:bg-[#addbf2] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto'
                >
                  {isSubmitting ? (
                    <>
                      <Activity className='h-6 w-6 animate-spin' />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='h-6 w-6' />
                      Daftar Sekarang
                      <ArrowRight className='h-6 w-6' />
                    </>
                  )}
                </button>

                <p className='text-white/80 text-sm mt-4'>
                  Setelah mendaftar, Anda akan mendapatkan nomor registrasi dan instruksi pembayaran
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && registrationData && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300'>
          <div className='bg-white rounded-2xl md:rounded-3xl max-w-2xl w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300'>
            <div className='bg-gradient-to-br from-[#043e75] to-[#4e8fc0] text-white p-4 md:p-8 rounded-t-2xl md:rounded-t-3xl'>
              <div className='text-center'>
                <div className='w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse'>
                  <CheckCircle2 className='h-8 w-8 md:h-10 md:w-10 text-[#addbf2] animate-bounce' />
                </div>
                <h3 className='text-2xl md:text-3xl font-black mb-2 text-[#addbf2]'>✅ Pendaftaran Berhasil!</h3>
                <p className='text-white/90 text-base md:text-lg font-semibold'>Terima kasih telah mendaftar Run-Madan 2026</p>
                <div className='mt-3 md:mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 inline-block'>
                  <p className='text-xs md:text-sm text-[#addbf2] font-bold'>📱 Segera lakukan pembayaran dan konfirmasi via WhatsApp</p>
                </div>
              </div>
            </div>

            <div className='p-4 md:p-8 space-y-4 md:space-y-6'>
              {/* Registration Number */}
              <div className='bg-[#addbf2]/20 rounded-xl p-6 border-2 border-[#043e75]'>
                <div className='text-sm font-bold text-gray-600 mb-2'>Nomor Registrasi:</div>
                <div className='text-3xl font-black text-[#043e75]'>{registrationData.nomorRegistrasi}</div>
                <div className='text-sm text-gray-600 mt-2'>
                  Simpan nomor ini untuk konfirmasi pembayaran
                </div>
              </div>

              {/* Registrant Info */}
              <div>
                <h4 className='font-bold text-gray-900 mb-3'>Data Pendaftar:</h4>
                <div className='space-y-2 text-gray-700'>
                  <div>
                    <span className='font-semibold'>Nama:</span> {registrationData.nama}
                  </div>
                  <div>
                    <span className='font-semibold'>Nomor HP:</span> {registrationData.nomorHP}
                  </div>
                  {registrationData.email && (
                    <div>
                      <span className='font-semibold'>Email:</span> {registrationData.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Participants */}
              <div>
                <h4 className='font-bold text-gray-900 mb-3'>Peserta yang Terdaftar:</h4>
                <div className='space-y-2'>
                  {registrationData.participants.map((p, index) => (
                    <div key={index} className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'>
                      <span className='font-medium text-gray-900'>
                        {index + 1}. {p.namaLengkap} ({p.usia} tahun)
                      </span>
                      <span className='text-sm font-bold text-[#043e75]'>{p.ukuranKaos}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Instructions */}
              <div className='bg-yellow-50 rounded-xl p-6 border-2 border-yellow-400'>
                <h4 className='font-black text-gray-900 mb-4 flex items-center gap-2'>
                  <Wallet className='h-5 w-5 text-yellow-600' />
                  Instruksi Pembayaran:
                </h4>
                <div className='space-y-3 text-gray-700'>
                  <div>
                    <div className='text-sm font-semibold'>Transfer ke:</div>
                    <div className='text-lg font-bold text-[#043e75]'>
                      BRI - 0211.01.004859.53.6
                    </div>
                    <div className='text-sm'>a.n. Al Muhajirin Rewwin</div>
                  </div>
                  <div>
                    <div className='text-sm font-semibold'>Total yang harus dibayar:</div>
                    <div className='text-2xl font-black text-[#043e75]'>
                      Rp {registrationData.totalBiaya.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className='bg-white rounded-lg p-4 border-2 border-[#043e75]'>
                    <button
                      onClick={() => setShowQrisInModal(!showQrisInModal)}
                      className='w-full flex items-center justify-between text-left font-semibold text-[#043e75] hover:text-[#4e8fc0] transition-colors duration-200'
                    >
                      <span className='flex items-center gap-2'>
                        <QrCode className='h-5 w-5' />
                        Atau scan QRIS
                      </span>
                      {showQrisInModal ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
                    </button>

                    {showQrisInModal && (
                      <div className='mt-4 space-y-3 animate-in fade-in duration-300'>
                        <div className='bg-gray-50 rounded-lg p-4'>
                          <Image
                            src='/images/QRIS-BRI-AlMuhajirin.jpeg'
                            alt='QRIS BRI Al Muhajirin'
                            width={400}
                            height={400}
                            className='w-full h-auto rounded-lg shadow-lg'
                          />
                          <p className='text-center text-xs text-gray-600 mt-2'>Scan QR Code untuk pembayaran</p>
                        </div>
                        <button
                          onClick={downloadQris}
                          className='w-full bg-[#043e75] text-white px-4 py-3 rounded-lg font-bold hover:bg-[#4e8fc0] transition-all duration-300 flex items-center justify-center gap-2 shadow-md'
                        >
                          <Download className='h-5 w-5' />
                          Download QRIS
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp Confirmation */}
              <div className='bg-gradient-to-br from-[#043e75] to-[#4e8fc0] rounded-xl p-6 text-white text-center'>
                <h4 className='font-bold mb-3'>Langkah Selanjutnya:</h4>
                <p className='text-white/90 mb-4 text-sm'>
                  Setelah transfer, konfirmasi pembayaran melalui WhatsApp dengan klik tombol di bawah:
                </p>
                <button
                  onClick={sendWhatsAppConfirmation}
                  className='bg-white text-[#043e75] px-8 py-4 rounded-xl font-bold hover:bg-[#addbf2] transition-all duration-300 flex items-center justify-center gap-3 w-full'
                >
                  <Phone className='h-5 w-5' />
                  Konfirmasi via WhatsApp
                  <ArrowRight className='h-5 w-5' />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className='w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300'
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-4'>Pertanyaan yang Sering Diajukan</h2>
              <p className='text-lg text-gray-600'>Temukan jawaban atas pertanyaan umummu di sini</p>
            </div>

            <div className='space-y-4'>
              {faqs.map((faq, index) => {
                const isHighlighted = index === faqs.length - 1; // Last FAQ (about dana)
                return (
                  <details
                    key={index}
                    className={`rounded-xl p-6 border-2 hover:shadow-lg transition-all duration-300 group ${
                      isHighlighted ? 'bg-[#addbf2]/30 border-[#043e75]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <summary
                      className={`font-bold cursor-pointer list-none flex items-center justify-between ${
                        isHighlighted ? 'text-[#043e75]' : 'text-gray-900'
                      }`}
                    >
                      <span className='flex-1'>{faq.question}</span>
                      <ChevronRight
                        className={`h-5 w-5 group-open:rotate-90 transition-transform duration-300 ${
                          isHighlighted ? 'text-[#043e75]' : 'text-gray-400'
                        }`}
                      />
                    </summary>
                    <p className={`mt-4 leading-relaxed font-medium ${isHighlighted ? 'text-gray-900' : 'text-gray-600'}`}>{faq.answer}</p>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='py-20 bg-gradient-to-br from-[#043e75] via-[#4e8fc0] to-[#72b4d7] text-white relative overflow-hidden'>
        {/* Decorative elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-40 -right-40 w-96 h-96 bg-[#addbf2]/20 rounded-full blur-3xl' />
          <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl' />
        </div>

        <div className='container mx-auto px-4 relative z-10 text-center'>
          <h2 className='text-4xl md:text-6xl font-black mb-6 text-[#addbf2]'>Siap Berlari untuk Kebaikan?</h2>
          <p className='text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto'>
            Daftarkan dirimu sekarang dan jadilah bagian dari Run-Madan 2026!
          </p>
          <p className='text-lg text-white/80 mb-8 max-w-2xl mx-auto'>
            Berlari sehat, berbagi kebaikan, dan kenali layanan kesehatan gratis untuk warga Rewwin
          </p>

          <div className='flex flex-wrap gap-6 justify-center items-center'>
            <button
              onClick={scrollToRegistration}
              className='bg-white text-[#043e75] px-10 py-5 rounded-xl font-black text-xl hover:bg-[#addbf2] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3'
            >
              <Users className='h-6 w-6' />
              Daftar Sekarang
              <ArrowRight className='h-6 w-6' />
            </button>

            <button
              onClick={handleShare}
              className='bg-white/10 backdrop-blur-sm border-2 border-white text-white px-10 py-5 rounded-xl font-black text-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-3'
            >
              <Share2 className='h-6 w-6' />
              Bagikan Event Ini
            </button>
          </div>

          <div className='mt-12 flex flex-wrap justify-center gap-8 text-white/80'>
            <div className='flex items-center gap-2'>
              <Phone className='h-5 w-5' />
              <span className='font-semibold'>WhatsApp Only: +62 812-5906-069</span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              <span className='font-semibold'>Masjid Al Muhajirin Rewwin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-8'>
        <div className='container mx-auto px-4 text-center'>
          <p className='text-gray-400'>
            &copy; 2026 Masjid Al Muhajirin Rewwin. Supported by{' '}
            <a href='/units/lazmu' className='text-[#72b4d7] hover:text-[#addbf2] font-semibold'>
              LAZ Muhajirin (LAZMU)
            </a>
          </p>
          <p className='text-gray-500 text-sm mt-2'>#RunMadan2026 #TarhibRamadhan #LariAmal #MasjidAlMuhajirin</p>
        </div>
      </footer>
    </div>
  );
}
