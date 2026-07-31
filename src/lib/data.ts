/**
 * Data dummy terpusat untuk seluruh modul dashboard mitra.
 * Semua angka bersifat contoh agar setiap modul bisa langsung dipratinjau.
 */

export const agent = {
  nama: "Aisyah Rahmawati",
  panggilan: "Aisyah",
  id: "MTR-GRS-0451",
  tier: "VIP Agent",
  kota: "Gresik, Jawa Timur",
  peringkatBulanIni: 3,
  bergabung: "Maret 2023",
  refCode: "AISYAH451",
};

export const ringkasan = {
  komisiBerjalan: 47850000,
  leadsAktif: 34,
  jamaahTerdaftar: 62,
};

export const umrahGratis = {
  tercapai: 8,
  target: 10,
};

export type Agenda = {
  id: string;
  waktu: string;
  judul: string;
  detail: string;
  kategori: "Follow-up" | "Berkas" | "Manasik" | "Training";
};

export const agendaHariIni: Agenda[] = [
  {
    id: "a1",
    waktu: "08.30",
    judul: "Follow-up 6 leads panas",
    detail: "Prospek dari Manasik Akbar Kebomas yang belum DP.",
    kategori: "Follow-up",
  },
  {
    id: "a2",
    waktu: "10.00",
    judul: "Kirim berkas paspor 3 jamaah",
    detail: "H. Sulaiman, Ny. Rohmah, dan Bpk. Nur Hadi ke admin pusat.",
    kategori: "Berkas",
  },
  {
    id: "a3",
    waktu: "13.15",
    judul: "Verifikasi pelunasan Grup Manyar",
    detail: "4 jamaah jatuh tempo dalam 5 hari.",
    kategori: "Berkas",
  },
  {
    id: "a4",
    waktu: "15.30",
    judul: "Webinar: Closing Tanpa Menekan",
    detail: "Sesi Akademi Kemitraan bersama Ust. Fahmi.",
    kategori: "Training",
  },
  {
    id: "a5",
    waktu: "19.00",
    judul: "Manasik offline Masjid Al-Ikhlas",
    detail: "Presensi jamaah menggunakan QR Scanner.",
    kategori: "Manasik",
  },
];

/* ------------------------------- CRM Jamaah ------------------------------ */

export const pipeline = [
  { tahap: "Tanya-tanya", jumlah: 128, persen: 100 },
  { tahap: "DP", jumlah: 71, persen: 55 },
  { tahap: "Lunas", jumlah: 43, persen: 34 },
  { tahap: "Pemberkasan", jumlah: 31, persen: 24 },
];

export type Prospek = {
  id: string;
  nama: string;
  telepon: string;
  wilayah: string;
  paket: string;
  status: "Tanya-tanya" | "DP" | "Lunas" | "Pemberkasan";
  sisaTagihan: number;
  jatuhTempoHari: number;
  terakhirKontak: string;
};

export const prospek: Prospek[] = [
  {
    id: "p1",
    nama: "H. Sulaiman Yusuf",
    telepon: "0812-3456-7801",
    wilayah: "Kebomas",
    paket: "Umrah Reguler 12 Hari",
    status: "DP",
    sisaTagihan: 21500000,
    jatuhTempoHari: 4,
    terakhirKontak: "2 hari lalu",
  },
  {
    id: "p2",
    nama: "Ny. Rohmah Andriani",
    telepon: "0813-2211-9034",
    wilayah: "Manyar",
    paket: "Umrah Plus Turki",
    status: "DP",
    sisaTagihan: 28900000,
    jatuhTempoHari: 6,
    terakhirKontak: "Hari ini",
  },
  {
    id: "p3",
    nama: "Bpk. Nur Hadi",
    telepon: "0857-8890-1122",
    wilayah: "Duduksampeyan",
    paket: "Umrah Reguler 9 Hari",
    status: "DP",
    sisaTagihan: 13750000,
    jatuhTempoHari: 3,
    terakhirKontak: "5 hari lalu",
  },
  {
    id: "p4",
    nama: "Hj. Siti Maimunah",
    telepon: "0821-4455-6677",
    wilayah: "Lamongan Kota",
    paket: "Umrah Ramadhan",
    status: "Lunas",
    sisaTagihan: 0,
    jatuhTempoHari: 0,
    terakhirKontak: "Kemarin",
  },
  {
    id: "p5",
    nama: "Bpk. Ahmad Fauzi",
    telepon: "0838-1200-3344",
    wilayah: "Tuban Kota",
    paket: "Umrah Reguler 12 Hari",
    status: "Tanya-tanya",
    sisaTagihan: 34500000,
    jatuhTempoHari: 12,
    terakhirKontak: "1 minggu lalu",
  },
  {
    id: "p6",
    nama: "Ny. Khoirun Nisa",
    telepon: "0895-7788-2211",
    wilayah: "Cerme",
    paket: "Umrah Plus Aqsa",
    status: "DP",
    sisaTagihan: 19200000,
    jatuhTempoHari: 2,
    terakhirKontak: "3 hari lalu",
  },
  {
    id: "p7",
    nama: "Bpk. Zainal Arifin",
    telepon: "0812-9090-4455",
    wilayah: "Paciran",
    paket: "Umrah Reguler 9 Hari",
    status: "Pemberkasan",
    sisaTagihan: 0,
    jatuhTempoHari: 0,
    terakhirKontak: "Hari ini",
  },
  {
    id: "p8",
    nama: "Ny. Lailatul Badriyah",
    telepon: "0857-3344-8899",
    wilayah: "Menganti",
    paket: "Umrah Ramadhan",
    status: "DP",
    sisaTagihan: 24100000,
    jatuhTempoHari: 5,
    terakhirKontak: "4 hari lalu",
  },
];

/* --------------------------- Teritorial / Peta --------------------------- */

export type StatusTeritori = "Aktif" | "Tersedia" | "Perencanaan" | "Retargeting" | "Blacklist";

export type Teritori = {
  id: string;
  kecamatan: string;
  kabupaten: string;
  status: StatusTeritori;
  pemilik: string | null;
  populasiTarget: number;
  dihubungi: number;
  leadsAktif: number;
  pending: number;
  lost: number;
  catatan: string;
};

export const teritori: Teritori[] = [
  {
    id: "t1",
    kecamatan: "Kebomas",
    kabupaten: "Gresik",
    status: "Aktif",
    pemilik: "Aisyah R.",
    populasiTarget: 4200,
    dihubungi: 860,
    leadsAktif: 74,
    pending: 31,
    lost: 22,
    catatan: "Basis komunitas majelis taklim kuat, potensi grup keluarga besar.",
  },
  {
    id: "t2",
    kecamatan: "Manyar",
    kabupaten: "Gresik",
    status: "Aktif",
    pemilik: "Aisyah R.",
    populasiTarget: 3800,
    dihubungi: 640,
    leadsAktif: 52,
    pending: 18,
    lost: 14,
    catatan: "Banyak karyawan pabrik, cocok skema cicilan ringan.",
  },
  {
    id: "t3",
    kecamatan: "Cerme",
    kabupaten: "Gresik",
    status: "Retargeting",
    pemilik: "Aisyah R.",
    populasiTarget: 2900,
    dihubungi: 510,
    leadsAktif: 21,
    pending: 40,
    lost: 63,
    catatan: "Prospek lama 2024 layak disentuh ulang dengan promo Ramadhan.",
  },
  {
    id: "t4",
    kecamatan: "Menganti",
    kabupaten: "Gresik",
    status: "Perencanaan",
    pemilik: null,
    populasiTarget: 5100,
    dihubungi: 90,
    leadsAktif: 8,
    pending: 4,
    lost: 1,
    catatan: "Rencana ekspansi kuartal depan, butuh 1 sub-mitra lokal.",
  },
  {
    id: "t5",
    kecamatan: "Duduksampeyan",
    kabupaten: "Gresik",
    status: "Tersedia",
    pemilik: null,
    populasiTarget: 2100,
    dihubungi: 0,
    leadsAktif: 0,
    pending: 0,
    lost: 0,
    catatan: "Belum ada mitra yang klaim wilayah ini.",
  },
  {
    id: "t6",
    kecamatan: "Driyorejo",
    kabupaten: "Gresik",
    status: "Aktif",
    pemilik: "Fahmi H.",
    populasiTarget: 4600,
    dihubungi: 720,
    leadsAktif: 61,
    pending: 25,
    lost: 30,
    catatan: "Sudah diklaim mitra lain — hindari kanibalisasi prospek.",
  },
  {
    id: "t7",
    kecamatan: "Lamongan Kota",
    kabupaten: "Lamongan",
    status: "Aktif",
    pemilik: "Aisyah R.",
    populasiTarget: 3300,
    dihubungi: 480,
    leadsAktif: 44,
    pending: 16,
    lost: 12,
    catatan: "Konversi tertinggi dari acara manasik akbar.",
  },
  {
    id: "t8",
    kecamatan: "Paciran",
    kabupaten: "Lamongan",
    status: "Perencanaan",
    pemilik: null,
    populasiTarget: 2700,
    dihubungi: 120,
    leadsAktif: 11,
    pending: 6,
    lost: 3,
    catatan: "Wilayah pesisir, kuat di jaringan pondok pesantren.",
  },
  {
    id: "t9",
    kecamatan: "Babat",
    kabupaten: "Lamongan",
    status: "Tersedia",
    pemilik: null,
    populasiTarget: 2400,
    dihubungi: 0,
    leadsAktif: 0,
    pending: 0,
    lost: 0,
    catatan: "Terbuka untuk klaim mitra baru.",
  },
  {
    id: "t10",
    kecamatan: "Tuban Kota",
    kabupaten: "Tuban",
    status: "Retargeting",
    pemilik: "Aisyah R.",
    populasiTarget: 3900,
    dihubungi: 430,
    leadsAktif: 19,
    pending: 33,
    lost: 51,
    catatan: "Perlu edukasi ulang soal legalitas travel.",
  },
  {
    id: "t11",
    kecamatan: "Jenu",
    kabupaten: "Tuban",
    status: "Tersedia",
    pemilik: null,
    populasiTarget: 1800,
    dihubungi: 0,
    leadsAktif: 0,
    pending: 0,
    lost: 0,
    catatan: "Belum tergarap sama sekali.",
  },
  {
    id: "t12",
    kecamatan: "Bancar",
    kabupaten: "Tuban",
    status: "Blacklist",
    pemilik: null,
    populasiTarget: 1500,
    dihubungi: 210,
    leadsAktif: 0,
    pending: 0,
    lost: 96,
    catatan: "Riwayat kompetitor agresif & banyak prospek fiktif.",
  },
];

export const warnaStatusTeritori: Record<StatusTeritori, string> = {
  Aktif: "bg-warning/25 border-warning text-warning",
  Tersedia: "bg-muted/60 border-border text-muted-foreground",
  Perencanaan: "bg-info/20 border-info text-info",
  Retargeting: "bg-chart-4/20 border-chart-4 text-chart-4",
  Blacklist: "bg-danger/20 border-danger text-danger",
};

/* ---------------------------- Akademi (Mini-LMS) -------------------------- */

export type Materi = {
  id: string;
  judul: string;
  kategori: "Product Knowledge" | "Skill Marketing" | "Fikih Umrah";
  durasi: string;
  progres: number;
  pemateri: string;
};

export const materiAkademi: Materi[] = [
  {
    id: "m1",
    judul: "Mengenal Seluruh Paket Sultan Haramain 2026",
    kategori: "Product Knowledge",
    durasi: "24 menit",
    progres: 100,
    pemateri: "Tim Produk Pusat",
  },
  {
    id: "m2",
    judul: "Struktur Harga & Simulasi Cicilan Jamaah",
    kategori: "Product Knowledge",
    durasi: "18 menit",
    progres: 100,
    pemateri: "Ustadzah Nadia",
  },
  {
    id: "m3",
    judul: "Teknik Closing Lembut untuk Calon Jamaah Senior",
    kategori: "Skill Marketing",
    durasi: "32 menit",
    progres: 65,
    pemateri: "Ust. Fahmi Ridwan",
  },
  {
    id: "m4",
    judul: "Konten WhatsApp Status yang Mengundang Chat",
    kategori: "Skill Marketing",
    durasi: "21 menit",
    progres: 40,
    pemateri: "Coach Rani",
  },
  {
    id: "m5",
    judul: "Fikih Manasik: Rukun, Wajib, dan Larangan Ihram",
    kategori: "Fikih Umrah",
    durasi: "45 menit",
    progres: 80,
    pemateri: "KH. Abdul Karim",
  },
  {
    id: "m6",
    judul: "Menjawab Keraguan Syar'i Calon Jamaah",
    kategori: "Fikih Umrah",
    durasi: "27 menit",
    progres: 0,
    pemateri: "KH. Abdul Karim",
  },
];

export const sertifikasi = [
  { nama: "Sertifikat Dasar Kemitraan", status: "Selesai", progres: 100 },
  { nama: "Sertifikat Product Specialist", status: "Selesai", progres: 100 },
  { nama: "Sertifikat Marketing Advance", status: "Berjalan", progres: 52 },
  { nama: "Sertifikat Pembimbing Manasik", status: "Terkunci", progres: 0 },
];

export const jadwalTraining = [
  {
    id: "j1",
    judul: "Webinar: Closing Tanpa Menekan",
    tanggal: "Hari ini • 15.30 WIB",
    tipe: "Online (Zoom)",
    pemateri: "Ust. Fahmi Ridwan",
  },
  {
    id: "j2",
    judul: "Workshop Digital Marketing Mitra",
    tanggal: "Sabtu, 8 Agu 2026 • 09.00 WIB",
    tipe: "Offline • Kantor Pusat Gresik",
    pemateri: "Coach Rani",
  },
  {
    id: "j3",
    judul: "Kelas Fikih Manasik Lanjutan",
    tanggal: "Ahad, 16 Agu 2026 • 13.00 WIB",
    tipe: "Online (Zoom)",
    pemateri: "KH. Abdul Karim",
  },
];

/* ----------------------------- Jaringan / Downline ------------------------ */

export type Downline = {
  id: string;
  nama: string;
  tier: string;
  jamaah: number;
  komisi: number;
  anak?: Downline[];
};

export const jaringan: Downline = {
  id: "d0",
  nama: "Aisyah Rahmawati",
  tier: "VIP",
  jamaah: 62,
  komisi: 47850000,
  anak: [
    {
      id: "d1",
      nama: "Umi Kholifah",
      tier: "Gold",
      jamaah: 24,
      komisi: 18200000,
      anak: [
        { id: "d1a", nama: "Rizky Maulana", tier: "Silver", jamaah: 9, komisi: 6300000 },
        { id: "d1b", nama: "Nur Aini", tier: "Reguler", jamaah: 4, komisi: 2400000 },
      ],
    },
    {
      id: "d2",
      nama: "Bpk. Syaiful Anam",
      tier: "Silver",
      jamaah: 14,
      komisi: 9100000,
      anak: [{ id: "d2a", nama: "Dewi Lestari", tier: "Reguler", jamaah: 5, komisi: 2750000 }],
    },
    { id: "d3", nama: "Hj. Mutmainnah", tier: "Gold", jamaah: 19, komisi: 13400000 },
  ],
};

/* ------------------------------- Dompet ---------------------------------- */

export const dompet = {
  tersedia: 21400000,
  tertunda: 26450000,
  totalSepanjangWaktu: 184300000,
};

export const rincianPendapatan = [
  { label: "Fee per Pax", nilai: 32600000, warna: "bg-gold" },
  { label: "Bonus Overriding Downline", nilai: 10450000, warna: "bg-success" },
  { label: "Reward & Insentif", nilai: 4800000, warna: "bg-info" },
];

export const aktivitasFinansial = [
  { id: "f1", judul: "Komisi masuk — Grup Manyar (4 pax)", waktu: "Hari ini, 09.12", nilai: 6400000 },
  { id: "f2", judul: "Pencairan ke BSI ****4471", waktu: "Kemarin, 16.40", nilai: -12000000 },
  { id: "f3", judul: "Bonus overriding Juli", waktu: "28 Jul 2026", nilai: 3150000 },
  { id: "f4", judul: "Reward Top 3 Leaderboard", waktu: "25 Jul 2026", nilai: 2000000 },
  { id: "f5", judul: "Komisi masuk — H. Sulaiman", waktu: "21 Jul 2026", nilai: 1600000 },
];

export const badges = [
  { nama: "First Closing", diraih: true, deskripsi: "Closing jamaah pertama" },
  { nama: "10 Jamaah", diraih: true, deskripsi: "Berhasil memberangkatkan 10 jamaah" },
  { nama: "50 Jamaah", diraih: true, deskripsi: "Milestone 50 jamaah" },
  { nama: "Mentor Terbaik", diraih: true, deskripsi: "3 downline aktif produktif" },
  { nama: "100 Jamaah", diraih: false, deskripsi: "Kunci di 100 jamaah" },
  { nama: "Sultan Ambassador", diraih: false, deskripsi: "Tier tertinggi kemitraan" },
];

/* ------------------------------ Leaderboard ------------------------------ */

export type Peringkat = {
  posisi: number;
  nama: string;
  wilayah: string;
  jamaah: number;
  poin: number;
  liga: "Reguler" | "Silver" | "Gold" | "VIP";
  saya?: boolean;
};

export const leaderboard: Peringkat[] = [
  { posisi: 1, nama: "Fahmi Hidayat", wilayah: "Driyorejo", jamaah: 81, poin: 9840, liga: "VIP" },
  { posisi: 2, nama: "Hj. Mutmainnah", wilayah: "Sidayu", jamaah: 74, poin: 9120, liga: "VIP" },
  {
    posisi: 3,
    nama: "Aisyah Rahmawati",
    wilayah: "Kebomas",
    jamaah: 62,
    poin: 8460,
    liga: "VIP",
    saya: true,
  },
  { posisi: 4, nama: "Umi Kholifah", wilayah: "Manyar", jamaah: 55, poin: 7710, liga: "Gold" },
  { posisi: 5, nama: "Syaiful Anam", wilayah: "Cerme", jamaah: 48, poin: 6980, liga: "Gold" },
  { posisi: 6, nama: "Dewi Lestari", wilayah: "Lamongan", jamaah: 39, poin: 5840, liga: "Silver" },
  { posisi: 7, nama: "Rizky Maulana", wilayah: "Tuban", jamaah: 33, poin: 5120, liga: "Silver" },
  { posisi: 8, nama: "Nur Aini", wilayah: "Babat", jamaah: 21, poin: 3980, liga: "Reguler" },
  { posisi: 9, nama: "Hamzah Ali", wilayah: "Paciran", jamaah: 17, poin: 3210, liga: "Reguler" },
  { posisi: 10, nama: "Siti Aminah", wilayah: "Menganti", jamaah: 12, poin: 2480, liga: "Reguler" },
];

/* --------------------------- Alat Muslim Harian --------------------------- */

export const jadwalSholat = [
  { nama: "Subuh", waktu: "04:22" },
  { nama: "Dzuhur", waktu: "11:34" },
  { nama: "Ashar", waktu: "14:56" },
  { nama: "Maghrib", waktu: "17:29" },
  { nama: "Isya", waktu: "18:41" },
];

export const infoHijriah = {
  hijriah: "16 Safar 1448 H",
  masehi: "Jumat, 31 Juli 2026",
  lokasi: "Gresik, Jawa Timur",
};

export const formatRupiah = (nilai: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
