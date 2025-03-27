"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBook,
  FiFileText,
  FiTag,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { SidebarProps } from "@/types/dashboard";

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { path: "/dashboard", icon: <FiHome size={20} />, label: "Tổng quan" },
    {
      path: "/dashboard/categories",
      icon: <FiTag size={20} />,
      label: "Thể loại",
    },
    {
      path: "/dashboard/comics",
      icon: <FiBook size={20} />,
      label: "Quản lý truyện",
    },
    {
      path: "/dashboard/chapters",
      icon: <FiFileText size={20} />,
      label: "Quản lý chapter",
    },
    {
      path: "/dashboard/users",
      icon: <FiUsers size={20} />,
      label: "Người dùng",
    },
    {
      path: "/dashboard/comments",
      icon: <FiMessageSquare size={20} />,
      label: "Bình luận",
    },
    {
      path: "/dashboard/settings",
      icon: <FiSettings size={20} />,
      label: "Cài đặt",
    },
  ];

  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col border-r border-green-100 dark:bg-gray-800 dark:border-gray-700`}
    >
      <div className="p-4 flex items-center justify-between border-b border-green-100 dark:border-gray-700">
        {isSidebarOpen ? (
          <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
            Comic Admin
          </h1>
        ) : (
          <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
            CA
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-green-50 text-green-600 dark:hover:bg-gray-700 dark:text-green-400 cursor-pointer"
          aria-label={isSidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
        >
          {isSidebarOpen ? (
            <FiChevronLeft size={20} />
          ) : (
            <FiChevronRight size={20} />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center p-3 rounded-lg ${isActive(item.path)
                  ? "text-green-700 bg-green-100 font-medium dark:text-green-400 dark:bg-green-900/40"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-green-400"
                  }`}
              >
                {item.icon}
                {isSidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-green-100 dark:border-gray-700">
        <button
          className="flex items-center justify-center w-full p-2 text-rose-500 rounded-lg hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 cursor-pointer"
          aria-label="Đăng xuất"
        >
          <FiLogOut size={20} />
          {isSidebarOpen && <span className="ml-2">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}
