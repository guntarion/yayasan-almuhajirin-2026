## 2026-02-09 13:04:46

fix(masjid): add dynamic font sizing for certificate names

- Scale font size based on name length to prevent overflow
- Use flex column layout so registration number flows below name
- Add wordBreak safety net for extremely long names

---

## 2026-02-09 09:23:11

feat(masjid): implement phone-based certificate lookup with ready template

Implement digital certificate system for Run-Madan 2026 event with simplified
phone number search and ready-made certificate template.

Key changes:
- Replace BIB/registration number search with phone number lookup
- Add intelligent phone normalization (handles 0/62 prefix variants)
- Switch to ready-made certificate template (Sertifikat-Digital-Runmadan.jpg)
- Simplify certificate overlay to show only name and registration number
- Add prominent certificate announcement banner on Run-Madan event page
- Update certificate positioning for better name/number placement

API Changes:
- Certificate API now accepts phone parameter instead of bib/reg
- Implement normalizePhoneNumber() for flexible phone format matching
- Search registrants by phone with multiple format variants

Certificate Page:
- Single phone number input field with example format
- Uses ready template with minimal text overlay
- Name positioned at top: 310px with 48px font
- Registration number below at 385px with 20px bold font

Event Page:
- Add eye-catching emerald-teal gradient announcement banner
- Display "Terima Kasih Peserta Run-Madan 2026" message
- CTA button linking to certificate download page

---

## 2026-02-01 10:36:12

feat(masjid): add CSV export for tenant registrations

- Add new API endpoint at /api/event-tenant/tenants/export for CSV export
- Add Export CSV button in tenant tab (admin only)
- Export includes all tenant fields: registration number, tenant name, contact info, product types, electricity needs, payment status
- Matches existing CSV export functionality for running and senam participants

---

## 2026-01-31 15:01:26

feat(units): add poliklinik and ambulans profile pages with printable brochures

- Add comprehensive profile documents for Poliklinik and Ambulans units
- Create poliklinik printable A4 brochure (2 pages, front and back)
- Create ambulans unit pages (main page, layout, printable brochure)
- Add poliklinik images (cek-tekanan-darah, memberi-obat)
- Add QRIS images for LAZ donation
- Support large text for A5 printing
- Include donation info with Bank Muamalat and QRIS

---

## 2026-01-27 15:30:52

fix(masjid): correct BRI account number for Run-Madan event

Update BRI account number from 0211.01.004859.53.6 to 0211.01.004869.53.6
across all instances in Run-Madan event page including:
- Clipboard copy function
- Registration instructions
- Payment display sections

---

## 2026-01-27 12:15:24

fix(masjid): update Run-Madan registration price from Rp 100.000 to Rp 50.000

- Update API calculation to Rp 50.000 per participant
- Fix payment instruction text in registration steps
- Fix price display in participant form summary

The new open registration (without jersey) uses the Rp 50.000 pricing tier.

---

## 2026-01-26 13:52:01

feat(masjid): update Run-Madan registration with new pricing tiers

- Mark 3K Fun Run Rp 100k as SOLD OUT (quota habis) with greyed styling
- Add new 3K Fun Run Rp 50k option without jersey
- Set deadline: Sunday, February 1, 2026
- Update submit button to reflect Rp 50k pricing
- Update benefits section to show jersey exclusion for 50k package
- Fix nested JSX comment issue in Race Day Schedule section

---

## 2026-01-22 13:13:44

feat(masjid): add CSV export for Running event registration

- Create new API endpoint (/api/run-madan/registrants/export) to export all Running registrants and participants to CSV format
- Add handleExportRunningCSV() function to registration page
- Add "Export CSV" button to Running registrants list section with admin-only visibility
- CSV includes registration info (number, name, phone, email, address), payment status, and participant details
- Export file uses UTF-8 BOM for Excel compatibility with Indonesian localization
- Feature matches existing Senam registration CSV export functionality

---

## 2026-01-15 15:11:39

feat(masjid): add senam sehat registration system for Run-Madan 2026

---

## 2026-01-13 12:44:47

feat(tenant): add cleaning fee (infaq kebersihan) info to terms section

---

## 2026-01-13 11:04:15

chore(tenant): update WhatsApp contact number for tenant registration

---

## 2026-01-13 10:57:08

chore(tenant): hide Kebutuhan Listrik field from registration form

---

## 2026-01-13 10:48:32

fix: add prisma generate to build script for Vercel deployment

---

## 2026-01-12 20:02:46

feat(masjid): add tenant/stan registration form and management for Tarhib Ramadhan event

---

## 2026-01-12 17:44:34

feat(masjid): add Vercel Analytics event tracking for Run-Madan registration

---

## 2026-01-12 14:35:19

feat: add Facebook Pixel and Conversions API integration for tracking

---

## 2026-01-11 19:47:46

feat(masjid): add printable Ramadhan 1447H donation proposal with cover letter and reusable A4 document skill

---

## 2026-01-09 08:55:04

feat(masjid): add automatic BIB assignment and WhatsApp notification for Run-Madan registrations

---

## 2026-01-08 21:39:41

feat(masjid): add prominent Islamic dress code requirements for Run-Madan event

---

## 2026-01-08 20:15:33

feat(masjid): enhance Run-Madan page with mobile responsiveness and Vercel Analytics

---

## 2026-01-08 19:14:55

fix(masjid): update Run-Madan payment to BRI account and new QRIS image

---

## 2026-01-08 19:00:29

feat(masjid): add complete Run-Madan 2026 registration system with multi-participant support

---

## 2026-01-08 17:28:04

feat(masjid): update Run-Madan 2026 event with new schedule, pricing, and payment methods

---

## 2026-01-08 16:19:04

refactor(masjid): convert Run-Madan 2026 to single 3K category and emphasize edu run concept

---

