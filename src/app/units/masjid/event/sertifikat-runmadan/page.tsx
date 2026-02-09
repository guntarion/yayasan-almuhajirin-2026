'use client';

import React, { useState, useRef, useCallback } from 'react';
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
  const [searchType, setSearchType] = useState<'bib' | 'reg'>('bib');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState<ParticipantCert[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setLoading(true);
    setError('');
    setParticipants([]);
    setActiveIndex(0);
    try {
      const param =
        searchType === 'bib'
          ? `bib=${encodeURIComponent(searchValue.trim())}`
          : `reg=${encodeURIComponent(searchValue.trim())}`;
      const res = await fetch(`/api/run-madan/certificate?${param}`);
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
    setSearchValue('');
    setError('');
    setActiveIndex(0);
  };

  const participant = participants[activeIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FA] via-white to-[#B2EBF2]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#B2EBF2] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/event/run-madan"
            className="flex items-center gap-2 text-[#006064] hover:text-[#00838F] transition-colors font-semibold text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Run-Madan
          </Link>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#006064]" />
            <span className="font-bold text-[#006064] text-sm">Sertifikat Run-Madan 2026</span>
          </div>
        </div>
      </header>

      {/* Search Section */}
      {participants.length === 0 && (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#006064] rounded-2xl mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#006064] mb-2">Sertifikat Kesertaan</h1>
            <p className="text-gray-600">Masukkan nomor BIB atau nomor registrasi untuk mengunduh sertifikat</p>
          </div>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex rounded-xl overflow-hidden border-2 border-[#006064]/20">
              <button
                type="button"
                onClick={() => {
                  setSearchType('bib');
                  setError('');
                }}
                className={`flex-1 py-3 text-sm font-bold transition-all ${searchType === 'bib' ? 'bg-[#006064] text-white' : 'bg-white text-[#006064] hover:bg-[#E0F7FA]'}`}
              >
                Nomor BIB
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchType('reg');
                  setError('');
                }}
                className={`flex-1 py-3 text-sm font-bold transition-all ${searchType === 'reg' ? 'bg-[#006064] text-white' : 'bg-white text-[#006064] hover:bg-[#E0F7FA]'}`}
              >
                Nomor Registrasi
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'bib' ? 'Contoh: 001' : 'Contoh: RM-2026-0001'}
                className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-[#006064]/20 focus:border-[#006064] focus:ring-2 focus:ring-[#006064]/20 outline-none text-lg font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-normal"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading || !searchValue.trim()}
              className="w-full bg-[#006064] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#00838F] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Mencari...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Cari Sertifikat
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Certificate Section */}
      {participants.length > 0 && participant && (
        <div className="container mx-auto px-4 py-8">
          {/* Controls */}
          <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-[#006064] hover:text-[#00838F] font-semibold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Cari Lagi
            </button>
            {participants.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                  disabled={activeIndex === 0}
                  className="p-2 rounded-lg bg-white border border-[#006064]/20 text-[#006064] disabled:opacity-30 hover:bg-[#E0F7FA] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-[#006064]">
                  {activeIndex + 1} / {participants.length} peserta
                </span>
                <button
                  onClick={() => setActiveIndex((i) => Math.min(participants.length - 1, i + 1))}
                  disabled={activeIndex === participants.length - 1}
                  className="p-2 rounded-lg bg-white border border-[#006064]/20 text-[#006064] disabled:opacity-30 hover:bg-[#E0F7FA] transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 bg-[#006064] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00838F] transition-all disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengunduh...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Unduh PNG
                </>
              )}
            </button>
          </div>

          {/* ===== CERTIFICATE ===== */}
          <div className="flex justify-center overflow-x-auto pb-8">
            <div
              ref={certRef}
              style={{ width: 1123, height: 794, position: 'relative', flexShrink: 0, overflow: 'hidden' }}
            >
              {/* Background image */}
              <img
                src="/images/events/base-piagam.png"
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Text content overlay - positioned within the white content area */}
              <div
                style={{
                  position: 'absolute',
                  top: 230,
                  left: 110,
                  right: 95,
                  bottom: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Title */}
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: '#1a5276',
                    letterSpacing: 8,
                    margin: '0 0 2px 0',
                    textTransform: 'uppercase',
                  }}
                >
                  Sertifikat Kesertaan
                </h1>

                {/* Decorative line under title */}
                <svg width="260" height="10" viewBox="0 0 260 10" fill="none" style={{ marginBottom: 6 }}>
                  <line x1="10" y1="5" x2="250" y2="5" stroke="url(#titleLine)" strokeWidth="1.5" />
                  <defs>
                    <linearGradient id="titleLine" x1="10" y1="0" x2="250" y2="0">
                      <stop stopColor="transparent" />
                      <stop offset="0.5" stopColor="#2980b9" />
                      <stop offset="1" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>

                <p style={{ fontSize: 15, color: '#5d6d7e', margin: '0 0 4px 0', letterSpacing: 3 }}>
                  Diberikan kepada:
                </p>

                {/* Participant name */}
                <h2
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: '#1a3c5e',
                    margin: '0 0 2px 0',
                    fontStyle: 'italic',
                    maxWidth: 780,
                    lineHeight: 1.15,
                  }}
                >
                  {participant.namaLengkap}
                </h2>

                {/* Name underline */}
                <svg width="360" height="6" viewBox="0 0 360 6" fill="none" style={{ marginBottom: 10 }}>
                  <line x1="30" y1="3" x2="330" y2="3" stroke="url(#nameLine)" strokeWidth="1.5" />
                  <defs>
                    <linearGradient id="nameLine" x1="30" y1="0" x2="330" y2="0">
                      <stop stopColor="transparent" />
                      <stop offset="0.5" stopColor="#2980b9" />
                      <stop offset="1" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Description */}
                <p style={{ fontSize: 15, color: '#2c3e50', lineHeight: 1.5, maxWidth: 650, margin: '0 0 8px 0' }}>
                  Sebagai peserta kegiatan <strong style={{ color: '#1a5276' }}>Run-Madan 2026</strong> —
                  Tarhib Ramadhan 1447H
                  {participant.nomorBib && (
                    <>
                      {' '}dengan nomor BIB{' '}
                      <strong style={{ color: '#1a5276', fontSize: 17 }}>#{participant.nomorBib}</strong>
                    </>
                  )}
                </p>

                {/* Activity badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1a5276, #2980b9)',
                    color: '#ffffff',
                    padding: '6px 32px',
                    borderRadius: 6,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                    }}
                  >
                    FUN RUN-MADAN 3K
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1, opacity: 0.85 }}>
                    Tarhib Ramadhan 1447H
                  </span>
                </div>

                {/* Event details */}
                <p style={{ fontSize: 12, color: '#7f8c8d', margin: '0 0 12px 0', letterSpacing: 1 }}>
                  Ahad, 6 Februari 2026 &bull; REWWIN, Waru, Sidoarjo
                </p>

                {/* Signatures */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: 140,
                    marginTop: 'auto',
                  }}
                >
                  {/* Ketua Panitia */}
                  <div style={{ textAlign: 'center', width: 200 }}>
                    <p style={{ fontSize: 11, color: '#7f8c8d', margin: '0 0 2px 0', letterSpacing: 0.5 }}>
                      Ketua Panitia
                    </p>
                    <img
                      src="/images/events/ttd-arif-budi-santoso.jpeg"
                      alt="Tanda tangan Ketua Panitia"
                      style={{ width: 100, height: 60, objectFit: 'contain', margin: '0 auto' }}
                    />
                    <div style={{ width: 160, borderBottom: '1.5px solid #2980b9', margin: '0 auto 3px' }} />
                    <p style={{ fontSize: 12, color: '#1a3c5e', fontWeight: 700, margin: '0 0 1px 0' }}>
                      Arif Budi Santoso
                    </p>
                    <p style={{ fontSize: 10, color: '#7f8c8d', margin: 0 }}>Run-Madan 2026</p>
                  </div>
                  {/* Ketua Takmir */}
                  <div style={{ textAlign: 'center', width: 200 }}>
                    <p style={{ fontSize: 11, color: '#7f8c8d', margin: '0 0 2px 0', letterSpacing: 0.5 }}>
                      Ketua Takmir
                    </p>
                    <img
                      src="/images/events/ttd-iwan-efrulwan.jpeg"
                      alt="Tanda tangan Ketua Takmir"
                      style={{ width: 100, height: 60, objectFit: 'contain', margin: '0 auto' }}
                    />
                    <div style={{ width: 160, borderBottom: '1.5px solid #2980b9', margin: '0 auto 3px' }} />
                    <p style={{ fontSize: 12, color: '#1a3c5e', fontWeight: 700, margin: '0 0 1px 0' }}>
                      Iwan Efrulwan
                    </p>
                    <p style={{ fontSize: 10, color: '#7f8c8d', margin: 0 }}>Masjid Al Muhajirin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
