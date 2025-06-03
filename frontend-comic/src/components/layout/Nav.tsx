"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FiClock, FiCheck, FiTrendingUp, FiHome, FiChevronDown } from "react-icons/fi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Trang chủ",
    href: "/",
    icon: <FiHome className="w-4 h-4" />,
  },
  {
    label: "Thể loại",
    href: "/categories",
    icon: <FiGrid className="w-4 h-4" />,
    isDropdown: true,
    dropdownItems: [
      { label: "Hành động", href: "/categories/action" },
      { label: "Lãng mạn", href: "/categories/romance" },
      { label: "Kinh dị", href: "/categories/horror" },
      { label: "Hài hước", href: "/categories/comedy" },
      { label: "Phiêu lưu", href: "/categories/adventure" },
      { label: "Học đường", href: "/categories/school" },
    ],
  },
  {
    label: "Truyện hot",
    href: "/hot",
    icon: <FiTrendingUp className="w-4 h-4" />,
  },
  {
    label: "Truyện mới cập nhật",
    href: "/new",
    icon: <FiClock className="w-4 h-4" />,
  },
  {
    label: "Đã hoàn thành",
    href: "/completed",
    icon: <FiCheck className="w-4 h-4" />,
  },
];

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    if (item.isDropdown && item.dropdownItems) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all duration-200 px-3 py-2 rounded-lg group"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              <FiChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 mt-2 bg-background border border-border shadow-lg rounded-lg"
          >
            {item.dropdownItems.map((dropdownItem) => (
              <DropdownMenuItem key={dropdownItem.href} asChild>
                <Link
                  href={dropdownItem.href}
                  className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 cursor-pointer"
                >
                  {dropdownItem.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Link
        href={item.href}
        className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all duration-200 px-3 py-2 rounded-lg font-medium group"
      >
        <span className="transition-transform duration-200 group-hover:scale-110">
          {item.icon}
        </span>
        <span className="text-sm">{item.label}</span>
      </Link>
    );
  }

  return (
    <nav className="bg-primary text-primary-foreground border-b border-primary-foreground/10">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center py-2">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <FiGrid className="w-5 h-5" />
            <span className="font-semibold">Menu</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="text-primary-foreground hover:bg-primary-foreground/10"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-primary-foreground/10 py-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.isDropdown && item.dropdownItems ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary-foreground px-3 py-2 font-medium">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5 px-3 py-2 rounded transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="transition-transform duration-200 hover:scale-110">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
