import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Ban, Flag, MapPin, ShieldCheck, Target } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader } from "@/components/layout/page-header";
import { teritori, warnaStatusTeritori, type StatusTeritori, type Teritori } from "@/lib/data";

export const Route = createFileRoute("/teritorial")({
  head: () => ({
    meta: [
      { title: "Peta Teritorial & Anti-Kanibal — Mitra Sultan Haramain" },
      {
        name: "description",
        content:
          "Peta zonasi wilayah Gresik, Lamongan, dan Tuban dengan status klaim agen untuk mencegah kanibalisasi prospek.",
      },
      { property: "og:title", content: "Peta Teritorial & Anti-Kanibal" },
      {
        property: "og:description",
        content: "Zonasi wilayah kemitraan Umrah dengan status klaim dan riset pasar.",
      },
    ],
  }),
  component: TeritorialPage,
});

const legenda: { status: StatusTeritori; arti: string }[] = [
  { status: "Aktif", arti: "Diklaim & aktif oleh agen" },
  { status: "Tersedia", arti: "Terbuka untuk diklaim" },
  { status: "Perencanaan", arti: "Proyeksi ekspansi" },
  { status: "Retargeting", arti: "Prospek lama disentuh ulang" },
  { status: "Blacklist", arti: "Diabaikan / bermasalah" },
];

function TeritorialPage() {
  const [dipilih, setDipilih] = useState<Teritori | null>(null);
  const kabupaten = ["Gresik", "Lamongan", "Tuban"];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        judul="Peta Teritorial"
        deskripsi="Zonasi wilayah garapan mitra dengan sistem anti-kanibal antar agen."
        aksi={
          <Button variant="outline">
            <ShieldCheck className="size-4" /> Ajukan Klaim Wilayah
          </Button>
        }
      />

      {/* Legenda warna */}
      <Card>
        <CardContent className="flex flex-wrap gap-3 p-4">
          {legenda.map((l) => (
            <div key={l.status} className="flex items-center gap-2 text-xs">
              <span className={`size-3.5 rounded-sm border ${warnaStatusTeritori[l.status]}`} />
              <span className="font-medium">{l.status}</span>
              <span className="text-muted-foreground">— {l.arti}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Peta visual berbasis grid distrik */}
      <Card className="surface-luxe">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="size-5 text-primary" /> Peta Wilayah Interaktif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {kabupaten.map((kab) => (
            <div key={kab}>
              <p className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                Kabupaten {kab}
              </p>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {teritori
                  .filter((t) => t.kabupaten === kab)
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setDipilih(t)}
                      className={`rounded-xl border p-4 text-left transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${warnaStatusTeritori[t.status]}`}
                    >
                      <p className="truncate text-sm font-semibold text-foreground">
                        {t.kecamatan}
                      </p>
                      <p className="mt-1 text-[11px] opacity-90">{t.status}</p>
                      <p className="mt-2 truncate text-[11px] text-muted-foreground">
                        {t.pemilik ? `Agen: ${t.pemilik}` : "Belum ada pemilik"}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sidebar detail teritori */}
      <Sheet open={!!dipilih} onOpenChange={(o) => !o && setDipilih(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {dipilih && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">
                  Kec. {dipilih.kecamatan}
                </SheetTitle>
                <SheetDescription>
                  Kabupaten {dipilih.kabupaten} •{" "}
                  {dipilih.pemilik ? `Dikelola ${dipilih.pemilik}` : "Wilayah belum diklaim"}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-6">
                <Badge className={`border ${warnaStatusTeritori[dipilih.status]}`}>
                  Status: {dipilih.status}
                </Badge>

                <div>
                  <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
                    Riset Pasar
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { l: "Estimasi Target", v: dipilih.populasiTarget },
                      { l: "Sudah Dihubungi", v: dipilih.dihubungi },
                      { l: "Leads Aktif", v: dipilih.leadsAktif },
                      { l: "Pending", v: dipilih.pending },
                      { l: "Lost", v: dipilih.lost },
                    ].map((s) => (
                      <div key={s.l} className="rounded-lg border border-border bg-secondary/40 p-3">
                        <p className="text-[11px] text-muted-foreground">{s.l}</p>
                        <p className="font-display text-xl font-bold">
                          {s.v.toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Penetrasi pasar</span>
                    <span className="text-primary">
                      {Math.round((dipilih.dihubungi / dipilih.populasiTarget) * 100)}%
                    </span>
                  </div>
                  <Progress value={(dipilih.dihubungi / dipilih.populasiTarget) * 100} />
                </div>

                <p className="rounded-lg border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
                  {dipilih.catatan}
                </p>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => toast.success(`Pengajuan klaim ${dipilih.kecamatan} dikirim`)}
                  >
                    <Target className="size-4" /> Klaim / Perbarui Wilayah
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => toast(`${dipilih.kecamatan} ditandai untuk retargeting`)}
                  >
                    <Flag className="size-4" /> Tandai Retargeting
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-destructive"
                    onClick={() => toast.error(`${dipilih.kecamatan} masuk daftar blacklist`)}
                  >
                    <Ban className="size-4" /> Masukkan Blacklist
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
