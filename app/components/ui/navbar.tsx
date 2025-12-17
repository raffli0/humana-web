"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

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
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/employee", icon: Users },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Payroll", href: "/payroll", icon: Wallet },
  { name: "Leave Requests", href: "/leave", icon: ClipboardList },
  { name: "Recruitments", href: "/recruitment", icon: Briefcase },
];


export default function Navbar() {
  const pathname = usePathname();


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
        <div className="text-lg font-semibold tracking-tight text-white">Humana</div>

        {/* Desktop nav */}
        <Tooltip.Provider delayDuration={100}>
          <div className="hidden md:flex items-center gap-1 text-sm">
            {navItems.map((item) => {
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


        {/* Profile */}
        {/* <div className="hidden md:flex items-end justify-end">
          <button className="flex items-center gap-2 rounded-full bg-slate-900/70 px-2 py-1 ring-1 ring-slate-800 hover:ring-slate-700 transition cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://avatars.githubusercontent.com/u/1" />
              <AvatarFallback>PR</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col text-left text-xs lg:flex">
              <span className="font-semibold leading-tight text-white">
                Pristia Candra
              </span>
              <span className="text-[11px] text-slate-400">
                pristia@pickhub.com
              </span>
            </div>
            <ChevronDown className="ml-1 h-3 w-3 text-slate-400" />
          </button> */}

        <div className="hidden md:flex justify-end">
          <ProfileDropdown
            name="Pristia Candra"
            email="pristia@pickhub.com"
            avatarUrl="https://avatars.githubusercontent.com/u/1"
            onProfile={() => console.log("Profile")}
            onSettings={() => console.log("Settings")}
            onLogout={() => console.log("Logout")}
          />
        </div>

        {/* </div> */}

      </nav>
    </header>
  );
}
