import { Bell, Crown } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { agent } from "@/lib/data";

/** Bar atas: tombol sidebar, notifikasi, profil agen, dan ikon mahkota tier leaderboard. */
export function TopBar() {
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
                AR
              </AvatarFallback>
            </Avatar>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold">{agent.panggilan}</p>
              <p className="text-[10px] text-muted-foreground">{agent.id}</p>
            </div>
            <Badge className="ml-1 gap-1 bg-primary text-primary-foreground">
              <Crown className="size-3.5" />
              <span className="hidden sm:inline">{agent.tier}</span>
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
