# PRD-01: Overview - Website Blog Yayasan Al Muhajirin

**Versi**: 1.0
**Tanggal**: Desember 2024
**Status**: Draft
**Pemilik Dokumen**: Tim Pengembangan Al Muhajirin

---

## 1. Ringkasan Eksekutif

### 1.1 Tujuan Dokumen
Dokumen ini menjelaskan Product Requirements Document (PRD) untuk pengembangan fitur blog pada website Yayasan Al Muhajirin Rewwin. Website ini menggunakan arsitektur multi-subdomain yang memungkinkan setiap unit memiliki subdomain tersendiri dengan kemampuan posting blog, galeri, dan optimasi SEO.

### 1.2 Latar Belakang
Yayasan Al Muhajirin Rewwin berkedudukan di Jl. Rajawali No. 207, RT 11, RW 06 Desa Kepuh Kiriman, Kecamatan Waru, Kabupaten Sidoarjo, Jawa Timur. Yayasan menjalankan kegiatan di bidang:
- **Pendidikan**
- **Sosial**
- **Keagamaan**
- **Kemanusiaan**

### 1.3 Visi Produk
Membangun platform web terpadu yang memungkinkan seluruh unit Yayasan Al Muhajirin untuk mempublikasikan konten, berbagi informasi, dan berinteraksi dengan masyarakat melalui satu sistem yang terintegrasi namun dengan identitas unit masing-masing.

---

## 2. Struktur Organisasi

### 2.1 Bidang dan Unit

| Bidang | Unit | Subdomain | Status |
|--------|------|-----------|--------|
| **Bidang Keagamaan** | Ketakmiran Masjid | masjid.muhajirinrewwin.or.id | Selesai |
| | Remaskidz (Remas Cilik) | remas.muhajirinrewwin.or.id | Selesai |
| | TPQ (Taman Pendidikan Qur'an) | tpq.muhajirinrewwin.or.id | Template siap |
| | Kemuslimatan | kemuslimatan.muhajirinrewwin.or.id | Template siap |
| **Bidang Sosial** | Daycare & KBTK | daycare.muhajirinrewwin.or.id | Template siap |
| | KBTK | kbtk.muhajirinrewwin.or.id | Selesai |
| | Poliklinik | poliklinik.muhajirinrewwin.or.id | Template siap |
| | Kolam Renang | pool.muhajirinrewwin.or.id | Selesai |
| **Bidang Kemanusiaan** | LAZ Muhajirin | lazmu.muhajirinrewwin.or.id | Template siap |
| | WAFMU (Wakaf) | wafmu.muhajirinrewwin.or.id | Template siap |
| | Ambulans | ambulans.muhajirinrewwin.or.id | Template siap |
| **Usaha** | Usaha & Pengadaan | usaha.muhajirinrewwin.or.id | Selesai |

### 2.2 Domain Utama
- **muhajirinrewwin.or.id** - Website utama yayasan

---

## 3. Stakeholders

### 3.1 Internal
| Stakeholder | Peran | Kepentingan |
|-------------|-------|-------------|
| Ketua Pengurus | Decision Maker | Persetujuan strategis |
| Ketua Bidang | Content Owner | Konten bidang masing-masing |
| Kepala Unit | Content Manager | Konten unit masing-masing |
| Kesekretariatan | Administrator | Pengelolaan sistem |
| Tim IT | Developer | Implementasi teknis |

### 3.2 Eksternal
| Stakeholder | Kepentingan |
|-------------|-------------|
| Jama'ah Masjid | Akses informasi kegiatan |
| Orang Tua Murid | Informasi pendidikan anak |
| Donatur | Transparansi pengelolaan dana |
| Masyarakat Umum | Layanan sosial & kemanusiaan |

---

## 4. Scope Produk

### 4.1 Dalam Scope
1. **Sistem Blog Multi-Tenant**
   - Posting artikel per unit/bidang
   - Kategorisasi konten
   - Tag dan arsip

2. **Galeri Media**
   - Upload foto dan video
   - Album per kegiatan
   - Integrasi dengan posting

3. **SEO Optimization**
   - Meta tags dinamis
   - Sitemap otomatis
   - Structured data (JSON-LD)
   - Open Graph & Twitter Cards

4. **Manajemen Konten**
   - Role-based access control
   - Draft & publish workflow
   - Scheduling posting
   - Multi-author support

5. **Integrasi Unit**
   - Subdomain routing
   - Shared authentication
   - Cross-unit content sharing

### 4.2 Luar Scope (Fase Berikutnya)
- Forum diskusi
- E-commerce/toko online
- Sistem pembayaran online
- Mobile application native

---

## 5. User Personas

### 5.1 Persona 1: Admin Unit
**Nama**: Pak Ahmad (Kepala Unit TPQ)
**Goals**:
- Mempublikasikan jadwal mengaji
- Menampilkan galeri kegiatan santri
- Mengumumkan pendaftaran santri baru

**Pain Points**:
- Tidak familiar dengan teknologi rumit
- Waktu terbatas untuk mengelola website

### 5.2 Persona 2: Pengunjung/Jama'ah
**Nama**: Bu Siti (Warga Rewwin)
**Goals**:
- Mencari jadwal sholat dan kajian
- Melihat kegiatan anak di KBTK
- Mendaftar program yayasan

**Pain Points**:
- Sulit menemukan informasi yang dibutuhkan
- Tidak tahu unit mana yang harus dihubungi

### 5.3 Persona 3: Donatur
**Nama**: Pak Budi (Donatur Tetap)
**Goals**:
- Melihat laporan penggunaan dana
- Mengetahui program yang sedang berjalan
- Menyalurkan zakat/infaq/wakaf

**Pain Points**:
- Kurang transparan dalam pelaporan
- Tidak ada update berkala

---

## 6. Success Metrics

### 6.1 KPI Utama
| Metric | Target | Cara Ukur |
|--------|--------|-----------|
| Monthly Active Users | 1,000+ | Google Analytics |
| Artikel Published/bulan | 20+ artikel | Database count |
| Bounce Rate | < 50% | Google Analytics |
| Avg. Session Duration | > 2 menit | Google Analytics |
| Organic Search Traffic | 30% total traffic | Google Search Console |

### 6.2 KPI SEO
| Metric | Target |
|--------|--------|
| Domain Authority | > 20 |
| Indexed Pages | 100% |
| Core Web Vitals | Pass |
| Mobile Usability | 100% |

---

## 7. Timeline & Milestones

### Fase 1: Foundation
- Setup database schema untuk blog
- Implementasi CRUD artikel
- Basic SEO setup

### Fase 2: Content Features
- Galeri & media management
- Kategori & tagging
- Author management

### Fase 3: Advanced Features
- Scheduling & draft workflow
- Cross-unit content
- Advanced SEO features

### Fase 4: Optimization
- Performance tuning
- Analytics integration
- User feedback implementation

---

## 8. Risiko & Mitigasi

| Risiko | Dampak | Probabilitas | Mitigasi |
|--------|--------|--------------|----------|
| User adoption rendah | High | Medium | Training & dokumentasi |
| Konten tidak update | High | High | Content calendar & reminder |
| Performance issues | Medium | Low | CDN & caching strategy |
| Security breach | High | Low | Regular audit & updates |

---

## 9. Dokumen Terkait

| No | Dokumen | Deskripsi |
|----|---------|-----------|
| 02 | [PRD-Blog-Features](./02-PRD-Blog-Features.md) | Detail fitur blog |
| 03 | [PRD-SEO-Strategy](./03-PRD-SEO-Strategy.md) | Strategi SEO |
| 04 | [PRD-Technical-Spec](./04-PRD-Technical-Spec.md) | Spesifikasi teknis |
| 05 | [PRD-Database-Schema](./05-PRD-Database-Schema.md) | Skema database |

---

## 10. Approval

| Nama | Jabatan | Tanda Tangan | Tanggal |
|------|---------|--------------|---------|
| | Ketua Pengurus | | |
| | Sekretaris | | |
| | Tim IT | | |
