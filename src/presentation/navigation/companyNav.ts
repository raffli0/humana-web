import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Wallet,
    ClipboardList,
    Briefcase,
    Clock,
    LucideClock,
    ClockArrowUp,
    LucideAlarmClockPlus,
} from "lucide-react";

export const companyNav = [
    { name: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
    { name: "Karyawan", href: "/company/employee", icon: Users },
    { name: "Presensi", href: "/company/attendance", icon: CalendarCheck },
    { name: "Jadwal Kerja", href: "/company/shifts", icon: Clock },
    { name: "Lembur", href: "/company/overtime", icon: LucideAlarmClockPlus },
    { name: "Penggajian", href: "/company/payroll", icon: Wallet },
    { name: "Pengajuan Cuti", href: "/company/leave", icon: ClipboardList },
    { name: "Rekrutmen", href: "/company/recruitment", icon: Briefcase },
];
