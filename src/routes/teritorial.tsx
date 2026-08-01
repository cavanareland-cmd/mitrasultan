import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Ban,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Signal,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/layout/page-header";
import {
  gantiAgenTeritori,
  teritoriQueryOptions,
  ubahStatusTeritori,
  warnaStatus,
  type StatusTeritori,
  type TeritoriRow,
} from "@/lib/teritori";

export const Route = createFileRoute("/teritorial")({
  head: () => ({
    meta: [
      { title: "Territory Manager — Mitra Sultan Haramain Gresik" },
      {
        name: "description",
        content:
          "Peta zonasi wilayah Gresik, Lamongan, dan Tuban dengan status klaim agen, peta panas populasi, dan sistem anti-kanibal prospek.",
      },
      { property: "og:title", content: "Sultan Haramain Territory Manager" },
      {
        property: "og:description",
        content: "Zonasi wilayah kemitraan Umrah dengan status klaim, riset pasar, dan funnel leads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeritorialPage,
});

const urutanStatus: StatusTeritori[] = [
  "Aktif",
  "Tersedia",
  "Perencanaan",
  "Retargeting",
  "Blacklist",
];

const legenda: { status: StatusTeritori; warna: string }[] = [
  { status: "Aktif", warna: "Kuning" },
  { status: "Tersedia", warna: "Abu-abu" },
  { status: "Perencanaan", warna: "Biru" },
  { status: "Retargeting", warna: "Oranye" },
  { status: "Blacklist", warna: "Merah" },
];

const agenTersedia = ["Aisyah", "Fahmi", "Umi Kholifah", "Syaiful Anam"];

function TeritorialPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery(teritoriQueryOptions);
  const [kota, setKota] = useState("GRESIK");
  const [idDipilih, setIdDipilih] = useState<string | null>(null);
  const [panasPopulasi, setPanasPopulasi] = useState(true);
  const [panasMenengah, setPanasMenengah] = useState(false);

  const semua = useMemo(() => data ?? [], [data]);
  const daftarKota = useMemo(
    () => Array.from(new Set(semua.map((t) => t.kabupaten.toUpperCase()))).sort(),
    [semua],
  );
  const wilayah = useMemo(
    () => semua.filter((t) => t.kabupaten.toUpperCase() === kota),
    [semua, kota],
  );
  const dipilih = semua.find((t) => t.id === idDipilih) ?? null;
  const totalPopulasi = wilayah.reduce((a, t) => a + t.populasi, 0);
  const maxPopulasi = Math.max(1, ...wilayah.map((t) => t.populasi));

  const mutasiStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusTeritori }) =>
      ubahStatusTeritori(id, status),
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries({ queryKey: ["teritori"] });
      toast.success(`Status wilayah diubah menjadi ${v.status}`);
    },
    onError: () => toast.error("Gagal menyimpan. Masuk sebagai mitra untuk mengubah data."),
  });

  const mutasiAgen = useMutation({
    mutationFn: ({ id, pemilik }: { id: string; pemilik: string | null }) =>
      gantiAgenTeritori(id, pemilik),
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries({ queryKey: ["teritori"] });
      toast.success(v.pemilik ? `Wilayah dialihkan ke ${v.pemilik}` : "Kepemilikan wilayah dilepas");
    },
    onError: () => toast.error("Gagal menyimpan. Masuk sebagai mitra untuk mengubah data."),
  });

  const detail = dipilih ? (
    <PanelDetail
      teritori={dipilih}
      onTutup={() => setIdDipilih(null)}
      onUbahStatus={(status) => mutasiStatus.mutate({ id: dipilih.id, status })}
      onGantiAgen={(pemilik) => mutasiAgen.mutate({ id: dipilih.id, pemilik })}
    />
  ) : null;

  return (
    <div className="mx-auto max-w-[100rem] space-y-6">
      <PageHeader
        judul="Sultan Haramain Territory Manager"
        deskripsi="Zonasi wilayah garapan mitra dengan sistem anti-kanibal antar agen — data langsung dari database."
        aksi={
          <Button variant="outline">
            <ShieldCheck className="size-4" /> Ajukan Klaim Wilayah
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        {/* Panel filter & legenda */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm tracking-wide uppercase">Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={kota} onValueChange={setKota}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kota" />
                </SelectTrigger>
                <SelectContent>
                  {daftarKota.map((k) => (
                    <SelectItem key={k} value={k}>
                      Kota: {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm leading-snug tracking-wide uppercase">
                Legenda Status Wilayah &amp; Sistem &apos;Anti-Kanibal&apos;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {legenda.map((l) => (
                <div key={l.status} className="flex items-start gap-2.5 text-xs">
                  <span
                    className={`mt-0.5 size-4 shrink-0 rounded-sm ${warnaStatus[l.status].swatch}`}
                  />
                  <p className="min-w-0">
                    <span className="font-semibold">{l.warna}:</span>{" "}
                    <span className="text-muted-foreground">{warnaStatus[l.status].label}</span>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm tracking-wide uppercase">
                Peta Panas Data Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={panasPopulasi}
                  onCheckedChange={(v) => setPanasPopulasi(v === true)}
                />
                Kepadatan Penduduk Muslim
              </label>
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={panasMenengah}
                  onCheckedChange={(v) => setPanasMenengah(v === true)}
                />
                Target Pasar Menengah Atas
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Peta wilayah */}
        <Card className="surface-luxe">
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
            <CardTitle className="flex min-w-0 items-center gap-2 text-base">
              <MapPin className="size-5 shrink-0 text-primary" />
              <span className="truncate">Peta Wilayah Kabupaten {kota}</span>
            </CardTitle>
            <p className="shrink-0 text-right text-xs text-muted-foreground">
              Populasi {totalPopulasi.toLocaleString("id-ID")}
              <br />
              Sumber: BPS 2023
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : isError ? (
              <p className="py-10 text-center text-sm text-destructive">
                Gagal memuat data wilayah dari database.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {wilayah.map((t) => {
                  const intensitas = panasPopulasi
                    ? 0.7 + (t.populasi / maxPopulasi) * 0.3
                    : 1;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setIdDipilih(t.id)}
                      style={{ opacity: intensitas }}
                      className={`rounded-xl border p-4 text-left transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${warnaStatus[t.status].blok} ${idDipilih === t.id ? "ring-2 ring-primary" : ""}`}
                    >
                      <p className="text-sm leading-tight font-bold break-words">{t.kecamatan}</p>
                      <p className="text-[11px] font-semibold opacity-80">
                        {t.populasi.toLocaleString("id-ID")}
                      </p>
                      <p className="mt-2 truncate text-[11px] opacity-90">
                        {t.pemilik ? `Agen: ${t.pemilik}` : "Belum ada pemilik"}
                      </p>
                      {panasMenengah && (
                        <p className="mt-1 truncate text-[11px] font-semibold opacity-90">
                          Potensi: {t.potensi_pasar.toLocaleString("id-ID")}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail wilayah — kolom kanan di layar lebar */}
        <div className="hidden xl:block">
          <div className="sticky top-20">
            {detail ?? (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  Pilih salah satu kecamatan pada peta untuk melihat detail wilayah.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Detail wilayah — sheet di layar kecil */}
      <Sheet
        open={!!dipilih}
        onOpenChange={(o) => {
          if (!o) setIdDipilih(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto p-4 sm:max-w-md xl:hidden">
          {detail}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PanelDetail({
  teritori,
  onTutup,
  onUbahStatus,
  onGantiAgen,
}: {
  teritori: TeritoriRow;
  onTutup: () => void;
  onUbahStatus: (s: StatusTeritori) => void;
  onGantiAgen: (p: string | null) => void;
}) {
  const w = warnaStatus[teritori.status];
  const funnel = [
    { l: "Potensi Pasar", v: teritori.potensi_pasar, c: "bg-info", i: Users, ket: "(Estimasi)" },
    { l: "Berhasil Dihubungi", v: teritori.dihubungi, c: "bg-info/60", i: Phone, ket: "" },
    { l: "Leads Aktif", v: teritori.leads_aktif, c: "bg-warning", i: Signal, ket: "" },
    { l: "Ragu-ragu (Pending)", v: teritori.pending, c: "bg-chart-4", i: AlertCircle, ket: "" },
    { l: "Gagal (Lost)", v: teritori.lost, c: "bg-danger", i: XCircle, ket: "" },
  ];
  const maks = Math.max(1, ...funnel.map((f) => f.v));

  return (
    <Card>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Detail Wilayah:</p>
          <CardTitle className="truncate font-display text-xl">
            KECAMATAN {teritori.kecamatan.toUpperCase()}
          </CardTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge className={`${w.swatch} border-0 text-background`}>{w.label}</Badge>
            <span className="text-xs text-muted-foreground">
              {teritori.pemilik ? `(Agen: ${teritori.pemilik})` : "(Belum ada agen)"}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0" onClick={onTutup}>
          <X className="size-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {funnel.map((f, idx) => {
            const lebar = 42 + (f.v / maks) * 58;
            const Ikon = f.i;
            return (
              <div key={f.l} className="flex items-center gap-3">
                <div className="flex w-[38%] shrink-0 justify-center">
                  <div
                    className={`h-6 rounded-sm ${f.c}`}
                    style={{ width: `${lebar - idx * 4}%`, opacity: 0.9 }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
                    <Ikon className="size-3.5 shrink-0" /> {f.l} {f.ket}
                  </p>
                  <p className="font-display text-base font-bold">
                    {f.v.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
          {teritori.catatan}
        </p>

        <Button className="w-full" onClick={() => toast(`Membuka leads ${teritori.kecamatan}`)}>
          Lihat Semua Leads Wilayah
        </Button>

        <div className="grid grid-cols-3 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Ganti Agen
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {agenTersedia.map((a) => (
                <DropdownMenuItem key={a} onClick={() => onGantiAgen(a)}>
                  {a}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => onGantiAgen(null)}>
                <Ban className="size-4" /> Lepas kepemilikan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary">
                <RefreshCw className="size-3.5" /> Ubah Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {urutanStatus.map((s) => (
                <DropdownMenuItem key={s} onClick={() => onUbahStatus(s)}>
                  <span className={`size-3 rounded-sm ${warnaStatus[s].swatch}`} /> {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={onTutup}>
            Tutup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
