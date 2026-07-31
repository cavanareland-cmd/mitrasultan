import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  Coins,
  Crown,
  FileCheck2,
  Landmark,
  Users2,
  UserPlus,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/page-header";
import { agent, agendaHariIni, formatRupiah, ringkasan, umrahGratis } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Mitra — Sultan Haramain Gresik" },
      {
        name: "description",
        content:
          "Pantau komisi, leads, target Umrah gratis, dan agenda harian Anda dalam satu dashboard kemitraan.",
      },
      { property: "og:title", content: "Dashboard Mitra — Sultan Haramain Gresik" },
      {
        property: "og:description",
        content: "Portal kemitraan Umrah: komisi, leads, target, dan agenda harian agen.",
      },
    ],
  }),
  component: DashboardPage,
});

/** Kartu ringkasan angka utama. */
function KartuRingkasan({
  label,
  nilai,
  ikon: Ikon,
  keterangan,
}: {
  label: string;
  nilai: string;
  ikon: typeof Coins;
  keterangan: string;
}) {
  return (
    <Card className="surface-luxe">
      <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-5">
        <div className="min-w-0">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
          <p className="mt-2 truncate font-display text-2xl font-bold text-gold-gradient sm:text-3xl">
            {nilai}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{keterangan}</p>
        </div>
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <Ikon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const sisaTarget = umrahGratis.target - umrahGratis.tercapai;
  const persen = Math.round((umrahGratis.tercapai / umrahGratis.target) * 100);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        judul={`Selamat Datang, ${agent.panggilan}!`}
        deskripsi="Semoga hari ini penuh keberkahan. Berikut ringkasan performa kemitraan Anda."
      />

      {/* Banner leaderboard */}
      <Card className="surface-luxe overflow-hidden">
        <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Crown className="size-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Posisi Leaderboard Bulan Ini</p>
              <p className="truncate font-display text-2xl font-bold">
                #{agent.peringkatBulanIni}{" "}
                <span className="text-primary">({agent.tier.split(" ")[0]})</span>
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Kurang 380 poin untuk naik ke peringkat #2
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/leaderboard">
              Selengkapnya <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Widget ringkasan */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KartuRingkasan
          label="Total Komisi Berjalan"
          nilai={formatRupiah(ringkasan.komisiBerjalan)}
          ikon={Coins}
          keterangan="Termasuk komisi tertunda bulan ini"
        />
        <KartuRingkasan
          label="Jumlah Leads Aktif"
          nilai={`${ringkasan.leadsAktif} Leads`}
          ikon={UserPlus}
          keterangan="12 leads panas siap difollow-up"
        />
        <KartuRingkasan
          label="Total Jamaah Terdaftar"
          nilai={`${ringkasan.jamaahTerdaftar} Jamaah`}
          ikon={Users2}
          keterangan="Sepanjang masa kemitraan"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Tracker Umrah Gratis */}
        <Card className="surface-luxe lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="size-5 text-primary" />
              Tracker Umrah Gratis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <p className="font-display text-4xl font-bold text-gold-gradient">
                {umrahGratis.tercapai}
                <span className="text-xl text-muted-foreground"> / {umrahGratis.target}</span>
              </p>
              <Badge variant="secondary">{persen}%</Badge>
            </div>
            <Progress value={persen} className="h-3" />
            <p className="rounded-lg border border-primary/25 bg-primary/10 p-3 text-sm">
              Kurang <span className="font-semibold text-primary">{sisaTarget} jamaah</span> lagi
              untuk mendapatkan 1 seat Umrah gratis. Semangat, {agent.panggilan}!
            </p>
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="rounded-lg bg-secondary p-3">
                <p className="font-display text-lg font-bold">4</p>
                <p className="text-muted-foreground">Jamaah bulan ini</p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="font-display text-lg font-bold">31 Des</p>
                <p className="text-muted-foreground">Batas periode</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agenda hari ini */}
        <Card className="lg:col-span-3">
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <CardTitle className="flex min-w-0 items-center gap-2 text-base">
              <CalendarClock className="size-5 text-primary" />
              Agenda &amp; Task Hari Ini
            </CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {agendaHariIni.length} tugas
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {agendaHariIni.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl border border-border bg-secondary/40 p-3 transition-colors hover:border-primary/40"
              >
                <div className="shrink-0 rounded-lg bg-primary/15 px-2.5 py-1.5 text-center">
                  <p className="font-display text-sm font-bold text-primary">{item.waktu}</p>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold">{item.judul}</p>
                    <Badge variant="outline" className="border-primary/40 text-[10px] text-primary">
                      {item.kategori}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <FileCheck2 className="size-4" /> Lihat Semua Agenda
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
