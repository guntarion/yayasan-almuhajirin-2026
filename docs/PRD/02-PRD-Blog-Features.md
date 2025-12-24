# PRD-02: Fitur Blog - Website Yayasan Al Muhajirin

**Versi**: 1.0
**Tanggal**: Desember 2024
**Status**: Draft
**Parent Document**: [PRD-01: Overview](./01-PRD-Overview.md)

---

## 1. Ringkasan

Dokumen ini menjelaskan secara detail fitur-fitur blog yang akan diimplementasikan pada website Yayasan Al Muhajirin. Sistem blog dirancang untuk mendukung multi-tenant (multi-unit) dengan kemampuan posting, galeri, dan manajemen konten yang terintegrasi.

---

## 2. Fitur Artikel/Posting

### 2.1 Create Article

#### 2.1.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-B001 | User dapat membuat artikel baru dengan judul dan konten | Must Have |
| FR-B002 | Artikel memiliki slug URL yang auto-generated dari judul | Must Have |
| FR-B003 | Slug dapat diedit secara manual | Should Have |
| FR-B004 | Artikel memiliki excerpt/ringkasan (max 300 karakter) | Must Have |
| FR-B005 | Artikel dapat memiliki featured image | Must Have |
| FR-B006 | Artikel otomatis terkait dengan unit penulis | Must Have |

#### 2.1.2 Rich Text Editor

| Fitur | Deskripsi | Priority |
|-------|-----------|----------|
| Basic Formatting | Bold, italic, underline, strikethrough | Must Have |
| Headings | H1, H2, H3, H4 | Must Have |
| Lists | Ordered & unordered lists | Must Have |
| Links | Internal & external links | Must Have |
| Images | Insert & resize images | Must Have |
| Videos | Embed YouTube/Vimeo | Should Have |
| Tables | Create & edit tables | Should Have |
| Code Blocks | Untuk konten teknis | Could Have |
| Blockquotes | Kutipan | Should Have |

### 2.2 Article Status & Workflow

#### 2.2.1 Status Types

```
Draft → In Review → Published → Archived
         ↓
      Rejected
```

| Status | Deskripsi | Visibility |
|--------|-----------|------------|
| Draft | Artikel sedang ditulis | Hanya penulis |
| In Review | Menunggu approval | Penulis & Editor |
| Published | Live di website | Public |
| Scheduled | Dijadwalkan publish | Penulis & Editor |
| Archived | Tidak aktif | Admin only |
| Rejected | Ditolak oleh editor | Penulis & Editor |

#### 2.2.2 Workflow Rules

| Role | Dapat Membuat | Dapat Publish | Dapat Edit Orang Lain |
|------|---------------|---------------|------------------------|
| Admin | Ya | Ya | Ya |
| Editor | Ya | Ya | Ya (unit sendiri) |
| Author | Ya | Tidak (perlu approval) | Tidak |
| Contributor | Ya (draft only) | Tidak | Tidak |

### 2.3 Scheduling

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-B020 | User dapat menjadwalkan publish date/time | Should Have |
| FR-B021 | Sistem auto-publish pada waktu yang ditentukan | Should Have |
| FR-B022 | User dapat menjadwalkan unpublish/archive | Could Have |
| FR-B023 | Reminder email sebelum scheduled publish | Could Have |

---

## 3. Kategorisasi & Organisasi

### 3.1 Kategori

#### 3.1.1 Kategori Global (Semua Unit)

| Kategori | Deskripsi | Icon |
|----------|-----------|------|
| Berita | Informasi terkini | newspaper |
| Kegiatan | Laporan kegiatan | calendar |
| Pengumuman | Info penting | megaphone |
| Artikel | Tulisan edukatif | book |
| Galeri | Dokumentasi foto | images |
| Laporan | Laporan berkala | file-text |

#### 3.1.2 Kategori Per Unit

Setiap unit dapat memiliki sub-kategori khusus:

| Unit | Sub-Kategori Khusus |
|------|---------------------|
| Masjid | Jadwal Sholat, Kajian, Khutbah |
| KBTK | Kurikulum, Prestasi, Pendaftaran |
| TPQ | Jadwal Mengaji, Wisuda, Tahfidz |
| Pool | Jadwal Berenang, Promo, Event |
| LAZMU | Zakat, Infaq, Laporan Penyaluran |
| Ambulans | Layanan, Kontak Darurat |
| Poliklinik | Jadwal Dokter, Layanan Kesehatan |

### 3.2 Tags

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-B030 | Artikel dapat memiliki multiple tags | Must Have |
| FR-B031 | Tags dapat di-create on the fly | Should Have |
| FR-B032 | Tag suggestion berdasarkan existing tags | Should Have |
| FR-B033 | Tag cloud/popular tags widget | Could Have |
| FR-B034 | Maximum 10 tags per artikel | Must Have |

### 3.3 Arsip

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-B040 | Arsip berdasarkan bulan/tahun | Must Have |
| FR-B041 | Filter arsip berdasarkan kategori | Should Have |
| FR-B042 | Arsip per unit (subdomain) | Must Have |

---

## 4. Galeri & Media

### 4.1 Media Library

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-M001 | Upload multiple images sekaligus | Must Have |
| FR-M002 | Drag & drop upload | Should Have |
| FR-M003 | Support format: JPG, PNG, GIF, WebP | Must Have |
| FR-M004 | Auto-resize & optimize images | Must Have |
| FR-M005 | Generate thumbnails otomatis | Must Have |
| FR-M006 | Max file size: 5MB per file | Must Have |
| FR-M007 | Media library searchable | Should Have |
| FR-M008 | Folder organization | Should Have |

### 4.2 Image Optimization

| Ukuran | Dimensi | Penggunaan |
|--------|---------|------------|
| Thumbnail | 150x150 | Grid view |
| Small | 300x200 | Card preview |
| Medium | 768x512 | In-content |
| Large | 1200x800 | Featured |
| Original | Max 2000px | Download |

### 4.3 Album/Galeri Kegiatan

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-M020 | Create album dengan nama & deskripsi | Must Have |
| FR-M021 | Set cover image untuk album | Must Have |
| FR-M022 | Album terkait dengan unit | Must Have |
| FR-M023 | Album dapat di-embed di artikel | Should Have |
| FR-M024 | Lightbox view untuk galeri | Must Have |
| FR-M025 | Download album sebagai ZIP | Could Have |

### 4.4 Video Support

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-M030 | Embed video YouTube | Must Have |
| FR-M031 | Embed video dari platform lain | Should Have |
| FR-M032 | Upload video langsung (max 100MB) | Could Have |
| FR-M033 | Auto-thumbnail dari video | Should Have |

---

## 5. Fitur Interaksi

### 5.1 Comments (Fase Berikutnya)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-C001 | Visitor dapat meninggalkan komentar | Could Have |
| FR-C002 | Komentar memerlukan approval | Could Have |
| FR-C003 | Reply to comment (nested) | Could Have |
| FR-C004 | Anti-spam (reCAPTCHA) | Could Have |

### 5.2 Social Sharing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-S001 | Share ke WhatsApp | Must Have |
| FR-S002 | Share ke Facebook | Must Have |
| FR-S003 | Share ke Twitter/X | Should Have |
| FR-S004 | Copy link button | Must Have |
| FR-S005 | Share count display | Could Have |

### 5.3 Related Content

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-R001 | Tampilkan artikel terkait (same category) | Should Have |
| FR-R002 | "Artikel dari unit ini" section | Should Have |
| FR-R003 | "Berita terbaru" widget | Must Have |

---

## 6. Search & Discovery

### 6.1 Search Functionality

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SE001 | Full-text search artikel | Must Have |
| FR-SE002 | Search dengan filter kategori | Should Have |
| FR-SE003 | Search dengan filter unit | Should Have |
| FR-SE004 | Search dengan filter tanggal | Could Have |
| FR-SE005 | Search autocomplete/suggestions | Should Have |
| FR-SE006 | Highlight search terms in results | Should Have |

### 6.2 Browse & Filter

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-BR001 | Browse by kategori | Must Have |
| FR-BR002 | Browse by tag | Must Have |
| FR-BR003 | Browse by unit | Must Have |
| FR-BR004 | Browse by author | Should Have |
| FR-BR005 | Sort by date, popularity | Should Have |
| FR-BR006 | Pagination (10 items/page default) | Must Have |

---

## 7. Display Components

### 7.1 Article List Views

#### Card Layout (Default)
```
┌─────────────────────────────┐
│ [Featured Image]            │
├─────────────────────────────┤
│ Kategori                    │
│ JUDUL ARTIKEL               │
│ Excerpt text...             │
│ Author • 24 Des 2024        │
└─────────────────────────────┘
```

#### List Layout
```
┌────────┬────────────────────┐
│ [Img]  │ Kategori           │
│        │ JUDUL ARTIKEL      │
│        │ Excerpt...         │
│        │ Author • Date      │
└────────┴────────────────────┘
```

### 7.2 Single Article View

```
[Breadcrumb: Home > Unit > Kategori > Artikel]

[Featured Image - Full Width]

Kategori | 24 Desember 2024 | 5 min read

# Judul Artikel

[Author Info: Avatar, Name, Role]

[Article Content...]

[Tags: #tag1 #tag2 #tag3]

[Share Buttons: WA | FB | X | Copy]

[Related Articles Grid]

[Author Bio Box]
```

### 7.3 Widgets

| Widget | Lokasi | Fungsi |
|--------|--------|--------|
| Recent Posts | Sidebar/Footer | 5 artikel terbaru |
| Popular Posts | Sidebar | Berdasarkan views |
| Categories | Sidebar | Daftar kategori |
| Tags Cloud | Sidebar | Popular tags |
| Unit Selector | Header | Switch antar unit |
| Search Box | Header | Quick search |

---

## 8. User Roles & Permissions

### 8.1 Permission Matrix

| Permission | Admin | Editor | Author | Viewer |
|------------|-------|--------|--------|--------|
| Create Article | Ya | Ya | Ya | Tidak |
| Edit Own Article | Ya | Ya | Ya | Tidak |
| Edit Others Article | Ya | Ya (unit) | Tidak | Tidak |
| Delete Article | Ya | Ya (unit) | Own only | Tidak |
| Publish Article | Ya | Ya | Tidak | Tidak |
| Manage Categories | Ya | Tidak | Tidak | Tidak |
| Manage Media | Ya | Ya | Own only | Tidak |
| View Statistics | Ya | Ya | Own only | Tidak |
| Manage Users | Ya | Tidak | Tidak | Tidak |

### 8.2 Unit-Based Access

- Editor hanya dapat mengelola konten unit sendiri
- Author hanya dapat melihat dan mengedit artikel sendiri
- Cross-unit content sharing memerlukan approval dari kedua unit

---

## 9. Notifications

### 9.1 Email Notifications

| Event | Recipient | Priority |
|-------|-----------|----------|
| Artikel submitted for review | Editor | Should Have |
| Artikel published | Author | Should Have |
| Artikel rejected | Author | Should Have |
| Comment received | Author | Could Have |
| Scheduled article published | Author | Should Have |

### 9.2 Dashboard Notifications

| Event | Display | Priority |
|-------|---------|----------|
| Pending reviews | Badge count | Should Have |
| Draft reminder | Toast | Could Have |
| System updates | Banner | Should Have |

---

## 10. Analytics & Reporting

### 10.1 Article Statistics

| Metric | Deskripsi | Priority |
|--------|-----------|----------|
| Page Views | Total views per artikel | Must Have |
| Unique Visitors | Unique readers | Should Have |
| Read Time | Average time on article | Could Have |
| Bounce Rate | Per artikel | Should Have |
| Traffic Source | Referrer data | Should Have |

### 10.2 Dashboard Reports

| Report | Deskripsi | Priority |
|--------|-----------|----------|
| Top Articles | 10 artikel terpopuler | Should Have |
| Author Performance | Artikel per author | Should Have |
| Category Distribution | Artikel per kategori | Should Have |
| Publishing Trend | Timeline chart | Could Have |

---

## 11. Mobile Responsiveness

### 11.1 Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 640px | Single column |
| Tablet | 640-1024px | 2 columns |
| Desktop | > 1024px | Full layout |

### 11.2 Mobile-Specific Features

| Feature | Requirement |
|---------|-------------|
| Touch-friendly UI | Large tap targets |
| Swipe navigation | Galeri images |
| Bottom navigation | Quick access |
| Offline reading | PWA support (future) |

---

## 12. Acceptance Criteria

### 12.1 Article Creation
- [ ] User dapat membuat artikel dengan semua field required
- [ ] Artikel tersimpan sebagai draft
- [ ] Preview artikel sebelum publish
- [ ] Artikel tampil di listing setelah published

### 12.2 Media Management
- [ ] Upload gambar berhasil
- [ ] Gambar ter-optimize otomatis
- [ ] Galeri dapat dibuat dan dikelola
- [ ] Media dapat di-embed ke artikel

### 12.3 Display
- [ ] Artikel tampil dengan format yang benar
- [ ] Responsive di semua device
- [ ] Share buttons berfungsi
- [ ] Related articles muncul

---

## 13. Appendix

### 13.1 Glossary

| Term | Definition |
|------|------------|
| Article | Konten blog/posting |
| Slug | URL-friendly identifier |
| Excerpt | Ringkasan singkat artikel |
| Featured Image | Gambar utama artikel |
| Draft | Artikel belum dipublish |

### 13.2 References

- [PRD-01: Overview](./01-PRD-Overview.md)
- [PRD-03: SEO Strategy](./03-PRD-SEO-Strategy.md)
- [PRD-04: Technical Spec](./04-PRD-Technical-Spec.md)
- [PRD-05: Database Schema](./05-PRD-Database-Schema.md)
