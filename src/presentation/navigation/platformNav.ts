import {
    LayoutDashboard,
    Building2,
    BarChart3,
    Cloud,
    Settings,
    Shield,
} from "lucide-react";

export const platformNav = [
    { name: "Dashboard", href: "/platform/dashboard", icon: LayoutDashboard },
    { name: "Companies", href: "/platform/companies", icon: Building2 },
    { name: "Analytics", href: "/platform/analytics", icon: BarChart3 },
    { name: "Infrastructure", href: "/platform/infrastructure", icon: Cloud },
    { name: "System Settings", href: "/platform/settings", icon: Settings },
    { name: "Admin Roles", href: "/platform/admin-roles", icon: Shield },
];
