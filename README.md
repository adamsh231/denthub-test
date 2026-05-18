# ⚡ DentHub — Super Modern, Motion-First Doctor UI

## Filosofi Desain

> “Sedikit elemen, banyak gerak. Informasi muncul saat dibutuhkan, bukan ditumpuk.”

UI harus terasa:

- Ringan
- Futuristik
- Cepat
- Fokus
- Hampir seperti “Invisible UI”

---

# 🧠 Global Design Language

## Visual

- Background terang bersih (nyaris polos)
- Panel menggunakan floating glass cards
- Hampir tidak ada border
- Shadow sangat lembut dan hanya muncul saat aktif
- Warna hanya muncul saat ada aksi:
  - Status
  - Hover
  - Focus

## Typography

- Besar
- Lega
- Sangat readable
- Judul pendek dan jelas
- Informasi sekunder menggunakan fade, bukan disembunyikan

---

# 💫 Motion sebagai Bahasa Utama UI

Semua perubahan state harus bergerak, tidak pernah terasa “snap”.

## Prinsip Motion

- Muncul → fade + slight slide
- Fokus → scale halus
- Transisi → morph, bukan replace
- Tidak ada animasi ramai
- Semua motion harus memiliki tujuan

---

# 🧭 Doctor Home (Dashboard)

## Struktur

Single-page layout tanpa sidebar besar.

### Header Minimal

- “Good morning, Doctor”
- Hari & tanggal
- Status kecil:
  - `3 upcoming`
  - `1 pending`

## Konten Utama

### Center Stage

- Timeline hari ini

### Secondary Layer

- Weekly overview
- Default dalam keadaan collapsed

## Motion

- Saat halaman dibuka:
  - seluruh konten naik perlahan
  - fade-in halus
- Timeline terasa “mengalir” dari atas ke bawah
- Item berikutnya muncul sedikit sebelum area scroll menyentuhnya

---

# 🕒 Appointment Timeline (Centerpiece UI)

## Tampilan

- Vertical flow
- Tidak menggunakan tabel
- Tidak ada garis keras

## Appointment Card

Setiap appointment tampil sebagai floating card.

### Isi Card

- Waktu (besar)
- Nama pasien
- 1 baris keluhan
- Status badge kecil

## Motion Behavior

### Idle

- Diam
- Hampir datar

### Hover

- Card naik sedikit
- Shadow muncul perlahan

### Click

- Card morph menjadi detail view
- Tidak berpindah halaman

## Status Behavior

### REQUESTED

- Subtle pulse

### CONFIRMED

- Stabil dan solid

### COMPLETED

- Fade + shrink ringan

---

# 🧲 Patient Detail (Morphing Panel)

## Konsep

Tidak menggunakan popup atau modal tradisional.

## Perilaku

- Appointment card bertransformasi menjadi detail panel
- Panel muncul langsung dari card asal
- Background mendapatkan blur ringan

## Isi Panel

- Patient name (hero text)
- Appointment information
- Visit note form inline

## Motion

### Open

- Card → panel
- Scale + expand

### Close

- Panel kembali menjadi card

### Save

- Button shrink
- Success check animation
- Panel close otomatis

---

# 🧠 Visit Notes UI (Ultra Minimal)

## Prinsip

Tidak ada form besar dan berat.

## Struktur Input

### Diagnosis

- Default hanya 1 baris
- Expand saat fokus

### Treatment

- Expand inline saat aktif

### Notes

- Label kecil dan fade

## Interaction

- Cursor focus memicu highlight halus
- Autosave indicator berupa tiny dot
- Save sukses menggunakan micro animation
- Tidak ada modal sukses

---

# 🗓️ Weekly Overview (Secondary Layer)

## Visibility

Tidak selalu terlihat.

Default sebagai collapsed ribbon.

## Interaction

- Expand via swipe atau click
- Collapse dengan gesture ringan

## Tampilan

- Horizontal blocks
- Privacy-first:
  - tanpa nama pasien
- Warna tipis untuk:
  - Busy
  - Free

## Motion

### Expand

- Unfold seperti accordion

### Collapse

- Fold dengan easing lembut

---

# 🧪 Appointment Request Review

## Layout

Tidak menggunakan table.

Menggunakan stacked request cards.

## Motion Flow

### Request Baru

- Muncul dari atas

### Approve

- Card meluncur ke kanan

### Reject

- Card turun + fade

## Reject Flow

- Reason input muncul inline
- Tidak ada modal
- Seluruh flow terasa cepat dan ringan

---

# 🧘 Empty States & Calm UI

## Ketika Tidak Ada Data

Tidak menggunakan ilustrasi besar.

Hanya text sederhana:

> “No appointments yet. Enjoy the quiet.”

## Behavior

- Fade-in perlahan
- Memberi rasa tenang
- Tidak terasa seperti error state

---

# 📱 Mobile First Behavior

Mobile bukan sekadar versi diperkecil.

## Mobile Experience

### Timeline

- Menjadi fokus utama

### Weekly View

- Swipe horizontal

### Detail Panel

- Fullscreen
- Swipe down to close

### Action Buttons

- Floating gesture-based actions

---

# 🔮 Future-Ready Motion Slots

UI sudah dipersiapkan untuk fitur masa depan:

- Odontogram overlay (slide-up)
- Billing summary (bottom sheet)
- Voice notes (press & hold)
- Smart suggestions (animated hint bubbles)

---

# ✨ Kesimpulan Arah UI

DentHub Doctor UI dirancang sebagai pengalaman yang:

- Super modern
- Visually simple
- Motion-driven
- Low cognitive load
- Terasa sangat cepat bahkan untuk workflow kompleks
- Tampak 2–3 tahun lebih maju dibanding software klinik biasa
