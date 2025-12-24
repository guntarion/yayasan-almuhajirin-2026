// src/app/(WebsiteLayout)/kontak/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Car,
  Wifi,
  Coffee,
  Users,
  Shield,
  AlertCircle,
  Navigation,
  Building,
  Hospital,
  ShoppingBag,
  GraduationCap,
  Send,
  CheckCircle,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  HeadphonesIcon
} from 'lucide-react';

/**
 * Kontak & Lokasi page for Daycare Al Muhajirin Rewwin
 * Comprehensive contact information, location details, and communication channels
 */
export default function KontakLokasiPage() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    childAge: '',
    programs: [] as string[],
    message: '',
    contactTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWhatsAppClick = (message?: string) => {
    const defaultMessage = 'Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Daycare%20Al%20Muhajirin%20Rewwin';
    const whatsappMessage = message ? encodeURIComponent(message) : defaultMessage;
    window.open(`https://wa.me/6281314661918?text=${whatsappMessage}`, '_blank');
  };

  const handlePhoneCall = () => {
    window.open('tel:+6281314661918', '_self');
  };

  const handleEmailClick = () => {
    window.open('mailto:info@daycare-almuhajirin.com?subject=Informasi%20Daycare%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const handleDirectionsClick = () => {
    window.open('https://maps.google.com/?q=Jl.+Rajawali+No.+207+RT+11+RW+06,+Rewwin,+Waru,+Sidoarjo', '_blank');
  };

  const contactMethods = [
    {
      title: "WhatsApp (Recommended)",
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      primary: "0813-1466-191",
      secondary: "Ustadzah Iin (Kepala Daycare)",
      responseTime: "< 15 menit (08.00-20.00 WIB)",
      description: "Cara tercepat untuk konsultasi dan informasi",
      action: () => handleWhatsAppClick(),
      actionText: "Chat WhatsApp",
      color: "green"
    },
    {
      title: "Telepon Langsung",
      icon: <Phone className="h-8 w-8 text-blue-600" />,
      primary: "0813-1466-191",
      secondary: "Jam Operasional: 07.00-17.00 WIB",
      responseTime: "Langsung terhubung",
      description: "Untuk konsultasi urgent dan informasi cepat",
      action: handlePhoneCall,
      actionText: "Telepon Sekarang",
      color: "blue"
    },
    {
      title: "Email Resmi",
      icon: <Mail className="h-8 w-8 text-purple-600" />,
      primary: "info@daycare-almuhajirin.com",
      secondary: "pendaftaran@daycare-almuhajirin.com",
      responseTime: "Maksimal 24 jam",
      description: "Untuk komunikasi formal dan dokumen",
      action: handleEmailClick,
      actionText: "Kirim Email",
      color: "purple"
    }
  ];

  const operatingHours = [
    {
      day: "Senin - Jumat",
      hours: [
        { service: "Layanan Fullday", time: "07.00 - 17.00 WIB" },
        { service: "After School", time: "11.00 - 17.00 WIB" },
        { service: "Customer Service", time: "07.00 - 20.00 WIB" },
        { service: "Drop-off Window", time: "07.00 - 08.30 WIB" },
        { service: "Pick-up Window", time: "16.00 - 17.00 WIB" }
      ]
    },
    {
      day: "Weekend (Sabtu - Minggu)",
      hours: [
        { service: "Daycare", time: "TUTUP" },
        { service: "Emergency Contact", time: "24/7 Tersedia" },
        { service: "WhatsApp Consultation", time: "08.00 - 18.00 WIB" },
        { service: "Appointment Visit", time: "By Appointment" }
      ]
    }
  ];

  const emergencyContacts = [
    {
      category: "Medical Emergency",
      icon: <Hospital className="h-6 w-6 text-red-600" />,
      contacts: [
        { name: "Kepala Daycare", number: "0813-31466191" },
        { name: "RS Waru", number: "031-8531718" },
        { name: "Ambulance", number: "118" }
      ]
    },
    {
      category: "Security Emergency",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      contacts: [
        { name: "Polsek Waru", number: "031-8532461" },
        { name: "Pemadam Kebakaran", number: "113" },
        { name: "Security Daycare", number: "0813-1466-191" }
      ]
    }
  ];

  const nearbyFacilities = [
    {
      category: "Fasilitas Pendidikan",
      icon: <GraduationCap className="h-6 w-6 text-blue-600" />,
      facilities: [
        { name: "KB-TK Al Zaitun", distance: "200m", description: "Sister school" },
        { name: "TK Pertiwi", distance: "500m", description: "Sekolah tetangga" },
        { name: "SD Rewwin", distance: "800m", description: "Sekolah dasar" }
      ]
    },
    {
      category: "Fasilitas Kesehatan",
      icon: <Hospital className="h-6 w-6 text-red-600" />,
      facilities: [
        { name: "Klinik Rewwin", distance: "300m", description: "Klinik terdekat" },
        { name: "Apotek", distance: "250m", description: "Apotek 24 jam" },
        { name: "RS Waru", distance: "2km", description: "Rumah sakit utama" }
      ]
    },
    {
      category: "Fasilitas Umum",
      icon: <ShoppingBag className="h-6 w-6 text-green-600" />,
      facilities: [
        { name: "Indomaret Rewwin", distance: "100m", description: "Convenience store" },
        { name: "Masjid Al Muhajirin", distance: "50m", description: "Masjid utama" },
        { name: "Minimarket", distance: "150m", description: "Belanja kebutuhan" }
      ]
    }
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // WhatsApp integration with form data
    const message = `Assalamualaikum, saya ${formData.name}. 
    
Usia anak: ${formData.childAge}
Program yang diminati: ${formData.programs.join(', ')}
Pesan: ${formData.message}
Waktu kontak terbaik: ${formData.contactTime}

Terima kasih.`;
    
    handleWhatsAppClick(message);
  };

  const handleProgramChange = (program: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        programs: [...prev.programs, program]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        programs: prev.programs.filter(p => p !== program)
      }));
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-green-100 text-green-800 px-6 py-2">📞 Siap Melayani 24/7</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Hubungi Kami{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Kapan Saja
              </span>{' '}
              - Kami Siap Membantu Anda
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Tim kami selalu ready untuk menjawab pertanyaan, memberikan konsultasi, dan membantu Anda 
              menemukan solusi pengasuhan terbaik untuk buah hati. Jangan ragu untuk menghubungi kami!
            </p>
            
            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleWhatsAppClick()}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Sekarang
              </Button>
              <Button 
                onClick={handlePhoneCall}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2"
              >
                <Phone className="mr-2 h-5 w-5" />
                Telepon Langsung
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Berbagai Cara Mudah Menghubungi Kami
            </h2>
            <p className="text-xl text-gray-600">
              Pilih metode komunikasi yang paling nyaman untuk Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 border-0 shadow-lg border-l-4 border-l-${method.color}-500`}>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{method.title}</CardTitle>
                  <Badge className={`bg-${method.color}-100 text-${method.color}-800`}>
                    Respon: {method.responseTime}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className={`text-2xl font-bold text-${method.color}-600`}>{method.primary}</p>
                    <p className="text-gray-600 text-sm">{method.secondary}</p>
                  </div>
                  <p className="text-gray-700">{method.description}</p>
                  <Button 
                    onClick={method.action}
                    className={`w-full bg-${method.color}-600 hover:bg-${method.color}-700 text-white`}
                  >
                    {method.actionText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Address */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lokasi Strategis di Jantung Perumahan Rewwin
            </h2>
            <p className="text-xl text-gray-600">
              Mudah dijangkau dari berbagai daerah di Sidoarjo dan Surabaya
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Address Information */}
            <div className="space-y-8">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-6 w-6 text-red-600" />
                    <span>Alamat Lengkap</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg text-gray-800 leading-relaxed">
                    <p className="font-semibold">Jl. Rajawali No. 207 RT 11 RW 06</p>
                    <p>Rewwin, Kepuhkiriman</p>
                    <p>Waru, Sidoarjo</p>
                    <p>Jawa Timur 61256</p>
                    <p>Indonesia</p>
                  </div>
                  <Button 
                    onClick={handleDirectionsClick}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Buka di Google Maps
                  </Button>
                </CardContent>
              </Card>

              {/* Landmarks */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-6 w-6 text-blue-600" />
                    <span>Landmark Terdekat</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Indomaret Rewwin", distance: "100 meter", icon: "🏪" },
                      { name: "Masjid Al Muhajirin", distance: "50 meter", icon: "🕌" },
                      { name: "KB-TK Al Zaitun", distance: "200 meter", icon: "🏫" },
                      { name: "Klinik Rewwin", distance: "300 meter", icon: "🏥" },
                      { name: "Halte Rewwin", distance: "400 meter", icon: "🚌" }
                    ].map((landmark, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{landmark.icon}</span>
                          <span className="font-medium text-gray-900">{landmark.name}</span>
                        </div>
                        <Badge variant="outline">{landmark.distance}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Transportation Access */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-6 w-6 text-green-600" />
                    <span>Akses Transportasi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { from: "Dari Surabaya", route: "20 menit via Jl. Raya Waru", icon: "🚗" },
                      { from: "Dari Bandara Juanda", route: "15 menit", icon: "✈️" },
                      { from: "Bus L300", route: "Rute Bungurasih-Waru", icon: "🚌" },
                      { from: "Bike Friendly", route: "Area aman untuk sepeda", icon: "🚲" }
                    ].map((transport, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xl mt-1">{transport.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{transport.from}</p>
                          <p className="text-gray-600 text-sm">{transport.route}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Map Placeholder */}
            <div className="space-y-8">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-6 w-6 text-purple-600" />
                    <span>Peta Interaktif</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-gray-600 font-medium">Google Maps Integration</p>
                      <p className="text-gray-500">Interactive map dengan real-time traffic</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button 
                      onClick={handleDirectionsClick}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Directions
                    </Button>
                    <Button 
                      onClick={() => window.open('https://maps.google.com/?layer=c&cbll=-7.2575,112.7521', '_blank')}
                      variant="outline"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Street View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Visitor Facilities */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Coffee className="h-6 w-6 text-orange-600" />
                    <span>Fasilitas Pengunjung</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Coffee className="h-5 w-5" />, name: "Waiting Lounge", desc: "Area tunggu nyaman" },
                      { icon: <Wifi className="h-5 w-5" />, name: "Free WiFi", desc: "Internet gratis" },
                      { icon: <Car className="h-5 w-5" />, name: "Parkir Aman", desc: "15 mobil + motor" },
                      { icon: <Users className="h-5 w-5" />, name: "Meeting Room", desc: "Ruang konsultasi" }
                    ].map((facility, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-orange-600 mb-2 flex justify-center">{facility.icon}</div>
                        <p className="font-medium text-gray-900 text-sm">{facility.name}</p>
                        <p className="text-gray-600 text-xs">{facility.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jadwal Lengkap Layanan Kami
            </h2>
            <p className="text-xl text-gray-600">
              Informasi jam operasional untuk berbagai layanan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {operatingHours.map((schedule, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <span>{schedule.day}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedule.hours.map((hour, hourIndex) => (
                      <div key={hourIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{hour.service}</span>
                        <Badge 
                          variant={hour.time === 'TUTUP' ? 'destructive' : hour.time === '24/7 Tersedia' ? 'default' : 'outline'}
                          className={hour.time === '24/7 Tersedia' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {hour.time}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Special Notes */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Catatan Penting:</h3>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• <strong>Libur Sekolah:</strong> Daycare TETAP BUKA (semester break, libur puasa)</li>
                      <li>• <strong>Overtime:</strong> Rp 15.000/30 menit setelah jam 17.00</li>
                      <li>• <strong>Emergency Contact:</strong> Available 24/7 untuk situasi darurat</li>
                      <li>• <strong>Libur Nasional:</strong> Mengikuti kalender pemerintah (info H-7)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hubungi Kami Sekarang - Respon Cepat Dijamin!
            </h2>
            <p className="text-xl text-gray-600">
              Isi form di bawah dan tim kami akan segera menghubungi Anda
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <CardTitle className="text-2xl">Quick Contact Form</CardTitle>
                <CardDescription className="text-green-100">
                  Formulir cepat untuk konsultasi dan informasi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {!isSubmitted ? (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-base font-semibold text-gray-900">
                          Nama Lengkap *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Masukkan nama lengkap Anda"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp" className="text-base font-semibold text-gray-900">
                          Nomor WhatsApp *
                        </Label>
                        <Input
                          id="whatsapp"
                          type="tel"
                          placeholder="Contoh: 0813-1234-5678"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="childAge" className="text-base font-semibold text-gray-900">
                          Usia Anak *
                        </Label>
                        <Select value={formData.childAge} onValueChange={(value) => setFormData(prev => ({ ...prev, childAge: value }))}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Pilih usia anak" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3-6months">3-6 Bulan</SelectItem>
                            <SelectItem value="6-12months">6-12 Bulan</SelectItem>
                            <SelectItem value="1-2years">1-2 Tahun</SelectItem>
                            <SelectItem value="2-3years">2-3 Tahun</SelectItem>
                            <SelectItem value="3-4years">3-4 Tahun</SelectItem>
                            <SelectItem value="4plus">4+ Tahun</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contactTime" className="text-base font-semibold text-gray-900">
                          Waktu Kontak Terbaik
                        </Label>
                        <Select value={formData.contactTime} onValueChange={(value) => setFormData(prev => ({ ...prev, contactTime: value }))}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Pilih waktu terbaik" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Pagi (08:00-12:00)</SelectItem>
                            <SelectItem value="afternoon">Siang (12:00-15:00)</SelectItem>
                            <SelectItem value="evening">Sore (15:00-18:00)</SelectItem>
                            <SelectItem value="night">Malam (18:00-20:00)</SelectItem>
                            <SelectItem value="anytime">Kapan saja</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold text-gray-900 mb-3 block">
                        Program yang Diminati (boleh pilih lebih dari satu)
                      </Label>
                      <div className="grid md:grid-cols-3 gap-4">
                        {['Fullday Care', 'After School', 'Harian/Daily', 'Konsultasi Parenting', 'Tour Fasilitas', 'Informasi Biaya'].map((program) => (
                          <div key={program} className="flex items-center space-x-2">
                            <Checkbox
                              id={program}
                              checked={formData.programs.includes(program)}
                              onCheckedChange={(checked) => handleProgramChange(program, checked as boolean)}
                            />
                            <Label htmlFor={program} className="text-sm text-gray-700">
                              {program}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-base font-semibold text-gray-900">
                        Pesan atau Pertanyaan
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Ceritakan kebutuhan dan pertanyaan Anda tentang daycare..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Kirim & Chat WhatsApp
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h3>
                    <p className="text-gray-600 mb-6">
                      Terima kasih atas minat Anda. Tim kami akan segera menghubungi Anda via WhatsApp.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                    >
                      Kirim Pesan Lain
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              24/7 Emergency Support untuk Ketenangan Pikiran
            </h2>
            <p className="text-xl text-gray-600">
              Kontak darurat yang siap membantu kapan saja dibutuhkan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {emergencyContacts.map((category, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {category.icon}
                    <span>{category.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{contact.name}</span>
                        <Button
                          onClick={() => window.open(`tel:+62${contact.number.replace(/^0/, '')}`, '_self')}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {contact.number}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Facilities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lingkungan Strategis dengan Fasilitas Lengkap
            </h2>
            <p className="text-xl text-gray-600">
              Lokasi yang dikelilingi berbagai fasilitas pendukung
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {nearbyFacilities.map((category, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {category.icon}
                    <span>{category.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.facilities.map((facility, facilityIndex) => (
                      <div key={facilityIndex} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900">{facility.name}</span>
                          <Badge variant="outline">{facility.distance}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{facility.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Communication */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sistem Komunikasi Terintegrasi
            </h2>
            <p className="text-xl text-gray-600">
              Stay connected dengan berbagai platform komunikasi
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                platform: "WhatsApp Groups",
                icon: <MessageCircle className="h-8 w-8 text-green-600" />,
                description: "Grup kelas untuk update harian",
                action: () => handleWhatsAppClick(),
                color: "green"
              },
              {
                platform: "Instagram",
                icon: <Instagram className="h-8 w-8 text-pink-600" />,
                description: "Daily stories dan foto kegiatan",
                action: () => window.open('https://instagram.com/daycare_almuhajirin_rewwin', '_blank'),
                color: "pink"
              },
              {
                platform: "Facebook",
                icon: <Facebook className="h-8 w-8 text-blue-600" />,
                description: "Komunitas orang tua dan updates",
                action: () => window.open('https://facebook.com/daycarealmuhajirin', '_blank'),
                color: "blue"
              },
              {
                platform: "YouTube",
                icon: <Youtube className="h-8 w-8 text-red-600" />,
                description: "Video dokumentasi dan virtual tour",
                action: () => window.open('https://youtube.com/@daycarealmuhajirin', '_blank'),
                color: "red"
              }
            ].map((social, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    {social.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{social.platform}</h3>
                  <p className="text-gray-600 text-sm mb-4">{social.description}</p>
                  <Button 
                    onClick={social.action}
                    className={`bg-${social.color}-600 hover:bg-${social.color}-700 text-white w-full`}
                  >
                    Follow
                  </Button>
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
            Siap Memulai Perjalanan Bersama Kami?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Tim kami menunggu untuk membantu Anda menemukan solusi pengasuhan terbaik. 
            Jangan ragu untuk menghubungi kami kapan saja!
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <MessageCircle className="h-8 w-8" />, title: "Chat WhatsApp", desc: "Respon < 15 menit", action: () => handleWhatsAppClick() },
              { icon: <Phone className="h-8 w-8" />, title: "Telepon Langsung", desc: "07:00-17:00 WIB", action: handlePhoneCall },
              { icon: <Calendar className="h-8 w-8" />, title: "Jadwalkan Kunjungan", desc: "Tour fasilitas gratis", action: () => handleWhatsAppClick('Saya ingin jadwalkan kunjungan ke daycare') },
              { icon: <HeadphonesIcon className="h-8 w-8" />, title: "Konsultasi Gratis", desc: "Expert advice", action: () => handleWhatsAppClick('Saya ingin konsultasi gratis tentang program daycare') }
            ].map((action, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors cursor-pointer" onClick={action.action}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {action.icon}
                </div>
                <div className="text-white font-bold text-lg mb-2">{action.title}</div>
                <p className="text-green-100 text-sm">{action.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={() => handleWhatsAppClick()}
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              CHAT WHATSAPP SEKARANG
            </Button>
            <Button 
              onClick={handlePhoneCall}
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
            >
              <Phone className="mr-2 h-5 w-5" />
              TELEPON LANGSUNG
            </Button>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
            <p className="text-white font-medium mb-2">📍 Alamat Lengkap</p>
            <p className="text-green-100">Jl. Rajawali No. 207 RT 11 RW 06, Rewwin, Waru, Sidoarjo</p>
            <p className="text-green-100">WhatsApp: 0813-1466-191 (Ustadzah Iin)</p>
            <p className="text-green-100">Email: info@daycare-almuhajirin.com</p>
            <p className="text-green-100 text-sm mt-2">Available 24/7 untuk emergency contact</p>
          </div>
        </div>
      </section>
    </div>
  );
}