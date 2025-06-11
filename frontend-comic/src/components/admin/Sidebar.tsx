"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBook,
  FiFileText,
  FiTag,
  FiUsers,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
  FiPackage,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";

export interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isPublisher: boolean;
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
  isPublisher,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      icon: <FiHome size={20} />,
      label: "Tổng quan",
    },
    {
      path: "/admin/categories",
      icon: <FiTag size={20} />,
      label: "Quản lý thể loại",
    },
    {
      path: "/admin/comics",
      icon: <FiBook size={20} />,
      label: "Quản lý truyện",
      show: isPublisher
    },
    {
      path: "/admin/chapters",
      icon: <FiFileText size={20} />,
      label: "Quản lý chương",
      show: isPublisher
    },
    {
      path: "/admin/vip-packages",
      icon: <FiPackage size={20} />,
      label: "Quản lý gói VIP",
    },
    {
      path: "/admin/levels",
      icon: <FiAward size={20} />,
      label: "Quản lý cấp độ",
    },
    {
      path: "/admin/users",
      icon: <FiUsers size={20} />,
      label: "Quản lý người dùng",
    },
    {
      path: "/admin/comments",
      icon: <FiMessageSquare size={20} />,
      label: "Quản lý bình luận",
    },
  ];

  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-20"
        } bg-background shadow-medium transition-all duration-300 flex flex-col border-r border-sidebar-border`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border relative">
        {isSidebarOpen ? (
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={150}
            height={100}
            className="object-cover"
            priority
          />
        ) : (
          <Image
            src="/images/icon_logo.svg"
            alt="logo"
            width={28}
            height={28}
            className="object-cover"
            priority
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-2 h-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label={isSidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
        >
          {isSidebarOpen ? (
            <FiChevronLeft size={20} />
          ) : (
            <FiChevronRight size={20} />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <ul className="space-y-2 px-3">
          {!isPublisher ?
            navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                    ? "text-sidebar-primary bg-sidebar-accent font-medium shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    }`}
                >
                  <span className={isActive(item.path) ? "text-primary" : ""}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))
            :
            navItems.map((item) => (
              <li key={item.path} className={item.show ? "block" : "hidden"}>
                <Link
                  href={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                    ? "text-sidebar-primary bg-sidebar-accent font-medium shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    }`}
                >
                  <span className={isActive(item.path) ? "text-primary" : ""}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))
          }
        </ul>
      </nav>
    </div>
  );
}
