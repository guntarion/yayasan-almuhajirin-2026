// src/app/units/kbtk/galeri/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, X, ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';

export default function GaleriPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20KBTK%20Al%20Muhajirin', '_blank');
  };

  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'kegiatan', name: 'Kegiatan Belajar' },
    { id: 'fasilitas', name: 'Fasilitas' },
    { id: 'acara', name: 'Acara Sekolah' },
    { id: 'aktivitas', name: 'Aktivitas Siswa' },
  ];

  const images = [
    // Hero & Welcome
    { src: '/images/kbtk/kegiatan/al-muhajirin-hero-welcome2.png', alt: 'Welcome to KBTK Al Muhajirin', category: 'fasilitas' },
    { src: '/images/kbtk/kegiatan/kbtk-front-01.jpg', alt: 'Gedung KBTK Al Muhajirin', category: 'fasilitas' },
    { src: '/images/kbtk/kegiatan/kbtk-front-02.jpg', alt: 'Tampak Depan KBTK', category: 'fasilitas' },

    // Kegiatan Siswa
    { src: '/images/kbtk/kegiatan/al-muhajirin-anaksholih.jpg', alt: 'Anak Sholih Al Muhajirin', category: 'aktivitas' },
    { src: '/images/kbtk/kegiatan/almuhajirin-siswi-perkenalkan-kbtk.jpg', alt: 'Siswi Memperkenalkan KBTK', category: 'aktivitas' },
    { src: '/images/kbtk/kegiatan/almuhajirin-using-laptop.jpg', alt: 'Belajar dengan Teknologi', category: 'kegiatan' },
    { src: '/images/kbtk/kegiatan/two-kids-al-muhajirin.jpg', alt: 'Siswa KBTK', category: 'aktivitas' },

    // Kegiatan Al Zaitun (Program)
    { src: '/images/kbtk/kegiatan/alzaitun-al-muhajirin-01.jpg', alt: 'Kegiatan Al Zaitun 1', category: 'acara' },
    { src: '/images/kbtk/kegiatan/alzaitun-al-muhajirin-02.jpg', alt: 'Kegiatan Al Zaitun 2', category: 'acara' },
    { src: '/images/kbtk/kegiatan/alzaitun-al-muhajirin-03.jpg', alt: 'Kegiatan Al Zaitun 3', category: 'acara' },
    { src: '/images/kbtk/kegiatan/alzaitun-al-muhajirin-04.jpg', alt: 'Kegiatan Al Zaitun 4', category: 'acara' },

    // Kegiatan Pembelajaran
    { src: '/images/kbtk/kegiatan/keg-al-muhajirin-al-zaitun-01.jpg', alt: 'Kegiatan Pembelajaran 1', category: 'kegiatan' },
    { src: '/images/kbtk/kegiatan/keg-al-muhajirin-al-zaitun-02.jpg', alt: 'Kegiatan Pembelajaran 2', category: 'kegiatan' },
    { src: '/images/kbtk/kegiatan/keg-al-muhajirin-al-zaitun-03.jpg', alt: 'Kegiatan Pembelajaran 3', category: 'kegiatan' },
    { src: '/images/kbtk/kegiatan/keg-al-muhajirin-al-zaitun-04.jpg', alt: 'Kegiatan Pembelajaran 4', category: 'kegiatan' },
    { src: '/images/kbtk/kegiatan/keg-al-muhajirin-al-zaitun-05.jpg', alt: 'Kegiatan Pembelajaran 5', category: 'kegiatan' },
    { src: '/images/kbtk/kegiatan/keg-al-muhajirin-al-zaitun--06.jpg', alt: 'Kegiatan Pembelajaran 6', category: 'kegiatan' },
    { src: '/images/kbtk/kegiatan/keg-al-muhajirin-al-zaitun-07.jpg', alt: 'Kegiatan Pembelajaran 7', category: 'kegiatan' },
    { src: '/images/kbtk/kegiatan/keg-al-muhajirin-al-zaitun-08.jpg', alt: 'Kegiatan Pembelajaran 8', category: 'kegiatan' },

    // Aktivitas Fisik
    { src: '/images/kbtk/kegiatan/toddler-gym.jpg', alt: 'Toddler Gymnastic', category: 'aktivitas' },
    { src: '/images/kbtk/kegiatan/al-muhajirin-main-malam.jpg', alt: 'Kegiatan Malam', category: 'acara' },

    // Kesehatan
    { src: '/images/kbtk/kegiatan/anak-diperiksa-dokter-gigi.jpg', alt: 'Pemeriksaan Kesehatan Gigi', category: 'acara' },

    // Background/Slider
    { src: '/images/kbtk/kegiatan/Slider-Guru-01C.jpg', alt: 'Tim Guru KBTK', category: 'fasilitas' },
  ];

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory);

  const handlePrevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Camera className="h-5 w-5" />
              <span className="text-sm font-medium">Galeri</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Galeri Foto
            </h1>
            <p className="text-lg text-[#B2EBF2]">
              Momen-momen berharga dan kegiatan menyenangkan di KBTK Al Muhajirin Rewwin
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(index)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada foto dalam kategori ini</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="relative max-w-5xl max-h-[80vh] w-full mx-4">
            <Image
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              width={1200}
              height={800}
              className="object-contain w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-center font-medium">{filteredImages[selectedImage].alt}</p>
              <p className="text-white/60 text-center text-sm mt-1">
                {selectedImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-6">
              Ingin Melihat Langsung Kegiatan Kami?
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Jadwalkan kunjungan ke sekolah kami dan lihat langsung suasana belajar yang menyenangkan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Jadwalkan Kunjungan</span>
              </button>
              <Link
                href="/kontak"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                <span>Lihat Lokasi</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
