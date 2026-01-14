"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/client";

import { cn } from "../ui/utils";

import * as Tooltip from "@radix-ui/react-tooltip";

import { ProfileDropdown } from "./profile-dropdown";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Wallet,
  CalendarCheck,
  Briefcase,
  Building2,
  BarChart3,
  Cloud,
  Shield,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/company/employee", icon: Users },
  { name: "Attendance", href: "/company/attendance", icon: CalendarCheck },
  { name: "Payroll", href: "/company/payroll", icon: Wallet },
  { name: "Leave Requests", href: "/company/leave", icon: ClipboardList },
  { name: "Recruitments", href: "/company/recruitment", icon: Briefcase },
];

const platformNavItems = [
  { name: "Dashboard", href: "/platform/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/platform/companies", icon: Building2 },
  { name: "Analytics", href: "/platform/analytics", icon: BarChart3 },
  { name: "Infrastructure", href: "/platform/infrastructure", icon: Cloud },
  { name: "System Settings", href: "/platform/settings", icon: Settings },
  { name: "Admin Roles", href: "/platform/admin-roles", icon: Shield },
];


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null }>({
    full_name: "",
    email: "",
  });

  const isPlatform = pathname.startsWith("/platform");

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile({
            full_name: data.full_name || user.email?.split("@")[0] || "User",
            email: data.email || user.email || "",
          });
        }
      }
    }
    fetchProfile();
  }, []);

  // Hide Navbar on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }



  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-[#0C212F] border-white-10",
        // scrolled
        //   ? "bg-[#0C212F]/80 border-white/10"   // saat scroll
        //   : "bg-[#0C212F]/70 border-white/5"    // not scrolled
      )}
    >
      <nav className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4">

        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 font-semibold text-xl">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-white font-semibold">Humana</span>
          </div>
        </div>

        {/* Desktop nav */}
        <Tooltip.Provider delayDuration={100}>
          <div className="hidden md:flex items-center gap-1 text-sm">
            {(isPlatform ? platformNavItems : navItems).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Tooltip.Root key={item.href}>
                  <Tooltip.Trigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center gap-2",
                        "h-10 px-3 rounded-full transition-all cursor-pointer select-none",
                        "hover:bg-white/10 hover:text-white",
                        active ? "bg-white text-black font-semibold" : "text-white/60"
                      )}
                    >
                      <Icon className="w-5 h-5 translate-y-[0.5px]" />

                      {/* Label hanya saat active */}
                      {active && (
                        <span className="animate-in fade-in duration-150">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </Tooltip.Trigger>

                  {/* Tooltip hanya muncul kalau tidak active */}
                  {!active && (
                    <Tooltip.Content
                      side="bottom"
                      className="px-3 py-1.5 rounded-md bg-slate-800 text-white text-xs shadow-lg"
                    >
                      {item.name}
                      <Tooltip.Arrow className="fill-slate-800" />
                    </Tooltip.Content>
                  )}
                </Tooltip.Root>
              );
            })}
          </div>
        </Tooltip.Provider>

        <div className="hidden md:flex justify-end">
          <ProfileDropdown
            name={profile.full_name || "User"}
            email={profile.email || ""}
            avatarUrl="https://avatars.githubusercontent.com/u/1"
            onProfile={() => console.log("Profile")}
            onSettings={() => router.push(isPlatform ? "/platform/settings" : "/company/settings")}
            onLogout={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
          />
        </div>

      </nav>
    </header>
  );
}
