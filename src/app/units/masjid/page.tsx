import React from 'react';

export default function MasjidPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ketakmiran Masjid Al Muhajirin
          </h1>
          <p className="text-lg text-muted-foreground">
            Rewwin, Waru, Sidoarjo
          </p>
        </div>

        {/* Content Section */}
        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-card p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold mb-4">
              Selamat Datang di Unit Ketakmiran
            </h2>
            <p className="mb-4">
              Ini adalah halaman unit Ketakmiran Masjid Al Muhajirin.
              Konten lebih lanjut akan ditambahkan sesuai kebutuhan unit.
            </p>
            <div className="mt-6 space-y-2">
              <h3 className="text-xl font-semibold">Informasi Kontak</h3>
              <p>Website: masjid.almuhajirin.or.id</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
