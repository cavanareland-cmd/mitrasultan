-- 1. Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'mitra');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pengguna bisa melihat perannya sendiri" ON public.user_roles;
CREATE POLICY "Pengguna bisa melihat perannya sendiri"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

DROP POLICY IF EXISTS "Admin bisa mengelola peran" ON public.user_roles;
CREATE POLICY "Admin bisa mengelola peran"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Jadikan pengguna yang sudah ada sebagai admin agar aplikasi tetap berfungsi
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Profiles: hanya profil sendiri
DROP POLICY IF EXISTS "Mitra masuk bisa melihat profil" ON public.profiles;
CREATE POLICY "Mitra bisa melihat profil sendiri"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- 3. Jamaah: kepemilikan
ALTER TABLE public.jamaah ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();

DROP POLICY IF EXISTS "Mitra masuk bisa melihat jamaah" ON public.jamaah;
DROP POLICY IF EXISTS "Mitra masuk bisa menambah jamaah" ON public.jamaah;
DROP POLICY IF EXISTS "Mitra masuk bisa mengubah jamaah" ON public.jamaah;
DROP POLICY IF EXISTS "Mitra masuk bisa menghapus jamaah" ON public.jamaah;

CREATE POLICY "Jamaah dilihat pemilik atau admin"
ON public.jamaah FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Jamaah ditambah oleh pemilik"
ON public.jamaah FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Jamaah diubah pemilik atau admin"
ON public.jamaah FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Jamaah dihapus pemilik atau admin"
ON public.jamaah FOR DELETE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 4. Teritori: tulis hanya admin
DROP POLICY IF EXISTS "Pengguna masuk bisa menambah teritori" ON public.teritori;
DROP POLICY IF EXISTS "Pengguna masuk bisa mengubah teritori" ON public.teritori;
DROP POLICY IF EXISTS "Pengguna masuk bisa menghapus teritori" ON public.teritori;

CREATE POLICY "Admin bisa menambah teritori"
ON public.teritori FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin bisa mengubah teritori"
ON public.teritori FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin bisa menghapus teritori"
ON public.teritori FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Akademi: tulis hanya admin
DROP POLICY IF EXISTS "Mitra masuk bisa menambah materi" ON public.akademi_materi;
DROP POLICY IF EXISTS "Mitra masuk bisa mengubah materi" ON public.akademi_materi;
DROP POLICY IF EXISTS "Mitra masuk bisa menghapus materi" ON public.akademi_materi;
CREATE POLICY "Admin bisa menambah materi" ON public.akademi_materi FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa mengubah materi" ON public.akademi_materi FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa menghapus materi" ON public.akademi_materi FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Mitra masuk bisa menambah sertifikasi" ON public.akademi_sertifikasi;
DROP POLICY IF EXISTS "Mitra masuk bisa mengubah sertifikasi" ON public.akademi_sertifikasi;
DROP POLICY IF EXISTS "Mitra masuk bisa menghapus sertifikasi" ON public.akademi_sertifikasi;
CREATE POLICY "Admin bisa menambah sertifikasi" ON public.akademi_sertifikasi FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa mengubah sertifikasi" ON public.akademi_sertifikasi FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa menghapus sertifikasi" ON public.akademi_sertifikasi FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Mitra masuk bisa menambah jadwal" ON public.akademi_jadwal;
DROP POLICY IF EXISTS "Mitra masuk bisa mengubah jadwal" ON public.akademi_jadwal;
DROP POLICY IF EXISTS "Mitra masuk bisa menghapus jadwal" ON public.akademi_jadwal;
CREATE POLICY "Admin bisa menambah jadwal" ON public.akademi_jadwal FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa mengubah jadwal" ON public.akademi_jadwal FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa menghapus jadwal" ON public.akademi_jadwal FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));