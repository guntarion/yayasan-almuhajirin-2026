# PLN Theme Guide - PLN NUSANTARA POWER Learning Path Platform

## Overview

This guide provides comprehensive styling guidelines based on PLN (Perusahaan Listrik Negara) corporate colors and design principles for the PLN NUSANTARA POWER Learning Path Platform.

## 🎨 Color Palette

### Primary Colors

```css
/* PLN Corporate Blues */
--pln-primary-blue: #00A2B9      /* Main brand blue */
--pln-dark-blue: #035B71         /* Dark blue for text/accents */
--pln-corporate-teal: #3135B71   /* Alternative teal variant */

/* PLN Secondary Colors */
--pln-green: #35B971             /* Innovation/success green */
--pln-light-blue: #00AFF0        /* Bright accent blue */
--pln-yellow: #FFFF00            /* Highlight/warning yellow */

/* Neutral Colors */
--pln-gray-50: #F8FAFC
--pln-gray-100: #F1F5F9
--pln-gray-200: #E2E8F0
--pln-gray-300: #CBD5E1
--pln-gray-400: #94A3B8
--pln-gray-500: #64748B
--pln-gray-600: #475569
--pln-gray-700: #334155
--pln-gray-800: #1E293B
--pln-gray-900: #0F172A
```

### Color Usage Guidelines

#### Primary Actions & Navigation

- **Main CTAs**: Use gradient from `#00A2B9` to `#035B71`
- **Secondary Actions**: Use `#35B971` for positive actions
- **Information Elements**: Use `#00AFF0` for informational content
- **Highlights**: Use `#FFFF00` sparingly for important notices

#### Status & Feedback Colors

```css
/* Success */
--success-primary: #35B971
--success-light: #35B971/10
--success-border: #35B971/20

/* Warning */
--warning-primary: #FFFF00
--warning-text: #035B71
--warning-light: #FFFF00/10

/* Info */
--info-primary: #00AFF0
--info-dark: #035B71
--info-light: #00AFF0/10

/* Primary */
--primary-gradient: linear-gradient(135deg, #00A2B9, #035B71)
--primary-light: #00A2B9/10
```

## 🎯 Component Styling Guidelines

### Buttons

#### Primary Button

```css
.btn-primary-pln {
  background: linear-gradient(135deg, #00a2b9, #035b71);
  color: white;
  border: none;
  border-radius: 0.75rem; /* 12px */
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 162, 185, 0.25);
}

.btn-primary-pln:hover {
  background: linear-gradient(135deg, #035b71, #00a2b9);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 162, 185, 0.3);
}
```

#### Secondary Button

```css
.btn-secondary-pln {
  background: #35b971;
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary-pln:hover {
  background: #2da55f;
  transform: translateY(-1px);
}
```

#### Outline Button

```css
.btn-outline-pln {
  background: transparent;
  color: #00a2b9;
  border: 2px solid #00a2b9;
  border-radius: 0.75rem;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-pln:hover {
  background: #00a2b9;
  color: white;
  transform: translateY(-1px);
}
```

### Cards

#### Standard Card

```css
.card-pln {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem; /* 16px */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.card-pln:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: rgba(0, 162, 185, 0.3);
}
```

#### Premium Card

```css
.card-premium-pln {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem; /* 24px */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  overflow: hidden;
}

.card-premium-pln:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(0, 162, 185, 0.5);
}
```

### Form Elements

#### Input Fields

```css
.input-pln {
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.input-pln:focus {
  outline: none;
  border-color: #00a2b9;
  box-shadow: 0 0 0 3px rgba(0, 162, 185, 0.1);
}
```

#### Select Dropdowns

```css
.select-pln {
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  transition: all 0.3s ease;
}

.select-pln:focus {
  border-color: #00a2b9;
  box-shadow: 0 0 0 3px rgba(0, 162, 185, 0.1);
}
```

### Badges & Labels

#### Status Badges

```css
/* Primary Badge */
.badge-primary-pln {
  background: linear-gradient(135deg, #00a2b9, #035b71);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Success Badge */
.badge-success-pln {
  background: #35b971;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Info Badge */
.badge-info-pln {
  background: #00aff0;
  color: #035b71;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Warning Badge */
.badge-warning-pln {
  background: #ffff00;
  color: #035b71;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

## 🏗️ Layout Patterns

### Header / Navigation Bar

#### Sticky Header with PLN Theme

```css
.header-pln {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(to right, transparent, rgba(0, 162, 185, 0.03), rgba(53, 185, 113, 0.03));
  transition: all 0.3s ease;
}

.header-pln.sticky {
  background: linear-gradient(to right, white, rgba(0, 162, 185, 0.05), rgba(53, 185, 113, 0.05));
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 162, 185, 0.2);
  backdrop-filter: blur(8px);
}

/* Dark mode */
.dark .header-pln.sticky {
  background: linear-gradient(to right, rgb(17, 24, 39), rgba(0, 162, 185, 0.1), rgba(53, 185, 113, 0.1));
}
```

#### Header Icon Buttons

```css
.header-icon-btn-pln {
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #035B71;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.header-icon-btn-pln:hover {
  color: #00A2B9;
  background: linear-gradient(to bottom right, rgba(0, 162, 185, 0.1), rgba(53, 185, 113, 0.1));
  transform: scale(1.05);
}

/* Dark mode */
.dark .header-icon-btn-pln {
  color: #00AFF0;
}
```

#### Header Primary CTA Button

```jsx
<Button className='bg-gradient-to-r from-[#00A2B9] to-[#035B71] hover:from-[#035B71] hover:to-[#00A2B9] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
  Manajemen Pembelajaran
</Button>
```

#### Notification Badge

```css
.notification-badge-pln {
  height: 0.5rem;
  width: 0.5rem;
  position: absolute;
  right: 0.5rem;
  top: 0.25rem;
  padding: 0;
  background: linear-gradient(to right, #00A2B9, #35B971);
  border-radius: 9999px;
}
```

### Sidebar Navigation

#### Sidebar Container

```css
.sidebar-pln {
  width: 14rem; /* 224px / w-56 */
  background: linear-gradient(to bottom, white, rgba(0, 162, 185, 0.05), rgba(53, 185, 113, 0.1));
  border-right: 1px solid rgba(0, 162, 185, 0.2);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Dark mode */
.dark .sidebar-pln {
  background: linear-gradient(to bottom, rgb(17, 24, 39), rgba(0, 162, 185, 0.1), rgba(53, 185, 113, 0.2));
}
```

#### Sidebar Section Headers with Vertical Accent

```jsx
<div className='flex items-center gap-2 mb-2'>
  <div className='w-1 h-4 bg-gradient-to-b from-[#00A2B9] to-[#35B971] rounded-full'></div>
  <h5 className='text-sm font-semibold text-[#035B71] dark:text-[#00AFF0] mb-0'>Section Title</h5>
</div>
```

#### Sidebar Menu Items

```css
.sidebar-item-pln {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.625rem 0.75rem; /* py-2.5 px-3 */
  font-size: 0.875rem;
  border-radius: 0.5rem; /* rounded-lg */
  transition: all 0.3s ease;
  color: #475569;
}

.sidebar-item-pln:hover {
  background: linear-gradient(to right, rgba(0, 162, 185, 0.1), rgba(3, 91, 113, 0.1));
  color: #00A2B9;
}

.sidebar-item-pln.active {
  background: linear-gradient(to right, rgba(0, 162, 185, 0.15), rgba(3, 91, 113, 0.15));
  color: #035B71;
  font-weight: 600;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Dark mode */
.dark .sidebar-item-pln {
  color: rgb(209, 213, 219);
}

.dark .sidebar-item-pln.active {
  color: #00AFF0;
}
```

#### Sidebar Divider

```css
.sidebar-divider-pln {
  height: 1px;
  width: 100%;
  background: linear-gradient(to right, transparent, rgba(0, 162, 185, 0.3), transparent);
  margin: 0.5rem 0;
}
```

#### Collapsed Sidebar Logo

```jsx
<div className='w-10 h-10 bg-gradient-to-br from-[#00A2B9] to-[#035B71] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
  <span className='text-white font-bold text-lg'>LP</span>
</div>
```

### Hero Sections

```css
.hero-pln {
  background: linear-gradient(135deg, #ffff00 0%, #35b971 50%, #00aff0 100%);
  position: relative;
  overflow: hidden;
}

.hero-pln::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
}

.hero-pln-text {
  color: #035b71;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### Section Headers

```css
.section-header-pln {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header-pln h2 {
  color: #035b71;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
}

.section-header-pln .icon {
  color: #00a2b9;
  margin-right: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
}
```

### Filter Sections

```css
.filter-section-pln {
  background: linear-gradient(135deg, rgba(0, 162, 185, 0.03), rgba(53, 185, 113, 0.03));
  border: 1px solid rgba(0, 162, 185, 0.1);
  border-radius: 1rem;
  padding: 2rem;
}

.filter-label-pln {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.75rem;
}

.filter-label-pln .icon {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}
```

## 📱 Responsive Guidelines

### Breakpoints

```css
/* Mobile First Approach */
.container-pln {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container-pln {
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container-pln {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
}

/* Large Desktop */
@media (min-width: 1536px) {
  .container-pln {
    max-width: 1400px;
  }
}
```

## 🎭 Animation Guidelines

### Standard Transitions

```css
.transition-pln {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-pln-slow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Hover Effects

```css
.hover-lift-pln {
  transition: transform 0.3s ease;
}

.hover-lift-pln:hover {
  transform: translateY(-2px);
}

.hover-scale-pln {
  transition: transform 0.3s ease;
}

.hover-scale-pln:hover {
  transform: scale(1.05);
}
```

### Loading States

```css
.loading-spinner-pln {
  border: 3px solid #e2e8f0;
  border-top: 3px solid #00a2b9;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin-pln 1s linear infinite;
}

@keyframes spin-pln {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

## 🎨 Utility Classes for Tailwind CSS

```css
/* PLN Custom Colors for Tailwind */
.text-pln-primary {
  color: #00a2b9;
}
.text-pln-dark {
  color: #035b71;
}
.text-pln-green {
  color: #35b971;
}
.text-pln-light-blue {
  color: #00aff0;
}
.text-pln-yellow {
  color: #ffff00;
}

.bg-pln-primary {
  background-color: #00a2b9;
}
.bg-pln-dark {
  background-color: #035b71;
}
.bg-pln-green {
  background-color: #35b971;
}
.bg-pln-light-blue {
  background-color: #00aff0;
}
.bg-pln-yellow {
  background-color: #ffff00;
}

.border-pln-primary {
  border-color: #00a2b9;
}
.border-pln-dark {
  border-color: #035b71;
}
.border-pln-green {
  border-color: #35b971;
}
.border-pln-light-blue {
  border-color: #00aff0;
}

.bg-gradient-pln-primary {
  background: linear-gradient(135deg, #00a2b9, #035b71);
}

.bg-gradient-pln-hero {
  background: linear-gradient(135deg, #ffff00 0%, #35b971 50%, #00aff0 100%);
}
```

## 📊 Data Display Patterns

### List/Main View Pages

#### Page Background

```css
.page-background-pln {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(255, 255, 0, 0.03), rgba(53, 185, 113, 0.03));
}
```

```jsx
<div className='min-h-screen' style={{ background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.03), rgba(53, 185, 113, 0.03))' }}>
  {/* Page content */}
</div>
```

#### Page Header Section

```jsx
<div className='bg-white border-b border-gray-200 px-6 py-4 mb-6'>
  <div className='flex items-center justify-between'>
    <div>
      <h1 className='text-2xl font-bold' style={{ color: '#035B71' }}>
        Page Title
      </h1>
      <p className='text-sm text-gray-600 mt-1'>
        Page description or subtitle
      </p>
    </div>
    <div className='flex items-center space-x-3'>
      {/* Action buttons */}
    </div>
  </div>
</div>
```

#### View Mode Toggle (Card/Table)

```jsx
<div className='flex items-center gap-2 border border-gray-300 rounded-xl p-1'>
  <Button
    variant={viewMode === 'card' ? 'default' : 'ghost'}
    size='sm'
    onClick={() => setViewMode('card')}
    className={`rounded-lg ${viewMode === 'card' ? 'bg-gradient-to-r from-[#00A2B9] to-[#035B71] text-white' : ''}`}
  >
    <LayoutGrid className='h-4 w-4 mr-2' />
    Kartu
  </Button>
  <Button
    variant={viewMode === 'table' ? 'default' : 'ghost'}
    size='sm'
    onClick={() => setViewMode('table')}
    className={`rounded-lg ${viewMode === 'table' ? 'bg-gradient-to-r from-[#00A2B9] to-[#035B71] text-white' : ''}`}
  >
    <Table2 className='h-4 w-4 mr-2' />
    Tabel
  </Button>
</div>
```

#### Statistics Cards

```jsx
<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
  <Card className='hover:shadow-lg transition-all duration-300'>
    <CardContent className='p-4'>
      <div className='flex items-center space-x-2'>
        <FileText className='h-5 w-5' style={{ color: '#00A2B9' }} />
        <div>
          <p className='text-sm font-medium text-gray-600'>Metric Label</p>
          <p className='text-2xl font-bold text-gray-900'>123</p>
        </div>
      </div>
    </CardContent>
  </Card>
  {/* Repeat with different colors: #35B971, #00AFF0, #035B71 */}
</div>
```

#### Filter Section

```jsx
<Card
  className='mb-6 border-2 hover:shadow-lg transition-all duration-300'
  style={{ borderColor: 'rgba(0, 162, 185, 0.1)' }}
>
  <CardHeader>
    <CardTitle className='text-lg flex items-center gap-2'>
      <Filter style={{ color: '#00A2B9' }} className='h-5 w-5' />
      Filter & Pencarian
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {/* Search input */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
        <Input
          placeholder='Cari...'
          className='pl-10 border-2 focus:border-[#00A2B9] rounded-xl'
        />
      </div>

      {/* Filter dropdowns */}
      <Select>
        <SelectTrigger className='w-full border-2 focus:border-[#00A2B9] rounded-xl'>
          <SelectValue placeholder='Pilih...' />
        </SelectTrigger>
        <SelectContent>{/* Options */}</SelectContent>
      </Select>
    </div>
  </CardContent>
</Card>
```

#### Data Card (for Card View)

```jsx
<Card
  className='group hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 hover:border-[#00A2B9]/50 rounded-2xl overflow-hidden hover:scale-105'
>
  <div style={{ background: 'linear-gradient(135deg, rgba(0, 162, 185, 0.05), rgba(53, 185, 113, 0.05))' }}>
    <CardHeader className='pb-4'>
      <CardTitle className='text-lg leading-tight font-bold' style={{ color: '#035B71' }}>
        Item Title
      </CardTitle>
      <CardDescription className='space-y-2'>
        <Badge
          variant='outline'
          className='text-xs font-semibold px-3 py-1 rounded-full'
          style={{ borderColor: '#00A2B9', color: '#00A2B9' }}
        >
          Category
        </Badge>
      </CardDescription>
    </CardHeader>

    <CardContent className='space-y-4'>
      <div className='space-y-3'>
        <div className='flex items-start text-sm text-gray-600'>
          <Building2 className='h-4 w-4 mr-2 mt-0.5 flex-shrink-0' style={{ color: '#35B971' }} />
          <span className='line-clamp-2'>Information text</span>
        </div>
      </div>

      <div className='flex gap-2 pt-2'>
        <Button
          asChild
          size='sm'
          className='flex-1 h-10 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105'
          style={{ background: 'linear-gradient(135deg, #00A2B9, #035B71)', color: 'white' }}
        >
          <Link href='/detail'>
            <Eye className='h-4 w-4 mr-2' />
            Lihat Detail
          </Link>
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='h-10 px-4 rounded-xl border-2 hover:bg-[#35B971] hover:text-white transition-all duration-300'
          style={{ borderColor: '#35B971', color: '#35B971' }}
        >
          <Download className='h-4 w-4' />
        </Button>
      </div>
    </CardContent>
  </div>
</Card>
```

#### Data Table (for Table View)

```jsx
<Card className='border-2' style={{ borderColor: 'rgba(0, 162, 185, 0.1)' }}>
  <CardContent className='p-0'>
    <Table>
      <TableHeader>
        <TableRow className='bg-gradient-to-r from-[#00A2B9]/10 to-[#035B71]/10'>
          <TableHead className='font-bold' style={{ color: '#035B71' }}>
            Column 1
          </TableHead>
          <TableHead className='font-bold' style={{ color: '#035B71' }}>
            Column 2
          </TableHead>
          <TableHead className='font-bold text-center' style={{ color: '#035B71' }}>
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className='hover:bg-[#00A2B9]/5 transition-colors'>
          <TableCell className='font-medium'>Data 1</TableCell>
          <TableCell>Data 2</TableCell>
          <TableCell className='text-center'>
            <Button
              asChild
              size='sm'
              className='h-8 rounded-lg font-semibold'
              style={{ background: 'linear-gradient(135deg, #00A2B9, #035B71)', color: 'white' }}
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

### Detail View Pages

#### Detail Page Header

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
        <h1 className='text-2xl font-bold' style={{ color: '#035B71' }}>
          Detail Title
        </h1>
        <p className='text-sm text-gray-600 mt-1'>Subtitle</p>
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

#### Information Cards Grid

```jsx
<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
  <Card className='hover:shadow-lg transition-all duration-300'>
    <CardContent className='p-4'>
      <div className='flex items-start space-x-2'>
        <Building2 className='h-5 w-5 mt-0.5' style={{ color: '#35B971' }} />
        <div>
          <p className='text-xs font-medium text-gray-600'>Label</p>
          <p className='text-sm font-bold text-gray-900 mt-1'>Value</p>
        </div>
      </div>
    </CardContent>
  </Card>
  {/* Repeat with different icons and colors */}
</div>
```

#### Tabbed Interface

```jsx
<Tabs defaultValue='tab1' className='w-full'>
  <TabsList className='grid w-full max-w-md grid-cols-2 mb-6 bg-gradient-to-r from-[#00A2B9]/10 to-[#035B71]/10 p-1 rounded-xl'>
    <TabsTrigger
      value='tab1'
      className='rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00A2B9] data-[state=active]:to-[#035B71] data-[state=active]:text-white font-semibold transition-all duration-300'
    >
      <Award className='h-4 w-4 mr-2' />
      Tab 1
    </TabsTrigger>
    <TabsTrigger
      value='tab2'
      className='rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00A2B9] data-[state=active]:to-[#035B71] data-[state=active]:text-white font-semibold transition-all duration-300'
    >
      <Target className='h-4 w-4 mr-2' />
      Tab 2
    </TabsTrigger>
  </TabsList>

  <TabsContent value='tab1'>{/* Content */}</TabsContent>
  <TabsContent value='tab2'>{/* Content */}</TabsContent>
</Tabs>
```

#### Section Card with Icon Header

```jsx
<Card className='border-2' style={{ borderColor: 'rgba(0, 162, 185, 0.2)' }}>
  <CardHeader>
    <CardTitle className='flex items-center gap-2' style={{ color: '#035B71' }}>
      <Lightbulb className='h-5 w-5' style={{ color: '#00A2B9' }} />
      Section Title
    </CardTitle>
  </CardHeader>
  <CardContent className='space-y-6'>
    {/* Section content */}
  </CardContent>
</Card>
```

#### Item Grid with Primary Highlighting

```jsx
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
  {items.map((item, idx) => (
    <div
      key={idx}
      className='p-3 rounded-xl border-2 hover:shadow-md transition-all duration-300'
      style={{
        background: item.isPrimary
          ? 'linear-gradient(135deg, rgba(0, 162, 185, 0.1), rgba(53, 185, 113, 0.1))'
          : 'white',
        borderColor: item.isPrimary ? '#00A2B9' : '#E5E7EB',
      }}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='font-semibold text-sm' style={{ color: '#035B71' }}>
            {item.name}
          </p>
          <p className='text-xs text-gray-500 mt-1'>{item.code}</p>
        </div>
        {item.isPrimary && (
          <Badge
            variant='outline'
            className='ml-2 text-xs px-2 py-0.5'
            style={{ borderColor: '#00A2B9', color: '#00A2B9', fontWeight: '600' }}
          >
            Primary
          </Badge>
        )}
      </div>
    </div>
  ))}
</div>
```

#### Level Badges (for Competency Levels)

```jsx
// Helper function for level colors
const getLevelBadgeColor = (level: number) => {
  switch (level) {
    case 1: return 'bg-blue-100 text-blue-800 border-blue-300';
    case 2: return 'bg-green-100 text-green-800 border-green-300';
    case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 4: return 'bg-orange-100 text-orange-800 border-orange-300';
    case 5: return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Usage
<Badge className={`text-xs px-3 py-1 ${getLevelBadgeColor(competency.level)}`}>
  Level {competency.level}
</Badge>
```

#### Numbered Task List

```jsx
<div className='space-y-3'>
  {tasks.map((task, idx) => (
    <div
      key={idx}
      className='p-4 rounded-xl border-2 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-[#35B971]/5'
      style={{ borderColor: '#35B971' }}
    >
      <div className='flex gap-3'>
        <div
          className='flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white'
          style={{ background: 'linear-gradient(135deg, #00A2B9, #035B71)' }}
        >
          {task.code}
        </div>
        <p className='text-sm text-gray-800 leading-relaxed flex-1'>{task.description}</p>
      </div>
    </div>
  ))}
</div>
```

#### Information Highlight Box

```jsx
<div className='p-4 rounded-xl bg-gradient-to-r from-[#00AFF0]/5 to-[#00A2B9]/5'>
  <p className='font-semibold text-sm mb-2' style={{ color: '#035B71' }}>
    Label
  </p>
  <p className='text-sm text-gray-700'>Information content</p>
</div>
```

#### Large Information Panel

```jsx
<div className='p-4 rounded-xl bg-gradient-to-r from-[#00A2B9]/10 to-[#035B71]/10'>
  <p className='text-sm text-gray-800 leading-relaxed'>
    Long form content or description text
  </p>
</div>
```

## 📋 Usage Examples

### Page Hero

```jsx
<div className='relative overflow-hidden bg-gradient-to-br from-[#FFFF00] via-[#35B971] to-[#00AFF0] mb-8'>
  <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>
  <div className='relative container mx-auto px-6 py-12'>
    <h1 className='text-4xl md:text-5xl font-bold text-[#035B71] mb-4 drop-shadow-lg'>Page Title</h1>
  </div>
</div>
```

### Primary Button

```jsx
<Button className='h-12 px-8 bg-gradient-to-r from-[#00A2B9] to-[#035B71] hover:from-[#035B71] hover:to-[#00A2B9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
  Action Button
</Button>
```

### Premium Card

```jsx
<Card className='group overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:border-[#00A2B9]/50'>
  <div className='bg-gradient-to-br from-[#00A2B9]/5 via-[#35B971]/5 to-[#00AFF0]/5 p-6'>{/* Card Content */}</div>
</Card>
```

## 🚨 Important Notes

1. **Avoid Red Colors**: As per PLN guidelines, red colors should not be used in the primary palette
2. **Accessibility**: Ensure sufficient color contrast for text readability
3. **Consistency**: Always use the defined color variables rather than hardcoded values
4. **Performance**: Use CSS custom properties for better maintainability
5. **Dark Mode**: Provide appropriate dark mode variants for all components

## 🔄 Updates

- **Version 1.0**: Initial PLN theme guidelines established
- **Version 1.1** (Current): Added comprehensive Data Display Patterns section
  - List/Main View Pages patterns (page backgrounds, headers, view toggles, statistics cards, filter sections, data cards, data tables)
  - Detail View Pages patterns (detail headers, information cards grid, tabbed interface, section cards, item grids with highlighting, level badges, numbered task lists, information panels)
  - Real-world examples from KKJ-Tupoksi implementation
- Future updates will be documented here as the design system evolves

---

_This theme guide ensures consistent PLN branding across the PLN NUSANTARA POWER Learning Path Platform while maintaining modern design principles and excellent user experience._
