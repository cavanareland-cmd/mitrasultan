import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Link2, Share2, Users } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { agent, formatRupiah, jaringan, type Downline } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/jaringan")({
  head: () => ({
    meta: [
      { title: "Jaringan Kemitraan — Downline & Referral" },
      {
        name: "description",
        content:
          "Pohon jaringan visual, tabel hierarki sub-mitra, dan generator link referal khusus agen.",
      },
      { property: "og:title", content: "Jaringan Kemitraan — Downline & Referral" },
      {
        property: "og:description",
        content: "Lihat struktur downline Anda dan bagikan link referal otomatis.",
      },
    ],
  }),
  component: JaringanPage,
});

/** Node pohon jaringan yang bisa dibuka-tutup. */
function NodeJaringan({ node, level = 0 }: { node: Downline; level?: number }) {
  const [buka, setBuka] = useState(true);
  const punyaAnak = !!node.anak?.length;

  return (
    <div className={level > 0 ? "ml-4 border-l border-border pl-4 sm:ml-6" : ""}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3 transition-colors hover:border-primary/40">
        <button
          onClick={() => setBuka((b) => !b)}
          className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"
          aria-label={buka ? "Tutup cabang" : "Buka cabang"}
        >
          {punyaAnak ? (
            buka ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )
          ) : (
            <Users className="size-4" />
          )}
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{node.nama}</p>
          <p className="text-xs text-muted-foreground">
            {node.jamaah} jamaah • {formatRupiah(node.komisi)}
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 border-primary/40 text-primary">
          {node.tier}
        </Badge>
      </div>
      {punyaAnak && buka && (
        <div className="mt-2 space-y-2">
          {node.anak!.map((a) => (
            <NodeJaringan key={a.id} node={a} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Ratakan pohon menjadi daftar hierarki untuk tabel. */
function ratakan(node: Downline, level = 0): { node: Downline; level: number }[] {
  return [{ node, level }, ...(node.anak ?? []).flatMap((a) => ratakan(a, level + 1))];
}

function JaringanPage() {
  const daftar = ratakan(jaringan).slice(1);
  const linkReferal = `https://sultanharamain.id/daftar?ref=${agent.refCode}`;

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(linkReferal);
      toast.success("Link referal disalin ke clipboard");
    } catch {
      toast.error("Gagal menyalin link, silakan salin manual");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        judul="Jaringan Kemitraan"
        deskripsi="Pantau struktur downline dan kembangkan jaringan lewat link referal Anda."
      />

      {/* Generator link referal */}
      <Card className="surface-luxe">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="size-5 text-primary" /> Generator Link Referal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Input readOnly value={linkReferal} className="font-mono text-xs" />
            <div className="flex gap-2">
              <Button onClick={salin} className="flex-1">
                <Copy className="size-4" /> Salin
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => toast("Bagikan ke WhatsApp, Instagram, atau status Anda")}
              >
                <Share2 className="size-4" /> Bagikan
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Setiap pendaftaran melalui link ini otomatis tercatat sebagai downline Anda dan
            menghasilkan bonus overriding.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { l: "Total Klik", v: "1.248" },
              { l: "Pendaftar", v: "37" },
              { l: "Konversi", v: "2,9%" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg bg-secondary p-3">
                <p className="font-display text-lg font-bold text-gold-gradient">{s.v}</p>
                <p className="text-[11px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pohon jaringan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pohon Jaringan (Genealogy Tree)</CardTitle>
          </CardHeader>
          <CardContent>
            <NodeJaringan node={jaringan} />
          </CardContent>
        </Card>

        {/* Tabel hierarki */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tabel Hierarki Sub-Mitra</CardTitle>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Jamaah</TableHead>
                    <TableHead className="text-right">Komisi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daftar.map(({ node, level }) => (
                    <TableRow key={node.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <span style={{ paddingLeft: (level - 1) * 12 }}>{node.nama}</span>
                      </TableCell>
                      <TableCell>Level {level}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{node.tier}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{node.jamaah}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatRupiah(node.komisi)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
