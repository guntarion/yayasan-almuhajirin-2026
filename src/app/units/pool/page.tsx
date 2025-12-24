import React from 'react';

export default function PoolPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kolam Renang Al Muhajirin
          </h1>
          <p className="text-lg text-muted-foreground">
            Yayasan Al Muhajirin Rewwin
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-card p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold mb-4">
              Selamat Datang di Unit Kolam Renang
            </h2>
            <p className="mb-4">
              Fasilitas kolam renang untuk masyarakat umum dan warga sekitar.
            </p>
            <div className="mt-6 space-y-2">
              <h3 className="text-xl font-semibold">Informasi Kontak</h3>
              <p>Website: pool.almuhajirin.or.id</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
