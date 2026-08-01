import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, Loader2, Pencil, Plus, RefreshCw, Search, Trash2, Wifi } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";
import { agent } from "@/lib/data";
import {
  hapusJamaah,
  jamaahQueryOptions,
  paketList,
  statusJamaahList,
  tambahJamaah,
  ubahJamaah,
  useRealtimeTable,
  warnaStatusJamaah,
  type JamaahInput,
  type JamaahRow,
  type StatusJamaah,
} from "@/lib/jamaah";
import {
  gantiAgenTeritori,
  teritoriQueryOptions,
  ubahStatusTeritori,
  warnaStatus,
  type StatusTeritori,
} from "@/lib/teritori";

export const Route = createFileRoute("/cms")({
  head: () => ({
    meta: [
      { title: "CMS Mitra — Input & Update Data Realtime Sultan Haramain" },
      {
        name: "description",
        content:
          "Pusat kelola data mitra: input, edit, dan hapus data jamaah serta teritori. Semua perubahan tersinkron realtime ke dashboard seluruh anggota mitra.",
      },
      { property: "og:title", content: "CMS Mitra Sultan Haramain" },
      {
        property: "og:description",
        content: "Kelola data jamaah dan teritori secara realtime dari satu halaman CMS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CmsPage,
});

const kosong: JamaahInput = {
  nama: "",
  telepon: "",
  kota: "",
  paket: "Reguler",
  status: "Prospek",
  nilai: 0,
  sumber: "",
  catatan: "",
  mitra: agent.nama,
};

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

function CmsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        judul="CMS Mitra"
        deskripsi="Input, edit, dan update data langsung ke database. Setiap perubahan tampil realtime di dashboard seluruh anggota mitra."
        aksi={
          <Badge variant="outline" className="gap-1.5 border-success/40 text-success">
            <Wifi className="size-3.5" /> Realtime aktif
          </Badge>
        }
      />

      <Tabs defaultValue="jamaah" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jamaah">Data Jamaah</TabsTrigger>
          <TabsTrigger value="teritori">Data Teritori</TabsTrigger>
        </TabsList>
        <TabsContent value="jamaah">
          <PanelJamaah />
        </TabsContent>
        <TabsContent value="teritori">
          <PanelTeritori />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PanelJamaah() {
  const queryClient = useQueryClient();
  useRealtimeTable("jamaah", ["jamaah"]);
  const { data, isLoading, isFetching } = useQuery(jamaahQueryOptions);
  const [cari, setCari] = useState("");
  const [buka, setBuka] = useState(false);
  const [edit, setEdit] = useState<JamaahRow | null>(null);
  const [form, setForm] = useState<JamaahInput>(kosong);

  const baris = useMemo(() => {
    const q = cari.trim().toLowerCase();
    const list = data ?? [];
    if (!q) return list;
    return list.filter((j) =>
      [j.nama, j.telepon, j.kota, j.paket, j.status, j.mitra].join(" ").toLowerCase().includes(q),
    );
  }, [data, cari]);

  const simpan = useMutation({
    mutationFn: async () => {
      if (!form.nama.trim()) throw new Error("Nama jamaah wajib diisi.");
      if (edit) await ubahJamaah(edit.id, form);
      else await tambahJamaah(form);
    },
    onSuccess: () => {
      toast.success(edit ? "Data jamaah diperbarui." : "Jamaah baru ditambahkan.");
      setBuka(false);
      setEdit(null);
      setForm(kosong);
      queryClient.invalidateQueries({ queryKey: ["jamaah"] });
    },
    onError: (e: Error) => toast.error(e.message || "Gagal menyimpan data."),
  });

  const hapus = useMutation({
    mutationFn: (id: string) => hapusJamaah(id),
    onSuccess: () => {
      toast.success("Data jamaah dihapus.");
      queryClient.invalidateQueries({ queryKey: ["jamaah"] });
    },
    onError: () => toast.error("Gagal menghapus data."),
  });

  const bukaTambah = () => {
    setEdit(null);
    setForm(kosong);
    setBuka(true);
  };

  const bukaEdit = (row: JamaahRow) => {
    setEdit(row);
    setForm({
      nama: row.nama,
      telepon: row.telepon,
      kota: row.kota,
      paket: row.paket,
      status: row.status,
      nilai: row.nilai,
      sumber: row.sumber,
      catatan: row.catatan,
      mitra: row.mitra,
    });
    setBuka(true);
  };

  return (
    <Card className="surface-luxe">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="size-4 text-primary" />
          Data Jamaah ({baris.length})
          {isFetching ? <RefreshCw className="size-3.5 animate-spin text-muted-foreground" /> : null}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari jamaah…"
              className="w-40 pl-8 sm:w-56"
            />
          </div>
          <Button onClick={bukaTambah} className="gap-1.5">
            <Plus className="size-4" /> Tambah
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Nilai</TableHead>
                <TableHead>Mitra</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : baris.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    Belum ada data. Klik “Tambah” untuk input jamaah pertama.
                  </TableCell>
                </TableRow>
              ) : (
                baris.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="font-medium">{j.nama}</TableCell>
                    <TableCell className="text-muted-foreground">{j.telepon || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{j.kota || "—"}</TableCell>
                    <TableCell>{j.paket}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={warnaStatusJamaah[j.status]}>
                        {j.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{rupiah(j.nilai)}</TableCell>
                    <TableCell className="text-muted-foreground">{j.mitra || "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => bukaEdit(j)}>
                          <Pencil className="size-4" />
                          <span className="sr-only">Ubah {j.nama}</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-danger hover:text-danger"
                          onClick={() => hapus.mutate(j.id)}
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Hapus {j.nama}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={buka} onOpenChange={setBuka}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{edit ? "Ubah Data Jamaah" : "Tambah Jamaah Baru"}</DialogTitle>
            <DialogDescription>
              Data tersimpan ke database dan langsung tampil di dashboard mitra lain.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="nama">Nama Jamaah</Label>
              <Input
                id="nama"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="H. Sulaiman"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telepon">Nomor WhatsApp</Label>
              <Input
                id="telepon"
                value={form.telepon}
                onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                placeholder="0812xxxxxxx"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kota">Kota / Kecamatan</Label>
              <Input
                id="kota"
                value={form.kota}
                onChange={(e) => setForm({ ...form, kota: e.target.value })}
                placeholder="Kebomas, Gresik"
              />
            </div>
            <div className="grid gap-2">
              <Label>Paket</Label>
              <Select value={form.paket} onValueChange={(v) => setForm({ ...form, paket: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paketList.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as StatusJamaah })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusJamaahList.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nilai">Nilai Transaksi (Rp)</Label>
              <Input
                id="nilai"
                inputMode="numeric"
                value={form.nilai}
                onChange={(e) =>
                  setForm({ ...form, nilai: Number(e.target.value.replace(/\D/g, "")) || 0 })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sumber">Sumber Leads</Label>
              <Input
                id="sumber"
                value={form.sumber}
                onChange={(e) => setForm({ ...form, sumber: e.target.value })}
                placeholder="Manasik Akbar / Referral"
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="mitra">Mitra Penanggung Jawab</Label>
              <Input
                id="mitra"
                value={form.mitra}
                onChange={(e) => setForm({ ...form, mitra: e.target.value })}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                placeholder="Catatan follow-up, kebutuhan dokumen, dll."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBuka(false)}>
              Batal
            </Button>
            <Button onClick={() => simpan.mutate()} disabled={simpan.isPending}>
              {simpan.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function PanelTeritori() {
  const queryClient = useQueryClient();
  useRealtimeTable("teritori", ["teritori"]);
  const { data, isLoading } = useQuery(teritoriQueryOptions);
  const [cari, setCari] = useState("");

  const ubahStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusTeritori }) =>
      ubahStatusTeritori(id, status),
    onSuccess: () => {
      toast.success("Status teritori diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["teritori"] });
    },
    onError: () => toast.error("Gagal memperbarui status."),
  });

  const gantiAgen = useMutation({
    mutationFn: ({ id, pemilik }: { id: string; pemilik: string | null }) =>
      gantiAgenTeritori(id, pemilik),
    onSuccess: () => {
      toast.success("Pemilik teritori diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["teritori"] });
    },
    onError: () => toast.error("Gagal memperbarui pemilik."),
  });

  const baris = (data ?? []).filter((t) =>
    `${t.kecamatan} ${t.kabupaten}`.toLowerCase().includes(cari.trim().toLowerCase()),
  );

  return (
    <Card className="surface-luxe">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="size-4 text-primary" /> Data Teritori ({baris.length})
        </CardTitle>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari kecamatan…"
            className="w-40 pl-8 sm:w-56"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kecamatan</TableHead>
                <TableHead>Kabupaten</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pemilik / Agen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : (
                baris.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.kecamatan}</TableCell>
                    <TableCell className="text-muted-foreground">{t.kabupaten}</TableCell>
                    <TableCell>
                      <Select
                        value={t.status}
                        onValueChange={(v) =>
                          ubahStatus.mutate({ id: t.id, status: v as StatusTeritori })
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(warnaStatus) as StatusTeritori[]).map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        defaultValue={t.pemilik ?? ""}
                        placeholder="Belum ada agen"
                        className="w-48"
                        onBlur={(e) => {
                          const nilai = e.target.value.trim();
                          if (nilai === (t.pemilik ?? "")) return;
                          gantiAgen.mutate({ id: t.id, pemilik: nilai || null });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
