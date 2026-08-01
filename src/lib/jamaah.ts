import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type StatusJamaah =
  | "Prospek"
  | "Tanya-tanya"
  | "DP"
  | "Pemberkasan"
  | "Lunas"
  | "Berangkat"
  | "Batal";

export const statusJamaahList: StatusJamaah[] = [
  "Prospek",
  "Tanya-tanya",
  "DP",
  "Pemberkasan",
  "Lunas",
  "Berangkat",
  "Batal",
];

export const paketList = ["Reguler", "Silver", "Gold", "Platinum", "Plus Turki"];

export type JamaahRow = {
  id: string;
  nama: string;
  telepon: string;
  kota: string;
  paket: string;
  status: StatusJamaah;
  nilai: number;
  sumber: string;
  catatan: string;
  mitra: string;
  updated_at: string;
};

export type JamaahInput = Omit<JamaahRow, "id" | "updated_at">;

export const warnaStatusJamaah: Record<StatusJamaah, string> = {
  Prospek: "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/40",
  "Tanya-tanya": "bg-info/15 text-info border-info/40",
  DP: "bg-warning/15 text-warning border-warning/40",
  Pemberkasan: "bg-chart-4/15 text-chart-4 border-chart-4/40",
  Lunas: "bg-success/15 text-success border-success/40",
  Berangkat: "bg-primary/15 text-primary border-primary/40",
  Batal: "bg-danger/15 text-danger border-danger/40",
};

const KOLOM = "id, nama, telepon, kota, paket, status, nilai, sumber, catatan, mitra, updated_at";

export const jamaahQueryOptions = {
  queryKey: ["jamaah"],
  queryFn: async (): Promise<JamaahRow[]> => {
    const { data, error } = await supabase
      .from("jamaah")
      .select(KOLOM)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as JamaahRow[];
  },
};

export async function tambahJamaah(input: JamaahInput) {
  const { error } = await supabase.from("jamaah").insert(input);
  if (error) throw error;
}

export async function ubahJamaah(id: string, input: Partial<JamaahInput>) {
  const { error } = await supabase.from("jamaah").update(input).eq("id", id);
  if (error) throw error;
}

export async function hapusJamaah(id: string) {
  const { error } = await supabase.from("jamaah").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Berlangganan perubahan realtime pada satu tabel, lalu menyegarkan cache query
 * agar dashboard semua mitra ikut ter-update tanpa refresh.
 */
export function useRealtimeTable(tabel: string, queryKey: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${tabel}`)
      .on("postgres_changes", { event: "*", schema: "public", table: tabel }, () => {
        queryClient.invalidateQueries({ queryKey });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabel, queryClient]);
}
