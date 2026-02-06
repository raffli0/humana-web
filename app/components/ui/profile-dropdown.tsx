"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from "./dropdown-menu";
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import NextImage from "next/image";
import { Avatar, AvatarFallback } from "./avatar";
import { cn } from "./utils";

interface ProfileDropdownProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

export function ProfileDropdown({
  name,
  email,
  avatarUrl,
  onProfile,
  onSettings,
  onLogout,
}: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full px-2 py-1",
            "bg-slate-900/70 ring-1 ring-slate-800",
            "hover:ring-slate-700 transition",
            "focus:outline-none focus-visible:ring-2",
            "cursor-pointer"
          )}
        >
          <Avatar className="h-8 w-8 overflow-hidden">
            {avatarUrl ? (
              <NextImage
                src={avatarUrl}
                alt={name}
                width={32}
                height={32}
                className="aspect-square size-full object-cover"
              />
            ) : (
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="hidden lg:flex flex-col text-left text-xs">
            <span className="font-semibold leading-tight text-white">
              {name}
            </span>
            <span className="text-[11px] text-slate-400">
              {email}
            </span>
          </div>

          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[9999] min-w-[220px] bg-slate-900 border-slate-800 text-slate-100"
      >
        {/* User Info */}
        <div className="px-3 py-2 border-b border-slate-800 mb-1">
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-slate-400">{email}</p>
        </div>

        <DropdownMenuItem
          onSelect={onProfile}
          className="cursor-pointer focus:bg-slate-800 focus:text-white gap-2"
        >
          <User className="w-4 h-4" />
          Profil
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={onSettings}
          className="cursor-pointer focus:bg-slate-800 focus:text-white gap-2"
        >
          <Settings className="w-4 h-4" />
          Pengaturan
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-800" />

        <DropdownMenuItem
          onSelect={onLogout}
          className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
