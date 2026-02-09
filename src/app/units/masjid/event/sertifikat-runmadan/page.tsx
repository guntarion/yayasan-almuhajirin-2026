'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Search, Download, ArrowLeft, Loader2, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ParticipantCert {
  namaLengkap: string;
  nomorBib: string | null;
  preferensiAktivitas: 'FULL_LARI' | 'LARI_JALAN' | 'JALAN';
  jenisKelamin: string;
  waktuFinish: string | null;
  nomorRegistrasi: string;
}

/* eslint-disable @next/next/no-img-element */

export default function SertifikatRunMadanPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState<ParticipantCert[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setLoading(true);
    setError('');
    setParticipants([]);
    setActiveIndex(0);
    try {
      const res = await fetch(`/api/run-madan/certificate?phone=${encodeURIComponent(phoneNumber.trim())}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Terjadi kesalahan');
        return;
      }
      if (json.data.length === 0) {
        setError('Data peserta tidak ditemukan');
        return;
      }
      setParticipants(json.data);
    } catch {
      setError('Gagal menghubungi server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(certRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      const p = participants[activeIndex];
      link.download = `Sertifikat-RunMadan2026-${p.namaLengkap.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
      alert('Gagal mengunduh sertifikat. Silakan coba lagi.');
    } finally {
      setDownloading(false);
    }
  }, [participants, activeIndex]);

  const handleReset = () => {
    setParticipants([]);
    setPhoneNumber('');
    setError('');
    setActiveIndex(0);
  };

  const participant = participants[activeIndex];

  // Dynamic font size: scale down for longer names to prevent overflow
  const nameFontSize = useMemo(() => {
    if (!participant) return 48;
    const len = participant.namaLengkap.length;
    if (len <= 25) return 48;
    if (len <= 35) return 40;
    if (len <= 45) return 34;
    return 28;
  }, [participant]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#E0F7FA] via-white to-[#B2EBF2]'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-sm border-b border-[#B2EBF2] sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
          <Link
            href='/event/run-madan'
            className='flex items-center gap-2 text-[#006064] hover:text-[#00838F] transition-colors font-semibold text-sm'
          >
            <ArrowLeft className='h-4 w-4' />
            Kembali ke Run-Madan
          </Link>
          <div className='flex items-center gap-2'>
            <Award className='h-5 w-5 text-[#006064]' />
            <span className='font-bold text-[#006064] text-sm'>Sertifikat Run-Madan 2026</span>
          </div>
        </div>
      </header>

      {/* Search Section */}
      {participants.length === 0 && (
        <div className='container mx-auto px-4 py-12 md:py-20 max-w-lg'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-[#006064] rounded-2xl mb-4'>
              <Award className='h-8 w-8 text-white' />
            </div>
            <h1 className='text-2xl md:text-3xl font-black text-[#006064] mb-2'>Sertifikat Kesertaan</h1>
            <p className='text-gray-600'>Masukkan nomor telepon yang digunakan saat registrasi</p>
          </div>
          <form onSubmit={handleSearch} className='space-y-4'>
            <div className='relative'>
              <input
                type='tel'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder='Contoh: 08175191432 atau 628175191432'
                className='w-full px-4 py-4 pr-12 rounded-xl border-2 border-[#006064]/20 focus:border-[#006064] focus:ring-2 focus:ring-[#006064]/20 outline-none text-lg font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-normal'
              />
              <Search className='absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            </div>
            {error && <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm'>{error}</div>}
            <button
              type='submit'
              disabled={loading || !phoneNumber.trim()}
              className='w-full bg-[#006064] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#00838F] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  Mencari...
                </>
              ) : (
                <>
                  <Search className='h-5 w-5' />
                  Cari Sertifikat
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Certificate Section */}
      {participants.length > 0 && participant && (
        <div className='container mx-auto px-4 py-8'>
          {/* Controls */}
          <div className='max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <button onClick={handleReset} className='flex items-center gap-2 text-[#006064] hover:text-[#00838F] font-semibold transition-colors'>
              <ArrowLeft className='h-4 w-4' />
              Cari Lagi
            </button>
            {participants.length > 1 && (
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                  disabled={activeIndex === 0}
                  className='p-2 rounded-lg bg-white border border-[#006064]/20 text-[#006064] disabled:opacity-30 hover:bg-[#E0F7FA] transition-colors'
                >
                  <ChevronLeft className='h-4 w-4' />
                </button>
                <span className='text-sm font-semibold text-[#006064]'>
                  {activeIndex + 1} / {participants.length} peserta
                </span>
                <button
                  onClick={() => setActiveIndex((i) => Math.min(participants.length - 1, i + 1))}
                  disabled={activeIndex === participants.length - 1}
                  className='p-2 rounded-lg bg-white border border-[#006064]/20 text-[#006064] disabled:opacity-30 hover:bg-[#E0F7FA] transition-colors'
                >
                  <ChevronRight className='h-4 w-4' />
                </button>
              </div>
            )}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className='flex items-center gap-2 bg-[#006064] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00838F] transition-all disabled:opacity-50'
            >
              {downloading ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Mengunduh...
                </>
              ) : (
                <>
                  <Download className='h-4 w-4' />
                  Unduh PNG
                </>
              )}
            </button>
          </div>

          {/* ===== CERTIFICATE ===== */}
          <div className='flex justify-center overflow-x-auto pb-8'>
            <div ref={certRef} style={{ width: 1123, height: 794, position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
              {/* Ready-made template background */}
              <img
                src='/images/events/Sertifikat-Digital-Runmadan.jpg'
                alt=''
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Overlay: Participant Name + Registration Number */}
              <div
                style={{
                  position: 'absolute',
                  top: 310,
                  left: 150,
                  right: 150,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <h2
                  style={{
                    fontSize: nameFontSize,
                    fontWeight: 700,
                    color: '#1a5276',
                    margin: 0,
                    fontStyle: 'italic',
                    lineHeight: 1.2,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
                    wordBreak: 'break-word',
                  }}
                >
                  {participant.namaLengkap}
                </h2>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#1a5276', letterSpacing: 1 }}>{participant.nomorRegistrasi}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
