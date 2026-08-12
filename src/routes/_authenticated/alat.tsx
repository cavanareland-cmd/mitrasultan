import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy, Download, Globe, PiggyBank, QrCode, ScanLine } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/layout/page-header";
import { agent, formatRupiah } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/alat")({
  head: () => ({
    meta: [
      { title: "Alat & Simulasi Mitra — Kalkulator Umrah & QR Presensi" },
      {
        name: "description",
        content:
          "Kalkulator tabungan Umrah, web replika promosi personal agen, dan QR scanner presensi manasik.",
      },
      { property: "og:title", content: "Alat & Simulasi Mitra" },
      {
        property: "og:description",
        content: "Simulasi tabungan Umrah, landing page personal, dan presensi digital QR.",
      },
    ],
  }),
  component: AlatPage,
});

function AlatPage() {
  const [hargaPaket, setHargaPaket] = useState(35000000);
  const [tabunganAwal, setTabunganAwal] = useState(5000000);
  const [setoranBulanan, setSetoranBulanan] = useState([1500000]);
  const [replikaAktif, setReplikaAktif] = useState(true);
  const [scannerAktif, setScannerAktif] = useState(false);

  /** Estimasi lama menabung hingga dana paket terpenuhi. */
  const simulasi = useMemo(() => {
    const kurang = Math.max(hargaPaket - tabunganAwal, 0);
    const perBulan = setoranBulanan[0] || 1;
    const bulan = Math.ceil(kurang / perBulan);
    const target = new Date();
    target.setMonth(target.getMonth() + bulan);
    return {
      kurang,
      bulan,
      estimasi: target.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    };
  }, [hargaPaket, tabunganAwal, setoranBulanan]);

  const linkReplika = `https://${agent.refCode.toLowerCase()}.sultanharamain.id`;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        judul="Alat & Simulasi"
        deskripsi="Perangkat bantu closing: simulasi finansial, landing page personal, dan presensi digital."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Kalkulator tabungan Umrah */}
        <Card className="surface-luxe">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PiggyBank className="size-5 text-primary" /> Kalkulator Tabungan Umrah
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="harga">Harga Paket (Rp)</Label>
              <Input
                id="harga"
                type="number"
                value={hargaPaket}
                onChange={(e) => setHargaPaket(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="awal">Tabungan Awal (Rp)</Label>
              <Input
                id="awal"
                type="number"
                value={tabunganAwal}
                onChange={(e) => setTabunganAwal(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Setoran per Bulan</Label>
                <span className="font-semibold text-primary">
                  {formatRupiah(setoranBulanan[0] ?? 0)}
                </span>
              </div>
              <Slider
                value={setoranBulanan}
                onValueChange={setSetoranBulanan}
                min={250000}
                max={7500000}
                step={250000}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3 text-center">
              <div>
                <p className="text-[11px] text-muted-foreground">Kekurangan</p>
                <p className="text-sm font-bold">{formatRupiah(simulasi.kurang)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Lama Menabung</p>
                <p className="text-sm font-bold">{simulasi.bulan} bulan</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Estimasi Berangkat</p>
                <p className="text-sm font-bold">{simulasi.estimasi}</p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => toast.success("Simulasi diunduh sebagai PDF")}
            >
              <Download className="size-4" /> Unduh Simulasi (PDF)
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Web replika otomatis */}
          <Card>
            <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <CardTitle className="flex min-w-0 items-center gap-2 text-base">
                <Globe className="size-5 text-primary" /> Web Replika Otomatis
              </CardTitle>
              <Switch checked={replikaAktif} onCheckedChange={setReplikaAktif} />
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge
                variant="outline"
                className={replikaAktif ? "border-success text-success" : "border-border"}
              >
                {replikaAktif ? "Landing page aktif" : "Landing page nonaktif"}
              </Badge>
              <Input readOnly value={linkReplika} className="font-mono text-xs" />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(linkReplika);
                    toast.success("Link replika disalin");
                  }}
                >
                  <Copy className="size-4" /> Salin
                </Button>
                <Button variant="outline" onClick={() => toast("Pratinjau halaman promosi Anda")}>
                  Pratinjau
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Landing page promosi personal berisi paket, testimoni, dan formulir pendaftaran yang
                otomatis masuk ke pipeline Anda.
              </p>
            </CardContent>
          </Card>

          {/* QR Scanner presensi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <QrCode className="size-5 text-primary" /> QR Code Scanner Presensi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative grid h-44 place-items-center overflow-hidden rounded-xl border border-dashed border-primary/40 bg-secondary/40">
                {scannerAktif ? (
                  <>
                    <ScanLine className="size-10 animate-pulse text-primary" />
                    <span className="absolute inset-x-8 h-0.5 animate-bounce bg-primary" />
                  </>
                ) : (
                  <p className="px-6 text-center text-xs text-muted-foreground">
                    Kamera nonaktif. Aktifkan untuk memindai QR presensi jamaah pada acara manasik
                    atau gathering.
                  </p>
                )}
              </div>
              <Button
                className="w-full"
                variant={scannerAktif ? "outline" : "default"}
                onClick={() => {
                  setScannerAktif((s) => !s);
                  if (!scannerAktif) toast.success("Scanner siap memindai QR presensi");
                }}
              >
                <ScanLine className="size-4" />
                {scannerAktif ? "Hentikan Pemindaian" : "Mulai Pindai QR"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Presensi terakhir: 42 jamaah tercatat pada Manasik Akbar Kebomas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
