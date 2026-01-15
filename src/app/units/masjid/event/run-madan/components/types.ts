// Shared types for Run-Madan event

export type EventTab = 'fun-run' | 'senam';

// Fun Run types
export interface FunRunParticipant {
  id: string;
  namaLengkap: string;
  jenisKelamin: 'lelaki' | 'perempuan';
  tanggalLahir: string;
  ukuranKaos: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  preferensiAktivitas: 'FULL_LARI' | 'LARI_JALAN' | 'JALAN';
}

export interface FunRunRegistrant {
  nama: string;
  nomorHP: string;
  email: string;
  alamat: string;
}

export interface FunRunParticipantData {
  namaLengkap: string;
  usia: number;
  ukuranKaos: string;
}

export interface FunRunRegistrationData {
  nomorRegistrasi: string;
  nama: string;
  nomorHP: string;
  email?: string;
  jumlahPeserta: number;
  totalBiaya: number;
  participants: FunRunParticipantData[];
  instruksiPembayaran: {
    bank: string;
    nomorRekening: string;
    atasNama: string;
    nominal: number;
    whatsapp: string;
  };
}

// Senam types
export interface SenamParticipant {
  id: string;
  namaLengkap: string;
  jenisKelamin: 'lelaki' | 'perempuan';
  tanggalLahir: string;
  kondisiKesehatan: string[];
  kondisiLainnya: string;
  minatKomunitas: string[];
}

export interface SenamRegistrant {
  nama: string;
  nomorHP: string;
  email: string;
  alamat: string;
}

export interface SenamParticipantData {
  namaLengkap: string;
  usia: number;
  nomorKupon: string;
  kondisiKesehatan: string[];
  minatKomunitas: string[];
}

export interface SenamRegistrationData {
  nomorRegistrasi: string;
  nama: string;
  nomorHP: string;
  email?: string;
  jumlahPeserta: number;
  participants: SenamParticipantData[];
  info: {
    biaya: string;
    pesan: string;
    waktu: string;
    lokasi: string;
    dresscode: string;
  };
}

// Health conditions options
export const HEALTH_CONDITIONS = [
  { value: 'TIDAK_ADA', label: 'Tidak ada keluhan kesehatan' },
  { value: 'HIPERTENSI', label: 'Hipertensi (Tekanan darah tinggi)' },
  { value: 'DIABETES', label: 'Diabetes / Gula darah tinggi' },
  { value: 'ASAM_URAT', label: 'Asam urat' },
  { value: 'KOLESTEROL', label: 'Kolesterol tinggi' },
  { value: 'JANTUNG', label: 'Gangguan jantung' },
  { value: 'ASMA', label: 'Asma / Sesak nafas' },
  { value: 'STROKE', label: 'Riwayat stroke' },
  { value: 'NYERI_SENDI', label: 'Nyeri sendi / Arthritis' },
  { value: 'OSTEOPOROSIS', label: 'Osteoporosis (Pengeroposan tulang)' },
  { value: 'VERTIGO', label: 'Vertigo / Pusing berputar' },
  { value: 'LAINNYA', label: 'Lainnya (sebutkan)' },
];

// Community interest options
export const COMMUNITY_INTERESTS = [
  { value: 'SENAM_SEHAT', label: 'Senam Sehat', description: 'Senam aerobik ringan untuk kebugaran umum' },
  { value: 'SENAM_AQUATIK_LANSIA', label: 'Senam Aquatik Lansia', description: 'Senam di kolam renang, baik untuk sendi' },
  { value: 'LINE_DANCE', label: 'Line Dance', description: 'Tarian berirama dalam barisan' },
  { value: 'POUND_FITNESS', label: 'Senam Stick (Pound Fitness)', description: 'Senam dengan tongkat drum yang menyenangkan' },
];
