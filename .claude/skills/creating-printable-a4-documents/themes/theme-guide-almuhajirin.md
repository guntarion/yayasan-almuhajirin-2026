# Al Muhajirin Theme Guide - Default Theme for A4 Documents

This theme guide provides the color palette and styling patterns used in the A4 document templates.

## Color Palette

### Primary Colors (from Logo)

```css
--am-primary-cyan: #00BCD4        /* Main color - Bright Cyan */
--am-dark-teal: #006064           /* Dark teal for text/accents */
--am-medium-teal: #00838F         /* Medium teal for variation */
--am-light-cyan: #80DEEA          /* Light cyan for highlights */
--am-very-light-cyan: #B2EBF2     /* Subtle background */
```

### Usage in A4 Documents

#### Cover Page (Page 1)
- **Top/Bottom Bars**: `linear-gradient(to right, #00BCD4, #006064, #00BCD4)`
- **Main Title**: `#006064` (dark teal)
- **Subtitle**: `#00BCD4` (primary cyan)
- **Title Box**: `linear-gradient(to right, #006064, #00838F)`
- **Decorative Blobs**: `#B2EBF2`, `#80DEEA`, `#00BCD4`, `#006064` with 15-40% opacity

#### Content Pages (Pages 2-4)
- **Section Header Bar**: `linear-gradient(to bottom, #00BCD4, #006064)`
- **Section Title**: `#006064`
- **Border Accents**: `#B2EBF2`
- **Decorative Blobs**: Same colors with 10-20% opacity (more subtle)

#### Text Colors
- **Primary Text**: `#006064` (headings, important text)
- **Secondary Text**: `#00838F` (subheadings)
- **Accent Text**: `#00BCD4` (highlights, links)
- **Body Text**: `gray-700` (#374151)

### Tailwind CSS Classes

```html
<!-- Primary gradient button -->
<button class="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white">

<!-- Section header with accent bar -->
<div class="flex items-center gap-3 border-b-2 border-[#B2EBF2]">
  <div class="w-1.5 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full"></div>
  <h2 class="text-2xl font-bold text-[#006064]">Title</h2>
</div>

<!-- Decorative blur element (cover page) -->
<div class="absolute top-16 right-0 w-48 h-48 bg-[#B2EBF2] rounded-full opacity-40 blur-3xl"></div>

<!-- Decorative blur element (content page - more subtle) -->
<div class="absolute top-0 right-0 w-40 h-40 bg-[#B2EBF2] rounded-full opacity-15 blur-3xl"></div>

<!-- Badge/pill -->
<div class="bg-gradient-to-r from-[#B2EBF2] to-[#80DEEA] px-6 py-2 rounded-full">
  <span class="text-[#006064] font-semibold">Badge Text</span>
</div>

<!-- Info box -->
<div class="bg-[#F8FAFC] rounded-2xl p-6 border border-[#B2EBF2]">
  <h3 class="text-[#006064] font-bold">Title</h3>
</div>
```

### Bank/Account Info Styling

```html
<!-- Bank BRI styling -->
<span class="text-sm font-semibold text-white bg-[#0066AE] px-3 py-1 rounded-full">Bank BRI</span>

<!-- Account number -->
<p class="text-3xl font-bold text-[#006064] tracking-wider">0211.01.004869.53.6</p>
```

### Signature Section

```html
<div class="border-t-2 border-[#B2EBF2] pt-6">
  <div class="grid grid-cols-2 gap-8">
    <div class="text-center">
      <p class="text-sm text-gray-600 mb-16">Position<br/>Organization</p>
      <p class="font-bold text-[#006064] border-t border-gray-300 pt-2">NAME</p>
    </div>
  </div>
</div>
```

## Adapting to Other Themes

To use a different color scheme:

1. Replace the primary colors:
   - `#00BCD4` → Your primary accent color
   - `#006064` → Your dark variant
   - `#00838F` → Your medium variant
   - `#80DEEA` → Your light variant
   - `#B2EBF2` → Your very light/background variant

2. Keep the same opacity and blur values for decorative elements

3. Maintain contrast ratios for readability:
   - Dark colors for text on light backgrounds
   - Light/white text on dark gradient backgrounds
