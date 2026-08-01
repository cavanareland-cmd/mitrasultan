# Mitra Hub Emas

Build a comprehensive, mobile-responsive Agent/Partner Dashboard Web App for an Umrah Travel Agency named "Mitra Center Sultan Haramain Gresik". 

TECH STACK & DEPLOYMENT REQUIREMENTS:

- Use React, Vite, TypeScript, Tailwind CSS, and Shadcn UI components. All Element use Bahasa Indonesia

- IMPORTANT: Configure the Vite build settings and `package.json` build scripts to direct output tracking to the standard `dist` directory (or specialized output directory) to prevent Vercel 404 routing errors during deployment.

- Ensure the project structure is 100% ready to be pushed to GitHub and deployed seamlessly to Vercel. Keep code highly modular so it is clean for manual code adjustments and local Git remote/credential management inside Cursor.

THEME & STYLING:

- Implement a luxury, elegant design.

- Force a Dark Mode theme by default (deep black/charcoal backgrounds).

- Use Gold / Amber as the primary accent color for buttons, active states, borders, and highlights to reflect a premium Umrah brand identity.

- Use Lucide React for all icons.

CORE MODULES & FEATURES TO GENERATE:

1. Dashboard & Target Tracking:

   - Top Bar: Logo, Agent profile (Aisyah - VIP Agent, ID), and a Gold Crown icon representing the Leaderboard tier.

   - Welcome Banner: "Selamat Datang, Aisyah!" with a subtext and a prominent banner card displaying "Posisi Leaderboard Bulan Ini: #3 (VIP)" and a "Selengkapnya" button.

   - Widget Ringkasan Cards: Total Komisi Berjalan (Rp), Jumlah Leads Aktif, and Total Jamaah Terdaftar.

   - Umrah Gratis Tracker: Visual progress bar card showing progress (e.g., 8 / 10 Jamaah) with a Kaaba icon and remaining target notification.

   - Agenda & Task Hari Ini: List of daily tasks/reminders (Follow-up leads, Document submission, Manasik events) with time indicators and a "Lihat Semua Agenda" button.

2. Manajemen Jamaah Pintar (Smart CRM):

   - Data Pipeline: Visual status tracker showing conversion steps (Tanya-tanya ➔ DP ➔ Lunas ➔ Pemberkasan) with percentage metrics.

   - Smart Segmentation: Filter builder UI to create specific target groups (e.g., "Belum Lunas" AND "Jatuh Tempo < 7 Hari").

   - Filtered Table & Mass Action: Data table showing matched prospects and a prominent "Mass Follow-Up via WhatsApp" action button.

3. Geospatial Territory Manager (Peta Teritorial & Anti-Kanibal):

   - Interactive Territory Map UI: Visual map layout displaying regional boundaries (e.g., Districts in Gresik, Lamongan, Tuban) with color-coded status zoning:

     * Yellow (Claimed & Active by specific agent)

     * Gray (Available / Open)

     * Blue (Planning / Future Projection)

     * Orange (Retargeting)

     * Black/Red (Blacklist / Ignore)

   - Territory Detail Sidebar: Clicking a district opens a popup showing market research stats (Estimated Target Population, Contacted, Active Leads, Pending, Lost), plus territory management options.



4. Akademi Kemitraan (Mini-LMS)

Galeri Video Edukasi: Materi Product Knowledge, Skill Marketing, dan Fikih Umrah yang bisa dipelajari kapan saja.

Sertifikasi & Progres Belajar: Indikator visual pencapaian belajar agen (gamifikasi).

Jadwal Training: Informasi sesi webinar atau training offline dari pusat.

5. Jaringan Kemitraan (Downline & Referral)

Pohon Jaringan Visual (Genealogy Tree): Tampilan visual interaktif siapa mengajak siapa dalam jaringan agen.

Tabel Hierarki: Daftar lengkap sub-mitra dan jamaah di bawah naungan agen utama.

Generator Link Referal: Tautan khusus agen untuk dibagikan, sehingga setiap pendaftaran akan otomatis masuk sebagai downline mereka.

6. Profil & Dompet Mitra (Finansial)

Dompet Komisi: Rincian saldo yang tersedia untuk dicairkan dan saldo yang masih berstatus tertunda.

Rincian Pendapatan: Pemisahan antara Fee per Pax, bonus overriding (downline), dan reward.

Feed Aktivitas Finansial: Riwayat interaksi historis seperti pencairan dana atau masuknya komisi baru.

Etalase Prestasi (Badges): Lencana virtual untuk setiap milestone yang dicapai agen.

7. Leaderboard (Papan Peringkat Gamifikasi)

Liga Kemitraan: Tingkatan agen (Reguler, Silver, Gold, VIP) dengan navigasi geser horizontal yang mulus.

Podium Top 3: Sorotan visual untuk agen dengan performa terbaik bulan ini atau sepanjang waktu.

Daftar Peringkat Lengkap: Urutan agen dengan baris khusus (sticky row) di bawah layar agar agen selalu tahu posisi mereka saat ini.

8. Alat Muslim Harian (Daily Utilities)

Widget Utama: Jadwal sholat real-time, deteksi lokasi, penanggalan Hijriah, dan hitung mundur waktu sholat.

Menu Grid Fungsional: Akses cepat ke Al-Quran, Tasbih Digital, Arah Kiblat, Kalkulator Zakat, dan Buku Saku Digital (Panduan Manasik).

9. Fitur Ekstra & Simulasi (Advanced Tools)

Kalkulator Tabungan Umrah: Alat simulasi finansial untuk menghitung kemampuan menabung calon jamaah dan estimasi waktu keberangkatannya (bisa diunduh menjadi PDF).

Web Replika Otomatis: Sistem landing page promosi personal untuk masing-masing agen.

QR Code Scanner: Fitur pemindai untuk presensi digital saat ada acara gathering atau Manasik offline. Generate clean, well-commented code with realistic dummy data so all modules can be immediately previewed and interacted with.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mitrasultan.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fb2c5844-b72f-4813-9e6e-83e0f44e8d5e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
