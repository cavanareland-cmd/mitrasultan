import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Calculator,
  Compass,
  MapPin,
  MoonStar,
  Notebook,
  Sunrise,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { infoHijriah, jadwalSholat } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/muslim")({
  head: () => ({
    meta: [
      { title: "Alat Muslim Harian — Jadwal Sholat & Utilitas" },
      {
        name: "description",
        content:
          "Jadwal sholat real-time, penanggalan Hijriah, arah kiblat, tasbih digital, dan panduan manasik untuk mitra.",
      },
      { property: "og:title", content: "Alat Muslim Harian" },
      {
        property: "og:description",
        content: "Jadwal sholat, hitung mundur, Al-Quran, tasbih, kiblat, dan kalkulator zakat.",
      },
    ],
  }),
  component: MuslimPage,
});

const menuGrid = [
  { nama: "Al-Quran", icon: BookOpen },
  { nama: "Tasbih Digital", icon: MoonStar },
  { nama: "Arah Kiblat", icon: Compass },
  { nama: "Kalkulator Zakat", icon: Calculator },
  { nama: "Buku Saku Manasik", icon: Notebook },
  { nama: "Doa Harian", icon: Sunrise },
];

/** Hitung sholat berikutnya dan sisa waktunya dari jam perangkat. */
function useHitungMundur() {
  const [teks, setTeks] = useState({ nama: "Subuh", sisa: "--:--:--" });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const menitSekarang = now.getHours() * 60 + now.getMinutes();
      const berikut =
        jadwalSholat.find((s) => {
          const [h, m] = s.waktu.split(":").map(Number);
          return h! * 60 + m! > menitSekarang;
        }) ?? jadwalSholat[0]!;
      const [h, m] = berikut.waktu.split(":").map(Number);
      let selisih = h! * 3600 + m! * 60 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());
      if (selisih < 0) selisih += 24 * 3600;
      const jj = String(Math.floor(selisih / 3600)).padStart(2, "0");
      const mm = String(Math.floor((selisih % 3600) / 60)).padStart(2, "0");
      const ss = String(selisih % 60).padStart(2, "0");
      setTeks({ nama: berikut.nama, sisa: `${jj}:${mm}:${ss}` });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return teks;
}

function MuslimPage() {
  const mundur = useHitungMundur();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        judul="Alat Muslim Harian"
        deskripsi="Pendamping ibadah harian untuk mitra dan calon jamaah."
      />

      {/* Widget utama jadwal sholat */}
      <Card className="surface-luxe">
        <CardContent className="space-y-5 p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" /> {infoHijriah.lokasi}
              </p>
              <p className="mt-1 truncate font-display text-2xl font-semibold">
                {infoHijriah.hijriah}
              </p>
              <p className="text-xs text-muted-foreground">{infoHijriah.masehi}</p>
            </div>
            <Badge className="shrink-0 bg-primary text-primary-foreground">Real-time</Badge>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
            <p className="text-xs text-muted-foreground">Menuju waktu {mundur.nama}</p>
            <p className="font-display text-4xl font-bold text-gold-gradient tabular-nums">
              {mundur.sisa}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {jadwalSholat.map((s) => (
              <div
                key={s.nama}
                className={`rounded-lg border p-2 text-center ${
                  s.nama === mundur.nama
                    ? "border-primary bg-primary/15"
                    : "border-border bg-secondary/40"
                }`}
              >
                <p className="text-[11px] text-muted-foreground">{s.nama}</p>
                <p className="font-display text-sm font-bold sm:text-base">{s.waktu}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Menu grid fungsional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Menu Cepat</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {menuGrid.map((m) => (
            <button
              key={m.nama}
              onClick={() => toast(`${m.nama} akan segera dibuka`)}
              className="rounded-xl border border-border bg-secondary/40 p-4 text-center transition-colors hover:border-primary/50"
            >
              <m.icon className="mx-auto size-7 text-primary" />
              <p className="mt-2 text-xs font-medium">{m.nama}</p>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
