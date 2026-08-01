import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Filter, LayoutTemplate, MessageCircle, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { prospek, type Prospek } from "@/lib/data";

export const Route = createFileRoute("/segmentasi")({
  head: () => ({
    meta: [
      { title: "Segmentasi Jamaah — Smart Segments Mitra Sultan Haramain" },
      {
        name: "description",
        content:
          "Bangun segmen jamaah cerdas dengan kombinasi kondisi status, jatuh tempo, dan minat paket, lalu broadcast WhatsApp ke segmen tersebut.",
      },
      { property: "og:title", content: "Segmentasi Jamaah — Smart Segments" },
      {
        property: "og:description",
        content: "Segment builder CRM untuk mitra Umrah: filter jamaah, lalu broadcast WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SegmentasiPage,
});

type Kondisi = { field: string; operator: string; nilai: string };

type Template = {
  id: string;
  nama: string;
  deskripsi: string;
  kondisi: Kondisi[];
  filter: (p: Prospek) => boolean;
};

const templates: Template[] = [
  {
    id: "s1",
    nama: "Reminder Pelunasan",
    deskripsi: "Jamaah yang sudah DP, jatuh tempo < 7 hari.",
    kondisi: [
      { field: "Status", operator: "=", nilai: "DP" },
      { field: "Jatuh Tempo", operator: "<", nilai: "7 hari" },
    ],
    filter: (p) => p.status === "DP" && p.jatuhTempoHari < 7,
  },
  {
    id: "s2",
    nama: "Peringatan Dokumen",
    deskripsi: "Lunas tapi Paspor/KTP belum lengkap.",
    kondisi: [
      { field: "Status", operator: "=", nilai: "Lunas" },
      { field: "Dokumen", operator: "≠", nilai: "Lengkap" },
    ],
    filter: (p) => p.status === "Lunas" || p.status === "Pemberkasan",
  },
  {
    id: "s3",
    nama: "Follow-up Prospek Hangat",
    deskripsi: "Leads baru 7 hari terakhir yang belum DP.",
    kondisi: [
      { field: "Status", operator: "=", nilai: "Belum DP" },
      { field: "Leads Masuk", operator: "<", nilai: "7 hari" },
    ],
    filter: (p) => p.status === "Tanya-tanya",
  },
];

function SegmentasiPage() {
  const [aktif, setAktif] = useState<Template>(templates[0]!);
  const [bukaPanel, setBukaPanel] = useState(false);

  const hasil = prospek.filter(aktif.filter);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        judul="Segmentasi Jamaah"
        deskripsi="Bangun segmen cerdas dari basis data jamaah, lalu jalankan aksi massal dalam satu klik."
        aksi={
          <Sheet open={bukaPanel} onOpenChange={setBukaPanel}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <LayoutTemplate className="size-4" /> Templates
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Template Segmen</SheetTitle>
                <SheetDescription>
                  Pilih resep segmentasi siap pakai untuk mempercepat follow-up harian.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-3 px-4 pb-6">
                {templates.map((t) => {
                  const jumlah = prospek.filter(t.filter).length;
                  return (
                    <div
                      key={t.id}
                      className={`rounded-xl border bg-secondary/40 p-4 transition-colors hover:border-primary/70 hover:bg-secondary/70 ${
                        t.id === aktif.id ? "border-primary/70" : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-base font-semibold">{t.nama}</p>
                        <Badge variant="outline" className="shrink-0 border-primary/40">
                          {jumlah} jamaah
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{t.deskripsi}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {t.kondisi.map((k, i) => (
                          <span key={k.field} className="flex items-center gap-1.5">
                            {i > 0 && (
                              <span className="text-[10px] font-bold tracking-widest text-primary">
                                AND
                              </span>
                            )}
                            <Badge variant="secondary" className="text-[11px] font-normal">
                              {k.field} {k.operator} {k.nilai}
                            </Badge>
                          </span>
                        ))}
                      </div>
                      <Button
                        className="mt-4 w-full"
                        variant={t.id === aktif.id ? "default" : "outline"}
                        onClick={() => {
                          setAktif(t);
                          setBukaPanel(false);
                          toast.success(`Segmen "${t.nama}" diterapkan`);
                        }}
                      >
                        <Sparkles className="size-4" /> Gunakan Template
                      </Button>
                    </div>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      {/* Segmen aktif + condition builder */}
      <Card className="surface-luxe">
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs tracking-wider text-muted-foreground uppercase">Segmen Aktif</p>
            <CardTitle className="font-display truncate text-xl">{aktif.nama}</CardTitle>
          </div>
          <Badge className="shrink-0 gap-1.5">
            <Users className="size-3.5" /> {hasil.length} jamaah
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <p className="mb-3 flex items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase">
              <Filter className="size-3.5" /> Kondisi Segmen
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {aktif.kondisi.map((k, i) => (
                <span key={k.field} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-xs font-bold tracking-widest text-primary">AND</span>
                  )}
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    <span className="text-muted-foreground">{k.field}</span>
                    <span className="mx-1.5 text-primary">{k.operator}</span>
                    {k.nilai}
                  </Badge>
                </span>
              ))}
            </div>
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={() =>
              toast.success(`Broadcast WhatsApp dikirim ke ${hasil.length} jamaah segmen ini`)
            }
          >
            <MessageCircle className="size-4" /> Broadcast WA ke Segmen Ini
          </Button>
        </CardContent>
      </Card>

      {/* Tabel hasil segmen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Jamaah dalam Segmen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasil.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nama}</TableCell>
                    <TableCell className="text-muted-foreground">{p.telepon}</TableCell>
                    <TableCell className="text-muted-foreground">{p.wilayah}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{p.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {hasil.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      Tidak ada jamaah yang cocok dengan kondisi segmen ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
