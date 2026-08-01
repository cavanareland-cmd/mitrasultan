import { supabase } from "@/integrations/supabase/client";

export type KategoriMateri = "Product Knowledge" | "Skill Marketing" | "Fikih Umrah";
export const kategoriMateriList: KategoriMateri[] = [
  "Product Knowledge",
  "Skill Marketing",
  "Fikih Umrah",
];

export type StatusSertifikasi = "Selesai" | "Berjalan" | "Terkunci";
export const statusSertifikasiList: StatusSertifikasi[] = ["Selesai", "Berjalan", "Terkunci"];

export type MateriRow = {
  id: string;
  judul: string;
  kategori: KategoriMateri;
  durasi: string;
  pemateri: string;
  progres: number;
  urutan: number;
};
export type MateriInput = Omit<MateriRow, "id">;

export type SertifikasiRow = {
  id: string;
  nama: string;
  status: StatusSertifikasi;
  progres: number;
  urutan: number;
};
export type SertifikasiInput = Omit<SertifikasiRow, "id">;

export type JadwalRow = {
  id: string;
  judul: string;
  tanggal: string;
  tipe: string;
  pemateri: string;
  urutan: number;
};
export type JadwalInput = Omit<JadwalRow, "id">;

export const materiQueryOptions = {
  queryKey: ["akademi_materi"],
  queryFn: async (): Promise<MateriRow[]> => {
    const { data, error } = await supabase
      .from("akademi_materi")
      .select("id, judul, kategori, durasi, pemateri, progres, urutan")
      .order("urutan", { ascending: true });
    if (error) throw error;
    return (data ?? []) as MateriRow[];
  },
};

export const sertifikasiQueryOptions = {
  queryKey: ["akademi_sertifikasi"],
  queryFn: async (): Promise<SertifikasiRow[]> => {
    const { data, error } = await supabase
      .from("akademi_sertifikasi")
      .select("id, nama, status, progres, urutan")
      .order("urutan", { ascending: true });
    if (error) throw error;
    return (data ?? []) as SertifikasiRow[];
  },
};

export const jadwalQueryOptions = {
  queryKey: ["akademi_jadwal"],
  queryFn: async (): Promise<JadwalRow[]> => {
    const { data, error } = await supabase
      .from("akademi_jadwal")
      .select("id, judul, tanggal, tipe, pemateri, urutan")
      .order("urutan", { ascending: true });
    if (error) throw error;
    return (data ?? []) as JadwalRow[];
  },
};

/* --------------------------------- Mutasi -------------------------------- */

export async function tambahMateri(input: MateriInput) {
  const { error } = await supabase.from("akademi_materi").insert(input);
  if (error) throw error;
}
export async function ubahMateri(id: string, input: Partial<MateriInput>) {
  const { error } = await supabase.from("akademi_materi").update(input).eq("id", id);
  if (error) throw error;
}
export async function hapusMateri(id: string) {
  const { error } = await supabase.from("akademi_materi").delete().eq("id", id);
  if (error) throw error;
}

export async function tambahSertifikasi(input: SertifikasiInput) {
  const { error } = await supabase.from("akademi_sertifikasi").insert(input);
  if (error) throw error;
}
export async function ubahSertifikasi(id: string, input: Partial<SertifikasiInput>) {
  const { error } = await supabase.from("akademi_sertifikasi").update(input).eq("id", id);
  if (error) throw error;
}
export async function hapusSertifikasi(id: string) {
  const { error } = await supabase.from("akademi_sertifikasi").delete().eq("id", id);
  if (error) throw error;
}

export async function tambahJadwal(input: JadwalInput) {
  const { error } = await supabase.from("akademi_jadwal").insert(input);
  if (error) throw error;
}
export async function ubahJadwal(id: string, input: Partial<JadwalInput>) {
  const { error } = await supabase.from("akademi_jadwal").update(input).eq("id", id);
  if (error) throw error;
}
export async function hapusJadwal(id: string) {
  const { error } = await supabase.from("akademi_jadwal").delete().eq("id", id);
  if (error) throw error;
}
