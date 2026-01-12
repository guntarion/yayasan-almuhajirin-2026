'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Activity,
  Trophy,
  Award,
  MapPin,
  TrendingUp,
  User,
  LogIn,
  LogOut,
  Shield,
  Trash2,
  RefreshCw,
  MessageCircle,
  Copy,
  Check,
  Store,
  Package,
  Zap,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import Toast from '@/components/notifications/Toast';

interface Participant {
  id: string;
  namaLengkap: string;
  jenisKelamin: string;
  usia: number | null;
  ukuranKaos: string;
  preferensiAktivitas: string;
  nomorBib: string | null;
}

interface Registrant {
  id: string;
  nomorRegistrasi: string;
  nama: string;
  nomorHP: string;
  email: string | null;
  alamat: string;
  statusPembayaran: string;
  tanggalBayar: Date | null;
  createdAt: Date;
  participants: Participant[];
}

interface Statistics {
  totalRegistrants: number;
  totalParticipants: number;
  totalRevenue: number;
  paymentStats: {
    belum_bayar: number;
    menunggu_konfirmasi: number;
    lunas: number;
    ditolak: number;
  };
  genderStats: {
    lelaki: number;
    perempuan: number;
  };
  activityStats: {
    FULL_LARI: number;
    LARI_JALAN: number;
    JALAN: number;
  };
  shirtSizeStats: {
    S: number;
    M: number;
    L: number;
    XL: number;
    XXL: number;
  };
}

// Tenant types
interface Tenant {
  id: string;
  nomorRegistrasi: string;
  namaEvent: string;
  namaTenant: string;
  namaPenanggungJawab: string;
  alamat: string;
  nomorTelepon: string;
  email: string | null;
  jenisProduk: string[];
  jenisProdukLainnya: string | null;
  namaProdukUtama: string;
  deskripsiProduk: string | null;
  butuhListrik: boolean;
  kebutuhanListrik: string | null;
  perlengkapanDibawa: string | null;
  kegiatanDiikuti: string;
  statusPembayaran: string;
  tanggalBayar: Date | null;
  status: string;
  lokasiStan: string | null;
  createdAt: Date;
}

interface TenantStatistics {
  totalTenants: number;
  paymentStats: {
    belum_bayar: number;
    menunggu_konfirmasi: number;
    lunas: number;
    ditolak: number;
  };
  productTypeStats: {
    MAKANAN: number;
    MINUMAN: number;
    PRODUK_UMKM: number;
    PRODUK_KESEHATAN: number;
    LAINNYA: number;
  };
  activityStats: {
    SENAM_PAGI: number;
    FUN_RUN: number;
    KEDUANYA: number;
  };
  electricityStats: {
    butuhListrik: number;
    tidakButuhListrik: number;
  };
}

export default function RegistrasiRunMadanPage() {
  // Auth
  const { user, isAuthenticated, isLoading: authLoading, loginWithGoogle, logout, hasRole } = useAuth();
  const isAdmin = hasRole(['admin', 'sekretariat', 'moderator']);

  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState<'registrants' | 'tenants'>('registrants');

  // Tenant state
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantStatistics, setTenantStatistics] = useState<TenantStatistics | null>(null);
  const [tenantLoading, setTenantLoading] = useState(false);
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');

  // Modal states
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    registrantId: string | null;
    registrantName: string | null;
    type: 'registrant' | 'tenant';
  }>({
    isOpen: false,
    registrantId: null,
    registrantName: null,
    type: 'registrant',
  });

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    registrantId: string | null;
    registrantName: string | null;
    newStatus: string | null;
    statusLabel: string | null;
    type: 'registrant' | 'tenant';
  }>({
    isOpen: false,
    registrantId: null,
    registrantName: null,
    newStatus: null,
    statusLabel: null,
    type: 'registrant',
  });

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrants();
    fetchTenants();
  }, []);

  const fetchRegistrants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/run-madan/registrants');
      const data = await response.json();

      if (data.success) {
        setRegistrants(data.registrants);
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching registrants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    setTenantLoading(true);
    try {
      const response = await fetch('/api/event-tenant/tenants');
      const data = await response.json();

      if (data.success) {
        setTenants(data.tenants);
        setTenantStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setTenantLoading(false);
    }
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ isOpen: true, message, type });
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string, name: string, type: 'registrant' | 'tenant' = 'registrant') => {
    setDeleteModal({
      isOpen: true,
      registrantId: id,
      registrantName: name,
      type,
    });
  };

  // Open status update confirmation modal
  const openStatusModal = (id: string, name: string, newStatus: string, statusLabel: string, type: 'registrant' | 'tenant' = 'registrant') => {
    setStatusModal({
      isOpen: true,
      registrantId: id,
      registrantName: name,
      newStatus,
      statusLabel,
      type,
    });
  };

  // Admin: Delete registration (registrant or tenant)
  const confirmDeleteRegistration = async () => {
    if (!isAdmin || !deleteModal.registrantId) return;

    setIsActionLoading(true);
    try {
      const apiUrl = deleteModal.type === 'tenant'
        ? `/api/event-tenant/tenants/${deleteModal.registrantId}`
        : `/api/run-madan/registrants/${deleteModal.registrantId}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });

      if (response.ok) {
        const label = deleteModal.type === 'tenant' ? 'Data tenant' : 'Data pendaftaran';
        showToast(`${label} berhasil dihapus`, 'success');
        if (deleteModal.type === 'tenant') {
          fetchTenants();
        } else {
          fetchRegistrants();
        }
        setDeleteModal({ isOpen: false, registrantId: null, registrantName: null, type: 'registrant' });
      } else {
        showToast('Gagal menghapus data', 'error');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Terjadi kesalahan saat menghapus data', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Admin: Update payment status (registrant or tenant)
  const confirmUpdatePaymentStatus = async () => {
    if (!isAdmin || !statusModal.registrantId || !statusModal.newStatus) return;

    setIsActionLoading(true);
    try {
      const apiUrl = statusModal.type === 'tenant'
        ? `/api/event-tenant/tenants/${statusModal.registrantId}`
        : `/api/run-madan/registrants/${statusModal.registrantId}`;

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statusPembayaran: statusModal.newStatus }),
      });

      if (response.ok) {
        showToast(`Status pembayaran berhasil diubah menjadi "${statusModal.statusLabel}"`, 'success');
        if (statusModal.type === 'tenant') {
          fetchTenants();
        } else {
          fetchRegistrants();
        }
        setStatusModal({
          isOpen: false,
          registrantId: null,
          registrantName: null,
          newStatus: null,
          statusLabel: null,
          type: 'registrant',
        });
      } else {
        showToast('Gagal mengupdate status pembayaran', 'error');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      showToast('Terjadi kesalahan saat mengupdate status', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Generate WhatsApp confirmation message
  const generateWhatsAppMessage = (registrant: Registrant): string => {
    // Format participant names with BIB numbers
    const participantsList = registrant.participants
      .map((p) => {
        if (p.nomorBib) {
          return `${p.namaLengkap} (BIB: ${p.nomorBib})`;
        }
        return p.namaLengkap;
      })
      .join(', ');

    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh

Terima kasih atas pendaftaran dan pembayarannya untuk partisipasi RUN-MADAN 2026 a.n ${participantsList} dengan nomor registrasi ${registrant.nomorRegistrasi}.

Semoga Allah berikan kesehatan dan kebarokahan senantiasa. Aamiin.

Jazakumullahu khairan.

_Tim RUN-MADAN 2026_
_Masjid Al Muhajirin Rewwin_`;

    return message;
  };

  // Copy WhatsApp message to clipboard
  const handleCopyMessage = async (registrant: Registrant) => {
    const message = generateWhatsAppMessage(registrant);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessageId(registrant.id);
      showToast('Pesan berhasil disalin ke clipboard', 'success');

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast('Gagal menyalin pesan', 'error');
    }
  };

  // Open WhatsApp with pre-filled message
  const handleSendWhatsApp = (registrant: Registrant) => {
    const message = generateWhatsAppMessage(registrant);
    const phoneNumber = registrant.nomorHP.replace(/^0/, '62').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Filter registrants by search term
  const filteredRegistrants = registrants.filter(
    (r) =>
      r.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nomorRegistrasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.participants.some((p) => p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter tenants by search term
  const filteredTenants = tenants.filter(
    (t) =>
      t.namaTenant.toLowerCase().includes(tenantSearchTerm.toLowerCase()) ||
      t.nomorRegistrasi.toLowerCase().includes(tenantSearchTerm.toLowerCase()) ||
      t.namaPenanggungJawab.toLowerCase().includes(tenantSearchTerm.toLowerCase()) ||
      t.namaProdukUtama.toLowerCase().includes(tenantSearchTerm.toLowerCase())
  );

  // Generate WhatsApp confirmation message for tenant
  const generateTenantWhatsAppMessage = (tenant: Tenant): string => {
    const productTypes = tenant.jenisProduk.map((p) => {
      const labels: Record<string, string> = {
        MAKANAN: 'Makanan',
        MINUMAN: 'Minuman',
        PRODUK_UMKM: 'Produk UMKM',
        PRODUK_KESEHATAN: 'Produk Kesehatan',
        LAINNYA: tenant.jenisProdukLainnya || 'Lainnya',
      };
      return labels[p] || p;
    }).join(', ');

    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh

Terima kasih atas pendaftaran tenant untuk ${tenant.namaEvent}.

Detail Pendaftaran:
- No. Registrasi: ${tenant.nomorRegistrasi}
- Nama Tenant: ${tenant.namaTenant}
- Penanggung Jawab: ${tenant.namaPenanggungJawab}
- Jenis Produk: ${productTypes}
- Produk Utama: ${tenant.namaProdukUtama}

Pendaftaran Anda telah kami terima dan dikonfirmasi.

Jazakumullahu khairan.

_Tim ${tenant.namaEvent}_
_Masjid Al Muhajirin Rewwin_`;

    return message;
  };

  // Copy WhatsApp message to clipboard for tenant
  const handleCopyTenantMessage = async (tenant: Tenant) => {
    const message = generateTenantWhatsAppMessage(tenant);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessageId(tenant.id);
      showToast('Pesan berhasil disalin ke clipboard', 'success');

      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast('Gagal menyalin pesan', 'error');
    }
  };

  // Open WhatsApp with pre-filled message for tenant
  const handleSendTenantWhatsApp = (tenant: Tenant) => {
    const message = generateTenantWhatsAppMessage(tenant);
    const phoneNumber = tenant.nomorTelepon.replace(/^0/, '62').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Get product type label
  const getProductTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MAKANAN: 'Makanan',
      MINUMAN: 'Minuman',
      PRODUK_UMKM: 'Produk UMKM',
      PRODUK_KESEHATAN: 'Produk Kesehatan',
      LAINNYA: 'Lainnya',
    };
    return labels[type] || type;
  };

  // Get activity label for tenant
  const getTenantActivityLabel = (activity: string) => {
    const labels: Record<string, string> = {
      SENAM_PAGI: 'Senam Pagi',
      FUN_RUN: '3K Fun Run',
      KEDUANYA: 'Keduanya',
    };
    return labels[activity] || activity;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      belum_bayar: 'bg-red-100 text-red-800 border-red-300',
      menunggu_konfirmasi: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      lunas: 'bg-green-100 text-green-800 border-green-300',
      ditolak: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    const labels = {
      belum_bayar: 'Belum Bayar',
      menunggu_konfirmasi: 'Menunggu Konfirmasi',
      lunas: 'Lunas',
      ditolak: 'Ditolak',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getActivityLabel = (activity: string) => {
    const labels = {
      FULL_LARI: 'Full Lari',
      LARI_JALAN: 'Lari + Jalan',
      JALAN: 'Jalan Saja',
    };
    return labels[activity as keyof typeof labels] || activity;
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center'>
        <div className='text-center'>
          <Activity className='h-12 w-12 text-[#00BCD4] animate-spin mx-auto mb-4' />
          <p className='text-lg font-semibold text-gray-700'>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Authentication Bar */}
      <div className='bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Image src='/images/Logo-YAMR.png' alt='Logo Al Muhajirin' width={40} height={40} className='rounded-full' />
              <span className='text-sm font-semibold text-[#00BCD4]'>Run-Madan 2026 - Data Pendaftaran</span>
            </div>
            <div className='flex items-center gap-3'>
              {!authLoading && (
                <>
                  {isAuthenticated && user ? (
                    <>
                      <div className='flex items-center gap-2 bg-[#B2EBF2]/20 px-3 py-1.5 rounded-lg'>
                        <User className='h-4 w-4 text-[#00BCD4]' />
                        <span className='text-sm font-medium text-[#006064]'>{user.name}</span>
                        {isAdmin && (
                          <span className='text-xs bg-[#00BCD4] text-white px-2 py-0.5 rounded-full flex items-center gap-1'>
                            <Shield className='h-3 w-3' />
                            Admin
                          </span>
                        )}
                      </div>
                      <button
                        onClick={logout}
                        className='px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-all duration-200 flex items-center gap-2'
                      >
                        <LogOut className='h-4 w-4' />
                        Keluar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => loginWithGoogle(window.location.pathname)}
                      className='px-4 py-2 rounded-lg bg-[#00BCD4] hover:bg-[#00838F] text-white font-semibold text-sm transition-all duration-200 flex items-center gap-2'
                    >
                      <LogIn className='h-4 w-4' />
                      Login
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-[#00BCD4] via-[#00838F] to-[#006064] text-white py-16'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-[#80DEEA]/20 rounded-full blur-3xl' />
          <div className='absolute top-1/2 -left-40 w-96 h-96 bg-[#B2EBF2]/20 rounded-full blur-3xl' />
        </div>

        <div className='relative container mx-auto px-4'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6'>
              <Trophy className='h-4 w-4' />
              Run-Madan 2026
            </div>
            <h1 className='text-4xl md:text-6xl font-black mb-4 text-[#B2EBF2]'>Data Pendaftaran</h1>
            <p className='text-xl text-white/90 mb-2'>Tarhib Ramadhan 1447H - Minggu, 8 Februari 2026</p>
            <div className='flex items-center justify-center gap-2 text-white/80'>
              <MapPin className='h-5 w-5' />
              <span>Masjid Al Muhajirin Rewwin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className='bg-white border-b border-gray-200 sticky top-16 z-40'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex gap-1 pt-4'>
              <button
                onClick={() => setActiveTab('registrants')}
                className={`px-6 py-3 font-semibold text-sm rounded-t-lg transition-all flex items-center gap-2 ${
                  activeTab === 'registrants'
                    ? 'bg-[#00BCD4] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Activity className='h-4 w-4' />
                Peserta Run-Madan ({statistics?.totalRegistrants || 0})
              </button>
              <button
                onClick={() => setActiveTab('tenants')}
                className={`px-6 py-3 font-semibold text-sm rounded-t-lg transition-all flex items-center gap-2 ${
                  activeTab === 'tenants'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Store className='h-4 w-4' />
                Tenant / Stan ({tenantStatistics?.totalTenants || 0})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Run-Madan Registrants Tab */}
      {activeTab === 'registrants' && (
        <>
          {/* Statistics Section */}
          {statistics && (
        <section className='py-12 bg-white border-b border-gray-200'>
          <div className='container mx-auto px-4'>
            <div className='max-w-6xl mx-auto'>
              <h2 className='text-2xl font-black text-gray-900 mb-6 text-center'>Statistik Pendaftaran</h2>

              {/* Main Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                <div className='bg-gradient-to-br from-[#00BCD4] to-[#006064] text-white rounded-xl p-6 text-center shadow-lg'>
                  <Users className='h-8 w-8 mx-auto mb-3' />
                  <div className='text-3xl font-black mb-1'>{statistics.totalRegistrants}</div>
                  <div className='text-sm text-white/80'>Pendaftar</div>
                </div>

                <div className='bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-white rounded-xl p-6 text-center shadow-lg'>
                  <Activity className='h-8 w-8 mx-auto mb-3' />
                  <div className='text-3xl font-black mb-1'>{statistics.totalParticipants}</div>
                  <div className='text-sm text-white/80'>Peserta Lari</div>
                </div>

                <div className='bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] text-white rounded-xl p-6 text-center shadow-lg'>
                  <Trophy className='h-8 w-8 mx-auto mb-3' />
                  <div className='text-3xl font-black mb-1'>{statistics.paymentStats.lunas}</div>
                  <div className='text-sm text-white/80'>Sudah Lunas</div>
                </div>

                <div className='bg-gradient-to-br from-[#FFB300] to-[#FFA000] text-white rounded-xl p-6 text-center shadow-lg'>
                  <TrendingUp className='h-8 w-8 mx-auto mb-3' />
                  <div className='text-2xl font-black mb-1'>
                    Rp {(statistics.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className='text-sm text-white/80'>Total Pendapatan</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className='grid md:grid-cols-3 gap-6'>
                {/* Gender Stats */}
                <div className='bg-white rounded-xl p-6 border-2 border-gray-200 shadow'>
                  <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                    <Users className='h-5 w-5 text-[#00BCD4]' />
                    Jenis Kelamin
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-gray-700'>Laki-laki</span>
                      <span className='font-bold text-[#006064]'>{statistics.genderStats.lelaki}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-700'>Perempuan</span>
                      <span className='font-bold text-[#006064]'>{statistics.genderStats.perempuan}</span>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className='bg-white rounded-xl p-6 border-2 border-gray-200 shadow'>
                  <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                    <Activity className='h-5 w-5 text-[#00BCD4]' />
                    Preferensi Aktivitas
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-gray-700'>Full Lari</span>
                      <span className='font-bold text-[#006064]'>{statistics.activityStats.FULL_LARI}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-700'>Lari + Jalan</span>
                      <span className='font-bold text-[#006064]'>{statistics.activityStats.LARI_JALAN}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-700'>Jalan Saja</span>
                      <span className='font-bold text-[#006064]'>{statistics.activityStats.JALAN}</span>
                    </div>
                  </div>
                </div>

                {/* Shirt Size Stats */}
                <div className='bg-white rounded-xl p-6 border-2 border-gray-200 shadow'>
                  <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                    <Award className='h-5 w-5 text-[#00BCD4]' />
                    Ukuran Kaos
                  </h3>
                  <div className='space-y-2 text-sm'>
                    {Object.entries(statistics.shirtSizeStats).map(([size, count]) => (
                      <div key={size} className='flex justify-between'>
                        <span className='text-gray-700'>{size}</span>
                        <span className='font-bold text-[#006064]'>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Registrants List */}
      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            {/* Search */}
            <div className='mb-8'>
              <input
                type='text'
                placeholder='Cari nama pendaftar, nomor registrasi, atau nama peserta...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-[#00BCD4] focus:outline-none text-lg'
              />
            </div>

            {/* List Header */}
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-black text-gray-900'>
                Daftar Pendaftar ({filteredRegistrants.length})
              </h2>
              <button
                onClick={fetchRegistrants}
                disabled={loading}
                className='px-4 py-2 rounded-lg bg-[#00BCD4] hover:bg-[#00838F] text-white font-semibold text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50'
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Registrants */}
            <div className='space-y-4'>
              {filteredRegistrants.length === 0 ? (
                <div className='text-center py-12 bg-white rounded-xl border-2 border-gray-200'>
                  <Users className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-lg font-semibold text-gray-600'>
                    {searchTerm ? 'Tidak ada hasil yang ditemukan' : 'Belum ada pendaftar'}
                  </p>
                </div>
              ) : (
                filteredRegistrants.map((registrant) => (
                  <div
                    key={registrant.id}
                    className='bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow'
                  >
                    <div className='flex flex-wrap items-start justify-between gap-4 mb-4'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2 flex-wrap'>
                          <h3 className='text-xl font-black text-gray-900'>{registrant.nama}</h3>
                          {getStatusBadge(registrant.statusPembayaran)}
                        </div>
                        <div className='text-sm text-gray-600 space-y-1'>
                          <div>
                            <span className='font-semibold'>No. Registrasi:</span> {registrant.nomorRegistrasi}
                          </div>
                          <div>
                            <span className='font-semibold'>HP:</span> {registrant.nomorHP}
                          </div>
                          {registrant.email && (
                            <div>
                              <span className='font-semibold'>Email:</span> {registrant.email}
                            </div>
                          )}
                          <div>
                            <span className='font-semibold'>Alamat:</span> {registrant.alamat}
                          </div>
                        </div>
                      </div>

                      <div className='text-right'>
                        <div className='text-sm text-gray-600 mb-1'>Total Biaya</div>
                        <div className='text-2xl font-black text-[#006064]'>
                          Rp {(registrant.participants.length * 100000).toLocaleString('id-ID')}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {registrant.participants.length} Peserta × Rp 100.000
                        </div>
                      </div>
                    </div>

                    {/* Admin Controls */}
                    {isAdmin && (
                      <div className='border-t border-gray-200 pt-4 mb-4'>
                        <div className='flex flex-col gap-3'>
                          <div>
                            <label className='text-sm font-semibold text-gray-700 mb-2 block'>Status Pembayaran:</label>
                            <div className='flex flex-wrap gap-2'>
                              <button
                                onClick={() =>
                                  openStatusModal(registrant.id, registrant.nama, 'belum_bayar', 'Belum Bayar')
                                }
                                disabled={registrant.statusPembayaran === 'belum_bayar'}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                  registrant.statusPembayaran === 'belum_bayar'
                                    ? 'bg-red-100 text-red-700 border-2 border-red-300 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                                }`}
                              >
                                Belum Bayar
                              </button>
                              <button
                                onClick={() =>
                                  openStatusModal(
                                    registrant.id,
                                    registrant.nama,
                                    'menunggu_konfirmasi',
                                    'Sudah Transfer'
                                  )
                                }
                                disabled={registrant.statusPembayaran === 'menunggu_konfirmasi'}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                  registrant.statusPembayaran === 'menunggu_konfirmasi'
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                                }`}
                              >
                                Sudah Transfer
                              </button>
                              <button
                                onClick={() =>
                                  openStatusModal(registrant.id, registrant.nama, 'lunas', 'Valid')
                                }
                                disabled={registrant.statusPembayaran === 'lunas'}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                  registrant.statusPembayaran === 'lunas'
                                    ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                                }`}
                              >
                                Valid
                              </button>
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => openDeleteModal(registrant.id, registrant.nama)}
                              className='px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-sm transition-all flex items-center gap-2'
                            >
                              <Trash2 className='h-4 w-4' />
                              Hapus Pendaftaran
                            </button>
                          </div>

                          {/* WhatsApp Notification - Only show for paid/confirmed registrations */}
                          {(registrant.statusPembayaran === 'menunggu_konfirmasi' ||
                            registrant.statusPembayaran === 'lunas') && (
                            <div className='border-t border-gray-200 pt-4 mt-4'>
                              <label className='text-sm font-semibold text-gray-700 mb-2 block'>
                                Notifikasi WhatsApp:
                              </label>
                              <div className='bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4'>
                                <div className='flex items-start gap-2 mb-3'>
                                  <MessageCircle className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
                                  <div className='flex-1 text-sm text-gray-700'>
                                    <p className='font-semibold mb-1'>Pesan Konfirmasi:</p>
                                    <p className='text-xs whitespace-pre-line bg-white p-3 rounded border border-green-200'>
                                      {generateWhatsAppMessage(registrant)}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex gap-2'>
                                  <button
                                    onClick={() => handleCopyMessage(registrant)}
                                    className='flex-1 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 border-2 border-gray-300'
                                  >
                                    {copiedMessageId === registrant.id ? (
                                      <>
                                        <Check className='h-4 w-4 text-green-600' />
                                        Tersalin!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className='h-4 w-4' />
                                        Salin Pesan
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleSendWhatsApp(registrant)}
                                    className='flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2'
                                  >
                                    <MessageCircle className='h-4 w-4' />
                                    Kirim WhatsApp
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Participants */}
                    <div className='border-t border-gray-200 pt-4'>
                      <h4 className='font-bold text-gray-900 mb-3 flex items-center gap-2'>
                        <User className='h-4 w-4 text-[#00BCD4]' />
                        Peserta ({registrant.participants.length})
                      </h4>
                      <div className='grid md:grid-cols-2 gap-3'>
                        {registrant.participants.map((participant) => (
                          <div key={participant.id} className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                            <div className='flex justify-between items-start mb-2'>
                              <div className='font-bold text-gray-900'>{participant.namaLengkap}</div>
                              {participant.nomorBib && (
                                <span className='bg-[#00BCD4] text-white px-2 py-1 rounded text-xs font-bold'>
                                  BIB #{participant.nomorBib}
                                </span>
                              )}
                            </div>
                            <div className='text-sm text-gray-600 space-y-1'>
                              <div>
                                {participant.jenisKelamin === 'lelaki' ? 'Laki-laki' : 'Perempuan'} •{' '}
                                {participant.usia || 'N/A'} tahun
                              </div>
                              <div>Kaos: {participant.ukuranKaos}</div>
                              <div>{getActivityLabel(participant.preferensiAktivitas)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Tenant Tab */}
      {activeTab === 'tenants' && (
        <>
          {/* Tenant Statistics */}
          {tenantStatistics && (
            <section className='py-12 bg-white border-b border-gray-200'>
              <div className='container mx-auto px-4'>
                <div className='max-w-6xl mx-auto'>
                  <h2 className='text-2xl font-black text-gray-900 mb-6 text-center'>Statistik Tenant</h2>

                  {/* Main Stats */}
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                    <div className='bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl p-6 text-center shadow-lg'>
                      <Store className='h-8 w-8 mx-auto mb-3' />
                      <div className='text-3xl font-black mb-1'>{tenantStatistics.totalTenants}</div>
                      <div className='text-sm text-white/80'>Total Tenant</div>
                    </div>

                    <div className='bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-white rounded-xl p-6 text-center shadow-lg'>
                      <Trophy className='h-8 w-8 mx-auto mb-3' />
                      <div className='text-3xl font-black mb-1'>{tenantStatistics.paymentStats.lunas}</div>
                      <div className='text-sm text-white/80'>Sudah Lunas</div>
                    </div>

                    <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6 text-center shadow-lg'>
                      <Package className='h-8 w-8 mx-auto mb-3' />
                      <div className='text-3xl font-black mb-1'>{tenantStatistics.productTypeStats.MAKANAN + tenantStatistics.productTypeStats.MINUMAN}</div>
                      <div className='text-sm text-white/80'>F&B</div>
                    </div>

                    <div className='bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl p-6 text-center shadow-lg'>
                      <Zap className='h-8 w-8 mx-auto mb-3' />
                      <div className='text-3xl font-black mb-1'>{tenantStatistics.electricityStats.butuhListrik}</div>
                      <div className='text-sm text-white/80'>Butuh Listrik</div>
                    </div>
                  </div>

                  {/* Detailed Stats */}
                  <div className='grid md:grid-cols-3 gap-6'>
                    {/* Product Type Stats */}
                    <div className='bg-white rounded-xl p-6 border-2 border-gray-200 shadow'>
                      <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                        <Package className='h-5 w-5 text-emerald-600' />
                        Jenis Produk
                      </h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>Makanan</span>
                          <span className='font-bold text-emerald-700'>{tenantStatistics.productTypeStats.MAKANAN}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>Minuman</span>
                          <span className='font-bold text-emerald-700'>{tenantStatistics.productTypeStats.MINUMAN}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>UMKM</span>
                          <span className='font-bold text-emerald-700'>{tenantStatistics.productTypeStats.PRODUK_UMKM}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>Kesehatan</span>
                          <span className='font-bold text-emerald-700'>{tenantStatistics.productTypeStats.PRODUK_KESEHATAN}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>Lainnya</span>
                          <span className='font-bold text-emerald-700'>{tenantStatistics.productTypeStats.LAINNYA}</span>
                        </div>
                      </div>
                    </div>

                    {/* Activity Stats */}
                    <div className='bg-white rounded-xl p-6 border-2 border-gray-200 shadow'>
                      <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                        <Activity className='h-5 w-5 text-emerald-600' />
                        Kegiatan Diikuti
                      </h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>Senam Pagi</span>
                          <span className='font-bold text-emerald-700'>{tenantStatistics.activityStats.SENAM_PAGI}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>3K Fun Run</span>
                          <span className='font-bold text-emerald-700'>{tenantStatistics.activityStats.FUN_RUN}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>Keduanya</span>
                          <span className='font-bold text-emerald-700'>{tenantStatistics.activityStats.KEDUANYA}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Stats */}
                    <div className='bg-white rounded-xl p-6 border-2 border-gray-200 shadow'>
                      <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                        <Award className='h-5 w-5 text-emerald-600' />
                        Status Pembayaran
                      </h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>Belum Bayar</span>
                          <span className='font-bold text-red-600'>{tenantStatistics.paymentStats.belum_bayar}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>Menunggu Konfirmasi</span>
                          <span className='font-bold text-yellow-600'>{tenantStatistics.paymentStats.menunggu_konfirmasi}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-700'>Lunas</span>
                          <span className='font-bold text-green-600'>{tenantStatistics.paymentStats.lunas}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tenant List */}
          <section className='py-12'>
            <div className='container mx-auto px-4'>
              <div className='max-w-6xl mx-auto'>
                {/* Search */}
                <div className='mb-8'>
                  <input
                    type='text'
                    placeholder='Cari nama tenant, nomor registrasi, atau nama produk...'
                    value={tenantSearchTerm}
                    onChange={(e) => setTenantSearchTerm(e.target.value)}
                    className='w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-emerald-500 focus:outline-none text-lg'
                  />
                </div>

                {/* List Header */}
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-black text-gray-900'>
                    Daftar Tenant ({filteredTenants.length})
                  </h2>
                  <button
                    onClick={fetchTenants}
                    disabled={tenantLoading}
                    className='px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50'
                  >
                    <RefreshCw className={`h-4 w-4 ${tenantLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* Tenants */}
                <div className='space-y-4'>
                  {filteredTenants.length === 0 ? (
                    <div className='text-center py-12 bg-white rounded-xl border-2 border-gray-200'>
                      <Store className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                      <p className='text-lg font-semibold text-gray-600'>
                        {tenantSearchTerm ? 'Tidak ada hasil yang ditemukan' : 'Belum ada tenant terdaftar'}
                      </p>
                    </div>
                  ) : (
                    filteredTenants.map((tenant) => (
                      <div
                        key={tenant.id}
                        className='bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow'
                      >
                        <div className='flex flex-wrap items-start justify-between gap-4 mb-4'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2 flex-wrap'>
                              <h3 className='text-xl font-black text-gray-900'>{tenant.namaTenant}</h3>
                              {getStatusBadge(tenant.statusPembayaran)}
                            </div>
                            <div className='text-sm text-gray-600 space-y-1'>
                              <div>
                                <span className='font-semibold'>No. Registrasi:</span> {tenant.nomorRegistrasi}
                              </div>
                              <div>
                                <span className='font-semibold'>PJ:</span> {tenant.namaPenanggungJawab}
                              </div>
                              <div className='flex items-center gap-1'>
                                <Phone className='h-3 w-3' />
                                <span>{tenant.nomorTelepon}</span>
                              </div>
                              {tenant.email && (
                                <div>
                                  <span className='font-semibold'>Email:</span> {tenant.email}
                                </div>
                              )}
                              <div>
                                <span className='font-semibold'>Alamat:</span> {tenant.alamat}
                              </div>
                            </div>
                          </div>

                          <div className='text-right'>
                            <div className='text-sm text-gray-600 mb-1'>Produk Utama</div>
                            <div className='text-lg font-black text-emerald-700'>{tenant.namaProdukUtama}</div>
                            <div className='text-xs text-gray-500 mt-1'>
                              {tenant.jenisProduk.map(getProductTypeLabel).join(', ')}
                            </div>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className='bg-emerald-50 rounded-lg p-4 mb-4'>
                          <div className='grid md:grid-cols-3 gap-4 text-sm'>
                            <div>
                              <span className='font-semibold text-gray-700'>Kegiatan:</span>{' '}
                              <span className='text-emerald-700'>{getTenantActivityLabel(tenant.kegiatanDiikuti)}</span>
                            </div>
                            <div>
                              <span className='font-semibold text-gray-700'>Listrik:</span>{' '}
                              <span className={tenant.butuhListrik ? 'text-orange-600' : 'text-gray-500'}>
                                {tenant.butuhListrik ? `Ya (${tenant.kebutuhanListrik})` : 'Tidak'}
                              </span>
                            </div>
                            {tenant.lokasiStan && (
                              <div>
                                <span className='font-semibold text-gray-700'>Lokasi Stan:</span>{' '}
                                <span className='text-emerald-700'>{tenant.lokasiStan}</span>
                              </div>
                            )}
                          </div>
                          {tenant.deskripsiProduk && (
                            <div className='mt-2 pt-2 border-t border-emerald-200'>
                              <span className='text-xs text-gray-500'>Deskripsi:</span>
                              <p className='text-sm text-gray-700'>{tenant.deskripsiProduk}</p>
                            </div>
                          )}
                        </div>

                        {/* Admin Controls */}
                        {isAdmin && (
                          <div className='border-t border-gray-200 pt-4'>
                            <div className='flex flex-col gap-3'>
                              <div>
                                <label className='text-sm font-semibold text-gray-700 mb-2 block'>Status Pembayaran:</label>
                                <div className='flex flex-wrap gap-2'>
                                  <button
                                    onClick={() =>
                                      openStatusModal(tenant.id, tenant.namaTenant, 'belum_bayar', 'Belum Bayar', 'tenant')
                                    }
                                    disabled={tenant.statusPembayaran === 'belum_bayar'}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                      tenant.statusPembayaran === 'belum_bayar'
                                        ? 'bg-red-100 text-red-700 border-2 border-red-300 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                                    }`}
                                  >
                                    Belum Bayar
                                  </button>
                                  <button
                                    onClick={() =>
                                      openStatusModal(
                                        tenant.id,
                                        tenant.namaTenant,
                                        'menunggu_konfirmasi',
                                        'Sudah Transfer',
                                        'tenant'
                                      )
                                    }
                                    disabled={tenant.statusPembayaran === 'menunggu_konfirmasi'}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                      tenant.statusPembayaran === 'menunggu_konfirmasi'
                                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                                    }`}
                                  >
                                    Sudah Transfer
                                  </button>
                                  <button
                                    onClick={() =>
                                      openStatusModal(tenant.id, tenant.namaTenant, 'lunas', 'Valid', 'tenant')
                                    }
                                    disabled={tenant.statusPembayaran === 'lunas'}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                      tenant.statusPembayaran === 'lunas'
                                        ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                                    }`}
                                  >
                                    Valid
                                  </button>
                                </div>
                              </div>
                              <div>
                                <button
                                  onClick={() => openDeleteModal(tenant.id, tenant.namaTenant, 'tenant')}
                                  className='px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-sm transition-all flex items-center gap-2'
                                >
                                  <Trash2 className='h-4 w-4' />
                                  Hapus Tenant
                                </button>
                              </div>

                              {/* WhatsApp Notification - Only show for paid/confirmed tenants */}
                              {(tenant.statusPembayaran === 'menunggu_konfirmasi' ||
                                tenant.statusPembayaran === 'lunas') && (
                                <div className='border-t border-gray-200 pt-4 mt-4'>
                                  <label className='text-sm font-semibold text-gray-700 mb-2 block'>
                                    Notifikasi WhatsApp:
                                  </label>
                                  <div className='bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4'>
                                    <div className='flex items-start gap-2 mb-3'>
                                      <MessageCircle className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
                                      <div className='flex-1 text-sm text-gray-700'>
                                        <p className='font-semibold mb-1'>Pesan Konfirmasi:</p>
                                        <p className='text-xs whitespace-pre-line bg-white p-3 rounded border border-green-200'>
                                          {generateTenantWhatsAppMessage(tenant)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className='flex gap-2'>
                                      <button
                                        onClick={() => handleCopyTenantMessage(tenant)}
                                        className='flex-1 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 border-2 border-gray-300'
                                      >
                                        {copiedMessageId === tenant.id ? (
                                          <>
                                            <Check className='h-4 w-4 text-green-600' />
                                            Tersalin!
                                          </>
                                        ) : (
                                          <>
                                            <Copy className='h-4 w-4' />
                                            Salin Pesan
                                          </>
                                        )}
                                      </button>
                                      <button
                                        onClick={() => handleSendTenantWhatsApp(tenant)}
                                        className='flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2'
                                      >
                                        <MessageCircle className='h-4 w-4' />
                                        Kirim WhatsApp
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Modals */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, registrantId: null, registrantName: null, type: 'registrant' })}
        onConfirm={confirmDeleteRegistration}
        title={deleteModal.type === 'tenant' ? 'Hapus Tenant' : 'Hapus Pendaftaran'}
        message={`Apakah Anda yakin ingin menghapus data ${deleteModal.type === 'tenant' ? 'tenant' : 'pendaftaran'} atas nama "${deleteModal.registrantName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText='Hapus'
        cancelText='Batal'
        type='danger'
        isLoading={isActionLoading}
      />

      <ConfirmationModal
        isOpen={statusModal.isOpen}
        onClose={() =>
          setStatusModal({
            isOpen: false,
            registrantId: null,
            registrantName: null,
            newStatus: null,
            statusLabel: null,
            type: 'registrant',
          })
        }
        onConfirm={confirmUpdatePaymentStatus}
        title='Ubah Status Pembayaran'
        message={`Apakah Anda yakin ingin mengubah status pembayaran ${statusModal.type === 'tenant' ? 'tenant' : 'pendaftaran'} atas nama "${statusModal.registrantName}" menjadi "${statusModal.statusLabel}"?`}
        confirmText='Ubah Status'
        cancelText='Batal'
        type={
          statusModal.newStatus === 'lunas'
            ? 'success'
            : statusModal.newStatus === 'belum_bayar'
            ? 'danger'
            : 'info'
        }
        isLoading={isActionLoading}
      />

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
        duration={3000}
      />
    </div>
  );
}
