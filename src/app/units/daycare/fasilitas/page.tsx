// src/app/(WebsiteLayout)/fasilitas/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  Home, Shield, Stethoscope, Utensils, Bed, Camera, 
  Thermometer, Eye, Phone, ArrowRight, CheckCircle, Star, Users, 
  Baby, PaintBucket, Activity, Monitor, Wifi, Car, MapPin, Calendar
} from 'lucide-react';

/**
 * Fasilitas page for Daycare Al Muhajirin Rewwin
 * Comprehensive facilities showcase with virtual tour and interactive features
 */
export default function FasilitasPage() {
  const [selectedRoom, setSelectedRoom] = useState('overview');

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20jadwalkan%20kunjungan%20untuk%20melihat%20fasilitas%20Daycare%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const facilitiesOverview = [
    {
      icon: <Home className="h-8 w-8 text-blue-600" />,
      title: "Bangunan Modern & Aman",
      description: "Desain ramah anak dengan sudut-sudut tumpul, ventilasi optimal, pencahayaan alami dan buatan yang cukup"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Keamanan Berlapis",
      description: "CCTV 24 jam di seluruh area, access control, tim security dan protokol safety yang komprehensif"
    },
    {
      icon: <Thermometer className="h-8 w-8 text-purple-600" />,
      title: "Kenyamanan Optimal",
      description: "AC di seluruh ruangan, furniture ergonomis sesuai usia anak, lantai anti-slip dan mudah dibersihkan"
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-red-600" />,
      title: "Kesehatan Terjaga",
      description: "Klinik kesehatan in-house, pemeriksaan rutin, pemberian vitamin sesuai kebutuhan, makanan bergizi"
    }
  ];

  const ruangPembelajaran = [
    {
      title: "Kelas Bayi (3-12 bulan)",
      icon: <Baby className="h-6 w-6 text-pink-600" />,
      features: [
        "Area Playing: Matras empuk dan mainan sensori",
        "Feeding Corner: Kursi menyusui yang nyaman",
        "Sleeping Area: Tempat tidur individual dengan sprei bersih",
        "Changing Station: Area ganti popok yang higienis",
        "Storage: Loker personal untuk perlengkapan bayi"
      ],
      image: "🍼"
    },
    {
      title: "Kelas Toddler (1-2 tahun)",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      features: [
        "Learning Center: Meja dan kursi sesuai tinggi anak",
        "Art Corner: Area menggambar dan kreativitas",
        "Reading Nook: Sudut baca yang nyaman",
        "Sensory Play Area: Zona eksplorasi dengan berbagai tekstur",
        "Mini Kitchen: Bermain peran dan life skills"
      ],
      image: "🧸"
    },
    {
      title: "Kelas Preschool (2-3 tahun)",
      icon: <PaintBucket className="h-6 w-6 text-green-600" />,
      features: [
        "Academic Zone: Area pembelajaran formal",
        "Science Corner: Eksperimen sederhana dan discovery",
        "Library: Koleksi buku anak yang lengkap",
        "Computer Corner: Pengenalan teknologi dasar",
        "Display Board: Showcase karya anak"
      ],
      image: "📚"
    }
  ];

  const areaBermain = [
    {
      title: "Outdoor Playground",
      description: "Area bermain luar ruangan dengan peralatan berkualitas tinggi",
      features: [
        "Climbing Frame: Struktur panjat yang aman",
        "Slides: Perosotan dengan berbagai tinggi",
        "Swings: Ayunan dengan safety harness",
        "Sandbox: Area bermain pasir yang higienis",
        "Balance Beam: Titian untuk keseimbangan"
      ],
      safety: [
        "Soft Ground: Matras karet di bawah permainan",
        "Shaded Areas: Canopy untuk perlindungan",
        "Fencing: Pagar keliling untuk keamanan",
        "Age-appropriate: Permainan sesuai kelompok usia",
        "Regular Inspection: Pengecekan rutin kondisi permainan"
      ],
      image: "🏰"
    },
    {
      title: "Indoor Play Area",
      description: "Ruang bermain dalam ruangan dengan berbagai aktivitas",
      features: [
        "Soft Play Zone: Balok busa untuk membangun",
        "Ball Pit: Kolam bola yang aman",
        "Tunnel Crawl: Terowongan merangkak",
        "Sensory Boards: Papan stimulasi indera",
        "Quiet Corner: Sudut tenang untuk istirahat"
      ],
      activities: [
        "Mini Kitchen: Dapur mainan lengkap",
        "Dress Up Station: Kostum profesi dan karakter",
        "Doll House: Rumah boneka untuk bermain peran",
        "Vehicle Play: Mobil-mobilan dan trek",
        "Market Corner: Bermain jual-beli"
      ],
      image: "🎪"
    }
  ];

  const fasilitasKesehatan = [
    {
      title: "Medical Room",
      icon: <Stethoscope className="h-6 w-6 text-red-600" />,
      equipment: [
        "Examination Bed: Tempat tidur pemeriksaan",
        "Medical Equipment: Thermometer, stetoskop, timbangan",
        "First Aid Kit: Lengkap dan selalu update",
        "Medicine Cabinet: Obat-obatan dasar (dengan izin dokter)",
        "Isolation Room: Ruang terpisah jika anak sakit"
      ]
    },
    {
      title: "Health Monitoring",
      icon: <Activity className="h-6 w-6 text-green-600" />,
      services: [
        "Growth Chart: Pantau tumbuh kembang",
        "Health Records: Catatan kesehatan individual",
        "Emergency Contact: Nomor dokter dan rumah sakit",
        "Parent Notification: Sistem laporan kesehatan real-time"
      ]
    },
    {
      title: "Kitchen Facilities",
      icon: <Utensils className="h-6 w-6 text-orange-600" />,
      features: [
        "Commercial Grade: Peralatan standar komersial",
        "Hygiene Standards: Standar kebersihan tinggi",
        "Refrigeration: Kulkas dan freezer yang memadai",
        "Water Filtration: Sistem penyaring air bersih",
        "HACCP Compliance: Mengikuti standar keamanan pangan"
      ]
    }
  ];

  const sistemKeamanan = [
    {
      title: "CCTV Monitoring",
      features: [
        "24/7 Recording: Rekaman 24 jam non-stop",
        "Multiple Angles: Kamera dari berbagai sudut",
        "HD Quality: Kualitas gambar yang jernih",
        "Remote Access: Monitoring jarak jauh",
        "Backup Storage: Penyimpanan backup yang aman"
      ],
      icon: <Camera className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Access Control",
      features: [
        "Card Access: Sistem kartu untuk masuk",
        "Visitor Management: Sistem tamu yang teratur",
        "Parent Pickup: Protokol penjemputan yang ketat",
        "Emergency Exit: Jalur evakuasi yang jelas",
        "Staff Identification: ID card untuk semua staff"
      ],
      icon: <Shield className="h-8 w-8 text-green-600" />
    },
    {
      title: "Emergency Preparedness",
      features: [
        "Fire Extinguishers: Alat pemadam kebakaran",
        "Smoke Detectors: Detector asap di setiap ruang",
        "Emergency Lighting: Lampu emergency",
        "First Aid Stations: Pos P3K di berbagai lokasi",
        "Emergency Communication: Sistem komunikasi darurat"
      ],
      icon: <Phone className="h-8 w-8 text-red-600" />
    }
  ];

  const roomTour = [
    {
      id: 'overview',
      title: 'Overview Fasilitas',
      description: 'Pandangan umum fasilitas daycare dengan standar premium',
      image: '🏢'
    },
    {
      id: 'learning',
      title: 'Ruang Pembelajaran',
      description: 'Kelas-kelas yang dirancang khusus untuk setiap kelompok usia',
      image: '📚'
    },
    {
      id: 'playground',
      title: 'Area Bermain',
      description: 'Playground indoor dan outdoor yang aman dan menyenangkan',
      image: '🎪'
    },
    {
      id: 'dining',
      title: 'Ruang Makan',
      description: 'Area makan yang higienis dengan kitchen berkualitas tinggi',
      image: '🍽️'
    },
    {
      id: 'health',
      title: 'Fasilitas Kesehatan',
      description: 'Klinik kesehatan dan area kebersihan yang lengkap',
      image: '🏥'
    },
    {
      id: 'security',
      title: 'Sistem Keamanan',
      description: 'Sistem keamanan berlapis untuk ketenangan pikiran',
      image: '🛡️'
    }
  ];

  const teknologiModern = [
    {
      title: "Smart Classroom",
      features: [
        "Interactive Whiteboard: Papan tulis digital",
        "Projector: Untuk presentasi dan video edukatif",
        "Tablet Learning: Tablet khusus anak untuk belajar",
        "Educational Software: Aplikasi pembelajaran interaktif",
        "Internet Safety: Filtering konten yang aman"
      ],
      icon: <Monitor className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Documentation System",
      features: [
        "Digital Portfolio: Portofolio digital perkembangan anak",
        "Photo/Video: Dokumentasi kegiatan harian",
        "Progress Tracking: Sistem tracking perkembangan",
        "Parent Portal: Akses orang tua ke laporan anak",
        "Communication App: Aplikasi komunikasi real-time"
      ],
      icon: <Camera className="h-8 w-8 text-green-600" />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-800 px-6 py-2">🏠 Fasilitas Lengkap untuk Kenyamanan & Keamanan</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Fasilitas{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Premium
              </span>{' '}
              dengan Standar Internasional
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Setiap detail fasilitas dirancang dengan standar internasional untuk memastikan lingkungan belajar 
              yang aman, nyaman, dan menyenangkan untuk buah hati Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleWhatsAppClick}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              >
                JADWALKAN KUNJUNGAN
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg border-2"
              >
                <Link href="#virtual-tour">MULAI VIRTUAL TOUR</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Fasilitas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Standar Premium dengan Sentuhan Islami
            </h2>
            <p className="text-xl text-gray-600">
              Empat pilar utama yang menjadi fondasi fasilitas terbaik kami
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilitiesOverview.map((facility, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {facility.icon}
                  </div>
                  <CardTitle className="text-lg text-gray-900">{facility.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour */}
      <section id="virtual-tour" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Virtual Tour Fasilitas Kami
            </h2>
            <p className="text-xl text-gray-600">
              Jelajahi setiap sudut fasilitas kami dari kenyamanan rumah Anda
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Tour Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {roomTour.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`p-4 rounded-xl text-center transition-all duration-300 ${
                    selectedRoom === room.id
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{room.image}</div>
                  <div className="text-sm font-medium">{room.title}</div>
                </button>
              ))}
            </div>

            {/* Tour Content */}
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {roomTour.find(room => room.id === selectedRoom)?.title}
                </h3>
                <p className="text-blue-100">
                  {roomTour.find(room => room.id === selectedRoom)?.description}
                </p>
              </div>

              <CardContent className="p-0">
                {selectedRoom === 'overview' && (
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-6">Gambaran Umum Fasilitas</h4>
                        <div className="space-y-4">
                          {facilitiesOverview.map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                {React.cloneElement(item.icon, { className: "h-5 w-5 text-blue-600" })}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">{item.title}</h5>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 text-center">
                        <div className="text-8xl mb-6">🏢</div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Fasilitas Lengkap</h4>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">15+</div>
                            <div className="text-sm text-gray-600">Ruangan</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">24/7</div>
                            <div className="text-sm text-gray-600">CCTV</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">100%</div>
                            <div className="text-sm text-gray-600">AC</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">ISO</div>
                            <div className="text-sm text-gray-600">Standard</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRoom === 'learning' && (
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-8">Ruang Kelas yang Menginspirasi Kreativitas</h4>
                    <div className="space-y-8">
                      {ruangPembelajaran.map((kelas, idx) => (
                        <Card key={idx} className="border shadow-md hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4 mb-6">
                              <div className="text-4xl">{kelas.image}</div>
                              <div>
                                <h5 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                                  {kelas.icon}
                                  <span>{kelas.title}</span>
                                </h5>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              {kelas.features.map((feature, featureIdx) => (
                                <div key={featureIdx} className="flex items-start space-x-3">
                                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700 text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRoom === 'playground' && (
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-8">Playground yang Aman dan Menyenangkan</h4>
                    <div className="space-y-8">
                      {areaBermain.map((area, idx) => (
                        <Card key={idx} className="border shadow-md">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4 mb-6">
                              <div className="text-6xl">{area.image}</div>
                              <div>
                                <h5 className="text-xl font-bold text-gray-900">{area.title}</h5>
                                <p className="text-gray-600">{area.description}</p>
                              </div>
                            </div>
                            
                            <Tabs defaultValue="features" className="w-full">
                              <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="features">Fasilitas</TabsTrigger>
                                <TabsTrigger value="safety">
                                  {area.safety ? 'Keamanan' : 'Aktivitas'}
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="features">
                                <div className="grid md:grid-cols-2 gap-4">
                                  {area.features.map((feature, featureIdx) => (
                                    <div key={featureIdx} className="flex items-start space-x-3">
                                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700 text-sm">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="safety">
                                <div className="grid md:grid-cols-2 gap-4">
                                  {(area.safety || area.activities)?.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex items-start space-x-3">
                                      <Star className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700 text-sm">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRoom === 'dining' && (
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-8">Ruang Makan yang Nyaman dan Higienis</h4>
                    <div className="grid md:grid-cols-2 gap-8">
                      <Card className="border shadow-md">
                        <CardHeader>
                          <div className="text-6xl text-center mb-4">🍽️</div>
                          <CardTitle className="text-center">Dining Area</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              "Child-sized Tables: Meja sesuai tinggi anak",
                              "Safety Chairs: Kursi dengan safety features",
                              "Easy-clean Surfaces: Permukaan mudah dibersihkan",
                              "Bright Lighting: Pencahayaan optimal saat makan",
                              "Cheerful Decoration: Dekorasi yang menggugah selera"
                            ].map((feature, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                                <span className="text-gray-700 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border shadow-md">
                        <CardHeader>
                          <div className="text-6xl text-center mb-4">👨‍🍳</div>
                          <CardTitle className="text-center">Kitchen Facilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              "Commercial Grade: Peralatan standar komersial",
                              "Hygiene Standards: Standar kebersihan tinggi",
                              "Refrigeration: Kulkas dan freezer yang memadai",
                              "Water Filtration: Sistem penyaring air bersih",
                              "HACCP Compliance: Standar keamanan pangan"
                            ].map((feature, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                                <span className="text-gray-700 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {selectedRoom === 'health' && (
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-8">Kesehatan Adalah Prioritas Utama Kami</h4>
                    <div className="grid md:grid-cols-3 gap-8">
                      {fasilitasKesehatan.map((facility, idx) => (
                        <Card key={idx} className="border shadow-md hover:shadow-lg transition-shadow">
                          <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              {facility.icon}
                            </div>
                            <CardTitle className="text-lg">{facility.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {(facility.equipment || facility.services || facility.features)?.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex items-start space-x-3">
                                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                                  <span className="text-gray-700 text-sm">{item}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRoom === 'security' && (
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-8">Sistem Keamanan Berlapis untuk Ketenangan Pikiran</h4>
                    <div className="grid md:grid-cols-3 gap-8">
                      {sistemKeamanan.map((system, idx) => (
                        <Card key={idx} className="border shadow-md hover:shadow-lg transition-shadow">
                          <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              {system.icon}
                            </div>
                            <CardTitle className="text-lg">{system.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {system.features.map((feature, featureIdx) => (
                                <div key={featureIdx} className="flex items-start space-x-3">
                                  <CheckCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-1" />
                                  <span className="text-gray-700 text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Teknologi Modern */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Teknologi Modern untuk Pembelajaran Masa Depan
            </h2>
            <p className="text-xl text-gray-600">
              Mengintegrasikan teknologi canggih dalam proses pembelajaran dan dokumentasi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teknologiModern.map((tech, idx) => (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    {tech.icon}
                  </div>
                  <CardTitle className="text-xl">{tech.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tech.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-800">{feature.split(':')[0]}:</span>
                          <span className="text-gray-600"> {feature.split(':')[1]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas Penunjang */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fasilitas Penunjang untuk Kenyamanan Maksimal
            </h2>
            <p className="text-xl text-gray-600">
              Fasilitas tambahan yang mendukung pengalaman terbaik untuk anak dan orang tua
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Parent Facilities",
                features: [
                  "Waiting Area yang nyaman",
                  "Coffee Corner untuk orang tua",
                  "Wi-Fi gratis",
                  "Reading materials parenting"
                ]
              },
              {
                icon: <Car className="h-8 w-8 text-green-600" />,
                title: "Parkir & Transportasi",
                features: [
                  "Parkir khusus orang tua",
                  "Drop-off zone yang aman",
                  "CCTV area parkir",
                  "Security guard"
                ]
              },
              {
                icon: <Bed className="h-8 w-8 text-purple-600" />,
                title: "Ruang Istirahat",
                features: [
                  "Tempat tidur individual",
                  "Suasana tenang",
                  "Temperature control",
                  "Supervised rest time"
                ]
              },
              {
                icon: <Wifi className="h-8 w-8 text-orange-600" />,
                title: "Teknologi & Konektivitas",
                features: [
                  "Free WiFi untuk orang tua",
                  "Parent communication app",
                  "Digital documentation",
                  "Online progress reports"
                ]
              }
            ].map((facility, idx) => (
              <Card key={idx} className="bg-white hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    {facility.icon}
                  </div>
                  <CardTitle className="text-lg">{facility.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {facility.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Kunjungi dan Rasakan Sendiri Fasilitas Premium Kami
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Tidak ada yang lebih baik daripada melihat langsung fasilitas kami. Jadwalkan kunjungan untuk 
            merasakan pengalaman lengkap Daycare Al Muhajirin Rewwin.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <Calendar className="h-8 w-8" />, title: "Kunjungan Gratis", desc: "Setiap hari kerja 07.00-17.00" },
              { icon: <Eye className="h-8 w-8" />, title: "Personal Tour", desc: "Tur khusus sesuai kebutuhan" },
              { icon: <Monitor className="h-8 w-8" />, title: "Virtual Tour", desc: "Preview online tersedia" },
              { icon: <Users className="h-8 w-8" />, title: "Bring Family", desc: "Ajak keluarga melihat bersama" }
            ].map((service, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {service.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{service.title}</h3>
                <p className="text-blue-100 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleWhatsAppClick}
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              JADWALKAN KUNJUNGAN SEKARANG
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
            >
              <Link href="/kontak">HUBUNGI KAMI</Link>
            </Button>
          </div>

          <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4 text-white">
              <MapPin className="h-5 w-5" />
              <span>Jl. Rajawali No. 207, Rewwin, Waru, Sidoarjo</span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-blue-100 mt-2">
              <Phone className="h-4 w-4" />
              <span>0813-1466-191 (Ustadzah Iin)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}