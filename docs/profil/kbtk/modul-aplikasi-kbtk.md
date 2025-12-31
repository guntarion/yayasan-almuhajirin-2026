Di KBTK, aplikasi administratif yang baik harus menjawab **3 kebutuhan utama**:

1. **Data siswa & orang tua rapi**
2. **Alur pendaftaran dan pembayaran jelas**
3. **Admin tidak repot menghitung dan menagih**

Berikut rekomendasi fitur **yang menurut saya perlu dan layak**, saya sertai opini tegas mana yang *wajib* dan mana yang *opsional tapi bernilai*.

------

## 1. Modul Data Siswa (Wajib)

Fondasi semua proses.

**Data identitas siswa**

- Nomor induk siswa (auto)
- Nama lengkap
- Nama panggilan
- Jenis kelamin
- Tanggal lahir (auto umur)
- Kelompok:
  - KB A / KB B
  - TK A / TK B
- Tahun ajaran
- Tanggal mulai masuk
- Status siswa:
  - Aktif
  - Cuti
  - Lulus
  - Keluar

**Data pendukung**

- Catatan khusus (alergi, kebutuhan khusus)
- Foto siswa (opsional)

👉 **Opini saya:**
Status siswa *harus ada*. Banyak sekolah kecil kesulitan laporan karena siswa lama tidak diberi status yang jelas.

------

## 2. Modul Data Orang Tua / Wali (Wajib)

Relasi **1 siswa – 1 atau 2 wali**.

**Data ayah & ibu / wali**

- Nama
- Hubungan dengan siswa
- Nomor HP (WA aktif)
- Email (opsional)
- Pekerjaan (opsional)
- Alamat (default ikut siswa, bisa beda)

👉 **Best practice:**
Nomor HP sebaiknya bisa lebih dari satu (ayah & ibu), karena penagihan sering tidak ke satu orang saja.

------

## 3. Modul Pendaftaran Siswa Baru (Wajib)

Ini sering dilakukan manual → padahal **sangat cocok didigitalisasi**.

**Data pendaftaran**

- Tahun ajaran
- Tanggal daftar
- Jenis program:
  - KB / TK
- Status pendaftaran:
  - Daftar
  - Diterima
  - Batal

**Biaya pendaftaran**

- Total uang pendaftaran
- Skema pembayaran:
  - Lunas
  - Angsuran
- Status:
  - Belum lunas
  - Lunas

👉 **Opini tegas:**
Pisahkan **pendaftaran** dan **siswa aktif**. Banyak KBTK mencampur, akhirnya data kacau.

------

## 4. Modul Pembayaran Uang Pendaftaran (Cicilan) (Wajib)

Karena Guntar secara eksplisit menyebut ini, maka **harus rapi**.

**Fitur utama**

- Total biaya pendaftaran
- Termin angsuran:
  - Tanggal
  - Nominal
- Riwayat pembayaran
- Sisa tagihan (auto-calc)
- Status:
  - Belum lunas
  - Lunas

👉 **Catatan penting:**
Jangan hanya simpan “sudah bayar sekian”. **Simpan setiap transaksi** agar transparan.

------

## 5. Modul SPP Bulanan (Wajib)

Ini jantung administrasi bulanan.

**Pengaturan SPP**

- Nominal SPP per kelompok (KB/TK)
- Bisa berbeda per siswa (diskon/beasiswa)

**Tagihan bulanan**

- Bulan & tahun
- Nominal
- Status:
  - Belum bayar
  - Bayar sebagian
  - Lunas
- Tanggal bayar

**Penunggakan**

- Otomatis terdeteksi bila lewat bulan
- Total tunggakan per siswa
- Flag visual (misal: merah)

👉 **penting:**
SPP **berbasis tagihan bulanan**, bukan sekadar catatan pembayaran. Ini yang membuat laporan dan penagihan jadi mudah.

------

## 6. Modul Riwayat Pembayaran Siswa (Wajib)

Saat orang tua bertanya: *“Saya sudah bayar apa saja?”*

- Daftar pembayaran:
  - Pendaftaran
  - Angsuran
  - SPP bulanan
- Total sudah dibayar
- Total tunggakan

👉 Fitur ini **mengurangi konflik dan debat** secara signifikan.

------

## 7. Modul Laporan Administratif (Wajib Minimal)

Tidak perlu kompleks, tapi harus ada.

**Laporan inti**

- Daftar siswa aktif per kelas
- Rekap SPP per bulan
- Daftar siswa menunggak
- Total pemasukan per periode
- Status pelunasan pendaftaran

👉 **Opini saya:**
Laporan PDF sederhana sudah cukup. Tidak perlu dashboard mahal.

------

## 8. Modul User & Hak Akses (Wajib)

Minimal:

- Admin
- Kepala sekolah (read-only laporan)
- Pihak yayasan Al Muhajirin

------

## 9. Fitur Tambahan (Opsional tapi Sangat Berguna)

Jika ingin naik kelas sedikit:

- Cetak kwitansi pembayaran
- Upload bukti transfer
- Reminder SPP via WA (kita buat template pesan saja)
- Catatan komunikasi orang tua

------

## Ringkasan Versi “KBTK Ideal tapi Sederhana”

**Wajib:**

- Data siswa
- Data orang tua
- Pendaftaran siswa
- Pembayaran uang pendaftaran (cicilan)
- SPP bulanan + tunggakan
- Riwayat pembayaran
- Laporan

**Opsional bernilai:**

- Kwitansi
- Reminder
- Upload bukti

------



Baik, Guntar.
Saya lanjutkan **secara teknis tapi tetap membumi**, dengan asumsi **KBTK kecil–menengah**, jumlah siswa puluhan sampai ratusan, dan target **mudah dipelihara + tidak over-engineered**.

Saya bagi dua bagian besar:

1. **Skema tabel database (sederhana & scalable)**
2. **Alur kerja admin 1 layar: daftar → bayar → laporan**

------

# 1. Skema Tabel Database (Sederhana & Scalable)

Prinsip desain saya:

- **Normalisasi secukupnya** (tidak terlalu flat, tidak terlalu rumit)
- Semua transaksi **immutable** (tidak dihapus, hanya ditambah)
- Mudah di-query untuk laporan

------

## A. `students` — Data Siswa

```text
students
- id (PK)
- student_number
- full_name
- nickname
- gender
- birth_date
- group_level        -- KB / TK
- group_class        -- A / B
- academic_year
- start_date
- status             -- active, graduated, inactive
- notes
- created_at
```

👉 **Catatan desain:**
`group_level` dan `group_class` dipisah agar fleksibel bila struktur kelas berubah.

------

## B. `parents` — Data Orang Tua / Wali

```text
parents
- id (PK)
- student_id (FK)
- name
- relation           -- ayah / ibu / wali
- phone
- email
- occupation
- address
```

👉 1 siswa bisa punya **lebih dari 1 wali** → penting untuk penagihan.

------

## C. `registrations` — Pendaftaran Siswa

Dipisah dari `students` agar **calon siswa ≠ siswa aktif**.

```text
registrations
- id (PK)
- student_id (FK)
- academic_year
- program            -- KB / TK
- registration_date
- registration_fee
- payment_scheme     -- lump_sum / installment
- status             -- pending, active, canceled
```

------

## D. `registration_payments` — Pembayaran Uang Pendaftaran

```text
registration_payments
- id (PK)
- registration_id (FK)
- payment_date
- amount
- payment_method     -- cash / transfer
- notes
- created_at
```

👉 **Best practice:**
Total dibayar = SUM(payments),
Sisa = `registration_fee - total_paid`.

------

## E. `spp_settings` — Setting SPP

Agar **tidak hardcode di siswa**.

```text
spp_settings
- id (PK)
- academic_year
- group_level
- monthly_fee
```

------

## F. `spp_bills` — Tagihan SPP Bulanan

Ini **kunci penunggakan otomatis**.

```text
spp_bills
- id (PK)
- student_id (FK)
- month
- year
- amount
- status             -- unpaid, partial, paid
```

👉 Tagihan **dibuat per bulan**, bukan saat bayar.

------

## G. `spp_payments` — Pembayaran SPP

```text
spp_payments
- id (PK)
- spp_bill_id (FK)
- payment_date
- amount
- payment_method
- notes
- created_at
```

------

## H. `users` — Admin & Kepala Sekolah

```text
users
- id (PK)
- name
- email
- role              -- admin / headmaster
- password_hash
```

------

### 📌 Relasi Inti (ringkas)

- students → parents (1:M)
- students → registrations (1:1)
- registrations → registration_payments (1:M)
- students → spp_bills (1:M)
- spp_bills → spp_payments (1:M)

------

# 2. Alur Admin 1 Layar (Daftar → Bayar → Laporan)

Tujuan alur ini:

- **Admin tidak bolak-balik menu**
- Semua kerja harian bisa dari **1 halaman utama**

------

## A. Layar Utama: “Manajemen Siswa & Pembayaran”

### Bagian 1 — Cari / Pilih Siswa

- Search:
  - Nama siswa
  - Nomor induk
- Filter:
  - Kelas
  - Status (aktif / menunggak)

📌 Klik satu siswa → **panel kanan terbuka**

------

## B. Panel Siswa (Sidebar / Drawer)

### Tab 1 — Profil Singkat

- Nama & kelas
- Orang tua + nomor HP
- Status pendaftaran
- Ringkasan:
  - SPP bulan ini: ✔ / ❌
  - Total tunggakan

------

### Tab 2 — Pendaftaran & Uang Masuk Awal

Jika belum lunas:

- Total uang pendaftaran
- Sudah dibayar
- Sisa

**Form input cepat**

- Tanggal
- Nominal
- Metode
- [Simpan]

👉 Setelah lunas → status otomatis **“Aktif”**

------

### Tab 3 — SPP Bulanan

Tampilan tabel kecil:

| Bulan | Nominal | Status | Aksi  |
| ----- | ------- | ------ | ----- |
| Jan   | 300k    | Lunas  | —     |
| Feb   | 300k    | Belum  | Bayar |

Klik **Bayar**:

- Input nominal
- Bisa parsial
- Simpan

👉 Status otomatis:

- Partial → Paid

------

### Tab 4 — Riwayat Pembayaran

Gabungan:

- Uang pendaftaran
- Angsuran
- SPP

➡️ Bisa cetak / export

------

## C. Laporan (Masih di Layar yang Sama)

Bagian bawah / tab khusus:

**Quick Reports**

- Total pemasukan bulan ini
- Jumlah siswa menunggak
- Total tunggakan
- Pelunasan pendaftaran

📌 Klik angka → drill-down daftar siswa

------

# Pendapat Profesional Saya (Penting)

1. **Pisahkan tagihan dan pembayaran** → sistem jadi tahan lama
2. Jangan langsung bikin notifikasi otomatis → **manual dulu**
3. Admin sekolah **lebih butuh kejelasan**, bukan grafik cantik
4. Skema ini **cukup untuk 5–10 tahun** tanpa redesign besar

------

