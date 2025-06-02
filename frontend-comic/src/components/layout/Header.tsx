"use client";

import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  FiSearch,
  FiUser,
  FiBookmark,
  FiHeart,
  FiLogOut,
  FiX,
  FiSettings
} from "react-icons/fi";
import { useState } from "react";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import { useAuthModals } from "@/hooks/useAuthModals";
import { useAuthState } from "@/hooks/useAuthState";

export default function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, isAuthenticated, logout, isAdmin } = useAuthState();

  // Auth modals
  const {
    isLoginOpen,
    isRegisterOpen,
    openLogin,
    openRegister,
    closeAll,
    switchToRegister,
    switchToLogin,
  } = useAuthModals();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search logic here
      console.log("Searching for:", searchQuery);
    }
  };

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
              className="rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-primary-foreground" />
            </div>
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <FiUser className="w-6 h-6 text-primary-foreground" />
            </div>
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
          <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium">Hồ sơ cá nhân</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/bookmarks" className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FiBookmark className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-medium">Truyện đã lưu</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/favorites" className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FiHeart className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="font-medium">Yêu thích</span>
          </Link>
        </DropdownMenuItem>

        {/* Menu Admin - chỉ hiển thị cho ADMIN */}
        {isAdmin() && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FiSettings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">Quản lý Admin</span>
            </Link>
          </DropdownMenuItem>
        )}

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
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
              >
                <Image
                  src="/images/logo.svg"
                  alt="Comic Logo"
                  width={160}
                  height={32}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full group">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''
                  }`}>
                  <Input
                    type="search"
                    placeholder="Tìm kiếm truyện, tác giả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`pl-12 pr-4 py-2 w-full border-2 transition-all duration-300 ${isSearchFocused
                      ? 'border-primary shadow-lg shadow-primary/20'
                      : 'border-border hover:border-primary/50'
                      }`}
                  />
                  <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isSearchFocused ? 'text-primary scale-110' : 'text-muted-foreground'
                    } w-4 h-4`} />

                  {/* Search suggestions - có thể implement sau */}
                  {isSearchFocused && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50">
                      <div className="p-2 text-sm text-muted-foreground">
                        Nhấn Enter để tìm kiếm &quot;{searchQuery}&quot;
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Mobile search toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                aria-label="Toggle search"
              >
                <FiSearch className="w-4 h-4" />
              </Button>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Auth section */}
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                    onClick={openLogin}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={openRegister}
                  >
                    <span className="hidden sm:inline">Đăng ký</span>
                    <span className="sm:hidden">
                      <FiUser className="w-4 h-4" />
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          {isMobileSearchOpen && (
            <div className="md:hidden pb-3 border-t border-border mt-3 pt-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm truyện, tác giả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 w-full border-2 border-border focus:border-primary"
                  autoFocus
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeAll}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeAll}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}
