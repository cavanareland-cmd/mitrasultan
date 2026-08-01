CREATE TYPE public.kategori_materi AS ENUM ('Product Knowledge', 'Skill Marketing', 'Fikih Umrah');
CREATE TYPE public.status_sertifikasi AS ENUM ('Selesai', 'Berjalan', 'Terkunci');

CREATE TABLE public.akademi_materi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  kategori public.kategori_materi NOT NULL DEFAULT 'Product Knowledge',
  durasi text NOT NULL DEFAULT '',
  pemateri text NOT NULL DEFAULT '',
  progres integer NOT NULL DEFAULT 0,
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.akademi_materi TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.akademi_materi TO authenticated;
GRANT ALL ON public.akademi_materi TO service_role;
ALTER TABLE public.akademi_materi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Semua bisa melihat materi" ON public.akademi_materi FOR SELECT USING (true);
CREATE POLICY "Semua bisa menambah materi" ON public.akademi_materi FOR INSERT WITH CHECK (true);
CREATE POLICY "Semua bisa mengubah materi" ON public.akademi_materi FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Semua bisa menghapus materi" ON public.akademi_materi FOR DELETE USING (true);

CREATE TABLE public.akademi_sertifikasi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  status public.status_sertifikasi NOT NULL DEFAULT 'Terkunci',
  progres integer NOT NULL DEFAULT 0,
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.akademi_sertifikasi TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.akademi_sertifikasi TO authenticated;
GRANT ALL ON public.akademi_sertifikasi TO service_role;
ALTER TABLE public.akademi_sertifikasi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Semua bisa melihat sertifikasi" ON public.akademi_sertifikasi FOR SELECT USING (true);
CREATE POLICY "Semua bisa menambah sertifikasi" ON public.akademi_sertifikasi FOR INSERT WITH CHECK (true);
CREATE POLICY "Semua bisa mengubah sertifikasi" ON public.akademi_sertifikasi FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Semua bisa menghapus sertifikasi" ON public.akademi_sertifikasi FOR DELETE USING (true);

CREATE TABLE public.akademi_jadwal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  tanggal text NOT NULL DEFAULT '',
  tipe text NOT NULL DEFAULT '',
  pemateri text NOT NULL DEFAULT '',
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.akademi_jadwal TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.akademi_jadwal TO authenticated;
GRANT ALL ON public.akademi_jadwal TO service_role;
ALTER TABLE public.akademi_jadwal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Semua bisa melihat jadwal" ON public.akademi_jadwal FOR SELECT USING (true);
CREATE POLICY "Semua bisa menambah jadwal" ON public.akademi_jadwal FOR INSERT WITH CHECK (true);
CREATE POLICY "Semua bisa mengubah jadwal" ON public.akademi_jadwal FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Semua bisa menghapus jadwal" ON public.akademi_jadwal FOR DELETE USING (true);

CREATE TRIGGER trg_akademi_materi_updated BEFORE UPDATE ON public.akademi_materi FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_akademi_sertifikasi_updated BEFORE UPDATE ON public.akademi_sertifikasi FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_akademi_jadwal_updated BEFORE UPDATE ON public.akademi_jadwal FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.akademi_materi;
ALTER PUBLICATION supabase_realtime ADD TABLE public.akademi_sertifikasi;
ALTER PUBLICATION supabase_realtime ADD TABLE public.akademi_jadwal;

INSERT INTO public.akademi_materi (judul, kategori, durasi, pemateri, progres, urutan) VALUES
('Mengenal Seluruh Paket Sultan Haramain 2026', 'Product Knowledge', '24 menit', 'Tim Produk Pusat', 100, 1),
('Struktur Harga & Simulasi Cicilan Jamaah', 'Product Knowledge', '18 menit', 'Ustadzah Nadia', 100, 2),
('Teknik Closing Lembut untuk Calon Jamaah Senior', 'Skill Marketing', '32 menit', 'Ust. Fahmi Ridwan', 65, 3),
('Konten WhatsApp Status yang Mengundang Chat', 'Skill Marketing', '21 menit', 'Coach Rani', 40, 4),
('Fikih Manasik: Rukun, Wajib, dan Larangan Ihram', 'Fikih Umrah', '45 menit', 'KH. Abdul Karim', 80, 5),
('Menjawab Keraguan Syar''i Calon Jamaah', 'Fikih Umrah', '27 menit', 'KH. Abdul Karim', 0, 6);

INSERT INTO public.akademi_sertifikasi (nama, status, progres, urutan) VALUES
('Sertifikat Dasar Kemitraan', 'Selesai', 100, 1),
('Sertifikat Product Specialist', 'Selesai', 100, 2),
('Sertifikat Marketing Advance', 'Berjalan', 52, 3),
('Sertifikat Pembimbing Manasik', 'Terkunci', 0, 4);

INSERT INTO public.akademi_jadwal (judul, tanggal, tipe, pemateri, urutan) VALUES
('Webinar: Closing Tanpa Menekan', 'Hari ini • 15.30 WIB', 'Online (Zoom)', 'Ust. Fahmi Ridwan', 1),
('Workshop Digital Marketing Mitra', 'Sabtu, 8 Agu 2026 • 09.00 WIB', 'Offline • Kantor Pusat Gresik', 'Coach Rani', 2),
('Kelas Fikih Manasik Lanjutan', 'Ahad, 16 Agu 2026 • 13.00 WIB', 'Online (Zoom)', 'KH. Abdul Karim', 3);