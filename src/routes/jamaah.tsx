import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, MessageCircle, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { formatRupiah, pipeline, prospek, type Prospek } from "@/lib/data";

export const Route = createFileRoute("/jamaah")({
  head: () => ({
    meta: [
      { title: "Manajemen Jamaah Pintar — Smart CRM Mitra" },
      {
        name: "description",
        content:
          "Kelola pipeline prospek Umrah, buat segmentasi cerdas, dan lakukan follow-up massal via WhatsApp.",
      },
      { property: "og:title", content: "Manajemen Jamaah Pintar — Smart CRM Mitra" },
      {
        property: "og:description",
        content: "Pipeline prospek, segmentasi cerdas, dan mass follow-up WhatsApp.",
      },
    ],
  }),
  component: JamaahPage,
});

const opsiStatus = ["Semua", "Tanya-tanya", "DP", "Lunas", "Pemberkasan"] as const;
const opsiTempo = ["Semua", "< 3 Hari", "< 7 Hari", "< 14 Hari"] as const;

function JamaahPage() {
  const [status, setStatus] = useState<(typeof opsiStatus)[number]>("DP");
  const [tempo, setTempo] = useState<(typeof opsiTempo)[number]>("< 7 Hari");
  const [cari, setCari] = useState("");
  const [terpilih, setTerpilih] = useState<string[]>([]);

  /** Terapkan filter segmentasi ke data prospek. */
  const hasil = useMemo(() => {
    const batas = tempo === "< 3 Hari" ? 3 : tempo === "< 7 Hari" ? 7 : tempo === "< 14 Hari" ? 14 : 999;
    return prospek.filter(
      (p) =>
        (status === "Semua" || p.status === status) &&
        (tempo === "Semua" || (p.jatuhTempoHari > 0 && p.jatuhTempoHari < batas)) &&
        (cari === "" ||
          p.nama.toLowerCase().includes(cari.toLowerCase()) ||
          p.wilayah.toLowerCase().includes(cari.toLowerCase())),
    );
  }, [status, tempo, cari]);

  const semuaTerpilih = hasil.length > 0 && terpilih.length === hasil.length;

  const toggleSemua = () => setTerpilih(semuaTerpilih ? [] : hasil.map((p) => p.id));
  const toggle = (id: string) =>
    setTerpilih((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const kirimMassal = () => {
    const jumlah = terpilih.length || hasil.length;
    toast.success(`Pesan follow-up disiapkan untuk ${jumlah} prospek`, {
      description: "Template WhatsApp otomatis terisi nama, paket, dan sisa tagihan.",
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        judul="Manajemen Jamaah Pintar"
        deskripsi="Smart CRM untuk memantau konversi prospek dan menjalankan follow-up terarah."
        aksi={
          <Button variant="outline">
            <Plus className="size-4" /> Tambah Prospek
          </Button>
        }
      />

      {/* Data pipeline konversi */}
      <Card className="surface-luxe">
        <CardHeader>
          <CardTitle className="text-base">Data Pipeline Konversi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((tahap, i) => (
            <div key={tahap.tahap} className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Tahap {i + 1}</p>
                <Badge variant="secondary">{tahap.persen}%</Badge>
              </div>
              <p className="mt-1 text-sm font-semibold">{tahap.tahap}</p>
              <p className="font-display text-2xl font-bold text-gold-gradient">{tahap.jumlah}</p>
              <Progress value={tahap.persen} className="mt-2 h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Smart segmentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="size-5 text-primary" /> Smart Segmentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Status Pembayaran</p>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {opsiStatus.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">DAN Jatuh Tempo</p>
              <Select value={tempo} onValueChange={(v) => setTempo(v as typeof tempo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {opsiTempo.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Cari Nama / Wilayah</p>
              <div className="relative">
                <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  value={cari}
                  onChange={(e) => setCari(e.target.value)}
                  placeholder="Misal: Manyar"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 p-3 text-xs">
            <span className="text-muted-foreground">Segmen aktif:</span>
            <Badge className="bg-primary text-primary-foreground">Status: {status}</Badge>
            <span className="text-muted-foreground">DAN</span>
            <Badge className="bg-primary text-primary-foreground">Jatuh tempo {tempo}</Badge>
            <span className="ml-auto font-semibold text-primary">{hasil.length} prospek cocok</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabel hasil + aksi massal */}
      <Card>
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <CardTitle className="flex min-w-0 items-center gap-2 text-base">
            <Users className="size-5 text-primary" /> Hasil Segmentasi
          </CardTitle>
          <Button onClick={kirimMassal} className="shrink-0">
            <MessageCircle className="size-4" />
            <span className="hidden sm:inline">Mass Follow-Up via WhatsApp</span>
            <span className="sm:hidden">Mass WA</span>
          </Button>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={semuaTerpilih} onCheckedChange={toggleSemua} />
                  </TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Wilayah</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sisa Tagihan</TableHead>
                  <TableHead className="text-right">Jatuh Tempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasil.map((p: Prospek) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Checkbox
                        checked={terpilih.includes(p.id)}
                        onCheckedChange={() => toggle(p.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {p.nama}
                      <span className="block text-xs text-muted-foreground">{p.telepon}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{p.wilayah}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {p.paket}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/40 text-primary">
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {p.sisaTagihan ? formatRupiah(p.sisaTagihan) : "-"}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {p.jatuhTempoHari ? `${p.jatuhTempoHari} hari` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {hasil.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      Tidak ada prospek yang cocok dengan segmen ini.
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
