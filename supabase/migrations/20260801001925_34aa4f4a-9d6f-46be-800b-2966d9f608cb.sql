CREATE TYPE public.status_jamaah AS ENUM ('Prospek','Tanya-tanya','DP','Pemberkasan','Lunas','Berangkat','Batal');

CREATE TABLE public.jamaah (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  telepon text NOT NULL DEFAULT '',
  kota text NOT NULL DEFAULT '',
  paket text NOT NULL DEFAULT 'Reguler',
  status public.status_jamaah NOT NULL DEFAULT 'Prospek',
  nilai bigint NOT NULL DEFAULT 0,
  sumber text NOT NULL DEFAULT '',
  catatan text NOT NULL DEFAULT '',
  mitra text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.jamaah TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jamaah TO authenticated;
GRANT ALL ON public.jamaah TO service_role;

ALTER TABLE public.jamaah ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua bisa melihat jamaah" ON public.jamaah FOR SELECT USING (true);
CREATE POLICY "Semua bisa menambah jamaah" ON public.jamaah FOR INSERT WITH CHECK (true);
CREATE POLICY "Semua bisa mengubah jamaah" ON public.jamaah FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Semua bisa menghapus jamaah" ON public.jamaah FOR DELETE USING (true);

CREATE TRIGGER trg_jamaah_updated_at BEFORE UPDATE ON public.jamaah
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_teritori_updated_at BEFORE UPDATE ON public.teritori
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.jamaah REPLICA IDENTITY FULL;
ALTER TABLE public.teritori REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jamaah;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teritori;