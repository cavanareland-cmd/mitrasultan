-- JAMAAH: kunci penuh ke pengguna terautentikasi
DROP POLICY IF EXISTS "Semua bisa melihat jamaah" ON public.jamaah;
DROP POLICY IF EXISTS "Semua bisa menambah jamaah" ON public.jamaah;
DROP POLICY IF EXISTS "Semua bisa mengubah jamaah" ON public.jamaah;
DROP POLICY IF EXISTS "Semua bisa menghapus jamaah" ON public.jamaah;

REVOKE ALL ON public.jamaah FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jamaah TO authenticated;
GRANT ALL ON public.jamaah TO service_role;

CREATE POLICY "Mitra masuk bisa melihat jamaah" ON public.jamaah
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Mitra masuk bisa menambah jamaah" ON public.jamaah
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Mitra masuk bisa mengubah jamaah" ON public.jamaah
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Mitra masuk bisa menghapus jamaah" ON public.jamaah
  FOR DELETE TO authenticated USING (true);

-- TERITORI: baca juga hanya untuk pengguna terautentikasi
DROP POLICY IF EXISTS "Semua bisa melihat teritori" ON public.teritori;
REVOKE ALL ON public.teritori FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teritori TO authenticated;
GRANT ALL ON public.teritori TO service_role;

CREATE POLICY "Mitra masuk bisa melihat teritori" ON public.teritori
  FOR SELECT TO authenticated USING (true);

-- AKADEMI: baca publik, tulis hanya pengguna terautentikasi
DROP POLICY IF EXISTS "Semua bisa menambah materi" ON public.akademi_materi;
DROP POLICY IF EXISTS "Semua bisa mengubah materi" ON public.akademi_materi;
DROP POLICY IF EXISTS "Semua bisa menghapus materi" ON public.akademi_materi;
REVOKE INSERT, UPDATE, DELETE ON public.akademi_materi FROM anon;
GRANT SELECT ON public.akademi_materi TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.akademi_materi TO authenticated;
GRANT ALL ON public.akademi_materi TO service_role;
CREATE POLICY "Mitra masuk bisa menambah materi" ON public.akademi_materi
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Mitra masuk bisa mengubah materi" ON public.akademi_materi
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Mitra masuk bisa menghapus materi" ON public.akademi_materi
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Semua bisa menambah sertifikasi" ON public.akademi_sertifikasi;
DROP POLICY IF EXISTS "Semua bisa mengubah sertifikasi" ON public.akademi_sertifikasi;
DROP POLICY IF EXISTS "Semua bisa menghapus sertifikasi" ON public.akademi_sertifikasi;
REVOKE INSERT, UPDATE, DELETE ON public.akademi_sertifikasi FROM anon;
GRANT SELECT ON public.akademi_sertifikasi TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.akademi_sertifikasi TO authenticated;
GRANT ALL ON public.akademi_sertifikasi TO service_role;
CREATE POLICY "Mitra masuk bisa menambah sertifikasi" ON public.akademi_sertifikasi
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Mitra masuk bisa mengubah sertifikasi" ON public.akademi_sertifikasi
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Mitra masuk bisa menghapus sertifikasi" ON public.akademi_sertifikasi
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Semua bisa menambah jadwal" ON public.akademi_jadwal;
DROP POLICY IF EXISTS "Semua bisa mengubah jadwal" ON public.akademi_jadwal;
DROP POLICY IF EXISTS "Semua bisa menghapus jadwal" ON public.akademi_jadwal;
REVOKE INSERT, UPDATE, DELETE ON public.akademi_jadwal FROM anon;
GRANT SELECT ON public.akademi_jadwal TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.akademi_jadwal TO authenticated;
GRANT ALL ON public.akademi_jadwal TO service_role;
CREATE POLICY "Mitra masuk bisa menambah jadwal" ON public.akademi_jadwal
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Mitra masuk bisa mengubah jadwal" ON public.akademi_jadwal
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Mitra masuk bisa menghapus jadwal" ON public.akademi_jadwal
  FOR DELETE TO authenticated USING (true);