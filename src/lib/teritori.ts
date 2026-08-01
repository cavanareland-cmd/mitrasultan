import { supabase } from "@/integrations/supabase/client";

export type StatusTeritori =
  | "Aktif"
  | "Tersedia"
  | "Perencanaan"
  | "Retargeting"
  | "Blacklist";

export type TeritoriRow = {
  id: string;
  kecamatan: string;
  kabupaten: string;
  status: StatusTeritori;
  pemilik: string | null;
  populasi: number;
  potensi_pasar: number;
  dihubungi: number;
  leads_aktif: number;
  pending: number;
  lost: number;
  catatan: string;
};

/** Kelas warna peta per status (mengikuti legenda anti-kanibal). */
export const warnaStatus: Record<
  StatusTeritori,
  { blok: string; swatch: string; teks: string; label: string }
> = {
  Aktif: {
    blok: "bg-warning/85 border-warning text-background hover:bg-warning",
    swatch: "bg-warning",
    teks: "text-warning",
    label: "CLAIMED & ACTIVE",
  },
  Tersedia: {
    blok: "bg-muted-foreground/35 border-muted-foreground/60 text-foreground hover:bg-muted-foreground/45",
    swatch: "bg-muted-foreground/60",
    teks: "text-muted-foreground",
    label: "AVAILABLE / OPEN",
  },
  Perencanaan: {
    blok: "bg-info/80 border-info text-background hover:bg-info",
    swatch: "bg-info",
    teks: "text-info",
    label: "PLANNING / FUTURE",
  },
  Retargeting: {
    blok: "bg-chart-4/85 border-chart-4 text-background hover:bg-chart-4",
    swatch: "bg-chart-4",
    teks: "text-chart-4",
    label: "RETARGETING",
  },
  Blacklist: {
    blok: "bg-danger/85 border-danger text-background hover:bg-danger",
    swatch: "bg-danger",
    teks: "text-danger",
    label: "BLACKLIST / IGNORE",
  },
};

export const teritoriQueryOptions = {
  queryKey: ["teritori"],
  queryFn: async (): Promise<TeritoriRow[]> => {
    const { data, error } = await supabase
      .from("teritori")
      .select(
        "id, kecamatan, kabupaten, status, pemilik, populasi, potensi_pasar, dihubungi, leads_aktif, pending, lost, catatan",
      )
      .order("kabupaten", { ascending: true })
      .order("kecamatan", { ascending: true });
    if (error) throw error;
    return (data ?? []) as TeritoriRow[];
  },
};

export async function ubahStatusTeritori(id: string, status: StatusTeritori) {
  const { error } = await supabase.from("teritori").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function gantiAgenTeritori(id: string, pemilik: string | null) {
  const { error } = await supabase.from("teritori").update({ pemilik }).eq("id", id);
  if (error) throw error;
}
