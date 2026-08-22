
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- akademi_jadwal
DROP POLICY IF EXISTS "Admin bisa menambah jadwal" ON public.akademi_jadwal;
DROP POLICY IF EXISTS "Admin bisa menghapus jadwal" ON public.akademi_jadwal;
DROP POLICY IF EXISTS "Admin bisa mengubah jadwal" ON public.akademi_jadwal;
CREATE POLICY "Admin bisa menambah jadwal" ON public.akademi_jadwal FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa menghapus jadwal" ON public.akademi_jadwal FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa mengubah jadwal" ON public.akademi_jadwal FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- akademi_materi
DROP POLICY IF EXISTS "Admin bisa menambah materi" ON public.akademi_materi;
DROP POLICY IF EXISTS "Admin bisa menghapus materi" ON public.akademi_materi;
DROP POLICY IF EXISTS "Admin bisa mengubah materi" ON public.akademi_materi;
CREATE POLICY "Admin bisa menambah materi" ON public.akademi_materi FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa menghapus materi" ON public.akademi_materi FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa mengubah materi" ON public.akademi_materi FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- akademi_sertifikasi
DROP POLICY IF EXISTS "Admin bisa menambah sertifikasi" ON public.akademi_sertifikasi;
DROP POLICY IF EXISTS "Admin bisa menghapus sertifikasi" ON public.akademi_sertifikasi;
DROP POLICY IF EXISTS "Admin bisa mengubah sertifikasi" ON public.akademi_sertifikasi;
CREATE POLICY "Admin bisa menambah sertifikasi" ON public.akademi_sertifikasi FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa menghapus sertifikasi" ON public.akademi_sertifikasi FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa mengubah sertifikasi" ON public.akademi_sertifikasi FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- jamaah
DROP POLICY IF EXISTS "Jamaah dihapus pemilik atau admin" ON public.jamaah;
DROP POLICY IF EXISTS "Jamaah dilihat pemilik atau admin" ON public.jamaah;
DROP POLICY IF EXISTS "Jamaah ditambah oleh pemilik" ON public.jamaah;
DROP POLICY IF EXISTS "Jamaah diubah pemilik atau admin" ON public.jamaah;
CREATE POLICY "Jamaah dihapus pemilik atau admin" ON public.jamaah FOR DELETE TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Jamaah dilihat pemilik atau admin" ON public.jamaah FOR SELECT TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Jamaah ditambah oleh pemilik" ON public.jamaah FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Jamaah diubah pemilik atau admin" ON public.jamaah FOR UPDATE TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

-- profiles
DROP POLICY IF EXISTS "Mitra bisa melihat profil sendiri" ON public.profiles;
CREATE POLICY "Mitra bisa melihat profil sendiri" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR private.has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Admin bisa mengelola peran" ON public.user_roles;
CREATE POLICY "Admin bisa mengelola peran" ON public.user_roles FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- teritori: tighten SELECT + move write policies
DROP POLICY IF EXISTS "Admin bisa menambah teritori" ON public.teritori;
DROP POLICY IF EXISTS "Admin bisa menghapus teritori" ON public.teritori;
DROP POLICY IF EXISTS "Admin bisa mengubah teritori" ON public.teritori;
DROP POLICY IF EXISTS "Mitra masuk bisa melihat teritori" ON public.teritori;
CREATE POLICY "Admin bisa menambah teritori" ON public.teritori FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa menghapus teritori" ON public.teritori FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin bisa mengubah teritori" ON public.teritori FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Teritori dilihat pemilik atau admin" ON public.teritori FOR SELECT TO authenticated USING (
  private.has_role(auth.uid(), 'admin')
  OR (pemilik IS NOT NULL AND pemilik <> '' AND pemilik = (SELECT p.nama FROM public.profiles p WHERE p.id = auth.uid()))
);

-- drop the API-exposed SECURITY DEFINER function
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
