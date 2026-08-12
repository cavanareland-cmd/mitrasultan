import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/sultan-haramain-logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk Mitra — Sultan Haramain Gresik" },
      {
        name: "description",
        content:
          "Halaman masuk khusus mitra agen Umrah Sultan Haramain Gresik untuk mengakses dashboard, CRM jamaah, dan CMS.",
      },
      { property: "og:title", content: "Masuk Mitra — Sultan Haramain Gresik" },
      {
        property: "og:description",
        content: "Akses dashboard kemitraan Sultan Haramain Gresik dengan akun mitra Anda.",
      },
    ],
  }),
  component: HalamanAuth,
});

const skemaMasuk = z.object({
  email: z.string().trim().email({ message: "Format email tidak valid" }).max(255),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }).max(72),
});

const skemaDaftar = skemaMasuk.extend({
  nama: z.string().trim().min(2, { message: "Nama minimal 2 karakter" }).max(100),
  kota: z.string().trim().max(100),
  telepon: z.string().trim().max(30),
});

function HalamanAuth() {
  const navigate = useNavigate();
  const [memuat, setMemuat] = useState(false);
  const [cekSesi, setCekSesi] = useState(true);

  // Jika sudah masuk, langsung arahkan ke dashboard.
  useEffect(() => {
    let aktif = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!aktif) return;
      if (data.session) navigate({ to: "/", replace: true });
      else setCekSesi(false);
    });
    return () => {
      aktif = false;
    };
  }, [navigate]);

  async function masuk(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const hasil = skemaMasuk.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!hasil.success) {
      toast.error(hasil.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }
    setMemuat(true);
    const { error } = await supabase.auth.signInWithPassword(hasil.data);
    setMemuat(false);
    if (error) {
      toast.error(
        error.message.includes("Invalid login")
          ? "Email atau kata sandi salah."
          : error.message,
      );
      return;
    }
    toast.success("Selamat datang kembali, Mitra!");
    navigate({ to: "/", replace: true });
  }

  async function daftar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const hasil = skemaDaftar.safeParse({
      nama: form.get("nama"),
      email: form.get("email"),
      password: form.get("password"),
      kota: form.get("kota") ?? "",
      telepon: form.get("telepon") ?? "",
    });
    if (!hasil.success) {
      toast.error(hasil.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }
    setMemuat(true);
    const { data, error } = await supabase.auth.signUp({
      email: hasil.data.email,
      password: hasil.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          nama: hasil.data.nama,
          kota: hasil.data.kota,
          telepon: hasil.data.telepon,
        },
      },
    });
    setMemuat(false);
    if (error) {
      toast.error(
        error.message.includes("already registered")
          ? "Email ini sudah terdaftar. Silakan masuk."
          : error.message,
      );
      return;
    }
    if (data.session) {
      toast.success("Akun mitra berhasil dibuat!");
      navigate({ to: "/", replace: true });
    } else {
      toast.success("Cek email Anda untuk konfirmasi pendaftaran.");
    }
  }

  if (cekSesi) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <img src={logo} alt="Logo Sultan Haramain" className="mx-auto h-20 w-auto" />
          <h1 className="mt-4 font-display text-2xl font-bold text-gold-gradient">
            Portal Mitra Sultan Haramain
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk untuk mengakses dashboard, data jamaah, dan CMS kemitraan.
          </p>
        </div>

        <Card className="surface-luxe">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-5 text-primary" /> Akses Terbatas Mitra
            </CardTitle>
            <CardDescription>Gunakan akun mitra resmi yang terdaftar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="masuk">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="masuk">Masuk</TabsTrigger>
                <TabsTrigger value="daftar">Daftar Mitra</TabsTrigger>
              </TabsList>

              <TabsContent value="masuk" className="mt-4">
                <form onSubmit={masuk} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email-masuk">Email</Label>
                    <Input id="email-masuk" name="email" type="email" required maxLength={255} placeholder="mitra@email.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pass-masuk">Kata Sandi</Label>
                    <Input id="pass-masuk" name="password" type="password" required maxLength={72} placeholder="••••••••" />
                  </div>
                  <Button type="submit" className="w-full" disabled={memuat}>
                    {memuat ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
                    Masuk Dashboard
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="daftar" className="mt-4">
                <form onSubmit={daftar} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input id="nama" name="nama" required maxLength={100} placeholder="Ahmad Rifai" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="kota">Kota</Label>
                      <Input id="kota" name="kota" maxLength={100} placeholder="Gresik" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="telepon">No. WhatsApp</Label>
                      <Input id="telepon" name="telepon" maxLength={30} placeholder="0812xxxxxxx" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email-daftar">Email</Label>
                    <Input id="email-daftar" name="email" type="email" required maxLength={255} placeholder="mitra@email.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pass-daftar">Kata Sandi</Label>
                    <Input id="pass-daftar" name="password" type="password" required minLength={6} maxLength={72} placeholder="Minimal 6 karakter" />
                  </div>
                  <Button type="submit" className="w-full" disabled={memuat}>
                    {memuat && <Loader2 className="size-4 animate-spin" />}
                    Buat Akun Mitra
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
