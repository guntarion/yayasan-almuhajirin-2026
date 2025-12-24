// src/app/units/masjid/galeri/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Camera, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GaleriPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryItems = [
    {
      src: '/images/masjid/tahsin.jpeg',
      alt: 'Kajian Tahsin',
      category: 'Kajian',
      description: 'Kajian Tahsin untuk memperbaiki bacaan Al-Qur\'an',
      date: '2024',
    },
    {
      src: '/images/masjid/lomba-adzan.jpg',
      alt: 'Lomba Adzan',
      category: 'Event',
      description: 'Lomba Adzan dalam rangka memperingati hari besar Islam',
      date: '2024',
    },
    {
      src: '/images/masjid/pelatihan-kaligrafi.jpeg',
      alt: 'Pelatihan Kaligrafi',
      category: 'Pelatihan',
      description: 'Pelatihan kaligrafi untuk jamaah dan anak-anak',
      date: '2024',
    },
    {
      src: '/images/masjid/almuhajirin-berkisah.jpg',
      alt: 'Al Muhajirin Berkisah',
      category: 'Kegiatan',
      description: 'Program Al Muhajirin Berkisah untuk anak-anak',
      date: '2024',
    },
    {
      src: '/images/masjid/tadarus-senin.jpeg',
      alt: 'Tadarus Senin',
      category: 'Kajian',
      description: 'Kegiatan tadarus rutin setiap hari Senin',
      date: '2024',
    },
    {
      src: '/images/masjid/sholat-malam-ramadhan.jpg',
      alt: 'Sholat Malam Ramadhan',
      category: 'Ibadah',
      description: 'Sholat tarawih dan qiyamul lail di bulan Ramadhan',
      date: '2024',
    },
    {
      src: '/images/masjid/sholat-ied-putri.jpg',
      alt: 'Sholat Ied Jamaah Putri',
      category: 'Ibadah',
      description: 'Pelaksanaan sholat Idul Fitri/Adha jamaah putri',
      date: '2024',
    },
    {
      src: '/images/masjid/sholat-ied-putra.jpg',
      alt: 'Sholat Ied Jamaah Putra',
      category: 'Ibadah',
      description: 'Pelaksanaan sholat Idul Fitri/Adha jamaah putra',
      date: '2024',
    },
    {
      src: '/images/masjid/pembelajaran-kaligrafi.jpeg',
      alt: 'Pembelajaran Kaligrafi',
      category: 'Pelatihan',
      description: 'Kelas pembelajaran seni kaligrafi Arab',
      date: '2024',
    },
    {
      src: '/images/masjid/pelatihan-perawatan-jenazah-muslimah.jpeg',
      alt: 'Pelatihan Perawatan Jenazah Muslimah',
      category: 'Pelatihan',
      description: 'Pelatihan tata cara perawatan jenazah untuk muslimah',
      date: '2024',
    },
    {
      src: '/images/masjid/lomba-kaligrafi-anak.jpg',
      alt: 'Lomba Kaligrafi Anak',
      category: 'Event',
      description: 'Lomba kaligrafi untuk anak-anak dalam rangka PHBI',
      date: '2024',
    },
    {
      src: '/images/masjid/aktivitas-tadarus-muhajirin-kids.jpeg',
      alt: 'Tadarus Muhajirin Kids',
      category: 'Kegiatan',
      description: 'Aktivitas tadarus Al-Qur\'an untuk anak-anak Muhajirin Kids',
      date: '2024',
    },
  ];

  const categories = ['Semua', 'Ibadah', 'Kajian', 'Pelatihan', 'Event', 'Kegiatan'];
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredGallery = activeCategory === 'Semua'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredGallery.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === filteredGallery.length - 1 ? 0 : selectedImage + 1);
    }
  };

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
              <Camera className="h-5 w-5" />
              <span className="text-sm font-medium">Galeri</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Dokumentasi Kegiatan
            </h1>

            <p className="text-lg text-white/90 leading-relaxed">
              Momen-momen berharga dari berbagai kegiatan di Masjid Al Muhajirin Rewwin
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
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="font-semibold">{item.alt}</p>
                      <p className="text-sm text-white/80">{item.category}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#00BCD4]">{item.category}</span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.alt}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada foto di kategori ini</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50 bg-black/30 rounded-full p-2"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50 bg-black/30 rounded-full p-2"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div
            className="relative max-w-5xl max-h-[80vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={filteredGallery[selectedImage].src}
                alt={filteredGallery[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl font-semibold">{filteredGallery[selectedImage].alt}</h3>
              <p className="text-white/80">{filteredGallery[selectedImage].description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-white/60">
                <span>{filteredGallery[selectedImage].category}</span>
                <span>{filteredGallery[selectedImage].date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006064] mb-4">
              Bagikan Momen Berharga Anda
            </h2>
            <p className="text-[#00838F] mb-6">
              Punya foto kegiatan di Masjid Al Muhajirin? Kirimkan ke kami untuk ditampilkan di galeri.
            </p>
            <a
              href="https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20mengirimkan%20foto%20kegiatan%20untuk%20galeri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Camera className="h-5 w-5" />
              <span>Kirim Foto</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
