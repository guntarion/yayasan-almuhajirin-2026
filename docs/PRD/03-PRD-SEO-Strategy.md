# PRD-03: Strategi SEO - Website Yayasan Al Muhajirin

**Versi**: 1.0
**Tanggal**: Desember 2024
**Status**: Draft
**Parent Document**: [PRD-01: Overview](./01-PRD-Overview.md)

---

## 1. Ringkasan

Dokumen ini menjelaskan strategi Search Engine Optimization (SEO) untuk website Yayasan Al Muhajirin. Tujuan utama adalah meningkatkan visibilitas website di mesin pencari untuk menjangkau lebih banyak jama'ah dan masyarakat umum.

---

## 2. Tujuan SEO

### 2.1 Primary Goals
1. **Meningkatkan organic traffic** sebesar 50% dalam 6 bulan
2. **Ranking di halaman 1 Google** untuk keyword target
3. **Meningkatkan domain authority** ke level 20+
4. **Indexing 100%** semua halaman penting

### 2.2 Target Keywords

#### Domain Utama (almuhajirin.or.id)

| Kategori | Keywords | Volume Est. | Difficulty |
|----------|----------|-------------|------------|
| Brand | al muhajirin rewwin | Low | Easy |
| | yayasan al muhajirin sidoarjo | Low | Easy |
| | masjid al muhajirin rewwin | Medium | Easy |
| Location | yayasan islam sidoarjo | Medium | Medium |
| | kegiatan sosial waru sidoarjo | Low | Easy |

#### Per Unit Subdomain

| Unit | Target Keywords |
|------|-----------------|
| masjid | jadwal sholat rewwin, kajian islam sidoarjo, masjid al muhajirin |
| kbtk | KBTK islam sidoarjo, sekolah TK islam waru, PAUD islam sidoarjo |
| tpq | TPQ sidoarjo, mengaji anak sidoarjo, tahfidz anak waru |
| pool | kolam renang rewwin, berenang sidoarjo, pool party sidoarjo |
| lazmu | zakat sidoarjo, infaq sidoarjo, LAZ muhajirin |
| daycare | daycare islam sidoarjo, penitipan anak sidoarjo |
| ambulans | ambulans gratis sidoarjo, ambulans jenazah waru |
| poliklinik | klinik gratis sidoarjo, berobat gratis waru |

---

## 3. Technical SEO

### 3.1 Meta Tags Implementation

#### 3.1.1 Title Tag

**Format**:
```
[Page Title] | [Unit Name] - Al Muhajirin Rewwin
```

**Contoh**:
```
Jadwal Kajian Rutin Desember 2024 | Masjid - Al Muhajirin Rewwin
Pendaftaran Santri Baru TPQ | TPQ - Al Muhajirin Rewwin
```

**Requirements**:
| Requirement | Spesifikasi |
|-------------|-------------|
| Panjang | 50-60 karakter |
| Unique | Setiap halaman berbeda |
| Keyword | Include target keyword |
| Brand | Include "Al Muhajirin" |

#### 3.1.2 Meta Description

**Format**:
```
[Deskripsi ringkas konten]. [Call to action]. [Unit] Yayasan Al Muhajirin Rewwin Sidoarjo.
```

**Contoh**:
```
Jadwal kajian rutin masjid Al Muhajirin bulan Desember 2024. Ikuti berbagai
kajian Islam bersama ustadz pilihan. Masjid Al Muhajirin Rewwin Sidoarjo.
```

**Requirements**:
| Requirement | Spesifikasi |
|-------------|-------------|
| Panjang | 150-160 karakter |
| Unique | Setiap halaman berbeda |
| Keyword | Include target keyword |
| CTA | Include call to action |

#### 3.1.3 Meta Keywords (Optional)
```html
<meta name="keywords" content="keyword1, keyword2, keyword3">
```

### 3.2 Open Graph Tags

```html
<meta property="og:title" content="Judul Artikel">
<meta property="og:description" content="Deskripsi artikel">
<meta property="og:image" content="https://almuhajirin.or.id/images/og-image.jpg">
<meta property="og:url" content="https://almuhajirin.or.id/artikel/slug">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Al Muhajirin Rewwin">
<meta property="og:locale" content="id_ID">
```

**Image Requirements**:
| Aspect | Spesifikasi |
|--------|-------------|
| Size | 1200 x 630 pixels |
| Format | JPG atau PNG |
| File Size | < 1MB |
| Alt Text | Deskriptif |

### 3.3 Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Judul Artikel">
<meta name="twitter:description" content="Deskripsi artikel">
<meta name="twitter:image" content="https://almuhajirin.or.id/images/twitter-card.jpg">
```

### 3.4 Canonical URLs

```html
<link rel="canonical" href="https://almuhajirin.or.id/artikel/slug">
```

**Rules**:
- Setiap halaman memiliki canonical URL
- Subdomain articles: canonical ke URL subdomain sendiri
- Duplicate content: point ke halaman utama

### 3.5 Structured Data (JSON-LD)

#### 3.5.1 Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Yayasan Al Muhajirin Rewwin",
  "alternateName": "Al Muhajirin",
  "url": "https://almuhajirin.or.id",
  "logo": "https://almuhajirin.or.id/logo.png",
  "sameAs": [
    "https://facebook.com/almuhajirin",
    "https://instagram.com/almuhajirin"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Rajawali No. 207, RT 11, RW 06",
    "addressLocality": "Kepuh Kiriman, Waru",
    "addressRegion": "Sidoarjo",
    "postalCode": "61256",
    "addressCountry": "ID"
  }
}
```

#### 3.5.2 Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Judul Artikel",
  "description": "Deskripsi artikel",
  "image": "https://almuhajirin.or.id/images/article-image.jpg",
  "author": {
    "@type": "Organization",
    "name": "Unit Name - Al Muhajirin"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Yayasan Al Muhajirin",
    "logo": {
      "@type": "ImageObject",
      "url": "https://almuhajirin.or.id/logo.png"
    }
  },
  "datePublished": "2024-12-24",
  "dateModified": "2024-12-24"
}
```

#### 3.5.3 BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://almuhajirin.or.id"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Masjid",
      "item": "https://masjid.almuhajirin.or.id"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Artikel Title"
    }
  ]
}
```

#### 3.5.4 LocalBusiness Schema (Per Unit)

```json
{
  "@context": "https://schema.org",
  "@type": "Mosque",
  "name": "Masjid Al Muhajirin Rewwin",
  "image": "https://masjid.almuhajirin.or.id/images/masjid.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Rajawali No. 207",
    "addressLocality": "Waru",
    "addressRegion": "Sidoarjo",
    "addressCountry": "ID"
  },
  "openingHours": "Mo-Su 00:00-24:00"
}
```

---

## 4. URL Structure

### 4.1 URL Format

| Halaman | Format URL |
|---------|------------|
| Homepage | https://almuhajirin.or.id/ |
| Unit Homepage | https://[unit].almuhajirin.or.id/ |
| Article | https://[unit].almuhajirin.or.id/artikel/[slug] |
| Category | https://[unit].almuhajirin.or.id/kategori/[slug] |
| Tag | https://[unit].almuhajirin.or.id/tag/[slug] |
| Archive | https://[unit].almuhajirin.or.id/arsip/[tahun]/[bulan] |
| Author | https://[unit].almuhajirin.or.id/penulis/[username] |

### 4.2 Slug Rules

| Rule | Contoh |
|------|--------|
| Lowercase only | ✅ kajian-ramadhan ❌ Kajian-Ramadhan |
| Hyphens for spaces | ✅ jadwal-sholat ❌ jadwal_sholat |
| No special characters | ✅ info-zakat ❌ info-zakat! |
| Indonesian language | ✅ pengumuman-baru ✅ new-announcement |
| Max 50 characters | Potong jika lebih panjang |

### 4.3 URL Best Practices

- ✅ Gunakan HTTPS
- ✅ Trailing slash konsisten
- ✅ No query parameters untuk content pages
- ✅ No session IDs di URL
- ❌ Hindari parameter berlebihan
- ❌ Hindari deep nesting (max 3 levels)

---

## 5. Content SEO

### 5.1 On-Page Optimization Checklist

#### Article/Post Requirements

| Element | Requirement | Priority |
|---------|-------------|----------|
| Title (H1) | Include keyword, max 60 chars | Must |
| Meta Description | Include keyword, 150-160 chars | Must |
| URL Slug | Include keyword, max 50 chars | Must |
| First Paragraph | Include keyword naturally | Must |
| Headings (H2-H4) | Include related keywords | Should |
| Image Alt Text | Descriptive with keywords | Must |
| Internal Links | Min 2-3 per article | Should |
| External Links | To authoritative sources | Could |
| Word Count | Min 300 words recommended | Should |
| Featured Image | Optimized, with alt text | Must |

### 5.2 Content Guidelines

#### Heading Structure
```
H1: Judul Utama (1 per halaman)
  H2: Sub-topik Utama
    H3: Detail Sub-topik
      H4: Detail Tambahan
  H2: Sub-topik Lain
```

#### Keyword Density
- Target: 1-2% keyword density
- Natural placement, tidak dipaksakan
- Use synonyms dan related terms

#### Internal Linking Strategy
1. Link ke artikel terkait dalam unit yang sama
2. Link ke halaman utama unit
3. Link ke artikel populer
4. Use descriptive anchor text

### 5.3 Image Optimization

| Aspect | Requirement |
|--------|-------------|
| File Name | Deskriptif dengan hyphen (jadwal-sholat-jumat.jpg) |
| Alt Text | Deskripsi lengkap gambar (max 125 chars) |
| Title | Optional, untuk tooltip |
| Format | WebP preferred, fallback JPG/PNG |
| Size | < 200KB untuk web images |
| Dimensions | Sesuai container, max 2000px width |
| Lazy Loading | Implementasi lazy load |

---

## 6. Sitemap & Robots

### 6.1 XML Sitemap

**Location**: https://almuhajirin.or.id/sitemap.xml

**Structure**:
```
sitemap.xml (index)
├── sitemap-main.xml (halaman statis)
├── sitemap-articles.xml (semua artikel)
├── sitemap-categories.xml (kategori)
├── sitemap-tags.xml (tags)
├── sitemap-masjid.xml (subdomain masjid)
├── sitemap-kbtk.xml (subdomain kbtk)
└── ... (per subdomain)
```

**Auto-Update**:
- Update sitemap saat artikel baru dipublish
- Include lastmod date
- Priority: homepage 1.0, articles 0.8, archives 0.5

### 6.2 Robots.txt

```
User-agent: *
Allow: /

# Block admin areas
Disallow: /dashboard/
Disallow: /api/
Disallow: /admin/

# Block private pages
Disallow: /*?preview=
Disallow: /*?draft=

# Sitemap location
Sitemap: https://almuhajirin.or.id/sitemap.xml
```

---

## 7. Core Web Vitals

### 7.1 Target Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| INP | < 200ms | Interaction to Next Paint |
| CLS | < 0.1 | Cumulative Layout Shift |
| FCP | < 1.8s | First Contentful Paint |
| TTFB | < 800ms | Time to First Byte |

### 7.2 Optimization Strategies

#### Image Optimization
- WebP format dengan fallback
- Responsive images (srcset)
- Lazy loading untuk below-fold images
- Proper sizing (no oversized images)

#### Code Optimization
- Minify CSS & JavaScript
- Tree shaking untuk unused code
- Code splitting per route
- Preload critical resources

#### Caching Strategy
- Static assets: 1 year cache
- HTML: no-cache, must-revalidate
- API responses: appropriate cache headers
- Service worker untuk offline support

#### Server Optimization
- CDN untuk static assets
- Edge caching
- Gzip/Brotli compression
- HTTP/2 atau HTTP/3

---

## 8. Local SEO

### 8.1 Google Business Profile

| Field | Value |
|-------|-------|
| Business Name | Yayasan Al Muhajirin Rewwin |
| Category | Religious Organization |
| Address | Jl. Rajawali No. 207, Rewwin, Sidoarjo |
| Phone | [Nomor Telepon] |
| Website | https://almuhajirin.or.id |
| Hours | Sesuai jadwal unit |

### 8.2 Local Citations

Target platforms:
1. Google Maps
2. Apple Maps
3. Bing Places
4. Facebook Pages
5. Instagram Business
6. Direktori Masjid Indonesia
7. Direktori Lembaga Sosial

### 8.3 NAP Consistency

**NAP = Name, Address, Phone**

Pastikan konsisten di semua platform:
```
Yayasan Al Muhajirin Rewwin
Jl. Rajawali No. 207, RT 11, RW 06
Desa Kepuh Kiriman, Kec. Waru
Kabupaten Sidoarjo, Jawa Timur 61256
Telp: [Nomor Telepon]
```

---

## 9. Analytics & Monitoring

### 9.1 Tools Setup

| Tool | Fungsi | Priority |
|------|--------|----------|
| Google Analytics 4 | Traffic analysis | Must |
| Google Search Console | Search performance | Must |
| Google Tag Manager | Tag management | Should |
| PageSpeed Insights | Performance monitoring | Should |
| Ahrefs/SEMrush | Competitor analysis | Could |

### 9.2 Key Reports

#### Weekly Reports
- Organic traffic trend
- Top performing pages
- New indexed pages
- Search query performance

#### Monthly Reports
- Keyword ranking changes
- Backlink profile
- Core Web Vitals status
- Competitor comparison

### 9.3 Alerts Setup

| Alert | Trigger | Action |
|-------|---------|--------|
| Traffic Drop | > 20% decrease | Investigate immediately |
| Indexing Issue | Pages dropped | Check Search Console |
| 404 Errors | New 404s detected | Fix or redirect |
| Site Speed | LCP > 4s | Optimize images/code |

---

## 10. Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Setup Google Search Console
- [ ] Setup Google Analytics 4
- [ ] Create robots.txt
- [ ] Generate initial sitemap
- [ ] Implement basic meta tags

### Phase 2: Technical SEO (Week 3-4)
- [ ] Implement structured data (JSON-LD)
- [ ] Setup Open Graph tags
- [ ] Optimize URL structure
- [ ] Implement canonical URLs
- [ ] Configure HTTPS properly

### Phase 3: Content SEO (Week 5-6)
- [ ] Create content guidelines
- [ ] Optimize existing articles
- [ ] Implement internal linking
- [ ] Optimize images with alt text
- [ ] Create category/tag pages

### Phase 4: Performance (Week 7-8)
- [ ] Achieve Core Web Vitals targets
- [ ] Implement caching strategy
- [ ] Setup CDN
- [ ] Optimize images (WebP)
- [ ] Code splitting implementation

### Phase 5: Local SEO (Week 9-10)
- [ ] Setup Google Business Profile
- [ ] Create local citations
- [ ] Verify NAP consistency
- [ ] Collect reviews strategy

---

## 11. Appendix

### 11.1 SEO Glossary

| Term | Definition |
|------|------------|
| SERP | Search Engine Results Page |
| CTR | Click-Through Rate |
| DA | Domain Authority |
| PA | Page Authority |
| NAP | Name, Address, Phone |
| LCP | Largest Contentful Paint |
| CLS | Cumulative Layout Shift |
| INP | Interaction to Next Paint |

### 11.2 References

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org)
- [Web.dev](https://web.dev)
- [PRD-01: Overview](./01-PRD-Overview.md)
- [PRD-04: Technical Spec](./04-PRD-Technical-Spec.md)
