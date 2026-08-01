import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, CalendarDays, Lock, PlayCircle, Video } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { useRealtimeTable } from "@/lib/jamaah";
import {
  jadwalQueryOptions,
  materiQueryOptions,
  sertifikasiQueryOptions,
} from "@/lib/akademi";

export const Route = createFileRoute("/akademi")({
  head: () => ({
    meta: [
      { title: "Akademi Kemitraan — Mini LMS Agen Umrah" },
      {
        name: "description",
        content:
          "Video edukasi product knowledge, skill marketing, dan fikih Umrah lengkap dengan sertifikasi dan jadwal training.",
      },
      { property: "og:title", content: "Akademi Kemitraan — Mini LMS Agen Umrah" },
      {
        property: "og:description",
        content: "Belajar kapan saja: materi produk, marketing, fikih, plus sertifikasi agen.",
      },
    ],
  }),
  component: AkademiPage,
});

const kategori = ["Semua", "Product Knowledge", "Skill Marketing", "Fikih Umrah"] as const;

function AkademiPage() {
  const [tab, setTab] = useState<(typeof kategori)[number]>("Semua");

  useRealtimeTable("akademi_materi", ["akademi_materi"]);
  useRealtimeTable("akademi_sertifikasi", ["akademi_sertifikasi"]);
  useRealtimeTable("akademi_jadwal", ["akademi_jadwal"]);

  const { data: materiAkademi = [] } = useQuery(materiQueryOptions);
  const { data: sertifikasi = [] } = useQuery(sertifikasiQueryOptions);
  const { data: jadwalTraining = [] } = useQuery(jadwalQueryOptions);

  const rataProgres = materiAkademi.length
    ? Math.round(materiAkademi.reduce((a, m) => a + m.progres, 0) / materiAkademi.length)
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        judul="Akademi Kemitraan"
        deskripsi="Tingkatkan kompetensi Anda lewat materi terkurasi dari kantor pusat."
        aksi={<Badge className="bg-primary text-primary-foreground">Progres {rataProgres}%</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Galeri video */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Video className="size-5 text-primary" /> Galeri Video Edukasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="flex w-full flex-wrap justify-start">
                {kategori.map((k) => (
                  <TabsTrigger key={k} value={k} className="text-xs">
                    {k}
                  </TabsTrigger>
                ))}
              </TabsList>
              {kategori.map((k) => (
                <TabsContent key={k} value={k} className="mt-4 grid gap-3 sm:grid-cols-2">
                  {materiAkademi
                    .filter((m) => k === "Semua" || m.kategori === k)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="group rounded-xl border border-border bg-secondary/40 p-4 transition-colors hover:border-primary/50"
                      >
                        <div className="mb-3 grid h-24 place-items-center rounded-lg bg-primary/10">
                          <PlayCircle className="size-9 text-primary transition-transform group-hover:scale-110" />
                        </div>
                        <Badge variant="outline" className="border-primary/40 text-[10px] text-primary">
                          {m.kategori}
                        </Badge>
                        <p className="mt-2 text-sm font-semibold">{m.judul}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.pemateri} • {m.durasi}
                        </p>
                        <Progress value={m.progres} className="mt-3 h-1.5" />
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {m.progres === 0
                            ? "Belum dimulai"
                            : m.progres === 100
                              ? "Selesai ditonton"
                              : `Tersimpan di ${m.progres}%`}
                        </p>
                      </div>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Sertifikasi */}
          <Card className="surface-luxe">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="size-5 text-primary" /> Sertifikasi &amp; Progres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sertifikasi.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{s.nama}</p>
                    {s.status === "Terkunci" ? (
                      <Lock className="size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {s.status}
                      </Badge>
                    )}
                  </div>
                  <Progress value={s.progres} className="mt-2 h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Jadwal training */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="size-5 text-primary" /> Jadwal Training
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jadwalTraining.map((j) => (
                <div key={j.id} className="rounded-xl border border-border bg-secondary/40 p-3">
                  <p className="text-sm font-semibold">{j.judul}</p>
                  <p className="text-xs text-primary">{j.tanggal}</p>
                  <p className="text-xs text-muted-foreground">
                    {j.tipe} • {j.pemateri}
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 w-full">
                    Daftar Sesi
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
