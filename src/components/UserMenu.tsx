"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, LayoutDashboard, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function UserMenu() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const email = user.email || "User";
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = email.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 border border-white/10 shadow-lg transition-transform hover:scale-105">
          <AvatarImage src={avatarUrl} alt={email} />
          <AvatarFallback className="bg-sky-500 font-bold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2 glass border-white/10 animate-in fade-in zoom-in duration-200">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">Account</p>
            <p className="text-xs leading-none text-slate-500 dark:text-gray-400 truncate">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem asChild className="focus:bg-sky-500/10 focus:text-sky-500 cursor-pointer">
          <Link href="/profile" className="flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="focus:bg-sky-500/10 focus:text-sky-500 cursor-pointer">
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="focus:bg-sky-500/10 focus:text-sky-500 cursor-pointer">
          <Link href="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="flex items-center gap-2 text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
