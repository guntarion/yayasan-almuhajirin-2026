// src/app/(WebsiteLayout)/biaya-pendaftaran/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { 
  Calculator,
  FileText,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  AlertCircle,
  Banknote,
  Smartphone,
  Building,
  Calendar,
  Baby,
  GraduationCap,
  Heart
} from 'lucide-react';

/**
 * Biaya & Pendaftaran page for Daycare Al Muhajirin Rewwin
 * Comprehensive pricing information, cost calculator, and registration process
 */
export default function BiayaPendaftaranPage() {
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [numChildren, setNumChildren] = useState(1);
  const [period, setPeriod] = useState(1);
  const [calculatedCost, setCalculatedCost] = useState<{
    registrationFee: number;
    entryFee: number;
    activityFee: number;
    totalInitial: number;
    monthlyFee: number;
    totalPeriod: number;
    dailyFee: number;
    numChildren: number;
    period: number;
  } | null>(null);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Biaya%20%26%20Pendaftaran%20Daycare%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const pricingFullday = [
    {
      ageGroup: "3 Bulan - 23 Bulan",
      icon: "👶",
      registrationFee: 150000,
      entryFee: 500000,
      activityFee: 250000,
      totalInitial: 900000,
      monthlyFee: 1500000,
      features: [
        "Pengasuhan fullday (07.00-17.00 WIB)",
        "Makan 2x + snack sore bergizi",
        "Program pembelajaran terstruktur",
        "Tidur siang dengan fasilitas lengkap",
        "Aktivitas kreatif dan motorik",
        "Pembiasaan ibadah dan akhlak",
        "Laporan perkembangan harian",
        "Konsultasi parenting gratis"
      ]
    },
    {
      ageGroup: "2 Tahun - 3 Tahun",
      icon: "🧒",
      registrationFee: 150000,
      entryFee: 500000,
      activityFee: 250000,
      totalInitial: 900000,
      monthlyFee: 1400000,
      features: [
        "Semua fasilitas paket 3-23 bulan",
        "Program pre-school preparation",
        "Toilet training intensif",
        "Pembelajaran akademik dasar",
        "Sosialisasi dengan teman sebaya"
      ]
    }
  ];

  const pricingAfterSchool = {
    internal: {
      registrationFee: 0,
      entryFee: 0,
      activityFee: 0,
      totalInitial: 0,
      monthlyFee: 900000
    },
    external: {
      registrationFee: 150000,
      entryFee: 500000,
      activityFee: 250000,
      totalInitial: 900000,
      monthlyFee: 900000
    },
    features: [
      "Pengasuhan setelah sekolah hingga 17.00 WIB",
      "Makan siang + snack sore",
      "Bimbingan PR dan aktivitas sekolah",
      "Program pengembangan bakat",
      "Kegiatan sosialisasi dan bermain",
      "Pembiasaan mengaji dan doa",
      "Rest time untuk pemulihan energi"
    ]
  };

  const pricingHarian = [
    {
      ageGroup: "2 Tahun - 6 Tahun (Internal)",
      registrationFee: 0,
      dailyFee: 80000,
      totalInitial: 0
    },
    {
      ageGroup: "2 Tahun - 6 Tahun (External)",
      registrationFee: 150000,
      dailyFee: 80000,
      totalInitial: 230000
    },
    {
      ageGroup: "3 Bulan - 23 Bulan",
      registrationFee: 150000,
      dailyFee: 90000,
      totalInitial: 240000
    }
  ];

  const promoPrograms = [
    {
      title: "Early Bird Discount",
      discount: "20%",
      description: "Diskon biaya pendaftaran untuk 10 pendaftar pertama setiap bulan",
      requirement: "Daftar 1 bulan sebelum mulai",
      icon: "🎉"
    },
    {
      title: "Family Package",
      discount: "15-25%",
      description: "Diskon SPP untuk anak kedua (15%) dan ketiga (25%)",
      requirement: "Saudara kandung yang bersamaan",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      title: "Referral Bonus",
      discount: "Rp 200.000",
      description: "Cashback untuk yang mereferensikan, diskon untuk yang direferensikan",
      requirement: "Minimal 3 bulan program",
      icon: "🤝"
    }
  ];

  const paymentMethods = [
    {
      category: "Transfer Bank",
      methods: [
        { name: "BCA", account: "1234567890", holder: "Yayasan Al Muhajirin Rewwin" },
        { name: "Mandiri", account: "0987654321", holder: "Yayasan Al Muhajirin Rewwin" },
        { name: "BRI", account: "5678901234", holder: "Yayasan Al Muhajirin Rewwin" }
      ] as { name: string; account: string; holder: string }[],
      icon: <Building className="h-6 w-6 text-blue-600" />
    },
    {
      category: "E-Wallet",
      methods: [
        { name: "GoPay", info: "Scan QR Code di tempat" },
        { name: "OVO", info: "Nomor terdaftar di administrasi" },
        { name: "DANA", info: "Link pembayaran via WhatsApp" }
      ] as { name: string; info: string }[],
      icon: <Smartphone className="h-6 w-6 text-green-600" />
    },
    {
      category: "Cash",
      methods: [
        { name: "Langsung", info: "Di kantor administrasi daycare" },
        { name: "Waktu", info: "Senin-Jumat 08.00-16.00 WIB" },
        { name: "Bukti", info: "Kwitansi pembayaran resmi" }
      ] as { name: string; info: string }[],
      icon: <Banknote className="h-6 w-6 text-purple-600" />
    }
  ];

  const registrationSteps = [
    {
      step: 1,
      title: "Konsultasi Awal",
      description: "Hubungi WhatsApp untuk diskusi kebutuhan anak",
      icon: <Phone className="h-8 w-8" />,
      details: ["Konsultasi gratis", "Diskusi kebutuhan anak", "Jadwalkan kunjungan", "Pilih program yang sesuai"]
    },
    {
      step: 2,
      title: "Kunjungan & Assessment", 
      description: "Tour fasilitas dan kenalan dengan tim pengasuh",
      icon: <Users className="h-8 w-8" />,
      details: ["Tour fasilitas", "Meet the team", "Child assessment", "Program recommendation"]
    },
    {
      step: 3,
      title: "Administrasi",
      description: "Isi formulir dan siapkan dokumen yang diperlukan",
      icon: <FileText className="h-8 w-8" />,
      details: ["Isi formulir pendaftaran", "Siapkan dokumen", "Pembayaran biaya", "Foto anak untuk administrasi"]
    },
    {
      step: 4,
      title: "Orientasi",
      description: "Briefing orang tua dan adaptasi anak",
      icon: <GraduationCap className="h-8 w-8" />,
      details: ["Parent orientation", "Child orientation", "Setup komunikasi", "Trial period 1 minggu"]
    },
    {
      step: 5,
      title: "Mulai Program",
      description: "Hari pertama dengan pendampingan khusus",
      icon: <Baby className="h-8 w-8" />,
      details: ["First day special", "Daily report dimulai", "Regular check-in", "Full integration"]
    }
  ];

  const requiredDocuments = [
    {
      category: "Untuk Anak",
      documents: [
        "Fotocopy Akta Kelahiran (2 lembar)",
        "Fotocopy Kartu Keluarga (2 lembar)", 
        "Pas Foto Anak 3x4 (4 lembar)",
        "Kartu Vaksinasi/Imunisasi (fotocopy)",
        "Surat Keterangan Sehat dari dokter"
      ],
      icon: <Baby className="h-6 w-6 text-blue-600" />
    },
    {
      category: "Untuk Orang Tua",
      documents: [
        "Fotocopy KTP Ayah (2 lembar)",
        "Fotocopy KTP Ibu (2 lembar)",
        "Nomor Kontak Darurat (min. 2 orang)",
        "Alamat Lengkap tempat tinggal dan kerja",
        "Form Persetujuan yang sudah ditandatangani"
      ],
      icon: <Users className="h-6 w-6 text-green-600" />
    },
    {
      category: "Informasi Kesehatan",
      documents: [
        "Riwayat Alergi (makanan, obat, dll)",
        "Kondisi Kesehatan Khusus (jika ada)",
        "Obat-obatan Rutin (jika ada)",
        "Kontak Dokter Anak (jika ada)",
        "Asuransi Kesehatan (jika ada)"
      ],
      icon: <Heart className="h-6 w-6 text-red-600" />
    }
  ];

  const faqs = [
    {
      question: "Apakah ada biaya tersembunyi?",
      answer: "Tidak ada sama sekali. Semua biaya sudah transparan dan tertera. Satu-satunya biaya tambahan hanya overtime jika jemput setelah jam 17.00."
    },
    {
      question: "Bisakah bayar SPP dengan cicilan?",
      answer: "SPP dibayar bulanan, tidak ada cicilan dalam 1 bulan. Namun ada opsi pembayaran di muka untuk 6-12 bulan dengan diskon."
    },
    {
      question: "Bagaimana jika anak sakit dan tidak masuk?",
      answer: "SPP tetap dibayar penuh karena slot tetap reserved. Namun ada kebijakan refund untuk sakit >2 minggu dengan surat dokter."
    },
    {
      question: "Apakah ada diskon untuk anak kedua?",
      answer: "Ya, ada family package dengan diskon 15% untuk anak kedua dan 25% untuk anak ketiga dalam keluarga yang sama."
    },
    {
      question: "Bagaimana dengan libur panjang?",
      answer: "Daycare tetap buka saat libur sekolah. Libur hanya mengikuti kalender nasional. SPP tetap dibayar penuh."
    },
    {
      question: "Bisakah upgrade dari harian ke bulanan?",
      answer: "Bisa kapan saja. Tinggal bayar selisih biaya pendaftaran dan mulai SPP bulan berikutnya."
    }
  ];

  const calculateCost = () => {
    if (!selectedAge || !selectedProgram || !selectedStatus) {
      alert('Mohon lengkapi semua pilihan untuk menghitung biaya');
      return;
    }

    let registrationFee = 0;
    let entryFee = 0;
    let activityFee = 0;
    let monthlyFee = 0;
    let dailyFee = 0;

    // Calculate based on program type
    if (selectedProgram === 'fullday') {
      if (selectedAge === '3-23months') {
        registrationFee = 150000;
        entryFee = 500000;
        activityFee = 250000;
        monthlyFee = 1500000;
      } else if (selectedAge === '2-3years') {
        registrationFee = 150000;
        entryFee = 500000;
        activityFee = 250000;
        monthlyFee = 1400000;
      }
    } else if (selectedProgram === 'afterschool') {
      if (selectedStatus === 'internal') {
        registrationFee = 0;
        entryFee = 0;
        activityFee = 0;
      } else {
        registrationFee = 150000;
        entryFee = 500000;
        activityFee = 250000;
      }
      monthlyFee = 900000;
    } else if (selectedProgram === 'harian') {
      if (selectedAge === '2-6years') {
        if (selectedStatus === 'internal') {
          registrationFee = 0;
        } else {
          registrationFee = 150000;
        }
        dailyFee = 80000;
      } else if (selectedAge === '3-23months') {
        registrationFee = 150000;
        dailyFee = 90000;
      }
    }

    // Apply family discount
    let discountedMonthlyFee = monthlyFee;
    if (numChildren > 1) {
      // First child full price, second child 15% discount, third+ 25% discount
      const secondChildDiscount = monthlyFee * 0.15;
      const thirdPlusDiscount = monthlyFee * 0.25;
      
      if (numChildren === 2) {
        discountedMonthlyFee = monthlyFee + (monthlyFee - secondChildDiscount);
      } else if (numChildren >= 3) {
        discountedMonthlyFee = monthlyFee + (monthlyFee - secondChildDiscount) + ((numChildren - 2) * (monthlyFee - thirdPlusDiscount));
      }
    } else {
      discountedMonthlyFee = monthlyFee * numChildren;
    }

    const totalInitial = (registrationFee + entryFee + activityFee) * numChildren;
    const totalMonthly = selectedProgram === 'harian' ? dailyFee * numChildren * 22 : discountedMonthlyFee; // Assume 22 working days for daily
    const totalPeriod = totalInitial + (totalMonthly * period);

    setCalculatedCost({
      registrationFee: registrationFee * numChildren,
      entryFee: entryFee * numChildren,
      activityFee: activityFee * numChildren,
      totalInitial,
      monthlyFee: totalMonthly,
      totalPeriod,
      dailyFee: dailyFee * numChildren,
      numChildren,
      period
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-green-100 text-green-800 px-6 py-2">💰 Investasi Terbaik untuk Masa Depan</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Investasi Terbaik untuk{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Masa Depan
              </span>{' '}
              Buah Hati dengan Harga Terjangkau
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Kami berkomitmen memberikan layanan premium dengan harga yang fair dan transparan. 
              Tidak ada biaya tersembunyi - semua sudah termasuk dalam paket yang Anda pilih.
            </p>
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kalkulator Biaya untuk Perencanaan yang Tepat
            </h2>
            <p className="text-xl text-gray-600">
              Hitung estimasi investasi untuk program yang sesuai kebutuhan keluarga Anda
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <Calculator className="h-6 w-6" />
                  <span>Simulasi Biaya Daycare Al Muhajirin</span>
                </CardTitle>
                <CardDescription className="text-green-100">
                  Masukkan detail untuk mendapatkan kalkulasi biaya yang akurat
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="age" className="text-base font-semibold text-gray-900">Usia Anak</Label>
                      <Select value={selectedAge} onValueChange={setSelectedAge}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Pilih usia anak" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-23months">3-23 Bulan</SelectItem>
                          <SelectItem value="2-3years">2-3 Tahun</SelectItem>
                          <SelectItem value="2-6years">2-6 Tahun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="program" className="text-base font-semibold text-gray-900">Program</Label>
                      <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Pilih program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fullday">Fullday</SelectItem>
                          <SelectItem value="afterschool">After School</SelectItem>
                          <SelectItem value="harian">Harian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-base font-semibold text-gray-900">Status</Label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Siswa KB-TK Al Muhajirin</SelectItem>
                          <SelectItem value="external">Non-Siswa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="children" className="text-base font-semibold text-gray-900">Jumlah Anak</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        max="5" 
                        value={numChildren} 
                        onChange={(e) => setNumChildren(parseInt(e.target.value) || 1)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="period" className="text-base font-semibold text-gray-900">Periode (bulan)</Label>
                      <Select value={period.toString()} onValueChange={(value) => setPeriod(parseInt(value))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Pilih periode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Bulan</SelectItem>
                          <SelectItem value="6">6 Bulan</SelectItem>
                          <SelectItem value="12">12 Bulan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={calculateCost}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg"
                    >
                      <Calculator className="mr-2 h-5 w-5" />
                      Hitung Biaya
                    </Button>
                  </div>
                </div>

                {calculatedCost && (
                  <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Hasil Kalkulasi Biaya</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="font-medium text-gray-700">Biaya Pendaftaran:</span>
                          <span className="font-bold text-green-600">{formatCurrency(calculatedCost.registrationFee)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="font-medium text-gray-700">Uang Pangkal:</span>
                          <span className="font-bold text-blue-600">{formatCurrency(calculatedCost.entryFee)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="font-medium text-gray-700">Uang Kegiatan:</span>
                          <span className="font-bold text-purple-600">{formatCurrency(calculatedCost.activityFee)}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="font-medium text-gray-700">Total Biaya Awal:</span>
                          <span className="font-bold text-orange-600">{formatCurrency(calculatedCost.totalInitial)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="font-medium text-gray-700">Biaya Bulanan:</span>
                          <span className="font-bold text-indigo-600">{formatCurrency(calculatedCost.monthlyFee)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg">
                          <span className="font-bold text-lg">Total {calculatedCost.period} Bulan:</span>
                          <span className="font-bold text-2xl">{formatCurrency(calculatedCost.totalPeriod)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {calculatedCost.numChildren > 1 && (
                      <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                        <p className="text-yellow-800 font-medium">
                          💡 Family Package: Diskon sudah diterapkan untuk anak ke-2 dan seterusnya!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Pricing Tables */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rincian Lengkap Semua Paket Layanan
            </h2>
            <p className="text-xl text-gray-600">
              Transparansi penuh untuk setiap komponen biaya
            </p>
          </div>

          <Tabs defaultValue="fullday" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="fullday">Fullday Care</TabsTrigger>
              <TabsTrigger value="afterschool">After School</TabsTrigger>
              <TabsTrigger value="harian">Harian</TabsTrigger>
            </TabsList>

            <TabsContent value="fullday">
              <div className="grid md:grid-cols-2 gap-8">
                {pricingFullday.map((pkg, index) => (
                  <Card key={index} className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg">
                    <CardHeader className="text-center">
                      <div className="text-5xl mb-4">{pkg.icon}</div>
                      <CardTitle className="text-2xl text-gray-900">{pkg.ageGroup}</CardTitle>
                      <CardDescription className="text-lg font-semibold text-blue-600">
                        Fullday Care Program
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-3">Biaya Sekali Bayar:</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Formulir Pendaftaran</span>
                            <span className="font-medium">{formatCurrency(pkg.registrationFee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Uang Pangkal</span>
                            <span className="font-medium">{formatCurrency(pkg.entryFee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Uang Kegiatan 1 Tahun</span>
                            <span className="font-medium">{formatCurrency(pkg.activityFee)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-bold">Total Biaya Awal</span>
                            <span className="font-bold text-green-600">{formatCurrency(pkg.totalInitial)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">Biaya Bulanan:</h4>
                        <div className="text-3xl font-bold text-blue-600 text-center">
                          {formatCurrency(pkg.monthlyFee)}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Yang Sudah Termasuk:</h4>
                        <div className="space-y-2">
                          {pkg.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={handleWhatsAppClick}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                      >
                        Daftar Program Fullday
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="afterschool">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="text-center">
                      <div className="text-5xl mb-4">🎒</div>
                      <CardTitle className="text-2xl text-gray-900">Siswa KB-TK Al Muhajirin</CardTitle>
                      <Badge className="bg-green-100 text-green-800">PAKET HEMAT</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-center">
                          <p className="text-green-800 font-bold text-lg mb-2">GRATIS Biaya Pendaftaran!</p>
                          <div className="text-3xl font-bold text-green-600">
                            {formatCurrency(pricingAfterSchool.internal.monthlyFee)}/bulan
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={handleWhatsAppClick}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        Daftar Program Internal
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="text-center">
                      <div className="text-5xl mb-4">🎒</div>
                      <CardTitle className="text-2xl text-gray-900">Non-Siswa KB-TK</CardTitle>
                      <CardDescription>Program After School Regular</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Biaya Awal</span>
                            <span className="font-medium">{formatCurrency(pricingAfterSchool.external.totalInitial)}</span>
                          </div>
                        </div>
                        <div className="text-center mt-3">
                          <div className="text-3xl font-bold text-blue-600">
                            {formatCurrency(pricingAfterSchool.external.monthlyFee)}/bulan
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={handleWhatsAppClick}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Daftar Program External
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-center">Fasilitas After School Program:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pricingAfterSchool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="harian">
              <div className="grid md:grid-cols-3 gap-8">
                {pricingHarian.map((pkg, index) => (
                  <Card key={index} className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg">
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-2">☀️</div>
                      <CardTitle className="text-lg text-gray-900">{pkg.ageGroup}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {pkg.registrationFee > 0 && (
                        <div className="text-center text-sm text-gray-600">
                          Biaya Pendaftaran: {formatCurrency(pkg.registrationFee)}
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          {formatCurrency(pkg.dailyFee)}/hari
                        </div>
                      </div>
                      <Button 
                        onClick={handleWhatsAppClick}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Daftar Program Harian
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-12 max-w-2xl mx-auto">
                <Card className="bg-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-center">Yang Termasuk dalam Paket Harian:</h4>
                    <div className="space-y-2">
                      {[
                        "Fasilitas sama dengan paket fullday",
                        "Makan dan snack sesuai durasi", 
                        "Semua program pembelajaran",
                        "Pengawasan dan keamanan penuh",
                        "Laporan aktivitas harian"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Promo & Diskon */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Promo Menarik untuk Keluarga Baru
            </h2>
            <p className="text-xl text-gray-600">
              Berbagai program diskon dan bonus untuk menghemat biaya pendaftaran
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {promoPrograms.map((promo, index) => (
              <Card key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{promo.icon}</div>
                  <CardTitle className="text-xl text-gray-900">{promo.title}</CardTitle>
                  <Badge className="bg-orange-100 text-orange-800 text-lg px-4 py-1">
                    {promo.discount}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-700">{promo.description}</p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      <strong>Syarat:</strong> {promo.requirement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Program Loyalty</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-bold text-purple-600 mb-2">Long Term Commitment</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Diskon 5% untuk pembayaran 6 bulan di muka</li>
                  <li>• Diskon 10% untuk pembayaran 12 bulan di muka</li>
                  <li>• Free 1 month untuk pembayaran 2 tahun di muka</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-bold text-pink-600 mb-2">Perfect Attendance</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Bonus 1 hari gratis untuk kehadiran 100%</li>
                  <li>• Special gift untuk 3 bulan perfect attendance</li>
                  <li>• Certificate of appreciation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kemudahan Pembayaran untuk Kenyamanan Anda
            </h2>
            <p className="text-xl text-gray-600">
              Berbagai pilihan metode pembayaran yang aman dan mudah
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {paymentMethods.map((method, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{method.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {method.methods.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        {'account' in item ? `${item.account} a.n. ${item.holder}` : item.info}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-gray-900">Jadwal Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">SPP Bulanan</p>
                    <p className="text-sm text-gray-700">Jatuh tempo tanggal 1-10 setiap bulan</p>
                    <p className="text-sm text-red-600">Denda Rp 50.000 jika terlambat lebih dari 10 hari</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Biaya Harian</p>
                    <p className="text-sm text-gray-700">Pembayaran di muka atau maksimal H+1</p>
                    <p className="text-sm text-gray-700">Booking minimal H-1 untuk kepastian slot</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Langkah Mudah Bergabung dengan Keluarga Al Muhajirin
            </h2>
            <p className="text-xl text-gray-600">
              Proses pendaftaran yang simple dan transparan
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8">
              {registrationSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <Card className="bg-gray-50 border-0">
                    <CardContent className="p-4">
                      <ul className="text-xs text-gray-600 space-y-1">
                        {step.details.map((detail, idx) => (
                          <li key={idx}>• {detail}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Persiapan Dokumen untuk Proses yang Lancar
            </h2>
            <p className="text-xl text-gray-600">
              Checklist lengkap dokumen yang perlu disiapkan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {requiredDocuments.map((category, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan yang Sering Diajukan Tentang Biaya
            </h2>
            <p className="text-xl text-gray-600">
              Jawaban untuk pertanyaan umum seputar biaya dan pembayaran
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Investasi Terbaik Dimulai Hari Ini!
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Jangan sia-siakan golden age anak Anda. Bergabunglah dengan keluarga Al Muhajirin 
            dan berikan yang terbaik untuk masa depan buah hati.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Limited Offer untuk 20 Pendaftar Pertama Bulan Ini:</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: "🎁", text: "Gratis biaya formulir pendaftaran (hemat Rp 150.000)" },
                { icon: "🎈", text: "Welcome package untuk anak baru" },
                { icon: "👥", text: "Priority scheduling untuk konsultasi" },
                { icon: "📚", text: "Free parenting workshop sesi pertama" }
              ].map((offer, index) => (
                <div key={index} className="bg-white/20 rounded-lg p-4">
                  <div className="text-2xl mb-2">{offer.icon}</div>
                  <p className="text-white text-sm">{offer.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={handleWhatsAppClick}
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              DAFTAR KONSULTASI GRATIS
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
            >
              <Link href="/program-layanan">LIHAT SEMUA PROGRAM</Link>
            </Button>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
            <p className="text-white font-medium mb-2">📱 Konsultasi & Informasi</p>
            <p className="text-green-100">WhatsApp: 0813-1466-191 (Ustadzah Iin)</p>
            <p className="text-green-100">Fast Response - Biasanya reply dalam 15 menit</p>
            <p className="text-green-100">Available: 08.00-20.00 WIB setiap hari</p>
          </div>
        </div>
      </section>
    </div>
  );
}