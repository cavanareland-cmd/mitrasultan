import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { leaderboard, type Peringkat } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard Mitra — Papan Peringkat Agen Umrah" },
      {
        name: "description",
        content:
          "Liga kemitraan Reguler hingga VIP, podium top 3, dan peringkat lengkap agen bulan ini.",
      },
      { property: "og:title", content: "Leaderboard Mitra Sultan Haramain" },
      {
        property: "og:description",
        content: "Papan peringkat gamifikasi agen: liga, podium, dan posisi Anda.",
      },
    ],
  }),
  component: LeaderboardPage,
});

const liga = ["Semua", "VIP", "Gold", "Silver", "Reguler"] as const;

const inisial = (nama: string) =>
  nama
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

function LeaderboardPage() {
  const [ligaAktif, setLigaAktif] = useState<(typeof liga)[number]>("Semua");
  const [periode, setPeriode] = useState<"Bulan Ini" | "Sepanjang Waktu">("Bulan Ini");

  const daftar = leaderboard.filter((p) => ligaAktif === "Semua" || p.liga === ligaAktif);
  const podium = leaderboard.slice(0, 3);
  const saya = leaderboard.find((p) => p.saya)!;
  const urutanPodium = [podium[1], podium[0], podium[2]].filter(Boolean) as Peringkat[];

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-24">
      <PageHeader
        judul="Papan Peringkat"
        deskripsi="Kompetisi sehat antar mitra untuk meraih reward dan tier tertinggi."
        aksi={
          <Button
            variant="outline"
            onClick={() =>
              setPeriode((p) => (p === "Bulan Ini" ? "Sepanjang Waktu" : "Bulan Ini"))
            }
          >
            {periode}
          </Button>
        }
      />

      {/* Liga kemitraan — navigasi geser horizontal */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-3">
          {liga.map((l) => (
            <button
              key={l}
              onClick={() => setLigaAktif(l)}
              className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                ligaAktif === l
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
              }`}
            >
              Liga {l}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Podium top 3 */}
      <Card className="surface-luxe">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="size-5 text-primary" /> Podium Top 3 — {periode}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 items-end gap-3">
          {urutanPodium.map((p) => {
            const juara = p.posisi === 1;
            return (
              <div key={p.posisi} className="text-center">
                <Avatar
                  className={`mx-auto ${juara ? "size-16 border-2" : "size-12 border"} border-primary/60`}
                >
                  <AvatarFallback className="bg-secondary font-bold text-primary">
                    {inisial(p.nama)}
                  </AvatarFallback>
                </Avatar>
                {juara && <Crown className="mx-auto mt-1 size-5 text-primary" />}
                <p className="mt-1 truncate text-xs font-semibold sm:text-sm">{p.nama}</p>
                <p className="truncate text-[11px] text-muted-foreground">{p.wilayah}</p>
                <div
                  className={`mt-2 rounded-t-xl border border-primary/30 bg-primary/10 p-2 ${
                    juara ? "h-24" : p.posisi === 2 ? "h-16" : "h-12"
                  }`}
                >
                  <p className="font-display text-xl font-bold text-gold-gradient">#{p.posisi}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.poin.toLocaleString("id-ID")} poin
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Daftar peringkat lengkap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Peringkat Lengkap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {daftar.map((p) => (
            <div
              key={p.posisi}
              className={`grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 ${
                p.saya ? "border-primary bg-primary/10" : "border-border bg-secondary/40"
              }`}
            >
              <span className="w-6 shrink-0 text-center font-display text-lg font-bold">
                {p.posisi}
              </span>
              <Avatar className="size-9 shrink-0 border border-primary/30">
                <AvatarFallback className="bg-secondary text-xs text-primary">
                  {inisial(p.nama)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.nama}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.wilayah} • {p.jamaah} jamaah
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-primary">
                  {p.poin.toLocaleString("id-ID")}
                </p>
                <Badge variant="secondary" className="text-[10px]">
                  {p.liga}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sticky row posisi saya */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-primary/30 bg-background/95 p-3 backdrop-blur-md">
        <div className="mx-auto grid max-w-5xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary font-display font-bold text-primary-foreground">
            {saya.posisi}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Posisi Anda — {saya.nama}</p>
            <p className="truncate text-xs text-muted-foreground">
              {saya.poin.toLocaleString("id-ID")} poin • Liga {saya.liga}
            </p>
          </div>
          <Medal className="size-5 shrink-0 text-primary" />
        </div>
      </div>
    </div>
  );
}
