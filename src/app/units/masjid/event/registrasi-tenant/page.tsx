'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import {
  Store,
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  FileText,
  Zap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  ArrowLeft,
  ShoppingBag,
  Coffee,
  Heart,
  MoreHorizontal,
} from 'lucide-react';

// Form types
type JenisProduk = 'MAKANAN' | 'MINUMAN' | 'PRODUK_UMKM' | 'PRODUK_KESEHATAN' | 'LAINNYA';
type KegiatanEvent = 'SENAM_PAGI' | 'FUN_RUN' | 'KEDUANYA';

interface FormData {
  // A. Informasi Tenant
  namaTenant: string;
  namaPenanggungJawab: string;
  alamat: string;
  nomorTelepon: string;
  email: string;
  // B. Informasi Produk
  jenisProduk: JenisProduk[];
  jenisProdukLainnya: string;
  namaProdukUtama: string;
  deskripsiProduk: string;
  // C. Kebutuhan Stan
  butuhListrik: boolean;
  kebutuhanListrik: string;
  perlengkapanDibawa: string;
  // D. Kegiatan
  kegiatanDiikuti: KegiatanEvent;
  // E. Pernyataan
  setujuSyaratKetentuan: boolean;
}

interface RegistrationResult {
  nomorRegistrasi: string;
  namaTenant: string;
  namaPenanggungJawab: string;
  namaEvent: string;
}

const JENIS_PRODUK_OPTIONS: { value: JenisProduk; label: string; icon: React.ReactNode }[] = [
  { value: 'MAKANAN', label: 'Makanan', icon: <Coffee className="w-4 h-4" /> },
  { value: 'MINUMAN', label: 'Minuman', icon: <Coffee className="w-4 h-4" /> },
  { value: 'PRODUK_UMKM', label: 'Produk UMKM', icon: <ShoppingBag className="w-4 h-4" /> },
  { value: 'PRODUK_KESEHATAN', label: 'Produk Kesehatan (non-medis)', icon: <Heart className="w-4 h-4" /> },
  { value: 'LAINNYA', label: 'Lainnya', icon: <MoreHorizontal className="w-4 h-4" /> },
];

const KEGIATAN_OPTIONS: { value: KegiatanEvent; label: string }[] = [
  { value: 'SENAM_PAGI', label: 'Senam Pagi' },
  { value: 'FUN_RUN', label: '3K Fun Run' },
  { value: 'KEDUANYA', label: 'Keduanya' },
];

const SYARAT_KETENTUAN = [
  'Mematuhi seluruh ketentuan dan arahan panitia selama kegiatan berlangsung.',
  'Menjaga kebersihan, ketertiban, dan etika berjualan di lingkungan masjid.',
  'Tidak menggunakan pengeras suara atau aktivitas promosi yang mengganggu kegiatan utama.',
  'Tidak menjual produk yang bertentangan dengan nilai kepatutan dan lingkungan masjid.',
  'Menempati lokasi stan sesuai penempatan yang ditentukan panitia.',
  'Menyelesaikan kewajiban kontribusi/biaya stan (jika ada) sebelum acara berlangsung.',
];

// Fixed event name for current registration
const CURRENT_EVENT_NAME = 'Tarhib Ramadhan 2026';

export default function RegistrasiTenantPage() {
  const [formData, setFormData] = useState<FormData>({
    namaTenant: '',
    namaPenanggungJawab: '',
    alamat: '',
    nomorTelepon: '',
    email: '',
    jenisProduk: [],
    jenisProdukLainnya: '',
    namaProdukUtama: '',
    deskripsiProduk: '',
    butuhListrik: false,
    kebutuhanListrik: '',
    perlengkapanDibawa: '',
    kegiatanDiikuti: 'KEDUANYA',
    setujuSyaratKetentuan: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [pernyataanError, setPernyataanError] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean | JenisProduk[] | KegiatanEvent) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear pernyataan error when user checks the checkbox
    if (field === 'setujuSyaratKetentuan' && value === true) {
      setPernyataanError(false);
    }
  };

  const handleJenisProdukChange = (value: JenisProduk, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      jenisProduk: checked
        ? [...prev.jenisProduk, value]
        : prev.jenisProduk.filter((jp) => jp !== value),
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // A. Informasi Tenant
    if (!formData.namaTenant.trim()) errors.push('Nama Tenant / Usaha harus diisi');
    if (!formData.namaPenanggungJawab.trim()) errors.push('Nama Penanggung Jawab harus diisi');
    if (!formData.alamat.trim()) errors.push('Alamat harus diisi');
    if (!formData.nomorTelepon.trim()) errors.push('Nomor Telepon / WhatsApp harus diisi');

    // B. Informasi Produk
    if (formData.jenisProduk.length === 0) errors.push('Pilih minimal satu jenis produk');
    if (formData.jenisProduk.includes('LAINNYA') && !formData.jenisProdukLainnya.trim()) {
      errors.push('Sebutkan jenis produk lainnya');
    }
    if (!formData.namaProdukUtama.trim()) errors.push('Nama Produk Utama harus diisi');

    // C. Kebutuhan Stan
    if (formData.butuhListrik && !formData.kebutuhanListrik.trim()) {
      errors.push('Sebutkan kebutuhan listrik untuk apa');
    }

    // E. Pernyataan - handle separately for inline display
    const hasPernyataanError = !formData.setujuSyaratKetentuan;
    setPernyataanError(hasPernyataanError);

    setFormErrors(errors);
    return errors.length === 0 && !hasPernyataanError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setFormErrors([]);

    try {
      const response = await fetch('/api/event-tenant/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          namaEvent: CURRENT_EVENT_NAME,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      // Track successful registration
      track('EventTenant Registration', {
        event: CURRENT_EVENT_NAME,
        jenisProduk: formData.jenisProduk.join(', '),
        kegiatan: formData.kegiatanDiikuti,
        registrationNumber: data.data.nomorRegistrasi,
      });

      // Success
      setRegistrationResult(data.data);
      setShowSuccessModal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset form
      setFormData({
        namaTenant: '',
        namaPenanggungJawab: '',
        alamat: '',
        nomorTelepon: '',
        email: '',
        jenisProduk: [],
        jenisProdukLainnya: '',
        namaProdukUtama: '',
        deskripsiProduk: '',
        butuhListrik: false,
        kebutuhanListrik: '',
        perlengkapanDibawa: '',
        kegiatanDiikuti: 'KEDUANYA',
        setujuSyaratKetentuan: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat mendaftar';
      setFormErrors([message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendWhatsAppConfirmation = () => {
    if (!registrationResult) return;

    track('EventTenant WhatsApp Click', {
      action: 'registration_confirmation',
      registrationNumber: registrationResult.nomorRegistrasi,
    });

    const message = `Halo, saya telah mendaftar sebagai tenant untuk ${registrationResult.namaEvent}

Nomor Registrasi: ${registrationResult.nomorRegistrasi}
Nama Tenant: ${registrationResult.namaTenant}
Penanggung Jawab: ${registrationResult.namaPenanggungJawab}

Mohon konfirmasi pendaftaran saya.`;

    const whatsappUrl = `https://wa.me/628125906069?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/event/run-madan"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Event Run-Madan</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Formulir Pendaftaran Tenant / Stan</h1>
          </div>
          <p className="text-white/90">{CURRENT_EVENT_NAME} - Masjid Al Muhajirin Rewwin</p>
        </div>
      </header>

      {/* Success Modal */}
      {showSuccessModal && registrationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
              <p className="text-gray-600">Terima kasih telah mendaftar sebagai tenant</p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-emerald-600 mb-1">Nomor Registrasi</p>
                <p className="text-2xl font-bold text-emerald-700">{registrationResult.nomorRegistrasi}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-200 space-y-2 text-sm">
                <p><span className="text-gray-600">Event:</span> <span className="font-medium">{registrationResult.namaEvent}</span></p>
                <p><span className="text-gray-600">Tenant:</span> <span className="font-medium">{registrationResult.namaTenant}</span></p>
                <p><span className="text-gray-600">PJ:</span> <span className="font-medium">{registrationResult.namaPenanggungJawab}</span></p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={sendWhatsAppConfirmation}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Konfirmasi via WhatsApp
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Panitia akan menghubungi Anda untuk konfirmasi lebih lanjut
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Error Messages */}
        {formErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Mohon perbaiki kesalahan berikut:</h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* A. Informasi Tenant */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
              <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                <Store className="w-5 h-5" />
                A. Informasi Tenant
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Tenant / Usaha <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaTenant}
                  onChange={(e) => handleInputChange('namaTenant', e.target.value)}
                  placeholder="Contoh: Warung Makan Bu Siti"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Penanggung Jawab <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.namaPenanggungJawab}
                    onChange={(e) => handleInputChange('namaPenanggungJawab', e.target.value)}
                    placeholder="Nama lengkap penanggung jawab"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.alamat}
                    onChange={(e) => handleInputChange('alamat', e.target.value)}
                    placeholder="Alamat lengkap"
                    rows={2}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.nomorTelepon}
                      onChange={(e) => handleInputChange('nomorTelepon', e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-gray-400">(opsional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* B. Informasi Produk */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
              <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2">
                <Package className="w-5 h-5" />
                B. Informasi Produk
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Produk <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {JENIS_PRODUK_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.jenisProduk.includes(option.value)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.jenisProduk.includes(option.value)}
                        onChange={(e) => handleJenisProdukChange(option.value, e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                      />
                      {option.icon}
                      <span className="font-medium text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>

                {formData.jenisProduk.includes('LAINNYA') && (
                  <div className="mt-3 ml-8">
                    <input
                      type="text"
                      value={formData.jenisProdukLainnya}
                      onChange={(e) => handleInputChange('jenisProdukLainnya', e.target.value)}
                      placeholder="Sebutkan jenis produk lainnya..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk Utama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaProdukUtama}
                  onChange={(e) => handleInputChange('namaProdukUtama', e.target.value)}
                  placeholder="Contoh: Nasi Goreng, Es Teh Manis, dll"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Singkat Produk <span className="text-gray-400">(maks. 2-3 baris)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.deskripsiProduk}
                    onChange={(e) => handleInputChange('deskripsiProduk', e.target.value)}
                    placeholder="Deskripsi singkat tentang produk yang akan dijual..."
                    rows={3}
                    maxLength={300}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{formData.deskripsiProduk.length}/300 karakter</p>
              </div>
            </div>
          </section>

          {/* C. Kebutuhan Stan */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                C. Kebutuhan Stan <span className="text-sm font-normal text-blue-600">(Opsional)</span>
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kebutuhan Listrik</label>
                <div className="flex gap-4">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all flex-1 ${
                      !formData.butuhListrik
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="butuhListrik"
                      checked={!formData.butuhListrik}
                      onChange={() => handleInputChange('butuhListrik', false)}
                      className="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-700">Tidak</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all flex-1 ${
                      formData.butuhListrik
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="butuhListrik"
                      checked={formData.butuhListrik}
                      onChange={() => handleInputChange('butuhListrik', true)}
                      className="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-700">Ya</span>
                  </label>
                </div>

                {formData.butuhListrik && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.kebutuhanListrik}
                      onChange={(e) => handleInputChange('kebutuhanListrik', e.target.value)}
                      placeholder="Untuk apa? (contoh: blender, rice cooker, lampu)"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perlengkapan yang Dibawa Sendiri
                </label>
                <textarea
                  value={formData.perlengkapanDibawa}
                  onChange={(e) => handleInputChange('perlengkapanDibawa', e.target.value)}
                  placeholder="Contoh: meja, tenda kecil, banner, etalase, dll"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* D. Waktu & Kegiatan */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
              <h2 className="text-lg font-bold text-purple-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                D. Waktu & Kegiatan
              </h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kegiatan yang Diikuti <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {KEGIATAN_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.kegiatanDiikuti === option.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="kegiatanDiikuti"
                      value={option.value}
                      checked={formData.kegiatanDiikuti === option.value}
                      onChange={(e) => handleInputChange('kegiatanDiikuti', e.target.value as KegiatanEvent)}
                      className="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* E. Syarat dan Ketentuan */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <h2 className="text-lg font-bold text-red-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                E. Syarat dan Ketentuan
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Dengan mendaftar sebagai tenant, saya menyatakan bersedia untuk:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                {SYARAT_KETENTUAN.map((item, index) => (
                  <li key={index} className="text-sm leading-relaxed">{item}</li>
                ))}
              </ol>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800 font-medium">
                  Panitia berhak menolak atau menghentikan aktivitas tenant apabila terjadi pelanggaran terhadap ketentuan di atas.
                </p>
              </div>
            </div>
          </section>

          {/* F. Pernyataan Kesediaan */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
              <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                F. Pernyataan Kesediaan
              </h2>
            </div>
            <div className="p-6">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.setujuSyaratKetentuan
                    ? 'border-emerald-500 bg-emerald-50'
                    : pernyataanError
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.setujuSyaratKetentuan}
                  onChange={(e) => handleInputChange('setujuSyaratKetentuan', e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <span className="text-gray-700 text-sm leading-relaxed">
                  Saya yang mengisi formulir ini menyatakan bahwa seluruh data yang saya isi adalah benar dan saya{' '}
                  <strong>telah membaca serta menyetujui seluruh syarat dan ketentuan</strong> yang berlaku.
                </span>
              </label>
              {/* Inline warning for Pernyataan Kesediaan */}
              {pernyataanError && (
                <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Anda harus menyetujui syarat dan ketentuan untuk melanjutkan pendaftaran</span>
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Pendaftaran
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <Link
              href="/event/run-madan"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors text-center"
            >
              Lihat Info Event Run-Madan 2026
            </Link>
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Butuh bantuan? Hubungi panitia via WhatsApp:</p>
          <a
            href="https://wa.me/628125906069"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            +62 812-5906-069
          </a>
        </div>
      </main>
    </div>
  );
}
