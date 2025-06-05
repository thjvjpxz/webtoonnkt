"use client";

import Image from "next/image";
import { FiBell, FiHome, FiLogOut } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthState } from "@/hooks/useAuthState";
import Link from "next/link";

export type TopbarProps = {
  title: string;
};

export default function Topbar({ title }: TopbarProps) {

  const { user, logout } = useAuthState();

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-accent/50 transition-all duration-200 select-none"
        >
          {user?.imgUrl ? (
            <Image
              src={user.imgUrl}
              alt={user.username}
              fill
              sizes="36px"
              className="rounded-full border-2 border-primary/20 h-[36px] w-[36px] object-cover"
            />
          ) : (
            <Image
              src="https://placehold.co/100x100/05df72/fff?text=Admin"
              alt="Admin"
              fill
              sizes="36px"
              className="rounded-full border-2 border-primary/20 h-[36px] w-[36px] object-cover"
            />
          )}
          {user?.vip && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">★</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 p-2 data-[side=bottom]:slide-in-from-top-2"
        align="end"
        forceMount
      >
        {/* User Info Header */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 mb-2">
          {user?.imgUrl ? (
            <Image
              src={user.imgUrl}
              alt={user.username}
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-primary/20 h-[48px] w-[48px]"
            />
          ) : (
            <Image
              src="https://placehold.co/100x100/05df72/fff?text=Admin"
              alt="Admin"
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-primary/20 h-[48px] w-[48px]"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {user?.username || 'Admin'}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                Quản trị viên
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link href="/" className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiHome className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium">Về trang chính</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
          onClick={logout}
        >
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
            <FiLogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <span className="font-medium text-red-600 dark:text-red-400">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="bg-background shadow-soft border-b border-border backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-foreground">
            {title}
          </h2>
        </div>

        <div className="flex items-center space-x-4 select-none">
          {/* Toggle Change Theme */}
          <ThemeToggle />

          {/* User Profile Menu */}
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
