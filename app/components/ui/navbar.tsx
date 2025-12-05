"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../ui/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown, Menu, X } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Employees", href: "/employee" },
  { name: "Attendance", href: "/attendance" },
  { name: "Payroll", href: "/" },
  { name: "Leave Requests", href: "/leave" },
  { name: "Recruitments", href: "/recruitment" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md border-b border-white/10 transition-colors duration-300",
        scrolled
          ? "bg-slate-950/80"
          : "bg-slate-950/20"
      )}
    >
      <nav className="flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="text-lg font-semibold tracking-tight text-white">Humana</div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-white/90",
                pathname === item.href
                  ? "font-semibold text-white"
                  : "text-white/70"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Profile */}
        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-full bg-slate-900/70 px-2 py-1 ring-1 ring-slate-800 hover:ring-slate-700 transition">
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
          </button>
        </div>

      </nav>
    </header>
  );
}
