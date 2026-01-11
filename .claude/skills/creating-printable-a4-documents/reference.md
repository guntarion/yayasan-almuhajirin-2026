# Creating Printable A4 Documents - Reference Guide

## Table of Contents

1. [When to Use This Skill](#when-to-use-this-skill)
2. [A4 Dimensions](#a4-dimensions)
3. [Core CSS Structure](#core-css-structure)
4. [Print-Specific Styles](#print-specific-styles)
5. [Page Breaks](#page-breaks)
6. [Decorative Elements](#decorative-elements)
7. [Hiding Elements When Printing](#hiding-elements-when-printing)
8. [Best Practices](#best-practices)
9. [Examples](#examples)
10. [Theme Guide](#theme-guide)
11. [Troubleshooting](#troubleshooting)

## When to Use This Skill

Use this skill when creating:
- Formal proposals and donation requests
- Official letters with letterhead
- Certificates and awards
- Reports and documentation
- Invoices and receipts
- Any document intended for physical printing

## A4 Dimensions

**Standard A4 size:**
- Width: 210mm (8.27 inches)
- Height: 297mm (11.69 inches)

**Recommended padding:**
- Standard: 15-20mm on all sides
- Formal letters: 20-25mm on all sides

```css
.a4-page {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm 20mm;
  margin: 0 auto;
  background: white;
  box-sizing: border-box;
}
```

## Core CSS Structure

### Basic Setup

```css
/* Container for each A4 page */
.a4-page {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm 20mm;
  margin: 0 auto;
  background: white;
  box-sizing: border-box;
}

/* Screen-only styles (shadow for visual separation) */
@media screen {
  .a4-page {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
}
```

### For Formal Letters (wider margins)

```css
.a4-page-letter {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm 25mm;
  margin: 0 auto;
  background: white;
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
}
```

## Print-Specific Styles

### Essential Print Media Query

```css
@media print {
  /* Set page size */
  @page {
    size: A4;
    margin: 0;
  }

  /* Preserve colors */
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Hide non-printable elements */
  .no-print {
    display: none !important;
  }

  /* Page breaks */
  .page-break {
    page-break-after: always;
  }

  /* Ensure content fills page */
  main {
    padding: 0 !important;
    margin: 0 !important;
  }
}
```

### Tailwind CSS Print Utilities

When using Tailwind CSS:
- `print:hidden` - Hide element when printing
- `print:block` - Show element only when printing
- `print:bg-white` - Set background to white when printing

## Page Breaks

### Between Pages

Add `page-break` class to all pages except the last:

```html
<div class="a4-page page-break">
  <!-- Page 1 content -->
</div>
<div class="a4-page page-break">
  <!-- Page 2 content -->
</div>
<div class="a4-page">
  <!-- Last page (no page-break) -->
</div>
```

### Avoiding Breaks Inside Elements

```css
.no-break-inside {
  page-break-inside: avoid;
}
```

## Decorative Elements

### Blur Color Spots

Create soft color accents with blur effects:

```html
<!-- Container must be relative with overflow hidden -->
<div class="a4-page relative overflow-hidden">
  <!-- Decorative elements (absolute positioned) -->
  <div class="absolute top-16 right-0 w-48 h-48 bg-[#B2EBF2] rounded-full opacity-40 blur-3xl"></div>
  <div class="absolute bottom-20 left-0 w-56 h-56 bg-[#80DEEA] rounded-full opacity-40 blur-3xl"></div>

  <!-- Content (relative z-10 to appear above decorations) -->
  <div class="relative z-10">
    <!-- Your content here -->
  </div>
</div>
```

### Opacity Guidelines

- **Cover pages:** opacity 25-40% (more visible)
- **Content pages:** opacity 10-20% (subtle, doesn't distract from text)

### Gradient Lines

```html
<!-- Top border -->
<div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#00BCD4] via-[#006064] to-[#00BCD4]"></div>

<!-- Bottom border -->
<div class="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#00BCD4] via-[#006064] to-[#00BCD4]"></div>

<!-- Vertical accent line -->
<div class="absolute top-40 left-0 w-1 h-32 bg-gradient-to-b from-[#00BCD4]/40 to-transparent"></div>
```

## Hiding Elements When Printing

### Method 1: CSS Class

```html
<div class="no-print">
  <!-- This won't print -->
  <button onclick="window.print()">Print</button>
</div>
```

### Method 2: Tailwind print:hidden

```html
<div class="print:hidden">
  <!-- This won't print -->
  <nav>Navigation bar</nav>
</div>
```

### Method 3: Component-Level (React/Next.js)

Add `print:hidden` to navbar and footer components:

```tsx
// Navbar.tsx
<nav className="sticky top-0 z-50 print:hidden">
  {/* ... */}
</nav>

// Footer.tsx
<footer className="bg-gradient-to-br from-gray-900 print:hidden">
  {/* ... */}
</footer>
```

## Best Practices

### Content Layout

1. **Use flexbox for vertical centering:**
   ```html
   <div class="a4-page flex flex-col">
     <header><!-- Header --></header>
     <main class="flex-1 flex flex-col justify-center">
       <!-- Centered content -->
     </main>
     <footer><!-- Footer --></footer>
   </div>
   ```

2. **Keep signatures at bottom:**
   ```html
   <div class="border-t-2 pt-6 mt-auto">
     <!-- Signature section -->
   </div>
   ```

3. **Use z-index for layering:**
   - Decorative elements: default (z-0)
   - Content: `relative z-10`

### Typography

1. **Formal documents:** Use serif fonts (Times New Roman)
2. **Modern proposals:** Use sans-serif fonts (default system fonts)
3. **Headings:** Use color from your theme palette

### Colors for Print

1. Ensure sufficient contrast
2. Avoid very light colors for text
3. Use solid backgrounds for important elements
4. Test with both color and B&W printing

## Examples

### Cover Page Structure

```html
<div class="a4-page page-break relative overflow-hidden">
  <!-- Decorative elements -->
  <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary via-dark to-primary"></div>
  <div class="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-primary via-dark to-primary"></div>
  <div class="absolute top-20 right-0 w-40 h-40 bg-accent rounded-full opacity-30 blur-3xl"></div>

  <div class="relative z-10 h-full flex flex-col">
    <!-- Logo -->
    <div class="text-center pt-8">
      <img src="logo.png" alt="Logo" class="w-24 h-24 mx-auto" />
    </div>

    <!-- Title (centered) -->
    <div class="flex-1 flex flex-col justify-center text-center">
      <h1 class="text-4xl font-bold">Document Title</h1>
      <h2 class="text-2xl mt-4">Subtitle</h2>
    </div>

    <!-- Footer info -->
    <div class="text-center pb-8">
      <p>Organization Name</p>
      <p>Address</p>
    </div>
  </div>
</div>
```

### Content Page Structure

```html
<div class="a4-page page-break relative overflow-hidden">
  <!-- Subtle decorations -->
  <div class="absolute top-0 right-0 w-40 h-40 bg-accent rounded-full opacity-15 blur-3xl"></div>

  <div class="relative z-10">
    <!-- Section header -->
    <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-accent">
      <div class="w-1.5 h-8 bg-gradient-to-b from-primary to-dark rounded-full"></div>
      <h2 class="text-2xl font-bold">Section Title</h2>
    </div>

    <!-- Content -->
    <div class="space-y-4">
      <p>Your content here...</p>
    </div>
  </div>
</div>
```

### Formal Letter Structure

```html
<div class="a4-page-letter">
  <!-- Letterhead -->
  <div class="flex items-start gap-4 pb-4 border-b-2 border-primary mb-6">
    <img src="logo.png" alt="Logo" class="w-20 h-20" />
    <div>
      <h1 class="text-xl font-bold">Organization Name</h1>
      <p>Address Line 1</p>
      <p>Phone, Email</p>
    </div>
  </div>

  <!-- Letter number -->
  <table class="mb-6 text-sm">
    <tr><td class="font-semibold pr-4">Nomor</td><td>: 001/ORG/I/2026</td></tr>
    <tr><td class="font-semibold pr-4">Lampiran</td><td>: 1 berkas</td></tr>
    <tr><td class="font-semibold pr-4">Perihal</td><td>: Subject</td></tr>
  </table>

  <!-- Recipient -->
  <div class="mb-6">
    <p>Kepada Yth.</p>
    <p class="font-semibold">Recipient Name</p>
    <p>di Tempat</p>
  </div>

  <!-- Body -->
  <div class="space-y-4 text-justify">
    <p>Assalamu'alaikum warahmatullahi wabarakatuh,</p>
    <p>Letter content...</p>
    <p>Wassalamu'alaikum warahmatullahi wabarakatuh.</p>
  </div>

  <!-- Signature -->
  <div class="mt-8 grid grid-cols-2 gap-8">
    <div class="text-center">
      <p class="mb-20">Position 1</p>
      <p class="font-bold border-t pt-2">Name 1</p>
    </div>
    <div class="text-center">
      <p class="mb-20">Position 2</p>
      <p class="font-bold border-t pt-2">Name 2</p>
    </div>
  </div>
</div>
```

## Theme Guide

This skill includes a default theme based on the Al Muhajirin color palette. See [themes/theme-guide-almuhajirin.md](./themes/theme-guide-almuhajirin.md) for the complete color guide.

### Default Color Palette

```css
/* Primary Colors */
--primary-cyan: #00BCD4        /* Main accent color */
--dark-teal: #006064           /* Dark text/headings */
--medium-teal: #00838F         /* Secondary accent */
--light-cyan: #80DEEA          /* Highlights */
--very-light-cyan: #B2EBF2     /* Subtle backgrounds */
```

### Adapting Colors

To use a different theme, replace the hex color values throughout the template:

1. **Primary accent** (`#00BCD4`): Your main brand color
2. **Dark variant** (`#006064`): For headings and text
3. **Medium variant** (`#00838F`): For secondary elements
4. **Light variants** (`#80DEEA`, `#B2EBF2`): For backgrounds and decorations

### Color Usage by Element

| Element | Color | Usage |
|---------|-------|-------|
| Main Title | `#006064` | Cover page heading |
| Subtitle | `#00BCD4` | Cover page accent |
| Section Header | `#006064` | Content page headings |
| Border/Accent | `#B2EBF2` | Dividers and borders |
| Decorative Blur (Cover) | Mixed, 25-40% opacity | Background accents |
| Decorative Blur (Content) | Mixed, 10-20% opacity | Subtle backgrounds |

## Troubleshooting

### Colors Not Printing

**Problem:** Background colors don't appear in print

**Solution:** Add color-adjust properties:
```css
body {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

### Page Breaks Not Working

**Problem:** Content doesn't break at expected points

**Solution:** Ensure `page-break-after: always` is applied and container doesn't have `overflow: hidden` that might interfere.

### Header/Footer Still Showing

**Problem:** Website navigation appears when printing

**Solution:**
1. Add `print:hidden` to navbar/footer components
2. Or add CSS rule:
   ```css
   @media print {
     nav, header, footer {
       display: none !important;
     }
   }
   ```

### Content Overflows Page

**Problem:** Content extends beyond A4 bounds

**Solution:**
1. Check total height fits within 297mm - padding
2. Use `page-break-inside: avoid` for important blocks
3. Reduce font sizes or spacing if needed

### Blurry Print Output

**Problem:** Decorative blur effects look pixelated

**Solution:** Blur effects render differently in print. Use solid colors or gradients for print-critical decorations, or accept that blur is primarily for screen viewing.
