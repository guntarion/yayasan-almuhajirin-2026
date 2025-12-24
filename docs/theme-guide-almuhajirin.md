# Al Muhajirin Theme Guide - Yayasan Al Muhajirin Rewwin

## Ikhtisar

Panduan tema ini menyediakan pedoman gaya (*styling*) komprehensif berdasarkan identitas visual Yayasan Al Muhajirin Rewwin Waru Sidoarjo untuk platform digital yayasan.

## 🎨 Palet Warna

### Warna Utama

```css
/* Al Muhajirin Primary Colors - dari Logo */
--am-primary-cyan: #00BCD4        /* Warna utama - Cyan terang */
--am-dark-teal: #006064           /* Teal gelap untuk teks/aksen */
--am-medium-teal: #00838F         /* Teal sedang untuk variasi */
--am-light-cyan: #80DEEA          /* Cyan terang untuk highlight */
--am-very-light-cyan: #B2EBF2     /* Background subtle */

/* Al Muhajirin Secondary Colors */
--am-success-green: #4CAF50       /* Hijau untuk sukses/positif */
--am-accent-purple: #9C27B0       /* Ungu untuk aksen khusus */
--am-highlight-orange: #FF9800    /* Oranye untuk peringatan */
--am-gold: #FFB300                /* Emas untuk premium/special */

/* Warna Netral */
--am-gray-50: #F8FAFC
--am-gray-100: #F1F5F9
--am-gray-200: #E2E8F0
--am-gray-300: #CBD5E1
--am-gray-400: #94A3B8
--am-gray-500: #64748B
--am-gray-600: #475569
--am-gray-700: #334155
--am-gray-800: #1E293B
--am-gray-900: #0F172A
```

### Pedoman Penggunaan Warna

#### Aksi Utama & Navigasi

- **Tombol Utama (CTA)**: Gunakan gradien dari `#00BCD4` ke `#006064`
- **Aksi Sekunder**: Gunakan `#4CAF50` untuk aksi positif
- **Elemen Informasi**: Gunakan `#80DEEA` untuk konten informasi
- **Highlight**: Gunakan `#FFB300` untuk elemen penting

#### Warna Status & Umpan Balik

```css
/* Sukses */
--success-primary: #4CAF50
--success-light: #4CAF50/10
--success-border: #4CAF50/20

/* Peringatan */
--warning-primary: #FF9800
--warning-text: #006064
--warning-light: #FF9800/10

/* Info */
--info-primary: #00BCD4
--info-dark: #006064
--info-light: #00BCD4/10

/* Utama */
--primary-gradient: linear-gradient(135deg, #00BCD4, #006064)
--primary-light: #00BCD4/10
```

## 🎯 Pedoman Gaya Komponen

### Tombol (*Buttons*)

#### Tombol Utama

```css
.btn-primary-am {
  background: linear-gradient(135deg, #00bcd4, #006064);
  color: white;
  border: none;
  border-radius: 0.75rem; /* 12px */
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 188, 212, 0.25);
}

.btn-primary-am:hover {
  background: linear-gradient(135deg, #006064, #00bcd4);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 188, 212, 0.3);
}
```

#### Tombol Sekunder

```css
.btn-secondary-am {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary-am:hover {
  background: #45a049;
  transform: translateY(-1px);
}
```

#### Tombol *Outline*

```css
.btn-outline-am {
  background: transparent;
  color: #00bcd4;
  border: 2px solid #00bcd4;
  border-radius: 0.75rem;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-am:hover {
  background: #00bcd4;
  color: white;
  transform: translateY(-1px);
}
```

### Kartu (*Cards*)

#### Kartu Standar

```css
.card-am {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem; /* 16px */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.card-am:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: rgba(0, 188, 212, 0.3);
}
```

#### Kartu Premium

```css
.card-premium-am {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem; /* 24px */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  overflow: hidden;
}

.card-premium-am:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(0, 188, 212, 0.5);
}
```

#### Kartu dengan Aksen Islami

```css
.card-islamic-am {
  background: white;
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #00bcd4, #80deea) 1;
  border-radius: 1rem;
  position: relative;
}

.card-islamic-am::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #00bcd4, #80deea);
  border-radius: 1rem;
  opacity: 0.1;
  z-index: -1;
}
```

### Elemen Form

#### *Input Field*

```css
.input-am {
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.input-am:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
}
```

#### *Select Dropdown*

```css
.select-am {
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  transition: all 0.3s ease;
}

.select-am:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
}
```

### Lencana & Label

#### Lencana Status

```css
/* Lencana Utama */
.badge-primary-am {
  background: linear-gradient(135deg, #00bcd4, #006064);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Lencana Sukses */
.badge-success-am {
  background: #4caf50;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Lencana Info */
.badge-info-am {
  background: #80deea;
  color: #006064;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Lencana Peringatan */
.badge-warning-am {
  background: #ff9800;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Lencana Emas (untuk konten premium) */
.badge-gold-am {
  background: linear-gradient(135deg, #ffb300, #ffd54f);
  color: #006064;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}
```

## 🏗️ Pola Tata Letak

### Header / *Navigation Bar*

#### *Sticky Header* dengan Tema Al Muhajirin

```css
.header-am {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(to right, transparent, rgba(0, 188, 212, 0.03), rgba(128, 222, 234, 0.03));
  transition: all 0.3s ease;
}

.header-am.sticky {
  background: linear-gradient(to right, white, rgba(0, 188, 212, 0.05), rgba(128, 222, 234, 0.05));
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 188, 212, 0.2);
  backdrop-filter: blur(8px);
}

/* Mode gelap */
.dark .header-am.sticky {
  background: linear-gradient(to right, rgb(17, 24, 39), rgba(0, 188, 212, 0.1), rgba(128, 222, 234, 0.1));
}
```

#### Tombol Ikon Header

```css
.header-icon-btn-am {
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #006064;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.header-icon-btn-am:hover {
  color: #00bcd4;
  background: linear-gradient(to bottom right, rgba(0, 188, 212, 0.1), rgba(128, 222, 234, 0.1));
  transform: scale(1.05);
}

/* Mode gelap */
.dark .header-icon-btn-am {
  color: #80deea;
}
```

#### Tombol CTA Utama Header

```jsx
<Button className='bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
  Portal Yayasan
</Button>
```

#### Lencana Notifikasi

```css
.notification-badge-am {
  height: 0.5rem;
  width: 0.5rem;
  position: absolute;
  right: 0.5rem;
  top: 0.25rem;
  padding: 0;
  background: linear-gradient(to right, #00bcd4, #4caf50);
  border-radius: 9999px;
}
```

### Navigasi *Sidebar*

#### Kontainer *Sidebar*

```css
.sidebar-am {
  width: 14rem; /* 224px / w-56 */
  background: linear-gradient(to bottom, white, rgba(0, 188, 212, 0.05), rgba(128, 222, 234, 0.1));
  border-right: 1px solid rgba(0, 188, 212, 0.2);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Mode gelap */
.dark .sidebar-am {
  background: linear-gradient(to bottom, rgb(17, 24, 39), rgba(0, 188, 212, 0.1), rgba(128, 222, 234, 0.2));
}
```

#### Header Seksi *Sidebar* dengan Aksen Vertikal

```jsx
<div className='flex items-center gap-2 mb-2'>
  <div className='w-1 h-4 bg-gradient-to-b from-[#00BCD4] to-[#4CAF50] rounded-full'></div>
  <h5 className='text-sm font-semibold text-[#006064] dark:text-[#80DEEA] mb-0'>Judul Seksi</h5>
</div>
```

#### Item Menu *Sidebar*

```css
.sidebar-item-am {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  color: #475569;
}

.sidebar-item-am:hover {
  background: linear-gradient(to right, rgba(0, 188, 212, 0.1), rgba(0, 131, 143, 0.1));
  color: #00bcd4;
}

.sidebar-item-am.active {
  background: linear-gradient(to right, rgba(0, 188, 212, 0.15), rgba(0, 131, 143, 0.15));
  color: #006064;
  font-weight: 600;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Mode gelap */
.dark .sidebar-item-am {
  color: rgb(209, 213, 219);
}

.dark .sidebar-item-am.active {
  color: #80deea;
}
```

#### Pembatas *Sidebar*

```css
.sidebar-divider-am {
  height: 1px;
  width: 100%;
  background: linear-gradient(to right, transparent, rgba(0, 188, 212, 0.3), transparent);
  margin: 0.5rem 0;
}
```

#### Logo *Sidebar* yang Diciutkan

```jsx
<div className='w-10 h-10 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
  <span className='text-white font-bold text-lg'>AM</span>
</div>
```

### Seksi *Hero*

```css
.hero-am {
  background: linear-gradient(135deg, #b2ebf2 0%, #80deea 30%, #00bcd4 70%, #006064 100%);
  position: relative;
  overflow: hidden;
}

.hero-am::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
}

.hero-am-text {
  color: #006064;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### Header Seksi

```css
.section-header-am {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header-am h2 {
  color: #006064;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
}

.section-header-am .icon {
  color: #00bcd4;
  margin-right: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
}
```

### Seksi Filter

```css
.filter-section-am {
  background: linear-gradient(135deg, rgba(0, 188, 212, 0.03), rgba(128, 222, 234, 0.03));
  border: 1px solid rgba(0, 188, 212, 0.1);
  border-radius: 1rem;
  padding: 2rem;
}

.filter-label-am {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.75rem;
}

.filter-label-am .icon {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}
```

## 📱 Pedoman Responsif

### *Breakpoint*

```css
/* Pendekatan Mobile First */
.container-am {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container-am {
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container-am {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
}

/* Desktop Besar */
@media (min-width: 1536px) {
  .container-am {
    max-width: 1400px;
  }
}
```

## 🎭 Pedoman Animasi

### Transisi Standar

```css
.transition-am {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-am-slow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Efek *Hover*

```css
.hover-lift-am {
  transition: transform 0.3s ease;
}

.hover-lift-am:hover {
  transform: translateY(-2px);
}

.hover-scale-am {
  transition: transform 0.3s ease;
}

.hover-scale-am:hover {
  transform: scale(1.05);
}
```

### Status *Loading*

```css
.loading-spinner-am {
  border: 3px solid #e2e8f0;
  border-top: 3px solid #00bcd4;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin-am 1s linear infinite;
}

@keyframes spin-am {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

## 🎨 Kelas Utilitas untuk Tailwind CSS

```css
/* Warna Kustom Al Muhajirin untuk Tailwind */
.text-am-primary {
  color: #00bcd4;
}
.text-am-dark {
  color: #006064;
}
.text-am-medium {
  color: #00838f;
}
.text-am-light {
  color: #80deea;
}
.text-am-green {
  color: #4caf50;
}
.text-am-purple {
  color: #9c27b0;
}
.text-am-gold {
  color: #ffb300;
}

.bg-am-primary {
  background-color: #00bcd4;
}
.bg-am-dark {
  background-color: #006064;
}
.bg-am-medium {
  background-color: #00838f;
}
.bg-am-light {
  background-color: #80deea;
}
.bg-am-green {
  background-color: #4caf50;
}
.bg-am-purple {
  background-color: #9c27b0;
}
.bg-am-gold {
  background-color: #ffb300;
}

.border-am-primary {
  border-color: #00bcd4;
}
.border-am-dark {
  border-color: #006064;
}
.border-am-green {
  border-color: #4caf50;
}
.border-am-light {
  border-color: #80deea;
}

.bg-gradient-am-primary {
  background: linear-gradient(135deg, #00bcd4, #006064);
}

.bg-gradient-am-hero {
  background: linear-gradient(135deg, #b2ebf2 0%, #80deea 30%, #00bcd4 70%, #006064 100%);
}

.bg-gradient-am-gold {
  background: linear-gradient(135deg, #ffb300, #ffd54f);
}
```

## 📊 Pola Tampilan Data

### Halaman Tampilan Daftar/Utama

#### *Background* Halaman

```css
.page-background-am {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(178, 235, 242, 0.03), rgba(128, 222, 234, 0.03));
}
```

```jsx
<div className='min-h-screen' style={{ background: 'linear-gradient(135deg, rgba(178, 235, 242, 0.03), rgba(128, 222, 234, 0.03))' }}>
  {/* Konten halaman */}
</div>
```

#### Seksi Header Halaman

```jsx
<div className='bg-white border-b border-gray-200 px-6 py-4 mb-6'>
  <div className='flex items-center justify-between'>
    <div>
      <h1 className='text-2xl font-bold' style={{ color: '#006064' }}>
        Judul Halaman
      </h1>
      <p className='text-sm text-gray-600 mt-1'>
        Deskripsi atau subjudul halaman
      </p>
    </div>
    <div className='flex items-center space-x-3'>
      {/* Tombol aksi */}
    </div>
  </div>
</div>
```

#### Toggle Mode Tampilan (Kartu/Tabel)

```jsx
<div className='flex items-center gap-2 border border-gray-300 rounded-xl p-1'>
  <Button
    variant={viewMode === 'card' ? 'default' : 'ghost'}
    size='sm'
    onClick={() => setViewMode('card')}
    className={`rounded-lg ${viewMode === 'card' ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white' : ''}`}
  >
    <LayoutGrid className='h-4 w-4 mr-2' />
    Kartu
  </Button>
  <Button
    variant={viewMode === 'table' ? 'default' : 'ghost'}
    size='sm'
    onClick={() => setViewMode('table')}
    className={`rounded-lg ${viewMode === 'table' ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white' : ''}`}
  >
    <Table2 className='h-4 w-4 mr-2' />
    Tabel
  </Button>
</div>
```

#### Kartu Statistik

```jsx
<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
  <Card className='hover:shadow-lg transition-all duration-300'>
    <CardContent className='p-4'>
      <div className='flex items-center space-x-2'>
        <Users className='h-5 w-5' style={{ color: '#00BCD4' }} />
        <div>
          <p className='text-sm font-medium text-gray-600'>Jamaah</p>
          <p className='text-2xl font-bold text-gray-900'>250</p>
        </div>
      </div>
    </CardContent>
  </Card>
  {/* Ulangi dengan warna berbeda: #4CAF50, #9C27B0, #006064 */}
</div>
```

#### Seksi Filter

```jsx
<Card
  className='mb-6 border-2 hover:shadow-lg transition-all duration-300'
  style={{ borderColor: 'rgba(0, 188, 212, 0.1)' }}
>
  <CardHeader>
    <CardTitle className='text-lg flex items-center gap-2'>
      <Filter style={{ color: '#00BCD4' }} className='h-5 w-5' />
      Filter & Pencarian
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {/* Input pencarian */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
        <Input
          placeholder='Cari...'
          className='pl-10 border-2 focus:border-[#00BCD4] rounded-xl'
        />
      </div>

      {/* Dropdown filter */}
      <Select>
        <SelectTrigger className='w-full border-2 focus:border-[#00BCD4] rounded-xl'>
          <SelectValue placeholder='Pilih...' />
        </SelectTrigger>
        <SelectContent>{/* Opsi */}</SelectContent>
      </Select>
    </div>
  </CardContent>
</Card>
```

#### Kartu Data (untuk Tampilan Kartu)

```jsx
<Card
  className='group hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 hover:border-[#00BCD4]/50 rounded-2xl overflow-hidden hover:scale-105'
>
  <div style={{ background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.05), rgba(128, 222, 234, 0.05))' }}>
    <CardHeader className='pb-4'>
      <CardTitle className='text-lg leading-tight font-bold' style={{ color: '#006064' }}>
        Judul Item
      </CardTitle>
      <CardDescription className='space-y-2'>
        <Badge
          variant='outline'
          className='text-xs font-semibold px-3 py-1 rounded-full'
          style={{ borderColor: '#00BCD4', color: '#00BCD4' }}
        >
          Kategori
        </Badge>
      </CardDescription>
    </CardHeader>

    <CardContent className='space-y-4'>
      <div className='space-y-3'>
        <div className='flex items-start text-sm text-gray-600'>
          <MapPin className='h-4 w-4 mr-2 mt-0.5 flex-shrink-0' style={{ color: '#4CAF50' }} />
          <span className='line-clamp-2'>Teks informasi</span>
        </div>
      </div>

      <div className='flex gap-2 pt-2'>
        <Button
          asChild
          size='sm'
          className='flex-1 h-10 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105'
          style={{ background: 'linear-gradient(135deg, #00BCD4, #006064)', color: 'white' }}
        >
          <Link href='/detail'>
            <Eye className='h-4 w-4 mr-2' />
            Lihat Detail
          </Link>
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='h-10 px-4 rounded-xl border-2 hover:bg-[#4CAF50] hover:text-white transition-all duration-300'
          style={{ borderColor: '#4CAF50', color: '#4CAF50' }}
        >
          <Download className='h-4 w-4' />
        </Button>
      </div>
    </CardContent>
  </div>
</Card>
```

#### Tabel Data (untuk Tampilan Tabel)

```jsx
<Card className='border-2' style={{ borderColor: 'rgba(0, 188, 212, 0.1)' }}>
  <CardContent className='p-0'>
    <Table>
      <TableHeader>
        <TableRow className='bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10'>
          <TableHead className='font-bold' style={{ color: '#006064' }}>
            Kolom 1
          </TableHead>
          <TableHead className='font-bold' style={{ color: '#006064' }}>
            Kolom 2
          </TableHead>
          <TableHead className='font-bold text-center' style={{ color: '#006064' }}>
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className='hover:bg-[#00BCD4]/5 transition-colors'>
          <TableCell className='font-medium'>Data 1</TableCell>
          <TableCell>Data 2</TableCell>
          <TableCell className='text-center'>
            <Button
              asChild
              size='sm'
              className='h-8 rounded-lg font-semibold'
              style={{ background: 'linear-gradient(135deg, #00BCD4, #006064)', color: 'white' }}
            >
              <Link href='/detail'>Detail</Link>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

### Halaman Tampilan Detail

#### Header Halaman Detail

```jsx
<div className='bg-white border-b border-gray-200 px-6 py-4 mb-6'>
  <div className='flex items-center justify-between'>
    <div className='flex items-center gap-4'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => router.push('/list')}
        className='rounded-xl'
      >
        <ArrowLeft className='h-4 w-4 mr-2' />
        Kembali
      </Button>
      <div>
        <h1 className='text-2xl font-bold' style={{ color: '#006064' }}>
          Judul Detail
        </h1>
        <p className='text-sm text-gray-600 mt-1'>Subjudul</p>
      </div>
    </div>
    <div className='flex items-center space-x-3'>
      <Button variant='outline' size='sm' className='rounded-xl'>
        <Share2 className='h-4 w-4 mr-2' />
        Bagikan
      </Button>
      <Button variant='outline' size='sm' className='rounded-xl'>
        <Download className='h-4 w-4 mr-2' />
        Unduh
      </Button>
    </div>
  </div>
</div>
```

#### Grid Kartu Informasi

```jsx
<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
  <Card className='hover:shadow-lg transition-all duration-300'>
    <CardContent className='p-4'>
      <div className='flex items-start space-x-2'>
        <Mosque className='h-5 w-5 mt-0.5' style={{ color: '#00BCD4' }} />
        <div>
          <p className='text-xs font-medium text-gray-600'>Label</p>
          <p className='text-sm font-bold text-gray-900 mt-1'>Nilai</p>
        </div>
      </div>
    </CardContent>
  </Card>
  {/* Ulangi dengan ikon dan warna berbeda */}
</div>
```

#### Antarmuka Tab

```jsx
<Tabs defaultValue='tab1' className='w-full'>
  <TabsList className='grid w-full max-w-md grid-cols-2 mb-6 bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10 p-1 rounded-xl'>
    <TabsTrigger
      value='tab1'
      className='rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BCD4] data-[state=active]:to-[#006064] data-[state=active]:text-white font-semibold transition-all duration-300'
    >
      <BookOpen className='h-4 w-4 mr-2' />
      Tab 1
    </TabsTrigger>
    <TabsTrigger
      value='tab2'
      className='rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BCD4] data-[state=active]:to-[#006064] data-[state=active]:text-white font-semibold transition-all duration-300'
    >
      <Users className='h-4 w-4 mr-2' />
      Tab 2
    </TabsTrigger>
  </TabsList>

  <TabsContent value='tab1'>{/* Konten */}</TabsContent>
  <TabsContent value='tab2'>{/* Konten */}</TabsContent>
</Tabs>
```

#### Kartu Seksi dengan Header Ikon

```jsx
<Card className='border-2' style={{ borderColor: 'rgba(0, 188, 212, 0.2)' }}>
  <CardHeader>
    <CardTitle className='flex items-center gap-2' style={{ color: '#006064' }}>
      <BookOpen className='h-5 w-5' style={{ color: '#00BCD4' }} />
      Judul Seksi
    </CardTitle>
  </CardHeader>
  <CardContent className='space-y-6'>
    {/* Konten seksi */}
  </CardContent>
</Card>
```

#### Panel Informasi Sorotan

```jsx
<div className='p-4 rounded-xl bg-gradient-to-r from-[#80DEEA]/10 to-[#00BCD4]/10'>
  <p className='font-semibold text-sm mb-2' style={{ color: '#006064' }}>
    Label
  </p>
  <p className='text-sm text-gray-700'>Konten informasi</p>
</div>
```

#### Panel Informasi Besar

```jsx
<div className='p-4 rounded-xl bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10'>
  <p className='text-sm text-gray-800 leading-relaxed'>
    Teks konten panjang atau deskripsi
  </p>
</div>
```

## 🕌 Elemen Islami Khusus

### Ornamen Geometris

```css
.islamic-pattern-am {
  position: relative;
}

.islamic-pattern-am::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: repeating-linear-gradient(
    45deg,
    #00bcd4,
    #00bcd4 10px,
    transparent 10px,
    transparent 20px
  );
}
```

### Kartu dengan Aksen Kubah

```jsx
<Card className='relative overflow-hidden'>
  <div className='absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#00BCD4]/10 to-[#80DEEA]/10 rounded-full blur-2xl'></div>
  <CardContent className='relative z-10'>
    {/* Konten kartu */}
  </CardContent>
</Card>
```

### Lencana dengan Kaligrafi

```css
.badge-calligraphy-am {
  background: linear-gradient(135deg, #00bcd4, #006064);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-family: 'Arabic Typesetting', serif; /* Jika menggunakan font Arab */
  font-size: 1.125rem;
  box-shadow: 0 4px 6px -1px rgba(0, 188, 212, 0.3);
}
```

## 📋 Contoh Penggunaan

### *Hero* Halaman

```jsx
<div className='relative overflow-hidden bg-gradient-to-br from-[#B2EBF2] via-[#80DEEA] to-[#00BCD4] mb-8'>
  <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>
  <div className='relative container mx-auto px-6 py-12'>
    <h1 className='text-4xl md:text-5xl font-bold text-[#006064] mb-4 drop-shadow-lg'>Judul Halaman</h1>
  </div>
</div>
```

### Tombol Utama

```jsx
<Button className='h-12 px-8 bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
  Tombol Aksi
</Button>
```

### Kartu Premium

```jsx
<Card className='group overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:border-[#00BCD4]/50'>
  <div className='bg-gradient-to-br from-[#00BCD4]/5 via-[#80DEEA]/5 to-[#B2EBF2]/5 p-6'>{/* Konten Kartu */}</div>
</Card>
```

## 🚨 Catatan Penting

1. **Konsistensi Islami**: Jaga keseimbangan antara desain modern dan nilai-nilai islami
2. **Aksesibilitas**: Pastikan kontras warna yang cukup untuk keterbacaan teks
3. **Konsistensi**: Selalu gunakan variabel warna yang telah ditentukan daripada nilai kode langsung
4. **Kinerja**: Gunakan properti kustom CSS untuk pemeliharaan yang lebih baik
5. **Mode Gelap**: Sediakan varian mode gelap yang sesuai untuk semua komponen
6. **Sensitivitas Budaya**: Pastikan penggunaan elemen islami yang tepat dan menghormati

## 🔄 Pembaruan

- **Versi 1.0** (Saat Ini): Panduan tema Al Muhajirin awal ditetapkan
  - Palet warna berdasarkan logo yayasan
  - Gaya komponen lengkap
  - Pola tata letak responsif
  - Elemen islami khusus
  - Pola tampilan data untuk halaman daftar dan detail

---

_Panduan tema ini memastikan branding Yayasan Al Muhajirin yang konsisten di seluruh platform digital yayasan sambil mempertahankan prinsip desain modern dan pengalaman pengguna yang sangat baik._
