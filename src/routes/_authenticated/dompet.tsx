import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, Banknote, Medal, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import {
  agent,
  aktivitasFinansial,
  badges,
  dompet,
  formatRupiah,
  rincianPendapatan,
} from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dompet")({
  head: () => ({
    meta: [
      { title: "Dompet Mitra & Profil — Komisi Agen Umrah" },
      {
        name: "description",
        content:
          "Saldo komisi tersedia dan tertunda, rincian pendapatan, riwayat finansial, dan etalase prestasi agen.",
      },
      { property: "og:title", content: "Dompet Mitra & Profil" },
      {
        property: "og:description",
        content: "Kelola saldo komisi, pencairan dana, dan lencana pencapaian Anda.",
      },
    ],
  }),
  component: DompetPage,
});

function DompetPage() {
  const totalPendapatan = rincianPendapatan.reduce((a, r) => a + r.nilai, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        judul="Profil & Dompet Mitra"
        deskripsi="Kelola saldo komisi, pencairan dana, dan pencapaian kemitraan Anda."
      />

      {/* Kartu profil */}
      <Card className="surface-luxe">
        <CardContent className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-5 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-14 border border-primary/50">
              <AvatarFallback className="bg-secondary text-lg font-bold text-primary">
                AR
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-semibold">{agent.nama}</p>
              <p className="truncate text-xs text-muted-foreground">
                {agent.id} • {agent.kota} • Bergabung {agent.bergabung}
              </p>
            </div>
          </div>
          <Badge className="shrink-0 bg-primary text-primary-foreground">{agent.tier}</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Dompet komisi */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="size-5 text-primary" /> Dompet Komisi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                <p className="text-xs text-muted-foreground">Saldo Tersedia</p>
                <p className="font-display text-2xl font-bold text-gold-gradient">
                  {formatRupiah(dompet.tersedia)}
                </p>
                <Button
                  className="mt-3 w-full"
                  onClick={() => toast.success("Permintaan pencairan dikirim ke admin pusat")}
                >
                  <Banknote className="size-4" /> Cairkan Dana
                </Button>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-xs text-muted-foreground">Saldo Tertunda</p>
                <p className="font-display text-2xl font-bold">{formatRupiah(dompet.tertunda)}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Cair otomatis setelah jamaah berangkat dan berkas selesai diverifikasi.
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Rincian Pendapatan
              </p>
              {rincianPendapatan.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm">
                    <span>{r.label}</span>
                    <span className="font-semibold">{formatRupiah(r.nilai)}</span>
                  </div>
                  <Progress value={(r.nilai / totalPendapatan) * 100} className="mt-1.5 h-2" />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Total sepanjang waktu: {formatRupiah(dompet.totalSepanjangWaktu)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Etalase prestasi */}
        <Card className="surface-luxe">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Medal className="size-5 text-primary" /> Etalase Prestasi
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.nama}
                className={`rounded-xl border p-3 text-center ${
                  b.diraih
                    ? "border-primary/40 bg-primary/10"
                    : "border-border bg-secondary/30 opacity-60"
                }`}
              >
                <Medal
                  className={`mx-auto size-7 ${b.diraih ? "text-primary" : "text-muted-foreground"}`}
                />
                <p className="mt-1.5 text-xs font-semibold">{b.nama}</p>
                <p className="text-[10px] text-muted-foreground">{b.deskripsi}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Feed aktivitas finansial */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Feed Aktivitas Finansial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {aktivitasFinansial.map((a) => {
            const masuk = a.nilai > 0;
            return (
              <div
                key={a.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3"
              >
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                    masuk ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {masuk ? (
                    <ArrowDownLeft className="size-4" />
                  ) : (
                    <ArrowUpRight className="size-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.judul}</p>
                  <p className="text-xs text-muted-foreground">{a.waktu}</p>
                </div>
                <p
                  className={`shrink-0 text-sm font-semibold ${masuk ? "text-success" : "text-destructive"}`}
                >
                  {masuk ? "+" : "-"}
                  {formatRupiah(Math.abs(a.nilai))}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
