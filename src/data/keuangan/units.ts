/**
 * Organizational Structure Data
 * Yayasan Al Muhajirin Rewwin (YAMR)
 *
 * Bidang (Divisions) and Unit Kerja (Sub-divisions)
 */

export interface UnitKerja {
  kode: string;
  nama: string;
}

export interface Bidang {
  kode: string;
  nama: string;
  units: UnitKerja[];
}

export const BIDANG_DATA: Bidang[] = [
  {
    kode: 'SK',
    nama: 'KESEKRETARIATAN',
    units: [
      { kode: 'SEK', nama: 'SEKRETARIAT' },
      { kode: 'MAI', nama: 'TEKNIK MAINTENANCE' },
      { kode: 'MUT', nama: 'PENJAMINAN MUTU' },
      { kode: 'SDM', nama: 'PERSONALIA SDM' },
      { kode: 'KEA', nama: 'KEBERSIHAN KEAMANAN' },
      { kode: 'HUM', nama: 'KEHUMASAN' },
      { kode: 'DAN', nama: 'USAHA DANA' },
      { kode: 'KED', nama: 'KEDAI' },
      { kode: 'KOL', nama: 'KOLAM RENANG' },
    ],
  },
  {
    kode: 'AG',
    nama: 'KEAGAMAAN',
    units: [
      { kode: 'TKM', nama: 'KETAKMIRAN' },
      { kode: 'KID', nama: 'REMASKIDZ' },
      { kode: 'MUS', nama: 'KEMUSLIMAHAN' },
    ],
  },
  {
    kode: 'SO',
    nama: 'SOSIAL',
    units: [
      { kode: 'DCR', nama: 'DAYCARE' },
      { kode: 'KBT', nama: 'KBTK' },
      { kode: 'TPQ', nama: 'TPQ' },
    ],
  },
  {
    kode: 'KM',
    nama: 'KEMANUSIAAN',
    units: [
      { kode: 'LAZ', nama: 'LAZ MUHAJIRIN' },
      { kode: 'WAF', nama: 'WAKAF MUHAJIRIN' },
      { kode: 'POL', nama: 'POLIKLINIK' },
      { kode: 'AMB', nama: 'AMBULANS' },
      { kode: 'JNZ', nama: 'LAYANAN JENAZAH' },
    ],
  },
];

// Helper functions
export function getBidangByKode(kode: string): Bidang | undefined {
  return BIDANG_DATA.find((b) => b.kode === kode);
}

export function getUnitByKode(bidangKode: string, unitKode: string): UnitKerja | undefined {
  const bidang = getBidangByKode(bidangKode);
  return bidang?.units.find((u) => u.kode === unitKode);
}

export function getAllUnits(): UnitKerja[] {
  return BIDANG_DATA.flatMap((b) => b.units);
}

export function getUnitsByBidang(bidangKode: string): UnitKerja[] {
  const bidang = getBidangByKode(bidangKode);
  return bidang?.units || [];
}

// For dropdowns/selects
export function getBidangOptions() {
  return BIDANG_DATA.map((b) => ({
    value: b.kode,
    label: b.nama,
  }));
}

export function getUnitOptions(bidangKode: string) {
  const units = getUnitsByBidang(bidangKode);
  return units.map((u) => ({
    value: u.kode,
    label: u.nama,
  }));
}

// Get full unit with bidang info
export function getFullUnitInfo(bidangKode: string, unitKode: string) {
  const bidang = getBidangByKode(bidangKode);
  const unit = bidang?.units.find((u) => u.kode === unitKode);
  if (!bidang || !unit) return null;

  return {
    bidangKode: bidang.kode,
    bidangNama: bidang.nama,
    unitKode: unit.kode,
    unitNama: unit.nama,
    fullKode: `${bidang.kode}-${unit.kode}`,
    fullNama: `${bidang.nama} - ${unit.nama}`,
  };
}

// Seed data for database
export function getBidangSeedData() {
  return BIDANG_DATA.map((b) => ({
    kode: b.kode,
    nama: b.nama,
    isActive: true,
  }));
}

export function getUnitKerjaSeedData() {
  return BIDANG_DATA.flatMap((b) =>
    b.units.map((u) => ({
      kode: u.kode,
      nama: u.nama,
      bidangKode: b.kode,
      isActive: true,
    }))
  );
}
