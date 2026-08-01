import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { useRealtimeTable } from "@/lib/jamaah";
import {
  hapusJadwal,
  hapusMateri,
  hapusSertifikasi,
  jadwalQueryOptions,
  kategoriMateriList,
  materiQueryOptions,
  sertifikasiQueryOptions,
  statusSertifikasiList,
  tambahJadwal,
  tambahMateri,
  tambahSertifikasi,
  ubahJadwal,
  ubahMateri,
  ubahSertifikasi,
  type JadwalInput,
  type JadwalRow,
  type KategoriMateri,
  type MateriInput,
  type MateriRow,
  type SertifikasiInput,
  type SertifikasiRow,
  type StatusSertifikasi,
} from "@/lib/akademi";

const materiKosong: MateriInput = {
  judul: "",
  kategori: "Product Knowledge",
  durasi: "",
  pemateri: "",
  progres: 0,
  urutan: 0,
};

const sertifikasiKosong: SertifikasiInput = {
  nama: "",
  status: "Terkunci",
  progres: 0,
  urutan: 0,
};

const jadwalKosong: JadwalInput = {
  judul: "",
  tanggal: "",
  tipe: "Online (Zoom)",
  pemateri: "",
  urutan: 0,
};

const angka = (v: string) => Math.max(0, Number(v.replace(/\D/g, "")) || 0);

/** Panel CMS untuk seluruh data Akademi Kemitraan (materi, sertifikasi, jadwal). */
export function PanelAkademi() {
  return (
    <div className="space-y-4">
      <PanelMateri />
      <PanelSertifikasi />
      <PanelJadwal />
    </div>
  );
}

function PanelMateri() {
  const queryClient = useQueryClient();
  useRealtimeTable("akademi_materi", ["akademi_materi"]);
  const { data, isLoading } = useQuery(materiQueryOptions);
  const [buka, setBuka] = useState(false);
  const [edit, setEdit] = useState<MateriRow | null>(null);
  const [form, setForm] = useState<MateriInput>(materiKosong);

  const simpan = useMutation({
    mutationFn: async () => {
      if (!form.judul.trim()) throw new Error("Judul materi wajib diisi.");
      if (edit) await ubahMateri(edit.id, form);
      else await tambahMateri(form);
    },
    onSuccess: () => {
      toast.success(edit ? "Materi diperbarui." : "Materi baru ditambahkan.");
      setBuka(false);
      setEdit(null);
      setForm(materiKosong);
      queryClient.invalidateQueries({ queryKey: ["akademi_materi"] });
    },
    onError: (e: Error) => toast.error(e.message || "Gagal menyimpan materi."),
  });

  const hapus = useMutation({
    mutationFn: (id: string) => hapusMateri(id),
    onSuccess: () => {
      toast.success("Materi dihapus.");
      queryClient.invalidateQueries({ queryKey: ["akademi_materi"] });
    },
    onError: () => toast.error("Gagal menghapus materi."),
  });

  const baris = data ?? [];

  return (
    <Card className="surface-luxe">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <GraduationCap className="size-4 text-primary" /> Materi Video ({baris.length})
        </CardTitle>
        <Button
          className="gap-1.5"
          onClick={() => {
            setEdit(null);
            setForm({ ...materiKosong, urutan: baris.length + 1 });
            setBuka(true);
          }}
        >
          <Plus className="size-4" /> Tambah Materi
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Pemateri</TableHead>
                <TableHead className="text-right">Progres</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : baris.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Belum ada materi. Klik “Tambah Materi”.
                  </TableCell>
                </TableRow>
              ) : (
                baris.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.judul}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/40 text-primary">
                        {m.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.durasi || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{m.pemateri || "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">{m.progres}%</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEdit(m);
                            setForm({
                              judul: m.judul,
                              kategori: m.kategori,
                              durasi: m.durasi,
                              pemateri: m.pemateri,
                              progres: m.progres,
                              urutan: m.urutan,
                            });
                            setBuka(true);
                          }}
                        >
                          <Pencil className="size-4" />
                          <span className="sr-only">Ubah {m.judul}</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-danger hover:text-danger"
                          onClick={() => hapus.mutate(m.id)}
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Hapus {m.judul}</span>
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
            <DialogTitle>{edit ? "Ubah Materi" : "Tambah Materi Baru"}</DialogTitle>
            <DialogDescription>
              Materi langsung tampil di halaman Akademi Kemitraan seluruh mitra.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="judul-materi">Judul Materi</Label>
              <Input
                id="judul-materi"
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                placeholder="Teknik Closing Lembut"
              />
            </div>
            <div className="grid gap-2">
              <Label>Kategori</Label>
              <Select
                value={form.kategori}
                onValueChange={(v) => setForm({ ...form, kategori: v as KategoriMateri })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {kategoriMateriList.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="durasi">Durasi</Label>
              <Input
                id="durasi"
                value={form.durasi}
                onChange={(e) => setForm({ ...form, durasi: e.target.value })}
                placeholder="24 menit"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pemateri">Pemateri</Label>
              <Input
                id="pemateri"
                value={form.pemateri}
                onChange={(e) => setForm({ ...form, pemateri: e.target.value })}
                placeholder="Ust. Fahmi Ridwan"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="progres">Progres (%)</Label>
              <Input
                id="progres"
                inputMode="numeric"
                value={form.progres}
                onChange={(e) =>
                  setForm({ ...form, progres: Math.min(100, angka(e.target.value)) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="urutan-materi">Urutan Tampil</Label>
              <Input
                id="urutan-materi"
                inputMode="numeric"
                value={form.urutan}
                onChange={(e) => setForm({ ...form, urutan: angka(e.target.value) })}
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

function PanelSertifikasi() {
  const queryClient = useQueryClient();
  useRealtimeTable("akademi_sertifikasi", ["akademi_sertifikasi"]);
  const { data, isLoading } = useQuery(sertifikasiQueryOptions);
  const [buka, setBuka] = useState(false);
  const [edit, setEdit] = useState<SertifikasiRow | null>(null);
  const [form, setForm] = useState<SertifikasiInput>(sertifikasiKosong);

  const simpan = useMutation({
    mutationFn: async () => {
      if (!form.nama.trim()) throw new Error("Nama sertifikasi wajib diisi.");
      if (edit) await ubahSertifikasi(edit.id, form);
      else await tambahSertifikasi(form);
    },
    onSuccess: () => {
      toast.success(edit ? "Sertifikasi diperbarui." : "Sertifikasi ditambahkan.");
      setBuka(false);
      setEdit(null);
      setForm(sertifikasiKosong);
      queryClient.invalidateQueries({ queryKey: ["akademi_sertifikasi"] });
    },
    onError: (e: Error) => toast.error(e.message || "Gagal menyimpan sertifikasi."),
  });

  const hapus = useMutation({
    mutationFn: (id: string) => hapusSertifikasi(id),
    onSuccess: () => {
      toast.success("Sertifikasi dihapus.");
      queryClient.invalidateQueries({ queryKey: ["akademi_sertifikasi"] });
    },
    onError: () => toast.error("Gagal menghapus sertifikasi."),
  });

  const baris = data ?? [];

  return (
    <Card className="surface-luxe">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Sertifikasi ({baris.length})</CardTitle>
        <Button
          className="gap-1.5"
          onClick={() => {
            setEdit(null);
            setForm({ ...sertifikasiKosong, urutan: baris.length + 1 });
            setBuka(true);
          }}
        >
          <Plus className="size-4" /> Tambah Sertifikasi
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Progres</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : baris.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    Belum ada sertifikasi.
                  </TableCell>
                </TableRow>
              ) : (
                baris.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.nama}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{s.progres}%</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEdit(s);
                            setForm({
                              nama: s.nama,
                              status: s.status,
                              progres: s.progres,
                              urutan: s.urutan,
                            });
                            setBuka(true);
                          }}
                        >
                          <Pencil className="size-4" />
                          <span className="sr-only">Ubah {s.nama}</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-danger hover:text-danger"
                          onClick={() => hapus.mutate(s.id)}
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Hapus {s.nama}</span>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{edit ? "Ubah Sertifikasi" : "Tambah Sertifikasi"}</DialogTitle>
            <DialogDescription>Tampil di panel Sertifikasi &amp; Progres.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nama-sert">Nama Sertifikasi</Label>
              <Input
                id="nama-sert"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Sertifikat Marketing Advance"
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as StatusSertifikasi })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusSertifikasiList.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="progres-sert">Progres (%)</Label>
                <Input
                  id="progres-sert"
                  inputMode="numeric"
                  value={form.progres}
                  onChange={(e) =>
                    setForm({ ...form, progres: Math.min(100, angka(e.target.value)) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="urutan-sert">Urutan</Label>
                <Input
                  id="urutan-sert"
                  inputMode="numeric"
                  value={form.urutan}
                  onChange={(e) => setForm({ ...form, urutan: angka(e.target.value) })}
                />
              </div>
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

function PanelJadwal() {
  const queryClient = useQueryClient();
  useRealtimeTable("akademi_jadwal", ["akademi_jadwal"]);
  const { data, isLoading } = useQuery(jadwalQueryOptions);
  const [buka, setBuka] = useState(false);
  const [edit, setEdit] = useState<JadwalRow | null>(null);
  const [form, setForm] = useState<JadwalInput>(jadwalKosong);

  const simpan = useMutation({
    mutationFn: async () => {
      if (!form.judul.trim()) throw new Error("Judul sesi wajib diisi.");
      if (edit) await ubahJadwal(edit.id, form);
      else await tambahJadwal(form);
    },
    onSuccess: () => {
      toast.success(edit ? "Jadwal diperbarui." : "Jadwal ditambahkan.");
      setBuka(false);
      setEdit(null);
      setForm(jadwalKosong);
      queryClient.invalidateQueries({ queryKey: ["akademi_jadwal"] });
    },
    onError: (e: Error) => toast.error(e.message || "Gagal menyimpan jadwal."),
  });

  const hapus = useMutation({
    mutationFn: (id: string) => hapusJadwal(id),
    onSuccess: () => {
      toast.success("Jadwal dihapus.");
      queryClient.invalidateQueries({ queryKey: ["akademi_jadwal"] });
    },
    onError: () => toast.error("Gagal menghapus jadwal."),
  });

  const baris = data ?? [];

  return (
    <Card className="surface-luxe">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Jadwal Training ({baris.length})</CardTitle>
        <Button
          className="gap-1.5"
          onClick={() => {
            setEdit(null);
            setForm({ ...jadwalKosong, urutan: baris.length + 1 });
            setBuka(true);
          }}
        >
          <Plus className="size-4" /> Tambah Jadwal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Sesi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Pemateri</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : baris.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Belum ada jadwal training.
                  </TableCell>
                </TableRow>
              ) : (
                baris.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="font-medium">{j.judul}</TableCell>
                    <TableCell className="text-primary">{j.tanggal || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{j.tipe || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{j.pemateri || "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEdit(j);
                            setForm({
                              judul: j.judul,
                              tanggal: j.tanggal,
                              tipe: j.tipe,
                              pemateri: j.pemateri,
                              urutan: j.urutan,
                            });
                            setBuka(true);
                          }}
                        >
                          <Pencil className="size-4" />
                          <span className="sr-only">Ubah {j.judul}</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-danger hover:text-danger"
                          onClick={() => hapus.mutate(j.id)}
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Hapus {j.judul}</span>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{edit ? "Ubah Jadwal" : "Tambah Jadwal Training"}</DialogTitle>
            <DialogDescription>Tampil di panel Jadwal Training halaman Akademi.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="judul-jadwal">Judul Sesi</Label>
              <Input
                id="judul-jadwal"
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                placeholder="Webinar: Closing Tanpa Menekan"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tanggal">Tanggal &amp; Jam</Label>
              <Input
                id="tanggal"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                placeholder="Sabtu, 8 Agu 2026 • 09.00 WIB"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipe">Tipe Sesi</Label>
              <Input
                id="tipe"
                value={form.tipe}
                onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                placeholder="Online (Zoom) / Offline • Kantor Pusat"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pemateri-jadwal">Pemateri</Label>
              <Input
                id="pemateri-jadwal"
                value={form.pemateri}
                onChange={(e) => setForm({ ...form, pemateri: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="urutan-jadwal">Urutan</Label>
              <Input
                id="urutan-jadwal"
                inputMode="numeric"
                value={form.urutan}
                onChange={(e) => setForm({ ...form, urutan: angka(e.target.value) })}
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
