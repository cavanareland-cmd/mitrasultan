import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Crown, LogOut } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { agent } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";

function inisial(nama: string) {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0]?.toUpperCase() ?? "")
    .join("");
}

/** Bar atas: tombol sidebar, notifikasi, profil mitra yang sedang masuk, dan tombol keluar. */
export function TopBar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nama, setNama] = useState(agent.panggilan);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let aktif = true;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!aktif || !user) return;
      setEmail(user.email ?? "");
      const { data: profil } = await supabase
        .from("profiles")
        .select("nama")
        .eq("id", user.id)
        .maybeSingle();
      if (aktif && profil?.nama) setNama(profil.nama);
    })();
    return () => {
      aktif = false;
    };
  }, []);

  async function keluar() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="flex items-center justify-between px-3 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="shrink-0" />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifikasi" className="relative">
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
          </Button>

          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-card py-1 pr-3 pl-1">
            <Avatar className="size-8 border border-primary/40">
              <AvatarFallback className="bg-secondary text-xs font-semibold text-primary">
                {inisial(nama) || "MT"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold">{nama}</p>
              <p className="max-w-[140px] truncate text-[10px] text-muted-foreground">
                {email || agent.id}
              </p>
            </div>
            <Badge className="ml-1 gap-1 bg-primary text-primary-foreground">
              <Crown className="size-3.5" />
              <span className="hidden sm:inline">{agent.tier}</span>
            </Badge>
          </div>

          <Button variant="ghost" size="icon" aria-label="Keluar" onClick={keluar}>
            <LogOut className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
