import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Wallet,
    ClipboardList,
    Briefcase,
    Clock,
} from "lucide-react";

export const companyNav = [
    { name: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
    { name: "Employees", href: "/company/employee", icon: Users },
    { name: "Attendance", href: "/company/attendance", icon: CalendarCheck },
    { name: "Shifts", href: "/company/shifts", icon: Clock },
    { name: "Payroll", href: "/company/payroll", icon: Wallet },
    { name: "Leave Requests", href: "/company/leave", icon: ClipboardList },
    { name: "Recruitments", href: "/company/recruitment", icon: Briefcase },
];
