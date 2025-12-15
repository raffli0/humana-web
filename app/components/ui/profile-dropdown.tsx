"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full px-2 py-1",
            "bg-slate-900/70 ring-1 ring-slate-800",
            "hover:ring-slate-700 transition",
            "focus:outline-none focus-visible:ring-2",
            "cursor-pointer"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
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
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[220px] rounded-xl border border-slate-800",
            "bg-slate-900 text-slate-100 shadow-xl p-1",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in data-[state=closed]:fade-out",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
          )}
        >
          {/* User Info */}
          <div className="px-3 py-2 border-b border-slate-800">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-slate-400">{email}</p>
          </div>

          <DropdownMenu.Item
            onClick={onProfile}
            className="dropdown-item"
          >
            <User className="w-4 h-4" />
            Profile
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={onSettings}
            className="dropdown-item"
          >
            <Settings className="w-4 h-4" />
            Settings
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />

          <DropdownMenu.Item
            onClick={onLogout}
            className="dropdown-item text-red-400 focus:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
