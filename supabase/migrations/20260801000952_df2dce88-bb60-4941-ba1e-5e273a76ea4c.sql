CREATE TYPE public.status_teritori AS ENUM ('Aktif','Tersedia','Perencanaan','Retargeting','Blacklist');

CREATE TABLE public.teritori (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kecamatan text NOT NULL,
  kabupaten text NOT NULL,
  status public.status_teritori NOT NULL DEFAULT 'Tersedia',
  pemilik text,
  populasi integer NOT NULL DEFAULT 0,
  potensi_pasar integer NOT NULL DEFAULT 0,
  dihubungi integer NOT NULL DEFAULT 0,
  leads_aktif integer NOT NULL DEFAULT 0,
  pending integer NOT NULL DEFAULT 0,
  lost integer NOT NULL DEFAULT 0,
  catatan text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kabupaten, kecamatan)
);

GRANT SELECT ON public.teritori TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teritori TO authenticated;
GRANT ALL ON public.teritori TO service_role;

ALTER TABLE public.teritori ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua bisa melihat teritori" ON public.teritori FOR SELECT USING (true);
CREATE POLICY "Pengguna masuk bisa menambah teritori" ON public.teritori FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Pengguna masuk bisa mengubah teritori" ON public.teritori FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Pengguna masuk bisa menghapus teritori" ON public.teritori FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_teritori_updated_at BEFORE UPDATE ON public.teritori
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.teritori (kecamatan, kabupaten, status, pemilik, populasi, potensi_pasar, dihubungi, leads_aktif, pending, lost, catatan) VALUES
('Kebomas','Gresik','Aktif','Aisyah',112665,15500,4200,980,550,2670,'Basis komunitas majelis taklim kuat, potensi grup keluarga besar.'),
('Gresik','Gresik','Aktif','Aisyah',79457,11200,3100,720,410,1850,'Pusat kota, banyak pedagang dan ASN.'),
('Manyar','Gresik','Perencanaan',NULL,119730,16800,900,180,120,340,'Kawasan industri, cocok skema cicilan ringan.'),
('Bungah','Gresik','Perencanaan',NULL,68598,9400,520,110,80,190,'Jaringan pesantren kuat, rencana ekspansi kuartal depan.'),
('Ujung Pangkah','Gresik','Aktif','Aisyah',51808,7100,1900,410,230,880,'Pesisir utara, respons baik pada promo Ramadhan.'),
('Panceng','Gresik','Aktif','Aisyah',52831,7300,1750,380,210,790,'Komunitas nelayan dan pesantren.'),
('Sidayu','Gresik','Tersedia',NULL,43835,6000,0,0,0,0,'Belum ada mitra yang klaim wilayah ini.'),
('Dukun','Gresik','Tersedia',NULL,65628,9000,0,0,0,0,'Terbuka untuk klaim mitra baru.'),
('Duduksampeyan','Gresik','Tersedia',NULL,49597,6800,0,0,0,0,'Belum tergarap sama sekali.'),
('Balongpanggang','Gresik','Tersedia',NULL,56397,7700,0,0,0,0,'Wilayah agraris, terbuka untuk klaim.'),
('Cerme','Gresik','Blacklist',NULL,82048,11300,1400,0,0,1400,'Riwayat kompetitor agresif & banyak prospek fiktif.'),
('Benjeng','Gresik','Blacklist',NULL,65904,9100,1100,0,0,1100,'Banyak prospek fiktif, sementara diabaikan.'),
('Menganti','Gresik','Retargeting','Fahmi',129230,18000,5100,640,1200,3260,'Prospek lama 2024 layak disentuh ulang dengan promo Ramadhan.'),
('Kedamean','Gresik','Retargeting','Fahmi',63709,8700,2300,290,540,1470,'Perlu edukasi ulang soal legalitas travel.'),
('Driyorejo','Gresik','Retargeting','Fahmi',105501,14600,4400,510,980,2910,'Sudah diklaim mitra lain — hindari kanibalisasi prospek.'),
('Wringinanom','Gresik','Retargeting','Fahmi',73047,10000,2800,330,610,1860,'Perbatasan Mojokerto, kompetisi cukup tinggi.'),
('Tambak','Gresik','Aktif','Aisyah',30555,4200,1200,260,150,590,'Pulau Bawean utara, closing tinggi via jaringan keluarga.'),
('Sangkapura','Gresik','Tersedia',NULL,53663,7400,0,0,0,0,'Pulau Bawean selatan, belum ada mitra.'),
('Lamongan Kota','Lamongan','Aktif','Aisyah',66500,9200,2600,540,300,1240,'Konversi tertinggi dari acara manasik akbar.'),
('Paciran','Lamongan','Perencanaan',NULL,98000,13500,700,140,90,260,'Wilayah pesisir, kuat di jaringan pondok pesantren.'),
('Babat','Lamongan','Tersedia',NULL,88000,12100,0,0,0,0,'Terbuka untuk klaim mitra baru.'),
('Brondong','Lamongan','Retargeting','Aisyah',56000,7700,2100,240,480,1380,'Butuh pendekatan ulang lewat komunitas nelayan.'),
('Tuban Kota','Tuban','Retargeting','Aisyah',94000,13000,3300,360,720,2220,'Perlu edukasi ulang soal legalitas travel.'),
('Jenu','Tuban','Tersedia',NULL,52000,7100,0,0,0,0,'Belum tergarap sama sekali.'),
('Bancar','Tuban','Blacklist',NULL,58000,8000,900,0,0,900,'Riwayat prospek bermasalah.'),
('Palang','Tuban','Perencanaan',NULL,64000,8800,450,90,60,150,'Rencana ekspansi bersama sub-mitra lokal.');