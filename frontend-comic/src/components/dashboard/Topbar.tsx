"use client";

import Image from "next/image";
import { FiBell } from "react-icons/fi";

export interface TopbarProps {
  title: string;
  isSidebarOpen: boolean;
}

export default function Topbar({ title, isSidebarOpen }: TopbarProps) {

  return (
    <header className={`bg-white shadow-sm z-10 border-b border-green-100 dark:bg-gray-800 dark:border-gray-700`}>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-full bg-green-50 hover:bg-green-100 text-green-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-green-400 cursor-pointer"
            aria-label="Thông báo"
          >
            <FiBell size={20} />
          </button>
          <div className="flex items-center">
            <Image
              src="https://placehold.co/100x100/4ade80/fff?text=Admin"
              alt="Admin"
              width={36}
              height={36}
              className="rounded-full border-2 border-green-400 dark:border-green-500"
            />
            {isSidebarOpen && (
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Admin
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  admin@comicweb.vn
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
