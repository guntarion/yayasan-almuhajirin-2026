---
name: creating-printable-a4-documents
description: Create print-ready A4 documents with proper dimensions, page breaks, and decorative elements. Works with Next.js/React or plain HTML/CSS. Use when user needs printable proposals, letters, reports, or certificates.
---

# Creating Printable A4 Documents

Create professional print-ready documents with A4 dimensions (210mm x 297mm), automatic page breaks, and decorative color accents.

## Quick Start

1. Use `.a4-page` class with 210mm width, 297mm min-height
2. Add `@media print` styles for clean output
3. Use `page-break-after: always` between pages
4. Add `print:hidden` to elements that shouldn't print

**For detailed documentation**, see [reference.md](./reference.md)
**For HTML template**, see [templates/template.html](./templates/template.html)
**For React/Next.js template**, see [templates/template-nextjs.tsx](./templates/template-nextjs.tsx)
**For theme/colors**, see [themes/theme-guide-almuhajirin.md](./themes/theme-guide-almuhajirin.md)
