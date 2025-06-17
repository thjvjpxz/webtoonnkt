"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  FiGrid,
  FiMenu,
  FiX,
  FiStar,
  FiCreditCard,
  FiEdit,
} from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import PublisherRequestModal from "../profile/PublisherRequestModal";
import { useAuthState } from "@/hooks/useAuthState";

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
    href: "/category",
    icon: <FiGrid className="w-4 h-4" />,
  },
  {
    label: "Mua VIP",
    href: "/vip-purchase",
    icon: <FiStar className="w-4 h-4" />,
  },
  {
    label: "Nạp tiền",
    href: "/payment",
    icon: <FiCreditCard className="w-4 h-4" />,
  },
];

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPublisherModal, setShowPublisherModal] = useState(false);
  const { isAuthenticated, isReader } = useAuthState();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
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
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between py-2">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>

          {/* Publisher Request Button */}
          {isAuthenticated && isReader() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPublisherModal(true)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/30"
            >
              <FiEdit className="w-4 h-4 mr-2" />
              Trở thành nhà xuất bản
            </Button>
          )}
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

              {/* Publisher Request Button for Mobile */}
              {isAuthenticated && isReader() && (
                <li className="pt-2 border-t border-primary-foreground/10">
                  <button
                    onClick={() => {
                      setShowPublisherModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-lg transition-all duration-200 font-medium w-full text-left"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Trở thành nhà xuất bản</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Publisher Request Modal */}
      <PublisherRequestModal
        isOpen={showPublisherModal}
        onClose={() => setShowPublisherModal(false)}
      />
    </nav>
  );
}
