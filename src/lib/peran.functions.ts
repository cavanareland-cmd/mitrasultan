import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PeranApp = "admin" | "mitra";

export type PenggunaRow = {
  id: string;
  email: string;
  nama: string;
  kota: string;
  telepon: string;
  peran: PeranApp[];
  emailTerkonfirmasi: boolean;
  dibuatPada: string;
  masukTerakhir: string | null;
};

async function pastikanAdmin(supabase: {
  from: (t: string) => any;
}, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Hanya admin yang boleh mengelola peran pengguna.");
}

export const daftarPengguna = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PenggunaRow[]> => {
    await pastikanAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (authError) throw new Error(authError.message);

    const [{ data: peranData, error: peranError }, { data: profilData, error: profilError }] =
      await Promise.all([
        supabaseAdmin.from("user_roles").select("user_id, role"),
        supabaseAdmin.from("profiles").select("id, nama, kota, telepon"),
      ]);
    if (peranError) throw new Error(peranError.message);
    if (profilError) throw new Error(profilError.message);

    const petaProfil = new Map((profilData ?? []).map((p) => [p.id, p]));
    const petaPeran = new Map<string, PeranApp[]>();
    for (const r of peranData ?? []) {
      const list = petaPeran.get(r.user_id) ?? [];
      list.push(r.role as PeranApp);
      petaPeran.set(r.user_id, list);
    }

    return authData.users.map((u) => {
      const profil = petaProfil.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "",
        nama: profil?.nama ?? "",
        kota: profil?.kota ?? "",
        telepon: profil?.telepon ?? "",
        peran: petaPeran.get(u.id) ?? [],
        emailTerkonfirmasi: Boolean(u.email_confirmed_at),
        dibuatPada: u.created_at,
        masukTerakhir: u.last_sign_in_at ?? null,
      };
    });
  });

export const ubahPeranPengguna = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({ userId: z.string().uuid(), peran: z.enum(["admin", "mitra"]) })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    await pastikanAdmin(context.supabase as never, context.userId);
    if (data.userId === context.userId && data.peran !== "admin") {
      throw new Error("Anda tidak bisa menurunkan peran akun sendiri.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: hapusError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId);
    if (hapusError) throw new Error(hapusError.message);

    const { error: tambahError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.peran });
    if (tambahError) throw new Error(tambahError.message);

    return { ok: true as const };
  });
