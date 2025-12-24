// src/app/(WebsiteLayout)/galeri/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { 
  Video,
  Filter,
  Download,
  Share2,
  Play,
  Maximize,
  ArrowRight,
  Calendar,
  Users,
  Award,
  BookOpen,
  Palette,
  Activity,
  Heart,
  Utensils,
  Bed,
  PartyPopper,
  Eye,
  Clock,
  Star,
  Image as ImageIcon
} from 'lucide-react';

/**
 * Galeri page for Daycare Al Muhajirin Rewwin
 * Visual documentation of activities, facilities, and precious moments
 */
export default function GaleriPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('aktivitas');
  const [viewMode, setViewMode] = useState('grid'); // grid or slideshow
  
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Galeri%20Daycare%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const filterCategories = {
    aktivitas: [
      { id: 'pembelajaran', name: 'Pembelajaran', icon: <BookOpen className="h-4 w-4" />, count: 45 },
      { id: 'kreativitas', name: 'Kreativitas', icon: <Palette className="h-4 w-4" />, count: 38 },
      { id: 'fisik', name: 'Aktivitas Fisik', icon: <Activity className="h-4 w-4" />, count: 32 },
      { id: 'spiritual', name: 'Spiritual', icon: <Heart className="h-4 w-4" />, count: 28 },
      { id: 'makan', name: 'Makan Bersama', icon: <Utensils className="h-4 w-4" />, count: 24 },
      { id: 'istirahat', name: 'Istirahat', icon: <Bed className="h-4 w-4" />, count: 16 },
      { id: 'event', name: 'Event Khusus', icon: <PartyPopper className="h-4 w-4" />, count: 22 }
    ],
    usia: [
      { id: 'bayi', name: 'Bayi (3-12 bulan)', icon: <Users className="h-4 w-4" />, count: 34 },
      { id: 'toddler', name: 'Toddler (1-2 tahun)', icon: <Users className="h-4 w-4" />, count: 52 },
      { id: 'preschool', name: 'Preschool (2-3+ tahun)', icon: <Users className="h-4 w-4" />, count: 67 }
    ],
    waktu: [
      { id: 'bulan-ini', name: 'Bulan Ini', icon: <Calendar className="h-4 w-4" />, count: 28 },
      { id: '3-bulan', name: '3 Bulan Terakhir', icon: <Calendar className="h-4 w-4" />, count: 89 },
      { id: 'semester', name: 'Semester Ini', icon: <Calendar className="h-4 w-4" />, count: 156 },
      { id: 'all-time', name: 'All Time', icon: <Calendar className="h-4 w-4" />, count: 205 }
    ]
  };

  const featuredCollections = [
    {
      id: 1,
      title: "Pagi Ceria Penuh Semangat",
      description: "Aktivitas pagi hari yang penuh energi dan kebahagiaan",
      thumbnail: "/gallery/morning-activities.jpg",
      photos: 12,
      videos: 2,
      category: "pembelajaran",
      highlights: ["Morning Circle", "Physical Exercise", "Breakfast Time", "Learning Preparation"]
    },
    {
      id: 2,
      title: "Belajar Sambil Bermain",
      description: "Metode pembelajaran fun learning yang efektif dan menyenangkan",
      thumbnail: "/gallery/learning-play.jpg",
      photos: 18,
      videos: 3,
      category: "pembelajaran",
      highlights: ["Interactive Learning", "Art & Craft", "Story Time", "Science Play"]
    },
    {
      id: 3,
      title: "Spiritual Building",
      description: "Kegiatan pembentukan karakter Islami sejak dini",
      thumbnail: "/gallery/spiritual-activities.jpg",
      photos: 15,
      videos: 2,
      category: "spiritual",
      highlights: ["Prayer Time", "Quran Reading", "Islamic Songs", "Character Building"]
    },
    {
      id: 4,
      title: "Social & Emotional Growth",
      description: "Dokumentasi perkembangan sosial-emosional anak-anak",
      thumbnail: "/gallery/social-emotional.jpg",
      photos: 20,
      videos: 4,
      category: "kreativitas",
      highlights: ["Friendship", "Helping Each Other", "Emotional Expression", "Group Projects"]
    }
  ];

  const videoCollections = [
    {
      id: 1,
      title: "A Day in Al Muhajirin",
      duration: "4:32",
      thumbnail: "/gallery/video-daily-routine.jpg",
      description: "Dokumenter singkat aktivitas full day dari pagi hingga sore",
      views: 1250,
      category: "daily"
    },
    {
      id: 2,
      title: "Milestone Moments",
      duration: "3:15",
      thumbnail: "/gallery/video-milestones.jpg",
      description: "Kompilasi pencapaian dan perkembangan anak-anak",
      views: 890,
      category: "achievement"
    },
    {
      id: 3,
      title: "Behind the Scenes",
      duration: "2:45",
      thumbnail: "/gallery/video-behind-scenes.jpg",
      description: "Persiapan tim dan aktivitas di belakang layar",
      views: 567,
      category: "facility"
    }
  ];

  const monthlyHighlights = [
    {
      month: "Januari 2024",
      theme: "New Year, New Adventures",
      photos: 25,
      cover: "/gallery/january-highlights.jpg",
      description: "Resolusi dan goal setting untuk anak dengan berbagai aktivitas menarik"
    },
    {
      month: "Februari 2024",
      theme: "Love & Friendship",
      photos: 30,
      cover: "/gallery/february-highlights.jpg",
      description: "Bulan kasih sayang dengan fokus pada persahabatan dan empati"
    },
    {
      month: "Maret 2024",
      theme: "Spring Growth",
      photos: 28,
      cover: "/gallery/march-highlights.jpg",
      description: "Pertumbuhan dan perkembangan dengan project berkebun"
    }
  ];

  const facilityShowcase = [
    {
      category: "Learning Spaces",
      rooms: [
        { name: "Classroom Setup", image: "/gallery/classroom-setup.jpg", description: "Arrangement kondusif untuk belajar" },
        { name: "Library Corner", image: "/gallery/library-corner.jpg", description: "Area baca yang cozy dan menarik" },
        { name: "Art Studio", image: "/gallery/art-studio.jpg", description: "Ruang kreativitas yang inspiring" },
        { name: "Music Room", image: "/gallery/music-room.jpg", description: "Space untuk eksplorasi musik dan gerak" }
      ]
    },
    {
      category: "Care Facilities",
      rooms: [
        { name: "Sleeping Area", image: "/gallery/sleeping-area.jpg", description: "Tempat tidur yang nyaman dan higienis" },
        { name: "Dining Hall", image: "/gallery/dining-hall.jpg", description: "Ruang makan yang cheerful dan clean" },
        { name: "Medical Room", image: "/gallery/medical-room.jpg", description: "Klinik kesehatan dengan peralatan lengkap" },
        { name: "Kitchen", image: "/gallery/kitchen.jpg", description: "Dapur dengan standar commercial grade" }
      ]
    },
    {
      category: "Play Areas",
      rooms: [
        { name: "Indoor Playground", image: "/gallery/indoor-playground.jpg", description: "Soft play area yang aman" },
        { name: "Outdoor Playground", image: "/gallery/outdoor-playground.jpg", description: "Equipment berkualitas tinggi" },
        { name: "Sensory Garden", image: "/gallery/sensory-garden.jpg", description: "Area eksplorasi alam" },
        { name: "Sports Court", image: "/gallery/sports-court.jpg", description: "Mini court untuk aktivitas fisik" }
      ]
    }
  ];

  const achievements = [
    {
      category: "Individual Achievements",
      items: [
        { title: "Reading Milestone", child: "Aisha", age: "3 tahun", description: "Berhasil membaca kata pertama dengan lancar", image: "/gallery/achievement-reading.jpg" },
        { title: "Art Excellence", child: "Kenji", age: "2.5 tahun", description: "Karya seni terpilih untuk exhibition", image: "/gallery/achievement-art.jpg" },
        { title: "Character Award", child: "Zahra", age: "2 tahun", description: "Penghargaan untuk sikap berbagi yang luar biasa", image: "/gallery/achievement-character.jpg" }
      ]
    },
    {
      category: "Group Achievements",
      items: [
        { title: "Team Project Success", description: "Proyek berkebun bersama yang berhasil panen", image: "/gallery/achievement-team.jpg" },
        { title: "Performance Award", description: "Penampilan tari Islami dalam acara sekolah", image: "/gallery/achievement-performance.jpg" },
        { title: "Community Recognition", description: "Apresiasi dari masyarakat untuk program sosial", image: "/gallery/achievement-community.jpg" }
      ]
    }
  ];

  const renderImageCard = (item: { title?: string; name?: string; description: string; photos?: number; highlights?: string[] }, index: number) => (
    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Image Placeholder</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline" className="bg-white/90 border-white/90 text-gray-900 hover:bg-white">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {item.photos && (
          <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
            {item.photos} foto
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{item.title || item.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        {item.highlights && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.highlights.slice(0, 2).map((highlight: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {highlight}
              </Badge>
            ))}
            {item.highlights.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{item.highlights.length - 2} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderVideoCard = (video: { title: string; duration: string; description: string; views: number }, index: number) => (
    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <div className="text-center">
            <Video className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Video Placeholder</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <Button size="lg" className="bg-white/90 text-gray-900 hover:bg-white rounded-full w-16 h-16">
            <Play className="h-6 w-6" />
          </Button>
        </div>
        <Badge className="absolute top-2 left-2 bg-red-600 text-white">
          <Video className="h-3 w-3 mr-1" />
          {video.duration}
        </Badge>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
          <Eye className="h-3 w-3 inline mr-1" />
          {video.views.toLocaleString()} views
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
        <p className="text-gray-600 text-sm">{video.description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-100 text-purple-800 px-6 py-2">📸 Dokumentasi Visual Premium</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Lihat{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Kebahagiaan
              </span>{' '}
              dan Pembelajaran dalam Setiap Momen
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Dokumentasi visual dari kegiatan harian, milestone anak-anak, dan suasana ceria di Daycare Al Muhajirin Rewwin. 
              Setiap foto bercerita tentang pertumbuhan dan kebahagiaan buah hati Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory('aktivitas')}
                variant={selectedCategory === 'aktivitas' ? 'default' : 'outline'}
                className={selectedCategory === 'aktivitas' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Berdasarkan Aktivitas
              </Button>
              <Button
                onClick={() => setSelectedCategory('usia')}
                variant={selectedCategory === 'usia' ? 'default' : 'outline'}
                className={selectedCategory === 'usia' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <Users className="h-4 w-4 mr-2" />
                Berdasarkan Usia
              </Button>
              <Button
                onClick={() => setSelectedCategory('waktu')}
                variant={selectedCategory === 'waktu' ? 'default' : 'outline'}
                className={selectedCategory === 'waktu' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Berdasarkan Waktu
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Pilih filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Content</SelectItem>
                  {filterCategories[selectedCategory as keyof typeof filterCategories].map((filter) => (
                    <SelectItem key={filter.id} value={filter.id}>
                      <div className="flex items-center space-x-2">
                        {filter.icon}
                        <span>{filter.name} ({filter.count})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  Grid
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'slideshow' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('slideshow')}
                  className="px-3"
                >
                  Slideshow
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tags */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {filterCategories[selectedCategory as keyof typeof filterCategories].map((filter) => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className={`${
                  selectedFilter === filter.id 
                    ? 'bg-purple-100 border-purple-300 text-purple-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {filter.icon}
                <span className="ml-2">{filter.name}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Highlight Momen Terbaik
            </h2>
            <p className="text-xl text-gray-600">
              Koleksi foto terpilih yang menampilkan kegiatan dan perkembangan anak-anak
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuredCollections.map((collection, index) => renderImageCard(collection, index))}
          </div>
        </div>
      </section>

      {/* Video Collections */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Video Dokumentasi Spesial
            </h2>
            <p className="text-xl text-gray-600">
              Rekaman video kegiatan sehari-hari dan momen-momen berharga
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {videoCollections.map((video, index) => renderVideoCard(video, index))}
          </div>
        </div>
      </section>

      {/* Monthly Highlights */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sorotan Bulanan - Momen Spesial Setiap Bulan
            </h2>
            <p className="text-xl text-gray-600">
              Tema khusus setiap bulan dengan aktivitas dan pembelajaran yang menarik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {monthlyHighlights.map((highlight, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Monthly Highlight</p>
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                    {highlight.photos} foto
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">{highlight.month}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{highlight.theme}</h3>
                  <p className="text-gray-600 text-sm">{highlight.description}</p>
                  <Button 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => setSelectedFilter('bulan-ini')}
                  >
                    Lihat Koleksi
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tour Visual Fasilitas Premium Kami
            </h2>
            <p className="text-xl text-gray-600">
              Jelajahi setiap sudut fasilitas daycare yang dirancang khusus untuk kenyamanan anak
            </p>
          </div>

          <Tabs defaultValue="learning" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="learning">Learning Spaces</TabsTrigger>
              <TabsTrigger value="care">Care Facilities</TabsTrigger>
              <TabsTrigger value="play">Play Areas</TabsTrigger>
            </TabsList>

            {facilityShowcase.map((category, categoryIndex) => (
              <TabsContent 
                key={categoryIndex}
                value={category.category.toLowerCase().split(' ')[0]}
                className="mt-8"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.rooms.map((room, roomIndex) => (
                    <Card key={roomIndex} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                      <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Facility Image</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                          <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                            <Maximize className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{room.name}</h4>
                        <p className="text-gray-600 text-sm">{room.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Achievement Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Prestasi dan Pencapaian Membanggakan
            </h2>
            <p className="text-xl text-gray-600">
              Dokumentasi milestone dan achievement yang membanggakan dari anak-anak kami
            </p>
          </div>

          {achievements.map((achievementCategory, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {achievementCategory.category}
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {achievementCategory.items.map((item, itemIndex) => (
                  <Card key={itemIndex} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                        <div className="text-center">
                          <Award className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Achievement Photo</p>
                        </div>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Achievement
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                      {'child' in item && item.child && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-600">
                            {item.child} ({'age' in item && item.age ? item.age : ''})
                          </span>
                        </div>
                      )}
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Features */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Galeri Interaktif untuk Pengalaman Lebih
            </h2>
            <p className="text-xl text-gray-600">
              Fitur-fitur canggih untuk menjelajahi dokumentasi visual dengan lebih menarik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Maximize className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">360° Virtual Tour</h3>
              <p className="text-gray-600 mb-4">
                Jelajahi fasilitas dengan tour virtual 360° yang interaktif
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Mulai Virtual Tour
              </Button>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Time-lapse Documentation</h3>
              <p className="text-gray-600 mb-4">
                Video time-lapse untuk melihat progress dan perkembangan anak
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Lihat Time-lapse
              </Button>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-shadow border-0 shadow-lg text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Download Center</h3>
              <p className="text-gray-600 mb-4">
                Download foto dan video berkualitas tinggi untuk koleksi pribadi
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Browse Downloads
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Jadilah Bagian dari Galeri Kebahagiaan Kami
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Setiap hari adalah momen berharga untuk pertumbuhan dan kebahagiaan anak. 
            Bergabunglah dan saksikan sendiri keajaiban pembelajaran di daycare kami.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <Calendar className="h-8 w-8" />, title: "Schedule Visit", desc: "Lihat langsung suasana ceria kami" },
              { icon: <Share2 className="h-8 w-8" />, title: "Follow Social Media", desc: "Daily updates di Instagram & Facebook" },
              { icon: <Download className="h-8 w-8" />, title: "Subscribe Newsletter", desc: "Monthly highlight via email" },
              { icon: <Video className="h-8 w-8" />, title: "Request Videos", desc: "Minta dokumentasi khusus anak Anda" }
            ].map((action, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {action.icon}
                </div>
                <div className="text-white font-bold text-lg mb-2">{action.title}</div>
                <p className="text-purple-100 text-sm">{action.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={handleWhatsAppClick}
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              JADWALKAN KUNJUNGAN SEKARANG
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold"
            >
              <Link href="https://instagram.com/daycare_almuhajirin" target="_blank">
                FOLLOW SOCIAL MEDIA KAMI
              </Link>
            </Button>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
            <p className="text-white font-medium mb-2">📸 Gallery & Social Media</p>
            <p className="text-purple-100">WhatsApp: 0813-1466-191 (Ustadzah Iin)</p>
            <p className="text-purple-100">Instagram: @daycare_almuhajirin</p>
            <p className="text-purple-100">Email: gallery@daycare-almuhajirin.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}