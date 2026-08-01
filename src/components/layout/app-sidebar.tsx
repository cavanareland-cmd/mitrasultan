import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Filter,
  Map,
  GraduationCap,
  Network,
  Wallet,
  Trophy,
  MoonStar,
  Calculator,
} from "lucide-react";
import logoAsset from "@/assets/sultan-haramain-logo.png.asset.json";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { agent } from "@/lib/data";

/** Menu utama dashboard mitra. */
const menuUtama = [
  { judul: "Dashboard", url: "/", icon: LayoutDashboard },
  { judul: "CMS Mitra", url: "/cms", icon: DatabaseZap },
  { judul: "Manajemen Jamaah", url: "/jamaah", icon: Users },
  { judul: "Segmentasi Jamaah", url: "/segmentasi", icon: Filter },
  { judul: "Peta Teritorial", url: "/teritorial", icon: Map },
  { judul: "Akademi Kemitraan", url: "/akademi", icon: GraduationCap },
  { judul: "Jaringan Kemitraan", url: "/jaringan", icon: Network },
] as const;

const menuPendukung = [
  { judul: "Dompet & Profil", url: "/dompet", icon: Wallet },
  { judul: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { judul: "Alat Muslim Harian", url: "/muslim", icon: MoonStar },
  { judul: "Alat & Simulasi", url: "/alat", icon: Calculator },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-1 py-2">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-secondary/60 p-1">
            <img
              src={logoAsset.url}
              alt="Logo Sultan Haramain"
              className="size-full object-contain"
            />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-display text-base leading-tight font-semibold text-gold-gradient">
              Sultan Haramain
            </p>
            <p className="truncate text-[11px] text-muted-foreground">Mitra Center Gresik</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuUtama.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.judul}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.judul}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pendukung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuPendukung.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.judul}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.judul}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-1 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          ID Mitra: <span className="text-primary">{agent.id}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
