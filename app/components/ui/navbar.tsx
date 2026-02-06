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


import { shiftRepository } from '@/src/infrastructure/supabase/SupabaseShiftRepository';
import { Logo } from "./logo";
import { overtimeRepository } from "@/src/infrastructure/supabase/SupabaseOvertimeRepository";
import { leaveRepository } from "@/src/infrastructure/supabase/SupabaseLeaveRepository";
import { recruitmentRepository } from "@/src/infrastructure/supabase/SupabaseRecruitmentRepository";
import { payrollRepository } from "@/src/infrastructure/supabase/SupabasePayrollRepository";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [notificationCounts, setNotificationCounts] = useState({
    shifts: 0,
    overtime: 0,
    leave: 0,
    recruitment: 0,
    payroll: 0,
    employees: 0,
    dashboard: 0,
    attendance: 0
  });

  const isPlatform = pathname.startsWith("/platform");

  useEffect(() => {
    async function fetchData() {
      const profile = await authService.getCurrentProfile();
      if (profile) {
        setProfile(profile);

        // Check for pending notifications if in company mode
        if (!pathname.startsWith("/platform") && profile.company_id) {
          try {
            const [swaps, overtime, leave, candidates, payslips] = await Promise.all([
              shiftRepository.getShiftSwaps(profile.company_id),
              overtimeRepository.getOvertimeRequests(profile.company_id),
              leaveRepository.getLeaveRequestsByCompany(profile.company_id),
              recruitmentRepository.getCandidatesByCompany(profile.company_id),
              payrollRepository.getPayslipsByCompany(profile.company_id)
            ]);

            setNotificationCounts({
              shifts: swaps.filter(s => s.status === 'pending').length,
              overtime: overtime.filter(r => r.status === 'pending').length,
              leave: leave.filter(l => l.status === 'Pending' || l.status === 'pending').length,
              recruitment: candidates.filter(c => c.status === 'New' || c.status === 'new' || c.status === 'Applied' || c.status === 'applied').length,
              payroll: payslips.filter(p => p.status === 'Draft' || p.status === 'Pending' || p.status === 'draft' || p.status === 'pending').length,
              employees: 0,
              dashboard: 0,
              attendance: 0
            });
          } catch (error) {
            console.error("Failed to check notifications:", error);
          }
        }
      }
    }
    fetchData();
  }, [pathname]);

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
          <Link href="/company/dashboard" className="flex items-center gap-2">
            <Logo className="text-white scale-75 origin-left" textClassName="text-white" />
          </Link>
        </div>

        {/* Desktop nav */}
        <Tooltip.Provider delayDuration={100}>
          <div className="hidden md:flex items-center gap-1 text-sm">
            {(isPlatform ? platformNavItems : navItems).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              let badgeCount = 0;
              if (!isPlatform) {
                if (item.href === "/company/shifts") badgeCount = notificationCounts.shifts;
                if (item.href === "/company/overtime") badgeCount = notificationCounts.overtime;
                if (item.href === "/company/leave") badgeCount = notificationCounts.leave;
                if (item.href === "/company/recruitment") badgeCount = notificationCounts.recruitment;
                if (item.href === "/company/payroll") badgeCount = notificationCounts.payroll;
              }

              return (
                <Tooltip.Root key={item.href}>
                  <Tooltip.Trigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center justify-center gap-2",
                        "h-10 px-3 rounded-full transition-all cursor-pointer select-none",
                        "hover:bg-white/10 hover:text-white",
                        active ? "bg-white text-black font-semibold" : "text-white/60"
                      )}
                    >
                      <Icon className="w-5 h-5 translate-y-[0.5px]" />

                      {/* Notification Badge */}
                      {badgeCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-[#0C212F] items-center justify-center text-[9px] font-bold text-white">
                            {badgeCount > 99 ? '99+' : badgeCount}
                          </span>
                        </span>
                      )}

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
