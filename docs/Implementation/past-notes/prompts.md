Proyek ini adalah untuk Yayasan Al Muhajirin yg terdiri dari beberapa unit 
Pelajari:
- CLAUDE.md
- src/middleware.ts
- src/app/units/README.md

Bantu saya mengimplementasikan modul untuk administratif Daycare Al Muhajirin.
Konsepnya adalah sebagai berikut: docs/profil/kbtk/modul-daycare.md
dan ini terkait dengan modul untuk KBTK docs/profil/kbtk/modul-aplikasi-kbtk.md yang sudah diimplementasikan docs/profil/kbtk/checklist-implementasi-kbtk.md dan docs/profil/kbtk/DOKUMENTASI-IMPLEMENTASI-KBTK.md

Anda dapat melakukan penyesuaian untuk Daycare seperlunya berdasarkan konteks project ini
Anda dapat membuat plan tambahan. Dan Anda wajib membuat file .md di docs/profil/kbtk/checklist-implementasi-daycare yg bertindak semacam checklist implementasi bagi Anda


Ini untuk diimplementasikan di src/app/units/daycare/kelola (diakses melalui daycare.localhost:3000/kelola) sehingga form dan fungsi diletakkan sebagai sub-folder darinya, semisal src/app/units/daycare/kelola/data-siswa, src/app/units/daycare/kelola/pendaftaran, dan seterusnya.

Kita menggunakan theme berikut: docs/theme-guide-almuhajirin.md

Database fully menggunakan postgreSQL prisma prisma/schema.prisma
Lakukan migrasi database tanpa melibatkan saya.
Anda bisa menggunakan sub-agent untuk membantu implementasi per modul berdasarkan arahan dan konteks yang Anda sediakan.
Pastikan sub-agent bekerja tanpa membutuhkan konfirmasi dari user.

We have this issue:

```

The /compact command fails with an error message stating "Conversation too long. Press esc twice to go up a few messages and try again." This prevents users from compacting their conversation history when the conversation becomes lengthy.

What Should Happen?
The /compact command should successfully compress the conversation history regardless of length, summarizing previous messages while preserving important context. Users should be able to compact conversations of any reasonable size to manage token usage and maintain conversation continuity.

What is the caused?
This is caused by parallel agents finishing after the compaction buffer is hit, the main context window begins compaction but the background agents continue to push data into main context as they finish which eats into the buffer eventually causing the main context compaction to fail. I am not sure if it's always from parallel agents, but it's definitely from background tasks running eating into context buffer typically saved for compaction.

```

Thus to handle this issue:
Jalankan maksimal 2 sub-agent secara bersamaan. Tunggu sampai keduanya selesai, lakukan /compact dengan retain konteks dan arahan dan informasi apapun yang diperlukan. Or if you have better idea, do it.

