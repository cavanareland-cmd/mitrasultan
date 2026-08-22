import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, MailWarning, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { daftarPengguna, ubahPeranPengguna, type PenggunaRow } from "@/lib/peran.functions";

export const Route = createFileRoute("/_authenticated/peran")({
  head: () => ({
    meta: [
      { title: "Manajemen Peran Mitra — Sultan Haramain Gresik" },
      {
        name: "description",
        content:
          "Kelola peran admin dan mitra, pantau status konfirmasi email, serta aktivitas login terakhir seluruh akun kemitraan.",
      },
      { property: "og:title", content: "Manajemen Peran Mitra — Sultan Haramain" },
      {
        property: "og:description",
        content: "Panel admin untuk mengubah peran pengguna dan memantau konfirmasi email akun mitra.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HalamanPeran,
});

function formatTanggal(nilai: string | null) {
  if (!nilai) return "—";
  return new Date(nilai).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function KartuRingkas({
  judul,
  nilai,
  keterangan,
  icon: Icon,
  warna,
}: {
  judul: string;
  nilai: number;
  keterangan: string;
  icon: typeof Users;
  warna: string;
}) {
  return (
    <Card className="surface-luxe">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`grid size-11 shrink-0 place-items-center rounded-xl bg-secondary/60 ${warna}`}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-semibold">{nilai}</p>
          <p className="truncate text-sm font-medium">{judul}</p>
          <p className="truncate text-xs text-muted-foreground">{keterangan}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function HalamanPeran() {
  const queryClient = useQueryClient();
  const ambilPengguna = useServerFn(daftarPengguna);
  const simpanPeran = useServerFn(ubahPeranPengguna);
  const [cari, setCari] = useState("");

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["pengguna-peran"],
    queryFn: () => ambilPengguna(),
  });

  const mutasi = useMutation({
    mutationFn: (input: { userId: string; peran: "admin" | "mitra" }) =>
      simpanPeran({ data: input }),
    onSuccess: () => {
      toast.success("Peran pengguna diperbarui");
      void queryClient.invalidateQueries({ queryKey: ["pengguna-peran"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const pengguna: PenggunaRow[] = data ?? [];
  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    if (!q) return pengguna;
    return pengguna.filter((p) =>
      [p.email, p.nama, p.kota].some((v) => v.toLowerCase().includes(q)),
    );
  }, [pengguna, cari]);

  const totalAdmin = pengguna.filter((p) => p.peran.includes("admin")).length;
  const totalTerkonfirmasi = pengguna.filter((p) => p.emailTerkonfirmasi).length;

  return (
    <div className="space-y-6">
      <PageHeader
        judul="Manajemen Peran"
        deskripsi="Atur hak akses admin/mitra dan pantau status konfirmasi email akun."
        aksi={
          <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
            {isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Muat Ulang
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KartuRingkas
          judul="Total Akun"
          nilai={pengguna.length}
          keterangan="Pengguna terdaftar"
          icon={Users}
          warna="text-primary"
        />
        <KartuRingkas
          judul="Admin Aktif"
          nilai={totalAdmin}
          keterangan="Punya akses penuh CMS"
          icon={ShieldCheck}
          warna="text-warning"
        />
        <KartuRingkas
          judul="Email Terkonfirmasi"
          nilai={totalTerkonfirmasi}
          keterangan={`${pengguna.length - totalTerkonfirmasi} belum konfirmasi`}
          icon={CheckCircle2}
          warna="text-success"
        />
      </div>

      <Card className="surface-luxe">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle className="font-display text-lg">Daftar Pengguna</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari email, nama, atau kota…"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="py-8 text-center text-sm text-danger">
              {(error as Error).message}
            </p>
          ) : isLoading ? (
            <p className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Memuat data pengguna…
            </p>
          ) : hasil.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Tidak ada pengguna yang cocok.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mitra</TableHead>
                    <TableHead>Status Email</TableHead>
                    <TableHead>Login Terakhir</TableHead>
                    <TableHead className="text-right">Peran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hasil.map((p) => {
                    const peranAktif = p.peran.includes("admin") ? "admin" : "mitra";
                    return (
                      <TableRow key={p.id}>
                        <TableCell>
                          <p className="font-medium">{p.nama || "(tanpa nama)"}</p>
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.kota || "Kota belum diisi"} · Gabung {formatTanggal(p.dibuatPada)}
                          </p>
                        </TableCell>
                        <TableCell>
                          {p.emailTerkonfirmasi ? (
                            <Badge className="gap-1 bg-success/15 text-success hover:bg-success/20">
                              <CheckCircle2 className="size-3.5" /> Terkonfirmasi
                            </Badge>
                          ) : (
                            <Badge className="gap-1 bg-warning/15 text-warning hover:bg-warning/20">
                              <MailWarning className="size-3.5" /> Menunggu
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTanggal(p.masukTerakhir)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={peranAktif}
                            onValueChange={(v) =>
                              mutasi.mutate({ userId: p.id, peran: v as "admin" | "mitra" })
                            }
                            disabled={mutasi.isPending}
                          >
                            <SelectTrigger className="ml-auto w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="mitra">Mitra</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
