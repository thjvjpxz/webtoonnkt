"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  FiSearch,
  FiUser,
  FiSettings,
  FiBookmark,
  FiHeart,
  FiLogOut,
  FiX
} from "react-icons/fi";
import { useState } from "react";

export default function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user state - thay thế bằng real auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "Người dùng", avatar: null });

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
          size="sm"
          className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FiUser className="w-4 h-4 text-primary" />
          </div>
          <span className="hidden sm:block font-medium">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
            <FiUser className="w-4 h-4" />
            <span>Hồ sơ cá nhân</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/bookmarks" className="flex items-center gap-2 cursor-pointer">
            <FiBookmark className="w-4 h-4" />
            <span>Truyện đã lưu</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="flex items-center gap-2 cursor-pointer">
            <FiHeart className="w-4 h-4" />
            <span>Yêu thích</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
            <FiSettings className="w-4 h-4" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
          onClick={() => setIsLoggedIn(false)}
        >
          <FiLogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
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
                      Nhấn Enter để tìm kiếm "{searchQuery}"
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
            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  onClick={() => setIsLoggedIn(true)} // Mock login
                >
                  Đăng nhập
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => setIsLoggedIn(true)} // Mock signup
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
  );
}
