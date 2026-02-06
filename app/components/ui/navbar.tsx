"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/src/infrastructure/auth/authService";
import { companyNav as navItems } from "@/src/presentation/navigation/companyNav";
import { platformNav as platformNavItems } from "@/src/presentation/navigation/platformNav";
import { Profile } from "@/src/domain/employee/profile";
import { cn } from "../ui/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ProfileDropdown } from "./profile-dropdown";


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);

  const isPlatform = pathname.startsWith("/platform");

  useEffect(() => {
    async function fetchProfile() {
      const profile = await authService.getCurrentProfile();
      if (profile) {
        setProfile(profile);
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
            name={profile?.full_name || "User"}
            email={profile?.email || ""}
            avatarUrl={profile?.avatar_url || "https://avatars.githubusercontent.com/u/1"}
            onProfile={() => router.push(isPlatform ? "/platform/profile" : "/company/profile")}
            onSettings={() => router.push(isPlatform ? "/platform/settings" : "/company/settings")}
            onLogout={async () => {
              await authService.signOut();
              router.push("/login");
            }}
          />
        </div>

      </nav>
    </header>
  );
}
